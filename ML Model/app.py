# ================================
# Flask Backend for Forest Incident Detection (Render-ready) with Logging
# ================================

import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import torch
import torch.nn.functional as F
from torchvision import transforms, models
import geopandas as gpd
from shapely.geometry import Point
from shapely.validation import make_valid
import datetime

# ----------------------
# Logging Setup
# ----------------------
logging.basicConfig(
    level=logging.DEBUG,  # DEBUG, INFO, WARNING, ERROR, CRITICAL
    format="%(asctime)s | %(levelname)s | %(message)s",
    handlers=[
        logging.FileHandler("app_debug.log"),  # save to file
        logging.StreamHandler()  # also print to console (important for Render logs)
    ]
)

logger = logging.getLogger(__name__)

# ----------------------
# Flask App
# ----------------------
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# ----------------------
# Device
# ----------------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
logger.info(f"Using device: {device}")

# ----------------------
# Model Paths (place models in project folder)
# ----------------------
dumping_model_path = "dumping_model.pth"
cutting_model_path = "cutting_model.pth"

# ----------------------
# Transform
# ----------------------
transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])
])

# ----------------------
# Load Models
# ----------------------
def load_model(model_path):
    logger.info(f"Loading model from {model_path}")
    checkpoint = torch.load(model_path, map_location=device)
    classes = checkpoint['classes']
    model = models.resnet18(pretrained=True)
    model.fc = torch.nn.Linear(model.fc.in_features, len(classes))
    model.load_state_dict(checkpoint['model_state_dict'])
    model.to(device)
    model.eval()
    logger.info(f"Model loaded with classes: {classes}")
    return model, classes

dumping_model, dumping_classes = load_model(dumping_model_path)
cutting_model, cutting_classes = load_model(cutting_model_path)

# ----------------------
# Prediction Function
# ----------------------
def predict_image(model, classes, img, threshold=0.75):
    logger.debug("Running prediction on image")
    img = transform(img).unsqueeze(0).to(device)
    with torch.no_grad():
        outputs = model(img)
        probs = F.softmax(outputs, dim=1)
        conf, pred = torch.max(probs, 1)
    class_name = classes[pred.item()]
    confidence = conf.item()
    logger.debug(f"Prediction: {class_name} | Confidence: {confidence}")
    if class_name.lower() == "yes" and confidence < threshold:
        logger.debug("Confidence below threshold, overriding to 'no'")
        class_name = "no"
    return class_name, confidence

# ----------------------
# Mangrove Check
# ----------------------
def is_in_mangrove(lat, lon, filepath="clipped_gmw.json", buffer_km=10):
    try:
        logger.debug(f"Checking if point ({lat}, {lon}) is in mangrove")
        mangrove = gpd.read_file(filepath)
        if mangrove.empty:
            logger.warning("Mangrove shapefile is empty")
            return 0
        mangrove["geometry"] = mangrove.geometry.apply(
            lambda g: make_valid(g) if g is not None and not g.is_valid else g
        )
        mangrove = mangrove[mangrove.geometry.notnull()]
        point = gpd.GeoDataFrame(geometry=[Point(lon, lat)], crs="EPSG:4326")
        mangrove_m = mangrove.to_crs(epsg=3857)
        point_m = point.to_crs(epsg=3857)
        buffer_geom = point_m.buffer(buffer_km * 1000)
        intersects = mangrove_m.intersects(buffer_geom.iloc[0])
        result = 1 if intersects.any() else 0
        logger.debug(f"Mangrove check result: {result}")
        return result
    except Exception as e:
        logger.error(f"Error in is_in_mangrove: {e}")
        return 0

# ----------------------
# Flask Route for Prediction
# ----------------------
@app.route("/predict", methods=["POST"])
def predict():
    logger.info("Received /predict request")
    data = request.form
    lat = data.get("lat", type=float)
    lon = data.get("lon", type=float)
    
    if lat is None or lon is None:
        logger.warning("Latitude or longitude missing")
        return jsonify({"error": "Latitude and longitude required"}), 400
    
    if "image" not in request.files:
        logger.warning("No image provided")
        return jsonify({"error": "No image provided"}), 400
    
    try:
        img = Image.open(request.files["image"].stream).convert("RGB")
    except Exception as e:
        logger.error(f"Image processing error: {e}")
        return jsonify({"error": "Invalid image"}), 400

    # First: check mangrove
    mangrove_check = 1
    
    if mangrove_check == 0:
        final_pred = 0
        response = {"final_result": final_pred, "reason": "Point not in/near mangrove"}
        logger.info(f"Prediction skipped: not in mangrove | Lat: {lat}, Lon: {lon}")
    else:
        # Second: check image models
        dumping_pred, dumping_conf = predict_image(dumping_model, dumping_classes, img)
        cutting_pred, cutting_conf = predict_image(cutting_model, cutting_classes, img)
        final_pred = 1 if dumping_pred.lower() == "yes" or cutting_pred.lower() == "yes" else 0
        response = {
            "final_result": final_pred,
            "dumping": {"prediction": dumping_pred, "confidence": dumping_conf},
            "cutting": {"prediction": cutting_pred, "confidence": cutting_conf},
            "mangrove_check": mangrove_check
        }
        logger.info(f"Prediction completed | Response: {response}")

    return jsonify(response)

# ----------------------
# Run Flask (Render uses PORT env)
# ----------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    logger.info(f"Starting Flask server on port {port}")
    app.run(host="0.0.0.0", port=port)

<?php
require_once '../connection.php';
require_once '../headers.php';
require_once '../send_response.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Get form data
    $email = $_POST['email'];
    $longitude = $_POST['longitude'];
    $latitude = $_POST['latitude'];
    $type = $_POST['type'];
    $dis = $_POST['dis'];
    $ai_status = $_POST['ai_status'];


    // Handle file upload
    $photo_path = null;
    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === 0) {
        $upload_dir = '../images/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true); // create directory if not exists
        }

        $file_name = basename($_FILES['photo']['name']);
        $target_file = $upload_dir . time() . '_' . $file_name;

        if (move_uploaded_file($_FILES['photo']['tmp_name'], $target_file)) {
            $photo_path = substr($target_file, 3);  
        } else {
            echo sendResponse("error", "Failed to upload photo");
            exit;
        }
    }

    $sql = "INSERT INTO `complaints`(`email`, `images`, `longitude`, `latitude`, `type`, `dis`, `ai_status`) VALUES
     (?,?,?,?,?,?,?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        "ssssssi",
        $email,
        $photo_path,
        $longitude,
        $latitude,
        $type,
        $dis,
        $ai_status
    );

    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo sendResponse("success", "Complaint submitted successfully");
    } else {
        echo sendResponse("error", "Something went wrong");
    }

} else {
    echo sendResponse("error", "Invalid request method");
}

<?php
require_once '../headers.php';
require_once '../connection.php';
require_once '../send_response.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

// Parse and sanitize input
$data = json_decode(file_get_contents("php://input"), true);
$email = isset($data['email']) ? trim($data['email']) : null;
$otp = isset($data['otp']) ? trim($data['otp']) : null;

// Prepare and execute the SQL query
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ? AND otp = ?");
$stmt->bind_param("ss", $email, $otp);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
  $update = $conn->prepare("UPDATE users SET `ac_status` = 1 WHERE email = ?");
  $update->bind_param("s", $email);
  $update->execute();
  if ($update->affected_rows > 0) {
    sendResponse("success", "OTP verified successfully");
  } else {
    sendResponse("success", "OTP verified successfully");
  }
} else {
  sendResponse("error", "Invalid OTP");
}

?>
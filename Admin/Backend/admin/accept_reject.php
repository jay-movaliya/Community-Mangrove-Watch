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

$id = isset($data['id']) ? trim($data['id']) : null;
$status = isset($data['status']) ? trim($data['status']) : null;

// Prepare and execute the SQL query
$fetch_email=$conn->prepare("SELECT * FROM `complaints` WHERE `id`=?");
$fetch_email->bind_param("i", $id);
$fetch_email->execute();
$result=$fetch_email->get_result();
if($result->num_rows==0){
  sendResponse("error","Invalid id");
}
$check_user = $conn->prepare("UPDATE `complaints` SET `status`=? WHERE `id`=?");
$check_user->bind_param("si", $status, $id);

if ($check_user->execute()) {
    if($status=="accepted"){
      $email=$result->fetch_assoc()['email'];
      $update_point=$conn->prepare("UPDATE `users` SET `points`=`points` +10 WHERE `email`=?");
      $update_point->bind_param("s", $email);
      $update_point->execute();
    }
    
    if ($check_user->affected_rows > 0) {
        sendResponse("success", "Status updated");


    } else {
        sendResponse("error", "No rows updated (maybe invalid id or same status)");
    }
} else {
    sendResponse("error", "Query failed: " . $check_user->error);
}
?>

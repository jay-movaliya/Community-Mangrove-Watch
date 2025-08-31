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
$password = isset($data['password']) ? trim($data['password']) : null;

// Prepare and execute the SQL query
$check_user=$conn->prepare("SELECT * FROM `users` WHERE `email`=?");
$check_user->bind_param("s", $email);
$check_user->execute();
$result=$check_user->get_result();
if($result->num_rows>0){
  $user=$result->fetch_assoc();
  if($password==$user['password']){
    if($user['ac_status']==1){
      if($user['status']==1){
        sendResponse("success","Login successful");
      }else{
        sendResponse("error","Account suspended");
      }
    }else{
      sendResponse("error","Account not verified");

    }
  }else{
    sendResponse("error","Invalid credentials");
  }
}else{
  sendResponse("error","User not found");
}

?>
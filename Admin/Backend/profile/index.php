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

// Prepare and execute the SQL query
$check_user=$conn->prepare("SELECT * FROM `users` WHERE `email`=?");
$check_user->bind_param("s", $email);
$check_user->execute();
$result=$check_user->get_result();
if($result->num_rows>0){
  $user=$result->fetch_assoc();
  $fetch_complaints=$conn->prepare("SELECT * FROM `complaints` WHERE `email`=?");
  $fetch_complaints->bind_param("s", $email);
  $fetch_complaints->execute();
  $result=$fetch_complaints->get_result();
  $num_rows=$result->num_rows;
  $data=[
    "user"=>$user,
    "complaints"=>$num_rows
  ];
  sendResponse("success","User found",$data);
}else{
  sendResponse("error","User not found");
}

?>
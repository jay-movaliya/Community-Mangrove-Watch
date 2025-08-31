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

// Prepare and execute the SQL query
$check_user=$conn->prepare("SELECT * FROM `complaints`");
$check_user->execute();
$result=$check_user->get_result();
if($result->num_rows>0){
  $data=[];
  while($row=$result->fetch_assoc()){
    $fetch_point=$conn->prepare("SELECT * FROM `users` WHERE `email`=?");
    $fetch_point->bind_param("s", $row['email']);
    $fetch_point->execute();
    $fetch_result=$fetch_point->get_result();
    $user_row=$fetch_result->fetch_assoc();

    $data_row=[
      "id"=>$row['id'],
      "reporter"=>$user_row['name'],
      "email"=>$row['email'],
      "discription"=>$row['dis'],
      "status"=>$row['status'],
      "point"=>$user_row['points'],
      "image"=>$row['images'],
      "type"=>$row['type'],
      "ai_status"=>$row['ai_status'],
      "location"=>[
        "lat"=>$row['longitude'],
        "lng"=>$row['latitude']
    ],
      "date"=>DateTime::createFromFormat('Y-m-d H:i:s', $row['created_at'])->format('d-m-Y')
    ];
    $data[]=$data_row;
  }
  sendResponse("success","Data fetched successfully",$data);
}else{
  sendResponse("error","No data found");
}

?>
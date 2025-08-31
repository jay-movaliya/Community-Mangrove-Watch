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
$check_user=$conn->prepare("SELECT * FROM `complaints` WHERE `email`=? ORDER BY `id` DESC LIMIT 5");
$check_user->bind_param("s", $email);
$check_user->execute();
$result=$check_user->get_result();
if($result->num_rows>0){
    $data=[];
  while($row=$result->fetch_assoc()){
    $row_data=[
      "id"=>$row['id'],
      "email"=>$row['email'],
      "discription"=>$row['dis'],
      "status"=>$row['status'],
      "ai_status"=>$row['ai_status'],
      "image"=>$row['images'],
      "type"=>$row['type'],
      "ai_status"=>$row['ai_status'],
      "location"=>[
        "lat"=>$row['longitude'],
        "lng"=>$row['latitude']
      ],
      "date"=>DateTime::createFromFormat('Y-m-d H:i:s', $row['created_at'])->format('d-m-Y')
    ];
      $data[]=$row_data;
  }
  sendResponse("success","Complains fetched successfully",$data);
  
}else{
  sendResponse("error","Complain not found");
}

?>
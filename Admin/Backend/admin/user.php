<?php
require_once '../headers.php';
require_once '../connection.php';
require_once '../send_response.php';

// CORS Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Decode input data (if needed)
$data = json_decode(file_get_contents("php://input"), true);

// Fetch all users
$check_user = $conn->prepare("SELECT * FROM `users`");
$check_user->execute();
$result = $check_user->get_result();

if ($result->num_rows > 0) {
    $data = [];

    while ($userRow = $result->fetch_assoc()) {
        // Fetch complaints for this user
        $fetch_complaints = $conn->prepare("SELECT * FROM `complaints` WHERE `email` = ?");
        $fetch_complaints->bind_param("s", $userRow['email']);
        $fetch_complaints->execute();
        $fetch_result = $fetch_complaints->get_result();

        $num_rows = $fetch_result->num_rows;
        $num_accepted = 0;

        while ($complaintRow = $fetch_result->fetch_assoc()) {
            if ($complaintRow['status'] === 'accepted') {
                $num_accepted++;
            }
        }

        // Fallback for joinDate
        $createdAt = $userRow['created_at'] ?? null;
        $formattedJoinDate = $createdAt ? date('d-m-Y', strtotime($createdAt)) : 'N/A';

        // Prepare final user data
        $data_row = [
            "id"              => $userRow['id'],
            "name"            => $userRow['name'],
            "email"           => $userRow['email'],
            "phone"           => $userRow['phone_no'],
            "totalReports"    => $num_rows,
            "acceptedReports" => $num_accepted,
            "points"          => $userRow['points'],
            "joinDate"        => $formattedJoinDate,
            "status"          => $userRow['status']
        ];

        $data[] = $data_row;
    }

    // Send response
    sendResponse("success", "User fetched successfully", $data);
} else {
    sendResponse("error", "No data found");
}
?>

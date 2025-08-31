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
$user_query = "SELECT * FROM `users`";
$user_result = $conn->query($user_query);

if ($user_result && $user_result->num_rows > 0) {
    $response_data = [];

    while ($user = $user_result->fetch_assoc()) {
        $email = $user['email'];

        // Fetch complaint count and accepted count for the user
        $complaints_query = "SELECT 
                                COUNT(*) AS total_reports,
                                SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) AS accepted_reports
                             FROM `complaints`
                             WHERE `email` = ?";
        
        $stmt = $conn->prepare($complaints_query);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt_result = $stmt->get_result();
        $complaint_data = $stmt_result->fetch_assoc();

        // Format join date
        $joinDate = isset($user['created_at']) ? date('d-m-Y', strtotime($user['created_at'])) : 'N/A';

        // Build user data
        $user_data = [
            "id"              => $user['id'],
            "name"            => $user['name'],
            "email"           => $user['email'],
            "phone"           => $user['phone_no'],
            "totalReports"    => (int)$complaint_data['total_reports'],
            "acceptedReports" => (int)$complaint_data['accepted_reports'],
            "points"          => (int)$user['points'],
            "joinDate"        => $joinDate,
            "status"          => $user['status']
        ];

        $response_data[] = $user_data;
    }

    sendResponse("success", "Users fetched successfully", $response_data);

} else {
    sendResponse("error", "No users found");
}
?>

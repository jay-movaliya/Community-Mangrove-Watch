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
$name = isset($data['name']) ? trim($data['name']) : null;
$type = isset($data['type']) ? $data['type'] : null;
$password = isset($data['password']) ? $data['password'] : null;
$phone_no = isset($data['phone_no']) ? $data['phone_no'] : null;


//Import PHPMailer classes into the global namespace
//These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// //Load Composer's autoloader (created by composer, not included with PHPMailer)
require '../phpmailer/src/Exception.php';
require '../phpmailer/src/PHPMailer.php';
require '../phpmailer/src/SMTP.php';

//Load Composer's autoloader
// require './phpmailer/vendor/autoload.php';

//Create an instance; passing `true` enables exceptions
$mail = new PHPMailer(true);

try {
    $otp = rand(100000, 999999);
  //Server settings
  // $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
  $mail->isSMTP();                                            //Send using SMTP
  $mail->Host       = 'mail.manishkumardev.me
';                     //Set the SMTP server to send through
  $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
  $mail->Username   = 'info@manishkumardev.me';                     //SMTP username
  $mail->Password   = 'Manish@15192';                               //SMTP password
  $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
  $mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

  //Recipients
  $mail->setFrom('info@manishkumardev.me', 'Portfolio');
  $mail->addAddress($email, $name);     //Add a recipient
  $mail->addReplyTo('info@manishkumardev.me', 'Portfolio');

  //Content
  $mail->isHTML(true);                                  //Set email format to HTML
  $mail->Subject = "MangroveWatch - OTP Verification";
  $mail->Body    = '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>MangroveWatch - OTP Verification</title>
    <style>
        /* Reset styles */
        body, table, td, p, a, li, blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        table, td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        img {
            -ms-interpolation-mode: bicubic;
        }
        
        /* Base styles */
        body {
            margin: 0 !important;
            padding: 0 !important;
            background-color: #f5f5f5;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }
        
        /* Container */
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        
        /* Header */
        .header {
            background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
            padding: 30px 20px;
            text-align: center;
        }
        
        .logo {
            width: 60px;
            height: 60px;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            margin: 0 auto 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: white;
        }
        
        .header-title {
            color: #ffffff;
            font-size: 28px;
            font-weight: bold;
            margin: 0;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .header-subtitle {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            margin: 5px 0 0 0;
        }
        
        /* Main content */
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 18px;
            color: #2E7D32;
            margin-bottom: 20px;
            font-weight: 600;
        }
        
        .message {
            font-size: 16px;
            color: #666666;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        
        .phone-display {
            background-color: #E8F5E8;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 30px;
            border-left: 4px solid #4CAF50;
        }
        
        .phone-label {
            font-size: 14px;
            color: #666666;
            margin-bottom: 5px;
        }
        
        .phone-number {
            font-size: 18px;
            font-weight: bold;
            color: #2E7D32;
        }
        
        /* OTP Section */
        .otp-container {
            background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
            box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
        }
        
        .otp-label {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            margin-bottom: 15px;
            font-weight: 500;
        }
        
        .otp-code {
            background-color: #ffffff;
            color: #2E7D32;
            font-size: 36px;
            font-weight: bold;
            padding: 20px 30px;
            border-radius: 8px;
            letter-spacing: 8px;
            margin: 0 auto;
            display: inline-block;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            font-family: "Courier New", monospace;
        }
        
        .otp-note {
            color: rgba(255, 255, 255, 0.9);
            font-size: 14px;
            margin-top: 15px;
        }
        
        /* Instructions */
        .instructions {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 25px;
            margin: 30px 0;
        }
        
        .instructions-title {
            color: #2E7D32;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
        }
        
        .instructions ol {
            margin: 0;
            padding-left: 20px;
            color: #666666;
        }
        
        .instructions li {
            margin-bottom: 8px;
            line-height: 1.5;
        }
        
        /* Security warning */
        .security-warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
        }
        
        .warning-icon {
            color: #856404;
            font-size: 20px;
            margin-right: 10px;
        }
        
        .warning-title {
            color: #856404;
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 8px;
        }
        
        .warning-text {
            color: #856404;
            font-size: 14px;
            line-height: 1.5;
        }
        
        /* Expiry info */
        .expiry-info {
            background-color: #e3f2fd;
            border-left: 4px solid #2196f3;
            padding: 15px 20px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }
        
        .expiry-text {
            color: #1565c0;
            font-size: 14px;
            margin: 0;
        }
        
        /* Footer */
        .footer {
            background-color: #2E7D32;
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
        }
        
        .footer-content {
            font-size: 14px;
            line-height: 1.6;
        }
        
        .support-info {
            margin-bottom: 20px;
        }
        
        .support-email {
            color: #81C784;
            text-decoration: none;
            font-weight: 600;
        }
        
        .footer-links {
            margin: 20px 0;
        }
        
        .footer-link {
            color: #81C784;
            text-decoration: none;
            margin: 0 15px;
            font-size: 13px;
        }
        
        .copyright {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.7);
            margin-top: 20px;
        }
        
        /* Responsive */
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
            }
            
            .content {
                padding: 30px 20px !important;
            }
            
            .otp-code {
                font-size: 28px !important;
                letter-spacing: 4px !important;
                padding: 15px 20px !important;
            }
            
            .header {
                padding: 25px 15px !important;
            }
            
            .header-title {
                font-size: 24px !important;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="logo">🌱</div>
            <h1 class="header-title">MangroveWatch</h1>
            <p class="header-subtitle">Protecting Our Coastal Ecosystems</p>
        </div>
        
        <!-- Main Content -->
        <div class="content">
            <div class="greeting">Hello there!</div>
            
            <div class="message">
                Thank you for joining MangroveWatch! To complete your account verification, please use the One-Time Password (OTP) below.
            </div>
            
            <!-- Phone Number Display -->
            <div class="phone-display">
                <div class="phone-label">Verification sent to:</div>
                <div class="phone-number">'.$email.'</div>
            </div>
            
            <!-- OTP Code -->
            <div class="otp-container">
                <div class="otp-label">Your Verification Code</div>
                <div class="otp-code">'.$otp.'</div>
                <div class="otp-note">Enter this code in the MangroveWatch app</div>
            </div>
            
            <!-- Instructions -->
            <div class="instructions">
                <div class="instructions-title">📱 How to use this code:</div>
                <ol>
                    <li>Open the MangroveWatch app on your device</li>
                    <li>Navigate to the OTP verification screen</li>
                    <li>Enter the 6-digit code shown above</li>
                    <li>Tap "Verify & Continue" to complete setup</li>
                </ol>
            </div>
            
            <!-- Security Warning -->
            <div class="security-warning">
                <div class="warning-title">
                    <span class="warning-icon">🔒</span>
                    Security Notice
                </div>
                <div class="warning-text">
                    • Never share this code with anyone<br>
                    • MangroveWatch will never ask for your OTP via email<br>
                    • If you didn&#39;t request this code, please ignore this email
                </div>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="footer-content">
                <div class="support-info">
                    Need help? Contact our support team at<br>
                    <a href="mailto:{{SUPPORT_EMAIL}}" class="support-email">{{SUPPORT_EMAIL}}</a>
                </div>
                
                <div class="footer-links">
                    <a href="#" class="footer-link">Privacy Policy</a>
                    <a href="#" class="footer-link">Terms of Service</a>
                    <a href="#" class="footer-link">Help Center</a>
                </div>
                
                <div class="copyright">
                    © 2025 MangroveWatch. All rights reserved.<br>
                    Protecting mangrove ecosystems for future generations.
                </div>
            </div>
        </div>
    </div>
</body>
</html>';
  // $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';
  
$check=$conn->prepare("SELECT * FROM `users` WHERE `email`=?");
$check->bind_param("s", $email);
$check->execute();
$result=$check->get_result();
if($result->num_rows>0){
  sendResponse("error","Email already exists");
}else{
    $register=$conn->prepare("INSERT INTO `users`(`email`, `password`, `name`, `phone_no`, `type`, `otp`) VALUES (?,?,?,?,?,?)");
  $register->bind_param("sssssi", $email, $password, $name, $phone_no, $type, $otp);
  $register->execute();

  if($register->affected_rows>0){
    if($mail->send()){
      sendResponse("success","Email sent successfully");
    }else{
      sendResponse("error","Error sending email");
    }
    
  }else{
    sendResponse("error","Error registering user");
  }
}
  
  
} catch (Exception $e) {
  sendResponse("error", "Message could not be sent. Mailer Error: {$mail->ErrorInfo}");
}

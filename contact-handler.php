<?php
// Database configuration
$config = [
    'host' => 'localhost',
    'dbname' => 'new_balance_erik',
    'username' => 'your_username',
    'password' => 'your_password'
];

// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set headers for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

try {
    // Get POST data
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validate input
    if (!isset($data['name']) || !isset($data['email']) || !isset($data['message'])) {
        throw new Exception('Missing required fields');
    }
    
    // Sanitize input
    $name = filter_var($data['name'], FILTER_SANITIZE_STRING);
    $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
    $message = filter_var($data['message'], FILTER_SANITIZE_STRING);
    
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format');
    }
    
    // Connect to database
    $pdo = new PDO(
        "mysql:host={$config['host']};dbname={$config['dbname']};charset=utf8mb4",
        $config['username'],
        $config['password'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );
    
    // Prepare and execute insert statement
    $stmt = $pdo->prepare("
        INSERT INTO contacts (name, email, message) 
        VALUES (:name, :email, :message)
    ");
    
    $stmt->execute([
        ':name' => $name,
        ':email' => $email,
        ':message' => $message
    ]);
    
    // Send success response
    echo json_encode([
        'success' => true,
        'message' => 'Message sent successfully'
    ]);
    
} catch (Exception $e) {
    // Handle errors
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
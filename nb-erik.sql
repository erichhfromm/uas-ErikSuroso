-- Create the database
CREATE DATABASE IF NOT EXISTS new_balance_erik;
USE new_balance_erik;

-- Create users table for form submissions
CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'read', 'responded') DEFAULT 'pending',
    response_date TIMESTAMP NULL,
    response_message TEXT
);

-- Create admin users table for managing responses
CREATE TABLE admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    role ENUM('admin', 'support') NOT NULL DEFAULT 'support',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create table for tracking message responses
CREATE TABLE contact_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contact_id INT NOT NULL,
    admin_id INT NOT NULL,
    response_text TEXT NOT NULL,
    response_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_id) REFERENCES contacts(id),
    FOREIGN KEY (admin_id) REFERENCES admin_users(id)
);

-- Sample queries for managing contact form data

-- Insert new contact message
INSERT INTO contacts (name, email, message) 
VALUES ('John Doe', 'john@example.com', 'This is a test message');

-- Get all unread messages
SELECT * FROM contacts 
WHERE status = 'pending' 
ORDER BY created_at DESC;

-- Mark message as read
UPDATE contacts 
SET status = 'read' 
WHERE id = 1;

-- Add response to a message
UPDATE contacts 
SET status = 'responded',
    response_date = CURRENT_TIMESTAMP,
    response_message = 'Thank you for your message. We will get back to you soon.'
WHERE id = 1;

-- Get message statistics
SELECT 
    status,
    COUNT(*) as count,
    DATE(created_at) as date
FROM contacts
GROUP BY status, DATE(created_at)
ORDER BY date DESC;

-- Create indexes for better performance
CREATE INDEX idx_status ON contacts(status);
CREATE INDEX idx_created_at ON contacts(created_at);
CREATE INDEX idx_email ON contacts(email);
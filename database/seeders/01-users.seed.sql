-- Example for PostgreSQL/MySQL
INSERT INTO users (username, email, password_hash, role, created_at)
VALUES 
  ('admin', 'admin@helpdesk.com', '$2a$10$hashedpassword', 'admin', NOW()),
  ('support1', 'support@helpdesk.com', '$2a$10$hashedpassword', 'support', NOW()),
  ('user1', 'user@example.com', '$2a$10$hashedpassword', 'user', NOW());
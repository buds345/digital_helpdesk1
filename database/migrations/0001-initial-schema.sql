INSERT INTO users (email, password_hash, role, name, created_at) 
VALUES (
  'admin@helpdesk.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrq5Q1B1M0mJt7fqaJ7PJQ5Y0zQDlGW', -- Paste your generated hash here
  'admin',
  'System Admin',
  NOW()
);
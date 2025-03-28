
CREATE DATABASE IF NOT EXISTS chat_app;
USE chat_app;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(255) DEFAULT 'https://i.pravatar.cc/150?u=default'
);

CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT,
  receiver_id INT,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id)
);

INSERT INTO users (username, password, avatar)
VALUES 
('luanem', '$2b$10$GJjskYxjDClcVkx0EpG4de14u6T84Hjz5uT2QihwIoMnD35UptZgy', 'https://i.pravatar.cc/150?u=luanem'),
('admin', '$2b$10$GJjskYxjDClcVkx0EpG4de14u6T84Hjz5uT2QihwIoMnD35UptZgy', 'https://i.pravatar.cc/150?u=admin');

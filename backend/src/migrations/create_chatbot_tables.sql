-- ============================================
-- Tạo bảng chat_sessions
-- ============================================
CREATE TABLE IF NOT EXISTS chat_sessions (
  session_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NULL,
  session_token VARCHAR(255) UNIQUE NULL,
  status ENUM('active', 'closed', 'waiting') NOT NULL DEFAULT 'active',
  agent_id BIGINT UNSIGNED NULL,
  context JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_user_id (user_id),
  INDEX idx_session_token (session_token),
  INDEX idx_status (status),
  
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Tạo bảng chat_messages
-- ============================================
CREATE TABLE IF NOT EXISTS chat_messages (
  message_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  session_id BIGINT UNSIGNED NOT NULL,
  sender_type ENUM('user', 'bot', 'agent') NOT NULL DEFAULT 'user',
  sender_id BIGINT UNSIGNED NULL,
  content TEXT NOT NULL,
  message_type ENUM('text', 'image', 'file', 'quick_reply', 'card') NOT NULL DEFAULT 'text',
  metadata JSON NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_session_id (session_id),
  INDEX idx_sender_type (sender_type),
  INDEX idx_created_at (created_at),
  
  FOREIGN KEY (session_id) REFERENCES chat_sessions(session_id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
























-- Create pronunciation_assessment table
CREATE TABLE IF NOT EXISTS pronunciation_assessment (
  assessment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  word_id BIGINT,
  user_word_id BIGINT,
  score FLOAT NOT NULL CHECK (score >= 0 AND score <= 100),
  pronunciation_score FLOAT,
  fluency_score FLOAT,
  feedback JSON,
  audio_url VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign keys
  CONSTRAINT fk_pronunciation_user FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_pronunciation_word FOREIGN KEY (word_id) REFERENCES Word(word_id) ON DELETE SET NULL,
  CONSTRAINT fk_pronunciation_user_word FOREIGN KEY (user_word_id) REFERENCES UserWord(user_word_id) ON DELETE SET NULL,
  
  -- Indexes
  INDEX idx_user_id (user_id),
  INDEX idx_word_id (word_id),
  INDEX idx_user_word_id (user_word_id),
  INDEX idx_created_at (created_at),
  INDEX idx_user_word (user_id, word_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add comment
ALTER TABLE pronunciation_assessment COMMENT = 'Lưu trữ kết quả chấm điểm phát âm của người dùng';


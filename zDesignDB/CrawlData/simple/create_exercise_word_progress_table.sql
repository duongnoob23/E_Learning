-- ============================================
-- BẢNG THEO DÕI TIẾN ĐỘ TỪNG TỪ TRONG BÀI TẬP
-- ============================================
-- Bảng này lưu trạng thái của từng từ vựng trong bài tập cho mỗi người dùng
-- Hỗ trợ tính năng: làm đúng, làm sai, bỏ qua

CREATE TABLE IF NOT EXISTS exercise_word_progress (
    progress_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    lesson_id BIGINT UNSIGNED NOT NULL,
    word VARCHAR(255) NOT NULL,  -- Từ vựng (hoặc có thể dùng word_id nếu có bảng words riêng)
    status ENUM('correct', 'incorrect', 'skipped', 'not_attempted') NOT NULL DEFAULT 'not_attempted',
    attempts INT UNSIGNED DEFAULT 0,  -- Số lần đã thử
    last_attempted_at DATETIME,  -- Thời gian thử lần cuối
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Index để query nhanh
    INDEX idx_user_lesson (user_id, lesson_id),
    INDEX idx_user_lesson_word (user_id, lesson_id, word),
    INDEX idx_status (status),
    
    -- Đảm bảo mỗi user chỉ có 1 record cho mỗi từ trong mỗi lesson
    UNIQUE KEY unique_user_lesson_word (user_id, lesson_id, word),
    
    -- Foreign keys (nếu có)
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- VÍ DỤ SỬ DỤNG
-- ============================================

-- 1. Lưu trạng thái khi user làm đúng
-- INSERT INTO exercise_word_progress (user_id, lesson_id, word, status, attempts, last_attempted_at)
-- VALUES (1, 75, 'abandon', 'correct', 1, NOW())
-- ON DUPLICATE KEY UPDATE 
--     status = 'correct',
--     attempts = attempts + 1,
--     last_attempted_at = NOW();

-- 2. Lưu trạng thái khi user làm sai
-- INSERT INTO exercise_word_progress (user_id, lesson_id, word, status, attempts, last_attempted_at)
-- VALUES (1, 75, 'abolish', 'incorrect', 1, NOW())
-- ON DUPLICATE KEY UPDATE 
--     status = 'incorrect',
--     attempts = attempts + 1,
--     last_attempted_at = NOW();

-- 3. Lưu trạng thái khi user bỏ qua
-- INSERT INTO exercise_word_progress (user_id, lesson_id, word, status, attempts, last_attempted_at)
-- VALUES (1, 75, 'absolute', 'skipped', 0, NOW())
-- ON DUPLICATE KEY UPDATE 
--     status = 'skipped',
--     last_attempted_at = NOW();

-- 4. Query để lấy danh sách từ làm sai
-- SELECT word FROM exercise_word_progress 
-- WHERE user_id = 1 AND lesson_id = 75 AND status = 'incorrect';

-- 5. Query để lấy danh sách từ bỏ qua
-- SELECT word FROM exercise_word_progress 
-- WHERE user_id = 1 AND lesson_id = 75 AND status = 'skipped';

-- 6. Query để lấy tất cả từ (trừ các từ đã bỏ qua)
-- SELECT w.* FROM (
--     SELECT word FROM lessons WHERE lesson_id = 75
--     AND JSON_EXTRACT(exercise_data, '$[*].word') AS words
-- ) w
-- LEFT JOIN exercise_word_progress p 
--     ON p.user_id = 1 AND p.lesson_id = 75 AND p.word = w.word AND p.status = 'skipped'
-- WHERE p.progress_id IS NULL;



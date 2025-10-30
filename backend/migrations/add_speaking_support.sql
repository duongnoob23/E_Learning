-- Migration script to add Speaking support to the exam system
-- Run this script to update your database schema

USE e_learnning6;

-- 1. Update question_type enum to include SPEAKING
ALTER TABLE questions 
MODIFY COLUMN question_type ENUM('MULTIPLE_CHOICE', 'FILL_BLANK', 'READING_COMPREHENSION', 'SPEAKING') NOT NULL;

-- 2. Update part_type enum to include SPEAKING
ALTER TABLE parts 
MODIFY COLUMN part_type ENUM('LISTENING', 'READING', 'SPEAKING') NOT NULL;
CREATE TABLE speaking_responses (
    response_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT COMMENT 'PK - ID phản hồi speaking',
    session_id BIGINT UNSIGNED NOT NULL COMMENT 'ID phiên thi',
    question_id BIGINT UNSIGNED NOT NULL COMMENT 'ID câu hỏi speaking',
    user_id BIGINT UNSIGNED NOT NULL COMMENT 'ID người dùng trả lời',
    audio_file_path VARCHAR(500) NOT NULL COMMENT 'Đường dẫn đến tệp âm thanh được tải lên',
    transcription TEXT COMMENT 'Kết quả chuyển giọng nói thành văn bản từ Whisper',
    confidence_score FLOAT COMMENT 'Độ tin cậy của Whisper (0-1)',
    duration_seconds FLOAT COMMENT 'Thời lượng âm thanh (giây)',
    language_detected VARCHAR(10) COMMENT 'Mã ngôn ngữ được phát hiện (en, vi, v.v.)',
    processing_status ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'PENDING' COMMENT 'Trạng thái xử lý chuyển giọng nói',
    error_message TEXT COMMENT 'Thông báo lỗi nếu xử lý thất bại',
    score FLOAT COMMENT 'Điểm speaking (nếu được chấm tự động)',
    feedback TEXT COMMENT 'Phản hồi do AI tạo ra về phát âm, ngữ pháp, v.v.',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Ràng buộc khóa ngoại
    FOREIGN KEY (session_id) REFERENCES exam_sessions(exam_session_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    
    -- Chỉ mục để cải thiện hiệu suất
    INDEX idx_session_id (session_id),
    INDEX idx_question_id (question_id),
    INDEX idx_user_id (user_id),
    INDEX idx_processing_status (processing_status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB COMMENT='Lưu trữ phản hồi speaking và kết quả chuyển giọng nói';

-- 4. Create uploads directory structure (this should be done manually)
-- mkdir -p backend/uploads/speaking_audio
-- mkdir -p backend/uploads/speaking_audio/temp

-- 5. Insert sample speaking questions (optional)
-- You can uncomment and modify these to add sample data

/*
-- Sample speaking test
INSERT INTO tests (title, description, exam_type, total_duration, total_questions, total_parts, difficulty_level) 
VALUES ('IELTS Speaking Practice Test', 'Practice test for IELTS Speaking section', 'IELTS', 15, 3, 1, 'MEDIUM');

SET @test_id = LAST_INSERT_ID();

-- Sample speaking part
INSERT INTO parts (test_id, part_number, part_name, part_type, question_count, duration_minutes, description) 
VALUES (@test_id, 1, 'Speaking Part 1', 'SPEAKING', 3, 15, 'Introduction and interview questions');

SET @part_id = LAST_INSERT_ID();

-- Sample speaking questions
INSERT INTO questions (part_id, question_number, question_text, question_type, explanation) VALUES
(@part_id, 1, 'Tell me about yourself and your hometown.', 'SPEAKING', 'Introduce yourself and describe your hometown. Speak for 1-2 minutes.'),
(@part_id, 2, 'What do you like to do in your free time?', 'SPEAKING', 'Describe your hobbies and leisure activities. Speak for 1-2 minutes.'),
(@part_id, 3, 'Describe your favorite food and explain why you like it.', 'SPEAKING', 'Talk about your favorite food, its taste, and why it appeals to you. Speak for 1-2 minutes.');
*/

-- Migration completed successfully
SELECT 'Speaking support migration completed successfully!' as status;

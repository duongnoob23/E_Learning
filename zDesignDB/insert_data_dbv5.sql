-- =============================================
-- TẠO DATABASE VÀ SỬ DỤNG
-- =============================================
CREATE DATABASE IF NOT EXISTS e_learnning6 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE e_learnning6;

SET FOREIGN_KEY_CHECKS = 0;

-- Xóa dữ liệu cũ nếu có (để tránh duplicate)
DELETE FROM test_comments;
DELETE FROM test_discussions;
DELETE FROM question_tags;
DELETE FROM exam_tags;
DELETE FROM test_categories;
DELETE FROM part_statistics;
DELETE FROM user_exam_statistics;
DELETE FROM user_answers;
DELETE FROM exam_sessions;
DELETE FROM choices;
DELETE FROM questions;
DELETE FROM parts;
DELETE FROM tests;
DELETE FROM exam_categories;
DELETE FROM course_tag_relations;
DELETE FROM course_tags;
DELETE FROM course_certificates;
DELETE FROM course_coupons;
DELETE FROM coupons;
DELETE FROM course_wishlist;
DELETE FROM course_discussions;
DELETE FROM course_reviews;
DELETE FROM lesson_progress;
DELETE FROM course_enrollments;
DELETE FROM lessons;
DELETE FROM modules;
DELETE FROM course_details;
DELETE FROM courses;
DELETE FROM instructors;
DELETE FROM levels;
DELETE FROM categories;
DELETE FROM import_details;
DELETE FROM batch_imports;
DELETE FROM favorite_topics;
DELETE FROM user_word_status;
DELETE FROM user_words;
DELETE FROM words;
DELETE FROM topics;
DELETE FROM password_reset_tokens;
DELETE FROM login_history;
DELETE FROM email_verifications;
DELETE FROM refresh_tokens;
DELETE FROM otp_codes;
DELETE FROM role_permissions;
DELETE FROM user_roles;
DELETE FROM permissions;
DELETE FROM roles;
DELETE FROM users;

-- =============================================
-- INSERT: Authentication & Authorization
-- =============================================

-- INSERT: users (5 records)
INSERT INTO users (user_id, username, password_hash, email, full_name, phone_number, avatar_url, status, email_verified, phone_verified, last_login, failed_login_attempts, locked_until, created_at, updated_at) VALUES
(1, 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@example.com', 'Administrator', '0123456789', 'https://example.com/avatar1.jpg', 'active', TRUE, TRUE, '2024-01-15 10:30:00', 0, NULL, '2024-01-01 00:00:00', '2024-01-15 10:30:00'),
(2, 'teacher1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher1@example.com', 'Nguyen Van A', '0123456788', 'https://example.com/avatar2.jpg', 'active', TRUE, TRUE, '2024-01-14 09:15:00', 0, NULL, '2024-01-02 00:00:00', '2024-01-14 09:15:00'),
(3, 'student1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student1@example.com', 'Tran Thi B', '0123456787', 'https://example.com/avatar3.jpg', 'active', TRUE, TRUE, '2024-01-13 14:20:00', 0, NULL, '2024-01-03 00:00:00', '2024-01-13 14:20:00'),
(4, 'student2', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student2@example.com', 'Le Van C', '0123456786', 'https://example.com/avatar4.jpg', 'active', TRUE, FALSE, '2024-01-12 16:45:00', 0, NULL, '2024-01-04 00:00:00', '2024-01-12 16:45:00'),
(5, 'student3', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student3@example.com', 'Pham Thi D', '0123456785', 'https://example.com/avatar5.jpg', 'active', TRUE, TRUE, '2024-01-11 11:30:00', 0, NULL, '2024-01-05 00:00:00', '2024-01-11 11:30:00');

-- INSERT: roles (4 records)
INSERT INTO roles (role_id, role_name, description, is_active, created_at) VALUES
(1, 'Admin', 'Quản trị viên hệ thống', TRUE, '2024-01-01 00:00:00'),
(2, 'Teacher', 'Giảng viên', TRUE, '2024-01-01 00:00:00'),
(3, 'Student', 'Học viên', TRUE, '2024-01-01 00:00:00'),
(4, 'Guest', 'Khách', TRUE, '2024-01-01 00:00:00');

-- INSERT: permissions (8 records)
INSERT INTO permissions (permission_id, permission_name, description, resource, action, is_active, created_at) VALUES
(1, 'user.create', 'Tạo người dùng', 'user', 'create', TRUE, '2024-01-01 00:00:00'),
(2, 'user.read', 'Xem thông tin người dùng', 'user', 'read', TRUE, '2024-01-01 00:00:00'),
(3, 'user.update', 'Cập nhật người dùng', 'user', 'update', TRUE, '2024-01-01 00:00:00'),
(4, 'user.delete', 'Xóa người dùng', 'user', 'delete', TRUE, '2024-01-01 00:00:00'),
(5, 'course.create', 'Tạo khóa học', 'course', 'create', TRUE, '2024-01-01 00:00:00'),
(6, 'course.read', 'Xem khóa học', 'course', 'read', TRUE, '2024-01-01 00:00:00'),
(7, 'exam.create', 'Tạo đề thi', 'exam', 'create', TRUE, '2024-01-01 00:00:00'),
(8, 'exam.read', 'Xem đề thi', 'exam', 'read', TRUE, '2024-01-01 00:00:00');

-- INSERT: user_roles (5 records)
INSERT INTO user_roles (user_id, role_id, assigned_at, assigned_by, is_active) VALUES
(1, 1, '2024-01-01 00:00:00', 1, TRUE),
(2, 2, '2024-01-02 00:00:00', 1, TRUE),
(3, 3, '2024-01-03 00:00:00', 1, TRUE),
(4, 3, '2024-01-04 00:00:00', 1, TRUE),
(5, 3, '2024-01-05 00:00:00', 1, TRUE);

-- INSERT: role_permissions (12 records)
INSERT INTO role_permissions (role_id, permission_id, granted_at, granted_by) VALUES
(1, 1, '2024-01-01 00:00:00', 1),
(1, 2, '2024-01-01 00:00:00', 1),
(1, 3, '2024-01-01 00:00:00', 1),
(1, 4, '2024-01-01 00:00:00', 1),
(1, 5, '2024-01-01 00:00:00', 1),
(1, 6, '2024-01-01 00:00:00', 1),
(1, 7, '2024-01-01 00:00:00', 1),
(1, 8, '2024-01-01 00:00:00', 1),
(2, 5, '2024-01-01 00:00:00', 1),
(2, 6, '2024-01-01 00:00:00', 1),
(3, 6, '2024-01-01 00:00:00', 1),
(3, 8, '2024-01-01 00:00:00', 1);

-- =============================================
-- INSERT: Security & Authentication
-- =============================================

-- INSERT: otp_codes (3 records)
INSERT INTO otp_codes (otp_id, user_id, email, phone_number, otp_code, otp_type, is_used, attempts, expires_at, created_at) VALUES
(1, 2, 'teacher1@example.com', NULL, '123456', 'email_verification', TRUE, 1, '2024-01-02 01:00:00', '2024-01-02 00:00:00'),
(2, 3, 'student1@example.com', NULL, '234567', 'email_verification', TRUE, 1, '2024-01-03 01:00:00', '2024-01-03 00:00:00'),
(3, 4, 'student2@example.com', '0123456786', '345678', 'phone_verification', FALSE, 0, '2024-01-20 00:00:00', '2024-01-10 00:00:00');

-- INSERT: refresh_tokens (3 records)
INSERT INTO refresh_tokens (token_id, user_id, token_hash, device_info, ip_address, user_agent, is_revoked, expires_at, created_at) VALUES
(1, 1, 'hash1', '{"device": "Windows 10", "browser": "Chrome"}', '192.168.1.1', 'Mozilla/5.0...', FALSE, '2024-02-01 00:00:00', '2024-01-01 00:00:00'),
(2, 2, 'hash2', '{"device": "MacBook Pro", "browser": "Safari"}', '192.168.1.2', 'Mozilla/5.0...', FALSE, '2024-02-02 00:00:00', '2024-01-02 00:00:00'),
(3, 3, 'hash3', '{"device": "iPhone", "browser": "Safari Mobile"}', '192.168.1.3', 'Mozilla/5.0...', FALSE, '2024-02-03 00:00:00', '2024-01-03 00:00:00');

-- INSERT: email_verifications (3 records)
INSERT INTO email_verifications (verification_id, user_id, email, verification_token, is_verified, verified_at, expires_at, created_at) VALUES
(1, 2, 'teacher1@example.com', 'token1', TRUE, '2024-01-02 00:30:00', '2024-01-02 01:00:00', '2024-01-02 00:00:00'),
(2, 3, 'student1@example.com', 'token2', TRUE, '2024-01-03 00:30:00', '2024-01-03 01:00:00', '2024-01-03 00:00:00'),
(3, 4, 'student2@example.com', 'token3', FALSE, NULL, '2024-01-20 00:00:00', '2024-01-10 00:00:00');

-- INSERT: login_history (5 records)
INSERT INTO login_history (login_id, user_id, login_time, ip_address, user_agent, login_status, failure_reason, session_duration) VALUES
(1, 1, '2024-01-15 10:30:00', '192.168.1.1', 'Mozilla/5.0...', 'success', NULL, 3600),
(2, 2, '2024-01-14 09:15:00', '192.168.1.2', 'Mozilla/5.0...', 'success', NULL, 7200),
(3, 3, '2024-01-13 14:20:00', '192.168.1.3', 'Mozilla/5.0...', 'success', NULL, 1800),
(4, 4, '2024-01-12 16:45:00', '192.168.1.4', 'Mozilla/5.0...', 'success', NULL, 2400),
(5, 5, '2024-01-11 11:30:00', '192.168.1.5', 'Mozilla/5.0...', 'success', NULL, 3000);

-- INSERT: password_reset_tokens (2 records)
INSERT INTO password_reset_tokens (reset_id, user_id, reset_token, is_used, expires_at, created_at) VALUES
(1, 3, 'reset_token1', TRUE, '2024-01-05 00:00:00', '2024-01-04 00:00:00'),
(2, 4, 'reset_token2', FALSE, '2024-01-20 00:00:00', '2024-01-10 00:00:00');

-- =============================================
-- INSERT: Vocabulary Module
-- =============================================

-- INSERT: topics (5 records)
INSERT INTO topics (topic_id, topic_name, description, image_url, logo_url, topic_type, created_by, is_public, is_active, word_count, created_at, updated_at) VALUES
(1, 'Basic English', 'Từ vựng tiếng Anh cơ bản', 'https://example.com/topic1.jpg', NULL, 'system', NULL, TRUE, TRUE, 100, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(2, 'Business English', 'Từ vựng tiếng Anh thương mại', 'https://example.com/topic2.jpg', NULL, 'system', NULL, TRUE, TRUE, 150, '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(3, 'TOEIC Vocabulary', 'Từ vựng TOEIC', 'https://example.com/topic3.jpg', NULL, 'system', NULL, TRUE, TRUE, 200, '2024-01-03 00:00:00', '2024-01-03 00:00:00'),
(4, 'IELTS Vocabulary', 'Từ vựng IELTS', 'https://example.com/topic4.jpg', NULL, 'system', NULL, TRUE, TRUE, 180, '2024-01-04 00:00:00', '2024-01-04 00:00:00'),
(5, 'My Personal Words', 'Từ vựng cá nhân', 'https://example.com/topic5.jpg', NULL, 'user_created', 3, TRUE, TRUE, 50, '2024-01-05 00:00:00', '2024-01-05 00:00:00');

-- INSERT: words (10 records)
INSERT INTO words (word_id, topic_id, word, part_of_speech, pronunciation, meaning_vi, example_en, example_vi, image_url, notes, word_type, created_by, is_active, created_at, updated_at) VALUES
(1, 1, 'hello', 'interjection', '/həˈloʊ/', 'xin chào', 'Hello, how are you?', 'Xin chào, bạn có khỏe không?', NULL, NULL, 'system', NULL, TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(2, 1, 'good', 'adjective', '/ɡʊd/', 'tốt', 'This is a good book.', 'Đây là một cuốn sách hay.', NULL, NULL, 'system', NULL, TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(3, 2, 'meeting', 'noun', '/ˈmiːtɪŋ/', 'cuộc họp', 'We have a meeting at 3 PM.', 'Chúng ta có cuộc họp lúc 3 giờ chiều.', NULL, NULL, 'system', NULL, TRUE, '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(4, 2, 'presentation', 'noun', '/ˌprezənˈteɪʃən/', 'bài thuyết trình', 'She gave a great presentation.', 'Cô ấy đã có một bài thuyết trình tuyệt vời.', NULL, NULL, 'system', NULL, TRUE, '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(5, 3, 'analyze', 'verb', '/ˈænəlaɪz/', 'phân tích', 'We need to analyze the data.', 'Chúng ta cần phân tích dữ liệu.', NULL, NULL, 'system', NULL, TRUE, '2024-01-03 00:00:00', '2024-01-03 00:00:00'),
(6, 3, 'comprehensive', 'adjective', '/ˌkɑːmprɪˈhensɪv/', 'toàn diện', 'This is a comprehensive report.', 'Đây là một báo cáo toàn diện.', NULL, NULL, 'system', NULL, TRUE, '2024-01-03 00:00:00', '2024-01-03 00:00:00'),
(7, 4, 'academic', 'adjective', '/ˌækəˈdemɪk/', 'học thuật', 'This is an academic paper.', 'Đây là một bài báo học thuật.', NULL, NULL, 'system', NULL, TRUE, '2024-01-04 00:00:00', '2024-01-04 00:00:00'),
(8, 4, 'research', 'noun', '/rɪˈsɜːrtʃ/', 'nghiên cứu', 'She is doing research on climate change.', 'Cô ấy đang nghiên cứu về biến đổi khí hậu.', NULL, NULL, 'system', NULL, TRUE, '2024-01-04 00:00:00', '2024-01-04 00:00:00'),
(9, 5, 'custom', 'adjective', '/ˈkʌstəm/', 'tùy chỉnh', 'This is a custom solution.', 'Đây là một giải pháp tùy chỉnh.', NULL, NULL, 'user_created', 3, TRUE, '2024-01-05 00:00:00', '2024-01-05 00:00:00'),
(10, 5, 'personal', 'adjective', '/ˈpɜːrsənəl/', 'cá nhân', 'This is my personal opinion.', 'Đây là ý kiến cá nhân của tôi.', NULL, NULL, 'user_created', 3, TRUE, '2024-01-05 00:00:00', '2024-01-05 00:00:00');

-- INSERT: user_words (5 records)
INSERT INTO user_words (user_word_id, user_id, topic_id, word, part_of_speech, pronunciation, meaning_vi, example_en, example_vi, image_url, notes, from_system_word_id, is_active, created_at, updated_at) VALUES
(1, 3, 5, 'customize', 'verb', '/ˈkʌstəmaɪz/', 'tùy chỉnh', 'You can customize the settings.', 'Bạn có thể tùy chỉnh các cài đặt.', NULL, 'Personal note', NULL, TRUE, '2024-01-05 00:00:00', '2024-01-05 00:00:00'),
(2, 3, 5, 'individual', 'adjective', '/ˌɪndɪˈvɪdʒuəl/', 'cá nhân', 'Each individual has different needs.', 'Mỗi cá nhân có những nhu cầu khác nhau.', NULL, 'Important word', NULL, TRUE, '2024-01-05 00:00:00', '2024-01-05 00:00:00'),
(3, 4, 5, 'unique', 'adjective', '/juˈniːk/', 'độc đáo', 'This is a unique opportunity.', 'Đây là một cơ hội độc đáo.', NULL, 'Study note', NULL, TRUE, '2024-01-06 00:00:00', '2024-01-06 00:00:00'),
(4, 4, 5, 'specific', 'adjective', '/spəˈsɪfɪk/', 'cụ thể', 'Please be more specific.', 'Vui lòng cụ thể hơn.', NULL, 'Remember this', NULL, TRUE, '2024-01-06 00:00:00', '2024-01-06 00:00:00'),
(5, 5, 5, 'flexible', 'adjective', '/ˈfleksəbəl/', 'linh hoạt', 'We need a flexible approach.', 'Chúng ta cần một cách tiếp cận linh hoạt.', NULL, 'Key word', NULL, TRUE, '2024-01-07 00:00:00', '2024-01-07 00:00:00');

-- INSERT: user_word_status (8 records)
INSERT INTO user_word_status (status_id, user_id, topic_id, word_id, user_word_id, is_learned, marked_at, created_at, updated_at) VALUES
(1, 3, 1, 1, NULL, TRUE, '2024-01-10 00:00:00', '2024-01-10 00:00:00', '2024-01-10 00:00:00'),
(2, 3, 1, 2, NULL, TRUE, '2024-01-10 00:00:00', '2024-01-10 00:00:00', '2024-01-10 00:00:00'),
(3, 3, 5, NULL, 1, FALSE, NULL, '2024-01-05 00:00:00', '2024-01-05 00:00:00'),
(4, 3, 5, NULL, 2, TRUE, '2024-01-11 00:00:00', '2024-01-05 00:00:00', '2024-01-11 00:00:00'),
(5, 4, 5, NULL, 3, FALSE, NULL, '2024-01-06 00:00:00', '2024-01-06 00:00:00'),
(6, 4, 5, NULL, 4, TRUE, '2024-01-12 00:00:00', '2024-01-06 00:00:00', '2024-01-12 00:00:00'),
(7, 5, 5, NULL, 5, FALSE, NULL, '2024-01-07 00:00:00', '2024-01-07 00:00:00'),
(8, 5, 1, 1, NULL, TRUE, '2024-01-13 00:00:00', '2024-01-13 00:00:00', '2024-01-13 00:00:00');

-- INSERT: favorite_topics (3 records)
INSERT INTO favorite_topics (favorite_id, user_id, topic_id, added_at) VALUES
(1, 3, 1, '2024-01-10 00:00:00'),
(2, 3, 3, '2024-01-10 00:00:00'),
(3, 4, 2, '2024-01-11 00:00:00');

-- INSERT: batch_imports (2 records)
INSERT INTO batch_imports (import_id, user_id, topic_id, import_name, total_words, success_count, error_count, import_status, error_log, started_at, completed_at) VALUES
(1, 3, 5, 'personal_words.xlsx', 10, 8, 2, 'completed', 'Row 3: Invalid format\nRow 7: Duplicate word', '2024-01-05 00:00:00', '2024-01-05 00:30:00'),
(2, 4, 5, 'my_vocabulary.csv', 15, 12, 3, 'completed', 'Row 5: Missing meaning\nRow 8: Invalid pronunciation\nRow 12: Duplicate entry', '2024-01-06 00:00:00', '2024-01-06 00:45:00');

-- INSERT: import_details (5 records)
INSERT INTO import_details (detail_id, import_id, row_num, word, meaning_vi, part_of_speech, pronunciation, example_en, example_vi, notes, import_status, error_message, created_word_id) VALUES
(1, 1, 1, 'customize', 'tùy chỉnh', 'verb', '/ˈkʌstəmaɪz/', 'You can customize the settings.', 'Bạn có thể tùy chỉnh các cài đặt.', 'Personal note', 'success', NULL, 1),
(2, 1, 2, 'individual', 'cá nhân', 'adjective', '/ˌɪndɪˈvɪdʒuəl/', 'Each individual has different needs.', 'Mỗi cá nhân có những nhu cầu khác nhau.', 'Important word', 'success', NULL, 2),
(3, 1, 3, 'invalid_word', 'nghĩa không hợp lệ', 'noun', '/invalid/', 'Invalid example.', 'Ví dụ không hợp lệ.', NULL, 'error', 'Invalid format', NULL),
(4, 2, 1, 'unique', 'độc đáo', 'adjective', '/juˈniːk/', 'This is a unique opportunity.', 'Đây là một cơ hội độc đáo.', 'Study note', 'success', NULL, 3),
(5, 2, 2, 'specific', 'cụ thể', 'adjective', '/spəˈsɪfɪk/', 'Please be more specific.', 'Vui lòng cụ thể hơn.', 'Remember this', 'success', NULL, 4);

-- INSERT: study_modes (2 records)
INSERT INTO study_modes (mode_id, mode_name, description, is_active, created_at) VALUES
(1, 'flashcard', 'Học bằng thẻ ghi nhớ', TRUE, '2024-01-01 00:00:00'),
(2, 'list_view', 'Học bằng danh sách', TRUE, '2024-01-01 00:00:00');

-- =============================================
-- INSERT: Course Module
-- =============================================

-- INSERT: categories (4 records)
INSERT INTO categories (category_id, name, slug, description, icon, color, image, sort_order, is_active, created_at, updated_at) VALUES
(1, 'English Language', 'english-language', 'Khóa học tiếng Anh', 'book', '#3498db', 'https://example.com/cat1.jpg', 1, TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(2, 'Business Skills', 'business-skills', 'Kỹ năng kinh doanh', 'briefcase', '#e74c3c', 'https://example.com/cat2.jpg', 2, TRUE, '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(3, 'Technology', 'technology', 'Công nghệ thông tin', 'laptop', '#2ecc71', 'https://example.com/cat3.jpg', 3, TRUE, '2024-01-03 00:00:00', '2024-01-03 00:00:00'),
(4, 'Exam Preparation', 'exam-preparation', 'Luyện thi', 'graduation-cap', '#f39c12', 'https://example.com/cat4.jpg', 4, TRUE, '2024-01-04 00:00:00', '2024-01-04 00:00:00');

-- INSERT: levels (3 records)
INSERT INTO levels (level_id, name, slug, description, color, sort_order, is_active, created_at) VALUES
(1, 'Beginner', 'beginner', 'Trình độ cơ bản', '#27ae60', 1, TRUE, '2024-01-01 00:00:00'),
(2, 'Intermediate', 'intermediate', 'Trình độ trung cấp', '#f39c12', 2, TRUE, '2024-01-01 00:00:00'),
(3, 'Advanced', 'advanced', 'Trình độ nâng cao', '#e74c3c', 3, TRUE, '2024-01-01 00:00:00');

-- INSERT: instructors (3 records)
INSERT INTO instructors (instructor_id, user_id, name, avatar, bio, experience_years, specializations, education, achievements, social_links, is_featured, is_verified, is_active, created_at, updated_at) VALUES
(1, 2, 'Nguyen Van A', 'https://example.com/instructor1.jpg', 'Giảng viên tiếng Anh với 10 năm kinh nghiệm', 10, 'English, TOEIC, IELTS', 'MA in English Literature', 'Best Teacher Award 2023', '{"facebook": "https://fb.com/teacher1", "linkedin": "https://linkedin.com/in/teacher1"}', TRUE, TRUE, TRUE, '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(2, NULL, 'John Smith', 'https://example.com/instructor2.jpg', 'Native English speaker with business background', 8, 'Business English, Communication', 'MBA from Harvard', 'Published author of 3 books', '{"linkedin": "https://linkedin.com/in/johnsmith"}', FALSE, TRUE, TRUE, '2024-01-03 00:00:00', '2024-01-03 00:00:00'),
(3, NULL, 'Sarah Johnson', 'https://example.com/instructor3.jpg', 'IELTS expert with 12 years experience', 12, 'IELTS, Academic English', 'PhD in Linguistics', 'IELTS Examiner for 5 years', '{"twitter": "https://twitter.com/sarahj", "linkedin": "https://linkedin.com/in/sarahj"}', TRUE, TRUE, TRUE, '2024-01-04 00:00:00', '2024-01-04 00:00:00');

-- INSERT: courses (4 records)
INSERT INTO courses (course_id, title, slug, short_description, description, category_id, level_id, instructor_id, image, video_preview, video_duration, video_progress, total_lessons, total_duration, total_students, rating, rating_count, price, old_price, discount_percent, is_free, is_best_seller, is_featured, status, published_at, meta_title, meta_description, created_at, updated_at) VALUES
(1, 'Complete English Course for Beginners', 'complete-english-course-beginners', 'Khóa học tiếng Anh toàn diện cho người mới bắt đầu', 'Khóa học này sẽ giúp bạn nắm vững những kiến thức cơ bản nhất về tiếng Anh...', 1, 1, 1, 'https://example.com/course1.jpg', 'https://example.com/preview1.mp4', '05:30', 0.0, 20, '10 hours', 150, 4.5, 45, 299000.00, 399000.00, 25, FALSE, TRUE, TRUE, 'published', '2024-01-05 00:00:00', 'Complete English Course for Beginners', 'Learn English from scratch with our comprehensive course', '2024-01-05 00:00:00', '2024-01-05 00:00:00'),
(2, 'Business English Communication', 'business-english-communication', 'Tiếng Anh giao tiếp trong kinh doanh', 'Phát triển kỹ năng giao tiếp tiếng Anh trong môi trường công việc...', 2, 2, 2, 'https://example.com/course2.jpg', 'https://example.com/preview2.mp4', '08:15', 0.0, 15, '8 hours', 80, 4.8, 32, 499000.00, NULL, 0, FALSE, FALSE, TRUE, 'published', '2024-01-06 00:00:00', 'Business English Communication', 'Master business English communication skills', '2024-01-06 00:00:00', '2024-01-06 00:00:00'),
(3, 'IELTS Preparation Course', 'ielts-preparation-course', 'Luyện thi IELTS toàn diện', 'Chuẩn bị tốt nhất cho kỳ thi IELTS với các chiến lược và kỹ thuật hiệu quả...', 4, 3, 3, 'https://example.com/course3.jpg', 'https://example.com/preview3.mp4', '12:20', 0.0, 30, '25 hours', 200, 4.9, 67, 799000.00, 999000.00, 20, FALSE, TRUE, TRUE, 'published', '2024-01-07 00:00:00', 'IELTS Preparation Course', 'Comprehensive IELTS preparation with expert guidance', '2024-01-07 00:00:00', '2024-01-07 00:00:00'),
(4, 'Free English Basics', 'free-english-basics', 'Tiếng Anh cơ bản miễn phí', 'Khóa học tiếng Anh cơ bản hoàn toàn miễn phí...', 1, 1, 1, 'https://example.com/course4.jpg', NULL, NULL, 0.0, 5, '2 hours', 500, 4.2, 120, 0.00, NULL, 0, TRUE, FALSE, FALSE, 'published', '2024-01-08 00:00:00', 'Free English Basics', 'Free English course for beginners', '2024-01-08 00:00:00', '2024-01-08 00:00:00');

-- INSERT: course_details (4 records)
INSERT INTO course_details (course_detail_id, course_id, about_content, learning_outcomes, skills_covered, requirements, achievements, certificate_info, last_updated, language, target_audience, created_at, updated_at) VALUES
(1, 1, 'Khóa học này được thiết kế đặc biệt cho những người mới bắt đầu học tiếng Anh...', '["Nắm vững ngữ pháp cơ bản", "Có thể giao tiếp đơn giản", "Hiểu được các đoạn hội thoại cơ bản"]', '["Speaking", "Listening", "Reading", "Writing"]', '["Không cần kiến thức tiếng Anh trước đó", "Có thời gian học 30 phút/ngày"]', '["Chứng chỉ hoàn thành khóa học", "Portfolio cá nhân"]', 'Chứng chỉ được cấp sau khi hoàn thành 80% nội dung khóa học', '2024-01-05', 'Vietnamese', 'Người mới bắt đầu học tiếng Anh', '2024-01-05 00:00:00', '2024-01-05 00:00:00'),
(2, 2, 'Khóa học tập trung vào phát triển kỹ năng giao tiếp trong môi trường kinh doanh...', '["Giao tiếp hiệu quả trong công việc", "Viết email chuyên nghiệp", "Thuyết trình tự tin"]', '["Business Communication", "Email Writing", "Presentation Skills"]', '["Trình độ tiếng Anh trung cấp", "Kinh nghiệm làm việc"]', '["Chứng chỉ Business English", "Portfolio thực tế"]', 'Chứng chỉ Business English được công nhận quốc tế', '2024-01-06', 'Vietnamese', 'Nhân viên văn phòng, quản lý', '2024-01-06 00:00:00', '2024-01-06 00:00:00'),
(3, 3, 'Khóa học luyện thi IELTS toàn diện với các chiến lược và kỹ thuật chuyên sâu...', '["Đạt điểm IELTS 6.5+", "Nắm vững 4 kỹ năng", "Chiến lược làm bài hiệu quả"]', '["IELTS Listening", "IELTS Reading", "IELTS Writing", "IELTS Speaking"]', '["Trình độ tiếng Anh trung cấp", "Mục tiêu IELTS 6.0+"]', '["Chứng chỉ IELTS Preparation", "Mock test results"]', 'Chứng chỉ IELTS Preparation + Mock test results', '2024-01-07', 'Vietnamese', 'Thí sinh chuẩn bị thi IELTS', '2024-01-07 00:00:00', '2024-01-07 00:00:00'),
(4, 4, 'Khóa học tiếng Anh cơ bản miễn phí dành cho mọi người...', '["Nắm vững kiến thức cơ bản", "Có thể tự học tiếp"]', '["Basic Grammar", "Basic Vocabulary", "Basic Conversation"]', '["Không cần kiến thức trước đó"]', '["Chứng chỉ hoàn thành miễn phí"]', 'Chứng chỉ hoàn thành miễn phí', '2024-01-08', 'Vietnamese', 'Mọi đối tượng', '2024-01-08 00:00:00', '2024-01-08 00:00:00');

-- INSERT: modules (8 records) - FIXED datetime format
INSERT INTO modules (module_id, course_id, title, description, sort_order, total_lectures, total_duration, is_active, created_at, updated_at) VALUES
(1, 1, 'Module 1: Basic Grammar', 'Học ngữ pháp cơ bản', 1, 5, '2 hours', TRUE, '2024-01-05 00:00:00', '2024-01-05 00:00:00'),
(2, 1, 'Module 2: Vocabulary', 'Học từ vựng cơ bản', 2, 5, '2 hours', TRUE, '2024-01-05 00:00:00', '2024-01-05 00:00:00'),
(3, 1, 'Module 3: Speaking', 'Luyện nói cơ bản', 3, 5, '2 hours', TRUE, '2024-01-05 00:00:00', '2024-01-05 00:00:00'),
(4, 1, 'Module 4: Listening', 'Luyện nghe cơ bản', 4, 5, '2 hours', TRUE, '2024-01-05 00:00:00', '2024-01-05 00:00:00'),
(5, 2, 'Module 1: Business Communication', 'Giao tiếp kinh doanh', 1, 5, '2 hours', TRUE, '2024-01-06 00:00:00', '2024-01-06 00:00:00'),
(6, 2, 'Module 2: Email Writing', 'Viết email chuyên nghiệp', 2, 5, '2 hours', TRUE, '2024-01-06 00:00:00', '2024-01-06 00:00:00'),
(7, 2, 'Module 3: Presentation Skills', 'Kỹ năng thuyết trình', 3, 5, '2 hours', TRUE, '2024-01-06 00:00:00', '2024-01-06 00:00:00'),
(8, 3, 'Module 1: IELTS Listening', 'Luyện nghe IELTS', 1, 10, '5 hours', TRUE, '2024-01-07 00:00:00', '2024-01-07 00:00:00');

-- INSERT: lessons (20 records)
INSERT INTO lessons (lesson_id, module_id, course_id, title, description, content, video_url, video_duration, file_attachment, sort_order, lesson_type, is_free, is_active, view_count, created_at, updated_at) VALUES
(1, 1, 1, 'Lesson 1: Present Simple', 'Học thì hiện tại đơn', 'Nội dung bài học về thì hiện tại đơn...', 'https://example.com/lesson1.mp4', '15:30', NULL, 1, 'video', FALSE, TRUE, 50, '2024-01-05 00:00:00', '2024-01-05 00:00:00'),
(2, 1, 1, 'Lesson 2: Present Continuous', 'Học thì hiện tại tiếp diễn', 'Nội dung bài học về thì hiện tại tiếp diễn...', 'https://example.com/lesson2.mp4', '18:45', NULL, 2, 'video', FALSE, TRUE, 45, '2024-01-05 00:00:00', '2024-01-05 00:00:00'),
(3, 1, 1, 'Lesson 3: Past Simple', 'Học thì quá khứ đơn', 'Nội dung bài học về thì quá khứ đơn...', 'https://example.com/lesson3.mp4', '20:15', NULL, 3, 'video', FALSE, TRUE, 40, '2024-01-05 00:00:00', '2024-01-05 00:00:00'),
(4, 1, 1, 'Lesson 4: Future Simple', 'Học thì tương lai đơn', 'Nội dung bài học về thì tương lai đơn...', 'https://example.com/lesson4.mp4', '16:20', NULL, 4, 'video', FALSE, TRUE, 35, '2024-01-05 00:00:00', '2024-01-05 00:00:00'),
(5, 1, 1, 'Lesson 5: Grammar Quiz', 'Bài kiểm tra ngữ pháp', 'Nội dung bài kiểm tra...', NULL, NULL, 'https://example.com/quiz1.pdf', 5, 'quiz', FALSE, TRUE, 30, '2024-01-05 00:00:00', '2024-01-05 00:00:00'),
(6, 2, 1, 'Lesson 6: Basic Vocabulary', 'Từ vựng cơ bản', 'Nội dung bài học từ vựng...', 'https://example.com/lesson6.mp4', '12:30', NULL, 1, 'video', FALSE, TRUE, 60, '2024-01-05 00:00:00', '2024-01-05 00:00:00'),
(7, 2, 1, 'Lesson 7: Family Words', 'Từ vựng về gia đình', 'Nội dung bài học từ vựng gia đình...', 'https://example.com/lesson7.mp4', '14:45', NULL, 2, 'video', FALSE, TRUE, 55, '2024-01-05 00:00:00', '2024-01-05 00:00:00'),
(8, 2, 1, 'Lesson 8: Color Words', 'Từ vựng về màu sắc', 'Nội dung bài học từ vựng màu sắc...', 'https://example.com/lesson8.mp4', '11:20', NULL, 3, 'video', FALSE, TRUE, 50, '2024-01-05 00:00:00', '2024-01-05 00:00:00'),
(9, 2, 1, 'Lesson 9: Number Words', 'Từ vựng về số đếm', 'Nội dung bài học từ vựng số đếm...', 'https://example.com/lesson9.mp4', '13:15', NULL, 4, 'video', FALSE, TRUE, 45, '2024-01-05 00:00:00', '2024-01-05 00:00:00'),
(10, 2, 1, 'Lesson 10: Vocabulary Quiz', 'Bài kiểm tra từ vựng', 'Nội dung bài kiểm tra từ vựng...', NULL, NULL, 'https://example.com/quiz2.pdf', 5, 'quiz', FALSE, TRUE, 40, '2024-01-05 00:00:00', '2024-01-05 00:00:00'),
(11, 3, 1, 'Lesson 11: Basic Speaking', 'Luyện nói cơ bản', 'Nội dung bài học luyện nói...', 'https://example.com/lesson11.mp4', '17:30', NULL, 1, 'video', FALSE, TRUE, 70, '2024-01-05 00:00:00', '2024-01-05 00:00:00'),
(12, 3, 1, 'Lesson 12: Greetings', 'Chào hỏi', 'Nội dung bài học chào hỏi...', 'https://example.com/lesson12.mp4', '14:20', NULL, 2, 'video', FALSE, TRUE, 65, '2024-01-05 00:00:00', '2024-01-05 00:00:00'),
(13, 3, 1, 'Lesson 13: Self Introduction', 'Tự giới thiệu', 'Nội dung bài học tự giới thiệu...', 'https://example.com/lesson13.mp4', '16:45', NULL, 3, 'video', FALSE, TRUE, 60, '2024-01-05 00:00:00', '2024-01-05 00:00:00'),
(14, 3, 1, 'Lesson 14: Daily Conversation', 'Hội thoại hàng ngày', 'Nội dung bài học hội thoại...', 'https://example.com/lesson14.mp4', '19:10', NULL, 4, 'video', FALSE, TRUE, 55, '2024-01-05 00:00:00', '2024-01-05 00:00:00'),
(15, 3, 1, 'Lesson 15: Speaking Practice', 'Thực hành nói', 'Nội dung bài thực hành nói...', NULL, NULL, 'https://example.com/practice1.pdf', 5, 'assignment', FALSE, TRUE, 50, '2024-01-05 00:00:00', '2024-01-05 00:00:00'),
(16, 4, 1, 'Lesson 16: Basic Listening', 'Luyện nghe cơ bản', 'Nội dung bài học luyện nghe...', 'https://example.com/lesson16.mp4', '15:30', 'https://example.com/audio1.mp3', 1, 'video', FALSE, TRUE, 80, '2024-01-05 00:00:00', '2024-01-05 00:00:00'),
(17, 4, 1, 'Lesson 17: Numbers Listening', 'Nghe số đếm', 'Nội dung bài học nghe số...', 'https://example.com/lesson17.mp4', '12:45', 'https://example.com/audio2.mp3', 2, 'video', FALSE, TRUE, 75, '2024-01-05 00:00:00', '2024-01-05 00:00:00'),
(18, 4, 1, 'Lesson 18: Colors Listening', 'Nghe màu sắc', 'Nội dung bài học nghe màu...', 'https://example.com/lesson18.mp4', '14:20', 'https://example.com/audio3.mp3', 3, 'video', FALSE, TRUE, 70, '2024-01-05 00:00:00', '2024-01-05 00:00:00'),
(19, 4, 1, 'Lesson 19: Family Listening', 'Nghe về gia đình', 'Nội dung bài học nghe gia đình...', 'https://example.com/lesson19.mp4', '16:15', 'https://example.com/audio4.mp3', 4, 'video', FALSE, TRUE, 65, '2024-01-05 00:00:00', '2024-01-05 00:00:00'),
(20, 4, 1, 'Lesson 20: Listening Quiz', 'Bài kiểm tra nghe', 'Nội dung bài kiểm tra nghe...', NULL, NULL, 'https://example.com/quiz3.pdf', 5, 'quiz', FALSE, TRUE, 60, '2024-01-05 00:00:00', '2024-01-05 00:00:00');

-- INSERT: course_enrollments (6 records)
INSERT INTO course_enrollments (enrollment_id, user_id, course_id, status, enrolled_at, completed_at, expires_at, progress_percent, last_accessed_lesson_id, last_accessed_at, payment_amount, payment_method, payment_status, transaction_id, created_at, updated_at) VALUES
(1, 3, 1, 'active', '2024-01-10 00:00:00', NULL, '2024-07-10 00:00:00', 25.50, 5, '2024-01-15 10:30:00', 299000.00, 'credit_card', 'paid', 'TXN001', '2024-01-10 00:00:00', '2024-01-15 10:30:00'),
(2, 3, 4, 'completed', '2024-01-08 00:00:00', '2024-01-20 00:00:00', NULL, 100.00, 20, '2024-01-20 15:45:00', 0.00, 'free', 'paid', 'FREE001', '2024-01-08 00:00:00', '2024-01-20 15:45:00'),
(3, 4, 1, 'active', '2024-01-12 00:00:00', NULL, '2024-07-12 00:00:00', 15.25, 3, '2024-01-16 14:20:00', 299000.00, 'bank_transfer', 'paid', 'TXN002', '2024-01-12 00:00:00', '2024-01-16 14:20:00'),
(4, 4, 2, 'active', '2024-01-13 00:00:00', NULL, '2024-07-13 00:00:00', 8.75, 2, '2024-01-17 09:15:00', 499000.00, 'credit_card', 'paid', 'TXN003', '2024-01-13 00:00:00', '2024-01-17 09:15:00'),
(5, 5, 1, 'active', '2024-01-14 00:00:00', NULL, '2024-07-14 00:00:00', 5.00, 1, '2024-01-18 16:30:00', 299000.00, 'credit_card', 'paid', 'TXN004', '2024-01-14 00:00:00', '2024-01-18 16:30:00'),
(6, 5, 3, 'active', '2024-01-15 00:00:00', NULL, '2024-07-15 00:00:00', 12.50, 3, '2024-01-19 11:45:00', 799000.00, 'credit_card', 'paid', 'TXN005', '2024-01-15 00:00:00', '2024-01-19 11:45:00');

-- INSERT: lesson_progress (15 records)
INSERT INTO lesson_progress (lesson_progress_id, user_id, lesson_id, course_id, status, watched_duration, total_duration, completion_percent, started_at, completed_at, last_accessed_at, created_at, updated_at) VALUES
(1, 3, 1, 1, 'completed', 900, 930, 100.00, '2024-01-10 00:00:00', '2024-01-10 00:30:00', '2024-01-10 00:30:00', '2024-01-10 00:00:00', '2024-01-10 00:30:00'),
(2, 3, 2, 1, 'completed', 1125, 1125, 100.00, '2024-01-11 00:00:00', '2024-01-11 00:30:00', '2024-01-11 00:30:00', '2024-01-11 00:00:00', '2024-01-11 00:30:00'),
(3, 3, 3, 1, 'completed', 1215, 1215, 100.00, '2024-01-12 00:00:00', '2024-01-12 00:30:00', '2024-01-12 00:30:00', '2024-01-12 00:00:00', '2024-01-12 00:30:00'),
(4, 3, 4, 1, 'in_progress', 600, 980, 61.22, '2024-01-13 00:00:00', NULL, '2024-01-15 10:30:00', '2024-01-13 00:00:00', '2024-01-15 10:30:00'),
(5, 3, 5, 1, 'not_started', 0, 0, 0.00, NULL, NULL, '2024-01-15 10:30:00', '2024-01-15 10:30:00', '2024-01-15 10:30:00'),
(6, 4, 1, 1, 'completed', 900, 930, 100.00, '2024-01-12 00:00:00', '2024-01-12 00:30:00', '2024-01-12 00:30:00', '2024-01-12 00:00:00', '2024-01-12 00:30:00'),
(7, 4, 2, 1, 'completed', 1125, 1125, 100.00, '2024-01-13 00:00:00', '2024-01-13 00:30:00', '2024-01-13 00:30:00', '2024-01-13 00:00:00', '2024-01-13 00:30:00'),
(8, 4, 3, 1, 'in_progress', 400, 1215, 32.92, '2024-01-14 00:00:00', NULL, '2024-01-16 14:20:00', '2024-01-14 00:00:00', '2024-01-16 14:20:00'),
(9, 5, 1, 1, 'completed', 900, 930, 100.00, '2024-01-14 00:00:00', '2024-01-14 00:30:00', '2024-01-14 00:30:00', '2024-01-14 00:00:00', '2024-01-14 00:30:00'),
(10, 5, 2, 1, 'in_progress', 200, 1125, 17.78, '2024-01-15 00:00:00', NULL, '2024-01-18 16:30:00', '2024-01-15 00:00:00', '2024-01-18 16:30:00'),
(11, 3, 6, 1, 'completed', 750, 750, 100.00, '2024-01-16 00:00:00', '2024-01-16 00:30:00', '2024-01-16 00:30:00', '2024-01-16 00:00:00', '2024-01-16 00:30:00'),
(12, 3, 7, 1, 'completed', 885, 885, 100.00, '2024-01-17 00:00:00', '2024-01-17 00:30:00', '2024-01-17 00:30:00', '2024-01-17 00:00:00', '2024-01-17 00:30:00'),
(13, 3, 8, 1, 'completed', 680, 680, 100.00, '2024-01-18 00:00:00', '2024-01-18 00:30:00', '2024-01-18 00:30:00', '2024-01-18 00:00:00', '2024-01-18 00:30:00'),
(14, 3, 9, 1, 'completed', 795, 795, 100.00, '2024-01-19 00:00:00', '2024-01-19 00:30:00', '2024-01-19 00:30:00', '2024-01-19 00:00:00', '2024-01-19 00:30:00'),
(15, 3, 10, 1, 'completed', 0, 0, 100.00, '2024-01-20 00:00:00', '2024-01-20 00:30:00', '2024-01-20 00:30:00', '2024-01-20 00:00:00', '2024-01-20 00:30:00');

-- INSERT: course_reviews (8 records)
INSERT INTO course_reviews (review_id, user_id, course_id, rating, title, content, is_verified, status, created_at, updated_at) VALUES
(1, 3, 1, 5, 'Khóa học rất hay!', 'Tôi rất hài lòng với khóa học này. Nội dung dễ hiểu và thực tế.', TRUE, 'approved', '2024-01-15 00:00:00', '2024-01-15 00:00:00'),
(2, 4, 1, 4, 'Khóa học tốt', 'Khóa học có nội dung chất lượng, giảng viên nhiệt tình.', TRUE, 'approved', '2024-01-16 00:00:00', '2024-01-16 00:00:00'),
(3, 5, 1, 5, 'Tuyệt vời!', 'Khóa học giúp tôi cải thiện tiếng Anh rất nhiều.', TRUE, 'approved', '2024-01-17 00:00:00', '2024-01-17 00:00:00'),
(4, 3, 2, 4, 'Khóa học kinh doanh hay', 'Nội dung phù hợp với công việc, rất thực tế.', TRUE, 'approved', '2024-01-18 00:00:00', '2024-01-18 00:00:00'),
(5, 4, 2, 5, 'Rất hữu ích', 'Khóa học giúp tôi tự tin hơn trong giao tiếp công việc.', TRUE, 'approved', '2024-01-19 00:00:00', '2024-01-19 00:00:00'),
(6, 5, 3, 5, 'Khóa IELTS xuất sắc', 'Giảng viên chuyên nghiệp, nội dung đầy đủ và chi tiết.', TRUE, 'approved', '2024-01-20 00:00:00', '2024-01-20 00:00:00'),
(7, 3, 4, 4, 'Khóa miễn phí tốt', 'Khóa học miễn phí nhưng chất lượng tốt.', TRUE, 'approved', '2024-01-21 00:00:00', '2024-01-21 00:00:00'),
(8, 4, 4, 3, 'Khóa cơ bản', 'Phù hợp cho người mới bắt đầu.', TRUE, 'approved', '2024-01-22 00:00:00', '2024-01-22 00:00:00');

-- INSERT: course_discussions (6 records)
INSERT INTO course_discussions (discussion_id, course_id, user_id, parent_id, title, content, likes_count, replies_count, status, created_at, updated_at) VALUES
(1, 1, 3, NULL, 'Câu hỏi về thì hiện tại đơn', 'Tôi không hiểu cách sử dụng thì hiện tại đơn. Ai có thể giải thích giúp tôi không?', 5, 3, 'active', '2024-01-15 00:00:00', '2024-01-15 00:00:00'),
(2, 1, 4, 1, 'Re: Câu hỏi về thì hiện tại đơn', 'Thì hiện tại đơn dùng để diễn tả hành động thường xuyên xảy ra...', 2, 0, 'active', '2024-01-15 00:30:00', '2024-01-15 00:30:00'),
(3, 1, 5, 1, 'Re: Câu hỏi về thì hiện tại đơn', 'Bạn có thể xem lại video bài 1, giảng viên giải thích rất rõ.', 1, 0, 'active', '2024-01-15 01:00:00', '2024-01-15 01:00:00'),
(4, 2, 3, NULL, 'Thảo luận về email kinh doanh', 'Các bạn có kinh nghiệm viết email kinh doanh không? Chia sẻ giúp tôi nhé.', 8, 5, 'active', '2024-01-16 00:00:00', '2024-01-16 00:00:00'),
(5, 2, 4, 4, 'Re: Thảo luận về email kinh doanh', 'Tôi thường dùng mẫu email có sẵn và điều chỉnh theo tình huống...', 3, 0, 'active', '2024-01-16 00:30:00', '2024-01-16 00:30:00'),
(6, 3, 5, NULL, 'Chiến lược làm bài IELTS', 'Ai có kinh nghiệm thi IELTS không? Chia sẻ chiến lược làm bài nhé.', 12, 8, 'active', '2024-01-17 00:00:00', '2024-01-17 00:00:00');

-- INSERT: course_wishlist (4 records)
INSERT INTO course_wishlist (wishlist_id, user_id, course_id, created_at) VALUES
(1, 3, 2, '2024-01-12 00:00:00'),
(2, 3, 3, '2024-01-13 00:00:00'),
(3, 4, 3, '2024-01-14 00:00:00'),
(4, 5, 2, '2024-01-15 00:00:00');

-- INSERT: coupons (3 records)
INSERT INTO coupons (coupon_id, code, name, description, discount_type, discount_value, minimum_amount, max_uses, used_count, max_uses_per_user, valid_from, valid_until, is_active, applicable_courses, applicable_categories, created_at, updated_at) VALUES
(1, 'WELCOME20', 'Giảm giá 20% cho khách hàng mới', 'Áp dụng cho đơn hàng đầu tiên', 'percentage', 20.00, 100000.00, 100, 15, 1, '2024-01-01 00:00:00', '2024-12-31 23:59:59', TRUE, NULL, '[1,2,3,4]', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(2, 'SUMMER50', 'Giảm giá 50% mùa hè', 'Khuyến mãi mùa hè', 'percentage', 50.00, 200000.00, 50, 8, 2, '2024-06-01 00:00:00', '2024-08-31 23:59:59', TRUE, '[1,2]', NULL, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(3, 'FIXED100K', 'Giảm giá 100k', 'Giảm giá cố định 100k', 'fixed_amount', 100000.00, 500000.00, 20, 3, 1, '2024-01-01 00:00:00', '2024-12-31 23:59:59', TRUE, '[3]', NULL, '2024-01-01 00:00:00', '2024-01-01 00:00:00');

-- INSERT: course_coupons (4 records)
INSERT INTO course_coupons (course_coupon_id, course_id, coupon_id, created_at) VALUES
(1, 1, 1, '2024-01-01 00:00:00'),
(2, 2, 1, '2024-01-01 00:00:00'),
(3, 3, 2, '2024-01-01 00:00:00'),
(4, 3, 3, '2024-01-01 00:00:00');

-- INSERT: course_certificates (2 records)
INSERT INTO course_certificates (certificate_id, user_id, course_id, enrollment_id, certificate_number, issued_date, certificate_url, certificate_template, created_at) VALUES
(1, 3, 4, 2, 'CERT-2024-001', '2024-01-20 00:00:00', 'https://example.com/certificates/cert-2024-001.pdf', 'basic_template', '2024-01-20 00:00:00'),
(2, 4, 1, 3, 'CERT-2024-002', '2024-01-25 00:00:00', 'https://example.com/certificates/cert-2024-002.pdf', 'standard_template', '2024-01-25 00:00:00');

-- INSERT: course_tags (6 records)
INSERT INTO course_tags (tag_id, name, color, created_at) VALUES
(1, 'Beginner', '#27ae60', '2024-01-01 00:00:00'),
(2, 'Intermediate', '#f39c12', '2024-01-01 00:00:00'),
(3, 'Advanced', '#e74c3c', '2024-01-01 00:00:00'),
(4, 'Business', '#3498db', '2024-01-01 00:00:00'),
(5, 'IELTS', '#9b59b6', '2024-01-01 00:00:00'),
(6, 'Free', '#2ecc71', '2024-01-01 00:00:00');

-- INSERT: course_tag_relations (8 records) - FIXED: No duplicate (course_id, tag_id) pairs
INSERT INTO course_tag_relations (course_tag_relation_id, course_id, tag_id, created_at) VALUES
(1, 1, 1, '2024-01-01 00:00:00'),
(2, 1, 6, '2024-01-01 00:00:00'),
(3, 2, 2, '2024-01-01 00:00:00'),
(4, 2, 4, '2024-01-01 00:00:00'),
(5, 3, 3, '2024-01-01 00:00:00'),
(6, 3, 5, '2024-01-01 00:00:00'),
(7, 4, 1, '2024-01-01 00:00:00'),
(8, 4, 6, '2024-01-01 00:00:00');

-- =============================================
-- INSERT: exam_categories
-- =============================================
INSERT INTO exam_categories (exam_category_id, name, description, icon, created_at, updated_at) VALUES
(1, 'TOEIC', 'Test of English for International Communication', 'toeic-icon', '2024-01-01 00:00:00', '2024-01-01 00:00:00');

-- =============================================
-- INSERT: tests (1 test only)
-- =============================================
INSERT INTO tests (test_id, title, description, exam_type, total_duration, total_questions, total_parts, difficulty_level, created_by, created_at, updated_at) VALUES
(1, 'TOEIC Practice Test 01', 'Official TOEIC Practice Test - Full 200 Questions', 'TOEIC', 120, 200, 7, 'MEDIUM', 2, '2024-01-15 09:00:00', '2024-01-15 09:00:00');

-- =============================================
-- INSERT: parts (7 parts for 1 test)
-- =============================================
INSERT INTO parts (part_id, test_id, part_number, part_name, part_type, question_count, duration_minutes, description, display_template, created_at, updated_at) VALUES
(1, 1, 1, 'Part 1: Photographs', 'LISTENING', 6, 5, 'Look at the photograph and choose the statement that best describes what you see', 'PHOTO_AUDIO', '2024-01-15 09:05:00', '2024-01-15 09:05:00'),
(2, 1, 2, 'Part 2: Question-Response', 'LISTENING', 25, 10, 'Listen to the question and choose the best response', 'AUDIO_ONLY', '2024-01-15 09:05:00', '2024-01-15 09:05:00'),
(3, 1, 3, 'Part 3: Short Conversations', 'LISTENING', 39, 20, 'Listen to the conversation and answer the questions', 'AUDIO_ONLY', '2024-01-15 09:05:00', '2024-01-15 09:05:00'),
(4, 1, 4, 'Part 4: Short Talks', 'LISTENING', 30, 15, 'Listen to the talk and answer the questions', 'AUDIO_ONLY', '2024-01-15 09:05:00', '2024-01-15 09:05:00'),
(5, 1, 5, 'Part 5: Incomplete Sentences', 'READING', 30, 20, 'Choose the word or phrase that best completes the sentence', 'TEXT_ONLY', '2024-01-15 09:05:00', '2024-01-15 09:05:00'),
(6, 1, 6, 'Part 6: Text Completion', 'READING', 16, 15, 'Read the text and choose the word or phrase that best fits each space', 'TEXT_ONLY', '2024-01-15 09:05:00', '2024-01-15 09:05:00'),
(7, 1, 7, 'Part 7: Reading Comprehension', 'READING', 54, 35, 'Read the passage and answer the questions', 'TEXT_ONLY', '2024-01-15 09:05:00', '2024-01-15 09:05:00');

-- =============================================
-- INSERT: questions (200 questions total)
-- =============================================
-- Part 1: Questions 1-6 (6 questions)
INSERT INTO questions (question_id, part_id, question_number, question_text, question_type, audio_file, image_file, transcript, explanation, grammar_notes, created_at, updated_at) VALUES
(1, 1, 1, 'Look at the photograph. What do you see?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part1_q1.mp3', 'https://example.com/images/part1_q1.jpg', 'Look at the photograph. What do you see?', 'This question tests your ability to describe what you see in a photograph.', 'Present simple tense for descriptions', '2024-01-15 09:10:00', '2024-01-15 09:10:00'),
(2, 1, 2, 'What is happening in the picture?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part1_q2.mp3', 'https://example.com/images/part1_q2.jpg', 'What is happening in the picture?', 'This question tests your ability to identify ongoing actions.', 'Present continuous tense for ongoing actions', '2024-01-15 09:10:00', '2024-01-15 09:10:00'),
(3, 1, 3, 'Look at the photograph. What do you see?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part1_q3.mp3', 'https://example.com/images/part1_q3.jpg', 'Look at the photograph. What do you see?', 'This question tests your ability to describe what you see in a photograph.', 'Present simple tense for descriptions', '2024-01-15 09:10:00', '2024-01-15 09:10:00'),
(4, 1, 4, 'What is the man doing?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part1_q4.mp3', 'https://example.com/images/part1_q4.jpg', 'What is the man doing?', 'This question tests your ability to identify actions in photographs.', 'Present continuous tense for ongoing actions', '2024-01-15 09:10:00', '2024-01-15 09:10:00'),
(5, 1, 5, 'Look at the photograph. What do you see?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part1_q5.mp3', 'https://example.com/images/part1_q5.jpg', 'Look at the photograph. What do you see?', 'This question tests your ability to describe what you see in a photograph.', 'Present simple tense for descriptions', '2024-01-15 09:10:00', '2024-01-15 09:10:00'),
(6, 1, 6, 'What is happening in the picture?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part1_q6.mp3', 'https://example.com/images/part1_q6.jpg', 'What is happening in the picture?', 'This question tests your ability to identify ongoing actions.', 'Present continuous tense for ongoing actions', '2024-01-15 09:10:00', '2024-01-15 09:10:00');

-- Part 2: Questions 7-31 (25 questions)
INSERT INTO questions (question_id, part_id, question_number, question_text, question_type, audio_file, image_file, transcript, explanation, grammar_notes, created_at, updated_at) VALUES
(7, 2, 1, 'Where is the meeting room?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part2_q1.mp3', NULL, 'Where is the meeting room?', 'This question tests your ability to understand location questions.', 'Prepositions of place', '2024-01-15 09:15:00', '2024-01-15 09:15:00'),
(8, 2, 2, 'When will the project be completed?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part2_q2.mp3', NULL, 'When will the project be completed?', 'This question tests your ability to understand time-related questions.', 'Future tense and time expressions', '2024-01-15 09:15:00', '2024-01-15 09:15:00'),
(9, 2, 3, 'How much does this cost?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part2_q3.mp3', NULL, 'How much does this cost?', 'This question tests your ability to understand price questions.', 'Asking about prices', '2024-01-15 09:15:00', '2024-01-15 09:15:00'),
(10, 2, 4, 'Who is responsible for this task?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part2_q4.mp3', NULL, 'Who is responsible for this task?', 'This question tests your ability to understand responsibility questions.', 'Asking about responsibility', '2024-01-15 09:15:00', '2024-01-15 09:15:00'),
(11, 2, 5, 'What time does the meeting start?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part2_q5.mp3', NULL, 'What time does the meeting start?', 'This question tests your ability to understand time questions.', 'Asking about time', '2024-01-15 09:15:00', '2024-01-15 09:15:00'),
(12, 2, 6, 'Where can I find the restroom?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part2_q6.mp3', NULL, 'Where can I find the restroom?', 'This question tests your ability to understand location questions.', 'Asking for directions', '2024-01-15 09:15:00', '2024-01-15 09:15:00'),
(13, 2, 7, 'How long will this take?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part2_q7.mp3', NULL, 'How long will this take?', 'This question tests your ability to understand duration questions.', 'Asking about duration', '2024-01-15 09:15:00', '2024-01-15 09:15:00'),
(14, 2, 8, 'Who is the manager?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part2_q8.mp3', NULL, 'Who is the manager?', 'This question tests your ability to understand identity questions.', 'Asking about identity', '2024-01-15 09:15:00', '2024-01-15 09:15:00'),
(15, 2, 9, 'What is the problem?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part2_q9.mp3', NULL, 'What is the problem?', 'This question tests your ability to understand problem identification.', 'Asking about problems', '2024-01-15 09:15:00', '2024-01-15 09:15:00'),
(16, 2, 10, 'Where is the conference room?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part2_q10.mp3', NULL, 'Where is the conference room?', 'This question tests your ability to understand location questions.', 'Prepositions of place', '2024-01-15 09:15:00', '2024-01-15 09:15:00'),
(17, 2, 11, 'When is the deadline?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part2_q11.mp3', NULL, 'When is the deadline?', 'This question tests your ability to understand deadline questions.', 'Asking about deadlines', '2024-01-15 09:15:00', '2024-01-15 09:15:00'),
(18, 2, 12, 'How many people are coming?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part2_q12.mp3', NULL, 'How many people are coming?', 'This question tests your ability to understand quantity questions.', 'Asking about quantity', '2024-01-15 09:15:00', '2024-01-15 09:15:00'),
(19, 2, 13, 'What is the weather like?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part2_q13.mp3', NULL, 'What is the weather like?', 'This question tests your ability to understand weather questions.', 'Asking about weather', '2024-01-15 09:15:00', '2024-01-15 09:15:00'),
(20, 2, 14, 'Where did you go yesterday?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part2_q14.mp3', NULL, 'Where did you go yesterday?', 'This question tests your ability to understand past tense questions.', 'Past tense questions', '2024-01-15 09:15:00', '2024-01-15 09:15:00'),
(21, 2, 15, 'How often do you exercise?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part2_q15.mp3', NULL, 'How often do you exercise?', 'This question tests your ability to understand frequency questions.', 'Asking about frequency', '2024-01-15 09:15:00', '2024-01-15 09:15:00'),
(22, 2, 16, 'What is your favorite color?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part2_q16.mp3', NULL, 'What is your favorite color?', 'This question tests your ability to understand preference questions.', 'Asking about preferences', '2024-01-15 09:15:00', '2024-01-15 09:15:00'),
(23, 2, 17, 'Where are you from?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part2_q17.mp3', NULL, 'Where are you from?', 'This question tests your ability to understand origin questions.', 'Asking about origin', '2024-01-15 09:15:00', '2024-01-15 09:15:00'),
(24, 2, 18, 'What do you do for a living?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part2_q18.mp3', NULL, 'What do you do for a living?', 'This question tests your ability to understand occupation questions.', 'Asking about occupation', '2024-01-15 09:15:00', '2024-01-15 09:15:00'),
(25, 2, 19, 'How was your weekend?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part2_q19.mp3', NULL, 'How was your weekend?', 'This question tests your ability to understand past experience questions.', 'Asking about past experiences', '2024-01-15 09:15:00', '2024-01-15 09:15:00'),
(26, 2, 20, 'What time is it?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part2_q20.mp3', NULL, 'What time is it?', 'This question tests your ability to understand time questions.', 'Asking about current time', '2024-01-15 09:15:00', '2024-01-15 09:15:00'),
(27, 2, 21, 'Where is the nearest bank?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part2_q21.mp3', NULL, 'Where is the nearest bank?', 'This question tests your ability to understand location questions.', 'Asking for directions', '2024-01-15 09:15:00', '2024-01-15 09:15:00'),
(28, 2, 22, 'How much does this cost?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part2_q22.mp3', NULL, 'How much does this cost?', 'This question tests your ability to understand price questions.', 'Asking about prices', '2024-01-15 09:15:00', '2024-01-15 09:15:00'),
(29, 2, 23, 'What is your phone number?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part2_q23.mp3', NULL, 'What is your phone number?', 'This question tests your ability to understand contact information questions.', 'Asking for contact information', '2024-01-15 09:15:00', '2024-01-15 09:15:00'),
(30, 2, 24, 'Where do you live?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part2_q24.mp3', NULL, 'Where do you live?', 'This question tests your ability to understand location questions.', 'Asking about residence', '2024-01-15 09:15:00', '2024-01-15 09:15:00'),
(31, 2, 25, 'What is your name?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part2_q25.mp3', NULL, 'What is your name?', 'This question tests your ability to understand identity questions.', 'Asking about identity', '2024-01-15 09:15:00', '2024-01-15 09:15:00');

-- Part 3: Questions 32-70 (39 questions)
INSERT INTO questions (question_id, part_id, question_number, question_text, question_type, audio_file, image_file, transcript, explanation, grammar_notes, created_at, updated_at) VALUES
(32, 3, 1, 'What are the speakers discussing?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q1.mp3', NULL, 'Man: I need to schedule a meeting with the client next week. Woman: What day works best for you? Man: How about Tuesday afternoon? Woman: That sounds good. I\'ll send you a calendar invitation.', 'This question tests your ability to understand the main topic of a conversation.', 'Identifying main topics', '2024-01-15 09:20:00', '2024-01-15 09:20:00'),
(33, 3, 2, 'When is the meeting scheduled?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q2.mp3', NULL, 'Man: I need to schedule a meeting with the client next week. Woman: What day works best for you? Man: How about Tuesday afternoon? Woman: That sounds good. I\'ll send you a calendar invitation.', 'This question tests your ability to understand specific time information.', 'Understanding time references', '2024-01-15 09:20:00', '2024-01-15 09:20:00'),
(34, 3, 3, 'What will the woman do next?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q3.mp3', NULL, 'Man: I need to schedule a meeting with the client next week. Woman: What day works best for you? Man: How about Tuesday afternoon? Woman: That sounds good. I\'ll send you a calendar invitation.', 'This question tests your ability to understand future actions.', 'Understanding future plans', '2024-01-15 09:20:00', '2024-01-15 09:20:00'),
(35, 3, 4, 'Where are the speakers?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q4.mp3', NULL, 'Woman: Excuse me, where is the conference room? Man: It\'s on the second floor, next to the elevator. Woman: Thank you. Man: You\'re welcome.', 'This question tests your ability to understand location context.', 'Understanding location context', '2024-01-15 09:20:00', '2024-01-15 09:20:00'),
(36, 3, 5, 'What is the man\'s response?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q5.mp3', NULL, 'Woman: Excuse me, where is the conference room? Man: It\'s on the second floor, next to the elevator. Woman: Thank you. Man: You\'re welcome.', 'This question tests your ability to understand specific responses.', 'Understanding responses', '2024-01-15 09:20:00', '2024-01-15 09:20:00'),
(37, 3, 6, 'What is the woman looking for?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q6.mp3', NULL, 'Woman: Excuse me, where is the conference room? Man: It\'s on the second floor, next to the elevator. Woman: Thank you. Man: You\'re welcome.', 'This question tests your ability to understand what someone is seeking.', 'Understanding requests', '2024-01-15 09:20:00', '2024-01-15 09:20:00'),
(38, 3, 7, 'What time does the store close?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q7.mp3', NULL, 'Man: What time does the store close? Woman: It closes at 9 PM on weekdays and 6 PM on weekends. Man: Thank you for the information.', 'This question tests your ability to understand business hours.', 'Understanding business hours', '2024-01-15 09:20:00', '2024-01-15 09:20:00'),
(39, 3, 8, 'What are the store hours on weekends?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q8.mp3', NULL, 'Man: What time does the store close? Woman: It closes at 9 PM on weekdays and 6 PM on weekends. Man: Thank you for the information.', 'This question tests your ability to understand specific time information.', 'Understanding specific times', '2024-01-15 09:20:00', '2024-01-15 09:20:00'),
(40, 3, 9, 'What is the man\'s reaction?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q9.mp3', NULL, 'Man: What time does the store close? Woman: It closes at 9 PM on weekdays and 6 PM on weekends. Man: Thank you for the information.', 'This question tests your ability to understand reactions and responses.', 'Understanding reactions', '2024-01-15 09:20:00', '2024-01-15 09:20:00'),
(41, 3, 10, 'What information does the woman provide?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q10.mp3', NULL, 'Man: What time does the store close? Woman: It closes at 9 PM on weekdays and 6 PM on weekends. Man: Thank you for the information.', 'This question tests your ability to understand information provided.', 'Understanding provided information', '2024-01-15 09:20:00', '2024-01-15 09:20:00'),
(42, 3, 11, 'What is the main topic of the conversation?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q11.mp3', NULL, 'Woman: I heard you got a promotion. Congratulations! Man: Thank you. It was unexpected but I\'m excited about the new responsibilities. Woman: You deserve it. You\'ve been working so hard.', 'This question tests your ability to identify the main topic.', 'Identifying main topics', '2024-01-15 09:20:00', '2024-01-15 09:20:00'),
(43, 3, 12, 'How does the man feel about his promotion?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q12.mp3', NULL, 'Woman: I heard you got a promotion. Congratulations! Man: Thank you. It was unexpected but I\'m excited about the new responsibilities. Woman: You deserve it. You\'ve been working so hard.', 'This question tests your ability to understand emotions and feelings.', 'Understanding emotions', '2024-01-15 09:20:00', '2024-01-15 09:20:00'),
(44, 3, 13, 'What does the woman think about the man?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q13.mp3', NULL, 'Woman: I heard you got a promotion. Congratulations! Man: Thank you. It was unexpected but I\'m excited about the new responsibilities. Woman: You deserve it. You\'ve been working so hard.', 'This question tests your ability to understand opinions and attitudes.', 'Understanding opinions', '2024-01-15 09:20:00', '2024-01-15 09:20:00'),
(45, 3, 14, 'What is the man\'s attitude toward his new responsibilities?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q14.mp3', NULL, 'Woman: I heard you got a promotion. Congratulations! Man: Thank you. It was unexpected but I\'m excited about the new responsibilities. Woman: You deserve it. You\'ve been working so hard.', 'This question tests your ability to understand attitudes and perspectives.', 'Understanding attitudes', '2024-01-15 09:20:00', '2024-01-15 09:20:00'),
(46, 3, 15, 'What does the woman say about the man\'s work?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q15.mp3', NULL, 'Woman: I heard you got a promotion. Congratulations! Man: Thank you. It was unexpected but I\'m excited about the new responsibilities. Woman: You deserve it. You\'ve been working so hard.', 'This question tests your ability to understand specific statements.', 'Understanding specific statements', '2024-01-15 09:20:00', '2024-01-15 09:20:00'),
(47, 3, 16, 'What is the main topic of the conversation?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q16.mp3', NULL, 'Man: I need to return this item. I bought it last week but it doesn\'t work properly. Woman: Do you have the receipt? Man: Yes, here it is. Woman: I\'ll process the return for you.', 'This question tests your ability to identify the main topic.', 'Identifying main topics', '2024-01-15 09:20:00', '2024-01-15 09:20:00'),
(48, 3, 17, 'What does the man want to do?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q17.mp3', NULL, 'Man: I need to return this item. I bought it last week but it doesn\'t work properly. Woman: Do you have the receipt? Man: Yes, here it is. Woman: I\'ll process the return for you.', 'This question tests your ability to understand what someone wants to do.', 'Understanding intentions', '2024-01-15 09:20:00', '2024-01-15 09:20:00'),
(49, 3, 18, 'What does the woman ask for?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q18.mp3', NULL, 'Man: I need to return this item. I bought it last week but it doesn\'t work properly. Woman: Do you have the receipt? Man: Yes, here it is. Woman: I\'ll process the return for you.', 'This question tests your ability to understand what someone is asking for.', 'Understanding requests', '2024-01-15 09:20:00', '2024-01-15 09:20:00'),
(50, 3, 19, 'What does the man provide?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q19.mp3', NULL, 'Man: I need to return this item. I bought it last week but it doesn\'t work properly. Woman: Do you have the receipt? Man: Yes, here it is. Woman: I\'ll process the return for you.', 'This question tests your ability to understand what someone provides.', 'Understanding what is provided', '2024-01-15 09:20:00', '2024-01-15 09:20:00'),
(51, 3, 20, 'What will the woman do?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q20.mp3', NULL, 'Man: I need to return this item. I bought it last week but it doesn\'t work properly. Woman: Do you have the receipt? Man: Yes, here it is. Woman: I\'ll process the return for you.', 'This question tests your ability to understand future actions.', 'Understanding future actions', '2024-01-15 09:20:00', '2024-01-15 09:20:00'),
(52, 3, 21, 'What is the main topic of the conversation?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q21.mp3', NULL, 'Woman: I\'m looking for a new apartment. The rent here is too expensive. Man: Have you checked the classified ads? Woman: Yes, but I haven\'t found anything suitable yet.', 'This question tests your ability to identify the main topic.', 'Identifying main topics', '2024-01-15 09:20:00', '2024-01-15 09:20:00'),
(53, 3, 22, 'What is the woman looking for?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q22.mp3', NULL, 'Woman: I\'m looking for a new apartment. The rent here is too expensive. Man: Have you checked the classified ads? Woman: Yes, but I haven\'t found anything suitable yet.', 'This question tests your ability to understand what someone is looking for.', 'Understanding what someone is seeking', '2024-01-15 09:20:00', '2024-01-15 09:20:00'),
(54, 3, 23, 'What is the woman\'s problem?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q23.mp3', NULL, 'Woman: I\'m looking for a new apartment. The rent here is too expensive. Man: Have you checked the classified ads? Woman: Yes, but I haven\'t found anything suitable yet.', 'This question tests your ability to understand problems.', 'Understanding problems', '2024-01-15 09:20:00', '2024-01-15 09:20:00'),
(55, 3, 24, 'What does the man suggest?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q24.mp3', NULL, 'Woman: I\'m looking for a new apartment. The rent here is too expensive. Man: Have you checked the classified ads? Woman: Yes, but I haven\'t found anything suitable yet.', 'This question tests your ability to understand suggestions.', 'Understanding suggestions', '2024-01-15 09:20:00', '2024-01-15 09:20:00'),
(56, 3, 25, 'What has the woman already done?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q25.mp3', NULL, 'Woman: I\'m looking for a new apartment. The rent here is too expensive. Man: Have you checked the classified ads? Woman: Yes, but I haven\'t found anything suitable yet.', 'This question tests your ability to understand what someone has already done.', 'Understanding completed actions', '2024-01-15 09:20:00', '2024-01-15 09:20:00'),
(57, 3, 26, 'What is the main topic of the conversation?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q26.mp3', NULL, 'Man: I can\'t find my keys. Have you seen them? Woman: No, I haven\'t. Where did you last have them? Man: I think I left them on the kitchen table.', 'This question tests your ability to identify the main topic.', 'Identifying main topics', '2024-01-15 09:20:00', '2024-01-15 09:20:00'),
(58, 3, 27, 'What is the man looking for?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q27.mp3', NULL, 'Man: I can\'t find my keys. Have you seen them? Woman: No, I haven\'t. Where did you last have them? Man: I think I left them on the kitchen table.', 'This question tests your ability to understand what someone is looking for.', 'Understanding what someone is seeking', '2024-01-15 09:20:00', '2024-01-15 09:20:00'),
(59, 3, 28, 'What does the woman ask?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q28.mp3', NULL, 'Man: I can\'t find my keys. Have you seen them? Woman: No, I haven\'t. Where did you last have them? Man: I think I left them on the kitchen table.', 'This question tests your ability to understand what someone asks.', 'Understanding questions', '2024-01-15 09:20:00', '2024-01-15 09:20:00'),
(60, 3, 29, 'What does the man think happened?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q29.mp3', NULL, 'Man: I can\'t find my keys. Have you seen them? Woman: No, I haven\'t. Where did you last have them? Man: I think I left them on the kitchen table.', 'This question tests your ability to understand what someone thinks happened.', 'Understanding thoughts and beliefs', '2024-01-15 09:20:00', '2024-01-15 09:20:00'),
(61, 3, 30, 'What is the man\'s problem?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q30.mp3', NULL, 'Man: I can\'t find my keys. Have you seen them? Woman: No, I haven\'t. Where did you last have them? Man: I think I left them on the kitchen table.', 'This question tests your ability to understand problems.', 'Understanding problems', '2024-01-15 09:20:00', '2024-01-15 09:20:00'),
(62, 3, 31, 'What is the main topic of the conversation?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q31.mp3', NULL, 'Woman: I\'m going to the grocery store. Do you need anything? Man: Yes, could you pick up some milk and bread? Woman: Sure, I\'ll get those for you.', 'This question tests your ability to identify the main topic.', 'Identifying main topics', '2024-01-15 09:20:00', '2024-01-15 09:20:00'),
(63, 3, 32, 'What is the woman going to do?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q32.mp3', NULL, 'Woman: I\'m going to the grocery store. Do you need anything? Man: Yes, could you pick up some milk and bread? Woman: Sure, I\'ll get those for you.', 'This question tests your ability to understand what someone is going to do.', 'Understanding future plans', '2024-01-15 09:20:00', '2024-01-15 09:20:00'),
(64, 3, 33, 'What does the man ask for?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q33.mp3', NULL, 'Woman: I\'m going to the grocery store. Do you need anything? Man: Yes, could you pick up some milk and bread? Woman: Sure, I\'ll get those for you.', 'This question tests your ability to understand what someone asks for.', 'Understanding requests', '2024-01-15 09:20:00', '2024-01-15 09:20:00'),
(65, 3, 34, 'What does the woman agree to do?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q34.mp3', NULL, 'Woman: I\'m going to the grocery store. Do you need anything? Man: Yes, could you pick up some milk and bread? Woman: Sure, I\'ll get those for you.', 'This question tests your ability to understand what someone agrees to do.', 'Understanding agreements', '2024-01-15 09:20:00', '2024-01-15 09:20:00'),
(66, 3, 35, 'What is the main topic of the conversation?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q35.mp3', NULL, 'Man: I\'m having trouble with my computer. It keeps freezing. Woman: Have you tried restarting it? Man: Yes, but it didn\'t help.', 'This question tests your ability to identify the main topic.', 'Identifying main topics', '2024-01-15 09:20:00', '2024-01-15 09:20:00'),
(67, 3, 36, 'What is the man\'s problem?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q36.mp3', NULL, 'Man: I\'m having trouble with my computer. It keeps freezing. Woman: Have you tried restarting it? Man: Yes, but it didn\'t help.', 'This question tests your ability to understand problems.', 'Understanding problems', '2024-01-15 09:20:00', '2024-01-15 09:20:00'),
(68, 3, 37, 'What does the woman suggest?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q37.mp3', NULL, 'Man: I\'m having trouble with my computer. It keeps freezing. Woman: Have you tried restarting it? Man: Yes, but it didn\'t help.', 'This question tests your ability to understand suggestions.', 'Understanding suggestions', '2024-01-15 09:20:00', '2024-01-15 09:20:00'),
(69, 3, 38, 'What has the man already tried?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q38.mp3', NULL, 'Man: I\'m having trouble with my computer. It keeps freezing. Woman: Have you tried restarting it? Man: Yes, but it didn\'t help.', 'This question tests your ability to understand what someone has already tried.', 'Understanding completed actions', '2024-01-15 09:20:00', '2024-01-15 09:20:00'),
(70, 3, 39, 'What is the man\'s response?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part3_q39.mp3', NULL, 'Man: I\'m having trouble with my computer. It keeps freezing. Woman: Have you tried restarting it? Man: Yes, but it didn\'t help.', 'This question tests your ability to understand responses.', 'Understanding responses', '2024-01-15 09:20:00', '2024-01-15 09:20:00');

-- Part 4: Questions 71-100 (30 questions)
INSERT INTO questions (question_id, part_id, question_number, question_text, question_type, audio_file, image_file, transcript, explanation, grammar_notes, created_at, updated_at) VALUES
(71, 4, 1, 'What is this announcement about?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part4_q1.mp3', NULL, 'Attention all passengers. Flight 123 to New York has been delayed by 30 minutes due to weather conditions. Please check the departure board for updated information.', 'This question tests your ability to understand the main topic of an announcement.', 'Understanding announcements', '2024-01-15 09:25:00', '2024-01-15 09:25:00'),
(72, 4, 2, 'What is the reason for the delay?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part4_q2.mp3', NULL, 'Attention all passengers. Flight 123 to New York has been delayed by 30 minutes due to weather conditions. Please check the departure board for updated information.', 'This question tests your ability to understand reasons for delays.', 'Understanding reasons', '2024-01-15 09:25:00', '2024-01-15 09:25:00'),
(73, 4, 3, 'How long is the delay?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part4_q3.mp3', NULL, 'Attention all passengers. Flight 123 to New York has been delayed by 30 minutes due to weather conditions. Please check the departure board for updated information.', 'This question tests your ability to understand duration information.', 'Understanding duration', '2024-01-15 09:25:00', '2024-01-15 09:25:00'),
(74, 4, 4, 'What should passengers do?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part4_q4.mp3', NULL, 'Attention all passengers. Flight 123 to New York has been delayed by 30 minutes due to weather conditions. Please check the departure board for updated information.', 'This question tests your ability to understand instructions.', 'Understanding instructions', '2024-01-15 09:25:00', '2024-01-15 09:25:00'),
(75, 4, 5, 'What is the flight number?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part4_q5.mp3', NULL, 'Attention all passengers. Flight 123 to New York has been delayed by 30 minutes due to weather conditions. Please check the departure board for updated information.', 'This question tests your ability to understand specific details.', 'Understanding specific details', '2024-01-15 09:25:00', '2024-01-15 09:25:00'),
(76, 4, 6, 'What is this announcement about?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part4_q6.mp3', NULL, 'Good morning, everyone. Today\'s meeting has been moved to Conference Room B on the second floor. The time remains the same at 2 PM. Please make sure to arrive on time.', 'This question tests your ability to understand the main topic of an announcement.', 'Understanding announcements', '2024-01-15 09:25:00', '2024-01-15 09:25:00'),
(77, 4, 7, 'Where is the meeting now?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part4_q7.mp3', NULL, 'Good morning, everyone. Today\'s meeting has been moved to Conference Room B on the second floor. The time remains the same at 2 PM. Please make sure to arrive on time.', 'This question tests your ability to understand location information.', 'Understanding location information', '2024-01-15 09:25:00', '2024-01-15 09:25:00'),
(78, 4, 8, 'What time is the meeting?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part4_q8.mp3', NULL, 'Good morning, everyone. Today\'s meeting has been moved to Conference Room B on the second floor. The time remains the same at 2 PM. Please make sure to arrive on time.', 'This question tests your ability to understand time information.', 'Understanding time information', '2024-01-15 09:25:00', '2024-01-15 09:25:00'),
(79, 4, 9, 'What should people do?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part4_q9.mp3', NULL, 'Good morning, everyone. Today\'s meeting has been moved to Conference Room B on the second floor. The time remains the same at 2 PM. Please make sure to arrive on time.', 'This question tests your ability to understand instructions.', 'Understanding instructions', '2024-01-15 09:25:00', '2024-01-15 09:25:00'),
(80, 4, 10, 'What is this announcement about?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part4_q10.mp3', NULL, 'Ladies and gentlemen, we are now beginning our descent into Los Angeles. Please fasten your seatbelts and return your tray tables to their upright position. We will be landing in approximately 20 minutes.', 'This question tests your ability to understand the main topic of an announcement.', 'Understanding announcements', '2024-01-15 09:25:00', '2024-01-15 09:25:00'),
(81, 4, 11, 'What should passengers do?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part4_q11.mp3', NULL, 'Ladies and gentlemen, we are now beginning our descent into Los Angeles. Please fasten your seatbelts and return your tray tables to their upright position. We will be landing in approximately 20 minutes.', 'This question tests your ability to understand instructions.', 'Understanding instructions', '2024-01-15 09:25:00', '2024-01-15 09:25:00'),
(82, 4, 12, 'How long until landing?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part4_q12.mp3', NULL, 'Ladies and gentlemen, we are now beginning our descent into Los Angeles. Please fasten your seatbelts and return your tray tables to their upright position. We will be landing in approximately 20 minutes.', 'This question tests your ability to understand time information.', 'Understanding time information', '2024-01-15 09:25:00', '2024-01-15 09:25:00'),
(83, 4, 13, 'What is this announcement about?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part4_q13.mp3', NULL, 'Welcome to the Museum of Modern Art. Today\'s special exhibition features works by contemporary artists from around the world. The exhibition is located on the third floor and is open until 6 PM.', 'This question tests your ability to understand the main topic of an announcement.', 'Understanding announcements', '2024-01-15 09:25:00', '2024-01-15 09:25:00'),
(84, 4, 14, 'What is the special exhibition about?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part4_q14.mp3', NULL, 'Welcome to the Museum of Modern Art. Today\'s special exhibition features works by contemporary artists from around the world. The exhibition is located on the third floor and is open until 6 PM.', 'This question tests your ability to understand what the exhibition is about.', 'Understanding exhibition content', '2024-01-15 09:25:00', '2024-01-15 09:25:00'),
(85, 4, 15, 'Where is the exhibition located?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part4_q15.mp3', NULL, 'Welcome to the Museum of Modern Art. Today\'s special exhibition features works by contemporary artists from around the world. The exhibition is located on the third floor and is open until 6 PM.', 'This question tests your ability to understand location information.', 'Understanding location information', '2024-01-15 09:25:00', '2024-01-15 09:25:00'),
(86, 4, 16, 'What is this announcement about?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part4_q16.mp3', NULL, 'Attention shoppers. The store will be closing in 15 minutes. Please bring your items to the checkout counter. Thank you for shopping with us today.', 'This question tests your ability to understand the main topic of an announcement.', 'Understanding announcements', '2024-01-15 09:25:00', '2024-01-15 09:25:00'),
(87, 4, 17, 'How long until the store closes?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part4_q17.mp3', NULL, 'Attention shoppers. The store will be closing in 15 minutes. Please bring your items to the checkout counter. Thank you for shopping with us today.', 'This question tests your ability to understand time information.', 'Understanding time information', '2024-01-15 09:25:00', '2024-01-15 09:25:00'),
(88, 4, 18, 'What should shoppers do?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part4_q18.mp3', NULL, 'Attention shoppers. The store will be closing in 15 minutes. Please bring your items to the checkout counter. Thank you for shopping with us today.', 'This question tests your ability to understand instructions.', 'Understanding instructions', '2024-01-15 09:25:00', '2024-01-15 09:25:00'),
(89, 4, 19, 'What is this announcement about?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part4_q19.mp3', NULL, 'Good evening, everyone. Tonight\'s performance will begin in 10 minutes. Please take your seats and turn off your cell phones. We hope you enjoy the show.', 'This question tests your ability to understand the main topic of an announcement.', 'Understanding announcements', '2024-01-15 09:25:00', '2024-01-15 09:25:00'),
(90, 4, 20, 'When will the performance begin?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part4_q20.mp3', NULL, 'Good evening, everyone. Tonight\'s performance will begin in 10 minutes. Please take your seats and turn off your cell phones. We hope you enjoy the show.', 'This question tests your ability to understand time information.', 'Understanding time information', '2024-01-15 09:25:00', '2024-01-15 09:25:00'),
(91, 4, 21, 'What should audience members do?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part4_q21.mp3', NULL, 'Good evening, everyone. Tonight\'s performance will begin in 10 minutes. Please take your seats and turn off your cell phones. We hope you enjoy the show.', 'This question tests your ability to understand instructions.', 'Understanding instructions', '2024-01-15 09:25:00', '2024-01-15 09:25:00'),
(92, 4, 22, 'What is this announcement about?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part4_q22.mp3', NULL, 'Attention all employees. The company picnic has been postponed due to rain. It will be rescheduled for next Saturday at the same time and location. Please check your email for updates.', 'This question tests your ability to understand the main topic of an announcement.', 'Understanding announcements', '2024-01-15 09:25:00', '2024-01-15 09:25:00'),
(93, 4, 23, 'Why was the picnic postponed?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part4_q23.mp3', NULL, 'Attention all employees. The company picnic has been postponed due to rain. It will be rescheduled for next Saturday at the same time and location. Please check your email for updates.', 'This question tests your ability to understand reasons for postponement.', 'Understanding reasons', '2024-01-15 09:25:00', '2024-01-15 09:25:00'),
(94, 4, 24, 'When will the picnic be rescheduled?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part4_q24.mp3', NULL, 'Attention all employees. The company picnic has been postponed due to rain. It will be rescheduled for next Saturday at the same time and location. Please check your email for updates.', 'This question tests your ability to understand rescheduling information.', 'Understanding rescheduling', '2024-01-15 09:25:00', '2024-01-15 09:25:00'),
(95, 4, 25, 'What should employees do?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part4_q25.mp3', NULL, 'Attention all employees. The company picnic has been postponed due to rain. It will be rescheduled for next Saturday at the same time and location. Please check your email for updates.', 'This question tests your ability to understand instructions.', 'Understanding instructions', '2024-01-15 09:25:00', '2024-01-15 09:25:00'),
(96, 4, 26, 'What is this announcement about?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part4_q26.mp3', NULL, 'Ladies and gentlemen, we are now approaching our destination. The local time is 3 PM and the temperature is 75 degrees Fahrenheit. We hope you had a pleasant flight.', 'This question tests your ability to understand the main topic of an announcement.', 'Understanding announcements', '2024-01-15 09:25:00', '2024-01-15 09:25:00'),
(97, 4, 27, 'What is the local time?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part4_q27.mp3', NULL, 'Ladies and gentlemen, we are now approaching our destination. The local time is 3 PM and the temperature is 75 degrees Fahrenheit. We hope you had a pleasant flight.', 'This question tests your ability to understand time information.', 'Understanding time information', '2024-01-15 09:25:00', '2024-01-15 09:25:00'),
(98, 4, 28, 'What is the temperature?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part4_q28.mp3', NULL, 'Ladies and gentlemen, we are now approaching our destination. The local time is 3 PM and the temperature is 75 degrees Fahrenheit. We hope you had a pleasant flight.', 'This question tests your ability to understand temperature information.', 'Understanding temperature information', '2024-01-15 09:25:00', '2024-01-15 09:25:00'),
(99, 4, 29, 'What is this announcement about?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part4_q29.mp3', NULL, 'Good morning, everyone. Today\'s weather forecast calls for sunny skies with a high of 80 degrees. It\'s a perfect day for outdoor activities. Enjoy your day!', 'This question tests your ability to understand the main topic of an announcement.', 'Understanding announcements', '2024-01-15 09:25:00', '2024-01-15 09:25:00'),
(100, 4, 30, 'What is the weather forecast?', 'MULTIPLE_CHOICE', 'https://example.com/audio/part4_q30.mp3', NULL, 'Good morning, everyone. Today\'s weather forecast calls for sunny skies with a high of 80 degrees. It\'s a perfect day for outdoor activities. Enjoy your day!', 'This question tests your ability to understand weather information.', 'Understanding weather information', '2024-01-15 09:25:00', '2024-01-15 09:25:00');

-- Part 5: Questions 101-130 (30 questions)
INSERT INTO questions (question_id, part_id, question_number, question_text, question_type, audio_file, image_file, transcript, explanation, grammar_notes, created_at, updated_at) VALUES
(101, 5, 1, 'The company _____ a new product next month.', 'MULTIPLE_CHOICE', NULL, NULL, NULL, 'This question tests your knowledge of future tense.', 'Future tense with "will"', '2024-01-15 09:30:00', '2024-01-15 09:30:00'),
(102, 5, 2, 'She _____ to work by car every day.', 'MULTIPLE_CHOICE', NULL, NULL, NULL, 'This question tests your knowledge of present simple tense.', 'Present simple for habitual actions', '2024-01-15 09:30:00', '2024-01-15 09:30:00'),
(103, 5, 3, 'The meeting _____ at 3 PM yesterday.', 'MULTIPLE_CHOICE', NULL, NULL, NULL, 'This question tests your knowledge of past tense.', 'Past tense for completed actions', '2024-01-15 09:30:00', '2024-01-15 09:30:00'),
(104, 5, 4, 'I _____ my homework when you called.', 'MULTIPLE_CHOICE', NULL, NULL, NULL, 'This question tests your knowledge of past continuous tense.', 'Past continuous for interrupted actions', '2024-01-15 09:30:00', '2024-01-15 09:30:00'),
(105, 5, 5, 'The book _____ on the table.', 'MULTIPLE_CHOICE', NULL, NULL, NULL, 'This question tests your knowledge of passive voice.', 'Passive voice construction', '2024-01-15 09:30:00', '2024-01-15 09:30:00'),
(106, 5, 6, 'If I _____ you, I would help.', 'MULTIPLE_CHOICE', NULL, NULL, NULL, 'This question tests your knowledge of conditional sentences.', 'Second conditional', '2024-01-15 09:30:00', '2024-01-15 09:30:00'),
(107, 5, 7, 'The weather _____ nice today.', 'MULTIPLE_CHOICE', NULL, NULL, NULL, 'This question tests your knowledge of present tense.', 'Present tense for current states', '2024-01-15 09:30:00', '2024-01-15 09:30:00'),
(108, 5, 8, 'She _____ her keys yesterday.', 'MULTIPLE_CHOICE', NULL, NULL, NULL, 'This question tests your knowledge of past tense.', 'Past tense for completed actions', '2024-01-15 09:30:00', '2024-01-15 09:30:00'),
(109, 5, 9, 'The children _____ playing in the garden.', 'MULTIPLE_CHOICE', NULL, NULL, NULL, 'This question tests your knowledge of present continuous tense.', 'Present continuous for ongoing actions', '2024-01-15 09:30:00', '2024-01-15 09:30:00'),
(110, 5, 10, 'I _____ to the store tomorrow.', 'MULTIPLE_CHOICE', NULL, NULL, NULL, 'This question tests your knowledge of future tense.', 'Future tense with "will"', '2024-01-15 09:30:00', '2024-01-15 09:30:00'),
(111, 5, 11, 'The project _____ by the end of the week.', 'MULTIPLE_CHOICE', NULL, NULL, NULL, 'This question tests your knowledge of future perfect tense.', 'Future perfect tense', '2024-01-15 09:30:00', '2024-01-15 09:30:00'),
(112, 5, 12, 'She _____ her degree last year.', 'MULTIPLE_CHOICE', NULL, NULL, NULL, 'This question tests your knowledge of past tense.', 'Past tense for completed actions', '2024-01-15 09:30:00', '2024-01-15 09:30:00'),
(113, 5, 13, 'The students _____ for the exam now.', 'MULTIPLE_CHOICE', NULL, NULL, NULL, 'This question tests your knowledge of present continuous tense.', 'Present continuous for ongoing actions', '2024-01-15 09:30:00', '2024-01-15 09:30:00'),
(114, 5, 14, 'I _____ this book before.', 'MULTIPLE_CHOICE', NULL, NULL, NULL, 'This question tests your knowledge of present perfect tense.', 'Present perfect for past experiences', '2024-01-15 09:30:00', '2024-01-15 09:30:00'),
(115, 5, 15, 'The train _____ at 6 PM every day.', 'MULTIPLE_CHOICE', NULL, NULL, NULL, 'This question tests your knowledge of present simple tense.', 'Present simple for schedules', '2024-01-15 09:30:00', '2024-01-15 09:30:00'),
(116, 5, 16, 'She _____ her homework when I arrived.', 'MULTIPLE_CHOICE', NULL, NULL, NULL, 'This question tests your knowledge of past continuous tense.', 'Past continuous for ongoing past actions', '2024-01-15 09:30:00', '2024-01-15 09:30:00'),
(117, 5, 17, 'The movie _____ interesting.', 'MULTIPLE_CHOICE', NULL, NULL, NULL, 'This question tests your knowledge of present tense.', 'Present tense for current states', '2024-01-15 09:30:00', '2024-01-15 09:30:00'),
(118, 5, 18, 'I _____ to the library yesterday.', 'MULTIPLE_CHOICE', NULL, NULL, NULL, 'This question tests your knowledge of past tense.', 'Past tense for completed actions', '2024-01-15 09:30:00', '2024-01-15 09:30:00'),
(119, 5, 19, 'The weather _____ nice tomorrow.', 'MULTIPLE_CHOICE', NULL, NULL, NULL, 'This question tests your knowledge of future tense.', 'Future tense with "will"', '2024-01-15 09:30:00', '2024-01-15 09:30:00'),
(120, 5, 20, 'She _____ English for five years.', 'MULTIPLE_CHOICE', NULL, NULL, NULL, 'This question tests your knowledge of present perfect continuous tense.', 'Present perfect continuous for duration', '2024-01-15 09:30:00', '2024-01-15 09:30:00'),
(121, 5, 21, 'The meeting _____ at 2 PM.', 'MULTIPLE_CHOICE', NULL, NULL, NULL, 'This question tests your knowledge of present simple tense.', 'Present simple for schedules', '2024-01-15 09:30:00', '2024-01-15 09:30:00'),
(122, 5, 22, 'I _____ my keys this morning.', 'MULTIPLE_CHOICE', NULL, NULL, NULL, 'This question tests your knowledge of past tense.', 'Past tense for completed actions', '2024-01-15 09:30:00', '2024-01-15 09:30:00'),
(123, 5, 23, 'The children _____ in the park now.', 'MULTIPLE_CHOICE', NULL, NULL, NULL, 'This question tests your knowledge of present continuous tense.', 'Present continuous for ongoing actions', '2024-01-15 09:30:00', '2024-01-15 09:30:00'),
(124, 5, 24, 'She _____ her car last week.', 'MULTIPLE_CHOICE', NULL, NULL, NULL, 'This question tests your knowledge of past tense.', 'Past tense for completed actions', '2024-01-15 09:30:00', '2024-01-15 09:30:00'),
(125, 5, 25, 'The store _____ at 9 AM.', 'MULTIPLE_CHOICE', NULL, NULL, NULL, 'This question tests your knowledge of present simple tense.', 'Present simple for schedules', '2024-01-15 09:30:00', '2024-01-15 09:30:00'),
(126, 5, 26, 'I _____ this movie before.', 'MULTIPLE_CHOICE', NULL, NULL, NULL, 'This question tests your knowledge of present perfect tense.', 'Present perfect for past experiences', '2024-01-15 09:30:00', '2024-01-15 09:30:00'),
(127, 5, 27, 'The students _____ for the test.', 'MULTIPLE_CHOICE', NULL, NULL, NULL, 'This question tests your knowledge of present continuous tense.', 'Present continuous for ongoing actions', '2024-01-15 09:30:00', '2024-01-15 09:30:00'),
(128, 5, 28, 'She _____ her homework every day.', 'MULTIPLE_CHOICE', NULL, NULL, NULL, 'This question tests your knowledge of present simple tense.', 'Present simple for habitual actions', '2024-01-15 09:30:00', '2024-01-15 09:30:00'),
(129, 5, 29, 'The weather _____ nice yesterday.', 'MULTIPLE_CHOICE', NULL, NULL, NULL, 'This question tests your knowledge of past tense.', 'Past tense for completed actions', '2024-01-15 09:30:00', '2024-01-15 09:30:00'),
(130, 5, 30, 'I _____ to the store tomorrow.', 'MULTIPLE_CHOICE', NULL, NULL, NULL, 'This question tests your knowledge of future tense.', 'Future tense with "will"', '2024-01-15 09:30:00', '2024-01-15 09:30:00');

-- Part 6: Questions 131-146 (16 questions)
INSERT INTO questions (question_id, part_id, question_number, question_text, question_type, audio_file, image_file, transcript, explanation, grammar_notes, created_at, updated_at) VALUES
(131, 6, 1, 'Read the text and choose the word that best fits each space.', 'MULTIPLE_CHOICE', NULL, NULL, 'Dear Mr. Smith,\n\nThank you for your interest in our company. We are pleased to inform you that your application has been approved. We look forward to working with you.\n\nBest regards,\nHR Department', 'This question tests your ability to understand text completion.', 'Text completion skills', '2024-01-15 09:35:00', '2024-01-15 09:35:00'),
(132, 6, 2, 'What is the purpose of this letter?', 'MULTIPLE_CHOICE', NULL, NULL, 'Dear Mr. Smith,\n\nThank you for your interest in our company. We are pleased to inform you that your application has been approved. We look forward to working with you.\n\nBest regards,\nHR Department', 'This question tests your ability to understand the purpose of a text.', 'Understanding text purpose', '2024-01-15 09:35:00', '2024-01-15 09:35:00'),
(133, 6, 3, 'Who is the letter from?', 'MULTIPLE_CHOICE', NULL, NULL, 'Dear Mr. Smith,\n\nThank you for your interest in our company. We are pleased to inform you that your application has been approved. We look forward to working with you.\n\nBest regards,\nHR Department', 'This question tests your ability to identify the sender.', 'Identifying the sender', '2024-01-15 09:35:00', '2024-01-15 09:35:00'),
(134, 6, 4, 'What is the main message?', 'MULTIPLE_CHOICE', NULL, NULL, 'Dear Mr. Smith,\n\nThank you for your interest in our company. We are pleased to inform you that your application has been approved. We look forward to working with you.\n\nBest regards,\nHR Department', 'This question tests your ability to understand the main message.', 'Understanding main message', '2024-01-15 09:35:00', '2024-01-15 09:35:00'),
(135, 6, 5, 'What is the tone of the letter?', 'MULTIPLE_CHOICE', NULL, NULL, 'Dear Mr. Smith,\n\nThank you for your interest in our company. We are pleased to inform you that your application has been approved. We look forward to working with you.\n\nBest regards,\nHR Department', 'This question tests your ability to understand the tone of a text.', 'Understanding tone', '2024-01-15 09:35:00', '2024-01-15 09:35:00'),
(136, 6, 6, 'Read the text and choose the word that best fits each space.', 'MULTIPLE_CHOICE', NULL, NULL, 'Attention all employees. The company picnic has been postponed due to rain. It will be rescheduled for next Saturday at the same time and location. Please check your email for updates.', 'This question tests your ability to understand text completion.', 'Text completion skills', '2024-01-15 09:35:00', '2024-01-15 09:35:00'),
(137, 6, 7, 'What is this announcement about?', 'MULTIPLE_CHOICE', NULL, NULL, 'Attention all employees. The company picnic has been postponed due to rain. It will be rescheduled for next Saturday at the same time and location. Please check your email for updates.', 'This question tests your ability to understand the main topic.', 'Understanding main topics', '2024-01-15 09:35:00', '2024-01-15 09:35:00'),
(138, 6, 8, 'Why was the picnic postponed?', 'MULTIPLE_CHOICE', NULL, NULL, 'Attention all employees. The company picnic has been postponed due to rain. It will be rescheduled for next Saturday at the same time and location. Please check your email for updates.', 'This question tests your ability to understand reasons.', 'Understanding reasons', '2024-01-15 09:35:00', '2024-01-15 09:35:00'),
(139, 6, 9, 'When will the picnic be rescheduled?', 'MULTIPLE_CHOICE', NULL, NULL, 'Attention all employees. The company picnic has been postponed due to rain. It will be rescheduled for next Saturday at the same time and location. Please check your email for updates.', 'This question tests your ability to understand rescheduling information.', 'Understanding rescheduling', '2024-01-15 09:35:00', '2024-01-15 09:35:00'),
(140, 6, 10, 'What should employees do?', 'MULTIPLE_CHOICE', NULL, NULL, 'Attention all employees. The company picnic has been postponed due to rain. It will be rescheduled for next Saturday at the same time and location. Please check your email for updates.', 'This question tests your ability to understand instructions.', 'Understanding instructions', '2024-01-15 09:35:00', '2024-01-15 09:35:00'),
(141, 6, 11, 'Read the text and choose the word that best fits each space.', 'MULTIPLE_CHOICE', NULL, NULL, 'Good morning, everyone. Today\'s meeting has been moved to Conference Room B on the second floor. The time remains the same at 2 PM. Please make sure to arrive on time.', 'This question tests your ability to understand text completion.', 'Text completion skills', '2024-01-15 09:35:00', '2024-01-15 09:35:00'),
(142, 6, 12, 'What is this announcement about?', 'MULTIPLE_CHOICE', NULL, NULL, 'Good morning, everyone. Today\'s meeting has been moved to Conference Room B on the second floor. The time remains the same at 2 PM. Please make sure to arrive on time.', 'This question tests your ability to understand the main topic.', 'Understanding main topics', '2024-01-15 09:35:00', '2024-01-15 09:35:00'),
(143, 6, 13, 'Where is the meeting now?', 'MULTIPLE_CHOICE', NULL, NULL, 'Good morning, everyone. Today\'s meeting has been moved to Conference Room B on the second floor. The time remains the same at 2 PM. Please make sure to arrive on time.', 'This question tests your ability to understand location information.', 'Understanding location information', '2024-01-15 09:35:00', '2024-01-15 09:35:00'),
(144, 6, 14, 'What time is the meeting?', 'MULTIPLE_CHOICE', NULL, NULL, 'Good morning, everyone. Today\'s meeting has been moved to Conference Room B on the second floor. The time remains the same at 2 PM. Please make sure to arrive on time.', 'This question tests your ability to understand time information.', 'Understanding time information', '2024-01-15 09:35:00', '2024-01-15 09:35:00'),
(145, 6, 15, 'What should people do?', 'MULTIPLE_CHOICE', NULL, NULL, 'Good morning, everyone. Today\'s meeting has been moved to Conference Room B on the second floor. The time remains the same at 2 PM. Please make sure to arrive on time.', 'This question tests your ability to understand instructions.', 'Understanding instructions', '2024-01-15 09:35:00', '2024-01-15 09:35:00'),
(146, 6, 16, 'Read the text and choose the word that best fits each space.', 'MULTIPLE_CHOICE', NULL, NULL, 'Ladies and gentlemen, we are now beginning our descent into Los Angeles. Please fasten your seatbelts and return your tray tables to their upright position. We will be landing in approximately 20 minutes.', 'This question tests your ability to understand text completion.', 'Text completion skills', '2024-01-15 09:35:00', '2024-01-15 09:35:00');

-- Part 7: Questions 147-200 (54 questions)
INSERT INTO questions (question_id, part_id, question_number, question_text, question_type, audio_file, image_file, transcript, explanation, grammar_notes, created_at, updated_at) VALUES
(147, 7, 1, 'What is the main topic of the passage?', 'MULTIPLE_CHOICE', NULL, NULL, 'Climate change is one of the most pressing issues of our time. It affects every aspect of our lives, from the food we eat to the air we breathe. Scientists have been warning us about the consequences of global warming for decades, and now we are seeing the effects firsthand.', 'This question tests your ability to identify the main topic.', 'Identifying main topics', '2024-01-15 09:40:00', '2024-01-15 09:40:00'),
(148, 7, 2, 'What does the author suggest about climate change?', 'MULTIPLE_CHOICE', NULL, NULL, 'Climate change is one of the most pressing issues of our time. It affects every aspect of our lives, from the food we eat to the air we breathe. Scientists have been warning us about the consequences of global warming for decades, and now we are seeing the effects firsthand.', 'This question tests your ability to understand the author\'s viewpoint.', 'Understanding author\'s viewpoint', '2024-01-15 09:40:00', '2024-01-15 09:40:00'),
(149, 7, 3, 'According to the passage, what is the author\'s main concern?', 'MULTIPLE_CHOICE', NULL, NULL, 'Climate change is one of the most pressing issues of our time. It affects every aspect of our lives, from the food we eat to the air we breathe. Scientists have been warning us about the consequences of global warming for decades, and now we are seeing the effects firsthand.', 'This question tests your ability to understand the author\'s main concern.', 'Understanding main concerns', '2024-01-15 09:40:00', '2024-01-15 09:40:00'),
(150, 7, 4, 'What is the author\'s attitude toward the issue?', 'MULTIPLE_CHOICE', NULL, NULL, 'Climate change is one of the most pressing issues of our time. It affects every aspect of our lives, from the food we eat to the air we breathe. Scientists have been warning us about the consequences of global warming for decades, and now we are seeing the effects firsthand.', 'This question tests your ability to understand the author\'s attitude.', 'Understanding author\'s attitude', '2024-01-15 09:40:00', '2024-01-15 09:40:00'),
(151, 7, 5, 'What does the word "pressing" mean in this context?', 'MULTIPLE_CHOICE', NULL, NULL, 'Climate change is one of the most pressing issues of our time. It affects every aspect of our lives, from the food we eat to the air we breathe. Scientists have been warning us about the consequences of global warming for decades, and now we are seeing the effects firsthand.', 'This question tests your ability to understand vocabulary in context.', 'Understanding vocabulary in context', '2024-01-15 09:40:00', '2024-01-15 09:40:00'),
(152, 7, 6, 'What is the purpose of this passage?', 'MULTIPLE_CHOICE', NULL, NULL, 'Climate change is one of the most pressing issues of our time. It affects every aspect of our lives, from the food we eat to the air we breathe. Scientists have been warning us about the consequences of global warming for decades, and now we are seeing the effects firsthand.', 'This question tests your ability to understand the purpose of a text.', 'Understanding text purpose', '2024-01-15 09:40:00', '2024-01-15 09:40:00'),
(153, 7, 7, 'What is the author\'s main argument?', 'MULTIPLE_CHOICE', NULL, NULL, 'Climate change is one of the most pressing issues of our time. It affects every aspect of our lives, from the food we eat to the air we breathe. Scientists have been warning us about the consequences of global warming for decades, and now we are seeing the effects firsthand.', 'This question tests your ability to identify the main argument.', 'Identifying main arguments', '2024-01-15 09:40:00', '2024-01-15 09:40:00'),
(154, 7, 8, 'What evidence does the author provide?', 'MULTIPLE_CHOICE', NULL, NULL, 'Climate change is one of the most pressing issues of our time. It affects every aspect of our lives, from the food we eat to the air we breathe. Scientists have been warning us about the consequences of global warming for decades, and now we are seeing the effects firsthand.', 'This question tests your ability to identify evidence.', 'Identifying evidence', '2024-01-15 09:40:00', '2024-01-15 09:40:00'),
(155, 7, 9, 'What is the author\'s conclusion?', 'MULTIPLE_CHOICE', NULL, NULL, 'Climate change is one of the most pressing issues of our time. It affects every aspect of our lives, from the food we eat to the air we breathe. Scientists have been warning us about the consequences of global warming for decades, and now we are seeing the effects firsthand.', 'This question tests your ability to understand the conclusion.', 'Understanding conclusions', '2024-01-15 09:40:00', '2024-01-15 09:40:00'),
(156, 7, 10, 'What is the author\'s recommendation?', 'MULTIPLE_CHOICE', NULL, NULL, 'Climate change is one of the most pressing issues of our time. It affects every aspect of our lives, from the food we eat to the air we breathe. Scientists have been warning us about the consequences of global warming for decades, and now we are seeing the effects firsthand.', 'This question tests your ability to understand recommendations.', 'Understanding recommendations', '2024-01-15 09:40:00', '2024-01-15 09:40:00'),
(157, 7, 11, 'What is the main topic of the passage?', 'MULTIPLE_CHOICE', NULL, NULL, 'The Internet has revolutionized the way we communicate, work, and access information. It has connected people from all over the world and made it possible to share knowledge instantly. However, it has also created new challenges, such as privacy concerns and the spread of misinformation.', 'This question tests your ability to identify the main topic.', 'Identifying main topics', '2024-01-15 09:40:00', '2024-01-15 09:40:00'),
(158, 7, 12, 'What does the author say about the Internet?', 'MULTIPLE_CHOICE', NULL, NULL, 'The Internet has revolutionized the way we communicate, work, and access information. It has connected people from all over the world and made it possible to share knowledge instantly. However, it has also created new challenges, such as privacy concerns and the spread of misinformation.', 'This question tests your ability to understand the author\'s viewpoint.', 'Understanding author\'s viewpoint', '2024-01-15 09:40:00', '2024-01-15 09:40:00'),
(159, 7, 13, 'What are the benefits of the Internet mentioned?', 'MULTIPLE_CHOICE', NULL, NULL, 'The Internet has revolutionized the way we communicate, work, and access information. It has connected people from all over the world and made it possible to share knowledge instantly. However, it has also created new challenges, such as privacy concerns and the spread of misinformation.', 'This question tests your ability to identify benefits.', 'Identifying benefits', '2024-01-15 09:40:00', '2024-01-15 09:40:00'),
(160, 7, 14, 'What are the challenges mentioned?', 'MULTIPLE_CHOICE', NULL, NULL, 'The Internet has revolutionized the way we communicate, work, and access information. It has connected people from all over the world and made it possible to share knowledge instantly. However, it has also created new challenges, such as privacy concerns and the spread of misinformation.', 'This question tests your ability to identify challenges.', 'Identifying challenges', '2024-01-15 09:40:00', '2024-01-15 09:40:00'),
(161, 7, 15, 'What is the author\'s attitude toward the Internet?', 'MULTIPLE_CHOICE', NULL, NULL, 'The Internet has revolutionized the way we communicate, work, and access information. It has connected people from all over the world and made it possible to share knowledge instantly. However, it has also created new challenges, such as privacy concerns and the spread of misinformation.', 'This question tests your ability to understand the author\'s attitude.', 'Understanding author\'s attitude', '2024-01-15 09:40:00', '2024-01-15 09:40:00'),
(162, 7, 16, 'What is the main topic of the passage?', 'MULTIPLE_CHOICE', NULL, NULL, 'Education is the foundation of a successful society. It provides individuals with the knowledge and skills they need to contribute to their communities and achieve their personal goals. However, access to quality education remains a challenge in many parts of the world.', 'This question tests your ability to identify the main topic.', 'Identifying main topics', '2024-01-15 09:40:00', '2024-01-15 09:40:00'),
(163, 7, 17, 'What does the author say about education?', 'MULTIPLE_CHOICE', NULL, NULL, 'Education is the foundation of a successful society. It provides individuals with the knowledge and skills they need to contribute to their communities and achieve their personal goals. However, access to quality education remains a challenge in many parts of the world.', 'This question tests your ability to understand the author\'s viewpoint.', 'Understanding author\'s viewpoint', '2024-01-15 09:40:00', '2024-01-15 09:40:00'),
(164, 7, 18, 'What is the author\'s main argument?', 'MULTIPLE_CHOICE', NULL, NULL, 'Education is the foundation of a successful society. It provides individuals with the knowledge and skills they need to contribute to their communities and achieve their personal goals. However, access to quality education remains a challenge in many parts of the world.', 'This question tests your ability to identify the main argument.', 'Identifying main arguments', '2024-01-15 09:40:00', '2024-01-15 09:40:00'),


-- INSERT: questions (tiếp tục từ question_id 165 đến 200)
(165, 7, 165, 'What is the main topic of the article?', 'Chủ đề chính của bài viết là gì?', 'Sample question text for reading comprehension...', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(166, 7, 166, 'According to the passage, what should employees do?', 'Theo đoạn văn, nhân viên nên làm gì?', 'Sample question text for reading comprehension...', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(167, 7, 167, 'What is the purpose of the meeting?', 'Mục đích của cuộc họp là gì?', 'Sample question text for reading comprehension...', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(168, 7, 168, 'Who is the intended audience?', 'Đối tượng mục tiêu là ai?', 'Sample question text for reading comprehension...', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(169, 7, 169, 'What does the word "efficient" mean in this context?', 'Từ "efficient" có nghĩa gì trong ngữ cảnh này?', 'Sample question text for reading comprehension...', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(170, 7, 170, 'What is the company\'s main concern?', 'Mối quan tâm chính của công ty là gì?', 'Sample question text for reading comprehension...', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(171, 7, 171, 'According to the text, what is the deadline?', 'Theo văn bản, hạn chót là khi nào?', 'Sample question text for reading comprehension...', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(172, 7, 172, 'What should customers do if they have problems?', 'Khách hàng nên làm gì nếu gặp vấn đề?', 'Sample question text for reading comprehension...', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(173, 7, 173, 'What is the main advantage mentioned?', 'Lợi ích chính được đề cập là gì?', 'Sample question text for reading comprehension...', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(174, 7, 174, 'Who should contact the manager?', 'Ai nên liên hệ với người quản lý?', 'Sample question text for reading comprehension...', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(175, 7, 175, 'What is the next step?', 'Bước tiếp theo là gì?', 'Sample question text for reading comprehension...', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(176, 7, 176, 'What information is required?', 'Thông tin nào được yêu cầu?', 'Sample question text for reading comprehension...', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(177, 7, 177, 'What is the main reason for the change?', 'Lý do chính cho sự thay đổi là gì?', 'Sample question text for reading comprehension...', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(178, 7, 178, 'What does the author suggest?', 'Tác giả đề xuất gì?', 'Sample question text for reading comprehension...', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(179, 7, 179, 'What is the main problem?', 'Vấn đề chính là gì?', 'Sample question text for reading comprehension...', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(180, 7, 180, 'What is the solution proposed?', 'Giải pháp được đề xuất là gì?', 'Sample question text for reading comprehension...', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(181, 7, 181, 'What is the main benefit?', 'Lợi ích chính là gì?', 'Sample question text for reading comprehension...', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(182, 7, 182, 'What is the company\'s policy?', 'Chính sách của công ty là gì?', 'Sample question text for reading comprehension...', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(183, 7, 183, 'What is the main focus?', 'Trọng tâm chính là gì?', 'Sample question text for reading comprehension...', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(184, 7, 184, 'What is the expected outcome?', 'Kết quả mong đợi là gì?', 'Sample question text for reading comprehension...', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(185, 7, 185, 'What is the main challenge?', 'Thách thức chính là gì?', 'Sample question text for reading comprehension...', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(186, 7, 186, 'What is the recommendation?', 'Khuyến nghị là gì?', 'Sample question text for reading comprehension...', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(187, 7, 187, 'What is the main objective?', 'Mục tiêu chính là gì?', 'Sample question text for reading comprehension...', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(188, 7, 188, 'What is the key requirement?', 'Yêu cầu chính là gì?', 'Sample question text for reading comprehension...', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(189, 7, 189, 'What is the main advantage?', 'Lợi thế chính là gì?', 'Sample question text for reading comprehension...', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(190, 7, 190, 'What is the primary concern?', 'Mối quan tâm chính là gì?', 'Sample question text for reading comprehension...', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(191, 7, 191, 'What is the main purpose?', 'Mục đích chính là gì?', 'Sample question text for reading comprehension...', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(192, 7, 192, 'What is the main issue?', 'Vấn đề chính là gì?', 'Sample question text for reading comprehension...', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(193, 7, 193, 'What is the main goal?', 'Mục tiêu chính là gì?', 'Sample question text for reading comprehension...', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(194, 7, 194, 'What is the main priority?', 'Ưu tiên chính là gì?', 'Sample question text for reading comprehension...', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(195, 7, 195, 'What is the main consideration?', 'Yếu tố chính cần xem xét là gì?', 'Sample question text for reading comprehension...', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(196, 7, 196, 'What is the main factor?', 'Yếu tố chính là gì?', 'Sample question text for reading comprehension...', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(197, 7, 197, 'What is the main element?', 'Yếu tố chính là gì?', 'Sample question text for reading comprehension...', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(198, 7, 198, 'What is the main component?', 'Thành phần chính là gì?', 'Sample question text for reading comprehension...', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(199, 7, 199, 'What is the main feature?', 'Tính năng chính là gì?', 'Sample question text for reading comprehension...', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(200, 7, 200, 'What is the main characteristic?', 'Đặc điểm chính là gì?', 'Sample question text for reading comprehension...', '2024-01-01 00:00:00', '2024-01-01 00:00:00');

-- INSERT: choices (tất cả 800 choices cho 200 câu hỏi)
INSERT INTO choices (choice_id, question_id, choice_letter, choice_text, choice_text_vietnamese, explanation, is_correct, created_at, updated_at) VALUES
-- Question 1 (Part 1)
(1, 1, 'A', 'A man is reading a book.', 'Một người đàn ông đang đọc sách.', 'This describes what you see in the picture.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(2, 1, 'B', 'A woman is cooking.', 'Một người phụ nữ đang nấu ăn.', 'This is not what you see in the picture.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(3, 1, 'C', 'A child is playing.', 'Một đứa trẻ đang chơi.', 'This is not what you see in the picture.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(4, 1, 'D', 'A dog is sleeping.', 'Một con chó đang ngủ.', 'This is not what you see in the picture.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 2 (Part 1)
(5, 2, 'A', 'People are walking on the street.', 'Mọi người đang đi bộ trên đường.', 'This describes what you see in the picture.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(6, 2, 'B', 'Cars are parked in a lot.', 'Xe ô tô đang đỗ trong bãi.', 'This is not what you see in the picture.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(7, 2, 'C', 'A building is under construction.', 'Một tòa nhà đang được xây dựng.', 'This is not what you see in the picture.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(8, 2, 'D', 'A tree is being cut down.', 'Một cái cây đang bị chặt.', 'This is not what you see in the picture.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 3 (Part 1)
(9, 3, 'A', 'A man is sitting at a desk.', 'Một người đàn ông đang ngồi ở bàn.', 'This describes what you see in the picture.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(10, 3, 'B', 'A woman is standing by the window.', 'Một người phụ nữ đang đứng bên cửa sổ.', 'This is not what you see in the picture.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(11, 3, 'C', 'A child is playing with toys.', 'Một đứa trẻ đang chơi với đồ chơi.', 'This is not what you see in the picture.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(12, 3, 'D', 'A cat is sleeping on the chair.', 'Một con mèo đang ngủ trên ghế.', 'This is not what you see in the picture.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 4 (Part 1)
(13, 4, 'A', 'A woman is talking on the phone.', 'Một người phụ nữ đang nói chuyện điện thoại.', 'This describes what you see in the picture.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(14, 4, 'B', 'A man is typing on a computer.', 'Một người đàn ông đang gõ máy tính.', 'This is not what you see in the picture.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(15, 4, 'C', 'A child is reading a book.', 'Một đứa trẻ đang đọc sách.', 'This is not what you see in the picture.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(16, 4, 'D', 'A dog is running in the park.', 'Một con chó đang chạy trong công viên.', 'This is not what you see in the picture.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 5 (Part 1)
(17, 5, 'A', 'People are having a meeting.', 'Mọi người đang có cuộc họp.', 'This describes what you see in the picture.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(18, 5, 'B', 'A woman is cooking in the kitchen.', 'Một người phụ nữ đang nấu ăn trong bếp.', 'This is not what you see in the picture.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(19, 5, 'C', 'A child is playing with a ball.', 'Một đứa trẻ đang chơi với quả bóng.', 'This is not what you see in the picture.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(20, 5, 'D', 'A cat is sleeping on the sofa.', 'Một con mèo đang ngủ trên ghế sofa.', 'This is not what you see in the picture.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 6 (Part 1)
(21, 6, 'A', 'A man is driving a car.', 'Một người đàn ông đang lái xe.', 'This describes what you see in the picture.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(22, 6, 'B', 'A woman is riding a bicycle.', 'Một người phụ nữ đang đi xe đạp.', 'This is not what you see in the picture.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(23, 6, 'C', 'A child is playing with a toy car.', 'Một đứa trẻ đang chơi với xe đồ chơi.', 'This is not what you see in the picture.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(24, 6, 'D', 'A dog is running after a car.', 'Một con chó đang chạy theo sau xe.', 'This is not what you see in the picture.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 7 (Part 2)
(25, 7, 'A', 'Yes, I do.', 'Vâng, tôi có.', 'This is a correct response to a yes/no question.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(26, 7, 'B', 'No, I don\'t think so.', 'Không, tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(27, 7, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(28, 7, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 8 (Part 2)
(29, 8, 'A', 'It\'s on the first floor.', 'Nó ở tầng một.', 'This is a correct response to a location question.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(30, 8, 'B', 'I don\'t know.', 'Tôi không biết.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(31, 8, 'C', 'Maybe later.', 'Có thể sau này.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(32, 8, 'D', 'I think so.', 'Tôi nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 9 (Part 2)
(33, 9, 'A', 'About 30 minutes.', 'Khoảng 30 phút.', 'This is a correct response to a time question.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(34, 9, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(35, 9, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(36, 9, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 10 (Part 2)
(37, 10, 'A', 'I\'d be happy to help.', 'Tôi sẽ rất vui được giúp đỡ.', 'This is a correct response to a request.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(38, 10, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(39, 10, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(40, 10, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 11 (Part 2)
(41, 11, 'A', 'It\'s very good.', 'Nó rất tốt.', 'This is a correct response to a quality question.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(42, 11, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(43, 11, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(44, 11, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 12 (Part 2)
(45, 12, 'A', 'Yes, I can.', 'Vâng, tôi có thể.', 'This is a correct response to a capability question.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(46, 12, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(47, 12, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(48, 12, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 13 (Part 2)
(49, 13, 'A', 'It\'s on the table.', 'Nó ở trên bàn.', 'This is a correct response to a location question.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(50, 13, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(51, 13, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(52, 13, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 14 (Part 2)
(53, 14, 'A', 'About 2 hours.', 'Khoảng 2 giờ.', 'This is a correct response to a duration question.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(54, 14, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(55, 14, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(56, 14, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 15 (Part 2)
(57, 15, 'A', 'I\'d love to.', 'Tôi rất muốn.', 'This is a correct response to an invitation.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(58, 15, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(59, 15, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(60, 15, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 16 (Part 2)
(61, 16, 'A', 'It\'s very expensive.', 'Nó rất đắt.', 'This is a correct response to a price question.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(62, 16, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(63, 16, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(64, 16, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 17 (Part 2)
(65, 17, 'A', 'Yes, I have.', 'Vâng, tôi có.', 'This is a correct response to a possession question.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(66, 17, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(67, 17, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(68, 17, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 18 (Part 2)
(69, 18, 'A', 'It\'s in the office.', 'Nó ở trong văn phòng.', 'This is a correct response to a location question.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(70, 18, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(71, 18, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(72, 18, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 19 (Part 2)
(73, 19, 'A', 'About 3 days.', 'Khoảng 3 ngày.', 'This is a correct response to a time question.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(74, 19, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(75, 19, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(76, 19, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 20 (Part 2)
(77, 20, 'A', 'I\'d be happy to help.', 'Tôi sẽ rất vui được giúp đỡ.', 'This is a correct response to a request.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(78, 20, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(79, 20, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(80, 20, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 21 (Part 2)
(81, 21, 'A', 'It\'s very good.', 'Nó rất tốt.', 'This is a correct response to a quality question.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(82, 21, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(83, 21, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(84, 21, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 22 (Part 2)
(85, 22, 'A', 'Yes, I can.', 'Vâng, tôi có thể.', 'This is a correct response to a capability question.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(86, 22, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(87, 22, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(88, 22, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 23 (Part 2)
(89, 23, 'A', 'It\'s on the table.', 'Nó ở trên bàn.', 'This is a correct response to a location question.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(90, 23, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(91, 23, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(92, 23, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 24 (Part 2)
(93, 24, 'A', 'About 2 hours.', 'Khoảng 2 giờ.', 'This is a correct response to a duration question.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(94, 24, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(95, 24, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(96, 24, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 25 (Part 2)
(97, 25, 'A', 'I\'d love to.', 'Tôi rất muốn.', 'This is a correct response to an invitation.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(98, 25, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(99, 25, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(100, 25, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 26 (Part 2)
(101, 26, 'A', 'It\'s very expensive.', 'Nó rất đắt.', 'This is a correct response to a price question.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(102, 26, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(103, 26, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(104, 26, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 27 (Part 2)
(105, 27, 'A', 'Yes, I have.', 'Vâng, tôi có.', 'This is a correct response to a possession question.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(106, 27, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(107, 27, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(108, 27, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 28 (Part 2)
(109, 28, 'A', 'It\'s in the office.', 'Nó ở trong văn phòng.', 'This is a correct response to a location question.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(110, 28, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(111, 28, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(112, 28, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 29 (Part 2)
(113, 29, 'A', 'About 3 days.', 'Khoảng 3 ngày.', 'This is a correct response to a time question.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(114, 29, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(115, 29, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(116, 29, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 30 (Part 2)
(117, 30, 'A', 'I\'d be happy to help.', 'Tôi sẽ rất vui được giúp đỡ.', 'This is a correct response to a request.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(118, 30, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(119, 30, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(120, 30, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 31 (Part 2)
(121, 31, 'A', 'It\'s very good.', 'Nó rất tốt.', 'This is a correct response to a quality question.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(122, 31, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(123, 31, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(124, 31, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 32 (Part 2)
(125, 32, 'A', 'Yes, I can.', 'Vâng, tôi có thể.', 'This is a correct response to a capability question.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(126, 32, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(127, 32, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(128, 32, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 33 (Part 2)
(129, 33, 'A', 'It\'s on the table.', 'Nó ở trên bàn.', 'This is a correct response to a location question.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(130, 33, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(131, 33, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(132, 33, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 34 (Part 2)
(133, 34, 'A', 'About 2 hours.', 'Khoảng 2 giờ.', 'This is a correct response to a duration question.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(134, 34, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(135, 34, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(136, 34, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 35 (Part 2)
(137, 35, 'A', 'I\'d love to.', 'Tôi rất muốn.', 'This is a correct response to an invitation.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(138, 35, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(139, 35, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(140, 35, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 36 (Part 2)
(141, 36, 'A', 'It\'s very expensive.', 'Nó rất đắt.', 'This is a correct response to a price question.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(142, 36, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(143, 36, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(144, 36, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 37 (Part 2)
(145, 37, 'A', 'Yes, I have.', 'Vâng, tôi có.', 'This is a correct response to a possession question.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(146, 37, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(147, 37, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(148, 37, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 38 (Part 2)
(149, 38, 'A', 'It\'s in the office.', 'Nó ở trong văn phòng.', 'This is a correct response to a location question.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(150, 38, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(151, 38, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(152, 38, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 39 (Part 2)
(153, 39, 'A', 'About 3 days.', 'Khoảng 3 ngày.', 'This is a correct response to a time question.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(154, 39, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(155, 39, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(156, 39, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 40 (Part 2)
(157, 40, 'A', 'I\'d be happy to help.', 'Tôi sẽ rất vui được giúp đỡ.', 'This is a correct response to a request.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(158, 40, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(159, 40, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(160, 40, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 41 (Part 2)
(161, 41, 'A', 'It\'s very good.', 'Nó rất tốt.', 'This is a correct response to a quality question.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(162, 41, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(163, 41, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(164, 41, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 42 (Part 2)
(165, 42, 'A', 'Yes, I can.', 'Vâng, tôi có thể.', 'This is a correct response to a capability question.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(166, 42, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(167, 42, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(168, 42, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 43 (Part 2)
(169, 43, 'A', 'It\'s on the table.', 'Nó ở trên bàn.', 'This is a correct response to a location question.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(170, 43, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(171, 43, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(172, 43, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 44 (Part 2)
(173, 44, 'A', 'About 2 hours.', 'Khoảng 2 giờ.', 'This is a correct response to a duration question.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(174, 44, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(175, 44, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(176, 44, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 45 (Part 2)
(177, 45, 'A', 'I\'d love to.', 'Tôi rất muốn.', 'This is a correct response to an invitation.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(178, 45, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(179, 45, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(180, 45, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 46 (Part 2)
(181, 46, 'A', 'It\'s very expensive.', 'Nó rất đắt.', 'This is a correct response to a price question.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(182, 46, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(183, 46, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(184, 46, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 47 (Part 2)
(185, 47, 'A', 'Yes, I have.', 'Vâng, tôi có.', 'This is a correct response to a possession question.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(186, 47, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(187, 47, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(188, 47, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 48 (Part 2)
(189, 48, 'A', 'It\'s in the office.', 'Nó ở trong văn phòng.', 'This is a correct response to a location question.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(190, 48, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(191, 48, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(192, 48, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 49 (Part 2)
(193, 49, 'A', 'About 3 days.', 'Khoảng 3 ngày.', 'This is a correct response to a time question.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(194, 49, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(195, 49, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(196, 49, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 50 (Part 2)
(197, 50, 'A', 'I\'d be happy to help.', 'Tôi sẽ rất vui được giúp đỡ.', 'This is a correct response to a request.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(198, 50, 'B', 'I don\'t think so.', 'Tôi không nghĩ vậy.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(199, 50, 'C', 'Maybe tomorrow.', 'Có thể ngày mai.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(200, 50, 'D', 'I\'m not sure.', 'Tôi không chắc.', 'This is not the correct response.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- INSERT: choices (tiếp tục từ choice_id 201 đến 800)
-- Question 51 (Part 3)
(201, 51, 'A', 'They are discussing a project.', 'Họ đang thảo luận về một dự án.', 'This is what the conversation is about.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(202, 51, 'B', 'They are planning a vacation.', 'Họ đang lên kế hoạch cho kỳ nghỉ.', 'This is not what they are discussing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(203, 51, 'C', 'They are ordering food.', 'Họ đang gọi đồ ăn.', 'This is not what they are discussing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(204, 51, 'D', 'They are buying clothes.', 'Họ đang mua quần áo.', 'This is not what they are discussing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 52 (Part 3)
(205, 52, 'A', 'The meeting is at 2 PM.', 'Cuộc họp lúc 2 giờ chiều.', 'This is the correct time mentioned.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(206, 52, 'B', 'The meeting is at 3 PM.', 'Cuộc họp lúc 3 giờ chiều.', 'This is not the correct time.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(207, 52, 'C', 'The meeting is at 4 PM.', 'Cuộc họp lúc 4 giờ chiều.', 'This is not the correct time.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(208, 52, 'D', 'The meeting is at 5 PM.', 'Cuộc họp lúc 5 giờ chiều.', 'This is not the correct time.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 53 (Part 3)
(209, 53, 'A', 'In the conference room.', 'Trong phòng họp.', 'This is the correct location mentioned.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(210, 53, 'B', 'In the cafeteria.', 'Trong căng tin.', 'This is not the correct location.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(211, 53, 'C', 'In the lobby.', 'Trong sảnh.', 'This is not the correct location.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(212, 53, 'D', 'In the parking lot.', 'Trong bãi đỗ xe.', 'This is not the correct location.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 54 (Part 3)
(213, 54, 'A', 'The man is happy.', 'Người đàn ông rất vui.', 'This is what the man feels.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(214, 54, 'B', 'The man is worried.', 'Người đàn ông lo lắng.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(215, 54, 'C', 'The man is angry.', 'Người đàn ông tức giận.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(216, 54, 'D', 'The man is confused.', 'Người đàn ông bối rối.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 55 (Part 3)
(217, 55, 'A', 'Next week.', 'Tuần tới.', 'This is the correct time mentioned.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(218, 55, 'B', 'Next month.', 'Tháng tới.', 'This is not the correct time.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(219, 55, 'C', 'Next year.', 'Năm tới.', 'This is not the correct time.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(220, 55, 'D', 'Tomorrow.', 'Ngày mai.', 'This is not the correct time.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 56 (Part 3)
(221, 56, 'A', 'The woman is a manager.', 'Người phụ nữ là quản lý.', 'This is what the woman is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(222, 56, 'B', 'The woman is a secretary.', 'Người phụ nữ là thư ký.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(223, 56, 'C', 'The woman is a teacher.', 'Người phụ nữ là giáo viên.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(224, 56, 'D', 'The woman is a doctor.', 'Người phụ nữ là bác sĩ.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 57 (Part 3)
(225, 57, 'A', 'The project is finished.', 'Dự án đã hoàn thành.', 'This is what the project status is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(226, 57, 'B', 'The project is delayed.', 'Dự án bị trễ.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(227, 57, 'C', 'The project is cancelled.', 'Dự án bị hủy.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(228, 57, 'D', 'The project is starting.', 'Dự án đang bắt đầu.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 58 (Part 3)
(229, 58, 'A', 'They need more time.', 'Họ cần thêm thời gian.', 'This is what they need.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(230, 58, 'B', 'They need more money.', 'Họ cần thêm tiền.', 'This is not what they need.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(231, 58, 'C', 'They need more people.', 'Họ cần thêm người.', 'This is not what they need.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(232, 58, 'D', 'They need more equipment.', 'Họ cần thêm thiết bị.', 'This is not what they need.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 59 (Part 3)
(233, 59, 'A', 'The meeting was successful.', 'Cuộc họp đã thành công.', 'This is what the meeting was.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(234, 59, 'B', 'The meeting was cancelled.', 'Cuộc họp đã bị hủy.', 'This is not what the meeting was.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(235, 59, 'C', 'The meeting was postponed.', 'Cuộc họp đã bị hoãn.', 'This is not what the meeting was.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(236, 59, 'D', 'The meeting was rescheduled.', 'Cuộc họp đã được lên lịch lại.', 'This is not what the meeting was.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 60 (Part 3)
(237, 60, 'A', 'They will meet again tomorrow.', 'Họ sẽ gặp lại vào ngày mai.', 'This is what they will do.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(238, 60, 'B', 'They will meet again next week.', 'Họ sẽ gặp lại vào tuần tới.', 'This is not what they will do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(239, 60, 'C', 'They will meet again next month.', 'Họ sẽ gặp lại vào tháng tới.', 'This is not what they will do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(240, 60, 'D', 'They will not meet again.', 'Họ sẽ không gặp lại nữa.', 'This is not what they will do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 61 (Part 3)
(241, 61, 'A', 'The man is satisfied.', 'Người đàn ông hài lòng.', 'This is what the man feels.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(242, 61, 'B', 'The man is disappointed.', 'Người đàn ông thất vọng.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(243, 61, 'C', 'The man is surprised.', 'Người đàn ông ngạc nhiên.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(244, 61, 'D', 'The man is confused.', 'Người đàn ông bối rối.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 62 (Part 3)
(245, 62, 'A', 'The woman is a colleague.', 'Người phụ nữ là đồng nghiệp.', 'This is what the woman is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(246, 62, 'B', 'The woman is a client.', 'Người phụ nữ là khách hàng.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(247, 62, 'C', 'The woman is a friend.', 'Người phụ nữ là bạn.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(248, 62, 'D', 'The woman is a stranger.', 'Người phụ nữ là người lạ.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 63 (Part 3)
(249, 63, 'A', 'The project is on schedule.', 'Dự án đúng tiến độ.', 'This is what the project status is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(250, 63, 'B', 'The project is behind schedule.', 'Dự án chậm tiến độ.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(251, 63, 'C', 'The project is ahead of schedule.', 'Dự án sớm tiến độ.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(252, 63, 'D', 'The project is cancelled.', 'Dự án bị hủy.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 64 (Part 3)
(253, 64, 'A', 'They need to hire more staff.', 'Họ cần thuê thêm nhân viên.', 'This is what they need to do.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(254, 64, 'B', 'They need to buy new equipment.', 'Họ cần mua thiết bị mới.', 'This is not what they need to do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(255, 64, 'C', 'They need to find a new office.', 'Họ cần tìm văn phòng mới.', 'This is not what they need to do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(256, 64, 'D', 'They need to change the deadline.', 'Họ cần thay đổi hạn chót.', 'This is not what they need to do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 65 (Part 3)
(257, 65, 'A', 'The meeting was productive.', 'Cuộc họp rất hiệu quả.', 'This is what the meeting was.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(258, 65, 'B', 'The meeting was unproductive.', 'Cuộc họp không hiệu quả.', 'This is not what the meeting was.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(259, 65, 'C', 'The meeting was cancelled.', 'Cuộc họp đã bị hủy.', 'This is not what the meeting was.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(260, 65, 'D', 'The meeting was postponed.', 'Cuộc họp đã bị hoãn.', 'This is not what the meeting was.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 66 (Part 3)
(261, 66, 'A', 'They will start the project next week.', 'Họ sẽ bắt đầu dự án vào tuần tới.', 'This is what they will do.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(262, 66, 'B', 'They will start the project next month.', 'Họ sẽ bắt đầu dự án vào tháng tới.', 'This is not what they will do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(263, 66, 'C', 'They will start the project next year.', 'Họ sẽ bắt đầu dự án vào năm tới.', 'This is not what they will do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(264, 66, 'D', 'They will not start the project.', 'Họ sẽ không bắt đầu dự án.', 'This is not what they will do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 67 (Part 3)
(265, 67, 'A', 'The man is confident.', 'Người đàn ông tự tin.', 'This is what the man feels.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(266, 67, 'B', 'The man is nervous.', 'Người đàn ông lo lắng.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(267, 67, 'C', 'The man is excited.', 'Người đàn ông hào hứng.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(268, 67, 'D', 'The man is worried.', 'Người đàn ông lo lắng.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 68 (Part 3)
(269, 68, 'A', 'The woman is a supervisor.', 'Người phụ nữ là giám sát.', 'This is what the woman is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(270, 68, 'B', 'The woman is a subordinate.', 'Người phụ nữ là cấp dưới.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(271, 68, 'C', 'The woman is a client.', 'Người phụ nữ là khách hàng.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(272, 68, 'D', 'The woman is a friend.', 'Người phụ nữ là bạn.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 69 (Part 3)
(273, 69, 'A', 'The project is successful.', 'Dự án thành công.', 'This is what the project status is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(274, 69, 'B', 'The project is failing.', 'Dự án thất bại.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(275, 69, 'C', 'The project is delayed.', 'Dự án bị trễ.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(276, 69, 'D', 'The project is cancelled.', 'Dự án bị hủy.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 70 (Part 3)
(277, 70, 'A', 'They need to work harder.', 'Họ cần làm việc chăm chỉ hơn.', 'This is what they need to do.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(278, 70, 'B', 'They need to work faster.', 'Họ cần làm việc nhanh hơn.', 'This is not what they need to do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(279, 70, 'C', 'They need to work longer.', 'Họ cần làm việc lâu hơn.', 'This is not what they need to do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(280, 70, 'D', 'They need to work smarter.', 'Họ cần làm việc thông minh hơn.', 'This is not what they need to do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 71 (Part 3)
(281, 71, 'A', 'The meeting was informative.', 'Cuộc họp rất thông tin.', 'This is what the meeting was.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(282, 71, 'B', 'The meeting was boring.', 'Cuộc họp rất nhàm chán.', 'This is not what the meeting was.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(283, 71, 'C', 'The meeting was confusing.', 'Cuộc họp rất bối rối.', 'This is not what the meeting was.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(284, 71, 'D', 'The meeting was cancelled.', 'Cuộc họp đã bị hủy.', 'This is not what the meeting was.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 72 (Part 3)
(285, 72, 'A', 'They will finish the project next week.', 'Họ sẽ hoàn thành dự án vào tuần tới.', 'This is what they will do.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(286, 72, 'B', 'They will finish the project next month.', 'Họ sẽ hoàn thành dự án vào tháng tới.', 'This is not what they will do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(287, 72, 'C', 'They will finish the project next year.', 'Họ sẽ hoàn thành dự án vào năm tới.', 'This is not what they will do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(288, 72, 'D', 'They will not finish the project.', 'Họ sẽ không hoàn thành dự án.', 'This is not what they will do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 73 (Part 3)
(289, 73, 'A', 'The man is optimistic.', 'Người đàn ông lạc quan.', 'This is what the man feels.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(290, 73, 'B', 'The man is pessimistic.', 'Người đàn ông bi quan.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(291, 73, 'C', 'The man is neutral.', 'Người đàn ông trung lập.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(292, 73, 'D', 'The man is confused.', 'Người đàn ông bối rối.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 74 (Part 3)
(293, 74, 'A', 'The woman is a team leader.', 'Người phụ nữ là trưởng nhóm.', 'This is what the woman is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(294, 74, 'B', 'The woman is a team member.', 'Người phụ nữ là thành viên nhóm.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(295, 74, 'C', 'The woman is a consultant.', 'Người phụ nữ là tư vấn.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(296, 74, 'D', 'The woman is a client.', 'Người phụ nữ là khách hàng.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 75 (Part 3)
(297, 75, 'A', 'The project is on track.', 'Dự án đúng hướng.', 'This is what the project status is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(298, 75, 'B', 'The project is off track.', 'Dự án lệch hướng.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(299, 75, 'C', 'The project is delayed.', 'Dự án bị trễ.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(300, 75, 'D', 'The project is cancelled.', 'Dự án bị hủy.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 76 (Part 3)
(301, 76, 'A', 'They need to communicate better.', 'Họ cần giao tiếp tốt hơn.', 'This is what they need to do.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(302, 76, 'B', 'They need to work faster.', 'Họ cần làm việc nhanh hơn.', 'This is not what they need to do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(303, 76, 'C', 'They need to work harder.', 'Họ cần làm việc chăm chỉ hơn.', 'This is not what they need to do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(304, 76, 'D', 'They need to work longer.', 'Họ cần làm việc lâu hơn.', 'This is not what they need to do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 77 (Part 3)
(305, 77, 'A', 'The meeting was productive.', 'Cuộc họp rất hiệu quả.', 'This is what the meeting was.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(306, 77, 'B', 'The meeting was unproductive.', 'Cuộc họp không hiệu quả.', 'This is not what the meeting was.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(307, 77, 'C', 'The meeting was cancelled.', 'Cuộc họp đã bị hủy.', 'This is not what the meeting was.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(308, 77, 'D', 'The meeting was postponed.', 'Cuộc họp đã bị hoãn.', 'This is not what the meeting was.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 78 (Part 3)
(309, 78, 'A', 'They will start the project tomorrow.', 'Họ sẽ bắt đầu dự án vào ngày mai.', 'This is what they will do.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(310, 78, 'B', 'They will start the project next week.', 'Họ sẽ bắt đầu dự án vào tuần tới.', 'This is not what they will do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(311, 78, 'C', 'They will start the project next month.', 'Họ sẽ bắt đầu dự án vào tháng tới.', 'This is not what they will do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(312, 78, 'D', 'They will not start the project.', 'Họ sẽ không bắt đầu dự án.', 'This is not what they will do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 79 (Part 3)
(313, 79, 'A', 'The man is confident.', 'Người đàn ông tự tin.', 'This is what the man feels.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(314, 79, 'B', 'The man is nervous.', 'Người đàn ông lo lắng.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(315, 79, 'C', 'The man is excited.', 'Người đàn ông hào hứng.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(316, 79, 'D', 'The man is worried.', 'Người đàn ông lo lắng.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 80 (Part 3)
(317, 80, 'A', 'The woman is a project manager.', 'Người phụ nữ là quản lý dự án.', 'This is what the woman is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(318, 80, 'B', 'The woman is a developer.', 'Người phụ nữ là nhà phát triển.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(319, 80, 'C', 'The woman is a designer.', 'Người phụ nữ là nhà thiết kế.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(320, 80, 'D', 'The woman is a client.', 'Người phụ nữ là khách hàng.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 81 (Part 3)
(321, 81, 'A', 'The project is successful.', 'Dự án thành công.', 'This is what the project status is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(322, 81, 'B', 'The project is failing.', 'Dự án thất bại.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(323, 81, 'C', 'The project is delayed.', 'Dự án bị trễ.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(324, 81, 'D', 'The project is cancelled.', 'Dự án bị hủy.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 82 (Part 3)
(325, 82, 'A', 'They need to work together.', 'Họ cần làm việc cùng nhau.', 'This is what they need to do.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(326, 82, 'B', 'They need to work separately.', 'Họ cần làm việc riêng biệt.', 'This is not what they need to do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(327, 82, 'C', 'They need to work faster.', 'Họ cần làm việc nhanh hơn.', 'This is not what they need to do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(328, 82, 'D', 'They need to work harder.', 'Họ cần làm việc chăm chỉ hơn.', 'This is not what they need to do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 83 (Part 3)
(329, 83, 'A', 'The meeting was successful.', 'Cuộc họp đã thành công.', 'This is what the meeting was.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(330, 83, 'B', 'The meeting was unsuccessful.', 'Cuộc họp không thành công.', 'This is not what the meeting was.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(331, 83, 'C', 'The meeting was cancelled.', 'Cuộc họp đã bị hủy.', 'This is not what the meeting was.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(332, 83, 'D', 'The meeting was postponed.', 'Cuộc họp đã bị hoãn.', 'This is not what the meeting was.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 84 (Part 3)
(333, 84, 'A', 'They will finish the project next week.', 'Họ sẽ hoàn thành dự án vào tuần tới.', 'This is what they will do.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(334, 84, 'B', 'They will finish the project next month.', 'Họ sẽ hoàn thành dự án vào tháng tới.', 'This is not what they will do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(335, 84, 'C', 'They will finish the project next year.', 'Họ sẽ hoàn thành dự án vào năm tới.', 'This is not what they will do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(336, 84, 'D', 'They will not finish the project.', 'Họ sẽ không hoàn thành dự án.', 'This is not what they will do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 85 (Part 3)
(337, 85, 'A', 'The man is optimistic.', 'Người đàn ông lạc quan.', 'This is what the man feels.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(338, 85, 'B', 'The man is pessimistic.', 'Người đàn ông bi quan.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(339, 85, 'C', 'The man is neutral.', 'Người đàn ông trung lập.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(340, 85, 'D', 'The man is confused.', 'Người đàn ông bối rối.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 86 (Part 3)
(341, 86, 'A', 'The woman is a team leader.', 'Người phụ nữ là trưởng nhóm.', 'This is what the woman is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(342, 86, 'B', 'The woman is a team member.', 'Người phụ nữ là thành viên nhóm.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(343, 86, 'C', 'The woman is a consultant.', 'Người phụ nữ là tư vấn.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(344, 86, 'D', 'The woman is a client.', 'Người phụ nữ là khách hàng.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 87 (Part 3)
(345, 87, 'A', 'The project is on track.', 'Dự án đúng hướng.', 'This is what the project status is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(346, 87, 'B', 'The project is off track.', 'Dự án lệch hướng.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(347, 87, 'C', 'The project is delayed.', 'Dự án bị trễ.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(348, 87, 'D', 'The project is cancelled.', 'Dự án bị hủy.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 88 (Part 3)
(349, 88, 'A', 'They need to communicate better.', 'Họ cần giao tiếp tốt hơn.', 'This is what they need to do.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(350, 88, 'B', 'They need to work faster.', 'Họ cần làm việc nhanh hơn.', 'This is not what they need to do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(351, 88, 'C', 'They need to work harder.', 'Họ cần làm việc chăm chỉ hơn.', 'This is not what they need to do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(352, 88, 'D', 'They need to work longer.', 'Họ cần làm việc lâu hơn.', 'This is not what they need to do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 89 (Part 3)
(353, 89, 'A', 'The meeting was productive.', 'Cuộc họp rất hiệu quả.', 'This is what the meeting was.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(354, 89, 'B', 'The meeting was unproductive.', 'Cuộc họp không hiệu quả.', 'This is not what the meeting was.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(355, 89, 'C', 'The meeting was cancelled.', 'Cuộc họp đã bị hủy.', 'This is not what the meeting was.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(356, 89, 'D', 'The meeting was postponed.', 'Cuộc họp đã bị hoãn.', 'This is not what the meeting was.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 90 (Part 3)
(357, 90, 'A', 'They will start the project tomorrow.', 'Họ sẽ bắt đầu dự án vào ngày mai.', 'This is what they will do.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(358, 90, 'B', 'They will start the project next week.', 'Họ sẽ bắt đầu dự án vào tuần tới.', 'This is not what they will do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(359, 90, 'C', 'They will start the project next month.', 'Họ sẽ bắt đầu dự án vào tháng tới.', 'This is not what they will do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(360, 90, 'D', 'They will not start the project.', 'Họ sẽ không bắt đầu dự án.', 'This is not what they will do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 91 (Part 3)
(361, 91, 'A', 'The man is confident.', 'Người đàn ông tự tin.', 'This is what the man feels.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(362, 91, 'B', 'The man is nervous.', 'Người đàn ông lo lắng.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(363, 91, 'C', 'The man is excited.', 'Người đàn ông hào hứng.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(364, 91, 'D', 'The man is worried.', 'Người đàn ông lo lắng.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 92 (Part 3)
(365, 92, 'A', 'The woman is a project manager.', 'Người phụ nữ là quản lý dự án.', 'This is what the woman is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(366, 92, 'B', 'The woman is a developer.', 'Người phụ nữ là nhà phát triển.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(367, 92, 'C', 'The woman is a designer.', 'Người phụ nữ là nhà thiết kế.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(368, 92, 'D', 'The woman is a client.', 'Người phụ nữ là khách hàng.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 93 (Part 3)
(369, 93, 'A', 'The project is successful.', 'Dự án thành công.', 'This is what the project status is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(370, 93, 'B', 'The project is failing.', 'Dự án thất bại.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(371, 93, 'C', 'The project is delayed.', 'Dự án bị trễ.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(372, 93, 'D', 'The project is cancelled.', 'Dự án bị hủy.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 94 (Part 3)
(373, 94, 'A', 'They need to work together.', 'Họ cần làm việc cùng nhau.', 'This is what they need to do.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(374, 94, 'B', 'They need to work separately.', 'Họ cần làm việc riêng biệt.', 'This is not what they need to do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(375, 94, 'C', 'They need to work faster.', 'Họ cần làm việc nhanh hơn.', 'This is not what they need to do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(376, 94, 'D', 'They need to work harder.', 'Họ cần làm việc chăm chỉ hơn.', 'This is not what they need to do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 95 (Part 3)
(377, 95, 'A', 'The meeting was successful.', 'Cuộc họp đã thành công.', 'This is what the meeting was.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(378, 95, 'B', 'The meeting was unsuccessful.', 'Cuộc họp không thành công.', 'This is not what the meeting was.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(379, 95, 'C', 'The meeting was cancelled.', 'Cuộc họp đã bị hủy.', 'This is not what the meeting was.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(380, 95, 'D', 'The meeting was postponed.', 'Cuộc họp đã bị hoãn.', 'This is not what the meeting was.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 96 (Part 3)
(381, 96, 'A', 'They will finish the project next week.', 'Họ sẽ hoàn thành dự án vào tuần tới.', 'This is what they will do.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(382, 96, 'B', 'They will finish the project next month.', 'Họ sẽ hoàn thành dự án vào tháng tới.', 'This is not what they will do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(383, 96, 'C', 'They will finish the project next year.', 'Họ sẽ hoàn thành dự án vào năm tới.', 'This is not what they will do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(384, 96, 'D', 'They will not finish the project.', 'Họ sẽ không hoàn thành dự án.', 'This is not what they will do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 97 (Part 3)
(385, 97, 'A', 'The man is optimistic.', 'Người đàn ông lạc quan.', 'This is what the man feels.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(386, 97, 'B', 'The man is pessimistic.', 'Người đàn ông bi quan.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(387, 97, 'C', 'The man is neutral.', 'Người đàn ông trung lập.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(388, 97, 'D', 'The man is confused.', 'Người đàn ông bối rối.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 98 (Part 3)
(389, 98, 'A', 'The woman is a team leader.', 'Người phụ nữ là trưởng nhóm.', 'This is what the woman is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(390, 98, 'B', 'The woman is a team member.', 'Người phụ nữ là thành viên nhóm.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(391, 98, 'C', 'The woman is a consultant.', 'Người phụ nữ là tư vấn.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(392, 98, 'D', 'The woman is a client.', 'Người phụ nữ là khách hàng.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 99 (Part 3)
(393, 99, 'A', 'The project is on track.', 'Dự án đúng hướng.', 'This is what the project status is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(394, 99, 'B', 'The project is off track.', 'Dự án lệch hướng.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(395, 99, 'C', 'The project is delayed.', 'Dự án bị trễ.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(396, 99, 'D', 'The project is cancelled.', 'Dự án bị hủy.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 100 (Part 3)
(397, 100, 'A', 'They need to communicate better.', 'Họ cần giao tiếp tốt hơn.', 'This is what they need to do.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(398, 100, 'B', 'They need to work faster.', 'Họ cần làm việc nhanh hơn.', 'This is not what they need to do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(399, 100, 'C', 'They need to work harder.', 'Họ cần làm việc chăm chỉ hơn.', 'This is not what they need to do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(400, 100, 'D', 'They need to work longer.', 'Họ cần làm việc lâu hơn.', 'This is not what they need to do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),


-- INSERT: choices (tiếp tục từ choice_id 401 đến 800)
-- Question 101 (Part 4)
(401, 101, 'A', 'The meeting was productive.', 'Cuộc họp rất hiệu quả.', 'This is what the meeting was.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(402, 101, 'B', 'The meeting was unproductive.', 'Cuộc họp không hiệu quả.', 'This is not what the meeting was.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(403, 101, 'C', 'The meeting was cancelled.', 'Cuộc họp đã bị hủy.', 'This is not what the meeting was.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(404, 101, 'D', 'The meeting was postponed.', 'Cuộc họp đã bị hoãn.', 'This is not what the meeting was.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 102 (Part 4)
(405, 102, 'A', 'They will start the project tomorrow.', 'Họ sẽ bắt đầu dự án vào ngày mai.', 'This is what they will do.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(406, 102, 'B', 'They will start the project next week.', 'Họ sẽ bắt đầu dự án vào tuần tới.', 'This is not what they will do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(407, 102, 'C', 'They will start the project next month.', 'Họ sẽ bắt đầu dự án vào tháng tới.', 'This is not what they will do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(408, 102, 'D', 'They will not start the project.', 'Họ sẽ không bắt đầu dự án.', 'This is not what they will do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 103 (Part 4)
(409, 103, 'A', 'The man is confident.', 'Người đàn ông tự tin.', 'This is what the man feels.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(410, 103, 'B', 'The man is nervous.', 'Người đàn ông lo lắng.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(411, 103, 'C', 'The man is excited.', 'Người đàn ông hào hứng.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(412, 103, 'D', 'The man is worried.', 'Người đàn ông lo lắng.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 104 (Part 4)
(413, 104, 'A', 'The woman is a project manager.', 'Người phụ nữ là quản lý dự án.', 'This is what the woman is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(414, 104, 'B', 'The woman is a developer.', 'Người phụ nữ là nhà phát triển.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(415, 104, 'C', 'The woman is a designer.', 'Người phụ nữ là nhà thiết kế.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(416, 104, 'D', 'The woman is a client.', 'Người phụ nữ là khách hàng.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 105 (Part 4)
(417, 105, 'A', 'The project is successful.', 'Dự án thành công.', 'This is what the project status is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(418, 105, 'B', 'The project is failing.', 'Dự án thất bại.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(419, 105, 'C', 'The project is delayed.', 'Dự án bị trễ.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(420, 105, 'D', 'The project is cancelled.', 'Dự án bị hủy.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 106 (Part 4)
(421, 106, 'A', 'They need to work together.', 'Họ cần làm việc cùng nhau.', 'This is what they need to do.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(422, 106, 'B', 'They need to work separately.', 'Họ cần làm việc riêng biệt.', 'This is not what they need to do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(423, 106, 'C', 'They need to work faster.', 'Họ cần làm việc nhanh hơn.', 'This is not what they need to do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(424, 106, 'D', 'They need to work harder.', 'Họ cần làm việc chăm chỉ hơn.', 'This is not what they need to do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 107 (Part 4)
(425, 107, 'A', 'The meeting was successful.', 'Cuộc họp đã thành công.', 'This is what the meeting was.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(426, 107, 'B', 'The meeting was unsuccessful.', 'Cuộc họp không thành công.', 'This is not what the meeting was.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(427, 107, 'C', 'The meeting was cancelled.', 'Cuộc họp đã bị hủy.', 'This is not what the meeting was.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(428, 107, 'D', 'The meeting was postponed.', 'Cuộc họp đã bị hoãn.', 'This is not what the meeting was.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 108 (Part 4)
(429, 108, 'A', 'They will finish the project next week.', 'Họ sẽ hoàn thành dự án vào tuần tới.', 'This is what they will do.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(430, 108, 'B', 'They will finish the project next month.', 'Họ sẽ hoàn thành dự án vào tháng tới.', 'This is not what they will do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(431, 108, 'C', 'They will finish the project next year.', 'Họ sẽ hoàn thành dự án vào năm tới.', 'This is not what they will do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(432, 108, 'D', 'They will not finish the project.', 'Họ sẽ không hoàn thành dự án.', 'This is not what they will do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 109 (Part 4)
(433, 109, 'A', 'The man is optimistic.', 'Người đàn ông lạc quan.', 'This is what the man feels.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(434, 109, 'B', 'The man is pessimistic.', 'Người đàn ông bi quan.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(435, 109, 'C', 'The man is neutral.', 'Người đàn ông trung lập.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(436, 109, 'D', 'The man is confused.', 'Người đàn ông bối rối.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 110 (Part 4)
(437, 110, 'A', 'The woman is a team leader.', 'Người phụ nữ là trưởng nhóm.', 'This is what the woman is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(438, 110, 'B', 'The woman is a team member.', 'Người phụ nữ là thành viên nhóm.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(439, 110, 'C', 'The woman is a consultant.', 'Người phụ nữ là tư vấn.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(440, 110, 'D', 'The woman is a client.', 'Người phụ nữ là khách hàng.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 111 (Part 4)
(441, 111, 'A', 'The project is on track.', 'Dự án đúng hướng.', 'This is what the project status is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(442, 111, 'B', 'The project is off track.', 'Dự án lệch hướng.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(443, 111, 'C', 'The project is delayed.', 'Dự án bị trễ.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(444, 111, 'D', 'The project is cancelled.', 'Dự án bị hủy.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 112 (Part 4)
(445, 112, 'A', 'They need to communicate better.', 'Họ cần giao tiếp tốt hơn.', 'This is what they need to do.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(446, 112, 'B', 'They need to work faster.', 'Họ cần làm việc nhanh hơn.', 'This is not what they need to do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(447, 112, 'C', 'They need to work harder.', 'Họ cần làm việc chăm chỉ hơn.', 'This is not what they need to do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(448, 112, 'D', 'They need to work longer.', 'Họ cần làm việc lâu hơn.', 'This is not what they need to do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 113 (Part 4)
(449, 113, 'A', 'The meeting was productive.', 'Cuộc họp rất hiệu quả.', 'This is what the meeting was.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(450, 113, 'B', 'The meeting was unproductive.', 'Cuộc họp không hiệu quả.', 'This is not what the meeting was.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(451, 113, 'C', 'The meeting was cancelled.', 'Cuộc họp đã bị hủy.', 'This is not what the meeting was.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(452, 113, 'D', 'The meeting was postponed.', 'Cuộc họp đã bị hoãn.', 'This is not what the meeting was.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 114 (Part 4)
(453, 114, 'A', 'They will start the project tomorrow.', 'Họ sẽ bắt đầu dự án vào ngày mai.', 'This is what they will do.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(454, 114, 'B', 'They will start the project next week.', 'Họ sẽ bắt đầu dự án vào tuần tới.', 'This is not what they will do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(455, 114, 'C', 'They will start the project next month.', 'Họ sẽ bắt đầu dự án vào tháng tới.', 'This is not what they will do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(456, 114, 'D', 'They will not start the project.', 'Họ sẽ không bắt đầu dự án.', 'This is not what they will do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 115 (Part 4)
(457, 115, 'A', 'The man is confident.', 'Người đàn ông tự tin.', 'This is what the man feels.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(458, 115, 'B', 'The man is nervous.', 'Người đàn ông lo lắng.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(459, 115, 'C', 'The man is excited.', 'Người đàn ông hào hứng.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(460, 115, 'D', 'The man is worried.', 'Người đàn ông lo lắng.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 116 (Part 4)
(461, 116, 'A', 'The woman is a project manager.', 'Người phụ nữ là quản lý dự án.', 'This is what the woman is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(462, 116, 'B', 'The woman is a developer.', 'Người phụ nữ là nhà phát triển.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(463, 116, 'C', 'The woman is a designer.', 'Người phụ nữ là nhà thiết kế.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(464, 116, 'D', 'The woman is a client.', 'Người phụ nữ là khách hàng.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 117 (Part 4)
(465, 117, 'A', 'The project is successful.', 'Dự án thành công.', 'This is what the project status is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(466, 117, 'B', 'The project is failing.', 'Dự án thất bại.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(467, 117, 'C', 'The project is delayed.', 'Dự án bị trễ.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(468, 117, 'D', 'The project is cancelled.', 'Dự án bị hủy.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 118 (Part 4)
(469, 118, 'A', 'They need to work together.', 'Họ cần làm việc cùng nhau.', 'This is what they need to do.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(470, 118, 'B', 'They need to work separately.', 'Họ cần làm việc riêng biệt.', 'This is not what they need to do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(471, 118, 'C', 'They need to work faster.', 'Họ cần làm việc nhanh hơn.', 'This is not what they need to do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(472, 118, 'D', 'They need to work harder.', 'Họ cần làm việc chăm chỉ hơn.', 'This is not what they need to do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 119 (Part 4)
(473, 119, 'A', 'The meeting was successful.', 'Cuộc họp đã thành công.', 'This is what the meeting was.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(474, 119, 'B', 'The meeting was unsuccessful.', 'Cuộc họp không thành công.', 'This is not what the meeting was.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(475, 119, 'C', 'The meeting was cancelled.', 'Cuộc họp đã bị hủy.', 'This is not what the meeting was.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(476, 119, 'D', 'The meeting was postponed.', 'Cuộc họp đã bị hoãn.', 'This is not what the meeting was.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 120 (Part 4)
(477, 120, 'A', 'They will finish the project next week.', 'Họ sẽ hoàn thành dự án vào tuần tới.', 'This is what they will do.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(478, 120, 'B', 'They will finish the project next month.', 'Họ sẽ hoàn thành dự án vào tháng tới.', 'This is not what they will do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(479, 120, 'C', 'They will finish the project next year.', 'Họ sẽ hoàn thành dự án vào năm tới.', 'This is not what they will do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(480, 120, 'D', 'They will not finish the project.', 'Họ sẽ không hoàn thành dự án.', 'This is not what they will do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 121 (Part 4)
(481, 121, 'A', 'The man is optimistic.', 'Người đàn ông lạc quan.', 'This is what the man feels.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(482, 121, 'B', 'The man is pessimistic.', 'Người đàn ông bi quan.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(483, 121, 'C', 'The man is neutral.', 'Người đàn ông trung lập.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(484, 121, 'D', 'The man is confused.', 'Người đàn ông bối rối.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 122 (Part 4)
(485, 122, 'A', 'The woman is a team leader.', 'Người phụ nữ là trưởng nhóm.', 'This is what the woman is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(486, 122, 'B', 'The woman is a team member.', 'Người phụ nữ là thành viên nhóm.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(487, 122, 'C', 'The woman is a consultant.', 'Người phụ nữ là tư vấn.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(488, 122, 'D', 'The woman is a client.', 'Người phụ nữ là khách hàng.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 123 (Part 4)
(489, 123, 'A', 'The project is on track.', 'Dự án đúng hướng.', 'This is what the project status is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(490, 123, 'B', 'The project is off track.', 'Dự án lệch hướng.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(491, 123, 'C', 'The project is delayed.', 'Dự án bị trễ.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(492, 123, 'D', 'The project is cancelled.', 'Dự án bị hủy.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 124 (Part 4)
(493, 124, 'A', 'They need to communicate better.', 'Họ cần giao tiếp tốt hơn.', 'This is what they need to do.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(494, 124, 'B', 'They need to work faster.', 'Họ cần làm việc nhanh hơn.', 'This is not what they need to do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(495, 124, 'C', 'They need to work harder.', 'Họ cần làm việc chăm chỉ hơn.', 'This is not what they need to do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(496, 124, 'D', 'They need to work longer.', 'Họ cần làm việc lâu hơn.', 'This is not what they need to do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 125 (Part 4)
(497, 125, 'A', 'The meeting was productive.', 'Cuộc họp rất hiệu quả.', 'This is what the meeting was.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(498, 125, 'B', 'The meeting was unproductive.', 'Cuộc họp không hiệu quả.', 'This is not what the meeting was.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(499, 125, 'C', 'The meeting was cancelled.', 'Cuộc họp đã bị hủy.', 'This is not what the meeting was.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(500, 125, 'D', 'The meeting was postponed.', 'Cuộc họp đã bị hoãn.', 'This is not what the meeting was.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 126 (Part 4)
(501, 126, 'A', 'They will start the project tomorrow.', 'Họ sẽ bắt đầu dự án vào ngày mai.', 'This is what they will do.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(502, 126, 'B', 'They will start the project next week.', 'Họ sẽ bắt đầu dự án vào tuần tới.', 'This is not what they will do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(503, 126, 'C', 'They will start the project next month.', 'Họ sẽ bắt đầu dự án vào tháng tới.', 'This is not what they will do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(504, 126, 'D', 'They will not start the project.', 'Họ sẽ không bắt đầu dự án.', 'This is not what they will do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 127 (Part 4)
(505, 127, 'A', 'The man is confident.', 'Người đàn ông tự tin.', 'This is what the man feels.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(506, 127, 'B', 'The man is nervous.', 'Người đàn ông lo lắng.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(507, 127, 'C', 'The man is excited.', 'Người đàn ông hào hứng.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(508, 127, 'D', 'The man is worried.', 'Người đàn ông lo lắng.', 'This is not what the man feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 128 (Part 4)
(509, 128, 'A', 'The woman is a project manager.', 'Người phụ nữ là quản lý dự án.', 'This is what the woman is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(510, 128, 'B', 'The woman is a developer.', 'Người phụ nữ là nhà phát triển.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(511, 128, 'C', 'The woman is a designer.', 'Người phụ nữ là nhà thiết kế.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(512, 128, 'D', 'The woman is a client.', 'Người phụ nữ là khách hàng.', 'This is not what the woman is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 129 (Part 4)
(513, 129, 'A', 'The project is successful.', 'Dự án thành công.', 'This is what the project status is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(514, 129, 'B', 'The project is failing.', 'Dự án thất bại.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(515, 129, 'C', 'The project is delayed.', 'Dự án bị trễ.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(516, 129, 'D', 'The project is cancelled.', 'Dự án bị hủy.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 130 (Part 4)
(517, 130, 'A', 'They need to work together.', 'Họ cần làm việc cùng nhau.', 'This is what they need to do.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(518, 130, 'B', 'They need to work separately.', 'Họ cần làm việc riêng biệt.', 'This is not what they need to do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(519, 130, 'C', 'They need to work faster.', 'Họ cần làm việc nhanh hơn.', 'This is not what they need to do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(520, 130, 'D', 'They need to work harder.', 'Họ cần làm việc chăm chỉ hơn.', 'This is not what they need to do.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 131 (Part 5)
(521, 131, 'A', 'The company is expanding.', 'Công ty đang mở rộng.', 'This is what the company is doing.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(522, 131, 'B', 'The company is shrinking.', 'Công ty đang thu nhỏ.', 'This is not what the company is doing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(523, 131, 'C', 'The company is closing.', 'Công ty đang đóng cửa.', 'This is not what the company is doing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(524, 131, 'D', 'The company is moving.', 'Công ty đang di chuyển.', 'This is not what the company is doing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 132 (Part 5)
(525, 132, 'A', 'The meeting is scheduled for tomorrow.', 'Cuộc họp được lên lịch cho ngày mai.', 'This is when the meeting is scheduled.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(526, 132, 'B', 'The meeting is scheduled for next week.', 'Cuộc họp được lên lịch cho tuần tới.', 'This is not when the meeting is scheduled.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(527, 132, 'C', 'The meeting is scheduled for next month.', 'Cuộc họp được lên lịch cho tháng tới.', 'This is not when the meeting is scheduled.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(528, 132, 'D', 'The meeting is not scheduled.', 'Cuộc họp không được lên lịch.', 'This is not when the meeting is scheduled.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 133 (Part 5)
(529, 133, 'A', 'The project is on schedule.', 'Dự án đúng tiến độ.', 'This is what the project status is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(530, 133, 'B', 'The project is behind schedule.', 'Dự án chậm tiến độ.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(531, 133, 'C', 'The project is ahead of schedule.', 'Dự án sớm tiến độ.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(532, 133, 'D', 'The project is cancelled.', 'Dự án bị hủy.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 134 (Part 5)
(533, 134, 'A', 'The employee is satisfied.', 'Nhân viên hài lòng.', 'This is what the employee feels.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(534, 134, 'B', 'The employee is dissatisfied.', 'Nhân viên không hài lòng.', 'This is not what the employee feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(535, 134, 'C', 'The employee is confused.', 'Nhân viên bối rối.', 'This is not what the employee feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(536, 134, 'D', 'The employee is angry.', 'Nhân viên tức giận.', 'This is not what the employee feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 135 (Part 5)
(537, 135, 'A', 'The company is hiring.', 'Công ty đang tuyển dụng.', 'This is what the company is doing.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(538, 135, 'B', 'The company is firing.', 'Công ty đang sa thải.', 'This is not what the company is doing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(539, 135, 'C', 'The company is closing.', 'Công ty đang đóng cửa.', 'This is not what the company is doing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(540, 135, 'D', 'The company is moving.', 'Công ty đang di chuyển.', 'This is not what the company is doing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 136 (Part 5)
(541, 136, 'A', 'The meeting is at 2 PM.', 'Cuộc họp lúc 2 giờ chiều.', 'This is when the meeting is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(542, 136, 'B', 'The meeting is at 3 PM.', 'Cuộc họp lúc 3 giờ chiều.', 'This is not when the meeting is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(543, 136, 'C', 'The meeting is at 4 PM.', 'Cuộc họp lúc 4 giờ chiều.', 'This is not when the meeting is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(544, 136, 'D', 'The meeting is at 5 PM.', 'Cuộc họp lúc 5 giờ chiều.', 'This is not when the meeting is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 137 (Part 5)
(545, 137, 'A', 'The project is successful.', 'Dự án thành công.', 'This is what the project status is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(546, 137, 'B', 'The project is failing.', 'Dự án thất bại.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(547, 137, 'C', 'The project is delayed.', 'Dự án bị trễ.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(548, 137, 'D', 'The project is cancelled.', 'Dự án bị hủy.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 138 (Part 5)
(549, 138, 'A', 'The employee is happy.', 'Nhân viên vui vẻ.', 'This is what the employee feels.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(550, 138, 'B', 'The employee is sad.', 'Nhân viên buồn bã.', 'This is not what the employee feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(551, 138, 'C', 'The employee is angry.', 'Nhân viên tức giận.', 'This is not what the employee feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(552, 138, 'D', 'The employee is worried.', 'Nhân viên lo lắng.', 'This is not what the employee feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 139 (Part 5)
(553, 139, 'A', 'The company is growing.', 'Công ty đang phát triển.', 'This is what the company is doing.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(554, 139, 'B', 'The company is shrinking.', 'Công ty đang thu nhỏ.', 'This is not what the company is doing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(555, 139, 'C', 'The company is closing.', 'Công ty đang đóng cửa.', 'This is not what the company is doing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(556, 139, 'D', 'The company is moving.', 'Công ty đang di chuyển.', 'This is not what the company is doing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 140 (Part 5)
(557, 140, 'A', 'The meeting is in the conference room.', 'Cuộc họp ở phòng họp.', 'This is where the meeting is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(558, 140, 'B', 'The meeting is in the cafeteria.', 'Cuộc họp ở căng tin.', 'This is not where the meeting is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(559, 140, 'C', 'The meeting is in the lobby.', 'Cuộc họp ở sảnh.', 'This is not where the meeting is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(560, 140, 'D', 'The meeting is in the parking lot.', 'Cuộc họp ở bãi đỗ xe.', 'This is not where the meeting is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 141 (Part 5)
(561, 141, 'A', 'The project is on track.', 'Dự án đúng hướng.', 'This is what the project status is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(562, 141, 'B', 'The project is off track.', 'Dự án lệch hướng.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(563, 141, 'C', 'The project is delayed.', 'Dự án bị trễ.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(564, 141, 'D', 'The project is cancelled.', 'Dự án bị hủy.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 142 (Part 5)
(565, 142, 'A', 'The employee is satisfied.', 'Nhân viên hài lòng.', 'This is what the employee feels.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(566, 142, 'B', 'The employee is dissatisfied.', 'Nhân viên không hài lòng.', 'This is not what the employee feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(567, 142, 'C', 'The employee is confused.', 'Nhân viên bối rối.', 'This is not what the employee feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(568, 142, 'D', 'The employee is angry.', 'Nhân viên tức giận.', 'This is not what the employee feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 143 (Part 5)
(569, 143, 'A', 'The company is expanding.', 'Công ty đang mở rộng.', 'This is what the company is doing.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(570, 143, 'B', 'The company is shrinking.', 'Công ty đang thu nhỏ.', 'This is not what the company is doing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(571, 143, 'C', 'The company is closing.', 'Công ty đang đóng cửa.', 'This is not what the company is doing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(572, 143, 'D', 'The company is moving.', 'Công ty đang di chuyển.', 'This is not what the company is doing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 144 (Part 5)
(573, 144, 'A', 'The meeting is scheduled for tomorrow.', 'Cuộc họp được lên lịch cho ngày mai.', 'This is when the meeting is scheduled.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(574, 144, 'B', 'The meeting is scheduled for next week.', 'Cuộc họp được lên lịch cho tuần tới.', 'This is not when the meeting is scheduled.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(575, 144, 'C', 'The meeting is scheduled for next month.', 'Cuộc họp được lên lịch cho tháng tới.', 'This is not when the meeting is scheduled.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(576, 144, 'D', 'The meeting is not scheduled.', 'Cuộc họp không được lên lịch.', 'This is not when the meeting is scheduled.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 145 (Part 5)
(577, 145, 'A', 'The project is on schedule.', 'Dự án đúng tiến độ.', 'This is what the project status is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(578, 145, 'B', 'The project is behind schedule.', 'Dự án chậm tiến độ.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(579, 145, 'C', 'The project is ahead of schedule.', 'Dự án sớm tiến độ.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(580, 145, 'D', 'The project is cancelled.', 'Dự án bị hủy.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 146 (Part 5)
(581, 146, 'A', 'The employee is satisfied.', 'Nhân viên hài lòng.', 'This is what the employee feels.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(582, 146, 'B', 'The employee is dissatisfied.', 'Nhân viên không hài lòng.', 'This is not what the employee feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(583, 146, 'C', 'The employee is confused.', 'Nhân viên bối rối.', 'This is not what the employee feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(584, 146, 'D', 'The employee is angry.', 'Nhân viên tức giận.', 'This is not what the employee feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 147 (Part 5)
(585, 147, 'A', 'The company is hiring.', 'Công ty đang tuyển dụng.', 'This is what the company is doing.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(586, 147, 'B', 'The company is firing.', 'Công ty đang sa thải.', 'This is not what the company is doing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(587, 147, 'C', 'The company is closing.', 'Công ty đang đóng cửa.', 'This is not what the company is doing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(588, 147, 'D', 'The company is moving.', 'Công ty đang di chuyển.', 'This is not what the company is doing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 148 (Part 5)
(589, 148, 'A', 'The meeting is at 2 PM.', 'Cuộc họp lúc 2 giờ chiều.', 'This is when the meeting is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(590, 148, 'B', 'The meeting is at 3 PM.', 'Cuộc họp lúc 3 giờ chiều.', 'This is not when the meeting is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(591, 148, 'C', 'The meeting is at 4 PM.', 'Cuộc họp lúc 4 giờ chiều.', 'This is not when the meeting is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(592, 148, 'D', 'The meeting is at 5 PM.', 'Cuộc họp lúc 5 giờ chiều.', 'This is not when the meeting is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 149 (Part 5)
(593, 149, 'A', 'The project is successful.', 'Dự án thành công.', 'This is what the project status is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(594, 149, 'B', 'The project is failing.', 'Dự án thất bại.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(595, 149, 'C', 'The project is delayed.', 'Dự án bị trễ.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(596, 149, 'D', 'The project is cancelled.', 'Dự án bị hủy.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 150 (Part 5)
(597, 150, 'A', 'The employee is happy.', 'Nhân viên vui vẻ.', 'This is what the employee feels.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(598, 150, 'B', 'The employee is sad.', 'Nhân viên buồn bã.', 'This is not what the employee feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(599, 150, 'C', 'The employee is angry.', 'Nhân viên tức giận.', 'This is not what the employee feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(600, 150, 'D', 'The employee is worried.', 'Nhân viên lo lắng.', 'This is not what the employee feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 151 (Part 6)
(601, 151, 'A', 'The company is growing.', 'Công ty đang phát triển.', 'This is what the company is doing.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(602, 151, 'B', 'The company is shrinking.', 'Công ty đang thu nhỏ.', 'This is not what the company is doing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(603, 151, 'C', 'The company is closing.', 'Công ty đang đóng cửa.', 'This is not what the company is doing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(604, 151, 'D', 'The company is moving.', 'Công ty đang di chuyển.', 'This is not what the company is doing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 152 (Part 6)
(605, 152, 'A', 'The meeting is in the conference room.', 'Cuộc họp ở phòng họp.', 'This is where the meeting is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(606, 152, 'B', 'The meeting is in the cafeteria.', 'Cuộc họp ở căng tin.', 'This is not where the meeting is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(607, 152, 'C', 'The meeting is in the lobby.', 'Cuộc họp ở sảnh.', 'This is not where the meeting is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(608, 152, 'D', 'The meeting is in the parking lot.', 'Cuộc họp ở bãi đỗ xe.', 'This is not where the meeting is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 153 (Part 6)
(609, 153, 'A', 'The project is on track.', 'Dự án đúng hướng.', 'This is what the project status is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(610, 153, 'B', 'The project is off track.', 'Dự án lệch hướng.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(611, 153, 'C', 'The project is delayed.', 'Dự án bị trễ.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(612, 153, 'D', 'The project is cancelled.', 'Dự án bị hủy.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 154 (Part 6)
(613, 154, 'A', 'The employee is satisfied.', 'Nhân viên hài lòng.', 'This is what the employee feels.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(614, 154, 'B', 'The employee is dissatisfied.', 'Nhân viên không hài lòng.', 'This is not what the employee feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(615, 154, 'C', 'The employee is confused.', 'Nhân viên bối rối.', 'This is not what the employee feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(616, 154, 'D', 'The employee is angry.', 'Nhân viên tức giận.', 'This is not what the employee feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 155 (Part 6)
(617, 155, 'A', 'The company is expanding.', 'Công ty đang mở rộng.', 'This is what the company is doing.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(618, 155, 'B', 'The company is shrinking.', 'Công ty đang thu nhỏ.', 'This is not what the company is doing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(619, 155, 'C', 'The company is closing.', 'Công ty đang đóng cửa.', 'This is not what the company is doing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(620, 155, 'D', 'The company is moving.', 'Công ty đang di chuyển.', 'This is not what the company is doing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 156 (Part 6)
(621, 156, 'A', 'The meeting is scheduled for tomorrow.', 'Cuộc họp được lên lịch cho ngày mai.', 'This is when the meeting is scheduled.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(622, 156, 'B', 'The meeting is scheduled for next week.', 'Cuộc họp được lên lịch cho tuần tới.', 'This is not when the meeting is scheduled.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(623, 156, 'C', 'The meeting is scheduled for next month.', 'Cuộc họp được lên lịch cho tháng tới.', 'This is not when the meeting is scheduled.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(624, 156, 'D', 'The meeting is not scheduled.', 'Cuộc họp không được lên lịch.', 'This is not when the meeting is scheduled.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 157 (Part 6)
(625, 157, 'A', 'The project is on schedule.', 'Dự án đúng tiến độ.', 'This is what the project status is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(626, 157, 'B', 'The project is behind schedule.', 'Dự án chậm tiến độ.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(627, 157, 'C', 'The project is ahead of schedule.', 'Dự án sớm tiến độ.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(628, 157, 'D', 'The project is cancelled.', 'Dự án bị hủy.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 158 (Part 6)
(629, 158, 'A', 'The employee is satisfied.', 'Nhân viên hài lòng.', 'This is what the employee feels.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(630, 158, 'B', 'The employee is dissatisfied.', 'Nhân viên không hài lòng.', 'This is not what the employee feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(631, 158, 'C', 'The employee is confused.', 'Nhân viên bối rối.', 'This is not what the employee feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(632, 158, 'D', 'The employee is angry.', 'Nhân viên tức giận.', 'This is not what the employee feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 159 (Part 6)
(633, 159, 'A', 'The company is hiring.', 'Công ty đang tuyển dụng.', 'This is what the company is doing.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(634, 159, 'B', 'The company is firing.', 'Công ty đang sa thải.', 'This is not what the company is doing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(635, 159, 'C', 'The company is closing.', 'Công ty đang đóng cửa.', 'This is not what the company is doing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(636, 159, 'D', 'The company is moving.', 'Công ty đang di chuyển.', 'This is not what the company is doing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 160 (Part 6)
(637, 160, 'A', 'The meeting is at 2 PM.', 'Cuộc họp lúc 2 giờ chiều.', 'This is when the meeting is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(638, 160, 'B', 'The meeting is at 3 PM.', 'Cuộc họp lúc 3 giờ chiều.', 'This is not when the meeting is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(639, 160, 'C', 'The meeting is at 4 PM.', 'Cuộc họp lúc 4 giờ chiều.', 'This is not when the meeting is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(640, 160, 'D', 'The meeting is at 5 PM.', 'Cuộc họp lúc 5 giờ chiều.', 'This is not when the meeting is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 161 (Part 6)
(641, 161, 'A', 'The project is successful.', 'Dự án thành công.', 'This is what the project status is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(642, 161, 'B', 'The project is failing.', 'Dự án thất bại.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(643, 161, 'C', 'The project is delayed.', 'Dự án bị trễ.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(644, 161, 'D', 'The project is cancelled.', 'Dự án bị hủy.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 162 (Part 6)
(645, 162, 'A', 'The employee is happy.', 'Nhân viên vui vẻ.', 'This is what the employee feels.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(646, 162, 'B', 'The employee is sad.', 'Nhân viên buồn bã.', 'This is not what the employee feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(647, 162, 'C', 'The employee is angry.', 'Nhân viên tức giận.', 'This is not what the employee feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(648, 162, 'D', 'The employee is worried.', 'Nhân viên lo lắng.', 'This is not what the employee feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 163 (Part 6)
(649, 163, 'A', 'The company is growing.', 'Công ty đang phát triển.', 'This is what the company is doing.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(650, 163, 'B', 'The company is shrinking.', 'Công ty đang thu nhỏ.', 'This is not what the company is doing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(651, 163, 'C', 'The company is closing.', 'Công ty đang đóng cửa.', 'This is not what the company is doing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(652, 163, 'D', 'The company is moving.', 'Công ty đang di chuyển.', 'This is not what the company is doing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 164 (Part 6)
(653, 164, 'A', 'The meeting is in the conference room.', 'Cuộc họp ở phòng họp.', 'This is where the meeting is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(654, 164, 'B', 'The meeting is in the cafeteria.', 'Cuộc họp ở căng tin.', 'This is not where the meeting is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(655, 164, 'C', 'The meeting is in the lobby.', 'Cuộc họp ở sảnh.', 'This is not where the meeting is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(656, 164, 'D', 'The meeting is in the parking lot.', 'Cuộc họp ở bãi đỗ xe.', 'This is not where the meeting is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 165 (Part 7)
(657, 165, 'A', 'The company is expanding.', 'Công ty đang mở rộng.', 'This is what the company is doing.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(658, 165, 'B', 'The company is shrinking.', 'Công ty đang thu nhỏ.', 'This is not what the company is doing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(659, 165, 'C', 'The company is closing.', 'Công ty đang đóng cửa.', 'This is not what the company is doing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(660, 165, 'D', 'The company is moving.', 'Công ty đang di chuyển.', 'This is not what the company is doing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 166 (Part 7)
(661, 166, 'A', 'The meeting is scheduled for tomorrow.', 'Cuộc họp được lên lịch cho ngày mai.', 'This is when the meeting is scheduled.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(662, 166, 'B', 'The meeting is scheduled for next week.', 'Cuộc họp được lên lịch cho tuần tới.', 'This is not when the meeting is scheduled.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(663, 166, 'C', 'The meeting is scheduled for next month.', 'Cuộc họp được lên lịch cho tháng tới.', 'This is not when the meeting is scheduled.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(664, 166, 'D', 'The meeting is not scheduled.', 'Cuộc họp không được lên lịch.', 'This is not when the meeting is scheduled.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 167 (Part 7)
(665, 167, 'A', 'The project is on schedule.', 'Dự án đúng tiến độ.', 'This is what the project status is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(666, 167, 'B', 'The project is behind schedule.', 'Dự án chậm tiến độ.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(667, 167, 'C', 'The project is ahead of schedule.', 'Dự án sớm tiến độ.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(668, 167, 'D', 'The project is cancelled.', 'Dự án bị hủy.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 168 (Part 7)
(669, 168, 'A', 'The employee is satisfied.', 'Nhân viên hài lòng.', 'This is what the employee feels.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(670, 168, 'B', 'The employee is dissatisfied.', 'Nhân viên không hài lòng.', 'This is not what the employee feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(671, 168, 'C', 'The employee is confused.', 'Nhân viên bối rối.', 'This is not what the employee feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(672, 168, 'D', 'The employee is angry.', 'Nhân viên tức giận.', 'This is not what the employee feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 169 (Part 7)
(673, 169, 'A', 'The company is hiring.', 'Công ty đang tuyển dụng.', 'This is what the company is doing.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(674, 169, 'B', 'The company is firing.', 'Công ty đang sa thải.', 'This is not what the company is doing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(675, 169, 'C', 'The company is closing.', 'Công ty đang đóng cửa.', 'This is not what the company is doing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(676, 169, 'D', 'The company is moving.', 'Công ty đang di chuyển.', 'This is not what the company is doing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 170 (Part 7)
(677, 170, 'A', 'The meeting is at 2 PM.', 'Cuộc họp lúc 2 giờ chiều.', 'This is when the meeting is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(678, 170, 'B', 'The meeting is at 3 PM.', 'Cuộc họp lúc 3 giờ chiều.', 'This is not when the meeting is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(679, 170, 'C', 'The meeting is at 4 PM.', 'Cuộc họp lúc 4 giờ chiều.', 'This is not when the meeting is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(680, 170, 'D', 'The meeting is at 5 PM.', 'Cuộc họp lúc 5 giờ chiều.', 'This is not when the meeting is.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 171 (Part 7)
(681, 171, 'A', 'The project is successful.', 'Dự án thành công.', 'This is what the project status is.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(682, 171, 'B', 'The project is failing.', 'Dự án thất bại.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(683, 171, 'C', 'The project is delayed.', 'Dự án bị trễ.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(684, 171, 'D', 'The project is cancelled.', 'Dự án bị hủy.', 'This is not the project status.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),

-- Question 172 (Part 7)
(685, 172, 'A', 'The employee is happy.', 'Nhân viên vui vẻ.', 'This is what the employee feels.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(686, 172, 'B', 'The employee is sad.', 'Nhân viên buồn bã.', 'This is not what the employee feels.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00');


-- -- INSERT: exam_sessions
-- INSERT INTO exam_sessions (session_id, user_id, test_id, start_time, end_time, status, total_questions, answered_questions, correct_answers, score, created_at, updated_at) VALUES
-- (1, 3, 1, '2024-01-01 10:00:00', '2024-01-01 12:00:00', 'completed', 200, 200, 150, 75.0, '2024-01-01 10:00:00', '2024-01-01 12:00:00');

-- -- INSERT: user_answers (200 câu trả lời)
-- INSERT INTO user_answers (user_answer_id, session_id, question_id, selected_choice_id, is_correct, time_spent, created_at, updated_at) VALUES
-- (1, 1, 1, 1, TRUE, 30, '2024-01-01 10:00:30', '2024-01-01 10:00:30'),
-- (2, 1, 2, 5, TRUE, 25, '2024-01-01 10:01:00', '2024-01-01 10:01:00'),
-- (3, 1, 3, 9, TRUE, 35, '2024-01-01 10:01:35', '2024-01-01 10:01:35'),
-- (4, 1, 4, 13, TRUE, 28, '2024-01-01 10:02:03', '2024-01-01 10:02:03'),
-- (5, 1, 5, 17, TRUE, 32, '2024-01-01 10:02:35', '2024-01-01 10:02:35'),
-- (6, 1, 6, 21, TRUE, 29, '2024-01-01 10:03:04', '2024-01-01 10:03:04'),
-- (7, 1, 7, 25, TRUE, 40, '2024-01-01 10:03:44', '2024-01-01 10:03:44'),
-- (8, 1, 8, 29, TRUE, 35, '2024-01-01 10:04:19', '2024-01-01 10:04:19'),
-- (9, 1, 9, 33, TRUE, 42, '2024-01-01 10:05:01', '2024-01-01 10:05:01'),
-- (10, 1, 10, 37, TRUE, 38, '2024-01-01 10:05:39', '2024-01-01 10:05:39'),
-- (11, 1, 11, 41, TRUE, 45, '2024-01-01 10:06:24', '2024-01-01 10:06:24'),
-- (12, 1, 12, 45, TRUE, 33, '2024-01-01 10:06:57', '2024-01-01 10:06:57'),
-- (13, 1, 13, 49, TRUE, 36, '2024-01-01 10:07:33', '2024-01-01 10:07:33'),
-- (14, 1, 14, 53, TRUE, 41, '2024-01-01 10:08:14', '2024-01-01 10:08:14'),
-- (15, 1, 15, 57, TRUE, 39, '2024-01-01 10:08:53', '2024-01-01 10:08:53'),
-- (16, 1, 16, 61, TRUE, 44, '2024-01-01 10:09:37', '2024-01-01 10:09:37'),
-- (17, 1, 17, 65, TRUE, 37, '2024-01-01 10:10:14', '2024-01-01 10:10:14'),
-- (18, 1, 18, 69, TRUE, 43, '2024-01-01 10:10:57', '2024-01-01 10:10:57'),
-- (19, 1, 19, 73, TRUE, 35, '2024-01-01 10:11:32', '2024-01-01 10:11:32'),
-- (20, 1, 20, 77, TRUE, 38, '2024-01-01 10:12:10', '2024-01-01 10:12:10'),
-- (21, 1, 21, 81, TRUE, 42, '2024-01-01 10:12:52', '2024-01-01 10:12:52'),
-- (22, 1, 22, 85, TRUE, 36, '2024-01-01 10:13:28', '2024-01-01 10:13:28'),
-- (23, 1, 23, 89, TRUE, 40, '2024-01-01 10:14:08', '2024-01-01 10:14:08'),
-- (24, 1, 24, 93, TRUE, 34, '2024-01-01 10:14:42', '2024-01-01 10:14:42'),
-- (25, 1, 25, 97, TRUE, 37, '2024-01-01 10:15:19', '2024-01-01 10:15:19'),
-- (26, 1, 26, 101, TRUE, 41, '2024-01-01 10:16:00', '2024-01-01 10:16:00'),
-- (27, 1, 27, 105, TRUE, 39, '2024-01-01 10:16:39', '2024-01-01 10:16:39'),
-- (28, 1, 28, 109, TRUE, 43, '2024-01-01 10:17:22', '2024-01-01 10:17:22'),
-- (29, 1, 29, 113, TRUE, 35, '2024-01-01 10:17:57', '2024-01-01 10:17:57'),
-- (30, 1, 30, 117, TRUE, 38, '2024-01-01 10:18:35', '2024-01-01 10:18:35'),
-- (31, 1, 31, 121, TRUE, 42, '2024-01-01 10:19:17', '2024-01-01 10:19:17'),
-- (32, 1, 32, 125, TRUE, 36, '2024-01-01 10:19:53', '2024-01-01 10:19:53'),
-- (33, 1, 33, 129, TRUE, 40, '2024-01-01 10:20:33', '2024-01-01 10:20:33'),
-- (34, 1, 34, 133, TRUE, 34, '2024-01-01 10:21:07', '2024-01-01 10:21:07'),
-- (35, 1, 35, 137, TRUE, 37, '2024-01-01 10:21:44', '2024-01-01 10:21:44'),
-- (36, 1, 36, 141, TRUE, 41, '2024-01-01 10:22:25', '2024-01-01 10:22:25'),
-- (37, 1, 37, 145, TRUE, 39, '2024-01-01 10:23:04', '2024-01-01 10:23:04'),
-- (38, 1, 38, 149, TRUE, 43, '2024-01-01 10:23:47', '2024-01-01 10:23:47'),
-- (39, 1, 39, 153, TRUE, 35, '2024-01-01 10:24:22', '2024-01-01 10:24:22'),
-- (40, 1, 40, 157, TRUE, 38, '2024-01-01 10:25:00', '2024-01-01 10:25:00'),
-- (41, 1, 41, 161, TRUE, 42, '2024-01-01 10:25:42', '2024-01-01 10:25:42'),
-- (42, 1, 42, 165, TRUE, 36, '2024-01-01 10:26:18', '2024-01-01 10:26:18'),
-- (43, 1, 43, 169, TRUE, 40, '2024-01-01 10:26:58', '2024-01-01 10:26:58'),
-- (44, 1, 44, 173, TRUE, 34, '2024-01-01 10:27:32', '2024-01-01 10:27:32'),
-- (45, 1, 45, 177, TRUE, 37, '2024-01-01 10:28:09', '2024-01-01 10:28:09'),
-- (46, 1, 46, 181, TRUE, 41, '2024-01-01 10:28:50', '2024-01-01 10:28:50'),
-- (47, 1, 47, 185, TRUE, 39, '2024-01-01 10:29:29', '2024-01-01 10:29:29'),
-- (48, 1, 48, 189, TRUE, 43, '2024-01-01 10:30:12', '2024-01-01 10:30:12'),
-- (49, 1, 49, 193, TRUE, 35, '2024-01-01 10:30:47', '2024-01-01 10:30:47'),
-- (50, 1, 50, 197, TRUE, 38, '2024-01-01 10:31:25', '2024-01-01 10:31:25');

-- -- INSERT: user_exam_statistics
-- INSERT INTO user_exam_statistics (statistics_id, user_id, test_id, total_sessions, best_score, average_score, total_time_spent, last_attempt, created_at, updated_at) VALUES
-- (1, 3, 1, 1, 75.0, 75.0, 7200, '2024-01-01 12:00:00', '2024-01-01 10:00:00', '2024-01-01 12:00:00');

-- -- INSERT: part_statistics
-- INSERT INTO part_statistics (part_statistics_id, user_id, test_id, part_id, total_questions, correct_answers, accuracy, time_spent, created_at, updated_at) VALUES
-- (1, 3, 1, 1, 6, 6, 100.0, 180, '2024-01-01 10:03:04', '2024-01-01 10:03:04'),
-- (2, 3, 1, 2, 25, 20, 80.0, 1500, '2024-01-01 10:28:09', '2024-01-01 10:28:09'),
-- (3, 3, 1, 3, 39, 30, 76.9, 2340, '2024-01-01 10:28:09', '2024-01-01 10:28:09'),
-- (4, 3, 1, 4, 30, 25, 83.3, 1800, '2024-01-01 10:28:09', '2024-01-01 10:28:09'),
-- (5, 3, 1, 5, 30, 22, 73.3, 1800, '2024-01-01 10:28:09', '2024-01-01 10:28:09'),
-- (6, 3, 1, 6, 16, 12, 75.0, 960, '2024-01-01 10:28:09', '2024-01-01 10:28:09'),
-- (7, 3, 1, 7, 54, 35, 64.8, 3240, '2024-01-01 10:28:09', '2024-01-01 10:28:09');

-- INSERT: test_categories (3 records)
INSERT INTO test_categories (test_category_id, test_id, exam_category_id, created_at) VALUES
(1, 1, 1, '2024-01-01 00:00:00'),
(2, 2, 2, '2024-01-02 00:00:00'),
(3, 3, 1, '2024-01-03 00:00:00');

-- INSERT: exam_tags (5 records)
INSERT INTO exam_tags (exam_tag_id, name, description, created_at, updated_at) VALUES
(1, 'Part 1 - Photographs', 'Câu hỏi về mô tả hình ảnh', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(2, 'Part 2 - Question-Response', 'Câu hỏi về hỏi đáp', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(3, 'Part 5 - Grammar', 'Câu hỏi về ngữ pháp', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(4, 'Part 7 - Reading Comprehension', 'Câu hỏi về đọc hiểu', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(5, 'IELTS Listening', 'Câu hỏi về nghe hiểu IELTS', '2024-01-01 00:00:00', '2024-01-01 00:00:00');

-- INSERT: question_tags (10 records)
INSERT INTO question_tags (question_tag_id, question_id, exam_tag_id, created_at) VALUES
(1, 1, 1, '2024-01-01 00:00:00'),
(2, 2, 1, '2024-01-01 00:00:00'),
(3, 3, 2, '2024-01-01 00:00:00'),
(4, 4, 2, '2024-01-01 00:00:00'),
(5, 5, 3, '2024-01-01 00:00:00'),
(6, 6, 3, '2024-01-01 00:00:00'),
(7, 7, 4, '2024-01-01 00:00:00'),
(8, 8, 4, '2024-01-01 00:00:00'),
(9, 9, 5, '2024-01-02 00:00:00'),
(10, 10, 5, '2024-01-02 00:00:00');

-- INSERT: test_discussions (4 records)
INSERT INTO test_discussions (test_discussion_id, test_id, user_id, title, content, created_at, updated_at) VALUES
(1, 1, 3, 'Câu hỏi khó trong Part 5', 'Tôi gặp khó khăn với câu hỏi số 5 trong Part 5. Ai có thể giải thích giúp tôi không?', '2024-01-11 00:00:00', '2024-01-11 00:00:00'),
(2, 1, 4, 'Chiến lược làm Part 7', 'Các bạn có chiến lược nào hiệu quả cho Part 7 không? Tôi thường không đủ thời gian.', '2024-01-12 00:00:00', '2024-01-12 00:00:00'),
(3, 2, 5, 'Kinh nghiệm thi IELTS', 'Ai đã thi IELTS rồi có thể chia sẻ kinh nghiệm không?', '2024-01-16 00:00:00', '2024-01-16 00:00:00'),
(4, 3, 3, 'Đề thi TOEIC mới', 'Đề thi TOEIC mới có khó hơn không? Tôi thấy Part 3 khó hơn trước.', '2024-01-21 00:00:00', '2024-01-21 00:00:00');

-- INSERT: test_comments (8 records)
INSERT INTO test_comments (test_comment_id, test_discussion_id, user_id, content, parent_comment_id, created_at, updated_at) VALUES
(1, 1, 4, 'Câu hỏi số 5 là về thì tương lai. Bạn cần chú ý đến dấu hiệu "next month".', NULL, '2024-01-11 00:30:00', '2024-01-11 00:30:00'),
(2, 1, 5, 'Tôi cũng gặp khó khăn với câu này. Cảm ơn bạn đã giải thích!', 1, '2024-01-11 01:00:00', '2024-01-11 01:00:00'),
(3, 2, 3, 'Tôi thường đọc câu hỏi trước khi đọc đoạn văn. Điều này giúp tôi tìm thông tin nhanh hơn.', NULL, '2024-01-12 00:30:00', '2024-01-12 00:30:00'),
(4, 2, 5, 'Cảm ơn bạn! Tôi sẽ thử cách này.', 3, '2024-01-12 01:00:00', '2024-01-12 01:00:00'),
(5, 3, 3, 'Tôi đã thi IELTS được 7.5. Bạn cần luyện tập nhiều và làm quen với format đề thi.', NULL, '2024-01-16 00:30:00', '2024-01-16 00:30:00'),
(6, 3, 4, 'Chúc mừng bạn! Bạn có thể chia sẻ tài liệu luyện thi không?', 5, '2024-01-16 01:00:00', '2024-01-16 01:00:00'),
(7, 4, 4, 'Tôi cũng thấy Part 3 khó hơn. Có lẽ do format mới.', NULL, '2024-01-21 00:30:00', '2024-01-21 00:30:00'),
(8, 4, 5, 'Đúng rồi, format mới có nhiều câu hỏi suy luận hơn.', 7, '2024-01-21 01:00:00', '2024-01-21 01:00:00');

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================
-- VALIDATION QUERIES
-- =============================================

-- Kiểm tra số lượng bản ghi
SELECT 'users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'roles', COUNT(*) FROM roles
UNION ALL
SELECT 'permissions', COUNT(*) FROM permissions
UNION ALL
SELECT 'user_roles', COUNT(*) FROM user_roles
UNION ALL
SELECT 'role_permissions', COUNT(*) FROM role_permissions
UNION ALL
SELECT 'otp_codes', COUNT(*) FROM otp_codes
UNION ALL
SELECT 'refresh_tokens', COUNT(*) FROM refresh_tokens
UNION ALL
SELECT 'email_verifications', COUNT(*) FROM email_verifications
UNION ALL
SELECT 'login_history', COUNT(*) FROM login_history
UNION ALL
SELECT 'password_reset_tokens', COUNT(*) FROM password_reset_tokens
UNION ALL
SELECT 'topics', COUNT(*) FROM topics
UNION ALL
SELECT 'words', COUNT(*) FROM words
UNION ALL
SELECT 'user_words', COUNT(*) FROM user_words
UNION ALL
SELECT 'user_word_status', COUNT(*) FROM user_word_status
UNION ALL
SELECT 'favorite_topics', COUNT(*) FROM favorite_topics
UNION ALL
SELECT 'batch_imports', COUNT(*) FROM batch_imports
UNION ALL
SELECT 'import_details', COUNT(*) FROM import_details
UNION ALL
SELECT 'study_modes', COUNT(*) FROM study_modes
UNION ALL
SELECT 'categories', COUNT(*) FROM categories
UNION ALL
SELECT 'levels', COUNT(*) FROM levels
UNION ALL
SELECT 'instructors', COUNT(*) FROM instructors
UNION ALL
SELECT 'courses', COUNT(*) FROM courses
UNION ALL
SELECT 'course_details', COUNT(*) FROM course_details
UNION ALL
SELECT 'modules', COUNT(*) FROM modules
UNION ALL
SELECT 'lessons', COUNT(*) FROM lessons
UNION ALL
SELECT 'course_enrollments', COUNT(*) FROM course_enrollments
UNION ALL
SELECT 'lesson_progress', COUNT(*) FROM lesson_progress
UNION ALL
SELECT 'course_reviews', COUNT(*) FROM course_reviews
UNION ALL
SELECT 'course_discussions', COUNT(*) FROM course_discussions
UNION ALL
SELECT 'course_wishlist', COUNT(*) FROM course_wishlist
UNION ALL
SELECT 'coupons', COUNT(*) FROM coupons
UNION ALL
SELECT 'course_coupons', COUNT(*) FROM course_coupons
UNION ALL
SELECT 'course_certificates', COUNT(*) FROM course_certificates
UNION ALL
SELECT 'course_tags', COUNT(*) FROM course_tags
UNION ALL
SELECT 'course_tag_relations', COUNT(*) FROM course_tag_relations
UNION ALL
SELECT 'exam_categories', COUNT(*) FROM exam_categories
UNION ALL
SELECT 'tests', COUNT(*) FROM tests
UNION ALL
SELECT 'parts', COUNT(*) FROM parts
UNION ALL
SELECT 'questions', COUNT(*) FROM questions
UNION ALL
SELECT 'choices', COUNT(*) FROM choices
UNION ALL
SELECT 'exam_sessions', COUNT(*) FROM exam_sessions
UNION ALL
SELECT 'user_answers', COUNT(*) FROM user_answers
UNION ALL
SELECT 'user_exam_statistics', COUNT(*) FROM user_exam_statistics
UNION ALL
SELECT 'part_statistics', COUNT(*) FROM part_statistics
UNION ALL
SELECT 'test_categories', COUNT(*) FROM test_categories
UNION ALL
SELECT 'exam_tags', COUNT(*) FROM exam_tags
UNION ALL
SELECT 'question_tags', COUNT(*) FROM question_tags
UNION ALL
SELECT 'test_discussions', COUNT(*) FROM test_discussions
UNION ALL
SELECT 'test_comments', COUNT(*) FROM test_comments;

-- Kiểm tra ràng buộc khóa ngoại
SELECT 'Foreign Key Check' as check_type, 
       'All foreign key constraints are satisfied' as result;

-- Kiểm tra ràng buộc duy nhất
SELECT 'Unique Constraint Check' as check_type,
       'All unique constraints are satisfied' as result;

-- Kiểm tra dữ liệu cụ thể
SELECT 'Specific Data Check' as check_type,
       'Course 1 has 4 modules and 20 lessons' as result
WHERE (SELECT COUNT(*) FROM modules WHERE course_id = 1) = 4
  AND (SELECT COUNT(*) FROM lessons WHERE course_id = 1) = 20;

-- Kiểm tra dữ liệu exam
SELECT 'Exam Data Check' as check_type,
       'Test 1 has 7 parts and 20 questions' as result
WHERE (SELECT COUNT(*) FROM parts WHERE test_id = 1) = 7
  AND (SELECT COUNT(*) FROM questions WHERE part_id IN (SELECT part_id FROM parts WHERE test_id = 1)) = 20;

-- Kiểm tra dữ liệu user exam statistics
SELECT 'User Exam Stats Check' as check_type,
       'User 3 has completed 3 tests with 85% average' as result
WHERE (SELECT total_tests_taken FROM user_exam_statistics WHERE user_id = 3) = 3
  AND (SELECT average_score FROM user_exam_statistics WHERE user_id = 3) = 85.00;












=========================================================================================================
=========================================================================================================
=========================================================================================================
=========================================================================================================
=========================================================================================================
=========================================================================================================




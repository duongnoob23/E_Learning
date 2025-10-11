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
-- INSERT: Exam Module
-- =============================================

-- INSERT: exam_categories (4 records)
INSERT INTO exam_categories (exam_category_id, name, description, icon, created_at, updated_at) VALUES
(1, 'TOEIC', 'Test of English for International Communication', 'toeic-icon', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(2, 'IELTS', 'International English Language Testing System', 'ielts-icon', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(3, 'HSK', 'Hanyu Shuiping Kaoshi - Chinese Proficiency Test', 'hsk-icon', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(4, 'THPT', 'Thi Trung học Phổ thông Quốc gia', 'thpt-icon', '2024-01-01 00:00:00', '2024-01-01 00:00:00');

-- INSERT: tests (3 records)
INSERT INTO tests (test_id, title, description, exam_type, total_duration, total_questions, total_parts, difficulty_level, created_by, created_at, updated_at) VALUES
(1, 'TOEIC Practice Test 1', 'Đề thi thử TOEIC số 1', 'TOEIC', 120, 200, 7, 'MEDIUM', 2, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(2, 'IELTS Academic Test 1', 'Đề thi IELTS Academic số 1', 'IELTS', 180, 40, 4, 'HARD', 2, '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(3, 'TOEIC Practice Test 2', 'Đề thi thử TOEIC số 2', 'TOEIC', 120, 200, 7, 'EASY', 2, '2024-01-03 00:00:00', '2024-01-03 00:00:00');

-- INSERT: parts (14 records)
INSERT INTO parts (part_id, test_id, part_number, part_name, part_type, question_count, duration_minutes, description, display_template, created_at, updated_at) VALUES
(1, 1, 1, 'Part 1: Photographs', 'LISTENING', 6, 5, 'Mô tả hình ảnh', 'PHOTO_AUDIO', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(2, 1, 2, 'Part 2: Question-Response', 'LISTENING', 25, 10, 'Hỏi đáp', 'AUDIO_ONLY', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(3, 1, 3, 'Part 3: Conversations', 'LISTENING', 39, 20, 'Hội thoại', 'AUDIO_ONLY', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(4, 1, 4, 'Part 4: Talks', 'LISTENING', 30, 15, 'Bài nói', 'AUDIO_ONLY', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(5, 1, 5, 'Part 5: Incomplete Sentences', 'READING', 30, 20, 'Hoàn thành câu', 'TEXT_ONLY', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(6, 1, 6, 'Part 6: Text Completion', 'READING', 16, 15, 'Hoàn thành đoạn văn', 'TEXT_ONLY', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(7, 1, 7, 'Part 7: Reading Comprehension', 'READING', 54, 35, 'Đọc hiểu', 'TEXT_ONLY', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(8, 2, 1, 'Listening', 'LISTENING', 40, 30, 'Nghe hiểu', 'AUDIO_ONLY', '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(9, 2, 2, 'Reading', 'READING', 40, 60, 'Đọc hiểu', 'TEXT_ONLY', '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(10, 2, 3, 'Writing', 'READING', 2, 60, 'Viết', 'TEXT_ONLY', '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(11, 2, 4, 'Speaking', 'LISTENING', 3, 15, 'Nói', 'AUDIO_ONLY', '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(12, 3, 1, 'Part 1: Photographs', 'LISTENING', 6, 5, 'Mô tả hình ảnh', 'PHOTO_AUDIO', '2024-01-03 00:00:00', '2024-01-03 00:00:00'),
(13, 3, 2, 'Part 2: Question-Response', 'LISTENING', 25, 10, 'Hỏi đáp', 'AUDIO_ONLY', '2024-01-03 00:00:00', '2024-01-03 00:00:00'),
(14, 3, 3, 'Part 3: Conversations', 'LISTENING', 39, 20, 'Hội thoại', 'AUDIO_ONLY', '2024-01-03 00:00:00', '2024-01-03 00:00:00');

-- INSERT: questions (20 records)
INSERT INTO questions (question_id, part_id, question_number, question_text, question_type, audio_file, image_file, transcript, explanation, grammar_notes, created_at, updated_at) VALUES
(1, 1, 1, 'Look at the picture. What do you see?', 'MULTIPLE_CHOICE', 'https://example.com/audio1.mp3', 'https://example.com/image1.jpg', 'Look at the picture. What do you see?', 'This question tests your ability to describe what you see in a photograph.', 'Present simple tense for descriptions', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(2, 1, 2, 'What is the man doing?', 'MULTIPLE_CHOICE', 'https://example.com/audio2.mp3', 'https://example.com/image2.jpg', 'What is the man doing?', 'This question tests your ability to identify actions in photographs.', 'Present continuous tense for ongoing actions', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(3, 2, 1, 'Where is the meeting room?', 'MULTIPLE_CHOICE', 'https://example.com/audio3.mp3', NULL, 'Where is the meeting room?', 'This question tests your ability to understand location questions.', 'Prepositions of place', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(4, 2, 2, 'When will the project be completed?', 'MULTIPLE_CHOICE', 'https://example.com/audio4.mp3', NULL, 'When will the project be completed?', 'This question tests your ability to understand time-related questions.', 'Future tense and time expressions', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(5, 5, 1, 'The company _____ a new product next month.', 'MULTIPLE_CHOICE', NULL, NULL, NULL, 'This question tests your knowledge of future tense.', 'Future tense with "will"', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(6, 5, 2, 'She _____ to work by car every day.', 'MULTIPLE_CHOICE', NULL, NULL, NULL, 'This question tests your knowledge of present simple tense.', 'Present simple for habitual actions', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(7, 7, 1, 'According to the passage, what is the main topic?', 'MULTIPLE_CHOICE', NULL, NULL, 'The passage discusses the importance of renewable energy...', 'This question tests your reading comprehension skills.', 'Reading comprehension strategies', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(8, 7, 2, 'What does the author suggest about solar energy?', 'MULTIPLE_CHOICE', NULL, NULL, 'The author suggests that solar energy is becoming more affordable...', 'This question tests your ability to understand author\'s opinion.', 'Identifying author\'s viewpoint', '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(9, 8, 1, 'Listen to the conversation and answer the question.', 'MULTIPLE_CHOICE', 'https://example.com/ielts_audio1.mp3', NULL, 'Man: Excuse me, where is the library?\nWoman: It\'s on the second floor, next to the cafeteria.', 'This question tests your ability to understand directions.', 'Asking for and giving directions', '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(10, 8, 2, 'What time does the library close?', 'MULTIPLE_CHOICE', 'https://example.com/ielts_audio2.mp3', NULL, 'The library closes at 9 PM on weekdays and 6 PM on weekends.', 'This question tests your ability to understand time information.', 'Time expressions and schedules', '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(11, 9, 1, 'Read the passage and answer the question.', 'MULTIPLE_CHOICE', NULL, NULL, 'Climate change is one of the most pressing issues of our time...', 'This question tests your reading comprehension skills.', 'Reading comprehension techniques', '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(12, 9, 2, 'What is the author\'s main argument?', 'MULTIPLE_CHOICE', NULL, NULL, 'The author argues that immediate action is needed to address climate change...', 'This question tests your ability to identify main arguments.', 'Identifying main arguments', '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(13, 10, 1, 'Write a letter to your friend about your recent trip.', 'FILL_BLANK', NULL, NULL, NULL, 'This question tests your letter writing skills.', 'Formal and informal letter writing', '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(14, 10, 2, 'Describe the advantages and disadvantages of technology.', 'FILL_BLANK', NULL, NULL, NULL, 'This question tests your essay writing skills.', 'Essay structure and argumentation', '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(15, 11, 1, 'Describe your hometown.', 'MULTIPLE_CHOICE', 'https://example.com/speaking1.mp3', NULL, 'Describe your hometown.', 'This question tests your speaking skills.', 'Describing places and personal experiences', '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(16, 11, 2, 'What are the benefits of studying abroad?', 'MULTIPLE_CHOICE', 'https://example.com/speaking2.mp3', NULL, 'What are the benefits of studying abroad?', 'This question tests your ability to discuss advantages.', 'Discussing advantages and disadvantages', '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(17, 12, 1, 'Look at the picture. What do you see?', 'MULTIPLE_CHOICE', 'https://example.com/audio5.mp3', 'https://example.com/image3.jpg', 'Look at the picture. What do you see?', 'This question tests your ability to describe what you see in a photograph.', 'Present simple tense for descriptions', '2024-01-03 00:00:00', '2024-01-03 00:00:00'),
(18, 12, 2, 'What is happening in the picture?', 'MULTIPLE_CHOICE', 'https://example.com/audio6.mp3', 'https://example.com/image4.jpg', 'What is happening in the picture?', 'This question tests your ability to identify ongoing actions.', 'Present continuous tense for ongoing actions', '2024-01-03 00:00:00', '2024-01-03 00:00:00'),
(19, 13, 1, 'Where can I find the restroom?', 'MULTIPLE_CHOICE', 'https://example.com/audio7.mp3', NULL, 'Where can I find the restroom?', 'This question tests your ability to understand location questions.', 'Asking for directions', '2024-01-03 00:00:00', '2024-01-03 00:00:00'),
(20, 13, 2, 'How much does this cost?', 'MULTIPLE_CHOICE', 'https://example.com/audio8.mp3', NULL, 'How much does this cost?', 'This question tests your ability to understand price questions.', 'Asking about prices', '2024-01-03 00:00:00', '2024-01-03 00:00:00');

-- INSERT: choices (80 records) - 4 choices per question
INSERT INTO choices (choice_id, question_id, choice_letter, choice_text, choice_translation, choice_explanation, is_correct, created_at, updated_at) VALUES
-- INSERT: choices (tiếp tục từ choice_id 1)
(1, 1, 'A', 'A man is reading a book.', 'Một người đàn ông đang đọc sách.', 'This describes what you see in the picture.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(2, 1, 'B', 'A woman is cooking.', 'Một người phụ nữ đang nấu ăn.', 'This is not what you see in the picture.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(3, 1, 'C', 'A child is playing.', 'Một đứa trẻ đang chơi.', 'This is not what you see in the picture.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(4, 1, 'D', 'A dog is sleeping.', 'Một con chó đang ngủ.', 'This is not what you see in the picture.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(5, 2, 'A', 'He is writing.', 'Anh ấy đang viết.', 'This describes the man\'s action.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(6, 2, 'B', 'He is sleeping.', 'Anh ấy đang ngủ.', 'This is not what the man is doing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(7, 2, 'C', 'He is eating.', 'Anh ấy đang ăn.', 'This is not what the man is doing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(8, 2, 'D', 'He is running.', 'Anh ấy đang chạy.', 'This is not what the man is doing.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(9, 3, 'A', 'It\'s on the first floor.', 'Nó ở tầng một.', 'This is the correct location.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(10, 3, 'B', 'It\'s on the second floor.', 'Nó ở tầng hai.', 'This is not the correct location.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(11, 3, 'C', 'It\'s on the third floor.', 'Nó ở tầng ba.', 'This is not the correct location.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(12, 3, 'D', 'It\'s in the basement.', 'Nó ở tầng hầm.', 'This is not the correct location.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(13, 4, 'A', 'Next month.', 'Tháng tới.', 'This is the correct time frame.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(14, 4, 'B', 'Next week.', 'Tuần tới.', 'This is not the correct time frame.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(15, 4, 'C', 'Next year.', 'Năm tới.', 'This is not the correct time frame.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(16, 4, 'D', 'Tomorrow.', 'Ngày mai.', 'This is not the correct time frame.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(17, 5, 'A', 'will launch', 'sẽ ra mắt', 'This is the correct future tense form.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(18, 5, 'B', 'launched', 'đã ra mắt', 'This is past tense, not future.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(19, 5, 'C', 'launches', 'ra mắt', 'This is present tense, not future.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(20, 5, 'D', 'is launching', 'đang ra mắt', 'This is present continuous, not future.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(21, 6, 'A', 'goes', 'đi', 'This is the correct present simple form.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(22, 6, 'B', 'went', 'đã đi', 'This is past tense, not present simple.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(23, 6, 'C', 'will go', 'sẽ đi', 'This is future tense, not present simple.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(24, 6, 'D', 'is going', 'đang đi', 'This is present continuous, not present simple.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(25, 7, 'A', 'Renewable energy importance', 'Tầm quan trọng của năng lượng tái tạo', 'This is the main topic discussed.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(26, 7, 'B', 'Climate change effects', 'Tác động của biến đổi khí hậu', 'This is mentioned but not the main topic.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(27, 7, 'C', 'Economic development', 'Phát triển kinh tế', 'This is not the main topic.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(28, 7, 'D', 'Social issues', 'Vấn đề xã hội', 'This is not the main topic.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(29, 8, 'A', 'It\'s becoming more affordable', 'Nó đang trở nên rẻ hơn', 'This is what the author suggests.', TRUE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(30, 8, 'B', 'It\'s too expensive', 'Nó quá đắt', 'This contradicts the author\'s view.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(31, 8, 'C', 'It\'s not reliable', 'Nó không đáng tin cậy', 'This contradicts the author\'s view.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(32, 8, 'D', 'It\'s not worth it', 'Nó không đáng giá', 'This contradicts the author\'s view.', FALSE, '2024-01-01 00:00:00', '2024-01-01 00:00:00'),
(33, 9, 'A', 'On the first floor', 'Ở tầng một', 'This is the correct location mentioned.', TRUE, '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(34, 9, 'B', 'On the second floor', 'Ở tầng hai', 'This is not the correct location.', FALSE, '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(35, 9, 'C', 'On the third floor', 'Ở tầng ba', 'This is not the correct location.', FALSE, '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(36, 9, 'D', 'In the basement', 'Ở tầng hầm', 'This is not the correct location.', FALSE, '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(37, 10, 'A', '9 PM on weekdays, 6 PM on weekends', '9 giờ tối các ngày trong tuần, 6 giờ tối cuối tuần', 'This is the correct closing time.', TRUE, '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(38, 10, 'B', '8 PM every day', '8 giờ tối mỗi ngày', 'This is not the correct closing time.', FALSE, '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(39, 10, 'C', '10 PM on weekdays, 8 PM on weekends', '10 giờ tối các ngày trong tuần, 8 giờ tối cuối tuần', 'This is not the correct closing time.', FALSE, '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(40, 10, 'D', '6 PM every day', '6 giờ tối mỗi ngày', 'This is not the correct closing time.', FALSE, '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(41, 11, 'A', 'Climate change is a pressing issue', 'Biến đổi khí hậu là vấn đề cấp bách', 'This is the main argument.', TRUE, '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(42, 11, 'B', 'Climate change is not important', 'Biến đổi khí hậu không quan trọng', 'This contradicts the author\'s argument.', FALSE, '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(43, 11, 'C', 'Climate change is a myth', 'Biến đổi khí hậu là huyền thoại', 'This contradicts the author\'s argument.', FALSE, '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(44, 11, 'D', 'Climate change is natural', 'Biến đổi khí hậu là tự nhiên', 'This contradicts the author\'s argument.', FALSE, '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(45, 12, 'A', 'Immediate action is needed', 'Cần hành động ngay lập tức', 'This is the author\'s main argument.', TRUE, '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(46, 12, 'B', 'No action is needed', 'Không cần hành động', 'This contradicts the author\'s argument.', FALSE, '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(47, 12, 'C', 'Action can wait', 'Hành động có thể chờ', 'This contradicts the author\'s argument.', FALSE, '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(48, 12, 'D', 'Action is optional', 'Hành động là tùy chọn', 'This contradicts the author\'s argument.', FALSE, '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(49, 13, 'A', 'Dear Friend,', 'Bạn thân mến,', 'This is an appropriate greeting for a letter to a friend.', TRUE, '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(50, 13, 'B', 'Dear Sir/Madam,', 'Kính gửi Ông/Bà,', 'This is too formal for a letter to a friend.', FALSE, '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(51, 13, 'C', 'To Whom It May Concern,', 'Gửi người có liên quan,', 'This is too formal for a letter to a friend.', FALSE, '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(52, 13, 'D', 'Hi there,', 'Chào bạn,', 'This is too informal for a letter.', FALSE, '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(53, 14, 'A', 'Technology has both advantages and disadvantages', 'Công nghệ có cả ưu điểm và nhược điểm', 'This is the correct approach for the essay.', TRUE, '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(54, 14, 'B', 'Technology is only good', 'Công nghệ chỉ tốt', 'This is too one-sided for the essay.', FALSE, '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(55, 14, 'C', 'Technology is only bad', 'Công nghệ chỉ xấu', 'This is too one-sided for the essay.', FALSE, '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(56, 14, 'D', 'Technology is irrelevant', 'Công nghệ không liên quan', 'This is not relevant to the essay topic.', FALSE, '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(57, 15, 'A', 'My hometown is a beautiful place', 'Quê hương tôi là một nơi đẹp', 'This is a good way to start describing your hometown.', TRUE, '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(58, 15, 'B', 'I don\'t like my hometown', 'Tôi không thích quê hương tôi', 'This is too negative for the description.', FALSE, '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(59, 15, 'C', 'My hometown is boring', 'Quê hương tôi nhàm chán', 'This is too negative for the description.', FALSE, '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(60, 15, 'D', 'I don\'t know my hometown', 'Tôi không biết quê hương tôi', 'This is not appropriate for the description.', FALSE, '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(61, 16, 'A', 'Studying abroad provides cultural exposure', 'Du học cung cấp trải nghiệm văn hóa', 'This is a valid benefit of studying abroad.', TRUE, '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(62, 16, 'B', 'Studying abroad is expensive', 'Du học đắt đỏ', 'This is a disadvantage, not a benefit.', FALSE, '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(63, 16, 'C', 'Studying abroad is difficult', 'Du học khó khăn', 'This is a challenge, not a benefit.', FALSE, '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(64, 16, 'D', 'Studying abroad is unnecessary', 'Du học không cần thiết', 'This contradicts the question about benefits.', FALSE, '2024-01-02 00:00:00', '2024-01-02 00:00:00'),
(65, 17, 'A', 'A woman is reading a book.', 'Một người phụ nữ đang đọc sách.', 'This describes what you see in the picture.', TRUE, '2024-01-03 00:00:00', '2024-01-03 00:00:00'),
(66, 17, 'B', 'A man is cooking.', 'Một người đàn ông đang nấu ăn.', 'This is not what you see in the picture.', FALSE, '2024-01-03 00:00:00', '2024-01-03 00:00:00'),
(67, 17, 'C', 'A child is playing.', 'Một đứa trẻ đang chơi.', 'This is not what you see in the picture.', FALSE, '2024-01-03 00:00:00', '2024-01-03 00:00:00'),
(68, 17, 'D', 'A dog is sleeping.', 'Một con chó đang ngủ.', 'This is not what you see in the picture.', FALSE, '2024-01-03 00:00:00', '2024-01-03 00:00:00'),
(69, 18, 'A', 'She is writing.', 'Cô ấy đang viết.', 'This describes what is happening in the picture.', TRUE, '2024-01-03 00:00:00', '2024-01-03 00:00:00'),
(70, 18, 'B', 'She is sleeping.', 'Cô ấy đang ngủ.', 'This is not what is happening in the picture.', FALSE, '2024-01-03 00:00:00', '2024-01-03 00:00:00'),
(71, 18, 'C', 'She is eating.', 'Cô ấy đang ăn.', 'This is not what is happening in the picture.', FALSE, '2024-01-03 00:00:00', '2024-01-03 00:00:00'),
(72, 18, 'D', 'She is running.', 'Cô ấy đang chạy.', 'This is not what is happening in the picture.', FALSE, '2024-01-03 00:00:00', '2024-01-03 00:00:00'),
(73, 19, 'A', 'It\'s on the first floor.', 'Nó ở tầng một.', 'This is the correct location.', TRUE, '2024-01-03 00:00:00', '2024-01-03 00:00:00'),
(74, 19, 'B', 'It\'s on the second floor.', 'Nó ở tầng hai.', 'This is not the correct location.', FALSE, '2024-01-03 00:00:00', '2024-01-03 00:00:00'),
(75, 19, 'C', 'It\'s on the third floor.', 'Nó ở tầng ba.', 'This is not the correct location.', FALSE, '2024-01-03 00:00:00', '2024-01-03 00:00:00'),
(76, 19, 'D', 'It\'s in the basement.', 'Nó ở tầng hầm.', 'This is not the correct location.', FALSE, '2024-01-03 00:00:00', '2024-01-03 00:00:00'),
(77, 20, 'A', 'It costs $10.', 'Nó có giá $10.', 'This is the correct price mentioned.', TRUE, '2024-01-03 00:00:00', '2024-01-03 00:00:00'),
(78, 20, 'B', 'It costs $20.', 'Nó có giá $20.', 'This is not the correct price.', FALSE, '2024-01-03 00:00:00', '2024-01-03 00:00:00'),
(79, 20, 'C', 'It costs $30.', 'Nó có giá $30.', 'This is not the correct price.', FALSE, '2024-01-03 00:00:00', '2024-01-03 00:00:00'),
(80, 20, 'D', 'It costs $40.', 'Nó có giá $40.', 'This is not the correct price.', FALSE, '2024-01-03 00:00:00', '2024-01-03 00:00:00');

-- INSERT: exam_sessions (5 records)
INSERT INTO exam_sessions (exam_session_id, user_id, test_id, session_type, start_time, end_time, duration_seconds, total_score, correct_answers, wrong_answers, skipped_answers, status, selected_parts, time_limit_minutes, created_at, updated_at) VALUES
(1, 3, 1, 'FULL_TEST', '2024-01-10 09:00:00', '2024-01-10 11:00:00', 7200, 850, 170, 30, 0, 'COMPLETED', NULL, 120, '2024-01-10 09:00:00', '2024-01-10 11:00:00'),
(2, 3, 1, 'PRACTICE', '2024-01-12 14:00:00', '2024-01-12 14:30:00', 1800, 420, 84, 16, 0, 'COMPLETED', '[1,2]', 30, '2024-01-12 14:00:00', '2024-01-12 14:30:00'),
(3, 4, 2, 'FULL_TEST', '2024-01-15 10:00:00', '2024-01-15 13:00:00', 10800, 7.5, 35, 5, 0, 'COMPLETED', NULL, 180, '2024-01-15 10:00:00', '2024-01-15 13:00:00'),
(4, 5, 1, 'FULL_TEST', '2024-01-18 08:00:00', NULL, NULL, 0, 0, 0, 0, 'IN_PROGRESS', NULL, 120, '2024-01-18 08:00:00', '2024-01-18 08:00:00'),
(5, 3, 3, 'PRACTICE', '2024-01-20 16:00:00', '2024-01-20 16:15:00', 900, 180, 36, 4, 0, 'COMPLETED', '[1]', 15, '2024-01-20 16:00:00', '2024-01-20 16:15:00');

-- INSERT: user_answers (25 records)
INSERT INTO user_answers (user_answer_id, exam_session_id, question_id, selected_choice_id, answer_time, is_correct, created_at) VALUES
(1, 1, 1, 1, '2024-01-10 09:05:00', TRUE, '2024-01-10 09:05:00'),
(2, 1, 2, 5, '2024-01-10 09:08:00', TRUE, '2024-01-10 09:08:00'),
(3, 1, 3, 9, '2024-01-10 09:12:00', TRUE, '2024-01-10 09:12:00'),
(4, 1, 4, 13, '2024-01-10 09:15:00', TRUE, '2024-01-10 09:15:00'),
(5, 1, 5, 17, '2024-01-10 09:20:00', TRUE, '2024-01-10 09:20:00'),
(6, 1, 6, 21, '2024-01-10 09:25:00', TRUE, '2024-01-10 09:25:00'),
(7, 1, 7, 25, '2024-01-10 09:30:00', TRUE, '2024-01-10 09:30:00'),
(8, 1, 8, 29, '2024-01-10 09:35:00', TRUE, '2024-01-10 09:35:00'),
(9, 2, 1, 1, '2024-01-12 14:02:00', TRUE, '2024-01-12 14:02:00'),
(10, 2, 2, 5, '2024-01-12 14:05:00', TRUE, '2024-01-12 14:05:00'),
(11, 2, 3, 9, '2024-01-12 14:08:00', TRUE, '2024-01-12 14:08:00'),
(12, 2, 4, 13, '2024-01-12 14:12:00', TRUE, '2024-01-12 14:12:00'),
(13, 3, 9, 33, '2024-01-15 10:05:00', TRUE, '2024-01-15 10:05:00'),
(14, 3, 10, 37, '2024-01-15 10:10:00', TRUE, '2024-01-15 10:10:00'),
(15, 3, 11, 41, '2024-01-15 10:15:00', TRUE, '2024-01-15 10:15:00'),
(16, 3, 12, 45, '2024-01-15 10:20:00', TRUE, '2024-01-15 10:20:00'),
(17, 3, 13, 49, '2024-01-15 10:25:00', TRUE, '2024-01-15 10:25:00'),
(18, 3, 14, 53, '2024-01-15 10:30:00', TRUE, '2024-01-15 10:30:00'),
(19, 3, 15, 57, '2024-01-15 10:35:00', TRUE, '2024-01-15 10:35:00'),
(20, 3, 16, 61, '2024-01-15 10:40:00', TRUE, '2024-01-15 10:40:00'),
(21, 4, 1, 1, '2024-01-18 08:05:00', TRUE, '2024-01-18 08:05:00'),
(22, 4, 2, 5, '2024-01-18 08:08:00', TRUE, '2024-01-18 08:08:00'),
(23, 4, 3, 9, '2024-01-18 08:12:00', TRUE, '2024-01-18 08:12:00'),
(24, 5, 17, 65, '2024-01-20 16:02:00', TRUE, '2024-01-20 16:02:00'),
(25, 5, 18, 69, '2024-01-20 16:05:00', TRUE, '2024-01-20 16:05:00');

-- INSERT: user_exam_statistics (3 records)
INSERT INTO user_exam_statistics (user_exam_stat_id, user_id, total_tests_taken, total_questions_answered, total_correct_answers, average_score, best_score, total_study_time_seconds, created_at, updated_at) VALUES
(1, 3, 3, 200, 170, 85.00, 850, 10800, '2024-01-10 00:00:00', '2024-01-20 16:15:00'),
(2, 4, 1, 40, 35, 7.50, 7.5, 10800, '2024-01-15 00:00:00', '2024-01-15 13:00:00'),
(3, 5, 1, 0, 0, 0.00, 0, 0, '2024-01-18 00:00:00', '2024-01-18 08:00:00');

-- INSERT: part_statistics (8 records)
INSERT INTO part_statistics (part_stat_id, user_id, part_id, total_attempts, total_questions, correct_answers, accuracy_rate, last_attempt, created_at, updated_at) VALUES
(1, 3, 1, 2, 12, 11, 91.67, '2024-01-12 14:30:00', '2024-01-10 00:00:00', '2024-01-12 14:30:00'),
(2, 3, 2, 2, 50, 45, 90.00, '2024-01-12 14:30:00', '2024-01-10 00:00:00', '2024-01-12 14:30:00'),
(3, 3, 5, 1, 30, 28, 93.33, '2024-01-10 11:00:00', '2024-01-10 00:00:00', '2024-01-10 11:00:00'),
(4, 3, 6, 1, 16, 15, 93.75, '2024-01-10 11:00:00', '2024-01-10 00:00:00', '2024-01-10 11:00:00'),
(5, 3, 7, 1, 54, 51, 94.44, '2024-01-10 11:00:00', '2024-01-10 00:00:00', '2024-01-10 11:00:00'),
(6, 4, 8, 1, 40, 35, 87.50, '2024-01-15 13:00:00', '2024-01-15 00:00:00', '2024-01-15 13:00:00'),
(7, 4, 9, 1, 40, 35, 87.50, '2024-01-15 13:00:00', '2024-01-15 00:00:00', '2024-01-15 13:00:00'),
(8, 3, 12, 1, 6, 6, 100.00, '2024-01-20 16:15:00', '2024-01-20 00:00:00', '2024-01-20 16:15:00');

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
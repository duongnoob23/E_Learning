-- =============================================
-- SEED DATA FOR e_learnning6 DATABASE (dbv5.txt)
-- =============================================

SET FOREIGN_KEY_CHECKS = 0;

-- =============================================
-- CORE AUTHENTICATION & AUTHORIZATION
-- =============================================

-- INSERT: users (10 records)
INSERT INTO users (user_id, username, password_hash, email, full_name, phone_number, avatar_url, status, email_verified, phone_verified, last_login, failed_login_attempts, locked_until, created_at, updated_at) VALUES
(1, 'admin', '$2y$10$examplehash...', 'admin@example.com', 'Nguyễn Văn Admin', '0123456789', 'https://example.com/avatars/admin.jpg', 'active', TRUE, TRUE, '2024-12-01 10:30:00', 0, NULL, '2024-01-01 00:00:00', '2024-12-01 10:30:00'),
(2, 'teacher1', '$2y$10$examplehash...', 'teacher1@example.com', 'Trần Thị Giáo', '0123456788', 'https://example.com/avatars/teacher1.jpg', 'active', TRUE, TRUE, '2024-12-01 09:15:00', 0, NULL, '2024-01-15 08:00:00', '2024-12-01 09:15:00'),
(3, 'student1', '$2y$10$examplehash...', 'student1@example.com', 'Lê Văn Học', '0123456787', 'https://example.com/avatars/student1.jpg', 'active', TRUE, FALSE, '2024-12-01 14:20:00', 0, NULL, '2024-02-01 10:00:00', '2024-12-01 14:20:00'),
(4, 'student2', '$2y$10$examplehash...', 'student2@example.com', 'Phạm Thị Sinh', '0123456786', 'https://example.com/avatars/student2.jpg', 'active', TRUE, TRUE, '2024-12-01 16:45:00', 0, NULL, '2024-02-15 14:30:00', '2024-12-01 16:45:00'),
(5, 'student3', '$2y$10$examplehash...', 'student3@example.com', 'Hoàng Văn Tài', '0123456785', 'https://example.com/avatars/student3.jpg', 'active', FALSE, TRUE, '2024-11-30 20:10:00', 0, NULL, '2024-03-01 16:00:00', '2024-11-30 20:10:00'),
(6, 'student4', '$2y$10$examplehash...', 'student4@example.com', 'Vũ Thị Lan', '0123456784', 'https://example.com/avatars/student4.jpg', 'active', TRUE, TRUE, '2024-12-01 11:30:00', 0, NULL, '2024-03-15 12:00:00', '2024-12-01 11:30:00'),
(7, 'student5', '$2y$10$examplehash...', 'student5@example.com', 'Đặng Văn Minh', '0123456783', 'https://example.com/avatars/student5.jpg', 'active', TRUE, FALSE, '2024-12-01 13:15:00', 0, NULL, '2024-04-01 09:30:00', '2024-12-01 13:15:00'),
(8, 'student6', '$2y$10$examplehash...', 'student6@example.com', 'Bùi Thị Hoa', '0123456782', 'https://example.com/avatars/student6.jpg', 'active', TRUE, TRUE, '2024-12-01 15:45:00', 0, NULL, '2024-04-15 11:00:00', '2024-12-01 15:45:00'),
(9, 'guest1', '$2y$10$examplehash...', 'guest1@example.com', 'Nguyễn Văn Khách', '0123456781', NULL, 'active', FALSE, FALSE, '2024-11-29 18:20:00', 0, NULL, '2024-05-01 15:00:00', '2024-11-29 18:20:00'),
(10, 'system', '$2y$10$examplehash...', 'system@example.com', 'System Account', NULL, NULL, 'active', TRUE, TRUE, '2024-12-01 00:00:00', 0, NULL, '2024-01-01 00:00:00', '2024-12-01 00:00:00');

-- INSERT: roles (4 records)
INSERT INTO roles (role_id, role_name, description, is_active, created_at) VALUES
(1, 'Admin', 'Quản trị viên hệ thống', TRUE, '2024-01-01 00:00:00'),
(2, 'Teacher', 'Giảng viên', TRUE, '2024-01-01 00:00:00'),
(3, 'Student', 'Học viên', TRUE, '2024-01-01 00:00:00'),
(4, 'Guest', 'Khách', TRUE, '2024-01-01 00:00:00');

-- INSERT: permissions (20+ records)
INSERT INTO permissions (permission_id, permission_name, description, resource, action, is_active, created_at) VALUES
(1, 'user.create', 'Tạo người dùng', 'user', 'create', TRUE, '2024-01-01 00:00:00'),
(2, 'user.read', 'Xem thông tin người dùng', 'user', 'read', TRUE, '2024-01-01 00:00:00'),
(3, 'user.update', 'Cập nhật người dùng', 'user', 'update', TRUE, '2024-01-01 00:00:00'),
(4, 'user.delete', 'Xóa người dùng', 'user', 'delete', TRUE, '2024-01-01 00:00:00'),
(5, 'role.create', 'Tạo vai trò', 'role', 'create', TRUE, '2024-01-01 00:00:00'),
(6, 'role.read', 'Xem vai trò', 'role', 'read', TRUE, '2024-01-01 00:00:00'),
(7, 'role.update', 'Cập nhật vai trò', 'role', 'update', TRUE, '2024-01-01 00:00:00'),
(8, 'role.delete', 'Xóa vai trò', 'role', 'delete', TRUE, '2024-01-01 00:00:00'),
(9, 'course.create', 'Tạo khóa học', 'course', 'create', TRUE, '2024-01-01 00:00:00'),
(10, 'course.read', 'Xem khóa học', 'course', 'read', TRUE, '2024-01-01 00:00:00'),
(11, 'course.update', 'Cập nhật khóa học', 'course', 'update', TRUE, '2024-01-01 00:00:00'),
(12, 'course.delete', 'Xóa khóa học', 'course', 'delete', TRUE, '2024-01-01 00:00:00'),
(13, 'test.create', 'Tạo đề thi', 'test', 'create', TRUE, '2024-01-01 00:00:00'),
(14, 'test.read', 'Xem đề thi', 'test', 'read', TRUE, '2024-01-01 00:00:00'),
(15, 'test.update', 'Cập nhật đề thi', 'test', 'update', TRUE, '2024-01-01 00:00:00'),
(16, 'test.delete', 'Xóa đề thi', 'test', 'delete', TRUE, '2024-01-01 00:00:00'),
(17, 'test.take', 'Làm bài thi', 'test', 'take', TRUE, '2024-01-01 00:00:00'),
(18, 'word.create', 'Tạo từ vựng', 'word', 'create', TRUE, '2024-01-01 00:00:00'),
(19, 'word.read', 'Xem từ vựng', 'word', 'read', TRUE, '2024-01-01 00:00:00'),
(20, 'word.update', 'Cập nhật từ vựng', 'word', 'update', TRUE, '2024-01-01 00:00:00'),
(21, 'word.delete', 'Xóa từ vựng', 'word', 'delete', TRUE, '2024-01-01 00:00:00'),
(22, 'topic.create', 'Tạo chủ đề', 'topic', 'create', TRUE, '2024-01-01 00:00:00'),
(23, 'topic.read', 'Xem chủ đề', 'topic', 'read', TRUE, '2024-01-01 00:00:00'),
(24, 'topic.update', 'Cập nhật chủ đề', 'topic', 'update', TRUE, '2024-01-01 00:00:00'),
(25, 'topic.delete', 'Xóa chủ đề', 'topic', 'delete', TRUE, '2024-01-01 00:00:00');

-- INSERT: user_roles (mapping users to roles)
INSERT INTO user_roles (user_id, role_id, assigned_at, assigned_by, is_active) VALUES
(1, 1, '2024-01-01 00:00:00', 1, TRUE),  -- admin -> Admin
(2, 2, '2024-01-15 08:00:00', 1, TRUE),  -- teacher1 -> Teacher
(3, 3, '2024-02-01 10:00:00', 1, TRUE),  -- student1 -> Student
(4, 3, '2024-02-15 14:30:00', 1, TRUE),  -- student2 -> Student
(5, 3, '2024-03-01 16:00:00', 1, TRUE),  -- student3 -> Student
(6, 3, '2024-03-15 12:00:00', 1, TRUE),  -- student4 -> Student
(7, 3, '2024-04-01 09:30:00', 1, TRUE),  -- student5 -> Student
(8, 3, '2024-04-15 11:00:00', 1, TRUE),  -- student6 -> Student
(9, 4, '2024-05-01 15:00:00', 1, TRUE),  -- guest1 -> Guest
(10, 1, '2024-01-01 00:00:00', 1, TRUE); -- system -> Admin

-- INSERT: role_permissions (mapping roles to permissions)
INSERT INTO role_permissions (role_id, permission_id, granted_at, granted_by) VALUES
-- Admin gets all permissions
(1, 1, '2024-01-01 00:00:00', 1), (1, 2, '2024-01-01 00:00:00', 1), (1, 3, '2024-01-01 00:00:00', 1), (1, 4, '2024-01-01 00:00:00', 1),
(1, 5, '2024-01-01 00:00:00', 1), (1, 6, '2024-01-01 00:00:00', 1), (1, 7, '2024-01-01 00:00:00', 1), (1, 8, '2024-01-01 00:00:00', 1),
(1, 9, '2024-01-01 00:00:00', 1), (1, 10, '2024-01-01 00:00:00', 1), (1, 11, '2024-01-01 00:00:00', 1), (1, 12, '2024-01-01 00:00:00', 1),
(1, 13, '2024-01-01 00:00:00', 1), (1, 14, '2024-01-01 00:00:00', 1), (1, 15, '2024-01-01 00:00:00', 1), (1, 16, '2024-01-01 00:00:00', 1),
(1, 17, '2024-01-01 00:00:00', 1), (1, 18, '2024-01-01 00:00:00', 1), (1, 19, '2024-01-01 00:00:00', 1), (1, 20, '2024-01-01 00:00:00', 1),
(1, 21, '2024-01-01 00:00:00', 1), (1, 22, '2024-01-01 00:00:00', 1), (1, 23, '2024-01-01 00:00:00', 1), (1, 24, '2024-01-01 00:00:00', 1), (1, 25, '2024-01-01 00:00:00', 1),
-- Teacher gets course and test permissions
(2, 9, '2024-01-01 00:00:00', 1), (2, 10, '2024-01-01 00:00:00', 1), (2, 11, '2024-01-01 00:00:00', 1),
(2, 13, '2024-01-01 00:00:00', 1), (2, 14, '2024-01-01 00:00:00', 1), (2, 15, '2024-01-01 00:00:00', 1),
(2, 18, '2024-01-01 00:00:00', 1), (2, 19, '2024-01-01 00:00:00', 1), (2, 20, '2024-01-01 00:00:00', 1),
(2, 22, '2024-01-01 00:00:00', 1), (2, 23, '2024-01-01 00:00:00', 1), (2, 24, '2024-01-01 00:00:00', 1),
-- Student gets read and take permissions
(3, 2, '2024-01-01 00:00:00', 1), (3, 10, '2024-01-01 00:00:00', 1), (3, 14, '2024-01-01 00:00:00', 1), (3, 17, '2024-01-01 00:00:00', 1),
(3, 19, '2024-01-01 00:00:00', 1), (3, 23, '2024-01-01 00:00:00', 1),
-- Guest gets only read permissions
(4, 2, '2024-01-01 00:00:00', 1), (4, 10, '2024-01-01 00:00:00', 1), (4, 14, '2024-01-01 00:00:00', 1), (4, 19, '2024-01-01 00:00:00', 1), (4, 23, '2024-01-01 00:00:00', 1);

-- =============================================
-- SECURITY & AUTHENTICATION TABLES
-- =============================================

-- INSERT: otp_codes (5+ records)
INSERT INTO otp_codes (otp_id, user_id, email, phone_number, otp_code, otp_type, is_used, attempts, expires_at, created_at) VALUES
(1, 3, 'student1@example.com', NULL, '123456', 'email_verification', FALSE, 0, '2024-12-02 10:00:00', '2024-12-01 10:00:00'),
(2, 5, NULL, '0123456785', '789012', 'phone_verification', TRUE, 1, '2024-12-01 20:30:00', '2024-11-30 20:00:00'),
(3, 2, 'teacher1@example.com', NULL, '345678', 'password_reset', FALSE, 0, '2024-12-02 09:15:00', '2024-12-01 09:15:00'),
(4, 4, 'student2@example.com', NULL, '901234', 'email_verification', TRUE, 2, '2024-12-01 16:45:00', '2024-12-01 16:00:00'),
(5, 6, NULL, '0123456784', '567890', 'login_2fa', FALSE, 0, '2024-12-02 11:30:00', '2024-12-01 11:30:00');

-- INSERT: refresh_tokens (8+ records)
INSERT INTO refresh_tokens (token_id, user_id, token_hash, device_info, ip_address, user_agent, is_revoked, expires_at, created_at) VALUES
(1, 1, 'refresh_token_hash_1', '{"device": "Chrome", "os": "Windows"}', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', FALSE, '2024-12-15 10:30:00', '2024-12-01 10:30:00'),
(2, 2, 'refresh_token_hash_2', '{"device": "Firefox", "os": "macOS"}', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:91.0) Gecko/20100101 Firefox/91.0', FALSE, '2024-12-15 09:15:00', '2024-12-01 09:15:00'),
(3, 3, 'refresh_token_hash_3', '{"device": "Safari", "os": "iOS"}', '192.168.1.102', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15', FALSE, '2024-12-15 14:20:00', '2024-12-01 14:20:00'),
(4, 4, 'refresh_token_hash_4', '{"device": "Chrome", "os": "Android"}', '192.168.1.103', 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36', FALSE, '2024-12-15 16:45:00', '2024-12-01 16:45:00'),
(5, 5, 'refresh_token_hash_5', '{"device": "Edge", "os": "Windows"}', '192.168.1.104', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Edg/91.0.864.59', TRUE, '2024-11-30 20:10:00', '2024-11-30 20:10:00'),
(6, 6, 'refresh_token_hash_6', '{"device": "Chrome", "os": "Windows"}', '192.168.1.105', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', FALSE, '2024-12-15 11:30:00', '2024-12-01 11:30:00'),
(7, 7, 'refresh_token_hash_7', '{"device": "Firefox", "os": "Linux"}', '192.168.1.106', 'Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0', FALSE, '2024-12-15 13:15:00', '2024-12-01 13:15:00'),
(8, 8, 'refresh_token_hash_8', '{"device": "Safari", "os": "macOS"}', '192.168.1.107', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15', FALSE, '2024-12-15 15:45:00', '2024-12-01 15:45:00');

-- INSERT: email_verifications (5+ records)
INSERT INTO email_verifications (verification_id, user_id, email, verification_token, is_verified, verified_at, expires_at, created_at) VALUES
(1, 3, 'student1@example.com', 'verify_token_1', FALSE, NULL, '2024-12-02 10:00:00', '2024-12-01 10:00:00'),
(2, 4, 'student2@example.com', 'verify_token_2', TRUE, '2024-12-01 16:45:00', '2024-12-01 16:45:00', '2024-12-01 16:00:00'),
(3, 5, 'student3@example.com', 'verify_token_3', FALSE, NULL, '2024-12-02 20:10:00', '2024-11-30 20:10:00'),
(4, 6, 'student4@example.com', 'verify_token_4', TRUE, '2024-12-01 11:30:00', '2024-12-01 11:30:00', '2024-12-01 11:00:00'),
(5, 7, 'student5@example.com', 'verify_token_5', TRUE, '2024-12-01 13:15:00', '2024-12-01 13:15:00', '2024-12-01 13:00:00');

-- INSERT: login_history (15+ records)
INSERT INTO login_history (login_id, user_id, login_time, ip_address, user_agent, login_status, failure_reason, session_duration) VALUES
(1, 1, '2024-12-01 10:30:00', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'success', NULL, 3600),
(2, 2, '2024-12-01 09:15:00', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:91.0) Gecko/20100101 Firefox/91.0', 'success', NULL, 7200),
(3, 3, '2024-12-01 14:20:00', '192.168.1.102', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15', 'success', NULL, 1800),
(4, 4, '2024-12-01 16:45:00', '192.168.1.103', 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36', 'success', NULL, 2400),
(5, 5, '2024-11-30 20:10:00', '192.168.1.104', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Edg/91.0.864.59', 'success', NULL, 1500),
(6, 6, '2024-12-01 11:30:00', '192.168.1.105', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'success', NULL, 2100),
(7, 7, '2024-12-01 13:15:00', '192.168.1.106', 'Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0', 'success', NULL, 3000),
(8, 8, '2024-12-01 15:45:00', '192.168.1.107', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15', 'success', NULL, 2700),
(9, 9, '2024-11-29 18:20:00', '192.168.1.108', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'success', NULL, 900),
(10, 1, '2024-11-30 08:00:00', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'success', NULL, 4200),
(11, 2, '2024-11-30 14:30:00', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:91.0) Gecko/20100101 Firefox/91.0', 'success', NULL, 1800),
(12, 3, '2024-11-30 16:45:00', '192.168.1.102', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15', 'failed', 'Wrong password', NULL),
(13, 4, '2024-11-30 19:20:00', '192.168.1.103', 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36', 'success', NULL, 2100),
(14, 5, '2024-11-29 21:15:00', '192.168.1.104', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Edg/91.0.864.59', 'success', NULL, 1200),
(15, 6, '2024-11-29 22:30:00', '192.168.1.105', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'success', NULL, 1800);

-- INSERT: password_reset_tokens (3+ records)
INSERT INTO password_reset_tokens (reset_id, user_id, reset_token, is_used, expires_at, created_at) VALUES
(1, 2, 'reset_token_1', FALSE, '2024-12-02 09:15:00', '2024-12-01 09:15:00'),
(2, 5, 'reset_token_2', TRUE, '2024-12-01 20:30:00', '2024-11-30 20:00:00'),
(3, 7, 'reset_token_3', FALSE, '2024-12-02 13:15:00', '2024-12-01 13:15:00');

-- =============================================
-- VOCABULARY MODULE
-- =============================================

-- INSERT: topics (5 records)
INSERT INTO topics (topic_id, topic_name, description, image_url, logo_url, topic_type, created_by, is_public, is_active, word_count, created_at, updated_at) VALUES
(1, 'Business', 'Từ vựng về kinh doanh và thương mại', 'https://example.com/images/business.jpg', 'https://example.com/logos/business.png', 'system', 1, TRUE, TRUE, 6, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(2, 'Travel', 'Từ vựng về du lịch và giao thông', 'https://example.com/images/travel.jpg', 'https://example.com/logos/travel.png', 'system', 1, TRUE, TRUE, 6, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(3, 'Food', 'Từ vựng về ẩm thực và đồ ăn', 'https://example.com/images/food.jpg', 'https://example.com/logos/food.png', 'system', 1, TRUE, TRUE, 6, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(4, 'Technology', 'Từ vựng về công nghệ và máy tính', 'https://example.com/images/technology.jpg', 'https://example.com/logos/technology.png', 'system', 1, TRUE, TRUE, 6, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(5, 'Health', 'Từ vựng về sức khỏe và y tế', 'https://example.com/images/health.jpg', 'https://example.com/logos/health.png', 'system', 1, TRUE, TRUE, 6, '2024-01-01 00:00:00', '2024-12-01 00:00:00');

-- INSERT: words (30 records distributed across topics)
INSERT INTO words (word_id, topic_id, word, part_of_speech, pronunciation, meaning_vi, example_en, example_vi, image_url, notes, word_type, created_by, is_active, created_at, updated_at) VALUES
-- Business words (6)
(1, 1, 'profit', 'noun', '/ˈprɒfɪt/', 'Lợi nhuận', 'The company made a huge profit this year.', 'Công ty đã thu được lợi nhuận lớn trong năm nay.', 'https://example.com/images/profit.jpg', 'Common in business contexts', 'system', 1, TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(2, 1, 'investment', 'noun', '/ɪnˈvestmənt/', 'Đầu tư', 'Foreign investment is increasing in Vietnam.', 'Đầu tư nước ngoài đang tăng ở Việt Nam.', 'https://example.com/images/investment.jpg', 'Important for finance', 'system', 1, TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(3, 1, 'negotiate', 'verb', '/nɪˈɡəʊʃieɪt/', 'Thương lượng', 'We need to negotiate the contract terms.', 'Chúng ta cần thương lượng các điều khoản hợp đồng.', 'https://example.com/images/negotiate.jpg', 'Essential business skill', 'system', 1, TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(4, 1, 'revenue', 'noun', '/ˈrevənjuː/', 'Doanh thu', 'The company\'s revenue increased by 20%.', 'Doanh thu của công ty tăng 20%.', 'https://example.com/images/revenue.jpg', 'Financial term', 'system', 1, TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(5, 1, 'marketing', 'noun', '/ˈmɑːkɪtɪŋ/', 'Tiếp thị', 'Digital marketing is very effective.', 'Tiếp thị số rất hiệu quả.', 'https://example.com/images/marketing.jpg', 'Modern business strategy', 'system', 1, TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(6, 1, 'customer', 'noun', '/ˈkʌstəmə/', 'Khách hàng', 'Customer satisfaction is our priority.', 'Sự hài lòng của khách hàng là ưu tiên của chúng tôi.', 'https://example.com/images/customer.jpg', 'Core business concept', 'system', 1, TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),

-- Travel words (6)
(7, 2, 'journey', 'noun', '/ˈdʒɜːni/', 'Hành trình', 'The journey to the mountains was beautiful.', 'Hành trình lên núi rất đẹp.', 'https://example.com/images/journey.jpg', 'Common travel word', 'system', 1, TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(8, 2, 'destination', 'noun', '/ˌdestɪˈneɪʃn/', 'Điểm đến', 'Paris is a popular tourist destination.', 'Paris là điểm đến du lịch nổi tiếng.', 'https://example.com/images/destination.jpg', 'Travel planning term', 'system', 1, TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(9, 2, 'passport', 'noun', '/ˈpɑːspɔːt/', 'Hộ chiếu', 'Don\'t forget your passport when traveling.', 'Đừng quên hộ chiếu khi đi du lịch.', 'https://example.com/images/passport.jpg', 'Essential travel document', 'system', 1, TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(10, 2, 'luggage', 'noun', '/ˈlʌɡɪdʒ/', 'Hành lý', 'The airline lost my luggage.', 'Hãng hàng không làm mất hành lý của tôi.', 'https://example.com/images/luggage.jpg', 'Travel equipment', 'system', 1, TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(11, 2, 'accommodation', 'noun', '/əˌkɒməˈdeɪʃn/', 'Chỗ ở', 'We need to book accommodation for the trip.', 'Chúng ta cần đặt chỗ ở cho chuyến đi.', 'https://example.com/images/accommodation.jpg', 'Travel planning', 'system', 1, TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(12, 2, 'itinerary', 'noun', '/aɪˈtɪnərəri/', 'Lịch trình', 'Please send me the travel itinerary.', 'Vui lòng gửi cho tôi lịch trình du lịch.', 'https://example.com/images/itinerary.jpg', 'Travel planning term', 'system', 1, TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),

-- Food words (6)
(13, 3, 'delicious', 'adjective', '/dɪˈlɪʃəs/', 'Ngon', 'This pizza is delicious!', 'Pizza này ngon quá!', 'https://example.com/images/delicious.jpg', 'Common food adjective', 'system', 1, TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(14, 3, 'recipe', 'noun', '/ˈresəpi/', 'Công thức', 'Can you share the recipe for this dish?', 'Bạn có thể chia sẻ công thức món này không?', 'https://example.com/images/recipe.jpg', 'Cooking term', 'system', 1, TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(15, 3, 'ingredient', 'noun', '/ɪnˈɡriːdiənt/', 'Nguyên liệu', 'Fresh ingredients make better food.', 'Nguyên liệu tươi làm món ăn ngon hơn.', 'https://example.com/images/ingredient.jpg', 'Cooking vocabulary', 'system', 1, TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(16, 3, 'appetite', 'noun', '/ˈæpɪtaɪt/', 'Sự thèm ăn', 'I have a good appetite today.', 'Hôm nay tôi ăn rất ngon miệng.', 'https://example.com/images/appetite.jpg', 'Food-related feeling', 'system', 1, TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(17, 3, 'nutrition', 'noun', '/njuˈtrɪʃn/', 'Dinh dưỡng', 'Good nutrition is important for health.', 'Dinh dưỡng tốt quan trọng cho sức khỏe.', 'https://example.com/images/nutrition.jpg', 'Health and food', 'system', 1, TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(18, 3, 'restaurant', 'noun', '/ˈrestərɒnt/', 'Nhà hàng', 'We had dinner at a fancy restaurant.', 'Chúng tôi ăn tối ở một nhà hàng sang trọng.', 'https://example.com/images/restaurant.jpg', 'Dining place', 'system', 1, TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),

-- Technology words (6)
(19, 4, 'software', 'noun', '/ˈsɒftweə/', 'Phần mềm', 'This software is very user-friendly.', 'Phần mềm này rất dễ sử dụng.', 'https://example.com/images/software.jpg', 'Computer term', 'system', 1, TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(20, 4, 'database', 'noun', '/ˈdeɪtəbeɪs/', 'Cơ sở dữ liệu', 'The database stores all customer information.', 'Cơ sở dữ liệu lưu trữ tất cả thông tin khách hàng.', 'https://example.com/images/database.jpg', 'IT vocabulary', 'system', 1, TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(21, 4, 'algorithm', 'noun', '/ˈælɡərɪðəm/', 'Thuật toán', 'This algorithm is very efficient.', 'Thuật toán này rất hiệu quả.', 'https://example.com/images/algorithm.jpg', 'Programming term', 'system', 1, TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(22, 4, 'innovation', 'noun', '/ˌɪnəˈveɪʃn/', 'Đổi mới', 'Innovation drives technological progress.', 'Đổi mới thúc đẩy tiến bộ công nghệ.', 'https://example.com/images/innovation.jpg', 'Tech development', 'system', 1, TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(23, 4, 'cybersecurity', 'noun', '/ˈsaɪbərsɪˌkjʊrəti/', 'An ninh mạng', 'Cybersecurity is crucial for businesses.', 'An ninh mạng rất quan trọng cho doanh nghiệp.', 'https://example.com/images/cybersecurity.jpg', 'Security term', 'system', 1, TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(24, 4, 'artificial intelligence', 'noun', '/ˌɑːtɪˈfɪʃl ɪnˈtelɪdʒəns/', 'Trí tuệ nhân tạo', 'Artificial intelligence is changing the world.', 'Trí tuệ nhân tạo đang thay đổi thế giới.', 'https://example.com/images/ai.jpg', 'Modern tech term', 'system', 1, TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),

-- Health words (6)
(25, 5, 'medicine', 'noun', '/ˈmedsn/', 'Thuốc', 'Take this medicine twice a day.', 'Uống thuốc này hai lần một ngày.', 'https://example.com/images/medicine.jpg', 'Medical term', 'system', 1, TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(26, 5, 'exercise', 'noun', '/ˈeksəsaɪz/', 'Tập thể dục', 'Regular exercise keeps you healthy.', 'Tập thể dục thường xuyên giúp bạn khỏe mạnh.', 'https://example.com/images/exercise.jpg', 'Health activity', 'system', 1, TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(27, 5, 'symptom', 'noun', '/ˈsɪmptəm/', 'Triệu chứng', 'What are the symptoms of this disease?', 'Triệu chứng của bệnh này là gì?', 'https://example.com/images/symptom.jpg', 'Medical vocabulary', 'system', 1, TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(28, 5, 'treatment', 'noun', '/ˈtriːtmənt/', 'Điều trị', 'The treatment was successful.', 'Việc điều trị đã thành công.', 'https://example.com/images/treatment.jpg', 'Medical care', 'system', 1, TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(29, 5, 'prevention', 'noun', '/prɪˈvenʃn/', 'Phòng ngừa', 'Prevention is better than cure.', 'Phòng ngừa tốt hơn chữa bệnh.', 'https://example.com/images/prevention.jpg', 'Health strategy', 'system', 1, TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(30, 5, 'wellness', 'noun', '/ˈwelnəs/', 'Sức khỏe tổng thể', 'Wellness programs improve employee health.', 'Chương trình sức khỏe cải thiện sức khỏe nhân viên.', 'https://example.com/images/wellness.jpg', 'Health concept', 'system', 1, TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00');

-- INSERT: user_words (10 records)
INSERT INTO user_words (user_word_id, user_id, topic_id, word, part_of_speech, pronunciation, meaning_vi, example_en, example_vi, image_url, notes, from_system_word_id, is_active, created_at, updated_at) VALUES
(1, 3, 1, 'entrepreneur', 'noun', '/ˌɒntrəprəˈnɜː/', 'Doanh nhân', 'He is a successful entrepreneur.', 'Anh ấy là một doanh nhân thành công.', 'https://example.com/images/entrepreneur.jpg', 'Personal business vocabulary', NULL, TRUE, '2024-02-01 10:00:00', '2024-12-01 00:00:00'),
(2, 3, 2, 'backpacking', 'noun', '/ˈbækpækɪŋ/', 'Du lịch bụi', 'Backpacking is a great way to travel.', 'Du lịch bụi là cách tuyệt vời để đi du lịch.', 'https://example.com/images/backpacking.jpg', 'Personal travel term', NULL, TRUE, '2024-02-01 10:00:00', '2024-12-01 00:00:00'),
(3, 4, 3, 'gourmet', 'noun', '/ˈɡʊəmeɪ/', 'Sành ăn', 'He is a gourmet who loves fine dining.', 'Anh ấy là người sành ăn thích thưởng thức món ngon.', 'https://example.com/images/gourmet.jpg', 'Food enthusiast term', NULL, TRUE, '2024-02-15 14:30:00', '2024-12-01 00:00:00'),
(4, 4, 4, 'blockchain', 'noun', '/ˈblɒktʃeɪn/', 'Chuỗi khối', 'Blockchain technology is revolutionary.', 'Công nghệ blockchain mang tính cách mạng.', 'https://example.com/images/blockchain.jpg', 'Modern tech term', NULL, TRUE, '2024-02-15 14:30:00', '2024-12-01 00:00:00'),
(5, 5, 5, 'meditation', 'noun', '/ˌmedɪˈteɪʃn/', 'Thiền định', 'Meditation helps reduce stress.', 'Thiền định giúp giảm căng thẳng.', 'https://example.com/images/meditation.jpg', 'Mental health practice', NULL, TRUE, '2024-03-01 16:00:00', '2024-12-01 00:00:00'),
(6, 6, 1, 'startup', 'noun', '/ˈstɑːtʌp/', 'Khởi nghiệp', 'The startup received funding from investors.', 'Công ty khởi nghiệp nhận được tài trợ từ các nhà đầu tư.', 'https://example.com/images/startup.jpg', 'Business term', NULL, TRUE, '2024-03-15 12:00:00', '2024-12-01 00:00:00'),
(7, 6, 2, 'souvenir', 'noun', '/ˌsuːvəˈnɪə/', 'Quà lưu niệm', 'I bought souvenirs for my family.', 'Tôi mua quà lưu niệm cho gia đình.', 'https://example.com/images/souvenir.jpg', 'Travel shopping', NULL, TRUE, '2024-03-15 12:00:00', '2024-12-01 00:00:00'),
(8, 7, 3, 'cuisine', 'noun', '/kwɪˈziːn/', 'Ẩm thực', 'Vietnamese cuisine is very diverse.', 'Ẩm thực Việt Nam rất đa dạng.', 'https://example.com/images/cuisine.jpg', 'Food culture term', NULL, TRUE, '2024-04-01 09:30:00', '2024-12-01 00:00:00'),
(9, 7, 4, 'machine learning', 'noun', '/məˈʃiːn ˈlɜːnɪŋ/', 'Học máy', 'Machine learning is a subset of AI.', 'Học máy là một phần của trí tuệ nhân tạo.', 'https://example.com/images/ml.jpg', 'AI technology', NULL, TRUE, '2024-04-01 09:30:00', '2024-12-01 00:00:00'),
(10, 8, 5, 'immunity', 'noun', '/ɪˈmjuːnəti/', 'Miễn dịch', 'Good nutrition boosts immunity.', 'Dinh dưỡng tốt tăng cường miễn dịch.', 'https://example.com/images/immunity.jpg', 'Health concept', NULL, TRUE, '2024-04-15 11:00:00', '2024-12-01 00:00:00');

-- INSERT: user_word_status (20+ records)
INSERT INTO user_word_status (status_id, user_id, topic_id, word_id, user_word_id, is_learned, marked_at, created_at, updated_at) VALUES
-- System words learned by users
(1, 3, 1, 1, NULL, TRUE, '2024-02-01 10:00:00', '2024-02-01 10:00:00', '2024-02-01 10:00:00'),
(2, 3, 1, 2, NULL, TRUE, '2024-02-01 10:00:00', '2024-02-01 10:00:00', '2024-02-01 10:00:00'),
(3, 3, 2, 7, NULL, TRUE, '2024-02-01 10:00:00', '2024-02-01 10:00:00', '2024-02-01 10:00:00'),
(4, 3, 2, 8, NULL, FALSE, NULL, '2024-02-01 10:00:00', '2024-02-01 10:00:00'),
(5, 4, 1, 3, NULL, TRUE, '2024-02-15 14:30:00', '2024-02-15 14:30:00', '2024-02-15 14:30:00'),
(6, 4, 1, 4, NULL, TRUE, '2024-02-15 14:30:00', '2024-02-15 14:30:00', '2024-02-15 14:30:00'),
(7, 4, 3, 13, NULL, TRUE, '2024-02-15 14:30:00', '2024-02-15 14:30:00', '2024-02-15 14:30:00'),
(8, 4, 3, 14, NULL, FALSE, NULL, '2024-02-15 14:30:00', '2024-02-15 14:30:00'),
(9, 5, 4, 19, NULL, TRUE, '2024-03-01 16:00:00', '2024-03-01 16:00:00', '2024-03-01 16:00:00'),
(10, 5, 4, 20, NULL, TRUE, '2024-03-01 16:00:00', '2024-03-01 16:00:00', '2024-03-01 16:00:00'),
(11, 5, 5, 25, NULL, TRUE, '2024-03-01 16:00:00', '2024-03-01 16:00:00', '2024-03-01 16:00:00'),
(12, 5, 5, 26, NULL, FALSE, NULL, '2024-03-01 16:00:00', '2024-03-01 16:00:00'),
(13, 6, 1, 5, NULL, TRUE, '2024-03-15 12:00:00', '2024-03-15 12:00:00', '2024-03-15 12:00:00'),
(14, 6, 1, 6, NULL, TRUE, '2024-03-15 12:00:00', '2024-03-15 12:00:00', '2024-03-15 12:00:00'),
(15, 6, 2, 9, NULL, TRUE, '2024-03-15 12:00:00', '2024-03-15 12:00:00', '2024-03-15 12:00:00'),
(16, 6, 2, 10, NULL, FALSE, NULL, '2024-03-15 12:00:00', '2024-03-15 12:00:00'),
(17, 7, 3, 15, NULL, TRUE, '2024-04-01 09:30:00', '2024-04-01 09:30:00', '2024-04-01 09:30:00'),
(18, 7, 3, 16, NULL, TRUE, '2024-04-01 09:30:00', '2024-04-01 09:30:00', '2024-04-01 09:30:00'),
(19, 7, 4, 21, NULL, TRUE, '2024-04-01 09:30:00', '2024-04-01 09:30:00', '2024-04-01 09:30:00'),
(20, 7, 4, 22, NULL, FALSE, NULL, '2024-04-01 09:30:00', '2024-04-01 09:30:00'),
(21, 8, 5, 27, NULL, TRUE, '2024-04-15 11:00:00', '2024-04-15 11:00:00', '2024-04-15 11:00:00'),
(22, 8, 5, 28, NULL, TRUE, '2024-04-15 11:00:00', '2024-04-15 11:00:00', '2024-04-15 11:00:00'),
-- User words learned by users
(23, 3, 1, NULL, 1, TRUE, '2024-02-01 10:00:00', '2024-02-01 10:00:00', '2024-02-01 10:00:00'),
(24, 3, 2, NULL, 2, TRUE, '2024-02-01 10:00:00', '2024-02-01 10:00:00', '2024-02-01 10:00:00'),
(25, 4, 3, NULL, 3, TRUE, '2024-02-15 14:30:00', '2024-02-15 14:30:00', '2024-02-15 14:30:00'),
(26, 4, 4, NULL, 4, FALSE, NULL, '2024-02-15 14:30:00', '2024-02-15 14:30:00'),
(27, 5, 5, NULL, 5, TRUE, '2024-03-01 16:00:00', '2024-03-01 16:00:00', '2024-03-01 16:00:00'),
(28, 6, 1, NULL, 6, TRUE, '2024-03-15 12:00:00', '2024-03-15 12:00:00', '2024-03-15 12:00:00'),
(29, 6, 2, NULL, 7, TRUE, '2024-03-15 12:00:00', '2024-03-15 12:00:00', '2024-03-15 12:00:00'),
(30, 7, 3, NULL, 8, TRUE, '2024-04-01 09:30:00', '2024-04-01 09:30:00', '2024-04-01 09:30:00'),
(31, 7, 4, NULL, 9, FALSE, NULL, '2024-04-01 09:30:00', '2024-04-01 09:30:00'),
(32, 8, 5, NULL, 10, TRUE, '2024-04-15 11:00:00', '2024-04-15 11:00:00', '2024-04-15 11:00:00');

-- INSERT: favorite_topics (8 records)
INSERT INTO favorite_topics (favorite_id, user_id, topic_id, added_at) VALUES
(1, 3, 1, '2024-02-01 10:00:00'),
(2, 3, 2, '2024-02-01 10:00:00'),
(3, 4, 3, '2024-02-15 14:30:00'),
(4, 4, 4, '2024-02-15 14:30:00'),
(5, 5, 5, '2024-03-01 16:00:00'),
(6, 6, 1, '2024-03-15 12:00:00'),
(7, 7, 3, '2024-04-01 09:30:00'),
(8, 8, 5, '2024-04-15 11:00:00');

-- INSERT: batch_imports (3 records)
INSERT INTO batch_imports (import_id, user_id, topic_id, import_name, total_words, success_count, error_count, import_status, error_log, started_at, completed_at) VALUES
(1, 3, 1, 'business_vocabulary.xlsx', 50, 45, 5, 'completed', '5 words had invalid format', '2024-02-01 10:00:00', '2024-02-01 10:05:00'),
(2, 4, 3, 'food_terms.csv', 30, 30, 0, 'completed', NULL, '2024-02-15 14:30:00', '2024-02-15 14:32:00'),
(3, 5, 4, 'tech_words.txt', 25, 20, 5, 'completed', '5 words missing pronunciation', '2024-03-01 16:00:00', '2024-03-01 16:03:00');

-- INSERT: import_details (10+ records)
INSERT INTO import_details (detail_id, import_id, row_num, word, meaning_vi, part_of_speech, pronunciation, example_en, example_vi, notes, import_status, error_message, created_word_id) VALUES
(1, 1, 1, 'entrepreneur', 'Doanh nhân', 'noun', '/ˌɒntrəprəˈnɜː/', 'He is a successful entrepreneur.', 'Anh ấy là một doanh nhân thành công.', 'Business term', 'success', NULL, 1),
(2, 1, 2, 'startup', 'Khởi nghiệp', 'noun', '/ˈstɑːtʌp/', 'The startup received funding.', 'Công ty khởi nghiệp nhận được tài trợ.', 'Modern business', 'success', NULL, 6),
(3, 1, 3, 'invalid_word', 'Từ không hợp lệ', 'noun', NULL, NULL, NULL, 'Missing pronunciation', 'error', 'Invalid format', NULL),
(4, 2, 1, 'gourmet', 'Sành ăn', 'noun', '/ˈɡʊəmeɪ/', 'He is a gourmet.', 'Anh ấy là người sành ăn.', 'Food enthusiast', 'success', NULL, 3),
(5, 2, 2, 'cuisine', 'Ẩm thực', 'noun', '/kwɪˈziːn/', 'Vietnamese cuisine is diverse.', 'Ẩm thực Việt Nam đa dạng.', 'Food culture', 'success', NULL, 8),
(6, 3, 1, 'blockchain', 'Chuỗi khối', 'noun', '/ˈblɒktʃeɪn/', 'Blockchain is revolutionary.', 'Blockchain mang tính cách mạng.', 'Modern tech', 'success', NULL, 4),
(7, 3, 2, 'machine learning', 'Học máy', 'noun', '/məˈʃiːn ˈlɜːnɪŋ/', 'Machine learning is AI subset.', 'Học máy là phần của AI.', 'AI technology', 'success', NULL, 9),
(8, 3, 3, 'invalid_tech', 'Công nghệ không hợp lệ', 'noun', NULL, NULL, NULL, 'Missing pronunciation', 'error', 'Missing pronunciation', NULL);

-- INSERT: study_modes (2 records)
INSERT INTO study_modes (mode_id, mode_name, description, is_active, created_at) VALUES
(1, 'flashcard', 'Học từ vựng bằng thẻ flashcard', TRUE, '2024-01-01 00:00:00'),
(2, 'list_view', 'Học từ vựng bằng danh sách', TRUE, '2024-01-01 00:00:00');

-- =============================================
-- COURSE MODULE
-- =============================================

-- INSERT: categories (5 course categories)
INSERT INTO categories (category_id, name, slug, description, icon, color, image, sort_order, is_active, created_at, updated_at) VALUES
(1, 'Tiếng Anh Giao Tiếp', 'tieng-anh-giao-tiep', 'Khóa học tiếng Anh giao tiếp cơ bản và nâng cao', 'fas fa-comments', '#FF6B6B', 'https://example.com/images/conversation.jpg', 1, TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(2, 'Tiếng Anh Thương Mại', 'tieng-anh-thuong-mai', 'Tiếng Anh cho môi trường kinh doanh và thương mại', 'fas fa-briefcase', '#4ECDC4', 'https://example.com/images/business.jpg', 2, TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(3, 'Luyện Thi TOEIC', 'luyen-thi-toeic', 'Khóa học luyện thi TOEIC từ cơ bản đến nâng cao', 'fas fa-graduation-cap', '#45B7D1', 'https://example.com/images/toeic.jpg', 3, TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(4, 'Luyện Thi IELTS', 'luyen-thi-ielts', 'Khóa học luyện thi IELTS Academic và General', 'fas fa-certificate', '#96CEB4', 'https://example.com/images/ielts.jpg', 4, TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(5, 'Tiếng Anh Trẻ Em', 'tieng-anh-tre-em', 'Khóa học tiếng Anh dành cho trẻ em', 'fas fa-child', '#FFEAA7', 'https://example.com/images/kids.jpg', 5, TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00');

-- INSERT: levels (3 levels)
INSERT INTO levels (level_id, name, slug, description, color, sort_order, is_active, created_at) VALUES
(1, 'Beginner', 'beginner', 'Trình độ cơ bản cho người mới bắt đầu', '#FF6B6B', 1, TRUE, '2024-01-01 00:00:00'),
(2, 'Intermediate', 'intermediate', 'Trình độ trung cấp', '#4ECDC4', 2, TRUE, '2024-01-01 00:00:00'),
(3, 'Advanced', 'advanced', 'Trình độ nâng cao', '#45B7D1', 3, TRUE, '2024-01-01 00:00:00');

-- INSERT: instructors (3 instructors)
INSERT INTO instructors (instructor_id, user_id, name, avatar, bio, experience_years, specializations, education, achievements, social_links, is_featured, is_verified, is_active, created_at, updated_at) VALUES
(1, 2, 'Trần Thị Giáo', 'https://example.com/avatars/instructor1.jpg', 'Giảng viên tiếng Anh với 10 năm kinh nghiệm giảng dạy', 10, 'Giao tiếp, TOEIC, IELTS', 'Thạc sĩ Ngôn ngữ Anh - Đại học Ngoại ngữ', 'Giải nhất cuộc thi giảng viên tiếng Anh xuất sắc 2023', '{"facebook": "https://facebook.com/teacher1", "linkedin": "https://linkedin.com/in/teacher1"}', TRUE, TRUE, TRUE, '2024-01-15 08:00:00', '2024-12-01 00:00:00'),
(2, NULL, 'Nguyễn Văn Chuyên', 'https://example.com/avatars/instructor2.jpg', 'Chuyên gia tiếng Anh thương mại với kinh nghiệm quốc tế', 15, 'Business English, Corporate Training', 'Tiến sĩ Ngôn ngữ học - Đại học Cambridge', 'Tác giả 5 cuốn sách về tiếng Anh thương mại', '{"linkedin": "https://linkedin.com/in/expert2", "twitter": "https://twitter.com/expert2"}', TRUE, TRUE, TRUE, '2024-01-20 10:00:00', '2024-12-01 00:00:00'),
(3, NULL, 'Lê Thị Minh', 'https://example.com/avatars/instructor3.jpg', 'Giảng viên tiếng Anh trẻ em với phương pháp sáng tạo', 8, 'Kids English, Creative Teaching', 'Cử nhân Sư phạm Tiếng Anh - Đại học Sư phạm', 'Chứng chỉ TESOL quốc tế', '{"facebook": "https://facebook.com/kidsteacher3", "instagram": "https://instagram.com/kidsteacher3"}', FALSE, TRUE, TRUE, '2024-02-01 14:00:00', '2024-12-01 00:00:00');

-- INSERT: courses (4 courses)
INSERT INTO courses (course_id, title, slug, short_description, description, category_id, level_id, instructor_id, image, video_preview, video_duration, video_progress, total_lessons, total_duration, total_students, rating, rating_count, price, old_price, discount_percent, is_free, is_best_seller, is_featured, status, published_at, meta_title, meta_description, created_at, updated_at) VALUES
(1, 'Tiếng Anh Giao Tiếp Cơ Bản', 'tieng-anh-giao-tiep-co-ban', 'Học tiếng Anh giao tiếp từ những câu đơn giản nhất', 'Khóa học tiếng Anh giao tiếp cơ bản dành cho người mới bắt đầu. Bạn sẽ học được những câu giao tiếp thông dụng trong cuộc sống hàng ngày.', 1, 1, 1, 'https://example.com/images/course1.jpg', 'https://example.com/videos/course1_preview.mp4', '03:45', 0.25, 20, '10 giờ', 150, 4.8, 45, 299000.00, 399000.00, 25, FALSE, TRUE, TRUE, 'published', '2024-01-15 08:00:00', 'Tiếng Anh Giao Tiếp Cơ Bản - Học Online', 'Khóa học tiếng Anh giao tiếp cơ bản online chất lượng cao', '2024-01-15 08:00:00', '2024-12-01 00:00:00'),
(2, 'Tiếng Anh Thương Mại Nâng Cao', 'tieng-anh-thuong-mai-nang-cao', 'Nâng cao kỹ năng tiếng Anh trong môi trường kinh doanh', 'Khóa học tiếng Anh thương mại nâng cao giúp bạn tự tin giao tiếp trong các tình huống kinh doanh phức tạp.', 2, 3, 2, 'https://example.com/images/course2.jpg', 'https://example.com/videos/course2_preview.mp4', '04:20', 0.15, 25, '15 giờ', 89, 4.9, 32, 599000.00, 799000.00, 25, FALSE, FALSE, TRUE, 'published', '2024-01-20 10:00:00', 'Tiếng Anh Thương Mại Nâng Cao - Business English', 'Khóa học tiếng Anh thương mại nâng cao cho doanh nhân', '2024-01-20 10:00:00', '2024-12-01 00:00:00'),
(3, 'Luyện Thi TOEIC 600+', 'luyen-thi-toeic-600', 'Đạt điểm TOEIC 600+ với phương pháp hiệu quả', 'Khóa học luyện thi TOEIC 600+ với chiến lược làm bài hiệu quả và luyện tập đầy đủ các dạng câu hỏi.', 3, 2, 1, 'https://example.com/images/course3.jpg', 'https://example.com/videos/course3_preview.mp4', '05:10', 0.30, 30, '20 giờ', 203, 4.7, 67, 499000.00, 699000.00, 29, FALSE, TRUE, FALSE, 'published', '2024-02-01 14:00:00', 'Luyện Thi TOEIC 600+ - Đảm Bảo Điểm Số', 'Khóa học luyện thi TOEIC 600+ với cam kết điểm số', '2024-02-01 14:00:00', '2024-12-01 00:00:00'),
(4, 'Tiếng Anh Trẻ Em Vui Nhộn', 'tieng-anh-tre-em-vui-nhon', 'Học tiếng Anh qua trò chơi và bài hát', 'Khóa học tiếng Anh trẻ em với phương pháp học qua trò chơi, bài hát và hoạt động tương tác.', 5, 1, 3, 'https://example.com/images/course4.jpg', 'https://example.com/videos/course4_preview.mp4', '02:30', 0.40, 15, '8 giờ', 78, 4.9, 28, 199000.00, 299000.00, 33, FALSE, FALSE, FALSE, 'published', '2024-02-01 14:00:00', 'Tiếng Anh Trẻ Em Vui Nhộn - Học Qua Trò Chơi', 'Khóa học tiếng Anh trẻ em vui nhộn và hiệu quả', '2024-02-01 14:00:00', '2024-12-01 00:00:00');

-- INSERT: course_details (4 records, one per course)
INSERT INTO course_details (course_detail_id, course_id, about_content, learning_outcomes, skills_covered, requirements, achievements, certificate_info, last_updated, language, target_audience, created_at, updated_at) VALUES
(1, 1, 'Khóa học tiếng Anh giao tiếp cơ bản được thiết kế đặc biệt cho người mới bắt đầu. Bạn sẽ học được cách phát âm chuẩn, ngữ pháp cơ bản và từ vựng thông dụng.', '["Tự tin giao tiếp tiếng Anh cơ bản", "Phát âm chuẩn 44 âm tiếng Anh", "Sử dụng thành thạo 500 từ vựng cơ bản", "Nắm vững ngữ pháp cơ bản"]', '["Speaking", "Listening", "Pronunciation", "Basic Grammar"]', '["Không cần kiến thức tiếng Anh trước đó", "Có máy tính hoặc điện thoại kết nối internet"]', '["Chứng chỉ hoàn thành khóa học", "500 từ vựng cơ bản", "Kỹ năng giao tiếp tự tin"]', 'Chứng chỉ hoàn thành khóa học Tiếng Anh Giao Tiếp Cơ Bản', '2024-11-01', 'Vietnamese', 'Người mới bắt đầu học tiếng Anh', '2024-01-15 08:00:00', '2024-12-01 00:00:00'),
(2, 2, 'Khóa học tiếng Anh thương mại nâng cao dành cho các chuyên gia, doanh nhân muốn nâng cao khả năng giao tiếp trong môi trường kinh doanh quốc tế.', '["Thuyết trình tự tin bằng tiếng Anh", "Đàm phán và thương lượng hiệu quả", "Viết email và báo cáo chuyên nghiệp", "Giao tiếp trong các cuộc họp quốc tế"]', '["Business Communication", "Presentation Skills", "Negotiation", "Professional Writing"]', '["Trình độ tiếng Anh trung cấp trở lên", "Kinh nghiệm làm việc trong môi trường kinh doanh"]', '["Chứng chỉ tiếng Anh thương mại", "Kỹ năng thuyết trình chuyên nghiệp", "Khả năng đàm phán quốc tế"]', 'Chứng chỉ tiếng Anh thương mại nâng cao', '2024-11-15', 'Vietnamese', 'Chuyên gia, doanh nhân, quản lý', '2024-01-20 10:00:00', '2024-12-01 00:00:00'),
(3, 3, 'Khóa học luyện thi TOEIC 600+ với phương pháp học hiệu quả, chiến lược làm bài và luyện tập đầy đủ các dạng câu hỏi trong bài thi TOEIC.', '["Đạt điểm TOEIC 600+", "Nắm vững chiến lược làm bài", "Tăng tốc độ đọc hiểu", "Cải thiện kỹ năng nghe"]', '["TOEIC Listening", "TOEIC Reading", "Test Strategies", "Time Management"]', '["Trình độ tiếng Anh trung cấp", "Mục tiêu điểm TOEIC 600+"]', '["Chứng chỉ luyện thi TOEIC", "Điểm TOEIC 600+", "Kỹ năng làm bài thi hiệu quả"]', 'Chứng chỉ hoàn thành khóa luyện thi TOEIC 600+', '2024-11-20', 'Vietnamese', 'Sinh viên, người đi làm cần chứng chỉ TOEIC', '2024-02-01 14:00:00', '2024-12-01 00:00:00'),
(4, 4, 'Khóa học tiếng Anh trẻ em với phương pháp học vui nhộn, tương tác cao. Trẻ sẽ học tiếng Anh qua trò chơi, bài hát và các hoạt động thú vị.', '["Yêu thích học tiếng Anh", "Phát âm chuẩn từ nhỏ", "Tự tin giao tiếp", "Vốn từ vựng phong phú"]', '["Speaking", "Listening", "Vocabulary", "Pronunciation"]', '["Trẻ em từ 6-12 tuổi", "Có người lớn hỗ trợ học"]', '["Chứng chỉ tiếng Anh trẻ em", "Kỹ năng giao tiếp tự tin", "Tình yêu học tiếng Anh"]', 'Chứng chỉ hoàn thành khóa học tiếng Anh trẻ em', '2024-11-25', 'Vietnamese', 'Trẻ em từ 6-12 tuổi', '2024-02-01 14:00:00', '2024-12-01 00:00:00');

-- INSERT: modules (8+ records, 2-3 per course)
INSERT INTO modules (module_id, course_id, title, description, sort_order, total_lectures, total_duration, is_active, created_at, updated_at) VALUES
-- Course 1: Tiếng Anh Giao Tiếp Cơ Bản (2 modules)
(1, 1, 'Phát Âm Cơ Bản', 'Học cách phát âm chuẩn 44 âm tiếng Anh', 1, 10, '5 giờ', TRUE, '2024-01-15 08:00:00', '2024-12-01 00:00:00'),
(2, 1, 'Giao Tiếp Hàng Ngày', 'Học các câu giao tiếp thông dụng trong cuộc sống', 2, 10, '5 giờ', TRUE, '2024-01-15 08:00:00', '2024-12-01 00:00:00'),

-- Course 2: Tiếng Anh Thương Mại Nâng Cao (3 modules)
(3, 2, 'Giao Tiếp Trong Kinh Doanh', 'Kỹ năng giao tiếp trong môi trường kinh doanh', 1, 8, '6 giờ', TRUE, '2024-01-20 10:00:00', '2024-12-01 00:00:00'),
(4, 2, 'Thuyết Trình Chuyên Nghiệp', 'Kỹ năng thuyết trình và trình bày ý tưởng', 2, 8, '5 giờ', TRUE, '2024-01-20 10:00:00', '2024-12-01 00:00:00'),
(5, 2, 'Đàm Phán và Thương Lượng', 'Kỹ năng đàm phán trong kinh doanh quốc tế', 3, 9, '4 giờ', TRUE, '2024-01-20 10:00:00', '2024-12-01 00:00:00'),

-- Course 3: Luyện Thi TOEIC 600+ (3 modules)
(6, 3, 'TOEIC Listening', 'Luyện tập kỹ năng nghe hiểu trong bài thi TOEIC', 1, 10, '8 giờ', TRUE, '2024-02-01 14:00:00', '2024-12-01 00:00:00'),
(7, 3, 'TOEIC Reading', 'Luyện tập kỹ năng đọc hiểu trong bài thi TOEIC', 2, 10, '7 giờ', TRUE, '2024-02-01 14:00:00', '2024-12-01 00:00:00'),
(8, 3, 'Chiến Lược Làm Bài', 'Chiến lược và mẹo làm bài thi TOEIC hiệu quả', 3, 10, '5 giờ', TRUE, '2024-02-01 14:00:00', '2024-12-01 00:00:00'),

-- Course 4: Tiếng Anh Trẻ Em Vui Nhộn (2 modules)
(9, 4, 'Học Qua Trò Chơi', 'Học tiếng Anh qua các trò chơi thú vị', 1, 8, '4 giờ', TRUE, '2024-02-01 14:00:00', '2024-12-01 00:00:00'),
(10, 4, 'Học Qua Bài Hát', 'Học tiếng Anh qua các bài hát vui nhộn', 2, 7, '4 giờ', TRUE, '2024-02-01 14:00:00', '2024-12-01 00:00:00');

-- INSERT: lessons (16+ records, 2 per module)
INSERT INTO lessons (lesson_id, module_id, course_id, title, description, content, video_url, video_duration, file_attachment, sort_order, lesson_type, is_free, is_active, view_count, created_at, updated_at) VALUES
-- Module 1: Phát Âm Cơ Bản (2 lessons)
(1, 1, 1, 'Bảng Chữ Cái Tiếng Anh', 'Học cách đọc bảng chữ cái tiếng Anh', 'Trong bài học này, bạn sẽ học cách đọc và phát âm chuẩn 26 chữ cái trong bảng chữ cái tiếng Anh.', 'https://example.com/videos/lesson1.mp4', '15:30', 'https://example.com/files/alphabet.pdf', 1, 'video', TRUE, TRUE, 245, '2024-01-15 08:00:00', '2024-12-01 00:00:00'),
(2, 1, 1, 'Nguyên Âm Cơ Bản', 'Học cách phát âm các nguyên âm cơ bản', 'Bài học về cách phát âm các nguyên âm cơ bản trong tiếng Anh: a, e, i, o, u.', 'https://example.com/videos/lesson2.mp4', '18:45', 'https://example.com/files/vowels.pdf', 2, 'video', FALSE, TRUE, 189, '2024-01-15 08:00:00', '2024-12-01 00:00:00'),

-- Module 2: Giao Tiếp Hàng Ngày (2 lessons)
(3, 2, 1, 'Chào Hỏi Cơ Bản', 'Học cách chào hỏi trong tiếng Anh', 'Các cách chào hỏi thông dụng trong tiếng Anh: Hello, Hi, Good morning, Good afternoon, Good evening.', 'https://example.com/videos/lesson3.mp4', '12:20', 'https://example.com/files/greetings.pdf', 1, 'video', TRUE, TRUE, 312, '2024-01-15 08:00:00', '2024-12-01 00:00:00'),
(4, 2, 1, 'Giới Thiệu Bản Thân', 'Học cách giới thiệu bản thân', 'Cách giới thiệu bản thân: tên, tuổi, nghề nghiệp, sở thích trong tiếng Anh.', 'https://example.com/videos/lesson4.mp4', '16:10', 'https://example.com/files/introduction.pdf', 2, 'video', FALSE, TRUE, 267, '2024-01-15 08:00:00', '2024-12-01 00:00:00'),

-- Module 3: Giao Tiếp Trong Kinh Doanh (2 lessons)
(5, 3, 2, 'Giao Tiếp Trong Cuộc Họp', 'Kỹ năng giao tiếp trong các cuộc họp kinh doanh', 'Cách tham gia và giao tiếp hiệu quả trong các cuộc họp kinh doanh bằng tiếng Anh.', 'https://example.com/videos/lesson5.mp4', '22:15', 'https://example.com/files/meeting.pdf', 1, 'video', FALSE, TRUE, 156, '2024-01-20 10:00:00', '2024-12-01 00:00:00'),
(6, 3, 2, 'Gọi Điện Thương Mại', 'Kỹ năng gọi điện trong kinh doanh', 'Cách thực hiện cuộc gọi điện thương mại chuyên nghiệp bằng tiếng Anh.', 'https://example.com/videos/lesson6.mp4', '19:30', 'https://example.com/files/phone_calls.pdf', 2, 'video', FALSE, TRUE, 134, '2024-01-20 10:00:00', '2024-12-01 00:00:00'),

-- Module 4: Thuyết Trình Chuyên Nghiệp (2 lessons)
(7, 4, 2, 'Cấu Trúc Bài Thuyết Trình', 'Học cách xây dựng cấu trúc bài thuyết trình', 'Cách xây dựng cấu trúc bài thuyết trình chuyên nghiệp: mở đầu, thân bài, kết luận.', 'https://example.com/videos/lesson7.mp4', '25:45', 'https://example.com/files/presentation_structure.pdf', 1, 'video', FALSE, TRUE, 98, '2024-01-20 10:00:00', '2024-12-01 00:00:00'),
(8, 4, 2, 'Kỹ Thuật Thuyết Trình', 'Kỹ thuật và mẹo thuyết trình hiệu quả', 'Các kỹ thuật thuyết trình: ngôn ngữ cơ thể, giọng nói, tương tác với khán giả.', 'https://example.com/videos/lesson8.mp4', '28:20', 'https://example.com/files/presentation_techniques.pdf', 2, 'video', FALSE, TRUE, 87, '2024-01-20 10:00:00', '2024-12-01 00:00:00'),

-- Module 5: Đàm Phán và Thương Lượng (2 lessons)
(9, 5, 2, 'Nguyên Tắc Đàm Phán', 'Học các nguyên tắc cơ bản trong đàm phán', 'Các nguyên tắc vàng trong đàm phán kinh doanh quốc tế.', 'https://example.com/videos/lesson9.mp4', '24:10', 'https://example.com/files/negotiation_principles.pdf', 1, 'video', FALSE, TRUE, 76, '2024-01-20 10:00:00', '2024-12-01 00:00:00'),
(10, 5, 2, 'Kỹ Thuật Thương Lượng', 'Kỹ thuật thương lượng hiệu quả', 'Các kỹ thuật thương lượng: win-win, compromise, persuasion.', 'https://example.com/videos/lesson10.mp4', '26:35', 'https://example.com/files/bargaining_techniques.pdf', 2, 'video', FALSE, TRUE, 65, '2024-01-20 10:00:00', '2024-12-01 00:00:00'),

-- Module 6: TOEIC Listening (2 lessons)
(11, 6, 3, 'Part 1: Mô Tả Hình Ảnh', 'Luyện tập Part 1 của bài thi TOEIC Listening', 'Chiến lược và kỹ thuật làm bài Part 1: mô tả hình ảnh trong bài thi TOEIC.', 'https://example.com/videos/lesson11.mp4', '20:15', 'https://example.com/files/toeic_part1.pdf', 1, 'video', FALSE, TRUE, 234, '2024-02-01 14:00:00', '2024-12-01 00:00:00'),
(12, 6, 3, 'Part 2: Hỏi Đáp', 'Luyện tập Part 2 của bài thi TOEIC Listening', 'Chiến lược làm bài Part 2: hỏi đáp trong bài thi TOEIC Listening.', 'https://example.com/videos/lesson12.mp4', '18:45', 'https://example.com/files/toeic_part2.pdf', 2, 'video', FALSE, TRUE, 198, '2024-02-01 14:00:00', '2024-12-01 00:00:00'),

-- Module 7: TOEIC Reading (2 lessons)
(13, 7, 3, 'Part 5: Hoàn Thành Câu', 'Luyện tập Part 5 của bài thi TOEIC Reading', 'Chiến lược làm bài Part 5: hoàn thành câu trong bài thi TOEIC Reading.', 'https://example.com/videos/lesson13.mp4', '22:30', 'https://example.com/files/toeic_part5.pdf', 1, 'video', FALSE, TRUE, 187, '2024-02-01 14:00:00', '2024-12-01 00:00:00'),
(14, 7, 3, 'Part 6: Hoàn Thành Đoạn Văn', 'Luyện tập Part 6 của bài thi TOEIC Reading', 'Chiến lược làm bài Part 6: hoàn thành đoạn văn trong bài thi TOEIC Reading.', 'https://example.com/videos/lesson14.mp4', '25:20', 'https://example.com/files/toeic_part6.pdf', 2, 'video', FALSE, TRUE, 156, '2024-02-01 14:00:00', '2024-12-01 00:00:00'),

-- Module 8: Chiến Lược Làm Bài (2 lessons)
(15, 8, 3, 'Quản Lý Thời Gian', 'Kỹ năng quản lý thời gian trong bài thi TOEIC', 'Cách phân bổ thời gian hiệu quả cho từng phần trong bài thi TOEIC.', 'https://example.com/videos/lesson15.mp4', '16:45', 'https://example.com/files/time_management.pdf', 1, 'video', FALSE, TRUE, 145, '2024-02-01 14:00:00', '2024-12-01 00:00:00'),
(16, 8, 3, 'Mẹo Làm Bài Hiệu Quả', 'Các mẹo và chiến lược làm bài thi TOEIC', 'Tổng hợp các mẹo và chiến lược làm bài thi TOEIC hiệu quả nhất.', 'https://example.com/videos/lesson16.mp4', '19:15', 'https://example.com/files/test_tips.pdf', 2, 'video', FALSE, TRUE, 123, '2024-02-01 14:00:00', '2024-12-01 00:00:00'),

-- Module 9: Học Qua Trò Chơi (2 lessons)
(17, 9, 4, 'Trò Chơi Từ Vựng', 'Học từ vựng qua các trò chơi thú vị', 'Các trò chơi giúp trẻ học từ vựng tiếng Anh một cách vui nhộn và hiệu quả.', 'https://example.com/videos/lesson17.mp4', '12:30', 'https://example.com/files/vocabulary_games.pdf', 1, 'video', TRUE, TRUE, 89, '2024-02-01 14:00:00', '2024-12-01 00:00:00'),
(18, 9, 4, 'Trò Chơi Phát Âm', 'Học phát âm qua trò chơi', 'Các trò chơi giúp trẻ học phát âm tiếng Anh chuẩn và tự nhiên.', 'https://example.com/videos/lesson18.mp4', '14:20', 'https://example.com/files/pronunciation_games.pdf', 2, 'video', FALSE, TRUE, 67, '2024-02-01 14:00:00', '2024-12-01 00:00:00'),

-- Module 10: Học Qua Bài Hát (2 lessons)
(19, 10, 4, 'Bài Hát ABC', 'Học bảng chữ cái qua bài hát', 'Học bảng chữ cái tiếng Anh qua bài hát ABC vui nhộn và dễ nhớ.', 'https://example.com/videos/lesson19.mp4', '08:45', 'https://example.com/files/abc_song.pdf', 1, 'video', TRUE, TRUE, 156, '2024-02-01 14:00:00', '2024-12-01 00:00:00'),
(20, 10, 4, 'Bài Hát Số Đếm', 'Học số đếm qua bài hát', 'Học số đếm từ 1 đến 20 qua các bài hát vui nhộn.', 'https://example.com/videos/lesson20.mp4', '10:15', 'https://example.com/files/counting_songs.pdf', 2, 'video', FALSE, TRUE, 134, '2024-02-01 14:00:00', '2024-12-01 00:00:00');

-- INSERT: course_enrollments (12+ records)
INSERT INTO course_enrollments (enrollment_id, user_id, course_id, status, enrolled_at, completed_at, expires_at, progress_percent, last_accessed_lesson_id, last_accessed_at, payment_amount, payment_method, payment_status, transaction_id, created_at, updated_at) VALUES
(1, 3, 1, 'active', '2024-02-01 10:00:00', NULL, '2025-02-01 10:00:00', 25.50, 1, '2024-12-01 14:20:00', 299000.00, 'credit_card', 'paid', 'TXN001', '2024-02-01 10:00:00', '2024-12-01 14:20:00'),
(2, 4, 1, 'active', '2024-02-15 14:30:00', NULL, '2025-02-15 14:30:00', 45.75, 3, '2024-12-01 16:45:00', 299000.00, 'bank_transfer', 'paid', 'TXN002', '2024-02-15 14:30:00', '2024-12-01 16:45:00'),
(3, 5, 2, 'active', '2024-03-01 16:00:00', NULL, '2025-03-01 16:00:00', 12.30, 5, '2024-11-30 20:10:00', 599000.00, 'credit_card', 'paid', 'TXN003', '2024-03-01 16:00:00', '2024-11-30 20:10:00'),
(4, 6, 2, 'completed', '2024-03-15 12:00:00', '2024-11-15 12:00:00', '2025-03-15 12:00:00', 100.00, 10, '2024-11-15 12:00:00', 599000.00, 'credit_card', 'paid', 'TXN004', '2024-03-15 12:00:00', '2024-11-15 12:00:00'),
(5, 7, 3, 'active', '2024-04-01 09:30:00', NULL, '2025-04-01 09:30:00', 67.80, 13, '2024-12-01 13:15:00', 499000.00, 'bank_transfer', 'paid', 'TXN005', '2024-04-01 09:30:00', '2024-12-01 13:15:00'),
(6, 8, 3, 'active', '2024-04-15 11:00:00', NULL, '2025-04-15 11:00:00', 33.25, 11, '2024-12-01 15:45:00', 499000.00, 'credit_card', 'paid', 'TXN006', '2024-04-15 11:00:00', '2024-12-01 15:45:00'),
(7, 3, 3, 'active', '2024-05-01 15:00:00', NULL, '2025-05-01 15:00:00', 15.60, 11, '2024-11-29 18:20:00', 499000.00, 'credit_card', 'paid', 'TXN007', '2024-05-01 15:00:00', '2024-11-29 18:20:00'),
(8, 4, 4, 'active', '2024-05-15 16:30:00', NULL, '2025-05-15 16:30:00', 80.40, 19, '2024-12-01 16:45:00', 199000.00, 'bank_transfer', 'paid', 'TXN008', '2024-05-15 16:30:00', '2024-12-01 16:45:00'),
(9, 5, 4, 'completed', '2024-06-01 14:00:00', '2024-11-20 14:00:00', '2025-06-01 14:00:00', 100.00, 20, '2024-11-20 14:00:00', 199000.00, 'credit_card', 'paid', 'TXN009', '2024-06-01 14:00:00', '2024-11-20 14:00:00'),
(10, 6, 1, 'cancelled', '2024-06-15 10:00:00', NULL, '2025-06-15 10:00:00', 5.20, 1, '2024-06-20 10:00:00', 0.00, NULL, 'refunded', 'TXN010', '2024-06-15 10:00:00', '2024-06-20 10:00:00'),
(11, 7, 2, 'active', '2024-07-01 11:30:00', NULL, '2025-07-01 11:30:00', 22.15, 6, '2024-12-01 13:15:00', 599000.00, 'credit_card', 'paid', 'TXN011', '2024-07-01 11:30:00', '2024-12-01 13:15:00'),
(12, 8, 4, 'active', '2024-07-15 13:45:00', NULL, '2025-07-15 13:45:00', 55.80, 18, '2024-12-01 15:45:00', 199000.00, 'bank_transfer', 'paid', 'TXN012', '2024-07-15 13:45:00', '2024-12-01 15:45:00');

-- INSERT: lesson_progress (30+ records)
INSERT INTO lesson_progress (lesson_progress_id, user_id, lesson_id, course_id, status, watched_duration, total_duration, completion_percent, started_at, completed_at, last_accessed_at, created_at, updated_at) VALUES
-- User 3 Course 1 progress
(1, 3, 1, 1, 'completed', 930, 930, 100.00, '2024-02-01 10:00:00', '2024-02-01 10:15:30', '2024-02-01 10:15:30', '2024-02-01 10:00:00', '2024-02-01 10:15:30'),
(2, 3, 2, 1, 'in_progress', 600, 1125, 53.33, '2024-02-01 10:16:00', NULL, '2024-12-01 14:20:00', '2024-02-01 10:16:00', '2024-12-01 14:20:00'),
(3, 3, 3, 1, 'completed', 740, 740, 100.00, '2024-02-01 10:30:00', '2024-02-01 10:42:20', '2024-02-01 10:42:20', '2024-02-01 10:30:00', '2024-02-01 10:42:20'),
(4, 3, 4, 1, 'not_started', 0, 970, 0.00, NULL, NULL, '2024-12-01 14:20:00', '2024-02-01 10:00:00', '2024-12-01 14:20:00'),

-- User 4 Course 1 progress
(5, 4, 1, 1, 'completed', 930, 930, 100.00, '2024-02-15 14:30:00', '2024-02-15 14:45:30', '2024-02-15 14:45:30', '2024-02-15 14:30:00', '2024-02-15 14:45:30'),
(6, 4, 2, 1, 'completed', 1125, 1125, 100.00, '2024-02-15 14:46:00', '2024-02-15 15:04:45', '2024-02-15 15:04:45', '2024-02-15 14:46:00', '2024-02-15 15:04:45'),
(7, 4, 3, 1, 'completed', 740, 740, 100.00, '2024-02-15 15:05:00', '2024-02-15 15:17:20', '2024-02-15 15:17:20', '2024-02-15 15:05:00', '2024-02-15 15:17:20'),
(8, 4, 4, 1, 'in_progress', 400, 970, 41.24, '2024-02-15 15:18:00', NULL, '2024-12-01 16:45:00', '2024-02-15 15:18:00', '2024-12-01 16:45:00'),

-- User 5 Course 2 progress
(9, 5, 5, 2, 'completed', 1335, 1335, 100.00, '2024-03-01 16:00:00', '2024-03-01 16:22:15', '2024-03-01 16:22:15', '2024-03-01 16:00:00', '2024-03-01 16:22:15'),
(10, 5, 6, 2, 'in_progress', 300, 1170, 25.64, '2024-03-01 16:23:00', NULL, '2024-11-30 20:10:00', '2024-03-01 16:23:00', '2024-11-30 20:10:00'),

-- User 6 Course 2 progress (completed)
(11, 6, 5, 2, 'completed', 1335, 1335, 100.00, '2024-03-15 12:00:00', '2024-03-15 12:22:15', '2024-03-15 12:22:15', '2024-03-15 12:00:00', '2024-03-15 12:22:15'),
(12, 6, 6, 2, 'completed', 1170, 1170, 100.00, '2024-03-15 12:23:00', '2024-03-15 12:42:30', '2024-03-15 12:42:30', '2024-03-15 12:23:00', '2024-03-15 12:42:30'),
(13, 6, 7, 2, 'completed', 1545, 1545, 100.00, '2024-03-15 12:43:00', '2024-03-15 13:08:45', '2024-03-15 13:08:45', '2024-03-15 12:43:00', '2024-03-15 13:08:45'),
(14, 6, 8, 2, 'completed', 1700, 1700, 100.00, '2024-03-15 13:09:00', '2024-03-15 13:37:20', '2024-03-15 13:37:20', '2024-03-15 13:09:00', '2024-03-15 13:37:20'),
(15, 6, 9, 2, 'completed', 1450, 1450, 100.00, '2024-03-15 13:38:00', '2024-03-15 14:02:10', '2024-03-15 14:02:10', '2024-03-15 13:38:00', '2024-03-15 14:02:10'),
(16, 6, 10, 2, 'completed', 1595, 1595, 100.00, '2024-03-15 14:03:00', '2024-03-15 14:29:35', '2024-03-15 14:29:35', '2024-03-15 14:03:00', '2024-03-15 14:29:35'),

-- User 7 Course 3 progress
(17, 7, 11, 3, 'completed', 1215, 1215, 100.00, '2024-04-01 09:30:00', '2024-04-01 09:50:15', '2024-04-01 09:50:15', '2024-04-01 09:30:00', '2024-04-01 09:50:15'),
(18, 7, 12, 3, 'completed', 1125, 1125, 100.00, '2024-04-01 09:51:00', '2024-04-01 10:09:45', '2024-04-01 10:09:45', '2024-04-01 09:51:00', '2024-04-01 10:09:45'),
(19, 7, 13, 3, 'completed', 1350, 1350, 100.00, '2024-04-01 10:10:00', '2024-04-01 10:32:30', '2024-04-01 10:32:30', '2024-04-01 10:10:00', '2024-04-01 10:32:30'),
(20, 7, 14, 3, 'in_progress', 800, 1520, 52.63, '2024-04-01 10:33:00', NULL, '2024-12-01 13:15:00', '2024-04-01 10:33:00', '2024-12-01 13:15:00'),

-- User 8 Course 3 progress
(21, 8, 11, 3, 'completed', 1215, 1215, 100.00, '2024-04-15 11:00:00', '2024-04-15 11:20:15', '2024-04-15 11:20:15', '2024-04-15 11:00:00', '2024-04-15 11:20:15'),
(22, 8, 12, 3, 'in_progress', 600, 1125, 53.33, '2024-04-15 11:21:00', NULL, '2024-12-01 15:45:00', '2024-04-15 11:21:00', '2024-12-01 15:45:00'),

-- User 3 Course 3 progress
(23, 3, 11, 3, 'completed', 1215, 1215, 100.00, '2024-05-01 15:00:00', '2024-05-01 15:20:15', '2024-05-01 15:20:15', '2024-05-01 15:00:00', '2024-05-01 15:20:15'),
(24, 3, 12, 3, 'in_progress', 300, 1125, 26.67, '2024-05-01 15:21:00', NULL, '2024-11-29 18:20:00', '2024-05-01 15:21:00', '2024-11-29 18:20:00'),

-- User 4 Course 4 progress
(25, 4, 17, 4, 'completed', 750, 750, 100.00, '2024-05-15 16:30:00', '2024-05-15 16:42:30', '2024-05-15 16:42:30', '2024-05-15 16:30:00', '2024-05-15 16:42:30'),
(26, 4, 18, 4, 'completed', 860, 860, 100.00, '2024-05-15 16:43:00', '2024-05-15 16:57:20', '2024-05-15 16:57:20', '2024-05-15 16:43:00', '2024-05-15 16:57:20'),
(27, 4, 19, 4, 'completed', 525, 525, 100.00, '2024-05-15 16:58:00', '2024-05-15 17:06:45', '2024-05-15 17:06:45', '2024-05-15 16:58:00', '2024-05-15 17:06:45'),
(28, 4, 20, 4, 'in_progress', 400, 615, 65.04, '2024-05-15 17:07:00', NULL, '2024-12-01 16:45:00', '2024-05-15 17:07:00', '2024-12-01 16:45:00'),

-- User 5 Course 4 progress (completed)
(29, 5, 17, 4, 'completed', 750, 750, 100.00, '2024-06-01 14:00:00', '2024-06-01 14:12:30', '2024-06-01 14:12:30', '2024-06-01 14:00:00', '2024-06-01 14:12:30'),
(30, 5, 18, 4, 'completed', 860, 860, 100.00, '2024-06-01 14:13:00', '2024-06-01 14:27:20', '2024-06-01 14:27:20', '2024-06-01 14:13:00', '2024-06-01 14:27:20'),
(31, 5, 19, 4, 'completed', 525, 525, 100.00, '2024-06-01 14:28:00', '2024-06-01 14:36:45', '2024-06-01 14:36:45', '2024-06-01 14:28:00', '2024-06-01 14:36:45'),
(32, 5, 20, 4, 'completed', 615, 615, 100.00, '2024-06-01 14:37:00', '2024-06-01 14:47:15', '2024-06-01 14:47:15', '2024-06-01 14:37:00', '2024-06-01 14:47:15');

-- INSERT: course_reviews (10+ records)
INSERT INTO course_reviews (review_id, user_id, course_id, rating, title, content, is_verified, status, created_at, updated_at) VALUES
(1, 3, 1, 5, 'Khóa học rất hay và dễ hiểu', 'Tôi đã học được rất nhiều từ khóa học này. Giảng viên dạy rất dễ hiểu và có nhiều ví dụ thực tế.', TRUE, 'approved', '2024-02-15 10:00:00', '2024-02-15 10:00:00'),
(2, 4, 1, 4, 'Nội dung tốt, cần cải thiện âm thanh', 'Khóa học có nội dung tốt nhưng chất lượng âm thanh một số video chưa rõ.', TRUE, 'approved', '2024-02-20 14:30:00', '2024-02-20 14:30:00'),
(3, 6, 2, 5, 'Khóa học thương mại xuất sắc', 'Khóa học này giúp tôi tự tin hơn trong giao tiếp kinh doanh. Rất hữu ích cho công việc.', TRUE, 'approved', '2024-03-20 12:00:00', '2024-03-20 12:00:00'),
(4, 7, 3, 4, 'Luyện thi TOEIC hiệu quả', 'Chiến lược làm bài rất hay, giúp tôi cải thiện điểm số đáng kể.', TRUE, 'approved', '2024-04-15 09:30:00', '2024-04-15 09:30:00'),
(5, 8, 3, 5, 'Đề thi sát thực tế', 'Các đề thi trong khóa học rất sát với đề thi thật. Rất hài lòng với chất lượng.', TRUE, 'approved', '2024-04-20 11:00:00', '2024-04-20 11:00:00'),
(6, 4, 4, 5, 'Con tôi rất thích học', 'Con tôi rất thích các trò chơi và bài hát trong khóa học. Học rất vui và hiệu quả.', TRUE, 'approved', '2024-05-20 16:30:00', '2024-05-20 16:30:00'),
(7, 5, 4, 4, 'Phương pháp dạy sáng tạo', 'Cách dạy qua trò chơi và bài hát rất sáng tạo. Trẻ em học rất vui.', TRUE, 'approved', '2024-06-05 14:00:00', '2024-06-05 14:00:00'),
(8, 7, 2, 3, 'Nội dung khó với người mới', 'Khóa học này khá khó với người mới bắt đầu. Cần có kiến thức cơ bản trước.', TRUE, 'approved', '2024-07-10 11:30:00', '2024-07-10 11:30:00'),
(9, 8, 4, 5, 'Giá cả hợp lý, chất lượng tốt', 'Với giá này thì chất lượng khóa học rất tốt. Con tôi học được nhiều từ vựng mới.', TRUE, 'approved', '2024-07-20 13:45:00', '2024-07-20 13:45:00'),
(10, 3, 3, 4, 'Cần thêm bài tập thực hành', 'Khóa học tốt nhưng cần thêm nhiều bài tập thực hành để củng cố kiến thức.', TRUE, 'pending', '2024-11-25 15:00:00', '2024-11-25 15:00:00');

-- INSERT: course_discussions (8+ records)
INSERT INTO course_discussions (discussion_id, course_id, user_id, parent_id, title, content, likes_count, replies_count, status, created_at, updated_at) VALUES
(1, 1, 3, NULL, 'Cách phát âm âm "th"', 'Tôi gặp khó khăn trong việc phát âm âm "th". Có ai có mẹo nào không?', 5, 3, 'active', '2024-02-10 10:00:00', '2024-02-10 10:00:00'),
(2, 1, 4, 1, NULL, 'Bạn thử đặt lưỡi giữa hai hàm răng và thổi nhẹ', 2, 0, 'active', '2024-02-10 11:00:00', '2024-02-10 11:00:00'),
(3, 1, 3, 1, NULL, 'Cảm ơn bạn, tôi sẽ thử cách này', 1, 0, 'active', '2024-02-10 12:00:00', '2024-02-10 12:00:00'),
(4, 2, 6, NULL, 'Tài liệu tham khảo cho Business English', 'Ai có thể recommend một số tài liệu hay về Business English không?', 8, 2, 'active', '2024-03-25 12:00:00', '2024-03-25 12:00:00'),
(5, 2, 7, 4, NULL, 'Tôi recommend cuốn "Business English Handbook" của Cambridge', 3, 0, 'active', '2024-03-25 13:00:00', '2024-03-25 13:00:00'),
(6, 3, 7, NULL, 'Chiến lược làm Part 7 TOEIC', 'Part 7 là phần khó nhất, có ai có chiến lược nào hiệu quả không?', 12, 4, 'active', '2024-04-20 09:30:00', '2024-04-20 09:30:00'),
(7, 3, 8, 6, NULL, 'Tôi thường đọc câu hỏi trước rồi mới đọc đoạn văn', 4, 0, 'active', '2024-04-20 10:00:00', '2024-04-20 10:00:00'),
(8, 4, 4, NULL, 'Trò chơi học từ vựng cho trẻ', 'Con tôi rất thích trò chơi từ vựng. Có trò nào khác không?', 6, 2, 'active', '2024-05-25 16:30:00', '2024-05-25 16:30:00');

-- INSERT: course_wishlist (6 records)
INSERT INTO course_wishlist (wishlist_id, user_id, course_id, created_at) VALUES
(1, 3, 2, '2024-02-01 10:00:00'),
(2, 4, 3, '2024-02-15 14:30:00'),
(3, 5, 1, '2024-03-01 16:00:00'),
(4, 6, 4, '2024-03-15 12:00:00'),
(5, 7, 4, '2024-04-01 09:30:00'),
(6, 8, 1, '2024-04-15 11:00:00');

-- INSERT: coupons (5 coupons)
INSERT INTO coupons (coupon_id, code, name, description, discount_type, discount_value, minimum_amount, max_uses, used_count, max_uses_per_user, valid_from, valid_until, is_active, applicable_courses, applicable_categories, created_at, updated_at) VALUES
(1, 'WELCOME20', 'Chào mừng 20%', 'Giảm 20% cho khách hàng mới', 'percentage', 20.00, 0.00, 100, 15, 1, '2024-01-01 00:00:00', '2024-12-31 23:59:59', TRUE, '[1,2,3,4]', '[1,2,3,4,5]', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(2, 'STUDENT50', 'Sinh viên 50%', 'Giảm 50% cho sinh viên', 'percentage', 50.00, 0.00, 200, 45, 1, '2024-01-01 00:00:00', '2024-12-31 23:59:59', TRUE, '[1,3,4]', '[1,3,4,5]', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(3, 'BUSINESS100', 'Thương mại 100k', 'Giảm 100k cho khóa thương mại', 'fixed_amount', 100000.00, 500000.00, 50, 8, 1, '2024-01-01 00:00:00', '2024-12-31 23:59:59', TRUE, '[2]', '[2]', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(4, 'TOEIC30', 'TOEIC 30%', 'Giảm 30% cho khóa TOEIC', 'percentage', 30.00, 0.00, 100, 25, 1, '2024-01-01 00:00:00', '2024-12-31 23:59:59', TRUE, '[3]', '[3]', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(5, 'KIDSFREE', 'Trẻ em miễn phí', 'Miễn phí khóa trẻ em', 'fixed_amount', 199000.00, 199000.00, 30, 12, 1, '2024-01-01 00:00:00', '2024-12-31 23:59:59', TRUE, '[4]', '[5]', '2024-01-01 00:00:00', '2024-12-01 00:00:00');

-- INSERT: course_coupons (8 records)
INSERT INTO course_coupons (course_coupon_id, course_id, coupon_id, created_at) VALUES
(1, 1, 1, '2024-01-01 00:00:00'),
(2, 1, 2, '2024-01-01 00:00:00'),
(3, 2, 1, '2024-01-01 00:00:00'),
(4, 2, 3, '2024-01-01 00:00:00'),
(5, 3, 1, '2024-01-01 00:00:00'),
(6, 3, 2, '2024-01-01 00:00:00'),
(7, 3, 4, '2024-01-01 00:00:00'),
(8, 4, 1, '2024-01-01 00:00:00'),
(9, 4, 2, '2024-01-01 00:00:00'),
(10, 4, 5, '2024-01-01 00:00:00');

-- INSERT: course_certificates (4 records)
INSERT INTO course_certificates (certificate_id, user_id, course_id, enrollment_id, certificate_number, issued_date, certificate_url, certificate_template, created_at) VALUES
(1, 6, 2, 4, 'CERT-BUS-2024-001', '2024-11-15 12:00:00', 'https://example.com/certificates/cert-bus-2024-001.pdf', 'business_template', '2024-11-15 12:00:00'),
(2, 5, 4, 9, 'CERT-KIDS-2024-001', '2024-11-20 14:00:00', 'https://example.com/certificates/cert-kids-2024-001.pdf', 'kids_template', '2024-11-20 14:00:00');

-- INSERT: course_tags (6 tags)
INSERT INTO course_tags (tag_id, name, color, created_at) VALUES
(1, 'Giao Tiếp', '#FF6B6B', '2024-01-01 00:00:00'),
(2, 'Thương Mại', '#4ECDC4', '2024-01-01 00:00:00'),
(3, 'TOEIC', '#45B7D1', '2024-01-01 00:00:00'),
(4, 'IELTS', '#96CEB4', '2024-01-01 00:00:00'),
(5, 'Trẻ Em', '#FFEAA7', '2024-01-01 00:00:00'),
(6, 'Cơ Bản', '#DDA0DD', '2024-01-01 00:00:00');

-- INSERT: course_tag_relations (12+ records)
INSERT INTO course_tag_relations (course_tag_relation_id, course_id, tag_id, created_at) VALUES
(1, 1, 1, '2024-01-01 00:00:00'),
(2, 1, 6, '2024-01-01 00:00:00'),
(3, 2, 2, '2024-01-01 00:00:00'),
(4, 3, 3, '2024-01-01 00:00:00'),
(5, 4, 5, '2024-01-01 00:00:00'),
(6, 4, 6, '2024-01-01 00:00:00'),
(7, 1, 6, '2024-01-01 00:00:00'),
(8, 2, 1, '2024-01-01 00:00:00'),
(9, 3, 1, '2024-01-01 00:00:00'),
(10, 4, 1, '2024-01-01 00:00:00'),
(11, 2, 6, '2024-01-01 00:00:00'),
(12, 3, 6, '2024-01-01 00:00:00');

-- =============================================
-- EXAM MODULE
-- =============================================

-- INSERT: exam_categories (4 records)
INSERT INTO exam_categories (exam_category_id, name, description, icon, created_at, updated_at) VALUES
(1, 'TOEIC', 'Test of English for International Communication', 'fas fa-headphones', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(2, 'IELTS', 'International English Language Testing System', 'fas fa-globe', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(3, 'HSK', 'Hanyu Shuiping Kaoshi - Chinese Proficiency Test', 'fas fa-language', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(4, 'THPT', 'Thi Tốt Nghiệp Trung Học Phổ Thông', 'fas fa-graduation-cap', '2024-01-01 00:00:00', '2024-12-01 00:00:00');

-- INSERT: tests (4 tests, one per exam type)
INSERT INTO tests (test_id, title, description, exam_type, total_duration, total_questions, total_parts, difficulty_level, created_by, created_at, updated_at) VALUES
(1, 'TOEIC Practice Test 1', 'Đề thi TOEIC thực hành số 1 với đầy đủ 7 phần', 'TOEIC', 120, 200, 7, 'MEDIUM', 1, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(2, 'IELTS Academic Test 1', 'Đề thi IELTS Academic thực hành số 1', 'IELTS', 180, 40, 4, 'HARD', 1, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(3, 'HSK Level 3 Practice', 'Đề thi HSK cấp độ 3 thực hành', 'HSK', 90, 80, 3, 'MEDIUM', 1, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(4, 'THPT English Test 2024', 'Đề thi tiếng Anh THPT năm 2024', 'THPT', 60, 50, 4, 'EASY', 1, '2024-01-01 00:00:00', '2024-12-01 00:00:00');

-- INSERT: test_categories (4 records)
INSERT INTO test_categories (test_category_id, test_id, exam_category_id, created_at) VALUES
(1, 1, 1, '2024-01-01 00:00:00'),
(2, 2, 2, '2024-01-01 00:00:00'),
(3, 3, 3, '2024-01-01 00:00:00'),
(4, 4, 4, '2024-01-01 00:00:00');

-- INSERT: parts (12+ parts, 3-4 per test)
INSERT INTO parts (part_id, test_id, part_number, part_name, part_type, question_count, duration_minutes, description, display_template, created_at, updated_at) VALUES
-- TOEIC Test 1 (7 parts)
(1, 1, 1, 'Part 1: Photographs', 'LISTENING', 6, 5, 'Mô tả hình ảnh', 'PHOTO_AUDIO', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(2, 1, 2, 'Part 2: Question-Response', 'LISTENING', 25, 8, 'Hỏi đáp', 'AUDIO_ONLY', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(3, 1, 3, 'Part 3: Conversations', 'LISTENING', 39, 15, 'Đối thoại', 'AUDIO_ONLY', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(4, 1, 4, 'Part 4: Talks', 'LISTENING', 30, 12, 'Bài nói', 'AUDIO_ONLY', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(5, 1, 5, 'Part 5: Incomplete Sentences', 'READING', 30, 15, 'Hoàn thành câu', 'TEXT_ONLY', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(6, 1, 6, 'Part 6: Text Completion', 'READING', 16, 10, 'Hoàn thành đoạn văn', 'TEXT_ONLY', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(7, 1, 7, 'Part 7: Reading Comprehension', 'READING', 54, 55, 'Đọc hiểu', 'TEXT_ONLY', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),

-- IELTS Test 1 (4 parts)
(8, 2, 1, 'Listening', 'LISTENING', 40, 30, 'Nghe hiểu', 'AUDIO_ONLY', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(9, 2, 2, 'Reading', 'READING', 40, 60, 'Đọc hiểu', 'TEXT_ONLY', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(10, 2, 3, 'Writing', 'READING', 2, 60, 'Viết', 'TEXT_ONLY', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(11, 2, 4, 'Speaking', 'LISTENING', 3, 15, 'Nói', 'AUDIO_ONLY', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),

-- HSK Test 1 (3 parts)
(12, 3, 1, 'Listening', 'LISTENING', 40, 35, 'Nghe hiểu', 'AUDIO_ONLY', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(13, 3, 2, 'Reading', 'READING', 30, 30, 'Đọc hiểu', 'TEXT_ONLY', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(14, 3, 3, 'Writing', 'READING', 10, 25, 'Viết', 'TEXT_ONLY', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),

-- THPT Test 1 (4 parts)
(15, 4, 1, 'Pronunciation', 'READING', 5, 5, 'Phát âm', 'TEXT_ONLY', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(16, 4, 2, 'Grammar', 'READING', 15, 15, 'Ngữ pháp', 'TEXT_ONLY', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(17, 4, 3, 'Vocabulary', 'READING', 10, 10, 'Từ vựng', 'TEXT_ONLY', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(18, 4, 4, 'Reading Comprehension', 'READING', 20, 30, 'Đọc hiểu', 'TEXT_ONLY', '2024-01-01 00:00:00', '2024-12-01 00:00:00');

-- INSERT: questions (60+ questions, 5+ per part)
INSERT INTO questions (question_id, part_id, question_number, question_text, question_type, audio_file, image_file, transcript, explanation, grammar_notes, created_at, updated_at) VALUES
-- TOEIC Part 1 Questions (6 questions)
(1, 1, 1, 'Look at the picture. What do you see?', 'MULTIPLE_CHOICE', 'https://example.com/audio/toeic_part1_q1.mp3', 'https://example.com/images/toeic_part1_q1.jpg', 'A man is sitting at a desk.', 'The correct answer describes what is actually happening in the picture.', 'Present continuous tense', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(2, 1, 2, 'What is happening in this picture?', 'MULTIPLE_CHOICE', 'https://example.com/audio/toeic_part1_q2.mp3', 'https://example.com/images/toeic_part1_q2.jpg', 'People are having a meeting.', 'Focus on the main action in the picture.', 'Present continuous tense', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(3, 1, 3, 'Describe what you see.', 'MULTIPLE_CHOICE', 'https://example.com/audio/toeic_part1_q3.mp3', 'https://example.com/images/toeic_part1_q3.jpg', 'A woman is talking on the phone.', 'Look for the most obvious action.', 'Present continuous tense', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(4, 1, 4, 'What is the man doing?', 'MULTIPLE_CHOICE', 'https://example.com/audio/toeic_part1_q4.mp3', 'https://example.com/images/toeic_part1_q4.jpg', 'The man is reading a newspaper.', 'Focus on the specific person mentioned.', 'Present continuous tense', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(5, 1, 5, 'What can you see in the picture?', 'MULTIPLE_CHOICE', 'https://example.com/audio/toeic_part1_q5.mp3', 'https://example.com/images/toeic_part1_q5.jpg', 'There are many cars on the street.', 'Describe the general scene.', 'There is/are structure', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(6, 1, 6, 'What is the weather like?', 'MULTIPLE_CHOICE', 'https://example.com/audio/toeic_part1_q6.mp3', 'https://example.com/images/toeic_part1_q6.jpg', 'It is sunny and bright.', 'Look for weather indicators in the picture.', 'Weather vocabulary', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),

-- TOEIC Part 2 Questions (5 questions)
(7, 2, 1, 'Where is the meeting room?', 'MULTIPLE_CHOICE', 'https://example.com/audio/toeic_part2_q1.mp3', NULL, 'Where is the meeting room?', 'This is a "where" question asking for location.', 'Question words: where', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(8, 2, 2, 'When will the project be finished?', 'MULTIPLE_CHOICE', 'https://example.com/audio/toeic_part2_q2.mp3', NULL, 'When will the project be finished?', 'This is a "when" question asking for time.', 'Question words: when', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(9, 2, 3, 'Who is responsible for this task?', 'MULTIPLE_CHOICE', 'https://example.com/audio/toeic_part2_q3.mp3', NULL, 'Who is responsible for this task?', 'This is a "who" question asking for a person.', 'Question words: who', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(10, 2, 4, 'How much does this cost?', 'MULTIPLE_CHOICE', 'https://example.com/audio/toeic_part2_q4.mp3', NULL, 'How much does this cost?', 'This is a "how much" question asking for price.', 'Question words: how much', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(11, 2, 5, 'Why did you choose this option?', 'MULTIPLE_CHOICE', 'https://example.com/audio/toeic_part2_q5.mp3', NULL, 'Why did you choose this option?', 'This is a "why" question asking for reason.', 'Question words: why', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),

-- TOEIC Part 5 Questions (5 questions)
(12, 5, 1, 'The meeting will be held _____ the conference room.', 'MULTIPLE_CHOICE', NULL, NULL, 'The meeting will be held in the conference room.', 'Use "in" for enclosed spaces like rooms.', 'Prepositions: in, on, at', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(13, 5, 2, 'She _____ her presentation yesterday.', 'MULTIPLE_CHOICE', NULL, NULL, 'She gave her presentation yesterday.', 'Use past tense for actions completed in the past.', 'Past tense verbs', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(14, 5, 3, 'The company _____ a new policy last month.', 'MULTIPLE_CHOICE', NULL, NULL, 'The company implemented a new policy last month.', 'Use past tense with time expressions like "last month".', 'Past tense with time expressions', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(15, 5, 4, 'We need to _____ the budget for next year.', 'MULTIPLE_CHOICE', NULL, NULL, 'We need to review the budget for next year.', 'Use infinitive after "need to".', 'Modal verbs: need to', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(16, 5, 5, 'The report _____ by the manager.', 'MULTIPLE_CHOICE', NULL, NULL, 'The report was written by the manager.', 'Use passive voice when the subject receives the action.', 'Passive voice', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),

-- IELTS Questions (5 questions)
(17, 8, 1, 'Listen to the conversation and answer the question.', 'MULTIPLE_CHOICE', 'https://example.com/audio/ielts_listening_q1.mp3', NULL, 'Man: Excuse me, where is the library? Woman: It is on the second floor, next to the cafeteria.', 'Listen for specific information about location.', 'Location vocabulary', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(18, 9, 1, 'Read the passage and answer the question.', 'READING_COMPREHENSION', NULL, NULL, 'Climate change is one of the most pressing issues of our time. It affects every aspect of human life and the environment.', 'Look for the main idea in the first paragraph.', 'Reading comprehension strategies', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(19, 10, 1, 'Write an essay about the following topic.', 'FILL_BLANK', NULL, NULL, 'Some people believe that technology has made our lives easier, while others think it has made them more complicated.', 'Structure your essay with introduction, body paragraphs, and conclusion.', 'Essay writing structure', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(20, 11, 1, 'Describe your hometown.', 'MULTIPLE_CHOICE', 'https://example.com/audio/ielts_speaking_q1.mp3', NULL, 'Describe your hometown.', 'Use descriptive adjectives and provide specific details.', 'Descriptive vocabulary', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),

-- HSK Questions (5 questions)
(21, 12, 1, 'Listen and choose the correct answer.', 'MULTIPLE_CHOICE', 'https://example.com/audio/hsk_listening_q1.mp3', NULL, '你好，请问现在几点了？', 'Listen for time-related vocabulary.', 'Time vocabulary in Chinese', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(22, 13, 1, 'Read the Chinese text and answer.', 'READING_COMPREHENSION', NULL, NULL, '今天天气很好，我们去公园散步吧。', 'Understand the meaning of weather and activity vocabulary.', 'Weather and activity vocabulary', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(23, 14, 1, 'Complete the sentence with the correct character.', 'FILL_BLANK', NULL, NULL, '我每天____学校学习。', 'Use the correct verb for "go to school".', 'Common Chinese verbs', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),

-- THPT Questions (5 questions)
(24, 15, 1, 'Choose the word that has the underlined part pronounced differently.', 'MULTIPLE_CHOICE', NULL, NULL, 'A. cat B. hat C. bat D. gate', 'Look for the word with a different vowel sound.', 'Vowel pronunciation', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(25, 16, 1, 'Choose the correct answer to complete the sentence.', 'MULTIPLE_CHOICE', NULL, NULL, 'If I _____ you, I would study harder.', 'Use "were" in second conditional sentences.', 'Second conditional', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(26, 17, 1, 'Choose the word that is closest in meaning to the underlined word.', 'MULTIPLE_CHOICE', NULL, NULL, 'The weather is very hot today.', 'Find a synonym for "hot".', 'Synonyms and vocabulary', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(27, 18, 1, 'Read the passage and choose the best answer.', 'READING_COMPREHENSION', NULL, NULL, 'The Internet has revolutionized the way we communicate and access information.', 'Look for the main idea of the passage.', 'Reading comprehension', '2024-01-01 00:00:00', '2024-12-01 00:00:00');

-- INSERT: choices (240+ choices, 4 per question with 1 correct)
INSERT INTO choices (choice_id, question_id, choice_letter, choice_text, choice_translation, choice_explanation, is_correct, created_at, updated_at) VALUES
-- TOEIC Part 1 Choices (24 choices for 6 questions)
(1, 1, 'A', 'A man is sitting at a desk.', 'Một người đàn ông đang ngồi ở bàn.', 'This correctly describes the main action in the picture.', TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(2, 1, 'B', 'A woman is standing by the window.', 'Một người phụ nữ đang đứng bên cửa sổ.', 'This does not match what is shown in the picture.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(3, 1, 'C', 'People are eating lunch.', 'Mọi người đang ăn trưa.', 'This is not what is happening in the picture.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(4, 1, 'D', 'The room is empty.', 'Căn phòng trống.', 'This is incorrect as there is a person in the picture.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),

(5, 2, 'A', 'People are having a meeting.', 'Mọi người đang họp.', 'This correctly describes the scene in the picture.', TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(6, 2, 'B', 'People are having lunch.', 'Mọi người đang ăn trưa.', 'This is not what is happening in the picture.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(7, 2, 'C', 'People are playing games.', 'Mọi người đang chơi game.', 'This is not what is happening in the picture.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(8, 2, 'D', 'People are sleeping.', 'Mọi người đang ngủ.', 'This is not what is happening in the picture.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),

(9, 3, 'A', 'A woman is talking on the phone.', 'Một người phụ nữ đang nói chuyện điện thoại.', 'This correctly describes the main action.', TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(10, 3, 'B', 'A woman is reading a book.', 'Một người phụ nữ đang đọc sách.', 'This is not what is happening in the picture.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(11, 3, 'C', 'A woman is cooking.', 'Một người phụ nữ đang nấu ăn.', 'This is not what is happening in the picture.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(12, 3, 'D', 'A woman is sleeping.', 'Một người phụ nữ đang ngủ.', 'This is not what is happening in the picture.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),

(13, 4, 'A', 'The man is reading a newspaper.', 'Người đàn ông đang đọc báo.', 'This correctly describes what the man is doing.', TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(14, 4, 'B', 'The man is watching TV.', 'Người đàn ông đang xem TV.', 'This is not what is happening in the picture.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(15, 4, 'C', 'The man is eating.', 'Người đàn ông đang ăn.', 'This is not what is happening in the picture.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(16, 4, 'D', 'The man is sleeping.', 'Người đàn ông đang ngủ.', 'This is not what is happening in the picture.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),

(17, 5, 'A', 'There are many cars on the street.', 'Có nhiều xe ô tô trên đường.', 'This correctly describes the scene.', TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(18, 5, 'B', 'The street is empty.', 'Đường phố trống.', 'This is not what is shown in the picture.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(19, 5, 'C', 'There are many people walking.', 'Có nhiều người đi bộ.', 'This is not the main focus of the picture.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(20, 5, 'D', 'There are many bicycles.', 'Có nhiều xe đạp.', 'This is not what is shown in the picture.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),

(21, 6, 'A', 'It is sunny and bright.', 'Trời nắng và sáng.', 'This correctly describes the weather in the picture.', TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(22, 6, 'B', 'It is raining.', 'Trời đang mưa.', 'This is not what is shown in the picture.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(23, 6, 'C', 'It is cloudy.', 'Trời có mây.', 'This is not what is shown in the picture.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(24, 6, 'D', 'It is snowing.', 'Trời đang tuyết.', 'This is not what is shown in the picture.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),

-- TOEIC Part 2 Choices (20 choices for 5 questions)
(25, 7, 'A', 'It is on the second floor.', 'Nó ở tầng hai.', 'This correctly answers the "where" question.', TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(26, 7, 'B', 'It starts at 2 PM.', 'Nó bắt đầu lúc 2 giờ chiều.', 'This answers "when", not "where".', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(27, 7, 'C', 'Yes, I will attend.', 'Có, tôi sẽ tham dự.', 'This is not a location answer.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(28, 7, 'D', 'The meeting is cancelled.', 'Cuộc họp bị hủy.', 'This does not answer the location question.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),

(29, 8, 'A', 'Next Monday.', 'Thứ Hai tuần sau.', 'This correctly answers the "when" question.', TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(30, 8, 'B', 'In the conference room.', 'Trong phòng hội nghị.', 'This answers "where", not "when".', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(31, 8, 'C', 'Yes, it is finished.', 'Có, nó đã hoàn thành.', 'This is not a time answer.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(32, 8, 'D', 'The project is delayed.', 'Dự án bị trễ.', 'This does not answer the time question.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),

(33, 9, 'A', 'John Smith.', 'John Smith.', 'This correctly answers the "who" question.', TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(34, 9, 'B', 'Tomorrow morning.', 'Sáng mai.', 'This answers "when", not "who".', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(35, 9, 'C', 'Yes, I am responsible.', 'Có, tôi có trách nhiệm.', 'This is not a specific person answer.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(36, 9, 'D', 'The task is completed.', 'Nhiệm vụ đã hoàn thành.', 'This does not answer the "who" question.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),

(37, 10, 'A', 'It costs $50.', 'Nó có giá 50 đô la.', 'This correctly answers the "how much" question.', TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(38, 10, 'B', 'It is very expensive.', 'Nó rất đắt.', 'This is not a specific price answer.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(39, 10, 'C', 'Yes, I will buy it.', 'Có, tôi sẽ mua nó.', 'This is not a price answer.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(40, 10, 'D', 'The price is negotiable.', 'Giá có thể thương lượng.', 'This does not give a specific amount.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),

(41, 11, 'A', 'Because it is more efficient.', 'Vì nó hiệu quả hơn.', 'This correctly answers the "why" question.', TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(42, 11, 'B', 'Yes, I chose it.', 'Có, tôi đã chọn nó.', 'This is not a reason answer.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(43, 11, 'C', 'Last week.', 'Tuần trước.', 'This answers "when", not "why".', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(44, 11, 'D', 'In the office.', 'Trong văn phòng.', 'This answers "where", not "why".', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),

-- TOEIC Part 5 Choices (20 choices for 5 questions)
(45, 12, 'A', 'in', 'trong', 'Use "in" for enclosed spaces like rooms.', TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(46, 12, 'B', 'on', 'trên', 'Use "on" for surfaces, not enclosed spaces.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(47, 12, 'C', 'at', 'tại', 'Use "at" for specific points, not enclosed spaces.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(48, 12, 'D', 'by', 'bên cạnh', 'Use "by" for proximity, not location.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),

(49, 13, 'A', 'gives', 'cho', 'This is present tense, but we need past tense.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(50, 13, 'B', 'gave', 'đã cho', 'This is the correct past tense form.', TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(51, 13, 'C', 'will give', 'sẽ cho', 'This is future tense, but we need past tense.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(52, 13, 'D', 'is giving', 'đang cho', 'This is present continuous, but we need past tense.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),

(53, 14, 'A', 'implements', 'thực hiện', 'This is present tense, but we need past tense.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(54, 14, 'B', 'implemented', 'đã thực hiện', 'This is the correct past tense form.', TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(55, 14, 'C', 'will implement', 'sẽ thực hiện', 'This is future tense, but we need past tense.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(56, 14, 'D', 'is implementing', 'đang thực hiện', 'This is present continuous, but we need past tense.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),

(57, 15, 'A', 'review', 'xem xét', 'This is the correct infinitive form after "need to".', TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(58, 15, 'B', 'reviewed', 'đã xem xét', 'This is past tense, but we need infinitive.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(59, 15, 'C', 'reviewing', 'đang xem xét', 'This is present participle, but we need infinitive.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(60, 15, 'D', 'reviews', 'xem xét', 'This is present tense, but we need infinitive.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),

(61, 16, 'A', 'writes', 'viết', 'This is active voice, but we need passive voice.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(62, 16, 'B', 'wrote', 'đã viết', 'This is active voice past tense, but we need passive voice.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(63, 16, 'C', 'was written', 'đã được viết', 'This is the correct passive voice form.', TRUE, '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(64, 16, 'D', 'is writing', 'đang viết', 'This is active voice present continuous, but we need passive voice.', FALSE, '2024-01-01 00:00:00', '2024-12-01 00:00:00');

-- INSERT: exam_tags (8 tags)
INSERT INTO exam_tags (exam_tag_id, name, description, created_at, updated_at) VALUES
(1, '[Part 1] Mô tả hình ảnh', 'Câu hỏi về mô tả hình ảnh trong TOEIC Part 1', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(2, '[Part 2] Hỏi đáp', 'Câu hỏi hỏi đáp trong TOEIC Part 2', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(3, '[Part 5] Ngữ pháp', 'Câu hỏi ngữ pháp trong TOEIC Part 5', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(4, '[IELTS] Listening', 'Câu hỏi nghe hiểu trong IELTS', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(5, '[IELTS] Reading', 'Câu hỏi đọc hiểu trong IELTS', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(6, '[HSK] Nghe hiểu', 'Câu hỏi nghe hiểu trong HSK', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(7, '[THPT] Phát âm', 'Câu hỏi phát âm trong THPT', '2024-01-01 00:00:00', '2024-12-01 00:00:00'),
(8, '[THPT] Ngữ pháp', 'Câu hỏi ngữ pháp trong THPT', '2024-01-01 00:00:00', '2024-12-01 00:00:00');

-- INSERT: question_tags (30+ records)
INSERT INTO question_tags (question_tag_id, question_id, exam_tag_id, created_at) VALUES
-- TOEIC Part 1 questions tagged
(1, 1, 1, '2024-01-01 00:00:00'),
(2, 2, 1, '2024-01-01 00:00:00'),
(3, 3, 1, '2024-01-01 00:00:00'),
(4, 4, 1, '2024-01-01 00:00:00'),
(5, 5, 1, '2024-01-01 00:00:00'),
(6, 6, 1, '2024-01-01 00:00:00'),

-- TOEIC Part 2 questions tagged
(7, 7, 2, '2024-01-01 00:00:00'),
(8, 8, 2, '2024-01-01 00:00:00'),
(9, 9, 2, '2024-01-01 00:00:00'),
(10, 10, 2, '2024-01-01 00:00:00'),
(11, 11, 2, '2024-01-01 00:00:00'),

-- TOEIC Part 5 questions tagged
(12, 12, 3, '2024-01-01 00:00:00'),
(13, 13, 3, '2024-01-01 00:00:00'),
(14, 14, 3, '2024-01-01 00:00:00'),
(15, 15, 3, '2024-01-01 00:00:00'),
(16, 16, 3, '2024-01-01 00:00:00'),

-- IELTS questions tagged
(17, 17, 4, '2024-01-01 00:00:00'),
(18, 18, 5, '2024-01-01 00:00:00'),
(19, 19, 5, '2024-01-01 00:00:00'),
(20, 20, 4, '2024-01-01 00:00:00'),

-- HSK questions tagged
(21, 21, 6, '2024-01-01 00:00:00'),
(22, 22, 6, '2024-01-01 00:00:00'),
(23, 23, 6, '2024-01-01 00:00:00'),

-- THPT questions tagged
(24, 24, 7, '2024-01-01 00:00:00'),
(25, 25, 8, '2024-01-01 00:00:00'),
(26, 26, 8, '2024-01-01 00:00:00'),
(27, 27, 8, '2024-01-01 00:00:00');

-- INSERT: exam_sessions (12 sessions)
INSERT INTO exam_sessions (exam_session_id, user_id, test_id, session_type, start_time, end_time, duration_seconds, total_score, correct_answers, wrong_answers, skipped_answers, status, selected_parts, time_limit_minutes, created_at, updated_at) VALUES
(1, 3, 1, 'FULL_TEST', '2024-02-01 10:00:00', '2024-02-01 12:00:00', 7200, 850, 170, 25, 5, 'COMPLETED', NULL, 120, '2024-02-01 10:00:00', '2024-02-01 12:00:00'),
(2, 4, 1, 'PRACTICE', '2024-02-15 14:30:00', '2024-02-15 15:30:00', 3600, 420, 84, 16, 0, 'COMPLETED', '["1","2","5"]', 60, '2024-02-15 14:30:00', '2024-02-15 15:30:00'),
(3, 5, 2, 'FULL_TEST', '2024-03-01 16:00:00', '2024-03-01 19:00:00', 10800, 7.5, 30, 8, 2, 'COMPLETED', NULL, 180, '2024-03-01 16:00:00', '2024-03-01 19:00:00'),
(4, 6, 2, 'PRACTICE', '2024-03-15 12:00:00', '2024-03-15 13:00:00', 3600, 6.0, 24, 12, 4, 'COMPLETED', '["1","2"]', 60, '2024-03-15 12:00:00', '2024-03-15 13:00:00'),
(5, 7, 3, 'FULL_TEST', '2024-04-01 09:30:00', '2024-04-01 11:00:00', 5400, 180, 72, 6, 2, 'COMPLETED', NULL, 90, '2024-04-01 09:30:00', '2024-04-01 11:00:00'),
(6, 8, 3, 'PRACTICE', '2024-04-15 11:00:00', '2024-04-15 12:00:00', 3600, 120, 48, 8, 4, 'COMPLETED', '["1","2"]', 60, '2024-04-15 11:00:00', '2024-04-15 12:00:00'),
(7, 3, 4, 'FULL_TEST', '2024-05-01 15:00:00', '2024-05-01 16:00:00', 3600, 45, 40, 8, 2, 'COMPLETED', NULL, 60, '2024-05-01 15:00:00', '2024-05-01 16:00:00'),
(8, 4, 4, 'PRACTICE', '2024-05-15 16:30:00', '2024-05-15 17:00:00', 1800, 22, 20, 3, 2, 'COMPLETED', '["1","2"]', 30, '2024-05-15 16:30:00', '2024-05-15 17:00:00'),
(9, 5, 1, 'REVIEW', '2024-06-01 14:00:00', '2024-06-01 15:00:00', 3600, 0, 0, 0, 0, 'IN_PROGRESS', NULL, 60, '2024-06-01 14:00:00', '2024-06-01 14:00:00'),
(10, 6, 3, 'FULL_TEST', '2024-06-15 10:00:00', '2024-06-15 11:30:00', 5400, 200, 80, 0, 0, 'COMPLETED', NULL, 90, '2024-06-15 10:00:00', '2024-06-15 11:30:00'),
(11, 7, 2, 'PRACTICE', '2024-07-01 11:30:00', '2024-07-01 12:30:00', 3600, 5.5, 22, 15, 3, 'COMPLETED', '["1","3"]', 60, '2024-07-01 11:30:00', '2024-07-01 12:30:00'),
(12, 8, 4, 'FULL_TEST', '2024-07-15 13:45:00', '2024-07-15 14:45:00', 3600, 48, 45, 3, 2, 'COMPLETED', NULL, 60, '2024-07-15 13:45:00', '2024-07-15 14:45:00');

-- INSERT: user_answers (150+ answers)
INSERT INTO user_answers (user_answer_id, exam_session_id, question_id, selected_choice_id, answer_time, is_correct, created_at) VALUES
-- User 3 TOEIC Test 1 answers (some correct, some wrong, some skipped)
(1, 1, 1, 1, '2024-02-01 10:05:00', TRUE, '2024-02-01 10:05:00'),
(2, 1, 2, 5, '2024-02-01 10:08:00', TRUE, '2024-02-01 10:08:00'),
(3, 1, 3, 9, '2024-02-01 10:12:00', TRUE, '2024-02-01 10:12:00'),
(4, 1, 4, 13, '2024-02-01 10:15:00', TRUE, '2024-02-01 10:15:00'),
(5, 1, 5, 17, '2024-02-01 10:18:00', TRUE, '2024-02-01 10:18:00'),
(6, 1, 6, 21, '2024-02-01 10:22:00', TRUE, '2024-02-01 10:22:00'),
(7, 1, 7, 25, '2024-02-01 10:25:00', TRUE, '2024-02-01 10:25:00'),
(8, 1, 8, 29, '2024-02-01 10:28:00', TRUE, '2024-02-01 10:28:00'),
(9, 1, 9, 33, '2024-02-01 10:32:00', TRUE, '2024-02-01 10:32:00'),
(10, 1, 10, 37, '2024-02-01 10:35:00', TRUE, '2024-02-01 10:35:00'),
(11, 1, 11, 41, '2024-02-01 10:38:00', TRUE, '2024-02-01 10:38:00'),
(12, 1, 12, 45, '2024-02-01 10:45:00', TRUE, '2024-02-01 10:45:00'),
(13, 1, 13, 50, '2024-02-01 10:48:00', TRUE, '2024-02-01 10:48:00'),
(14, 1, 14, 54, '2024-02-01 10:52:00', TRUE, '2024-02-01 10:52:00'),
(15, 1, 15, 57, '2024-02-01 10:55:00', TRUE, '2024-02-01 10:55:00'),
(16, 1, 16, 63, '2024-02-01 10:58:00', TRUE, '2024-02-01 10:58:00'),

-- User 4 TOEIC Test 1 Practice answers
(17, 2, 1, 1, '2024-02-15 14:35:00', TRUE, '2024-02-15 14:35:00'),
(18, 2, 2, 5, '2024-02-15 14:38:00', TRUE, '2024-02-15 14:38:00'),
(19, 2, 3, 9, '2024-02-15 14:42:00', TRUE, '2024-02-15 14:42:00'),
(20, 2, 4, 13, '2024-02-15 14:45:00', TRUE, '2024-02-15 14:45:00'),
(21, 2, 5, 17, '2024-02-15 14:48:00', TRUE, '2024-02-15 14:48:00'),
(22, 2, 6, 21, '2024-02-15 14:52:00', TRUE, '2024-02-15 14:52:00'),
(23, 2, 7, 25, '2024-02-15 14:55:00', TRUE, '2024-02-15 14:55:00'),
(24, 2, 8, 29, '2024-02-15 14:58:00', TRUE, '2024-02-15 14:58:00'),
(25, 2, 9, 33, '2024-02-15 15:02:00', TRUE, '2024-02-15 15:02:00'),
(26, 2, 10, 37, '2024-02-15 15:05:00', TRUE, '2024-02-15 15:05:00'),
(27, 2, 11, 41, '2024-02-15 15:08:00', TRUE, '2024-02-15 15:08:00'),
(28, 2, 12, 45, '2024-02-15 15:15:00', TRUE, '2024-02-15 15:15:00'),
(29, 2, 13, 50, '2024-02-15 15:18:00', TRUE, '2024-02-15 15:18:00'),
(30, 2, 14, 54, '2024-02-15 15:22:00', TRUE, '2024-02-15 15:22:00'),
(31, 2, 15, 57, '2024-02-15 15:25:00', TRUE, '2024-02-15 15:25:00'),
(32, 2, 16, 63, '2024-02-15 15:28:00', TRUE, '2024-02-15 15:28:00'),

-- User 5 IELTS Test 1 answers
(33, 3, 17, NULL, '2024-03-01 16:10:00', TRUE, '2024-03-01 16:10:00'),
(34, 3, 18, NULL, '2024-03-01 16:15:00', TRUE, '2024-03-01 16:15:00'),
(35, 3, 19, NULL, '2024-03-01 16:20:00', TRUE, '2024-03-01 16:20:00'),
(36, 3, 20, NULL, '2024-03-01 16:25:00', TRUE, '2024-03-01 16:25:00'),

-- User 6 IELTS Test 1 Practice answers
(37, 4, 17, NULL, '2024-03-15 12:10:00', TRUE, '2024-03-15 12:10:00'),
(38, 4, 18, NULL, '2024-03-15 12:15:00', TRUE, '2024-03-15 12:15:00'),
(39, 4, 19, NULL, '2024-03-15 12:20:00', TRUE, '2024-03-15 12:20:00'),
(40, 4, 20, NULL, '2024-03-15 12:25:00', TRUE, '2024-03-15 12:25:00'),

-- User 7 HSK Test 1 answers
(41, 5, 21, NULL, '2024-04-01 09:40:00', TRUE, '2024-04-01 09:40:00'),
(42, 5, 22, NULL, '2024-04-01 09:45:00', TRUE, '2024-04-01 09:45:00'),
(43, 5, 23, NULL, '2024-04-01 09:50:00', TRUE, '2024-04-01 09:50:00'),

-- User 8 HSK Test 1 Practice answers
(44, 6, 21, NULL, '2024-04-15 11:10:00', TRUE, '2024-04-15 11:10:00'),
(45, 6, 22, NULL, '2024-04-15 11:15:00', TRUE, '2024-04-15 11:15:00'),
(46, 6, 23, NULL, '2024-04-15 11:20:00', TRUE, '2024-04-15 11:20:00'),

-- User 3 THPT Test 1 answers
(47, 7, 24, NULL, '2024-05-01 15:10:00', TRUE, '2024-05-01 15:10:00'),
(48, 7, 25, NULL, '2024-05-01 15:15:00', TRUE, '2024-05-01 15:15:00'),
(49, 7, 26, NULL, '2024-05-01 15:20:00', TRUE, '2024-05-01 15:20:00'),
(50, 7, 27, NULL, '2024-05-01 15:25:00', TRUE, '2024-05-01 15:25:00'),

-- User 4 THPT Test 1 Practice answers
(51, 8, 24, NULL, '2024-05-15 16:35:00', TRUE, '2024-05-15 16:35:00'),
(52, 8, 25, NULL, '2024-05-15 16:40:00', TRUE, '2024-05-15 16:40:00'),
(53, 8, 26, NULL, '2024-05-15 16:45:00', TRUE, '2024-05-15 16:45:00'),
(54, 8, 27, NULL, '2024-05-15 16:50:00', TRUE, '2024-05-15 16:50:00'),

-- User 5 TOEIC Test 1 Review (in progress)
(55, 9, 1, NULL, '2024-06-01 14:10:00', NULL, '2024-06-01 14:10:00'),
(56, 9, 2, NULL, '2024-06-01 14:15:00', NULL, '2024-06-01 14:15:00'),

-- User 6 HSK Test 1 Full answers
(57, 10, 21, NULL, '2024-06-15 10:10:00', TRUE, '2024-06-15 10:10:00'),
(58, 10, 22, NULL, '2024-06-15 10:15:00', TRUE, '2024-06-15 10:15:00'),
(59, 10, 23, NULL, '2024-06-15 10:20:00', TRUE, '2024-06-15 10:20:00'),

-- User 7 IELTS Test 1 Practice answers
(60, 11, 17, NULL, '2024-07-01 11:40:00', TRUE, '2024-07-01 11:40:00'),
(61, 11, 18, NULL, '2024-07-01 11:45:00', TRUE, '2024-07-01 11:45:00'),
(62, 11, 19, NULL, '2024-07-01 11:50:00', TRUE, '2024-07-01 11:50:00'),
(63, 11, 20, NULL, '2024-07-01 11:55:00', TRUE, '2024-07-01 11:55:00'),

-- User 8 THPT Test 1 Full answers
(64, 12, 24, NULL, '2024-07-15 13:55:00', TRUE, '2024-07-15 13:55:00'),
(65, 12, 25, NULL, '2024-07-15 14:00:00', TRUE, '2024-07-15 14:00:00'),
(66, 12, 26, NULL, '2024-07-15 14:05:00', TRUE, '2024-07-15 14:05:00'),
(67, 12, 27, NULL, '2024-07-15 14:10:00', TRUE, '2024-07-15 14:10:00');

-- INSERT: user_exam_statistics (6 records)
INSERT INTO user_exam_statistics (user_exam_stat_id, user_id, total_tests_taken, total_questions_answered, total_correct_answers, average_score, best_score, total_study_time_seconds, created_at, updated_at) VALUES
(1, 3, 2, 22, 20, 425.00, 850, 10800, '2024-02-01 10:00:00', '2024-05-01 16:00:00'),
(2, 4, 2, 20, 18, 210.00, 420, 7200, '2024-02-15 14:30:00', '2024-05-15 17:00:00'),
(3, 5, 2, 7, 6, 3.75, 7.5, 14400, '2024-03-01 16:00:00', '2024-06-01 14:00:00'),
(4, 6, 2, 7, 6, 3.00, 6.0, 9000, '2024-03-15 12:00:00', '2024-06-15 11:30:00'),
(5, 7, 2, 7, 6, 2.75, 5.5, 9000, '2024-04-01 09:30:00', '2024-07-01 12:30:00'),
(6, 8, 2, 7, 6, 2.40, 4.8, 7200, '2024-04-15 11:00:00', '2024-07-15 14:45:00');

-- INSERT: part_statistics (30+ records)
INSERT INTO part_statistics (part_stat_id, user_id, part_id, total_attempts, total_questions, correct_answers, accuracy_rate, last_attempt, created_at, updated_at) VALUES
-- User 3 statistics
(1, 3, 1, 2, 12, 12, 100.00, '2024-05-01 15:00:00', '2024-02-01 10:00:00', '2024-05-01 15:00:00'),
(2, 3, 2, 2, 10, 10, 100.00, '2024-05-01 15:00:00', '2024-02-01 10:00:00', '2024-05-01 15:00:00'),
(3, 3, 5, 2, 10, 8, 80.00, '2024-05-01 15:00:00', '2024-02-01 10:00:00', '2024-05-01 15:00:00'),
(4, 3, 15, 1, 5, 5, 100.00, '2024-05-01 15:00:00', '2024-05-01 15:00:00', '2024-05-01 15:00:00'),
(5, 3, 16, 1, 5, 4, 80.00, '2024-05-01 15:00:00', '2024-05-01 15:00:00', '2024-05-01 15:00:00'),
(6, 3, 17, 1, 5, 4, 80.00, '2024-05-01 15:00:00', '2024-05-01 15:00:00', '2024-05-01 15:00:00'),
(7, 3, 18, 1, 5, 4, 80.00, '2024-05-01 15:00:00', '2024-05-01 15:00:00', '2024-05-01 15:00:00'),

-- User 4 statistics
(8, 4, 1, 1, 6, 6, 100.00, '2024-02-15 14:30:00', '2024-02-15 14:30:00', '2024-02-15 14:30:00'),
(9, 4, 2, 1, 5, 5, 100.00, '2024-02-15 14:30:00', '2024-02-15 14:30:00', '2024-02-15 14:30:00'),
(10, 4, 5, 1, 5, 5, 100.00, '2024-02-15 14:30:00', '2024-02-15 14:30:00', '2024-02-15 14:30:00'),
(11, 4, 15, 1, 5, 5, 100.00, '2024-05-15 16:30:00', '2024-05-15 16:30:00', '2024-05-15 16:30:00'),
(12, 4, 16, 1, 5, 4, 80.00, '2024-05-15 16:30:00', '2024-05-15 16:30:00', '2024-05-15 16:30:00'),
(13, 4, 17, 1, 5, 4, 80.00, '2024-05-15 16:30:00', '2024-05-15 16:30:00', '2024-05-15 16:30:00'),
(14, 4, 18, 1, 5, 4, 80.00, '2024-05-15 16:30:00', '2024-05-15 16:30:00', '2024-05-15 16:30:00'),

-- User 5 statistics
(15, 5, 8, 1, 4, 4, 100.00, '2024-03-01 16:00:00', '2024-03-01 16:00:00', '2024-03-01 16:00:00'),
(16, 5, 9, 1, 4, 3, 75.00, '2024-03-01 16:00:00', '2024-03-01 16:00:00', '2024-03-01 16:00:00'),
(17, 5, 10, 1, 4, 3, 75.00, '2024-03-01 16:00:00', '2024-03-01 16:00:00', '2024-03-01 16:00:00'),
(18, 5, 11, 1, 4, 3, 75.00, '2024-03-01 16:00:00', '2024-03-01 16:00:00', '2024-03-01 16:00:00'),
(19, 5, 12, 1, 3, 3, 100.00, '2024-04-01 09:30:00', '2024-04-01 09:30:00', '2024-04-01 09:30:00'),
(20, 5, 13, 1, 3, 3, 100.00, '2024-04-01 09:30:00', '2024-04-01 09:30:00', '2024-04-01 09:30:00'),
(21, 5, 14, 1, 3, 3, 100.00, '2024-04-01 09:30:00', '2024-04-01 09:30:00', '2024-04-01 09:30:00'),

-- User 6 statistics
(22, 6, 8, 1, 4, 4, 100.00, '2024-03-15 12:00:00', '2024-03-15 12:00:00', '2024-03-15 12:00:00'),
(23, 6, 9, 1, 4, 3, 75.00, '2024-03-15 12:00:00', '2024-03-15 12:00:00', '2024-03-15 12:00:00'),
(24, 6, 10, 1, 4, 3, 75.00, '2024-03-15 12:00:00', '2024-03-15 12:00:00', '2024-03-15 12:00:00'),
(25, 6, 11, 1, 4, 3, 75.00, '2024-03-15 12:00:00', '2024-03-15 12:00:00', '2024-03-15 12:00:00'),
(26, 6, 12, 1, 3, 3, 100.00, '2024-06-15 10:00:00', '2024-06-15 10:00:00', '2024-06-15 10:00:00'),
(27, 6, 13, 1, 3, 3, 100.00, '2024-06-15 10:00:00', '2024-06-15 10:00:00', '2024-06-15 10:00:00'),
(28, 6, 14, 1, 3, 3, 100.00, '2024-06-15 10:00:00', '2024-06-15 10:00:00', '2024-06-15 10:00:00'),

-- User 7 statistics
(29, 7, 12, 1, 3, 3, 100.00, '2024-04-01 09:30:00', '2024-04-01 09:30:00', '2024-04-01 09:30:00'),
(30, 7, 13, 1, 3, 3, 100.00, '2024-04-01 09:30:00', '2024-04-01 09:30:00', '2024-04-01 09:30:00'),
(31, 7, 14, 1, 3, 3, 100.00, '2024-04-01 09:30:00', '2024-04-01 09:30:00', '2024-04-01 09:30:00'),
(32, 7, 8, 1, 4, 3, 75.00, '2024-07-01 11:30:00', '2024-07-01 11:30:00', '2024-07-01 11:30:00'),
(33, 7, 9, 1, 4, 3, 75.00, '2024-07-01 11:30:00', '2024-07-01 11:30:00', '2024-07-01 11:30:00'),
(34, 7, 10, 1, 4, 3, 75.00, '2024-07-01 11:30:00', '2024-07-01 11:30:00', '2024-07-01 11:30:00'),
(35, 7, 11, 1, 4, 3, 75.00, '2024-07-01 11:30:00', '2024-07-01 11:30:00', '2024-07-01 11:30:00'),

-- User 8 statistics
(36, 8, 12, 1, 3, 3, 100.00, '2024-04-15 11:00:00', '2024-04-15 11:00:00', '2024-04-15 11:00:00'),
(37, 8, 13, 1, 3, 3, 100.00, '2024-04-15 11:00:00', '2024-04-15 11:00:00', '2024-04-15 11:00:00'),
(38, 8, 14, 1, 3, 3, 100.00, '2024-04-15 11:00:00', '2024-04-15 11:00:00', '2024-04-15 11:00:00'),
(39, 8, 15, 1, 5, 5, 100.00, '2024-07-15 13:45:00', '2024-07-15 13:45:00', '2024-07-15 13:45:00'),
(40, 8, 16, 1, 5, 4, 80.00, '2024-07-15 13:45:00', '2024-07-15 13:45:00', '2024-07-15 13:45:00'),
(41, 8, 17, 1, 5, 4, 80.00, '2024-07-15 13:45:00', '2024-07-15 13:45:00', '2024-07-15 13:45:00'),
(42, 8, 18, 1, 5, 4, 80.00, '2024-07-15 13:45:00', '2024-07-15 13:45:00', '2024-07-15 13:45:00');

-- INSERT: test_discussions (6 records)
INSERT INTO test_discussions (test_discussion_id, test_id, user_id, title, content, created_at, updated_at) VALUES
(1, 1, 3, 'TOEIC Part 1 khó quá', 'Tôi gặp khó khăn trong việc mô tả hình ảnh. Có ai có mẹo nào không?', '2024-02-05 10:00:00', '2024-02-05 10:00:00'),
(2, 1, 4, 'Chiến lược làm Part 5', 'Part 5 có nhiều câu ngữ pháp khó. Các bạn có chiến lược nào hiệu quả không?', '2024-02-20 14:30:00', '2024-02-20 14:30:00'),
(3, 2, 5, 'IELTS Writing Task 2', 'Task 2 của IELTS Writing khó quá. Có ai có template nào hay không?', '2024-03-05 16:00:00', '2024-03-05 16:00:00'),
(4, 2, 6, 'IELTS Listening tips', 'Listening của IELTS có nhiều accent khác nhau. Làm sao để nghe tốt hơn?', '2024-03-20 12:00:00', '2024-03-20 12:00:00'),
(5, 3, 7, 'HSK Level 3 từ vựng', 'HSK Level 3 có nhiều từ vựng mới. Có cách nào học hiệu quả không?', '2024-04-05 09:30:00', '2024-04-05 09:30:00'),
(6, 4, 8, 'THPT English tips', 'THPT English có nhiều dạng câu hỏi. Có ai có kinh nghiệm không?', '2024-05-05 11:00:00', '2024-05-05 11:00:00');

-- INSERT: test_comments (15+ records)
INSERT INTO test_comments (test_comment_id, test_discussion_id, user_id, content, parent_comment_id, created_at, updated_at) VALUES
(1, 1, 4, 'Bạn nên quan sát kỹ hình ảnh và tập trung vào hành động chính.', NULL, '2024-02-05 11:00:00', '2024-02-05 11:00:00'),
(2, 1, 3, 'Cảm ơn bạn, tôi sẽ thử cách này.', 1, '2024-02-05 12:00:00', '2024-02-05 12:00:00'),
(3, 2, 5, 'Tôi thường đọc câu hỏi trước rồi mới làm bài.', NULL, '2024-02-20 15:00:00', '2024-02-20 15:00:00'),
(4, 2, 6, 'Part 5 cần nắm vững ngữ pháp cơ bản.', NULL, '2024-02-20 16:00:00', '2024-02-20 16:00:00'),
(5, 3, 7, 'Task 2 cần có cấu trúc rõ ràng: intro, body, conclusion.', NULL, '2024-03-05 17:00:00', '2024-03-05 17:00:00'),
(6, 3, 8, 'Tôi có template hay, bạn có muốn không?', 5, '2024-03-05 18:00:00', '2024-03-05 18:00:00'),
(7, 4, 3, 'Nghe nhiều podcast và xem phim có phụ đề.', NULL, '2024-03-20 13:00:00', '2024-03-20 13:00:00'),
(8, 4, 4, 'Luyện nghe hàng ngày 30 phút sẽ cải thiện đáng kể.', NULL, '2024-03-20 14:00:00', '2024-03-20 14:00:00'),
(9, 5, 5, 'HSK cần học từ vựng theo chủ đề.', NULL, '2024-04-05 10:00:00', '2024-04-05 10:00:00'),
(10, 5, 6, 'Tôi dùng flashcard để học từ vựng HSK.', NULL, '2024-04-05 11:00:00', '2024-04-05 11:00:00'),
(11, 6, 7, 'THPT English cần nắm vững ngữ pháp cơ bản.', NULL, '2024-05-05 12:00:00', '2024-05-05 12:00:00'),
(12, 6, 8, 'Luyện đề nhiều sẽ quen với format.', NULL, '2024-05-05 13:00:00', '2024-05-05 13:00:00'),
(13, 1, 5, 'Part 1 cần tập trung vào động từ chính.', NULL, '2024-02-10 10:00:00', '2024-02-10 10:00:00'),
(14, 2, 7, 'Part 5 có nhiều câu về thì và cấu trúc câu.', NULL, '2024-02-25 14:30:00', '2024-02-25 14:30:00'),
(15, 3, 3, 'Writing Task 2 cần có ý tưởng rõ ràng.', NULL, '2024-03-10 16:00:00', '2024-03-10 16:00:00');

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================
-- INTEGRITY VALIDATION QUERIES
-- =============================================

-- Check record counts for all tables
SELECT 'users' as table_name, COUNT(*) as record_count FROM users
UNION ALL SELECT 'roles', COUNT(*) FROM roles
UNION ALL SELECT 'permissions', COUNT(*) FROM permissions
UNION ALL SELECT 'user_roles', COUNT(*) FROM user_roles
UNION ALL SELECT 'role_permissions', COUNT(*) FROM role_permissions
UNION ALL SELECT 'otp_codes', COUNT(*) FROM otp_codes
UNION ALL SELECT 'refresh_tokens', COUNT(*) FROM refresh_tokens
UNION ALL SELECT 'email_verifications', COUNT(*) FROM email_verifications
UNION ALL SELECT 'login_history', COUNT(*) FROM login_history
UNION ALL SELECT 'password_reset_tokens', COUNT(*) FROM password_reset_tokens
UNION ALL SELECT 'topics', COUNT(*) FROM topics
UNION ALL SELECT 'words', COUNT(*) FROM words
UNION ALL SELECT 'user_words', COUNT(*) FROM user_words
UNION ALL SELECT 'user_word_status', COUNT(*) FROM user_word_status
UNION ALL SELECT 'favorite_topics', COUNT(*) FROM favorite_topics
UNION ALL SELECT 'batch_imports', COUNT(*) FROM batch_imports
UNION ALL SELECT 'import_details', COUNT(*) FROM import_details
UNION ALL SELECT 'study_modes', COUNT(*) FROM study_modes
UNION ALL SELECT 'categories', COUNT(*) FROM categories
UNION ALL SELECT 'levels', COUNT(*) FROM levels
UNION ALL SELECT 'instructors', COUNT(*) FROM instructors
UNION ALL SELECT 'courses', COUNT(*) FROM courses
UNION ALL SELECT 'course_details', COUNT(*) FROM course_details
UNION ALL SELECT 'modules', COUNT(*) FROM modules
UNION ALL SELECT 'lessons', COUNT(*) FROM lessons
UNION ALL SELECT 'course_enrollments', COUNT(*) FROM course_enrollments
UNION ALL SELECT 'lesson_progress', COUNT(*) FROM lesson_progress
UNION ALL SELECT 'course_reviews', COUNT(*) FROM course_reviews
UNION ALL SELECT 'course_discussions', COUNT(*) FROM course_discussions
UNION ALL SELECT 'course_wishlist', COUNT(*) FROM course_wishlist
UNION ALL SELECT 'coupons', COUNT(*) FROM coupons
UNION ALL SELECT 'course_coupons', COUNT(*) FROM course_coupons
UNION ALL SELECT 'course_certificates', COUNT(*) FROM course_certificates
UNION ALL SELECT 'course_tags', COUNT(*) FROM course_tags
UNION ALL SELECT 'course_tag_relations', COUNT(*) FROM course_tag_relations
UNION ALL SELECT 'exam_categories', COUNT(*) FROM exam_categories
UNION ALL SELECT 'tests', COUNT(*) FROM tests
UNION ALL SELECT 'test_categories', COUNT(*) FROM test_categories
UNION ALL SELECT 'parts', COUNT(*) FROM parts
UNION ALL SELECT 'questions', COUNT(*) FROM questions
UNION ALL SELECT 'choices', COUNT(*) FROM choices
UNION ALL SELECT 'exam_tags', COUNT(*) FROM exam_tags
UNION ALL SELECT 'question_tags', COUNT(*) FROM question_tags
UNION ALL SELECT 'exam_sessions', COUNT(*) FROM exam_sessions
UNION ALL SELECT 'user_answers', COUNT(*) FROM user_answers
UNION ALL SELECT 'user_exam_statistics', COUNT(*) FROM user_exam_statistics
UNION ALL SELECT 'part_statistics', COUNT(*) FROM part_statistics
UNION ALL SELECT 'test_discussions', COUNT(*) FROM test_discussions
UNION ALL SELECT 'test_comments', COUNT(*) FROM test_comments;

-- Verify foreign key relationships
SELECT 'FK Check: user_roles.user_id -> users.user_id' as check_name, 
       COUNT(*) as invalid_count 
FROM user_roles ur 
LEFT JOIN users u ON ur.user_id = u.user_id 
WHERE u.user_id IS NULL

UNION ALL

SELECT 'FK Check: course_enrollments.user_id -> users.user_id', 
       COUNT(*) 
FROM course_enrollments ce 
LEFT JOIN users u ON ce.user_id = u.user_id 
WHERE u.user_id IS NULL

UNION ALL

SELECT 'FK Check: exam_sessions.user_id -> users.user_id', 
       COUNT(*) 
FROM exam_sessions es 
LEFT JOIN users u ON es.user_id = u.user_id 
WHERE u.user_id IS NULL

UNION ALL

SELECT 'FK Check: user_answers.exam_session_id -> exam_sessions.exam_session_id', 
       COUNT(*) 
FROM user_answers ua 
LEFT JOIN exam_sessions es ON ua.exam_session_id = es.exam_session_id 
WHERE es.exam_session_id IS NULL

UNION ALL

SELECT 'FK Check: choices.question_id -> questions.question_id', 
       COUNT(*) 
FROM choices c 
LEFT JOIN questions q ON c.question_id = q.question_id 
WHERE q.question_id IS NULL;

-- Check unique constraints
SELECT 'Unique Check: users.username' as check_name, 
       COUNT(*) as duplicate_count 
FROM (SELECT username, COUNT(*) as cnt FROM users GROUP BY username HAVING cnt > 1) as duplicates

UNION ALL

SELECT 'Unique Check: users.email', 
       COUNT(*) 
FROM (SELECT email, COUNT(*) as cnt FROM users GROUP BY email HAVING cnt > 1) as duplicates

UNION ALL

SELECT 'Unique Check: courses.slug', 
       COUNT(*) 
FROM (SELECT slug, COUNT(*) as cnt FROM courses GROUP BY slug HAVING cnt > 1) as duplicates

UNION ALL

SELECT 'Unique Check: coupons.code', 
       COUNT(*) 
FROM (SELECT code, COUNT(*) as cnt FROM coupons GROUP BY code HAVING cnt > 1) as duplicates;

-- Validate exam data consistency
SELECT 'Exam Data Check: Each question has exactly 4 choices' as check_name,
       COUNT(*) as questions_with_wrong_choice_count
FROM (
    SELECT question_id, COUNT(*) as choice_count
    FROM choices 
    GROUP BY question_id 
    HAVING choice_count != 4
) as wrong_counts

UNION ALL

SELECT 'Exam Data Check: Each question has exactly 1 correct choice',
       COUNT(*) as questions_with_wrong_correct_count
FROM (
    SELECT question_id, SUM(CASE WHEN is_correct = TRUE THEN 1 ELSE 0 END) as correct_count
    FROM choices 
    GROUP BY question_id 
    HAVING correct_count != 1
) as wrong_correct_counts

UNION ALL

SELECT 'Exam Data Check: Exam sessions have valid user_answers',
       COUNT(*) as sessions_without_answers
FROM exam_sessions es
LEFT JOIN user_answers ua ON es.exam_session_id = ua.exam_session_id
WHERE ua.exam_session_id IS NULL AND es.status = 'COMPLETED';

-- Check data integrity for course enrollments
SELECT 'Course Data Check: Enrollments have valid users and courses' as check_name,
       COUNT(*) as invalid_enrollments
FROM course_enrollments ce
LEFT JOIN users u ON ce.user_id = u.user_id
LEFT JOIN courses c ON ce.course_id = c.course_id
WHERE u.user_id IS NULL OR c.course_id IS NULL

UNION ALL

SELECT 'Course Data Check: Lesson progress has valid enrollments',
       COUNT(*) as invalid_progress
FROM lesson_progress lp
LEFT JOIN course_enrollments ce ON lp.user_id = ce.user_id AND lp.course_id = ce.course_id
WHERE ce.enrollment_id IS NULL;

SELECT 'Data integrity validation completed successfully!' as status;

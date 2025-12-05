
use database;
-- ============================================
-- GÁN ROLES CHO USERS MẪU
-- ============================================
-- File này dùng để gán role cho các user đã có trong database
-- Thay đổi user_id phù hợp với database của bạn

-- Lưu ý: Đảm bảo đã có bảng user_roles với cấu trúc:
-- CREATE TABLE IF NOT EXISTS `user_roles` (
--   `user_id` bigint unsigned NOT NULL,
--   `role_id` bigint unsigned NOT NULL,
--   `assigned_at` datetime DEFAULT CURRENT_TIMESTAMP,
--   `assigned_by` bigint unsigned DEFAULT NULL,
--   `is_active` tinyint(1) DEFAULT '1',
--   PRIMARY KEY (`user_id`, `role_id`),
--   KEY `role_id` (`role_id`),
--   KEY `assigned_by` (`assigned_by`),
--   CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
--   CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE,
--   CONSTRAINT `user_roles_ibfk_3` FOREIGN KEY (`assigned_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- GÁN ROLE ADMIN CHO USER ĐẦU TIÊN
-- ============================================
-- Thường là user đầu tiên hoặc user có email admin
INSERT INTO `user_roles` (`user_id`, `role_id`, `assigned_at`, `assigned_by`, `is_active`)
SELECT 
    u.user_id,
    (SELECT role_id FROM roles WHERE role_name = 'admin') as role_id,
    NOW() as assigned_at,
    u.user_id as assigned_by, -- Tự gán cho chính mình
    1 as is_active
FROM users u
WHERE u.email LIKE '%admin%' OR u.username LIKE '%admin%'
LIMIT 1
ON DUPLICATE KEY UPDATE `is_active` = 1;

-- Hoặc gán trực tiếp cho user_id cụ thể (thay 1 bằng user_id thực tế)
-- INSERT INTO `user_roles` (`user_id`, `role_id`, `assigned_at`, `assigned_by`, `is_active`)
-- VALUES (1, (SELECT role_id FROM roles WHERE role_name = 'admin'), NOW(), 1, 1)
-- ON DUPLICATE KEY UPDATE `is_active` = 1;

-- ============================================
-- GÁN ROLE STUDENT CHO TẤT CẢ USER KHÁC
-- ============================================
-- Gán role student cho tất cả user chưa có role nào
INSERT INTO `user_roles` (`user_id`, `role_id`, `assigned_at`, `assigned_by`, `is_active`)
SELECT 
    u.user_id,
    (SELECT role_id FROM roles WHERE role_name = 'student') as role_id,
    NOW() as assigned_at,
    (SELECT user_id FROM users WHERE email LIKE '%admin%' LIMIT 1) as assigned_by,
    1 as is_active
FROM users u
WHERE u.user_id NOT IN (
    SELECT DISTINCT user_id FROM user_roles
)
ON DUPLICATE KEY UPDATE `is_active` = 1;

-- ============================================
-- GÁN ROLE TEACHER CHO USER CỤ THỂ
-- ============================================
-- Gán role teacher cho user có email chứa 'teacher' hoặc 'instructor'
INSERT INTO `user_roles` (`user_id`, `role_id`, `assigned_at`, `assigned_by`, `is_active`)
SELECT 
    u.user_id,
    (SELECT role_id FROM roles WHERE role_name = 'teacher') as role_id,
    NOW() as assigned_at,
    (SELECT user_id FROM users WHERE email LIKE '%admin%' LIMIT 1) as assigned_by,
    1 as is_active
FROM users u
WHERE (u.email LIKE '%teacher%' OR u.email LIKE '%instructor%')
  AND u.user_id NOT IN (
    SELECT user_id FROM user_roles WHERE role_id = (SELECT role_id FROM roles WHERE role_name = 'teacher')
  )
ON DUPLICATE KEY UPDATE `is_active` = 1;

-- ============================================
-- GÁN NHIỀU ROLES CHO MỘT USER
-- ============================================
-- Ví dụ: User vừa là student vừa là teacher
-- INSERT INTO `user_roles` (`user_id`, `role_id`, `assigned_at`, `assigned_by`, `is_active`)
-- VALUES 
--     (2, (SELECT role_id FROM roles WHERE role_name = 'student'), NOW(), 1, 1),
--     (2, (SELECT role_id FROM roles WHERE role_name = 'teacher'), NOW(), 1, 1)
-- ON DUPLICATE KEY UPDATE `is_active` = 1;

-- ============================================
-- KIỂM TRA KẾT QUẢ
-- ============================================
-- Xem danh sách user và roles của họ
SELECT 
    u.user_id,
    u.username,
    u.email,
    GROUP_CONCAT(r.role_name ORDER BY r.role_name SEPARATOR ', ') as roles,
    COUNT(ur.role_id) as role_count
FROM users u
LEFT JOIN user_roles ur ON u.user_id = ur.user_id AND ur.is_active = 1
LEFT JOIN roles r ON ur.role_id = r.role_id
GROUP BY u.user_id, u.username, u.email
ORDER BY u.user_id;

-- Xem user nào chưa có role
SELECT 
    u.user_id,
    u.username,
    u.email
FROM users u
LEFT JOIN user_roles ur ON u.user_id = ur.user_id AND ur.is_active = 1
WHERE ur.role_id IS NULL;

-- ============================================
-- VÔ HIỆU HÓA ROLE (KHÔNG XÓA)
-- ============================================
-- Thay vì xóa, set is_active = 0
-- UPDATE user_roles 
-- SET is_active = 0 
-- WHERE user_id = ? AND role_id = ?;

-- ============================================
-- XÓA ROLE KHỎI USER
-- ============================================
-- DELETE FROM user_roles 
-- WHERE user_id = ? AND role_id = ?;


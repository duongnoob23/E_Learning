-- ============================================
-- SET USER 8 LÀM ADMIN
-- ============================================
-- File này dùng để gán role admin cho user_id = 8

USE `your_database_name`; -- Thay tên database của bạn

-- Kiểm tra role_id của admin
SELECT role_id, role_name FROM roles WHERE role_name = 'admin';

-- Gán role admin cho user 8
INSERT INTO `user_roles` (`user_id`, `role_id`, `assigned_at`, `assigned_by`, `is_active`)
VALUES (
    8, -- user_id = 8
    (SELECT role_id FROM roles WHERE role_name = 'admin'), -- Lấy role_id của admin
    NOW(),
    8, -- Tự gán cho chính mình
    1  -- is_active = 1
)
ON DUPLICATE KEY UPDATE 
    `is_active` = 1,
    `assigned_at` = NOW();

-- Kiểm tra kết quả
SELECT 
    u.user_id,
    u.username,
    u.email,
    GROUP_CONCAT(r.role_name ORDER BY r.role_name SEPARATOR ', ') as roles
FROM users u
LEFT JOIN user_roles ur ON u.user_id = ur.user_id AND ur.is_active = 1
LEFT JOIN roles r ON ur.role_id = r.role_id
WHERE u.user_id = 8
GROUP BY u.user_id, u.username, u.email;


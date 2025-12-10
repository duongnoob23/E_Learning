-- ============================================
-- KIỂM TRA USER VÀ ROLE CỦA HỌ
-- ============================================
-- File này dùng để kiểm tra user có role gì và role có permissions gì

-- 1. Kiểm tra user_id = 8 có role gì
SELECT 
    u.user_id,
    u.username,
    u.email,
    ur.role_id,
    r.role_name,
    ur.is_active as user_role_active,
    ur.assigned_at
FROM users u
LEFT JOIN user_roles ur ON u.user_id = ur.user_id AND ur.is_active = 1
LEFT JOIN roles r ON ur.role_id = r.role_id
WHERE u.user_id = 8;

-- 2. Kiểm tra role "student" có role_id là bao nhiêu và có permissions gì
SELECT 
    r.role_id,
    r.role_name,
    COUNT(rp.permission_id) as permission_count
FROM roles r
LEFT JOIN role_permissions rp ON r.role_id = rp.role_id
WHERE r.role_name = 'student'
GROUP BY r.role_id, r.role_name;

-- 3. Kiểm tra tất cả roles có trong database
SELECT 
    role_id,
    role_name,
    description,
    is_active
FROM roles
ORDER BY role_id;

-- 4. Kiểm tra user_id = 8 có permissions gì (thông qua roles)
SELECT 
    u.user_id,
    u.username,
    r.role_name,
    p.permission_name,
    p.resource,
    p.action
FROM users u
JOIN user_roles ur ON u.user_id = ur.user_id AND ur.is_active = 1
JOIN roles r ON ur.role_id = r.role_id
JOIN role_permissions rp ON r.role_id = rp.role_id
JOIN permissions p ON rp.permission_id = p.permission_id
WHERE u.user_id = 8
ORDER BY p.resource, p.action;

-- 5. Kiểm tra xem có user nào không có role
SELECT 
    u.user_id,
    u.username,
    u.email,
    COUNT(ur.role_id) as role_count
FROM users u
LEFT JOIN user_roles ur ON u.user_id = ur.user_id AND ur.is_active = 1
GROUP BY u.user_id, u.username, u.email
HAVING role_count = 0;

-- 6. Gán role student cho user_id = 8 (nếu chưa có)
-- Thay đổi role_id = 3 thành role_id thực tế của student trong database của bạn
INSERT INTO `user_roles` (`user_id`, `role_id`, `assigned_at`, `assigned_by`, `is_active`)
VALUES (8, (SELECT role_id FROM roles WHERE role_name = 'student' LIMIT 1), NOW(), 1, 1)
ON DUPLICATE KEY UPDATE `is_active` = 1;

-- 7. Kiểm tra lại sau khi gán
SELECT 
    u.user_id,
    u.username,
    r.role_name,
    ur.is_active
FROM users u
JOIN user_roles ur ON u.user_id = ur.user_id
JOIN roles r ON ur.role_id = r.role_id
WHERE u.user_id = 8;


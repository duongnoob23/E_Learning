-- ============================================
-- FIX ROLE CHO USER_ID = 8
-- ============================================
-- File này dùng để fix lỗi 403 cho user_id = 8

-- Bước 1: Kiểm tra user hiện tại có role gì
SELECT 
    u.user_id,
    u.username,
    u.email,
    ur.role_id,
    r.role_name,
    ur.is_active as user_role_active
FROM users u
LEFT JOIN user_roles ur ON u.user_id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.role_id
WHERE u.user_id = 8;

-- Bước 2: Kiểm tra role "student" có role_id là bao nhiêu
SELECT role_id, role_name FROM roles WHERE role_name = 'student';

-- Bước 3: Xóa tất cả role cũ của user 8 (nếu có)
DELETE FROM user_roles WHERE user_id = 8;

-- Bước 4: Gán role student cho user 8
-- Lưu ý: Thay đổi role_id nếu role_id của student không phải là 3
INSERT INTO user_roles (user_id, role_id, assigned_at, assigned_by, is_active)
SELECT 8, role_id, NOW(), 1, 1
FROM roles
WHERE role_name = 'student'
LIMIT 1;

-- Bước 5: Kiểm tra lại sau khi gán
SELECT 
    u.user_id,
    u.username,
    r.role_id,
    r.role_name,
    ur.is_active,
    ur.assigned_at
FROM users u
JOIN user_roles ur ON u.user_id = ur.user_id AND ur.is_active = 1
JOIN roles r ON ur.role_id = r.role_id
WHERE u.user_id = 8;

-- Bước 6: Kiểm tra user 8 có permissions gì (thông qua role student)
SELECT 
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


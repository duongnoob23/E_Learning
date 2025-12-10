# 🔧 Hướng dẫn sửa lỗi 403 Forbidden sau khi gán role

## Vấn đề
User đã được gán role nhưng vẫn bị lỗi 403 Forbidden khi gọi API.

## Nguyên nhân có thể

### 1. Role name không khớp
- Middleware check `role_name` = "student" (chữ thường)
- Nhưng trong database có thể là "Student" (chữ hoa)
- **Giải pháp**: Kiểm tra và đảm bảo role_name trong database là lowercase

### 2. User chưa có role hoặc is_active = 0
- User chưa có record trong bảng `user_roles`
- Hoặc `is_active = 0` trong `user_roles`
- **Giải pháp**: Kiểm tra và gán lại role

### 3. JWT Token chưa được refresh
- JWT token được tạo trước khi gán role
- Token không chứa thông tin role mới
- **Giải pháp**: Đăng xuất và đăng nhập lại

### 4. Association không load đúng
- Sequelize association giữa User và Role chưa được setup đúng
- **Giải pháp**: Kiểm tra models/index.js

## Các bước kiểm tra và sửa

### Bước 1: Kiểm tra user có role gì
```sql
SELECT 
    u.user_id,
    u.username,
    ur.role_id,
    r.role_name,
    ur.is_active
FROM users u
LEFT JOIN user_roles ur ON u.user_id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.role_id
WHERE u.user_id = 8;
```

### Bước 2: Kiểm tra role_name có đúng không
```sql
SELECT role_id, role_name FROM roles WHERE role_id = 3;
-- Phải là 'student' (chữ thường), không phải 'Student'
```

### Bước 3: Gán lại role cho user (nếu cần)
```sql
-- Xóa role cũ nếu có
DELETE FROM user_roles WHERE user_id = 8;

-- Gán role student (role_id = 3) cho user_id = 8
INSERT INTO user_roles (user_id, role_id, assigned_at, assigned_by, is_active)
VALUES (8, 3, NOW(), 1, 1);
```

### Bước 4: Kiểm tra lại
```sql
SELECT 
    u.user_id,
    u.username,
    r.role_name,
    ur.is_active
FROM users u
JOIN user_roles ur ON u.user_id = ur.user_id AND ur.is_active = 1
JOIN roles r ON ur.role_id = r.role_id
WHERE u.user_id = 8;
```

### Bước 5: Đăng xuất và đăng nhập lại
- **QUAN TRỌNG**: Sau khi gán role, user phải đăng xuất và đăng nhập lại
- JWT token được tạo khi đăng nhập, nó không tự động cập nhật khi role thay đổi

## Kiểm tra trong Backend Logs

Khi gọi API, check log trong backend console. Bạn sẽ thấy một trong các log sau:

1. **User không có role:**
   ```
   [AUTH] 403 - User 8 không có role | GET /exam/tests
   ```

2. **User có role nhưng không đúng:**
   ```
   [AUTH] 403 - User 8 có roles [admin] nhưng cần [student] | GET /exam/tests
   ```

3. **User có role đúng:**
   - Không có log lỗi, API sẽ chạy tiếp

## Quick Fix SQL

Chạy SQL này để fix nhanh:

```sql
-- 1. Xóa role cũ của user 8
DELETE FROM user_roles WHERE user_id = 8;

-- 2. Gán role student (đảm bảo role_name = 'student' trong bảng roles)
INSERT INTO user_roles (user_id, role_id, assigned_at, assigned_by, is_active)
SELECT 8, role_id, NOW(), 1, 1
FROM roles
WHERE role_name = 'student'
LIMIT 1;

-- 3. Kiểm tra lại
SELECT 
    u.user_id,
    u.username,
    r.role_name,
    ur.is_active
FROM users u
JOIN user_roles ur ON u.user_id = ur.user_id AND ur.is_active = 1
JOIN roles r ON ur.role_id = r.role_id
WHERE u.user_id = 8;
```

## Lưu ý quan trọng

1. ✅ **Role name phải là lowercase**: "student", không phải "Student"
2. ✅ **is_active = 1**: Đảm bảo `user_roles.is_active = 1`
3. ✅ **Đăng nhập lại**: User phải đăng xuất và đăng nhập lại sau khi gán role
4. ✅ **Check logs**: Xem log trong backend để biết chính xác lỗi gì


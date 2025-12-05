# ✅ Kiểm tra Models với Database Schema

## 📋 Tổng quan

File này liệt kê các models đã được kiểm tra và những điểm cần lưu ý.

## ✅ Models đã đúng với Schema

### 1. Permission Model ✅
- ✅ `permission_id` (BIGINT, PK, AUTO_INCREMENT)
- ✅ `permission_name` (VARCHAR(100), UNIQUE, NOT NULL)
- ✅ `description` (TEXT)
- ✅ `resource` (VARCHAR(50))
- ✅ `action` (VARCHAR(20))
- ✅ `is_active` (TINYINT(1), DEFAULT 1)
- ✅ `created_at` (DATETIME)

### 2. Role Model ✅
- ✅ `role_id` (BIGINT, PK, AUTO_INCREMENT)
- ✅ `role_name` (VARCHAR(50), UNIQUE, NOT NULL)
- ✅ `description` (TEXT)
- ✅ `is_active` (TINYINT(1), DEFAULT 1)
- ✅ `created_at` (DATETIME)

### 3. RolePermission Model ✅
- ✅ `role_id` (BIGINT, PK, FK)
- ✅ `permission_id` (BIGINT, PK, FK)
- ✅ `granted_at` (DATETIME, DEFAULT CURRENT_TIMESTAMP)
- ✅ `granted_by` (BIGINT, FK, NULL)

### 4. UserRole Model ✅
- ✅ `user_id` (BIGINT, PK, FK)
- ✅ `role_id` (BIGINT, PK, FK)
- ✅ `assigned_at` (DATETIME)
- ✅ `assigned_by` (BIGINT, FK, NULL)
- ✅ `is_active` (TINYINT(1))

## ⚠️ User Model - Cần cập nhật

User model hiện tại **THIẾU** một số fields so với schema SQL:

### Fields hiện có trong Model:
- ✅ `user_id` (BIGINT, PK, AUTO_INCREMENT)
- ✅ `username` (VARCHAR(50), UNIQUE, NOT NULL)
- ✅ `password_hash` (VARCHAR(255), NOT NULL)
- ✅ `email` (VARCHAR(100), UNIQUE, NOT NULL)
- ✅ `full_name` (VARCHAR(100))
- ✅ `phone_number` (VARCHAR(20))
- ✅ `avatar_url` (VARCHAR(255))
- ✅ `status` (VARCHAR(20))
- ✅ `created_at` (DATETIME)
- ✅ `updated_at` (DATETIME)

### Fields THIẾU trong Model (có trong Schema SQL):
- ❌ `email_verified` (TINYINT(1), DEFAULT 0)
- ❌ `phone_verified` (TINYINT(1), DEFAULT 0)
- ❌ `last_login` (DATETIME, NULL)
- ❌ `failed_login_attempts` (INT, DEFAULT 0)
- ❌ `locked_until` (DATETIME, NULL)

## 🔧 Cách cập nhật User Model

Cập nhật file `backend/src/models/User.js`:

```javascript
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      user_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      password_hash: { type: DataTypes.STRING(255), allowNull: false },
      email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      full_name: { type: DataTypes.STRING(100), allowNull: true },
      phone_number: { type: DataTypes.STRING(20), allowNull: true },
      avatar_url: { type: DataTypes.STRING(255), allowNull: true },
      status: { 
        type: DataTypes.STRING(20), 
        allowNull: true,
        defaultValue: 'active' // active/inactive/banned/pending_verification
      },
      // THÊM CÁC FIELDS SAU:
      email_verified: { 
        type: DataTypes.BOOLEAN, 
        allowNull: false, 
        defaultValue: false 
      },
      phone_verified: { 
        type: DataTypes.BOOLEAN, 
        allowNull: false, 
        defaultValue: false 
      },
      last_login: { 
        type: DataTypes.DATE, 
        allowNull: true 
      },
      failed_login_attempts: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        defaultValue: 0 
      },
      locked_until: { 
        type: DataTypes.DATE, 
        allowNull: true 
      },
      created_at: { type: DataTypes.DATE, allowNull: true },
      updated_at: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "users", timestamps: false }
  );
  
  // ... các methods hiện có ...
  
  return User;
};
```

## 📝 Lưu ý

1. **Nếu database đã có dữ liệu**: Cần migration để thêm các columns mới
2. **Nếu database mới**: Chạy schema SQL trước, sau đó cập nhật model
3. **Associations**: Đã được setup đúng trong `models/index.js`

## 🚀 Checklist trước khi deploy

- [ ] Cập nhật User model với các fields thiếu
- [ ] Chạy migration nếu database đã có dữ liệu
- [ ] Chạy `permissions_and_roles.sql` để tạo permissions và roles
- [ ] Chạy `assign_roles_to_users.sql` để gán role cho users
- [ ] Test các API với các roles khác nhau
- [ ] Kiểm tra middleware `authorizeByRole` hoạt động đúng


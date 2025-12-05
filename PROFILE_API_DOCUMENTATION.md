# 📚 TÀI LIỆU API PROFILE - USER

## 🔗 Base URL
- **Backend Route**: `/user` (được mount từ `backend/src/routes/clientRoutes.js`)
- **Full Base URL**: `http://localhost:5000/user` (hoặc domain của bạn)

---

## 📋 DANH SÁCH API ENDPOINTS

### 1. **GET /user/profile** - Lấy thông tin profile của user hiện tại

**Method**: `GET`  
**URL**: `/user/profile`  
**Authentication**: ✅ Required (Bearer Token trong header)

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Params**: Không có  
**Query**: Không có  
**Body**: Không có

**Response Success (200)**:
```json
{
  "EM": "Lấy thông tin profile thành công",
  "EC": "0",
  "DT": {
    "user_id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "phone_number": "+1234567890",
    "avatar_url": "/uploads/avatars/avatar-1234567890.jpg",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response Error**:
- `EC: "2"` - Không tìm thấy user
- `EC: "-2"` - Lỗi hệ thống

---

### 2. **PATCH /user/profile** - Cập nhật thông tin profile

**Method**: `PATCH`  
**URL**: `/user/profile`  
**Authentication**: ✅ Required

**Headers**:
```
Authorization: Bearer <token>
Content-Type: multipart/form-data (nếu có file) hoặc application/json
```

**Params**: Không có  
**Query**: Không có

**Body** (FormData nếu có avatar, JSON nếu không):
```json
{
  "username": "john_doe_updated",      // optional
  "full_name": "John Doe Updated",     // optional, 2-100 ký tự
  "phone_number": "+1234567890",        // optional, format: [0-9+\-\s()]
  "avatar": <File>                      // optional, file ảnh (max 5MB)
  // HOẶC
  "avatar_url": "/uploads/avatars/..."  // optional, URL ảnh
}
```

**Validation Rules**:
- `full_name`: 2-100 ký tự (nếu có)
- `phone_number`: Chỉ chứa số, dấu +, -, khoảng trắng, dấu ngoặc (nếu có)
- `avatar_url`: Phải là URL hợp lệ (nếu có)
- File avatar: Chỉ chấp nhận file ảnh, tối đa 5MB

**Response Success (200)**:
```json
{
  "EM": "Cập nhật profile thành công",
  "EC": "0",
  "DT": {
    "user_id": 1,
    "username": "john_doe_updated",
    "email": "john@example.com",
    "full_name": "John Doe Updated",
    "phone_number": "+1234567890",
    "avatar_url": "/uploads/avatars/avatar-1234567890.jpg",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response Error**:
- `422` - Validation error (dữ liệu không hợp lệ)
- `EC: "2"` - Không tìm thấy user
- `EC: "-2"` - Lỗi hệ thống

---

### 3. **GET /user/stats** - Lấy thống kê của user

**Method**: `GET`  
**URL**: `/user/stats`  
**Authentication**: ✅ Required

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Params**: Không có  
**Query**: Không có  
**Body**: Không có

**Response Success (200)**:
```json
{
  "EM": "Lấy thống kê thành công",
  "EC": "0",
  "DT": {
    "enrolledCourses": 10,
    "completedCourses": 5,
    "wishlistItems": 8,
    "totalWords": 500,
    "studyStreak": 7
  }
}
```

**Response Error**:
- `EC: "-2"` - Lỗi hệ thống

---

### 4. **PATCH /user/change-password** - Đổi mật khẩu

**Method**: `PATCH`  
**URL**: `/user/change-password`  
**Authentication**: ✅ Required

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Params**: Không có  
**Query**: Không có

**Body**:
```json
{
  "currentPassword": "oldPassword123",     // required
  "newPassword": "NewPassword123",          // required, min 6 ký tự, phải có chữ hoa, chữ thường và số
  "confirmPassword": "NewPassword123"       // required, phải khớp với newPassword
}
```

**Validation Rules**:
- `currentPassword`: Bắt buộc
- `newPassword`: 
  - Tối thiểu 6 ký tự
  - Phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số
- `confirmPassword`: Phải khớp với `newPassword`

**Response Success (200)**:
```json
{
  "EM": "Đổi mật khẩu thành công",
  "EC": "0",
  "DT": null
}
```

**Response Error**:
- `422` - Validation error
- `EC: "2"` - Mật khẩu hiện tại không đúng hoặc không tìm thấy user
- `EC: "-2"` - Lỗi hệ thống

---

### 5. **POST /user/upload-avatar** - Upload avatar riêng

**Method**: `POST`  
**URL**: `/user/upload-avatar`  
**Authentication**: ✅ Required

**Headers**:
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Params**: Không có  
**Query**: Không có

**Body** (FormData):
```
avatar: <File>  // required, file ảnh (max 5MB)
```

**Response Success (200)**:
```json
{
  "EM": "Cập nhật profile thành công",
  "EC": "0",
  "DT": {
    "user_id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "phone_number": "+1234567890",
    "avatar_url": "/uploads/avatars/avatar-1234567890.jpg",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response Error**:
- `400` - Không có file ảnh được upload
- `EC: "-2"` - Lỗi hệ thống

---

### 6. **PATCH /user/change-email** - Đổi email (bước 1: gửi OTP)

**Method**: `PATCH`  
**URL**: `/user/change-email`  
**Authentication**: ✅ Required

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Params**: Không có  
**Query**: Không có

**Body**:
```json
{
  "newEmail": "newemail@example.com",      // required, phải là email hợp lệ
  "currentPassword": "currentPassword123"  // required
}
```

**Validation Rules**:
- `newEmail`: Phải là email hợp lệ
- `currentPassword`: Bắt buộc

**Response Success (200)**:
```json
{
  "EM": "Vui lòng kiểm tra email để lấy OTP.",
  "EC": "0",
  "DT": {
    "otp": "123456"  // OTP được gửi qua email (có thể không trả về trong production)
  }
}
```

**Response Error**:
- `400` - Validation error hoặc email mới trùng với email hiện tại
- `EC: "2"` - Mật khẩu hiện tại không đúng hoặc không tìm thấy user
- `EC: "-2"` - Lỗi hệ thống

**Lưu ý**: Sau khi gọi API này, hệ thống sẽ gửi OTP đến email mới. User cần gọi API `/user/verify-email` để xác thực.

---

### 7. **POST /user/verify-email** - Xác thực OTP đổi email (bước 2)

**Method**: `POST`  
**URL**: `/user/verify-email`  
**Authentication**: ❌ Không cần (vì OTP đã được gửi qua email)

**Headers**:
```
Content-Type: application/json
```

**Params**: Không có  
**Query**: Không có

**Body**:
```json
{
  "email": "newemail@example.com",  // required, email đã gửi OTP
  "otp": "123456"                   // required, 6 ký tự số
}
```

**Validation Rules**:
- `email`: Phải là email hợp lệ
- `otp`: Phải có đúng 6 ký tự, chỉ chứa số

**Response Success (200)**:
```json
{
  "EM": "Xác thực thành công!",
  "EC": "0",
  "DT": null
}
```

**Response Error**:
- `400` - Validation error
- `EC: "2"` - Mã OTP không hợp lệ hoặc đã hết hạn
- `EC: "-2"` - Lỗi hệ thống

---

## 🔄 LUỒNG XỬ LÝ

### Luồng Router → Controller → Service

1. **Router** (`profileClientRoutes.js`):
   - Định nghĩa route, middleware (auth, validation, multer)
   - Gọi controller

2. **Controller** (`profileClientController.js`):
   - Nhận request từ router
   - Xử lý validation errors
   - Lấy `userId` từ `req.user` (từ authMiddleware)
   - Gọi service với các tham số cần thiết
   - Trả về response

3. **Service** (`profileClientService.js`):
   - Thực hiện logic nghiệp vụ
   - Tương tác với database (User model)
   - Xử lý hash password, generate OTP, etc.
   - Trả về object `{ EM, EC, DT }`

---

## 📝 GHI CHÚ QUAN TRỌNG

1. **Authentication**: Tất cả API (trừ `/user/verify-email`) đều yêu cầu Bearer Token trong header
2. **Response Format**: Tất cả API đều trả về format `{ EM, EC, DT }`:
   - `EM`: Error Message (thông báo)
   - `EC`: Error Code ("0" = success, "2" = not found/invalid, "-2" = system error)
   - `DT`: Data (dữ liệu trả về)
3. **File Upload**: Sử dụng `multipart/form-data` cho avatar, file được lưu tại `backend/uploads/avatars/`
4. **OTP**: Có thời hạn 10 phút, được gửi qua email
5. **Validation**: Sử dụng `express-validator` ở router level


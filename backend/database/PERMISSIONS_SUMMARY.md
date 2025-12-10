# Tổng hợp Permissions và Roles

## 📋 Tổng quan

File SQL này tạo ra hệ thống phân quyền đầy đủ cho ứng dụng E-learning với 4 roles chính:
- **Guest**: Người dùng chưa đăng nhập
- **Student**: Học viên
- **Teacher**: Giảng viên
- **Admin**: Quản trị viên

## 🔑 Roles

| Role | Mô tả | Số Permissions |
|------|-------|----------------|
| guest | Chỉ xem nội dung công khai | ~8 |
| student | Học tập, làm bài thi, học từ vựng | ~45 |
| teacher | Quản lý khóa học + tất cả quyền student | ~60 |
| admin | Toàn quyền quản lý hệ thống | ~80+ |

## 📦 Resources và Permissions

### 1. Auth (7 permissions)
- `auth.register`, `auth.login`, `auth.refresh-token`, `auth.logout`
- `auth.verify-email`, `auth.forgot-password`, `auth.reset-password`

### 2. User (11 permissions)
- CRUD: `user.create`, `user.read`, `user.update`, `user.delete`
- Quản lý: `user.ban`, `user.unban`, `user.verify-email`, `user.verify-phone`
- Khác: `user.assign-role`, `user.search`, `user.stats`

### 3. Profile (6 permissions)
- `profile.read`, `profile.update`, `profile.change-password`
- `profile.change-email`, `profile.upload-avatar`, `profile.stats`

### 4. Course (14 permissions)
- CRUD: `course.create`, `course.read`, `course.update`, `course.delete`
- Học tập: `course.enroll`, `course.progress`, `course.curriculum`
- Tương tác: `course.review`, `course.create-review`, `course.discuss`, `course.create-discussion`
- Quản lý: `course.approve`, `course.reject`, `course.wishlist`

### 5. Lesson (6 permissions)
- CRUD: `lesson.create`, `lesson.read`, `lesson.update`, `lesson.delete`
- Học tập: `lesson.progress`, `lesson.complete`

### 6. Module (4 permissions)
- `module.create`, `module.read`, `module.update`, `module.delete`

### 7. Exam (13 permissions)
- CRUD: `exam.create`, `exam.read`, `exam.update`, `exam.delete`
- Làm bài: `exam.take`, `exam.submit`, `exam.review`, `exam.result`
- Tương tác: `exam.discuss`, `exam.create-discussion`
- Chấm điểm: `exam.speaking-upload`, `exam.grade`
- Quản lý: `exam.statistics`

### 8. Question (4 permissions)
- `question.create`, `question.read`, `question.update`, `question.delete`

### 9. Part (4 permissions)
- `part.create`, `part.read`, `part.update`, `part.delete`

### 10. Word (10 permissions)
- CRUD: `word.create`, `word.read`, `word.update`, `word.delete`
- Học tập: `word.practice`, `word.assess`, `word.learn`, `word.flashcard`, `word.srs`, `word.progress`

### 11. Topic (5 permissions)
- CRUD: `topic.create`, `topic.read`, `topic.update`, `topic.delete`
- `topic.favorite`

### 12. Instructor (6 permissions)
- `instructor.read`, `instructor.create-course`, `instructor.update-course`
- `instructor.delete-course`, `instructor.submit-course`, `instructor.my-courses`

### 13. Role (5 permissions)
- CRUD: `role.create`, `role.read`, `role.update`, `role.delete`
- `role.assign-permission`

### 14. Permission (4 permissions)
- `permission.create`, `permission.read`, `permission.update`, `permission.delete`

### 15. Category & Level (2 permissions)
- `category.read`, `level.read`

## 🎯 Phân quyền theo Role

### Guest
- ✅ Đăng ký, đăng nhập
- ✅ Xem khóa học công khai
- ✅ Xem category, level, instructor
- ✅ Xem topic, từ vựng công khai

### Student
- ✅ Tất cả quyền của Guest
- ✅ Quản lý profile cá nhân
- ✅ Đăng ký và học khóa học
- ✅ Làm bài thi, xem kết quả
- ✅ Học từ vựng (flashcard, SRS, practice)
- ✅ Tạo review, discussion
- ✅ Xem tiến độ học tập

### Teacher
- ✅ Tất cả quyền của Student
- ✅ Tạo và quản lý khóa học của mình
- ✅ Tạo và quản lý module, lesson
- ✅ Tạo và quản lý đề thi, câu hỏi
- ✅ Xem thống kê bài thi
- ✅ Gửi khóa học để phê duyệt

### Admin
- ✅ **TOÀN QUYỀN** - Tất cả permissions
- ✅ Quản lý users (CRUD, ban/unban, verify)
- ✅ Phê duyệt/từ chối khóa học
- ✅ Quản lý roles và permissions
- ✅ Xem tất cả thống kê

## 📝 Lưu ý

1. **Format Permission**: `resource.action` (ví dụ: `user.create`, `course.read`)
2. **Role Name**: Sử dụng lowercase (guest, student, teacher, admin)
3. **Database**: Đảm bảo đã tạo các bảng `roles`, `permissions`, `role_permissions` trước khi chạy SQL
4. **User Roles**: Cần gán role cho user thông qua bảng `user_roles` (không có trong file này)

## 🚀 Cách sử dụng

1. Chạy file SQL: `permissions_and_roles.sql`
2. Kiểm tra dữ liệu đã insert đúng chưa
3. Gán role cho user thông qua API hoặc SQL trực tiếp

## 🔍 Kiểm tra Models

Models đã được kiểm tra và đúng với schema SQL:
- ✅ `Permission` model: Đúng với bảng `permissions`
- ✅ `Role` model: Đúng với bảng `roles`
- ✅ `RolePermission` model: Đúng với bảng `role_permissions`
- ✅ `User` model: Cần kiểm tra thêm các fields như `email_verified`, `phone_verified`, `failed_login_attempts`, `locked_until`


-- ============================================
-- PERMISSIONS & ROLES SETUP
-- ============================================
-- File này chứa các câu lệnh SQL để:
-- 1. Xóa dữ liệu cũ (role_permissions, permissions, roles)
-- 2. Insert 4 roles: guest, student, admin, teacher
-- 3. Insert tất cả permissions dựa trên API endpoints
-- 4. Gán permissions cho từng role

-- ============================================
-- 0. XÓA DỮ LIỆU CŨ (ĐỂ TRÁNH TRÙNG LẶP)
-- ============================================
-- Lưu ý: Xóa theo thứ tự để tránh lỗi foreign key constraint
-- Thứ tự: role_permissions -> user_roles -> permissions -> roles
-- 
-- ⚠️ CẢNH BÁO: 
-- - Nếu đã có user_roles (đã gán role cho user), cần xóa trước
-- - Hoặc đảm bảo foreign key có CASCADE để tự động xóa

-- Tắt safe update mode để cho phép DELETE không có WHERE
SET SQL_SAFE_UPDATES = 0;

-- Xóa tất cả role_permissions trước
DELETE FROM `role_permissions` WHERE `role_id` > 0;

-- Xóa tất cả user_roles (nếu có, để tránh lỗi foreign key khi xóa roles)
-- Nếu bạn muốn giữ lại user_roles, comment dòng này và đảm bảo role_id mới trùng với role_id cũ
DELETE FROM `user_roles` WHERE `user_id` > 0;

-- Xóa tất cả permissions
DELETE FROM `permissions` WHERE `permission_id` > 0;

-- Xóa tất cả roles
DELETE FROM `roles` WHERE `role_id` > 0;

-- Bật lại safe update mode (tùy chọn)
SET SQL_SAFE_UPDATES = 1;

-- Reset AUTO_INCREMENT về 1 (tùy chọn, để ID bắt đầu từ 1)
-- Lưu ý: role_permissions không có AUTO_INCREMENT vì dùng composite primary key
ALTER TABLE `permissions` AUTO_INCREMENT = 1;
ALTER TABLE `roles` AUTO_INCREMENT = 1;

-- ============================================
-- 1. INSERT ROLES
-- ============================================
INSERT INTO `roles` (`role_name`, `description`, `is_active`, `created_at`) VALUES
('guest', 'Người dùng chưa đăng nhập, chỉ xem nội dung công khai', 1, NOW()),
('student', 'Học viên - có thể học khóa học, làm bài thi, học từ vựng', 1, NOW()),
('teacher', 'Giảng viên - có thể tạo và quản lý khóa học, bài học', 1, NOW()),
('admin', 'Quản trị viên - có toàn quyền quản lý hệ thống', 1, NOW());

-- ============================================
-- 2. INSERT PERMISSIONS
-- ============================================
-- Format: resource.action (ví dụ: user.create, course.read)

-- ========== AUTH PERMISSIONS ==========
INSERT INTO `permissions` (`permission_name`, `description`, `resource`, `action`, `is_active`, `created_at`) VALUES
('auth.register', 'Đăng ký tài khoản mới', 'auth', 'register', 1, NOW()),
('auth.login', 'Đăng nhập', 'auth', 'login', 1, NOW()),
('auth.refresh-token', 'Làm mới token', 'auth', 'refresh-token', 1, NOW()),
('auth.logout', 'Đăng xuất', 'auth', 'logout', 1, NOW()),
('auth.verify-email', 'Xác thực email', 'auth', 'verify-email', 1, NOW()),
('auth.forgot-password', 'Quên mật khẩu', 'auth', 'forgot-password', 1, NOW()),
('auth.reset-password', 'Đặt lại mật khẩu', 'auth', 'reset-password', 1, NOW());

-- ========== USER PERMISSIONS ==========
INSERT INTO `permissions` (`permission_name`, `description`, `resource`, `action`, `is_active`, `created_at`) VALUES
('user.read', 'Xem thông tin người dùng', 'user', 'read', 1, NOW()),
('user.create', 'Tạo người dùng mới', 'user', 'create', 1, NOW()),
('user.update', 'Cập nhật thông tin người dùng', 'user', 'update', 1, NOW()),
('user.delete', 'Xóa người dùng', 'user', 'delete', 1, NOW()),
('user.ban', 'Khóa tài khoản người dùng', 'user', 'ban', 1, NOW()),
('user.unban', 'Mở khóa tài khoản', 'user', 'unban', 1, NOW()),
('user.verify-email', 'Xác thực email cho người dùng', 'user', 'verify-email', 1, NOW()),
('user.verify-phone', 'Xác thực số điện thoại', 'user', 'verify-phone', 1, NOW()),
('user.assign-role', 'Gán role cho người dùng', 'user', 'assign-role', 1, NOW()),
('user.search', 'Tìm kiếm người dùng', 'user', 'search', 1, NOW()),
('user.stats', 'Xem thống kê người dùng', 'user', 'stats', 1, NOW());

-- ========== PROFILE PERMISSIONS ==========
INSERT INTO `permissions` (`permission_name`, `description`, `resource`, `action`, `is_active`, `created_at`) VALUES
('profile.read', 'Xem thông tin profile của mình', 'profile', 'read', 1, NOW()),
('profile.update', 'Cập nhật profile của mình', 'profile', 'update', 1, NOW()),
('profile.change-password', 'Đổi mật khẩu', 'profile', 'change-password', 1, NOW()),
('profile.change-email', 'Đổi email', 'profile', 'change-email', 1, NOW()),
('profile.upload-avatar', 'Upload ảnh đại diện', 'profile', 'upload-avatar', 1, NOW()),
('profile.stats', 'Xem thống kê cá nhân', 'profile', 'stats', 1, NOW());

-- ========== COURSE PERMISSIONS ==========
INSERT INTO `permissions` (`permission_name`, `description`, `resource`, `action`, `is_active`, `created_at`) VALUES
('course.read', 'Xem danh sách và chi tiết khóa học', 'course', 'read', 1, NOW()),
('course.create', 'Tạo khóa học mới', 'course', 'create', 1, NOW()),
('course.update', 'Cập nhật khóa học', 'course', 'update', 1, NOW()),
('course.delete', 'Xóa khóa học', 'course', 'delete', 1, NOW()),
('course.enroll', 'Đăng ký khóa học', 'course', 'enroll', 1, NOW()),
('course.approve', 'Phê duyệt khóa học', 'course', 'approve', 1, NOW()),
('course.reject', 'Từ chối khóa học', 'course', 'reject', 1, NOW()),
('course.review', 'Xem đánh giá khóa học', 'course', 'review', 1, NOW()),
('course.create-review', 'Tạo đánh giá khóa học', 'course', 'create-review', 1, NOW()),
('course.discuss', 'Xem thảo luận khóa học', 'course', 'discuss', 1, NOW()),
('course.create-discussion', 'Tạo thảo luận khóa học', 'course', 'create-discussion', 1, NOW()),
('course.progress', 'Xem tiến độ học khóa học', 'course', 'progress', 1, NOW()),
('course.curriculum', 'Xem chương trình học', 'course', 'curriculum', 1, NOW()),
('course.wishlist', 'Thêm/xóa khóa học khỏi wishlist', 'course', 'wishlist', 1, NOW());

-- ========== LESSON PERMISSIONS ==========
INSERT INTO `permissions` (`permission_name`, `description`, `resource`, `action`, `is_active`, `created_at`) VALUES
('lesson.read', 'Xem chi tiết bài học', 'lesson', 'read', 1, NOW()),
('lesson.create', 'Tạo bài học mới', 'lesson', 'create', 1, NOW()),
('lesson.update', 'Cập nhật bài học', 'lesson', 'update', 1, NOW()),
('lesson.delete', 'Xóa bài học', 'lesson', 'delete', 1, NOW()),
('lesson.progress', 'Cập nhật tiến độ học bài', 'lesson', 'progress', 1, NOW()),
('lesson.complete', 'Hoàn thành bài học', 'lesson', 'complete', 1, NOW());

-- ========== MODULE PERMISSIONS ==========
INSERT INTO `permissions` (`permission_name`, `description`, `resource`, `action`, `is_active`, `created_at`) VALUES
('module.read', 'Xem danh sách module', 'module', 'read', 1, NOW()),
('module.create', 'Tạo module mới', 'module', 'create', 1, NOW()),
('module.update', 'Cập nhật module', 'module', 'update', 1, NOW()),
('module.delete', 'Xóa module', 'module', 'delete', 1, NOW());

-- ========== EXAM PERMISSIONS ==========
INSERT INTO `permissions` (`permission_name`, `description`, `resource`, `action`, `is_active`, `created_at`) VALUES
('exam.read', 'Xem danh sách và chi tiết đề thi', 'exam', 'read', 1, NOW()),
('exam.create', 'Tạo đề thi mới', 'exam', 'create', 1, NOW()),
('exam.update', 'Cập nhật đề thi', 'exam', 'update', 1, NOW()),
('exam.delete', 'Xóa đề thi', 'exam', 'delete', 1, NOW()),
('exam.take', 'Làm bài thi', 'exam', 'take', 1, NOW()),
('exam.submit', 'Nộp bài thi', 'exam', 'submit', 1, NOW()),
('exam.review', 'Xem lại bài thi đã làm', 'exam', 'review', 1, NOW()),
('exam.result', 'Xem kết quả bài thi', 'exam', 'result', 1, NOW()),
('exam.statistics', 'Xem thống kê bài thi', 'exam', 'statistics', 1, NOW()),
('exam.discuss', 'Xem thảo luận đề thi', 'exam', 'discuss', 1, NOW()),
('exam.create-discussion', 'Tạo thảo luận đề thi', 'exam', 'create-discussion', 1, NOW()),
('exam.speaking-upload', 'Upload audio cho phần Speaking', 'exam', 'speaking-upload', 1, NOW()),
('exam.grade', 'Chấm điểm Speaking/Writing', 'exam', 'grade', 1, NOW());

-- ========== QUESTION PERMISSIONS ==========
INSERT INTO `permissions` (`permission_name`, `description`, `resource`, `action`, `is_active`, `created_at`) VALUES
('question.read', 'Xem câu hỏi', 'question', 'read', 1, NOW()),
('question.create', 'Tạo câu hỏi mới', 'question', 'create', 1, NOW()),
('question.update', 'Cập nhật câu hỏi', 'question', 'update', 1, NOW()),
('question.delete', 'Xóa câu hỏi', 'question', 'delete', 1, NOW());

-- ========== PART PERMISSIONS ==========
INSERT INTO `permissions` (`permission_name`, `description`, `resource`, `action`, `is_active`, `created_at`) VALUES
('part.read', 'Xem danh sách part', 'part', 'read', 1, NOW()),
('part.create', 'Tạo part mới', 'part', 'create', 1, NOW()),
('part.update', 'Cập nhật part', 'part', 'update', 1, NOW()),
('part.delete', 'Xóa part', 'part', 'delete', 1, NOW());

-- ========== WORD PERMISSIONS ==========
INSERT INTO `permissions` (`permission_name`, `description`, `resource`, `action`, `is_active`, `created_at`) VALUES
('word.read', 'Xem từ vựng', 'word', 'read', 1, NOW()),
('word.create', 'Tạo từ vựng mới', 'word', 'create', 1, NOW()),
('word.update', 'Cập nhật từ vựng', 'word', 'update', 1, NOW()),
('word.delete', 'Xóa từ vựng', 'word', 'delete', 1, NOW()),
('word.practice', 'Luyện tập từ vựng', 'word', 'practice', 1, NOW()),
('word.assess', 'Đánh giá phát âm', 'word', 'assess', 1, NOW()),
('word.learn', 'Đánh dấu từ đã học', 'word', 'learn', 1, NOW()),
('word.flashcard', 'Sử dụng flashcard', 'word', 'flashcard', 1, NOW()),
('word.srs', 'Học từ theo SRS', 'word', 'srs', 1, NOW()),
('word.progress', 'Xem tiến độ học từ', 'word', 'progress', 1, NOW());

-- ========== TOPIC PERMISSIONS ==========
INSERT INTO `permissions` (`permission_name`, `description`, `resource`, `action`, `is_active`, `created_at`) VALUES
('topic.read', 'Xem danh sách và chi tiết topic', 'topic', 'read', 1, NOW()),
('topic.create', 'Tạo topic mới', 'topic', 'create', 1, NOW()),
('topic.update', 'Cập nhật topic', 'topic', 'update', 1, NOW()),
('topic.delete', 'Xóa topic', 'topic', 'delete', 1, NOW()),
('topic.favorite', 'Thêm/xóa topic khỏi favorite', 'topic', 'favorite', 1, NOW());

-- ========== INSTRUCTOR PERMISSIONS ==========
INSERT INTO `permissions` (`permission_name`, `description`, `resource`, `action`, `is_active`, `created_at`) VALUES
('instructor.read', 'Xem thông tin giảng viên', 'instructor', 'read', 1, NOW()),
('instructor.create-course', 'Tạo khóa học (giảng viên)', 'instructor', 'create-course', 1, NOW()),
('instructor.update-course', 'Cập nhật khóa học của mình', 'instructor', 'update-course', 1, NOW()),
('instructor.delete-course', 'Xóa khóa học của mình', 'instructor', 'delete-course', 1, NOW()),
('instructor.submit-course', 'Gửi khóa học để phê duyệt', 'instructor', 'submit-course', 1, NOW()),
('instructor.my-courses', 'Xem danh sách khóa học của mình', 'instructor', 'my-courses', 1, NOW());

-- ========== ROLE PERMISSIONS ==========
INSERT INTO `permissions` (`permission_name`, `description`, `resource`, `action`, `is_active`, `created_at`) VALUES
('role.read', 'Xem danh sách và chi tiết role', 'role', 'read', 1, NOW()),
('role.create', 'Tạo role mới', 'role', 'create', 1, NOW()),
('role.update', 'Cập nhật role', 'role', 'update', 1, NOW()),
('role.delete', 'Xóa role', 'role', 'delete', 1, NOW()),
('role.assign-permission', 'Gán permission cho role', 'role', 'assign-permission', 1, NOW());

-- ========== PERMISSION PERMISSIONS ==========
INSERT INTO `permissions` (`permission_name`, `description`, `resource`, `action`, `is_active`, `created_at`) VALUES
('permission.read', 'Xem danh sách và chi tiết permission', 'permission', 'read', 1, NOW()),
('permission.create', 'Tạo permission mới', 'permission', 'create', 1, NOW()),
('permission.update', 'Cập nhật permission', 'permission', 'update', 1, NOW()),
('permission.delete', 'Xóa permission', 'permission', 'delete', 1, NOW());

-- ========== CATEGORY & LEVEL PERMISSIONS ==========
INSERT INTO `permissions` (`permission_name`, `description`, `resource`, `action`, `is_active`, `created_at`) VALUES
('category.read', 'Xem danh sách category', 'category', 'read', 1, NOW()),
('level.read', 'Xem danh sách level', 'level', 'read', 1, NOW());

-- ============================================
-- 3. GÁN PERMISSIONS CHO ROLES
-- ============================================

-- ========== GUEST PERMISSIONS ==========
-- Guest chỉ có quyền xem nội dung công khai
INSERT INTO `role_permissions` (`role_id`, `permission_id`, `granted_at`) 
SELECT 
    (SELECT role_id FROM roles WHERE role_name = 'guest') as role_id,
    permission_id,
    NOW()
FROM permissions 
WHERE permission_name IN (
    'auth.register',
    'auth.login',
    'course.read',
    'category.read',
    'level.read',
    'instructor.read',
    'topic.read',
    'word.read'
);

-- ========== STUDENT PERMISSIONS ==========
-- Student có quyền học tập, làm bài thi, học từ vựng
INSERT INTO `role_permissions` (`role_id`, `permission_id`, `granted_at`) 
SELECT 
    (SELECT role_id FROM roles WHERE role_name = 'student') as role_id,
    permission_id,
    NOW()
FROM permissions 
WHERE permission_name IN (
    -- Auth
    'auth.register',
    'auth.login',
    'auth.refresh-token',
    'auth.logout',
    'auth.verify-email',
    'auth.forgot-password',
    'auth.reset-password',
    -- Profile
    'profile.read',
    'profile.update',
    'profile.change-password',
    'profile.change-email',
    'profile.upload-avatar',
    'profile.stats',
    -- Course
    'course.read',
    'course.enroll',
    'course.review',
    'course.create-review',
    'course.discuss',
    'course.create-discussion',
    'course.progress',
    'course.curriculum',
    'course.wishlist',
    -- Lesson
    'lesson.read',
    'lesson.progress',
    'lesson.complete',
    -- Exam
    'exam.read',
    'exam.take',
    'exam.submit',
    'exam.review',
    'exam.result',
    'exam.discuss',
    'exam.create-discussion',
    'exam.speaking-upload',
    'exam.grade',
    -- Word
    'word.read',
    'word.practice',
    'word.assess',
    'word.learn',
    'word.flashcard',
    'word.srs',
    'word.progress',
    -- Topic
    'topic.read',
    'topic.favorite',
    -- Category & Level
    'category.read',
    'level.read',
    'instructor.read'
);

-- ========== TEACHER PERMISSIONS ==========
-- Teacher có quyền quản lý khóa học, bài học của mình + xem exams
INSERT INTO `role_permissions` (`role_id`, `permission_id`, `granted_at`) 
SELECT 
    (SELECT role_id FROM roles WHERE role_name = 'teacher') as role_id,
    permission_id,
    NOW()
FROM permissions 
WHERE permission_name IN (
    -- Tất cả quyền của Student
    'auth.register',
    'auth.login',
    'auth.refresh-token',
    'auth.logout',
    'auth.verify-email',
    'auth.forgot-password',
    'auth.reset-password',
    'profile.read',
    'profile.update',
    'profile.change-password',
    'profile.change-email',
    'profile.upload-avatar',
    'profile.stats',
    'course.read',
    'course.enroll',
    'course.review',
    'course.create-review',
    'course.discuss',
    'course.create-discussion',
    'course.progress',
    'course.curriculum',
    'course.wishlist',
    'lesson.read',
    'lesson.progress',
    'lesson.complete',
    'exam.read',
    'exam.take',
    'exam.submit',
    'exam.review',
    'exam.result',
    'exam.discuss',
    'exam.create-discussion',
    'word.read',
    'word.practice',
    'word.assess',
    'word.learn',
    'word.flashcard',
    'word.srs',
    'word.progress',
    'topic.read',
    'topic.favorite',
    'category.read',
    'level.read',
    'instructor.read',
    -- Quyền riêng của Teacher
    'instructor.create-course',
    'instructor.update-course',
    'instructor.delete-course',
    'instructor.submit-course',
    'instructor.my-courses',
    'course.create',
    'course.update',
    'course.delete',
    'module.create',
    'module.update',
    'module.delete',
    'module.read',
    'lesson.create',
    'lesson.update',
    'lesson.delete',
    'exam.create',
    'exam.update',
    'exam.delete',
    'part.create',
    'part.update',
    'part.delete',
    'part.read',
    'question.create',
    'question.update',
    'question.delete',
    'question.read',
    'exam.statistics'
);

-- ========== ADMIN PERMISSIONS ==========
-- Admin có toàn quyền
INSERT INTO `role_permissions` (`role_id`, `permission_id`, `granted_at`) 
SELECT 
    (SELECT role_id FROM roles WHERE role_name = 'admin') as role_id,
    permission_id,
    NOW()
FROM permissions;

-- ============================================
-- VERIFY DATA
-- ============================================
-- Kiểm tra số lượng permissions và roles đã insert
SELECT 'Roles' as Type, COUNT(*) as Count FROM roles;
SELECT 'Permissions' as Type, COUNT(*) as Count FROM permissions;
SELECT r.role_name, COUNT(rp.permission_id) as PermissionCount
FROM roles r
LEFT JOIN role_permissions rp ON r.role_id = rp.role_id
GROUP BY r.role_id, r.role_name
ORDER BY r.role_id;


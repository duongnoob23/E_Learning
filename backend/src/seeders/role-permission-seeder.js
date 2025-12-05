require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
const { sequelize, Role, Permission, RolePermission } = require("../models");

/**
 * Seeder khởi tạo Roles và Permissions
 * Chạy: node backend/src/seeders/role-permission-seeder.js
 */

const ROLES = [
  { role_name: "guest", description: "Khách vãng lai - Chưa đăng nhập" },
  { role_name: "student", description: "Học viên" },
  { role_name: "teacher", description: "Giáo viên" },
  { role_name: "admin", description: "Quản trị viên" },
];

const PERMISSIONS = [
  // User Management
  { permission_name: "user.view", description: "Xem danh sách người dùng", resource: "user", action: "view" },
  { permission_name: "user.create", description: "Tạo người dùng", resource: "user", action: "create" },
  { permission_name: "user.update", description: "Cập nhật người dùng", resource: "user", action: "update" },
  { permission_name: "user.delete", description: "Xóa người dùng", resource: "user", action: "delete" },
  { permission_name: "user.ban", description: "Khóa tài khoản", resource: "user", action: "ban" },
  { permission_name: "user.verify", description: "Xác thực email/phone", resource: "user", action: "verify" },

  // Course Management
  { permission_name: "course.view", description: "Xem khóa học", resource: "course", action: "view" },
  { permission_name: "course.create", description: "Tạo khóa học", resource: "course", action: "create" },
  { permission_name: "course.update", description: "Cập nhật khóa học", resource: "course", action: "update" },
  { permission_name: "course.delete", description: "Xóa khóa học", resource: "course", action: "delete" },
  { permission_name: "course.enroll", description: "Đăng ký khóa học", resource: "course", action: "enroll" },

  // Exam Management
  { permission_name: "exam.view", description: "Xem bài thi", resource: "exam", action: "view" },
  { permission_name: "exam.create", description: "Tạo bài thi", resource: "exam", action: "create" },
  { permission_name: "exam.update", description: "Cập nhật bài thi", resource: "exam", action: "update" },
  { permission_name: "exam.delete", description: "Xóa bài thi", resource: "exam", action: "delete" },
  { permission_name: "exam.submit", description: "Nộp bài thi", resource: "exam", action: "submit" },
  { permission_name: "exam.viewStats", description: "Xem thống kê bài thi", resource: "exam", action: "viewStats" },

  // Word Management
  { permission_name: "word.view", description: "Xem từ vựng", resource: "word", action: "view" },
  { permission_name: "word.create", description: "Tạo từ vựng", resource: "word", action: "create" },
  { permission_name: "word.update", description: "Cập nhật từ vựng", resource: "word", action: "update" },
  { permission_name: "word.delete", description: "Xóa từ vựng", resource: "word", action: "delete" },
  { permission_name: "word.assess", description: "Đánh giá phát âm", resource: "word", action: "assess" },

  // Role & Permission Management
  { permission_name: "role.view", description: "Xem roles", resource: "role", action: "view" },
  { permission_name: "role.manage", description: "Quản lý roles", resource: "role", action: "manage" },
];

const ROLE_PERMISSIONS = [
  // GUEST - Chỉ xem công khai
  { role_name: "guest", permission_name: "course.view" },
  { role_name: "guest", permission_name: "exam.view" },
  { role_name: "guest", permission_name: "word.view" },

  // STUDENT - Học tập
  { role_name: "student", permission_name: "course.view" },
  { role_name: "student", permission_name: "course.enroll" },
  { role_name: "student", permission_name: "exam.view" },
  { role_name: "student", permission_name: "exam.submit" },
  { role_name: "student", permission_name: "word.view" },
  { role_name: "student", permission_name: "word.create" },
  { role_name: "student", permission_name: "word.update" },
  { role_name: "student", permission_name: "word.delete" },
  { role_name: "student", permission_name: "word.assess" },

  // TEACHER - Tạo khóa học & bài thi
  { role_name: "teacher", permission_name: "course.view" },
  { role_name: "teacher", permission_name: "course.create" },
  { role_name: "teacher", permission_name: "course.update" },
  { role_name: "teacher", permission_name: "course.delete" },
  { role_name: "teacher", permission_name: "exam.view" },
  { role_name: "teacher", permission_name: "exam.create" },
  { role_name: "teacher", permission_name: "exam.update" },
  { role_name: "teacher", permission_name: "exam.delete" },
  { role_name: "teacher", permission_name: "exam.viewStats" },
  { role_name: "teacher", permission_name: "word.view" },

  // ADMIN - Quản lý toàn hệ thống
  { role_name: "admin", permission_name: "user.view" },
  { role_name: "admin", permission_name: "user.create" },
  { role_name: "admin", permission_name: "user.update" },
  { role_name: "admin", permission_name: "user.delete" },
  { role_name: "admin", permission_name: "user.ban" },
  { role_name: "admin", permission_name: "user.verify" },
  { role_name: "admin", permission_name: "course.view" },
  { role_name: "admin", permission_name: "course.create" },
  { role_name: "admin", permission_name: "course.update" },
  { role_name: "admin", permission_name: "course.delete" },
  { role_name: "admin", permission_name: "exam.view" },
  { role_name: "admin", permission_name: "exam.create" },
  { role_name: "admin", permission_name: "exam.update" },
  { role_name: "admin", permission_name: "exam.delete" },
  { role_name: "admin", permission_name: "exam.viewStats" },
  { role_name: "admin", permission_name: "word.view" },
  { role_name: "admin", permission_name: "word.create" },
  { role_name: "admin", permission_name: "word.update" },
  { role_name: "admin", permission_name: "word.delete" },
  { role_name: "admin", permission_name: "role.view" },
  { role_name: "admin", permission_name: "role.manage" },
];

async function seed() {
  try {
    console.log("🌱 Bắt đầu seed roles và permissions...");

    // 1. Tạo Roles
    console.log("📝 Tạo roles...");
    for (const role of ROLES) {
      await Role.findOrCreate({
        where: { role_name: role.role_name },
        defaults: { ...role, is_active: true, created_at: new Date() },
      });
    }
    console.log("✅ Roles đã được tạo");

    // 2. Tạo Permissions
    console.log("📝 Tạo permissions...");
    for (const perm of PERMISSIONS) {
      await Permission.findOrCreate({
        where: { permission_name: perm.permission_name },
        defaults: { ...perm, is_active: true, created_at: new Date() },
      });
    }
    console.log("✅ Permissions đã được tạo");

    // 3. Gán Permissions cho Roles
    console.log("📝 Gán permissions cho roles...");
    for (const rp of ROLE_PERMISSIONS) {
      const role = await Role.findOne({ where: { role_name: rp.role_name } });
      const permission = await Permission.findOne({
        where: { permission_name: rp.permission_name },
      });

      if (role && permission) {
        await RolePermission.findOrCreate({
          where: { role_id: role.role_id, permission_id: permission.permission_id },
        });
      }
    }
    console.log("✅ Permissions đã được gán cho roles");

    console.log("✅ Seed hoàn thành!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi seed:", error);
    process.exit(1);
  }
}

seed();


const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const UserAdminController = require("../controllers/userAdminController");

// ------- Quản lý tài khoản --------- //
//GET /api/admin/:user_id
// POST /api/admin
// PATCH /api/admin/:user_id
// DELETE /api/admin/:user_id
// ------- Quản lý trạng thái tài khoản --------- //
// PATCH /api/admin/:user_id/ban

// PATCH /api/admin/:user_id/unban
// PATCH /api/admin/:user_id/status
// ------- Quản lý xác thực email & phone --------- //
// PATCH /api/admin/:user_id/verify-phone
// Quản lý bảo mật & đăng nhập
// -------- Tìm kiếm & lọc nâng cao ---------- //
// GET /api/admin/search?keyword=phong
// GET /api/admin?from=2025-01-01&to=2025-12-31
// 6. Thống kê phân tích
// GET /api/admin/stats thống kê
// GET /api/admin/stats/status

//--- Quản lý tài khoản ---//
router.get("/", UserAdminController.getUsers);
router.get("/:user_id", UserAdminController.getUserDetail);
router.post("/", UserAdminController.createUser);
router.patch("/:user_id", UserAdminController.updateUser);
router.delete("/:user_id", UserAdminController.deleteUser);

//--- Quản lý trạng thái tài khoản ---//
router.patch("/:user_id/ban", UserAdminController.banUser);
router.patch("/:user_id/unban", UserAdminController.unbanUser);
router.patch("/:user_id/status", UserAdminController.updateUserStatus);

//--- Quản lý xác thực email & phone ---//
router.patch("/:user_id/verify-phone", UserAdminController.verifyPhone);

//--- Quản lý bảo mật & đăng nhập ---//
router.patch("/:user_id/verify-email", UserAdminController.verifyEmail);

//--- Tìm kiếm & lọc nâng cao ---//
router.get("/search", UserAdminController.searchUsers);
router.get("/filter", UserAdminController.filterUsers);

//--- Thống kê phân tích ---//
router.get("/stats", UserAdminController.getUsersStats);
router.get("/stats/status", UserAdminController.getUsersStatsByStatus);
module.exports = router;

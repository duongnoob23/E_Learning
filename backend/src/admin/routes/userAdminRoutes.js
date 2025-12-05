const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const { authorizeByRole } = require("../../middleware/authorizeMiddleware");
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

// gán role cho 1 user
/** 
 * @route POST /api/admin/users/:user_id/roles
 * @desc Gán role cho user
 * @body { role_id }
 */
router.post(
  "/users/:user_id/roles",
  authMiddleware,
  authorizeByRole("admin"),
  UserAdminController.assignRoleToUser
);
//--- Quản lý tài khoản ---//
router.get("/", authMiddleware, authorizeByRole("admin"), UserAdminController.getUsers);
router.get("/:user_id", authMiddleware, authorizeByRole("admin"), UserAdminController.getUserDetail);
router.post("/", authMiddleware, authorizeByRole("admin"), UserAdminController.createUser);
router.patch("/:user_id", authMiddleware, authorizeByRole("admin"), UserAdminController.updateUser);
router.delete("/:user_id", authMiddleware, authorizeByRole("admin"), UserAdminController.deleteUser);

//--- Quản lý trạng thái tài khoản ---//
router.patch("/:user_id/ban", authMiddleware, authorizeByRole("admin"), UserAdminController.banUser);
router.patch("/:user_id/unban", authMiddleware, authorizeByRole("admin"), UserAdminController.unbanUser);
router.patch("/:user_id/status", authMiddleware, authorizeByRole("admin"), UserAdminController.updateUserStatus);

//--- Quản lý xác thực email & phone ---//
router.patch("/:user_id/verify-phone", authMiddleware, authorizeByRole("admin"), UserAdminController.verifyPhone);

//--- Quản lý bảo mật & đăng nhập ---//
router.patch("/:user_id/verify-email", authMiddleware, authorizeByRole("admin"), UserAdminController.verifyEmail);

//--- Tìm kiếm & lọc nâng cao ---//
router.get("/search", authMiddleware, authorizeByRole("admin"), UserAdminController.searchUsers);
router.get("/filter", authMiddleware, authorizeByRole("admin"), UserAdminController.filterUsers);

//--- Thống kê phân tích ---//
router.get("/stats", authMiddleware, authorizeByRole("admin"), UserAdminController.getUsersStats);
router.get("/stats/status", authMiddleware, authorizeByRole("admin"), UserAdminController.getUsersStatsByStatus);
module.exports = router;

const express = require("express");
const router = express.Router();

const controller = require("../controllers/authAdminController");
const { adminAuthMiddleware } = require("../middleware/authMiddleware");

/**
 * Auth Admin Routes
 * Base path: /api/admin/auth
 */

// Public routes (không cần auth)
// POST /api/admin/auth/login - Đăng nhập admin
router.post("/login", controller.login);

// POST /api/admin/auth/refresh-token - Làm mới token
router.post("/refresh-token", controller.refreshToken);

// Protected routes (cần auth)
// POST /api/admin/auth/logout - Đăng xuất admin
router.post("/logout", adminAuthMiddleware, controller.logout);

module.exports = router;

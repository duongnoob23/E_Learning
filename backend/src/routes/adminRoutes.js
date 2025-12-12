const express = require("express");
const router = express.Router();

const authAdminRoutes = require("../admin/routes/authAdminRoutes");
const examAdminRoutes = require("../admin/routes/examAdminRoutes");
const userAdminRoutes = require("../admin/routes/userAdminRoutes");
const rolePermissionRoutes = require("../admin/routes/rolePermissionRoutes");
const { adminAuthMiddleware } = require("../admin/middleware/authMiddleware");

// Public routes (không cần auth)
router.use("/auth", authAdminRoutes);

// Protected routes (cần auth admin)
router.use("/role-permission", adminAuthMiddleware, rolePermissionRoutes);
router.use("/exam", adminAuthMiddleware, examAdminRoutes);
router.use("/users", adminAuthMiddleware, userAdminRoutes);

module.exports = router;

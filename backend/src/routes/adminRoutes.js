const express = require("express");
const router = express.Router();

const authAdminRoutes = require("../admin/routes/authAdminRoutes");
const examAdminRoutes = require("../admin/routes/examAdminRoutes");
const userAdminRoutes = require("../admin/routes/userAdminRoutes");
const rolePermissionRoutes = require("../admin/routes/rolePermissionRoutes");
const vocabularyAdminRoutes = require("../admin/routes/vocabularyAdminRoutes");
const statisticsAdminRoutes = require("../admin/routes/statisticsAdminRoutes");
const { adminAuthMiddleware } = require("../admin/middleware/authMiddleware");

// Public routes (không cần auth)
router.use("/auth", authAdminRoutes);

// Protected routes (cần auth admin)
router.use("/role-permission", adminAuthMiddleware, rolePermissionRoutes);
router.use("/exam", adminAuthMiddleware, examAdminRoutes);
router.use("/vocabulary", adminAuthMiddleware, vocabularyAdminRoutes);
router.use("/statistics", adminAuthMiddleware, statisticsAdminRoutes);
// TODO: TẠM THỜI TẮT MIDDLEWARE CHO USERS - BẬT LẠI SAU KHI CÓ ADMIN LOGIN
router.use("/users", userAdminRoutes);

module.exports = router;

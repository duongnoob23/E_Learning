const express = require("express");
const router = express.Router();

const examAdminRoutes = require("../admin/routes/examAdminRoutes");
const userAdminRoutes = require("../admin/routes/userAdminRoutes");
const rolePermissionRoutes = require("../admin/routes/rolePermissionRoutes");

router.use("/role-permission", rolePermissionRoutes);
router.use("/exam", examAdminRoutes);
router.use("/users", userAdminRoutes);

module.exports = router;

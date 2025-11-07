const express = require("express");
const router = express.Router();

const examAdminRoutes = require("../admin/routes/examAdminRoutes");
const adminCourseRoutes = require("../admin/routes/courseAdminRoutes");
router.use("/exam", examAdminRoutes);
router.use("/course", adminCourseRoutes);
module.exports = router;

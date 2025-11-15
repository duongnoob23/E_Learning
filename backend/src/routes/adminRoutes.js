const express = require("express");
const router = express.Router();

const examAdminRoutes = require("../admin/routes/examAdminRoutes");
const userAdminRoutes = require("../admin/routes/userAdminRoutes");
router.use("/exam", examAdminRoutes);
router.use("/users", userAdminRoutes);
module.exports = router;

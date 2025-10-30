const express = require("express");
const router = express.Router();

const examAdminRoutes = require("../admin/routes/examAdminRoutes");

router.use("/exam", examAdminRoutes);
module.exports = router;

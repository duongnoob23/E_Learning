const express = require("express");
const router = express.Router();

const adminRoutes = require("./adminRoutes");
const clientRoutes = require("./clientRoutes");

router.use("/admin", adminRoutes);
router.use("/", clientRoutes);

module.exports = router;

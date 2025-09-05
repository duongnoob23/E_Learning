const express = require("express");
const router = express.Router();

const authClient = require("../client/routes/authClientRoutes");
const wordRoutes = require("../client/routes/wordClientRoute");
const courseRoutes = require("../client/routes/courseClientRoute");

// GET client/authenticate
router.use("/auth", authClient);

router.use("/word", wordRoutes);

router.use("/course", courseRoutes);

module.exports = router;

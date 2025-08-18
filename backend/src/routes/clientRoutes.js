const express = require("express");
const router = express.Router();

const authClient = require("../client/routes/authClientRoutes");
const wordRoutes = require("../client/routes/wordClientRoute");

// GET client/authenticate
router.use("/auth", authClient);

router.use("/word", wordRoutes);

module.exports = router;

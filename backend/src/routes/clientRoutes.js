const express = require("express");
const router = express.Router();

const authClient = require("../client/routes/authClientRoutes");
const wordRoutes = require("../client/routes/wordClientRoute");
const topicRoutes = require("../client/routes/topicClientRoutes");
const favoriteRoutes = require("../client/routes/favoriteClientRoutes");
const courseRoutes = require("../client/routes/courseClientRoutes");
const enrollmentRoutes = require("../client/routes/enrollmentClientRoutes");
const reviewRoutes = require("../client/routes/reviewDiscussionRoutes");
const wishlistRoutes = require("../client/routes/wishlistClientRoutes");
const profileRoutes = require("../client/routes/profileClientRoutes");

router.use("/auth", authClient);
router.use("/word", wordRoutes);
router.use("/topic", topicRoutes);
router.use("/favorite", favoriteRoutes);
router.use("/course", courseRoutes);
router.use("/enrollment", enrollmentRoutes);
router.use("/review", reviewRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/user", profileRoutes);

module.exports = router;

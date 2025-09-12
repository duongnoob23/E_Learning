const express = require("express");
const router = express.Router();

/**
 * Favorite Topics – client
 * - GET    /                 (list favorite của user)
 * - POST   /                 (thêm favorite: user_id, topic_id)
 * - DELETE /:topic_id        (bỏ favorite)
 */

router.get("/", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);
router.post("/", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);
router.delete("/:topic_id", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);

module.exports = router;

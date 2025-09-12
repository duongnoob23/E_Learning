const express = require("express");
const router = express.Router();

/**
 * Topics – client
 * - GET  /              (danh sách topics: system/user_created, lọc is_public)
 * - GET  /:topic_id     (chi tiết topic)
 */

router.get("/", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);
router.get("/:topic_id", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);

module.exports = router;

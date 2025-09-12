const express = require("express");
const router = express.Router();

/**
 * Wishlist – client
 * - GET    /                 (danh sách wishlist)
 * - POST   /                 (thêm course vào wishlist)
 * - DELETE /:course_id       (bỏ course khỏi wishlist)
 */

router.get("/", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);
router.post("/", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);
router.delete("/:course_id", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);

module.exports = router;

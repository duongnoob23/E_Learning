const express = require("express");
const router = express.Router();

/**
 * Courses – client
 * - GET  /categories                (danh mục)
 * - GET  /levels                    (trình độ)
 * - GET  /instructors               (giảng viên)
 * - GET  /                          (list courses + filter: category_id, level_id, q)
 * - GET  /:course_id                (chi tiết course + details)
 * - GET  /:course_id/curriculum     (modules + lessons)
 */

router.get("/categories", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);
router.get("/levels", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);
router.get("/instructors", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);

router.get("/", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);
router.get("/:course_id", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);
router.get("/:course_id/curriculum", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);

module.exports = router;

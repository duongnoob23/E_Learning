const express = require("express");
const router = express.Router();

/**
 * Enrollments & Progress – client
 * - POST /enroll                    (đăng ký khóa học)
 * - GET  /my                        (danh sách khóa đã đăng ký)
 * - GET  /:course_id/progress       (tiến độ khóa + bài gần nhất)
 * - POST /:course_id/lesson/:lesson_id/progress (cập nhật tiến độ bài học)
 * - GET  /certificates              (chứng chỉ của user)
 */

router.post("/enroll", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);
router.get("/my", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);
router.get("/:course_id/progress", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);
router.post("/:course_id/lesson/:lesson_id/progress", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);
router.get("/certificates", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);

module.exports = router;

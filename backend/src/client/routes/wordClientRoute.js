const express = require("express");
const router = express.Router();

const controller = require("../controllers/wordClientController");

/**
 * Words & User Words – client
 * - GET   /system?topic_id=&q=      (words hệ thống theo topic + search q)
 * - GET   /user?topic_id=&q=        (từ cá nhân theo topic + search q)
 * - POST  /user                     (thêm từ cá nhân)
 * - PUT   /user/:user_word_id       (sửa từ cá nhân)
 * - DELETE/user/:user_word_id       (xóa từ cá nhân)
 * - GET   /status?topic_id=         (lấy trạng thái học theo topic: learned/unlearned)
 * - POST  /status/mark              (đánh dấu đã thuộc)
 * - POST  /status/unmark            (bỏ đánh dấu)
 */

// Words hệ thống theo topic + tìm kiếm
router.get("/system", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);
// User words theo topic + tìm kiếm
router.get("/user", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);
// Thêm từ cá nhân
router.post("/user", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);
// Sửa từ cá nhân
router.put("/user/:user_word_id", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);
// Xóa từ cá nhân
router.delete("/user/:user_word_id", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);

// Trạng thái học theo topic (dựa vào user_word_status)
router.get("/status", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);
// Đánh dấu đã thuộc (system word hoặc user word)
router.post("/status/mark", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);
// Bỏ đánh dấu đã thuộc
router.post("/status/unmark", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);

module.exports = router;

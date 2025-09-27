const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const upload = require("../../middleware/uploadMiddleware");

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
 * - GET   /topics/explore           (lấy topics cho phần khám phá)
 * - GET   /topics/user              (lấy topics của user - List từ của tôi)
 */

// Words hệ thống theo topic + tìm kiếm
router.get("/system", controller.getWordsByTopic);
// User words theo cas nhan
router.get("/user/:topic_id", controller.getWordsbyUser);
// Thêm từ cá nhân
router.post("/user/:topic_id", controller.postWordToUser);
// Sửa từ cá nhân
router.patch("/user/editword/:user_word_id", controller.patchWordToUser);
// Xóa từ cá nhân
router.patch("/user/deteteword/:user_word_id", controller.deleteWordToUser);

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

// Topics cho phần khám phá
router.get("/topics/explore", controller.getExploreTopics);

// Topics của user (List từ của tôi) - cần authentication
router.get("/topics/user", authMiddleware, controller.getUserTopics);

// Tạo topic mới - cần authentication
router.post("/topics", authMiddleware, controller.createTopic);

// Cập nhật topic - cần authentication
router.put("/topics/:topicId", authMiddleware, controller.updateTopic);

// Xóa topic - cần authentication
router.delete("/topics/:topicId", authMiddleware, controller.deleteTopic);

// Thêm từ vào topic - cần authentication (với upload ảnh)
router.post("/topics/:topicId/words", authMiddleware, upload.single('image'), controller.addWordToTopic);

// Lấy words theo topic_id
router.get("/topics/:topicId/words", controller.getWordsByTopicId);

module.exports = router;

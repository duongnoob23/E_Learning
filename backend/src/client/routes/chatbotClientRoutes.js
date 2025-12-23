const express = require("express");
const router = express.Router();
const chatbotController = require("../controllers/chatbotClientController");
const { authenticateToken } = require("../../middleware/authMiddleware");

// Tất cả routes đều có thể truy cập không cần auth (guest cũng dùng được)
// Nhưng nếu có token thì sẽ lưu user_id

/**
 * @route GET /api/chatbot/session
 * @desc Lấy hoặc tạo session mới
 * @access Public (có token thì tốt hơn)
 */
router.get("/session", authenticateToken, chatbotController.getOrCreateSession);

/**
 * @route GET /api/chatbot/messages/:session_id
 * @desc Lấy lịch sử tin nhắn
 * @access Public
 */
router.get("/messages/:session_id", chatbotController.getMessages);

/**
 * @route POST /api/chatbot/message
 * @desc Gửi tin nhắn từ user
 * @access Public
 */
router.post("/message", authenticateToken, chatbotController.sendMessage);

/**
 * @route POST /api/chatbot/quick-reply
 * @desc Xử lý quick reply button
 * @access Public
 */
router.post("/quick-reply", authenticateToken, chatbotController.handleQuickReply);

/**
 * @route POST /api/chatbot/session/:session_id/close
 * @desc Đóng session
 * @access Public
 */
router.post("/session/:session_id/close", chatbotController.closeSession);

module.exports = router;
























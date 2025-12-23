const chatbotService = require("../services/chatbotService");

/**
 * GET /api/chatbot/session
 * Lấy hoặc tạo session mới
 */
exports.getOrCreateSession = async (req, res, next) => {
  try {
    const user_id = req.user?.user_id || null;
    const { session_token } = req.query;

    const result = await chatbotService.getOrCreateSession(user_id, session_token);

    return res.json(result);
  } catch (error) {
    console.error("Chatbot Controller Error:", error);
    next(error);
  }
};

/**
 * GET /api/chatbot/messages/:session_id
 * Lấy lịch sử tin nhắn
 */
exports.getMessages = async (req, res, next) => {
  try {
    const { session_id } = req.params;
    const { limit } = req.query;

    const result = await chatbotService.getMessages(
      session_id,
      limit ? parseInt(limit) : 50
    );

    return res.json(result);
  } catch (error) {
    console.error("Chatbot Controller Error:", error);
    next(error);
  }
};

/**
 * POST /api/chatbot/message
 * Gửi tin nhắn từ user
 */
exports.sendMessage = async (req, res, next) => {
  try {
    const { session_id, content, context } = req.body;
    const user_id = req.user?.user_id || null;

    if (!session_id || !content || !content.trim()) {
      return res.json({
        EM: "Vui lòng nhập nội dung tin nhắn",
        EC: "1",
        DT: null,
      });
    }

    const result = await chatbotService.processUserMessage(
      session_id,
      user_id,
      content,
      context
    );

    // Emit qua Socket.IO nếu có
    const io = req.app.get("io");
    if (io && result.EC === "0") {
      io.to(`chat_${session_id}`).emit("new_message", {
        message: result.DT.bot_message,
      });
    }

    return res.json(result);
  } catch (error) {
    console.error("Chatbot Controller Error:", error);
    next(error);
  }
};

/**
 * POST /api/chatbot/quick-reply
 * Xử lý quick reply
 */
exports.handleQuickReply = async (req, res, next) => {
  try {
    const { session_id, payload } = req.body;
    const user_id = req.user?.user_id || null;

    if (!session_id || !payload) {
      return res.json({
        EM: "Thiếu thông tin session_id hoặc payload",
        EC: "1",
        DT: null,
      });
    }

    const result = await chatbotService.handleQuickReply(
      session_id,
      user_id,
      payload
    );

    // Emit qua Socket.IO
    const io = req.app.get("io");
    if (io && result.EC === "0") {
      io.to(`chat_${session_id}`).emit("new_message", {
        message: result.DT.bot_message,
      });
    }

    return res.json(result);
  } catch (error) {
    console.error("Chatbot Controller Error:", error);
    next(error);
  }
};

/**
 * POST /api/chatbot/session/:session_id/close
 * Đóng session
 */
exports.closeSession = async (req, res, next) => {
  try {
    const { session_id } = req.params;

    const result = await chatbotService.closeSession(session_id);

    return res.json(result);
  } catch (error) {
    console.error("Chatbot Controller Error:", error);
    next(error);
  }
};
























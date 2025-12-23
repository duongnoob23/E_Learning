const jwt = require("jsonwebtoken");
const { ChatSession, ChatMessage } = require("../models");
const chatbotService = require("../client/services/chatbotService");

// Middleware xác thực Socket.IO (tương tự discussionSocket)
const authenticateSocket = async (socket, next) => {
  try {
    let token =
      socket.handshake.auth.token ||
      socket.handshake.headers.authorization ||
      socket.handshake.query.token;

    if (!token) {
      // Cho phép guest kết nối (không có token)
      socket.user = null;
      return next();
    }

    if (token.startsWith("Bearer ")) {
      token = token.replace("Bearer ", "");
    }

    token = token.trim();

    if (!token || token === "undefined" || token === "null") {
      socket.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user_id || decoded.userId;

    if (!userId) {
      socket.user = null;
      return next();
    }

    const { User } = require("../models");
    const user = await User.findByPk(userId);

    socket.user = user || null;
    next();
  } catch (error) {
    // Nếu lỗi xác thực, vẫn cho kết nối như guest
    socket.user = null;
    next();
  }
};

/**
 * Xử lý Socket.IO cho Chatbot
 */
const handleChatbotSocket = (io) => {
  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    console.log(`Chatbot: User connected (${socket.user?.username || "guest"})`);

    // Join session room
    socket.on("join_chat_session", async (session_id) => {
      const roomName = `chat_${session_id}`;
      socket.join(roomName);
      console.log(`User joined chat session: ${roomName}`);

      // Lấy lịch sử tin nhắn và gửi cho client
      const messagesResult = await chatbotService.getMessages(session_id, 50);
      if (messagesResult.EC === "0") {
        socket.emit("chat_history", {
          messages: messagesResult.DT,
        });
      }
    });

    // Leave session room
    socket.on("leave_chat_session", (session_id) => {
      const roomName = `chat_${session_id}`;
      socket.leave(roomName);
      console.log(`User left chat session: ${roomName}`);
    });

    // Gửi tin nhắn từ user
    socket.on("send_message", async (data) => {
      try {
        const { session_id, content, context } = data;
        const user_id = socket.user?.user_id || null;

        if (!session_id || !content || !content.trim()) {
          socket.emit("chat_error", {
            message: "Vui lòng nhập nội dung tin nhắn",
          });
          return;
        }

        // Xử lý tin nhắn
        const result = await chatbotService.processUserMessage(
          session_id,
          user_id,
          content,
          context
        );

        if (result.EC === "0") {
          // Gửi lại cho chính user đó
          socket.emit("new_message", {
            user_message: result.DT.user_message,
            bot_message: result.DT.bot_message,
          });

          // Broadcast cho các client khác trong cùng session (nếu có)
          socket.to(`chat_${session_id}`).emit("new_message", {
            user_message: result.DT.user_message,
            bot_message: result.DT.bot_message,
          });
        } else {
          socket.emit("chat_error", {
            message: result.EM,
          });
        }
      } catch (error) {
        console.error("Error in send_message socket:", error);
        socket.emit("chat_error", {
          message: "Có lỗi xảy ra khi gửi tin nhắn",
        });
      }
    });

    // Xử lý quick reply
    socket.on("quick_reply", async (data) => {
      try {
        const { session_id, payload } = data;
        const user_id = socket.user?.user_id || null;

        if (!session_id || !payload) {
          socket.emit("chat_error", {
            message: "Thiếu thông tin session_id hoặc payload",
          });
          return;
        }

        const result = await chatbotService.handleQuickReply(
          session_id,
          user_id,
          payload
        );

        if (result.EC === "0") {
          socket.emit("new_message", {
            bot_message: result.DT.bot_message,
          });

          socket.to(`chat_${session_id}`).emit("new_message", {
            bot_message: result.DT.bot_message,
          });
        } else {
          socket.emit("chat_error", {
            message: result.EM,
          });
        }
      } catch (error) {
        console.error("Error in quick_reply socket:", error);
        socket.emit("chat_error", {
          message: "Có lỗi xảy ra khi xử lý quick reply",
        });
      }
    });

    // Typing indicator
    socket.on("typing", (data) => {
      const { session_id, is_typing } = data;
      socket.to(`chat_${session_id}`).emit("user_typing", {
        user_id: socket.user?.user_id || null,
        is_typing: is_typing || false,
      });
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log(`Chatbot: User disconnected (${socket.user?.username || "guest"})`);
    });
  });
};

module.exports = { handleChatbotSocket };
























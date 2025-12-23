const { Op } = require("sequelize");
const ChatSession = require("../../models").ChatSession;
const ChatMessage = require("../../models").ChatMessage;
const User = require("../../models").User;
const Course = require("../../models").Course;

/**
 * Tạo hoặc lấy session hiện tại của user
 */
exports.getOrCreateSession = async (user_id, session_token = null) => {
  try {
    let session;

    if (user_id) {
      // User đã đăng nhập: tìm session active hoặc tạo mới
      session = await ChatSession.findOne({
        where: {
          user_id,
          status: "active",
        },
        order: [["created_at", "DESC"]],
      });
    } else if (session_token) {
      // Guest: tìm theo token
      session = await ChatSession.findByToken(session_token);
    }

    if (!session) {
      // Tạo session mới
      const newToken =
        session_token ||
        `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      session = await ChatSession.create({
        user_id: user_id || null,
        session_token: newToken,
        status: "active",
      });
    }

    return {
      EM: "Lấy session thành công",
      EC: "0",
      DT: session,
    };
  } catch (error) {
    console.error("Error in getOrCreateSession:", error);
    return {
      EM: "Có lỗi xảy ra khi tạo session",
      EC: "-1",
      DT: null,
    };
  }
};

/**
 * Lấy lịch sử tin nhắn của session
 */
exports.getMessages = async (session_id, limit = 50) => {
  try {
    const messages = await ChatMessage.findBySession(session_id, limit);

    return {
      EM: "Lấy tin nhắn thành công",
      EC: "0",
      DT: messages,
    };
  } catch (error) {
    console.error("Error in getMessages:", error);
    return {
      EM: "Có lỗi xảy ra khi lấy tin nhắn",
      EC: "-1",
      DT: [],
    };
  }
};

/**
 * Xử lý tin nhắn từ user và tạo phản hồi từ bot
 */
exports.processUserMessage = async (session_id, user_id, content, context = {}) => {
  try {
    // 1. Lưu tin nhắn của user
    const userMessage = await ChatMessage.create({
      session_id,
      sender_type: "user",
      sender_id: user_id,
      content: content.trim(),
      message_type: "text",
    });

    // 2. Xử lý và tạo phản hồi từ bot
    const botResponse = await generateBotResponse(content, context, session_id);

    // 3. Lưu phản hồi của bot
    const botMessage = await ChatMessage.create({
      session_id,
      sender_type: "bot",
      sender_id: null,
      content: botResponse.content,
      message_type: botResponse.message_type || "text",
      metadata: botResponse.metadata || null,
    });

    // 4. Cập nhật context của session nếu cần
    if (context && Object.keys(context).length > 0) {
      const session = await ChatSession.findById(session_id);
      if (session) {
        const currentContext = session.context || {};
        await ChatSession.update(
          {
            context: { ...currentContext, ...context },
          },
          { where: { session_id } }
        );
      }
    }

    return {
      EM: "Xử lý tin nhắn thành công",
      EC: "0",
      DT: {
        user_message: userMessage,
        bot_message: botMessage,
      },
    };
  } catch (error) {
    console.error("Error in processUserMessage:", error);
    return {
      EM: "Có lỗi xảy ra khi xử lý tin nhắn",
      EC: "-1",
      DT: null,
    };
  }
};

/**
 * Tạo phản hồi từ bot (Rule-based hoặc AI)
 */
async function generateBotResponse(userMessage, context, session_id) {
  const message = userMessage.toLowerCase().trim();

  // 1. Chào hỏi
  if (
    message.match(/^(hi|hello|chào|xin chào|hey|chào bạn)/i)
  ) {
    return {
      content:
        "Xin chào! 👋 Tôi là trợ lý tư vấn của bạn. Tôi có thể giúp bạn:\n\n" +
        "📚 Tìm hiểu về các khóa học\n" +
        "💳 Hỗ trợ thanh toán\n" +
        "📝 Đăng ký khóa học\n" +
        "❓ Trả lời câu hỏi thường gặp\n\n" +
        "Bạn cần hỗ trợ gì?",
      message_type: "text",
      metadata: {
        quick_replies: [
          { title: "Xem khóa học", payload: "COURSES" },
          { title: "Hướng dẫn đăng ký", payload: "REGISTER" },
          { title: "Câu hỏi thường gặp", payload: "FAQ" },
        ],
      },
    };
  }

  // 2. Hỏi về khóa học
  if (
    message.match(/(khóa học|course|khoa hoc|bài học|lesson)/i)
  ) {
    return {
      content:
        "Chúng tôi có nhiều khóa học phù hợp với bạn:\n\n" +
        "🎯 TOEIC Preparation\n" +
        "📖 English Grammar\n" +
        "💬 Speaking Practice\n" +
        "✍️ Writing Skills\n\n" +
        "Bạn muốn tìm hiểu về khóa học nào? Hoặc bạn có thể xem danh sách đầy đủ tại trang khóa học.",
      message_type: "text",
      metadata: {
        buttons: [
          {
            type: "web_url",
            url: "/courses",
            title: "Xem tất cả khóa học",
          },
        ],
      },
    };
  }

  // 3. Hỏi về giá/thanh toán
  if (
    message.match(/(giá|price|cost|phí|thanh toán|payment|mua|mua khóa)/i)
  ) {
    return {
      content:
        "💳 Thông tin thanh toán:\n\n" +
        "• Chúng tôi hỗ trợ nhiều phương thức thanh toán\n" +
        "• Bạn có thể thanh toán online qua VNPay\n" +
        "• Một số khóa học có chương trình ưu đãi đặc biệt\n\n" +
        "Bạn muốn xem chi tiết khóa học nào để biết giá cụ thể?",
      message_type: "text",
    };
  }

  // 4. Hỏi về đăng ký
  if (
    message.match(/(đăng ký|register|sign up|tham gia|enroll)/i)
  ) {
    return {
      content:
        "📝 Cách đăng ký khóa học:\n\n" +
        "1️⃣ Đăng nhập/Đăng ký tài khoản\n" +
        "2️⃣ Chọn khóa học bạn muốn học\n" +
        "3️⃣ Click 'Đăng ký ngay' hoặc 'Thêm vào giỏ hàng'\n" +
        "4️⃣ Thanh toán và bắt đầu học\n\n" +
        "Bạn cần hỗ trợ thêm về bước nào?",
      message_type: "text",
    };
  }

  // 5. FAQ
  if (
    message.match(/(faq|câu hỏi|thường gặp|hỏi|help|giúp)/i)
  ) {
    return {
      content:
        "❓ Câu hỏi thường gặp:\n\n" +
        "Q: Tôi có thể học thử không?\n" +
        "A: Có, nhiều khóa học có bài học miễn phí để bạn thử.\n\n" +
        "Q: Tôi có thể học trên mobile không?\n" +
        "A: Có, website hỗ trợ responsive trên mọi thiết bị.\n\n" +
        "Q: Làm sao để liên hệ hỗ trợ?\n" +
        "A: Bạn có thể chat với chúng tôi tại đây hoặc gửi email.\n\n" +
        "Bạn có câu hỏi cụ thể nào khác không?",
      message_type: "text",
    };
  }

  // 6. Tìm kiếm khóa học theo từ khóa
  const courseKeywords = message.match(/(toeic|grammar|speaking|writing|ielts|toefl)/i);
  if (courseKeywords) {
    const keyword = courseKeywords[0].toLowerCase();
    return {
      content:
        `Tôi thấy bạn quan tâm đến "${keyword}". ` +
        `Bạn có thể xem các khóa học liên quan tại trang tìm kiếm với từ khóa "${keyword}". ` +
        `Hoặc bạn muốn tôi tìm giúp khóa học cụ thể nào?`,
      message_type: "text",
      metadata: {
        buttons: [
          {
            type: "web_url",
            url: `/courses?search=${encodeURIComponent(keyword)}`,
            title: `Tìm khóa học "${keyword}"`,
          },
        ],
      },
    };
  }

  // 7. Phản hồi mặc định (có thể tích hợp AI ở đây)
  return {
    content:
      "Cảm ơn bạn đã liên hệ! 😊\n\n" +
      "Tôi hiểu bạn đang hỏi về: \"" + userMessage + "\"\n\n" +
      "Để tôi có thể hỗ trợ tốt hơn, bạn có thể:\n" +
      "• Hỏi về khóa học cụ thể\n" +
      "• Xem câu hỏi thường gặp\n" +
      "• Liên hệ với đội ngũ hỗ trợ\n\n" +
      "Hoặc bạn có thể mô tả rõ hơn câu hỏi của bạn?",
    message_type: "text",
    metadata: {
      quick_replies: [
        { title: "Khóa học", payload: "COURSES" },
        { title: "FAQ", payload: "FAQ" },
        { title: "Liên hệ", payload: "CONTACT" },
      ],
    },
  };
}

/**
 * Đóng session
 */
exports.closeSession = async (session_id) => {
  try {
    await ChatSession.update(
      { status: "closed" },
      { where: { session_id } }
    );

    return {
      EM: "Đóng session thành công",
      EC: "0",
      DT: null,
    };
  } catch (error) {
    console.error("Error in closeSession:", error);
    return {
      EM: "Có lỗi xảy ra khi đóng session",
      EC: "-1",
      DT: null,
    };
  }
};

/**
 * Xử lý quick reply
 */
exports.handleQuickReply = async (session_id, user_id, payload) => {
  const payloadMap = {
    COURSES: "Tôi muốn xem các khóa học",
    REGISTER: "Hướng dẫn đăng ký khóa học",
    FAQ: "Câu hỏi thường gặp",
    CONTACT: "Tôi muốn liên hệ hỗ trợ",
  };

  const message = payloadMap[payload] || payload;
  return await exports.processUserMessage(session_id, user_id, message);
};
























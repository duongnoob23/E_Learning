import axiosInstance from "../axiosInstance";

/**
 * Chatbot API Service
 */
export const chatbotApi = {
  /**
   * Lấy hoặc tạo session mới
   * @param {string} session_token - Token của session (nếu có)
   * @returns {Promise} Session object
   */
  getOrCreateSession: async (session_token = null) => {
    const response = await axiosInstance.get("/chatbot/session", {
      params: session_token ? { session_token } : {},
    });

    if (response.data.EC === "0") {
      return response.data.DT;
    } else {
      throw new Error(response.data.EM || "Có lỗi xảy ra khi tạo session");
    }
  },

  /**
   * Lấy lịch sử tin nhắn
   * @param {number} session_id - ID của session
   * @param {number} limit - Số lượng tin nhắn (mặc định 50)
   * @returns {Promise} Array of messages
   */
  getMessages: async (session_id, limit = 50) => {
    const response = await axiosInstance.get(`/chatbot/messages/${session_id}`, {
      params: { limit },
    });

    if (response.data.EC === "0") {
      return response.data.DT;
    } else {
      throw new Error(response.data.EM || "Có lỗi xảy ra khi lấy tin nhắn");
    }
  },

  /**
   * Gửi tin nhắn từ user
   * @param {number} session_id - ID của session
   * @param {string} content - Nội dung tin nhắn
   * @param {object} context - Context (page_url, course_id, etc.)
   * @returns {Promise} { user_message, bot_message }
   */
  sendMessage: async (session_id, content, context = {}) => {
    const response = await axiosInstance.post("/chatbot/message", {
      session_id,
      content,
      context,
    });

    if (response.data.EC === "0") {
      return response.data.DT;
    } else {
      throw new Error(response.data.EM || "Có lỗi xảy ra khi gửi tin nhắn");
    }
  },

  /**
   * Xử lý quick reply
   * @param {number} session_id - ID của session
   * @param {string} payload - Payload của quick reply button
   * @returns {Promise} Bot message
   */
  handleQuickReply: async (session_id, payload) => {
    const response = await axiosInstance.post("/chatbot/quick-reply", {
      session_id,
      payload,
    });

    if (response.data.EC === "0") {
      return response.data.DT;
    } else {
      throw new Error(response.data.EM || "Có lỗi xảy ra khi xử lý quick reply");
    }
  },

  /**
   * Đóng session
   * @param {number} session_id - ID của session
   * @returns {Promise}
   */
  closeSession: async (session_id) => {
    const response = await axiosInstance.post(`/chatbot/session/${session_id}/close`);

    if (response.data.EC === "0") {
      return true;
    } else {
      throw new Error(response.data.EM || "Có lỗi xảy ra khi đóng session");
    }
  },
};
























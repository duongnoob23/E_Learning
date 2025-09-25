import axiosInstance from "../../../lib/axiosInstance";

export const flashcardApi = {
  // Lấy danh sách topics cho phần khám phá
  getExploreTopics: async (params = {}) => {
    const { page = 1, limit = 12, search = '', topic_type = 'system' } = params;
    
    const response = await axiosInstance.get("/word/topics/explore", {
      params: {
        page,
        limit,
        search,
        topic_type
      }
    });
    return response.data;
  },

  // Lấy danh sách topics của user (List từ của tôi)
  getUserTopics: async (params = {}) => {
    const { page = 1, limit = 12, search = '' } = params;
    
    const response = await axiosInstance.get("/word/topics/user", {
      params: {
        page,
        limit,
        search
      }
    });
    return response.data;
  },

  // Tạo topic mới (sẽ implement sau)
  createTopic: async (topicData) => {
    const response = await axiosInstance.post("/word/topics", topicData);
    return response.data;
  },

  // Cập nhật topic (sẽ implement sau)
  updateTopic: async (topicId, topicData) => {
    const response = await axiosInstance.put(`/word/topics/${topicId}`, topicData);
    return response.data;
  },

  // Xóa topic (sẽ implement sau)
  deleteTopic: async (topicId) => {
    const response = await axiosInstance.delete(`/word/topics/${topicId}`);
    return response.data;
  },

  // Lấy chi tiết topic (sẽ implement sau)
  getTopicDetail: async (topicId) => {
    const response = await axiosInstance.get(`/word/topics/${topicId}`);
    return response.data;
  },

  // Lấy danh sách words theo topic_id
  getWordsByTopic: async (topicId, params = {}) => {
    const { page = 1, limit = 20, search = '' } = params;
    
    const response = await axiosInstance.get(`/word/topics/${topicId}/words`, {
      params: {
        page,
        limit,
        search
      }
    });
    return response.data;
  },

  // Thêm từ vào topic
  addWordToTopic: async (topicId, wordData) => {
    const response = await axiosInstance.post(`/word/topics/${topicId}/words`, wordData);
    return response.data;
  }
};

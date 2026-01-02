// Dùng adminAxiosInstance để tự động thêm admin token
import adminAxiosInstance from "../../../api/adminAuthApi";

/**
 * Vocabulary Admin API
 * Quản lý từ vựng và chủ đề từ phía admin
 */
export const wordsAdminApi = {
  // ==================== WORDS ====================

  // Lấy danh sách từ vựng
  getWords: async (params = {}) => {
    const response = await adminAxiosInstance.get("/admin/vocabulary/words", { params });
    return response.data;
  },

  // Lấy chi tiết từ vựng (preview)
  getWordDetail: async (wordId) => {
    const response = await adminAxiosInstance.get(`/admin/vocabulary/words/${wordId}`);
    return response.data;
  },

  // Tạo từ vựng mới
  createWord: async (payload) => {
    const response = await adminAxiosInstance.post("/admin/vocabulary/words", payload);
    return response.data;
  },

  // Cập nhật từ vựng
  updateWord: async (wordId, payload) => {
    const response = await adminAxiosInstance.patch(`/admin/vocabulary/words/${wordId}`, payload);
    return response.data;
  },

  // Xóa từ vựng (soft delete mặc định, hard=true để xóa cứng)
  deleteWord: async (wordId, hard = false) => {
    const response = await adminAxiosInstance.delete(`/admin/vocabulary/words/${wordId}`, {
      params: { hard },
    });
    return response.data;
  },

  // Toggle active/inactive
  toggleWordActive: async (wordId) => {
    const response = await adminAxiosInstance.patch(`/admin/vocabulary/words/${wordId}/toggle-active`);
    return response.data;
  },

  // Khôi phục từ vựng đã xóa
  restoreWord: async (wordId) => {
    const response = await adminAxiosInstance.patch(`/admin/vocabulary/words/${wordId}/restore`);
    return response.data;
  },

  // ==================== BATCH OPERATIONS ====================

  // Import nhiều từ vựng
  batchImportWords: async (words, topic_id) => {
    const response = await adminAxiosInstance.post("/admin/vocabulary/words/batch-import", {
      words,
      topic_id,
    });
    return response.data;
  },

  // Kiểm tra từ trùng lặp
  checkDuplicates: async (words, topic_id) => {
    const response = await adminAxiosInstance.post("/admin/vocabulary/words/check-duplicates", {
      words,
      topic_id,
    });
    return response.data;
  },

  // Xóa hàng loạt
  batchDeleteWords: async (word_ids, hard = false) => {
    const response = await adminAxiosInstance.post("/admin/vocabulary/words/batch-delete", {
      word_ids,
      hard,
    });
    return response.data;
  },

  // Toggle active hàng loạt
  batchToggleActive: async (word_ids, is_active) => {
    const response = await adminAxiosInstance.post("/admin/vocabulary/words/batch-toggle-active", {
      word_ids,
      is_active,
    });
    return response.data;
  },

  // ==================== TOPICS ====================

  // Lấy tất cả topics (cho dropdown)
  getAllTopics: async () => {
    const response = await adminAxiosInstance.get("/admin/vocabulary/topics/all");
    return response.data;
  },

  // Lấy danh sách topics (có phân trang)
  getTopics: async (params = {}) => {
    const response = await adminAxiosInstance.get("/admin/vocabulary/topics", { params });
    return response.data;
  },

  // Tạo topic mới
  createTopic: async (payload) => {
    const response = await adminAxiosInstance.post("/admin/vocabulary/topics", payload);
    return response.data;
  },

  // Cập nhật topic
  updateTopic: async (topicId, payload) => {
    const response = await adminAxiosInstance.patch(`/admin/vocabulary/topics/${topicId}`, payload);
    return response.data;
  },

  // Xóa topic (soft delete)
  deleteTopic: async (topicId) => {
    const response = await adminAxiosInstance.delete(`/admin/vocabulary/topics/${topicId}`);
    return response.data;
  },

  // Toggle active topic
  toggleTopicActive: async (topicId) => {
    const response = await adminAxiosInstance.patch(`/admin/vocabulary/topics/${topicId}/toggle-active`);
    return response.data;
  },

  // ==================== STATISTICS ====================

  // Lấy thống kê vocabulary
  getStatistics: async () => {
    const response = await adminAxiosInstance.get("/admin/vocabulary/statistics");
    return response.data;
  },

  // ==================== UPLOAD ====================

  // Upload ảnh cho từ vựng
  uploadWordImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await adminAxiosInstance.post("/admin/vocabulary/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Upload audio cho từ vựng
  uploadWordAudio: async (file) => {
    const formData = new FormData();
    formData.append("audio", file);
    const response = await adminAxiosInstance.post("/admin/vocabulary/upload/audio", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export default wordsAdminApi;


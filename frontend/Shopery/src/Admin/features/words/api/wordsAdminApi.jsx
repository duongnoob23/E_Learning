import adminAxiosInstance from "../../../api/adminAuthApi";

export const wordsAdminApi = {
  getWords: async (params = {}) => {
    const response = await adminAxiosInstance.get("/admin/vocabulary/words", { params });
    return response.data;
  },

  getWordDetail: async (wordId) => {
    const response = await adminAxiosInstance.get(`/admin/vocabulary/words/${wordId}`);
    return response.data;
  },

  createWord: async (payload) => {
    const response = await adminAxiosInstance.post("/admin/vocabulary/words", payload);
    return response.data;
  },

  updateWord: async (wordId, payload) => {
    const response = await adminAxiosInstance.patch(`/admin/vocabulary/words/${wordId}`, payload);
    return response.data;
  },

  deleteWord: async (wordId, hard = false, delete_reason = null) => {
    const response = await adminAxiosInstance.delete(`/admin/vocabulary/words/${wordId}`, {
      params: { hard: hard ? "true" : undefined },
      data: hard && delete_reason ? { delete_reason } : undefined,
    });
    return response.data;
  },

  toggleWordActive: async (wordId) => {
    const response = await adminAxiosInstance.patch(`/admin/vocabulary/words/${wordId}/toggle-active`);
    return response.data;
  },
  restoreWord: async (wordId) => {
    const response = await adminAxiosInstance.patch(`/admin/vocabulary/words/${wordId}/restore`);
    return response.data;
  },

  batchImportWords: async (words, topic_id) => {
    const response = await adminAxiosInstance.post("/admin/vocabulary/words/batch-import", {
      words,
      topic_id,
    });
    return response.data;
  },

  checkDuplicates: async (words, topic_id) => {
    const response = await adminAxiosInstance.post("/admin/vocabulary/words/check-duplicates", {
      words,
      topic_id,
    });
    return response.data;
  },

  batchDeleteWords: async (word_ids, hard = false) => {
    const response = await adminAxiosInstance.post("/admin/vocabulary/words/batch-delete", {
      word_ids,
      hard,
    });
    return response.data;
  },

  batchToggleActive: async (word_ids, is_active) => {
    const response = await adminAxiosInstance.post("/admin/vocabulary/words/batch-toggle-active", {
      word_ids,
      is_active,
    });
    return response.data;
  },

  getAllTopics: async () => {
    const response = await adminAxiosInstance.get("/admin/vocabulary/topics/all");
    return response.data;
  },

  getTopics: async (params = {}) => {
    const response = await adminAxiosInstance.get("/admin/vocabulary/topics", { params });
    return response.data;
  },

  createTopic: async (payload) => {
    const response = await adminAxiosInstance.post("/admin/vocabulary/topics", payload);
    return response.data;
  },

  updateTopic: async (topicId, payload) => {
    const response = await adminAxiosInstance.patch(`/admin/vocabulary/topics/${topicId}`, payload);
    return response.data;
  },

  deleteTopic: async (topicId, hard = false, delete_reason = null) => {
    const response = await adminAxiosInstance.delete(`/admin/vocabulary/topics/${topicId}`, {
      data: hard ? { hard: true, delete_reason } : undefined,
    });
    return response.data;
  },

  toggleTopicActive: async (topicId) => {
    const response = await adminAxiosInstance.patch(`/admin/vocabulary/topics/${topicId}/toggle-active`);
    return response.data;
  },

  getStatistics: async () => {
    const response = await adminAxiosInstance.get("/admin/vocabulary/statistics");
    return response.data;
  },

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


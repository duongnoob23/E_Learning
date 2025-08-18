// Client/services/clientApi.jsx (sửa lại cho web học tiếng Anh)
import axiosInstance from "../../common/services/axiosInstance";

export const clientApi = {
  // Flashcard APIs
  getFlashcardTopics: async (params = {}) => {
    return await axiosInstance.get("/flashcards/topics", { params });
  },

  getMyTopics: async () => {
    return await axiosInstance.get("/flashcards/my-topics");
  },

  getLearningTopics: async () => {
    return await axiosInstance.get("/flashcards/learning-topics");
  },

  getTopicDetail: async (topicId) => {
    return await axiosInstance.get(`/flashcards/topics/${topicId}`);
  },

  createTopic: async (topicData) => {
    return await axiosInstance.post("/flashcards/topics", topicData);
  },

  updateTopic: async (topicId, topicData) => {
    return await axiosInstance.put(`/flashcards/topics/${topicId}`, topicData);
  },

  deleteTopic: async (topicId) => {
    return await axiosInstance.delete(`/flashcards/topics/${topicId}`);
  },

  addWordToTopic: async (wordData) => {
    return await axiosInstance.post(
      `/flashcards/topics/${wordData.topicId}/words`,
      wordData
    );
  },

  updateWord: async (topicId, wordId, wordData) => {
    return await axiosInstance.put(
      `/flashcards/topics/${topicId}/words/${wordId}`,
      wordData
    );
  },

  deleteWord: async (topicId, wordId) => {
    return await axiosInstance.delete(
      `/flashcards/topics/${topicId}/words/${wordId}`
    );
  },

  startLearningTopic: async (topicId) => {
    return await axiosInstance.post(
      `/flashcards/topics/${topicId}/start-learning`
    );
  },

  stopLearningTopic: async (topicId) => {
    return await axiosInstance.post(
      `/flashcards/topics/${topicId}/stop-learning`
    );
  },

  markWordAsLearned: async (topicId, wordId) => {
    return await axiosInstance.post(
      `/flashcards/topics/${topicId}/words/${wordId}/learned`
    );
  },

  // Study Sessions APIs
  startStudySession: async (sessionData) => {
    return await axiosInstance.post("/study-sessions/start", sessionData);
  },

  endStudySession: async (sessionId, results) => {
    return await axiosInstance.put(`/study-sessions/${sessionId}/end`, results);
  },

  getStudyHistory: async () => {
    return await axiosInstance.get("/study-sessions/history");
  },

  // User Profile APIs
  changePassword: async (passwordData) => {
    return await axiosInstance.put("/user/change-password", passwordData);
  },

  updateProfile: async (userData) => {
    return await axiosInstance.put("/user/profile", userData);
  },

  uploadAvatar: async (formData) => {
    return await axiosInstance.post("/user/upload-avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getLearningProgress: async () => {
    return await axiosInstance.get("/user/learning-progress");
  },

  updateLearningProgress: async (progressData) => {
    return await axiosInstance.put("/user/learning-progress", progressData);
  },
};

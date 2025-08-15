// Client API - API calls cho Client (e-learning)
import axiosInstance from "../../common/services/axiosInstance";

export const clientApi = {
  // User Profile & Settings
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

  // Learning Progress
  getLearningProgress: async () => {
    return await axiosInstance.get("/user/learning-progress");
  },

  updateLearningProgress: async (progressData) => {
    return await axiosInstance.put("/user/learning-progress", progressData);
  },

  // Flashcards
  getFlashcards: async (category = "all") => {
    return await axiosInstance.get(`/flashcards?category=${category}`);
  },

  markFlashcardAsLearned: async (flashcardId) => {
    return await axiosInstance.post(`/flashcards/${flashcardId}/learned`);
  },

  // Study Sessions
  startStudySession: async (sessionData) => {
    return await axiosInstance.post("/study-sessions/start", sessionData);
  },

  endStudySession: async (sessionId, results) => {
    return await axiosInstance.put(`/study-sessions/${sessionId}/end`, results);
  },

  getStudyHistory: async () => {
    return await axiosInstance.get("/study-sessions/history");
  },
};

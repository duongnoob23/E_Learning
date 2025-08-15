// Admin API - API calls cho Admin (e-learning)
import axiosInstance from "../../common/services/axiosInstance";

export const adminApi = {
  // User Management
  getUsers: async (params = {}) => {
    return await axiosInstance.get("/admin/users", { params });
  },

  getUserDetail: async (userId) => {
    return await axiosInstance.get(`/admin/users/${userId}`);
  },

  updateUser: async (userId, userData) => {
    return await axiosInstance.put(`/admin/users/${userId}`, userData);
  },

  deleteUser: async (userId) => {
    return await axiosInstance.delete(`/admin/users/${userId}`);
  },

  // Dashboard Statistics
  getDashboardStats: async () => {
    return await axiosInstance.get("/admin/dashboard/stats");
  },

  getLearningAnalytics: async (period = "week") => {
    return await axiosInstance.get(
      `/admin/dashboard/analytics?period=${period}`
    );
  },

  // Content Management
  getFlashcards: async (params = {}) => {
    return await axiosInstance.get("/admin/flashcards", { params });
  },

  createFlashcard: async (flashcardData) => {
    return await axiosInstance.post("/admin/flashcards", flashcardData);
  },

  updateFlashcard: async (flashcardId, flashcardData) => {
    return await axiosInstance.put(
      `/admin/flashcards/${flashcardId}`,
      flashcardData
    );
  },

  deleteFlashcard: async (flashcardId) => {
    return await axiosInstance.delete(`/admin/flashcards/${flashcardId}`);
  },

  // Study Sessions Monitoring
  getStudySessions: async (params = {}) => {
    return await axiosInstance.get("/admin/study-sessions", { params });
  },

  getSessionAnalytics: async (sessionId) => {
    return await axiosInstance.get(
      `/admin/study-sessions/${sessionId}/analytics`
    );
  },
};

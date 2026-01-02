import adminAxiosInstance from "./adminAuthApi";

/**
 * Statistics Admin API
 * Base path: /admin/statistics
 */
export const statisticsApi = {
  /**
   * Lấy thống kê tổng quan
   * GET /admin/statistics/overview
   */
  getOverview: async () => {
    const response = await adminAxiosInstance.get("/admin/statistics/overview");
    return response.data;
  },

  /**
   * Lấy thống kê người dùng
   * GET /admin/statistics/users
   * @param {string} period - day|week|month
   * @param {number} year - năm thống kê
   */
  getUserStats: async (period = "month", year = new Date().getFullYear()) => {
    const response = await adminAxiosInstance.get("/admin/statistics/users", {
      params: { period, year },
    });
    return response.data;
  },

  /**
   * Lấy thống kê khóa học
   * GET /admin/statistics/courses
   */
  getCourseStats: async () => {
    const response = await adminAxiosInstance.get("/admin/statistics/courses");
    return response.data;
  },

  /**
   * Lấy thống kê doanh thu
   * GET /admin/statistics/revenue
   * @param {number} year - năm thống kê
   */
  getRevenueStats: async (year = new Date().getFullYear()) => {
    const response = await adminAxiosInstance.get("/admin/statistics/revenue", {
      params: { year },
    });
    return response.data;
  },

  /**
   * Lấy thống kê bài thi
   * GET /admin/statistics/exams
   */
  getExamStats: async () => {
    const response = await adminAxiosInstance.get("/admin/statistics/exams");
    return response.data;
  },

  /**
   * Lấy thống kê từ vựng
   * GET /admin/statistics/vocabulary
   */
  getVocabularyStats: async () => {
    const response = await adminAxiosInstance.get("/admin/statistics/vocabulary");
    return response.data;
  },
};

export default statisticsApi;


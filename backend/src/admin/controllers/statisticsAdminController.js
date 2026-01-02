const statisticsService = require("../services/statisticsAdminService");

/**
 * GET /api/admin/statistics/overview
 * Lấy thống kê tổng quan
 */
exports.getOverviewStats = async (req, res) => {
  try {
    const result = await statisticsService.getOverviewStats();
    return res.status(result.EC === "0" ? 200 : 500).json(result);
  } catch (error) {
    console.error("Controller Error - getOverviewStats:", error);
    return res.status(500).json({
      EM: "Lỗi server",
      EC: "-1",
      DT: null,
    });
  }
};

/**
 * GET /api/admin/statistics/users
 * Lấy thống kê người dùng
 * Query: period (day|week|month), year
 */
exports.getUserStats = async (req, res) => {
  try {
    const { period = "month", year = new Date().getFullYear() } = req.query;
    const result = await statisticsService.getUserStats(period, parseInt(year));
    return res.status(result.EC === "0" ? 200 : 500).json(result);
  } catch (error) {
    console.error("Controller Error - getUserStats:", error);
    return res.status(500).json({
      EM: "Lỗi server",
      EC: "-1",
      DT: null,
    });
  }
};

/**
 * GET /api/admin/statistics/courses
 * Lấy thống kê khóa học
 */
exports.getCourseStats = async (req, res) => {
  try {
    const result = await statisticsService.getCourseStats();
    return res.status(result.EC === "0" ? 200 : 500).json(result);
  } catch (error) {
    console.error("Controller Error - getCourseStats:", error);
    return res.status(500).json({
      EM: "Lỗi server",
      EC: "-1",
      DT: null,
    });
  }
};

/**
 * GET /api/admin/statistics/revenue
 * Lấy thống kê doanh thu
 * Query: year
 */
exports.getRevenueStats = async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;
    const result = await statisticsService.getRevenueStats(parseInt(year));
    return res.status(result.EC === "0" ? 200 : 500).json(result);
  } catch (error) {
    console.error("Controller Error - getRevenueStats:", error);
    return res.status(500).json({
      EM: "Lỗi server",
      EC: "-1",
      DT: null,
    });
  }
};

/**
 * GET /api/admin/statistics/exams
 * Lấy thống kê bài thi
 */
exports.getExamStats = async (req, res) => {
  try {
    const result = await statisticsService.getExamStats();
    return res.status(result.EC === "0" ? 200 : 500).json(result);
  } catch (error) {
    console.error("Controller Error - getExamStats:", error);
    return res.status(500).json({
      EM: "Lỗi server",
      EC: "-1",
      DT: null,
    });
  }
};

/**
 * GET /api/admin/statistics/vocabulary
 * Lấy thống kê từ vựng
 */
exports.getVocabularyStats = async (req, res) => {
  try {
    const result = await statisticsService.getVocabularyStats();
    return res.status(result.EC === "0" ? 200 : 500).json(result);
  } catch (error) {
    console.error("Controller Error - getVocabularyStats:", error);
    return res.status(500).json({
      EM: "Lỗi server",
      EC: "-1",
      DT: null,
    });
  }
};


const express = require("express");
const router = express.Router();

const statisticsController = require("../controllers/statisticsAdminController");

/**
 * Statistics Admin Routes
 * Base path: /api/admin/statistics
 * 
 * Tất cả routes này đã được protect bởi adminAuthMiddleware
 * trong file adminRoutes.js
 */

/**
 * @route GET /api/admin/statistics/overview
 * @desc Lấy thống kê tổng quan (users, courses, exams, revenue, vocabulary)
 * @access Admin
 */
router.get("/overview", statisticsController.getOverviewStats);

/**
 * @route GET /api/admin/statistics/users
 * @desc Lấy thống kê người dùng chi tiết
 * @query period (day|week|month), year
 * @access Admin
 */
router.get("/users", statisticsController.getUserStats);

/**
 * @route GET /api/admin/statistics/courses
 * @desc Lấy thống kê khóa học chi tiết
 * @access Admin
 */
router.get("/courses", statisticsController.getCourseStats);

/**
 * @route GET /api/admin/statistics/revenue
 * @desc Lấy thống kê doanh thu chi tiết
 * @query year
 * @access Admin
 */
router.get("/revenue", statisticsController.getRevenueStats);

/**
 * @route GET /api/admin/statistics/exams
 * @desc Lấy thống kê bài thi chi tiết
 * @access Admin
 */
router.get("/exams", statisticsController.getExamStats);

/**
 * @route GET /api/admin/statistics/vocabulary
 * @desc Lấy thống kê từ vựng chi tiết
 * @access Admin
 */
router.get("/vocabulary", statisticsController.getVocabularyStats);

module.exports = router;


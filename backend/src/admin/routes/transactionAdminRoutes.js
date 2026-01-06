const express = require("express");
const router = express.Router();

const transactionController = require("../controllers/transactionAdminController");

/**
 * Transaction Admin Routes
 * Base path: /api/admin/transactions
 *
 * Tất cả routes này đã được protect bởi adminAuthMiddleware
 * trong file adminRoutes.js
 */

/**
 * @route GET /api/admin/transactions
 * @desc Lấy danh sách giao dịch (có pagination, filter, search)
 * @query page, limit, sort, order, payment_status, order_status, payment_method, from_date, to_date, search
 * @access Admin
 */
router.get("/", transactionController.getTransactions);

/**
 * @route GET /api/admin/transactions/stats
 * @desc Lấy thống kê giao dịch tổng quan
 * @access Admin
 */
router.get("/stats", transactionController.getTransactionStats);

/**
 * @route GET /api/admin/transactions/revenue
 * @desc Lấy thống kê doanh thu theo thời gian
 * @query period (day|week|month), year
 * @access Admin
 */
router.get("/revenue", transactionController.getRevenueByPeriod);

/**
 * @route GET /api/admin/transactions/export
 * @desc Xuất báo cáo giao dịch
 * @query from_date, to_date, payment_status, format
 * @access Admin
 */
router.get("/export", transactionController.exportTransactions);

/**
 * @route GET /api/admin/transactions/:order_id
 * @desc Lấy chi tiết một giao dịch
 * @access Admin
 */
router.get("/:order_id", transactionController.getTransactionDetail);

module.exports = router;


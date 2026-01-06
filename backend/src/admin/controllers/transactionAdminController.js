const transactionAdminService = require("../services/transactionAdminService");

// ==================== LẤY DANH SÁCH GIAO DỊCH ==================== //
exports.getTransactions = async (req, res, next) => {
  try {
    const response = await transactionAdminService.getTransactions(req.query);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// ==================== LẤY CHI TIẾT GIAO DỊCH ==================== //
exports.getTransactionDetail = async (req, res, next) => {
  try {
    const { order_id } = req.params;
    const response = await transactionAdminService.getTransactionDetail(order_id);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// ==================== THỐNG KÊ GIAO DỊCH ==================== //
exports.getTransactionStats = async (req, res, next) => {
  try {
    const response = await transactionAdminService.getTransactionStats();
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// ==================== THỐNG KÊ DOANH THU THEO THỜI GIAN ==================== //
exports.getRevenueByPeriod = async (req, res, next) => {
  try {
    const response = await transactionAdminService.getRevenueByPeriod(req.query);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// ==================== XUẤT BÁO CÁO ==================== //
exports.exportTransactions = async (req, res, next) => {
  try {
    const response = await transactionAdminService.exportTransactions(req.query);
    res.json(response);
  } catch (error) {
    next(error);
  }
};


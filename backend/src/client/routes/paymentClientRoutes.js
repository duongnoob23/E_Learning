const express = require("express");
const router = express.Router();

const controller = require("../controllers/paymentClientController");
const authMiddleware = require("../../middleware/authMiddleware");

/**
 * Payment – client
 *
 * === ORDER ===
 * - POST /order                - Tạo đơn hàng + payment URL (cần auth)
 * - GET  /orders               - Lấy lịch sử đơn hàng của user (cần auth)
 * - GET  /order/:orderNumber   - Lấy thông tin đơn hàng
 *
 * === VNPAY ===
 * - GET /vnpay_ipn             - VNPay IPN callback (server-to-server)
 * - GET /vnpay_return          - VNPay redirect user back (browser redirect)
 *
 * === LEGACY (ZaloPay) ===
 * - POST /zalopay/create_payment_url
 */

// === ORDER ROUTES ===
// Tạo đơn hàng mới + lấy payment URL
router.post("/order", authMiddleware, controller.createOrder);

// Lấy lịch sử đơn hàng của user đang đăng nhập
router.get("/orders", authMiddleware, controller.getMyOrders);

// Lấy thông tin đơn hàng theo order number
router.get("/order/:orderNumber", controller.getOrderByNumber);

// === VNPAY ROUTES ===
// VNPay IPN - Server-to-server callback
router.get("/vnpay_ipn", controller.vnpayIpn);

// VNPay Return - User redirect back from VNPay
router.get("/vnpay_return", controller.vnpayReturn);

// === LEGACY ROUTES ===
router.post("/zalopay/create_payment_url", authMiddleware, controller.createPaymentUrl);

module.exports = router;
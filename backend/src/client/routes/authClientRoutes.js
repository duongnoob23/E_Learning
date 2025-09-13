const express = require("express");
const router = express.Router();
const controller = require("../controllers/authClientController");
const Validator = require("../validators/authClientValidator");
const registerValidator = require("../validators/authClientValidator");
/**
 * Auth – client
 * - POST /register
 * - POST /login
 * - POST /refresh-token
 * - POST /logout
 * - POST /verify-email
 * - POST /forgot-password
 * - POST /reset-password
 */

// Đăng ký
router.post("/register" , Validator.registerValidator , controller.register );

// Đăng nhập
router.post("/login" ,Validator.loginValidator, controller.login );

// Làm mới token
router.post("/refresh-token", controller.refreshToken);

// Đăng xuất
router.post("/logout", (req, res) =>
  res.status(501).json({ message: "Not implemented" }));

// Xác thực email (từ email_verifications)
router.post("/verify-email", controller.verifyOtp);

// Quên mật khẩu (tạo password_reset_tokens)
router.post("/forgot-password", controller.forgetPassword);

// Đặt lại mật khẩu (xác thực reset_token)
router.patch("/reset-password", controller.resetPassword
);

module.exports = router;

const express = require("express");
const router = express.Router();
const controller = require("../controllers/authClientController");

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
router.post("/register", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);
// Đăng nhập
router.post("/login", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);
// Làm mới token
router.post("/refresh-token", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);
// Đăng xuất
router.post("/logout", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);
// Xác thực email (từ email_verifications)
router.post("/verify-email", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);
// Quên mật khẩu (tạo password_reset_tokens)
router.post("/forgot-password", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);
// Đặt lại mật khẩu (xác thực reset_token)
router.post("/reset-password", (req, res) =>
  res.status(501).json({ message: "Not implemented" })
);

module.exports = router;

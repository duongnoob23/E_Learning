const express = require("express");
const router = express.Router();
const profileClientController = require("../controllers/profileClientController");
const authMiddleware = require("../../middleware/authMiddleware");
const { body } = require("express-validator");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Cấu hình multer cho upload file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../../uploads/avatars/');

    // Tạo thư mục nếu chưa tồn tại
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, 'avatar-' + uniqueSuffix + fileExtension);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ cho phép upload file ảnh'), false);
    }
  }
});

// Validation rules
const updateProfileValidation = [
  body('full_name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Họ tên phải có từ 2-100 ký tự'),
  body('phone_number')
    .optional()
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Số điện thoại không hợp lệ'),
  body('avatar_url')
    .optional()
    .isURL()
    .withMessage('URL ảnh đại diện không hợp lệ')
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Mật khẩu hiện tại là bắt buộc'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu mới phải có ít nhất 6 ký tự')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Mật khẩu mới phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số'),
  body('confirmPassword')
    .notEmpty()
    .withMessage('Xác nhận mật khẩu là bắt buộc')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Xác nhận mật khẩu không khớp');
      }
      return true;
    })
];

const changeEmailValidation = [
  body('newEmail')
    .isEmail()
    .withMessage('Email mới không hợp lệ')
    .normalizeEmail(),
  body('currentPassword')
    .notEmpty()
    .withMessage('Mật khẩu hiện tại là bắt buộc')
];

const verifyOtpValidation = [
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  body('otp')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP phải có 6 ký tự')
    .isNumeric()
    .withMessage('OTP chỉ chứa số')
];

// Routes
router.get("/profile", authMiddleware, profileClientController.getProfile);
router.patch("/profile", authMiddleware, updateProfileValidation,upload.single('avatar'), profileClientController.updateProfile);
router.get("/stats", authMiddleware, profileClientController.getUserStats);
router.patch("/change-password", authMiddleware, changePasswordValidation, profileClientController.changePassword);
router.post("/upload-avatar", authMiddleware, upload.single('avatar'), profileClientController.uploadAvatar);
router.patch("/change-email", authMiddleware, changeEmailValidation, profileClientController.changeEmail);
router.post("/verify-email", verifyOtpValidation, profileClientController.verifyOtp);

module.exports = router;

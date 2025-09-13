const express = require("express");
const router = express.Router();
const profileClientController = require("../controllers/profileClientController");
const authMiddleware = require("../../middleware/authMiddleware");
const { body } = require("express-validator");
const multer = require("multer");


// Cấu hình multer cho upload file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/avatars/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + '-' + file.originalname);
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
    .withMessage('Mật khẩu mới phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số')
];

// Routes
router.get("/profile", authMiddleware, profileClientController.getProfile);
router.put("/profile", authMiddleware, updateProfileValidation, profileClientController.updateProfile);
router.get("/stats", authMiddleware, profileClientController.getUserStats);
router.put("/change-password", authMiddleware, changePasswordValidation, profileClientController.changePassword);
router.post("/upload-avatar", authMiddleware, upload.single('avatar'), profileClientController.uploadAvatar);

module.exports = router;

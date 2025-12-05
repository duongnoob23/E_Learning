const { sendOtpEmail } = require("../../utils/sendEmail");
const profileClientService = require("../services/profileClientService");
const { validationResult } = require("express-validator");

// [GET] Lấy thông tin profile của user hiện tại
exports.getProfile = async (req, res, next) => {
  try {
    console.log("getProfile controller - req.user:", req.user);
    const userId = req.user?.userId;
    console.log("getProfile controller - userId:", userId);

    if (!userId) {
      console.error("getProfile controller - userId is missing");
      return res.status(401).json({
        EM: "Không tìm thấy thông tin user",
        EC: "1",
        DT: null,
      });
    }

    const profile = await profileClientService.getUserProfile(userId);
    console.log("getProfile controller - profile result:", profile);
    res.json(profile);
  } catch (error) {
    console.error("getProfile controller error:", error);
    next(error);
  }
};

// [PATCH] Cập nhật thông tin profile
exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Lấy data client gửi
    const updateData = { ...req.body };

    // Nếu có file upload thì override avatar_url
    if (req.file) {
      console.log("Original file path:", req.file.path);
      console.log("File filename:", req.file.filename);
      // Tạo URL đơn giản
      const avatarUrl = `/uploads/avatars/${req.file.filename}`;
      console.log("Generated avatar URL:", avatarUrl);
      updateData.avatar_url = avatarUrl;
    }

    const updatedProfile = await profileClientService.updateUserProfile(
      userId,
      updateData
    );

    res.json(updatedProfile);
  } catch (error) {
    next(error);
  }
};

// [GET] Lấy thống kê của user
exports.getUserStats = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const stats = await profileClientService.getUserStats(userId);
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

// [PUT] Đổi mật khẩu
exports.changePassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    const result = await profileClientService.changePassword(
      userId,
      currentPassword,
      newPassword
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [POST] Upload avatar
exports.uploadAvatar = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const avatarUrl = req.file ? req.file.path : null;

    if (!avatarUrl) {
      return res.status(400).json({
        EM: "Không có file ảnh được upload",
        EC: "1",
        DT: null,
      });
    }

    const result = await profileClientService.updateUserProfile(userId, {
      avatar_url: avatarUrl,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [PATCH] Đổi email
exports.changeEmail = async (req, res, next) => {
  try {
    // Kiểm tra validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        EM: "Dữ liệu không hợp lệ",
        EC: "1",
        DT: errors.array(),
      });
    }

    const userId = req.user.userId;
    const { newEmail, currentPassword } = req.body;

    const result = await profileClientService.changeEmail(
      userId,
      newEmail,
      currentPassword
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// [POST] Xác thực OTP đổi email
exports.verifyOtp = async (req, res, next) => {
  try {
    // Kiểm tra validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        EM: "Dữ liệu không hợp lệ",
        EC: "1",
        DT: errors.array(),
      });
    }

    const { email, otp } = req.body;
    const response = await profileClientService.verifyOtp(email, otp);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

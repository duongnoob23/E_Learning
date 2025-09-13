const profileClientService = require("../services/profileClientService");
const { validationResult } = require("express-validator");

// [GET] Lấy thông tin profile của user hiện tại
exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const profile = await profileClientService.getUserProfile(userId);
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

// [PUT] Cập nhật thông tin profile
exports.updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const userId = req.user.userId;
    const { full_name, phone_number, avatar_url } = req.body;
    
    const updatedProfile = await profileClientService.updateUserProfile(
      userId,
      { full_name, phone_number, avatar_url }
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
        DT: null
      });
    }

    const result = await profileClientService.updateUserProfile(
      userId,
      { avatar_url: avatarUrl }
    );
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

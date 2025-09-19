const { User } = require("../../models");
const { CourseEnrollment } = require("../../models");
const { CourseWishlist } = require("../../models");
const { UserWord } = require("../../models");
const bcrypt = require("bcrypt");

// Lấy thông tin profile của user
exports.getUserProfile = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return {
        EM: "Không tìm thấy user",
        EC: "2",
        DT: null,
      };
    }

    const { password_hash, ...userWithoutPass } = user.toJSON();
    return {
      EM: "Lấy thông tin profile thành công",
      EC: "0",
      DT: userWithoutPass,
    };
  } catch (error) {
    console.error("Error in getUserProfile service:", error);
    return {
      EM: "Lỗi hệ thống khi lấy thông tin profile",
      EC: "-2",
      DT: null,
    };
  }
};

// Cập nhật thông tin profile
exports.updateUserProfile = async (userId, updateData) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return {
        EM: "Không tìm thấy user",
        EC: "2",
        DT: null,
      };
    }

    // Chỉ cho phép cập nhật một số trường nhất định
    const allowedFields = ['username', 'full_name', 'phone_number', 'avatar_url'];
    const updateFields = {};
    
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        updateFields[field] = updateData[field];
      }
    }

    await User.updateUser(userId, updateFields);
    
    // Lấy thông tin user đã cập nhật
    const updatedUser = await User.findById(userId);
    const { password_hash, ...userWithoutPass } = updatedUser.toJSON();

    return {
      EM: "Cập nhật profile thành công",
      EC: "0",
      DT: userWithoutPass,
    };
  } catch (error) {
    console.error("Error in updateUserProfile service:", error);
    return {
      EM: "Lỗi hệ thống khi cập nhật profile",
      EC: "-2",
      DT: null,
    };
  }
};

// Lấy thống kê của user
exports.getUserStats = async (userId) => {
  try {
    // Đếm số khóa học đã đăng ký
    const enrolledCourses = await CourseEnrollment.count({
      where: { user_id: userId }
    });

    // Đếm số khóa học đã hoàn thành
    const completedCourses = await CourseEnrollment.count({
      where: { 
        user_id: userId,
        status: 'completed'
      }
    });

    // Đếm số khóa học trong wishlist
    const wishlistItems = await CourseWishlist.count({
      where: { user_id: userId }
    });

    // Đếm số từ vựng đã học
    const totalWords = await UserWord.count({
      where: { 
        user_id: userId,
        is_active: true
      }
    });

    // Tính study streak (số ngày học liên tiếp)
    // Đây là logic đơn giản, có thể cải thiện dựa trên bảng study sessions
    const studyStreak = await calculateStudyStreak(userId);

    const stats = {
      enrolledCourses,
      completedCourses,
      wishlistItems,
      totalWords,
      studyStreak
    };

    return {
      EM: "Lấy thống kê thành công",
      EC: "0",
      DT: stats,
    };
  } catch (error) {
    console.error("Error in getUserStats service:", error);
    return {
      EM: "Lỗi hệ thống khi lấy thống kê",
      EC: "-2",
      DT: null,
    };
  }
};

// Đổi mật khẩu
exports.changePassword = async (userId, currentPassword, newPassword) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return {
        EM: "Không tìm thấy user",
        EC: "2",
        DT: null,
      };
    }

    // Kiểm tra mật khẩu hiện tại
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isCurrentPasswordValid) {
      return {
        EM: "Mật khẩu hiện tại không đúng",
        EC: "2",
        DT: null,
      };
    }

    // Hash mật khẩu mới
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    
    // Cập nhật mật khẩu
    await User.updateUser(userId, { password_hash: newPasswordHash });

    return {
      EM: "Đổi mật khẩu thành công",
      EC: "0",
      DT: null,
    };
  } catch (error) {
    console.error("Error in changePassword service:", error);
    return {
      EM: "Lỗi hệ thống khi đổi mật khẩu",
      EC: "-2",
      DT: null,
    };
  }
};

// Hàm tính study streak (có thể cải thiện sau)
const calculateStudyStreak = async (userId) => {
  try {
    // Logic đơn giản: giả sử user học ít nhất 1 từ mỗi ngày
    // Có thể cải thiện bằng cách sử dụng bảng study sessions
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Đếm số ngày có hoạt động học trong 30 ngày gần nhất
    const recentWords = await UserWord.count({
      where: {
        user_id: userId,
        created_at: {
          [require('sequelize').Op.gte]: thirtyDaysAgo
        }
      }
    });

    // Trả về số ngày học liên tiếp (logic đơn giản)
    return Math.min(Math.floor(recentWords / 5), 30); // Giả sử 5 từ/ngày
  } catch (error) {
    console.error("Error calculating study streak:", error);
    return 0;
  }
};

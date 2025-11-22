const { User } = require("../../models");
const { CourseEnrollment } = require("../../models");
const { CourseWishlist } = require("../../models");
const { UserWord } = require("../../models");
const { EmailVerification } = require("../../models");
const bcrypt = require("bcrypt");
const {sendOtpEmail } = require("../../utils/sendEmail");

// Sinh OTP ngẫu nhiên
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}


// Lấy thông tin profile của user
exports.getUserProfile = async (userId) => {
  try {
    console.log("getUserProfile - userId:", userId);
    console.log("getUserProfile - User model:", User);
    console.log("getUserProfile - User.findbyId:", typeof User.findbyId);
    
    if (!userId) {
      console.error("getUserProfile - userId is null or undefined");
      return {
        EM: "User ID không hợp lệ",
        EC: "2",
        DT: null,
      };
    }

    // Dùng findOne trực tiếp để tránh lỗi với findbyId
    const user = await User.findOne({ 
      where: { user_id: userId },
      attributes: { exclude: ["password_hash"] }
    });
    console.log("getUserProfile - user result:", user ? "Found" : "Not found");
    
    if (!user) {
      return {
        EM: "Không tìm thấy user",
        EC: "2",
        DT: null,
      };
    }

    const { password_hash, ...userWithoutPass } = user.toJSON();
    console.log("getUserProfile - success, returning user data");
    return {
      EM: "Lấy thông tin profile thành công",
      EC: "0",
      DT: userWithoutPass,
    };
  } catch (error) {
    console.error("Error in getUserProfile service:", error);
    console.error("Error stack:", error.stack);
    console.error("Error message:", error.message);
    return {
      EM: "Lỗi hệ thống khi lấy thông tin profile: " + error.message,
      EC: "-2",
      DT: null,
    };
  }
};

// Cập nhật thông tin profile
exports.updateUserProfile = async (userId, updateData) => {
  try {
    const user = await User.findOne({ 
      where: { user_id: userId },
      attributes: { exclude: ["password_hash"] }
    });
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
    const updatedUser = await User.findOne({ 
      where: { user_id: userId },
      attributes: { exclude: ["password_hash"] }
    });
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
    // Cần password_hash nên không dùng findbyId (exclude password_hash)
    const user = await User.findOne({ where: { user_id: userId } });
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

// Đổi email
exports.changeEmail = async (userId, newEmail, currentPassword) => {
  try {
    // Cần password_hash nên không dùng findbyId (exclude password_hash)
    const user = await User.findOne({ where: { user_id: userId } });
    if (!user) {
      return {
        EM: "Không tìm thấy user",
        EC: "2",
        DT: null,
      };
    }

    // Kiểm tra email hiện tại
    if (user.email === newEmail) {
      return {
        EM: "Email mới trùng với email hiện tại",
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

    // Tạo OTP xác thực email mới
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

    await EmailVerification.createVerification({
      user_id: userId,
      email: newEmail,
      verification_token: otp,
      expires_at: expiresAt,
    });

    // Gửi OTP qua email
    await sendOtpEmail(newEmail, otp);

    return {
      EM: "Vui lòng kiểm tra email để lấy OTP.",
      EC: "0",
      DT: { otp },
    };
  } catch (error) {
    console.error("Lỗi trong changeEmail service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình đổi email",
      EC: "-2",
      DT: null,
    };
  }
};

// Xác thực OTP đổi email
exports.verifyOtp = async (email, otp) => {
  try {
    const emailVerification = await EmailVerification.findValidVerification(
      email,
      otp
    );  

    if (!emailVerification) {
      return {
        EM: "Mã OTP không hợp lệ hoặc đã hết hạn",
        EC: "2",
        DT: null,
      };
    }

    // Cập nhật email cho user với email mới từ verification record
    await User.updateUser(emailVerification.user_id, { email: emailVerification.email });

    // Đánh dấu đã xác thực
    await EmailVerification.markAsVerified(emailVerification.verification_id);

    return {
      EM: "Xác thực thành công!",
      EC: "0",
      DT: null,
    };
  } catch (error) {
    console.error("Lỗi trong verifyOtp service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình xác thực OTP",
      EC: "-2",
      DT: null,
    };
  }
};

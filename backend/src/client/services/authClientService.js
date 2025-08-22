const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sequelize = require("../../config/database");
const { QueryTypes } = require("sequelize");
const { User } = require("../../models");

// Tìm user theo email
exports.login = async (email, password) => {
  try {
    // Tìm user theo email
    const user = await User.findByEmail(email);
    if (!user) {
      return {
        EM: "Email không tồn tại",
        EC: "2", // Lỗi nghiệp vụ ở service
        DT: null,
      };
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return {
        EM: "Mật khẩu không đúng",
        EC: "2", // Lỗi nghiệp vụ ở service
        DT: null,
      };
    }

    // Tạo Access Token (ngắn hạn, encode user_id và email)
    const accessToken = jwt.sign(
      { sub: user.user_id, email: user.email }, // Payload: sub (user_id), email
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Expires in 1 giờ
    );

    // Tạo Refresh Token (dài hạn, encode chỉ sub để đơn giản)
    const refreshToken = jwt.sign(
      { sub: user.user_id }, // Payload: chỉ sub (user_id)
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, // Có thể dùng secret khác cho refresh
      { expiresIn: "7d" } // Expires in 7 ngày
    );

    // Thông tin user (loại trừ password_hash và các thông tin nhạy cảm)
    const userInfo = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      phone_number: user.phone_number,
      avatar_url: user.avatar_url,
      status: user.status,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    // Trả về response theo format chuẩn
    return {
      EM: "Đăng nhập thành công",
      EC: "0", // Thành công
      DT: {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: userInfo,
      },
    };
  } catch (error) {
    // Xử lý lỗi hệ thống trong service
    return {
      EM: error.message || "Lỗi hệ thống trong service",
      EC: "-2", // Lỗi hệ thống ở service
      DT: null,
    };
  }
};

exports.register = async (
  username,
  email,
  password,
  fullName,
  phoneNumber,
  avatarUrl
) => {
  try {
    // Kiểm tra username đã tồn tại
    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      return {
        EM: "Tên người dùng đã tồn tại",
        EC: "2", // Lỗi nghiệp vụ ở service
        DT: null,
      };
    }

    // Kiểm tra email đã tồn tại
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      return {
        EM: "Email đã tồn tại",
        EC: "2", // Lỗi nghiệp vụ ở service
        DT: null,
      };
    }

    // Hash mật khẩu
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Tạo user mới
    const user = await User.createUser({
      username,
      email,
      password_hash: passwordHash,
      full_name: fullName,
      phone_number: phoneNumber,
      avatar_url: avatarUrl,
      status: "active", // Giả định mặc định
    });

    // Trả về response
    return {
      EM: "Đăng ký thành công",
      EC: "0", // Thành công
      DT: { userId: user.user_id, email: user.email },
    };
  } catch (error) {
    return {
      EM: error.message || "Lỗi hệ thống trong service",
      EC: "-2", // Lỗi hệ thống ở service
      DT: null,
    };
  }
};

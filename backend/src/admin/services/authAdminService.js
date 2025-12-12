const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User, Role, RefreshToken } = require("../../models");
const crypto = require("crypto");

/**
 * Admin Login Service
 * Chỉ cho phép user có role 'admin' hoặc 'super_admin' đăng nhập
 */
exports.login = async (email, password, ipAddress, userAgent) => {
  try {
    // Tìm user theo email
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          as: "roles",
          through: { attributes: [] },
          attributes: ["role_id", "role_name"],
        },
      ],
    });

    if (!user) {
      return {
        EM: "Email không tồn tại",
        EC: "2",
        DT: null,
      };
    }

    // Kiểm tra password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return {
        EM: "Mật khẩu không đúng",
        EC: "2",
        DT: null,
      };
    }

    // Kiểm tra user có role admin không
    const adminRoles = ["admin"];
    const userRoles = user.roles ? user.roles.map((r) => r.role_name) : [];
    const isAdmin = userRoles.some((role) => adminRoles.includes(role));

    if (!isAdmin) {
      return {
        EM: "Bạn không có quyền truy cập trang quản trị",
        EC: "3",
        DT: null,
      };
    }

    // Kiểm tra trạng thái tài khoản
    if (user.status === "banned" || user.status === "inactive") {
      return {
        EM: "Tài khoản đã bị khóa hoặc không hoạt động",
        EC: "4",
        DT: null,
      };
    }

    // Tạo access token
    const accessToken = jwt.sign(
      {
        userId: user.user_id,
        email: user.email,
        roles: userRoles,
        isAdmin: true,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" } 
    );

    // Tạo refresh token
    const refreshTokenValue = crypto.randomBytes(64).toString("hex");
    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshTokenValue)
      .digest("hex");

    // Lưu refresh token vào database
    await RefreshToken.create({
      user_id: user.user_id,
      token_hash: refreshTokenHash,
      ip_address: ipAddress || null,
      user_agent: userAgent || null,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 ngày
    });

    // Loại bỏ password_hash khỏi response
    const { password_hash, ...userWithoutPass } = user.toJSON();

    return {
      EM: "Đăng nhập admin thành công",
      EC: "0",
      DT: {
        accessToken,
        refreshToken: refreshTokenValue,
        user: {
          ...userWithoutPass,
          roles: userRoles,
        },
      },
    };
  } catch (error) {
    console.error("Admin login service error:", error);
    return {
      EM: "Lỗi hệ thống, vui lòng thử lại sau",
      EC: "-2",
      DT: null,
    };
  }
};

/**
 * Admin Logout Service
 * Revoke refresh token
 */
exports.logout = async (userId, refreshToken) => {
  try {
    if (refreshToken) {
      const tokenHash = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

      await RefreshToken.update(
        { is_revoked: true },
        {
          where: {
            user_id: userId,
            token_hash: tokenHash,
          },
        }
      );
    }

    return {
      EM: "Đăng xuất thành công",
      EC: "0",
      DT: null,
    };
  } catch (error) {
    console.error("Admin logout service error:", error);
    return {
      EM: "Lỗi hệ thống khi đăng xuất",
      EC: "-2",
      DT: null,
    };
  }
};

/**
 * Refresh Token Service cho Admin
 */
exports.refreshToken = async (refreshToken) => {
  try {
    if (!refreshToken) {
      return {
        EM: "Refresh token không được cung cấp",
        EC: "1",
        DT: null,
      };
    }

    const tokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    // Tìm refresh token trong database
    const storedToken = await RefreshToken.findOne({
      where: {
        token_hash: tokenHash,
        is_revoked: false,
      },
    });

    if (!storedToken) {
      return {
        EM: "Refresh token không hợp lệ hoặc đã hết hạn",
        EC: "2",
        DT: null,
      };
    }

    // Kiểm tra hết hạn
    if (new Date() > storedToken.expires_at) {
      await RefreshToken.update(
        { is_revoked: true },
        { where: { token_id: storedToken.token_id } }
      );
      return {
        EM: "Refresh token đã hết hạn",
        EC: "2",
        DT: null,
      };
    }

    // Lấy user với roles
    const user = await User.findOne({
      where: { user_id: storedToken.user_id },
      include: [
        {
          model: Role,
          as: "roles",
          through: { attributes: [] },
          attributes: ["role_id", "role_name"],
        },
      ],
    });

    if (!user) {
      return {
        EM: "User không tồn tại",
        EC: "2",
        DT: null,
      };
    }

    const userRoles = user.roles ? user.roles.map((r) => r.role_name) : [];

    // Tạo access token mới
    const newAccessToken = jwt.sign(
      {
        userId: user.user_id,
        email: user.email,
        roles: userRoles,
        isAdmin: true,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return {
      EM: "Làm mới token thành công",
      EC: "0",
      DT: {
        accessToken: newAccessToken,
      },
    };
  } catch (error) {
    console.error("Admin refresh token service error:", error);
    return {
      EM: "Lỗi hệ thống khi làm mới token",
      EC: "-2",
      DT: null,
    };
  }
};


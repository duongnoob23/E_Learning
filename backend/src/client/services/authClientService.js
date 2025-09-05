const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../../models");
const { EmailOtp } = require("../../models");
const { sendOtpEmail } = require("../../utils/sendEmail");

// Sinh OTP ngẫu nhiên
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
// Đăng nhập
exports.login = async (email, password) => {
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return {
        EM: "Email không tồn tại",
        EC: "2",
        DT: null
      };
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return {
        EM: "Mật khẩu không đúng",
        EC: "2",
        DT: null
      };
    }

    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const { password_hash, ...userWithoutPass } = user.toJSON();

    return {
      EM: "Đăng nhập thành công",
      EC: "0",
      DT: {
        token,
        user: userWithoutPass
      }
    };
  } catch (error) {
    console.error("Login service error:", error);
    return {
      EM: "Lỗi hệ thống, vui lòng thử lại sau",
      EC: "-2", // lỗi hệ thống
      DT: null
    };
  }
};

exports.forgetPassword = async (email) => {
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return {
        EM: "Email không tồn tại",
        EC: "2", // lỗi nghiệp vụ
        DT: null
      };
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

    await EmailOtp.createOtp({ email, otp, expires_at: expiresAt });
    await sendOtpEmail(email, otp);

    return {
      EM: "Vui lòng kiểm tra email để lấy OTP.",
      EC: "0", // thành công
      DT: { otp } // nếu bạn muốn ẩn OTP khi trả về FE thì bỏ đi
    };
  } catch (error) {
    console.error("Lỗi trong forgetPassword service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình xử lý quên mật khẩu",
      EC: "-2", // lỗi hệ thống
      DT: null
    };
  }
};

// Thay đổi mật khẩu
exports.changePassword = async (email, newPassword) => {
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return {
        EM: "Email không tồn tại",
        EC: "2", // lỗi nghiệp vụ
        DT: null
      };
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await User.updateUser(user.user_id, { password_hash: passwordHash });

    return {
      EM: "Đổi mật khẩu thành công.",
      EC: "0", // success
      DT: null
    };
  } catch (error) {
    console.error("Lỗi trong changePassword service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình đổi mật khẩu",
      EC: "-2", // lỗi hệ thống
      DT: null
    };
  }
};

// module Đăng kí
// Đăng ký
exports.register = async (username, email, password, fullName, phoneNumber, avatarUrl) => {
  try {
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      return {
        EM: "Email đã tồn tại",
        EC: "2", // lỗi nghiệp vụ
        DT: null
      };
    }

    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      return {
        EM: "Username đã tồn tại",
        EC: "2",
        DT: null
      };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Tạo user với trạng thái "unverified"
    await User.createUser({
      username,
      email,
      password_hash: passwordHash,
      full_name: fullName || null,
      phone_number: phoneNumber || null,
      avatar_url: avatarUrl || null,
      status: "unverified"
    });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 phút
    await EmailOtp.createOtp({ email, otp, expires_at: expiresAt });
    await sendOtpEmail(email, otp);

    return {
      EM: "Đăng ký thành công, vui lòng kiểm tra email để xác thực OTP.",
      EC: "0", // success
      DT: { otp } // có thể bỏ `otp` nếu không muốn trả ra FE
    };
  } catch (error) {
    console.error("Lỗi trong register service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình đăng ký",
      EC: "-2", // lỗi hệ thống
      DT: null
    };
  }
};

// Xác thực OTP
exports.verifyOtp = async (email, otp, type) => {
  try {
    const emailOtp = await EmailOtp.findOne({
      where: {
        email,
        otp,
        expires_at: { [Op.gt]: new Date() }
      }
    });

    if (!emailOtp) {
      return {
        EM: "Mã OTP không hợp lệ hoặc đã hết hạn",
        EC: "2", // lỗi nghiệp vụ
        DT: null
      };
    }

    // Nếu OTP cho đăng ký thì kích hoạt tài khoản
    if (type === "register") {
      const user = await User.findByEmail(email);
      if (user) {
        await User.updateUser(user.user_id, { status: "active" });
      }
    }

    // Xoá OTP sau khi sử dụng
    await EmailOtp.destroy({ where: { email } });

    return {
      EM: "Xác thực thành công, bạn đã đăng ký!",
      EC: "0", // success
      DT: null
    };
  } catch (error) {
    console.error("Lỗi trong verifyOtp service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình xác thực OTP",
      EC: "-2", // lỗi hệ thống
      DT: null
    };
  }
};
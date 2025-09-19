const authClientService = require("../services/authClientService");
const { validationResult } = require("express-validator");

const validateRegister = (data) => {
  const { username, email, password, fullName, phoneNumber, avatarUrl } = data;
  const errors = {};

  if (!username || username.trim().length < 3) {
    errors.username = ["Username phải có ít nhất 3 ký tự"];
  }

  if (!email) {
    errors.email = ["Email là bắt buộc"];
  } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    errors.email = ["Email không hợp lệ"];
  }

  if (!password) {
    errors.password = ["Password là bắt buộc"];
  } else if (password.length < 6) {
    errors.password = ["Password phải có ít nhất 6 ký tự"];
  }

  if (phoneNumber && !/^\d{10,11}$/.test(phoneNumber)) {
    errors.phoneNumber = ["Số điện thoại phải có 10–11 chữ số"];
  }

  return errors;
};

// [POST] client đăng nhập
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const token = await authClientService.login(email, password);
    res.json(token);
  } catch (error) {
    next(error);
  }
};

// [POST] client đăng ký
exports.register = async (req, res, next) => {
  try {
    const { username, email, password, fullName, phoneNumber, avatarUrl } =
      req.body;

    const token = await authClientService.register(
      username,
      email,
      password,
      fullName || null,
      phoneNumber || null,
      avatarUrl || null
    );

    res.json(token);
  } catch (error) {
    next(error);
  }
};

// [POST] client xác thực OTP
exports.verifyOtp = async (req, res, next) => {
  try {
    const type = req.params.type;
    const { email, otp } = req.body;
    console.log("run1");

    const response = await authClientService.verifyOtp(email, otp, type);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// [POST] client quên mật khẩu
exports.forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const response = await authClientService.forgetPassword(email);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// [POST] client làm mới token
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const response = await authClientService.refreshToken(refreshToken);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// [POST] change password
exports.resetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const response = await authClientService.resetPassword(email);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// module.exports = { validateRegister }; // Commented out - this was causing the error

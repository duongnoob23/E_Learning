const authClientService = require("../services/authClientService");
const { validationResult } = require("express-validator");
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() }); 
    }

    const {
      username,
      email,
      password,
      fullName,
      phoneNumber,
      avatarUrl
    } = req.body;

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




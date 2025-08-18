const authClientService = require("../services/authClientService");

// [POST] client đăng nhập
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const token = await authClientService.login(email, password);
    res.json( token );
  } catch (error) {
    next(error);
  }
};

// [POST] client đăng ký
exports.register = async (req, res, next) => {
  try {
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


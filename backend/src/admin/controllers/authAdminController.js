const authAdminService = require("../services/authAdminService");

/**
 * [POST] /api/admin/auth/login
 * Đăng nhập admin
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        EM: "Email và mật khẩu là bắt buộc",
        EC: "1",
        DT: null,
      });
    }

    const ipAddress =
      req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const userAgent = req.headers["user-agent"];

    const response = await authAdminService.login(
      email,
      password,
      ipAddress,
      userAgent
    );
    if (response.EC !== "0") {
      return res.status(401).json(response);
    }

    res.json(response);
  } catch (error) {
    console.error("Admin login controller error:", error);
    next(error);
  }
};

/**
 * [POST] /api/admin/auth/logout
 * Đăng xuất admin
 */
exports.logout = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { refreshToken } = req.body;

    if (!userId) {
      return res.status(401).json({
        EM: "Unauthorized - Vui lòng đăng nhập",
        EC: "-1",
        DT: null,
      });
    }

    const response = await authAdminService.logout(userId, refreshToken);
    res.json(response);
  } catch (error) {
    console.error("Admin logout controller error:", error);
    next(error);
  }
};

/**
 * [POST] /api/admin/auth/refresh-token
 * Làm mới access token cho admin
 */
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        EM: "Refresh token là bắt buộc",
        EC: "1",
        DT: null,
      });
    }

    const response = await authAdminService.refreshToken(refreshToken);

    if (response.EC !== "0") {
      return res.status(401).json(response);
    }

    res.json(response);
  } catch (error) {
    console.error("Admin refresh token controller error:", error);
    next(error);
  }
};



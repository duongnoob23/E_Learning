const authAdminService = require("../services/authAdminService");

/**
 * [POST] /api/admin/auth/login
 * Đăng nhập admin
 */
exports.login = async (req, res, next) => {
  try {
    console.log("=".repeat(50));
    console.log("🔐 [ADMIN LOGIN] Request received");
    console.log("=".repeat(50));
    console.log("📍 Origin:", req.headers.origin);
    console.log("📍 Referer:", req.headers.referer);
    console.log("📍 IP:", req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress);
    console.log("📍 User-Agent:", req.headers["user-agent"]);
    console.log("📍 Method:", req.method);
    console.log("📍 URL:", req.originalUrl);
    console.log("📍 Body:", { email: req.body?.email, password: req.body?.password ? "***" : undefined });
    
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      console.log("❌ [ADMIN LOGIN] Missing email or password");
      return res.status(400).json({
        EM: "Email và mật khẩu là bắt buộc",
        EC: "1",
        DT: null,
      });
    }

    const ipAddress =
      req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const userAgent = req.headers["user-agent"];

    console.log("🔄 [ADMIN LOGIN] Calling authAdminService.login...");
    const response = await authAdminService.login(
      email,
      password,
      ipAddress,
      userAgent
    );
    
    console.log("📤 [ADMIN LOGIN] Service response:", {
      EC: response.EC,
      EM: response.EM,
      hasToken: !!response.DT?.accessToken,
      hasUser: !!response.DT?.user,
    });
    
    if (response.EC !== "0") {
      console.log("❌ [ADMIN LOGIN] Login failed:", response.EM);
      return res.status(401).json(response);
    }

    console.log("✅ [ADMIN LOGIN] Login successful for:", email);
    console.log("=".repeat(50));
    res.json(response);
  } catch (error) {
    console.error("❌ [ADMIN LOGIN] Controller error:", error);
    console.error("❌ [ADMIN LOGIN] Error stack:", error.stack);
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



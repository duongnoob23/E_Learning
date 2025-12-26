const jwt = require("jsonwebtoken");
const { User, Role } = require("../../models");

/**
 * Middleware xác thực admin
 * Kiểm tra JWT token và xác nhận user có role admin
 */
const adminAuthMiddleware = async (req, res, next) => {
  try {
    // Lấy token từ header
    const authHeader =
      req.headers["authorization"] || req.headers["Authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error(
        `[ADMIN AUTH] 401 - Missing token | ${req.method} ${req.originalUrl}`
      );
      return res.status(401).json({
        EM: "Unauthorized - Token không được cung cấp",
        EC: "401",
        DT: null,
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      console.error(
        `[ADMIN AUTH] 401 - Empty token | ${req.method} ${req.originalUrl}`
      );
      return res.status(401).json({
        EM: "Unauthorized - Token rỗng",
        EC: "401",
        DT: null,
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kiểm tra isAdmin flag trong token
    if (!decoded.isAdmin) {
      console.error(
        `[ADMIN AUTH] 403 - Not admin token | User ${decoded.userId} | ${req.method} ${req.originalUrl}`
      );
      return res.status(403).json({
        EM: "Forbidden - Token không phải của admin",
        EC: "403",
        DT: null,
      });
    }

    // Lưu thông tin user vào request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      roles: decoded.roles || [],
      isAdmin: decoded.isAdmin,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.error(
        `[ADMIN AUTH] 401 - Token expired | ${req.method} ${req.originalUrl}`
      );
      return res.status(401).json({
        EM: "Token đã hết hạn",
        EC: "401",
        DT: null,
      });
    }

    if (error.name === "JsonWebTokenError") {
      console.error(
        `[ADMIN AUTH] 401 - Invalid token | ${req.method} ${req.originalUrl} | ${error.message}`
      );
      return res.status(401).json({
        EM: "Token không hợp lệ",
        EC: "401",
        DT: null,
      });
    }

    console.error(
      `[ADMIN AUTH] 500 - Error | ${req.method} ${req.originalUrl} | ${error.message}`
    );
    return res.status(500).json({
      EM: "Lỗi xác thực",
      EC: "-2",
      DT: null,
    });
  }
};

/**
 * Middleware kiểm tra role admin cụ thể
 * Dùng sau adminAuthMiddleware để kiểm tra role chi tiết hơn
 * @param {string|string[]} allowedRoles - Các role được phép (mặc định: ['admin', 'super_admin'])
 */
const requireAdminRole = (allowedRoles = ["admin", "super_admin"]) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.userId) {
        return res.status(401).json({
          EM: "Unauthorized - Vui lòng đăng nhập",
          EC: "-1",
          DT: null,
        });
      }

      // Lấy roles từ database để đảm bảo chính xác
      const user = await User.findByPk(req.user.userId, {
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
        return res.status(401).json({
          EM: "User không tồn tại",
          EC: "-1",
          DT: null,
        });
      }

      const userRoles = user.roles ? user.roles.map((r) => r.role_name) : [];
      const rolesToCheck = Array.isArray(allowedRoles)
        ? allowedRoles
        : [allowedRoles];

      const hasRole = rolesToCheck.some((role) => userRoles.includes(role));

      if (!hasRole) {
        console.error(
          `[ADMIN AUTH] 403 - User ${req.user.userId} has roles [${userRoles.join(", ")}] but needs [${rolesToCheck.join(", ")}] | ${req.method} ${req.originalUrl}`
        );
        return res.status(403).json({
          EM: `Forbidden - Bạn cần quyền: ${rolesToCheck.join(" hoặc ")}`,
          EC: "-1",
          DT: null,
        });
      }

      // Cập nhật roles trong request
      req.user.roles = userRoles;
      next();
    } catch (error) {
      console.error(
        `[ADMIN AUTH] 500 - Role check error | ${req.method} ${req.originalUrl} | ${error.message}`
      );
      return res.status(500).json({
        EM: "Lỗi kiểm tra quyền admin",
        EC: "-2",
        DT: null,
      });
    }
  };
};



module.exports = {
  adminAuthMiddleware,
  requireAdminRole,
};

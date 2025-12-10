const { User, Role, Permission, RolePermission } = require("../models");

/**
 * Middleware phân quyền - Kiểm tra user có quyền thực hiện action không
 * @param {string|string[]} requiredPermissions - Permission name(s) cần có
 * @returns {Function} Express middleware
 */
const authorize = (requiredPermissions) => {
  return async (req, res, next) => {
    try {
      // Kiểm tra user đã được authenticate
      if (!req.user || !req.user.userId) {
        console.error(`[AUTH] 401 - Missing user in request | ${req.method} ${req.originalUrl}`);
        return res.status(401).json({
          EM: "Unauthorized - Vui lòng đăng nhập",
          EC: "-1",
          DT: null,
        });
      }

      const userId = req.user.userId;

      // Lấy user với roles
      const user = await User.findByPk(userId, {
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
        console.error(`[AUTH] 401 - User ${userId} không tồn tại | ${req.method} ${req.originalUrl}`);
        return res.status(401).json({
          EM: "User không tồn tại",
          EC: "-1",
          DT: null,
        });
      }

      // Nếu user không có role nào
      if (!user.roles || user.roles.length === 0) {
        console.error(`[AUTH] 403 - User ${userId} không có role | ${req.method} ${req.originalUrl}`);
        return res.status(403).json({
          EM: "Forbidden - User không có quyền hạn",
          EC: "-1",
          DT: null,
        });
      }

      // Lấy tất cả permissions của user từ các roles
      const roleIds = user.roles.map((r) => r.role_id);

      const rolePermissions = await RolePermission.findAll({
        where: { role_id: roleIds },
        include: [
          {
            model: Permission,
            as: "permission",
            attributes: ["permission_id", "permission_name"],
          },
        ],
      });

      const userPermissions = rolePermissions.map(
        (rp) => rp.permission.permission_name
      );

      // Chuyển requiredPermissions thành array nếu là string
      const permissionsToCheck = Array.isArray(requiredPermissions)
        ? requiredPermissions
        : [requiredPermissions];

      // Kiểm tra user có ít nhất 1 permission cần thiết
      const hasPermission = permissionsToCheck.some((perm) =>
        userPermissions.includes(perm)
      );

      if (!hasPermission) {
        console.error(`[AUTH] 403 - User ${userId} có permissions [${userPermissions.join(", ")}] nhưng cần [${permissionsToCheck.join(", ")}] | ${req.method} ${req.originalUrl}`);
        return res.status(403).json({
          EM: `Forbidden - Bạn không có quyền: ${permissionsToCheck.join(", ")}`,
          EC: "-1",
          DT: null,
        });
      }

      // Lưu user info vào request để dùng ở controller
      req.user.roles = user.roles;
      req.user.permissions = userPermissions;

      next();
    } catch (error) {
      console.error(`[AUTH] 500 - Authorization error | ${req.method} ${req.originalUrl} | ${error.message}`);
      console.error(error.stack);
      return res.status(500).json({
        EM: "Lỗi kiểm tra quyền hạn",
        EC: "-2",
        DT: null,
      });
    }
  };
};

/**
 * Middleware kiểm tra role - Đơn giản hơn, chỉ kiểm tra role_name
 * @param {string|string[]} requiredRoles - Role name(s) cần có
 * @returns {Function} Express middleware
 */
const authorizeByRole = (requiredRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.userId) {
        console.error(`[AUTH] 401 - Missing user in request (authorizeByRole) | ${req.method} ${req.originalUrl}`);
        return res.status(401).json({
          EM: "Unauthorized - Vui lòng đăng nhập",
          EC: "-1",
          DT: null,
        });
      }

      const userId = req.user.userId;

      const user = await User.findByPk(userId, {
        include: [
          {
            model: Role,
            as: "roles",
            through: { attributes: [] },
            attributes: ["role_name"],
          },
        ],
      });

      if (!user || !user.roles || user.roles.length === 0) {
        console.error(`[AUTH] 403 - User ${userId} không có role | ${req.method} ${req.originalUrl}`);
        return res.status(403).json({
          EM: "Forbidden - User không có role",
          EC: "-1",
          DT: null,
        });
      }

      const userRoles = user.roles.map((r) => r.role_name);
      const rolesToCheck = Array.isArray(requiredRoles)
        ? requiredRoles
        : [requiredRoles];

      const hasRole = rolesToCheck.some((role) => userRoles.includes(role));

      if (!hasRole) {
        console.error(`[AUTH] 403 - User ${userId} có roles [${userRoles.join(", ")}] nhưng cần [${rolesToCheck.join(", ")}] | ${req.method} ${req.originalUrl}`);
        return res.status(403).json({
          EM: `Forbidden - Bạn cần role: ${rolesToCheck.join(", ")}`,
          EC: "-1",
          DT: null,
        });
      }

      req.user.roles = userRoles;
      next();
    } catch (error) {
      console.error(`[AUTH] 500 - Role authorization error | ${req.method} ${req.originalUrl} | ${error.message}`);
      console.error(error.stack);
      return res.status(500).json({
        EM: "Lỗi kiểm tra role",
        EC: "-2",
        DT: null,
      });
    }
  };
};

module.exports = {
  authorize,
  authorizeByRole,
};


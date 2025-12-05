const { User, Role } = require("../models");

/**
 * Middleware kiểm tra user có quyền sở hữu resource không
 * Cho phép: Admin hoặc chủ sở hữu resource
 * @param {string} resourceOwnerField - Tên field chứa user_id của chủ sở hữu (vd: 'user_id', 'created_by')
 * @param {string} paramName - Tên param trong URL (vd: 'user_id', 'word_id')
 * @param {Function} getOwnerIdFn - Hàm lấy owner_id từ resource (nếu cần query DB)
 * @returns {Function} Express middleware
 */
const checkOwnership = (resourceOwnerField, paramName, getOwnerIdFn = null) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          EM: "Unauthorized",
          EC: "-1",
          DT: null,
        });
      }

      // Kiểm tra user có phải admin không
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

      const isAdmin = user?.roles?.some((r) => r.role_name === "admin");

      // Admin có quyền truy cập tất cả
      if (isAdmin) {
        return next();
      }

      // Lấy owner_id từ resource
      let ownerId;

      if (getOwnerIdFn) {
        // Nếu có hàm custom, dùng hàm đó
        ownerId = await getOwnerIdFn(req);
      } else {
        // Nếu không, lấy từ request body hoặc params
        ownerId =
          req.body?.[resourceOwnerField] ||
          req.params?.[resourceOwnerField] ||
          req.query?.[resourceOwnerField];
      }

      // Kiểm tra user có phải chủ sở hữu không
      if (parseInt(ownerId) !== parseInt(userId)) {
        return res.status(403).json({
          EM: "Forbidden - Bạn không có quyền truy cập resource này",
          EC: "-1",
          DT: null,
        });
      }

      next();
    } catch (error) {
      console.error("Ownership check error:", error);
      return res.status(500).json({
        EM: "Lỗi kiểm tra quyền sở hữu",
        EC: "-2",
        DT: null,
      });
    }
  };
};

/**
 * Middleware kiểm tra user là admin hoặc chủ sở hữu
 * @param {string} userIdField - Field chứa user_id cần kiểm tra
 * @returns {Function} Express middleware
 */
const checkAdminOrOwner = (userIdField = "user_id") => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          EM: "Unauthorized",
          EC: "-1",
          DT: null,
        });
      }

      // Lấy user_id từ request
      const targetUserId =
        req.body?.[userIdField] ||
        req.params?.[userIdField] ||
        req.query?.[userIdField];

      // Kiểm tra user có phải admin không
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

      const isAdmin = user?.roles?.some((r) => r.role_name === "admin");

      // Admin hoặc chủ sở hữu được phép
      if (isAdmin || parseInt(userId) === parseInt(targetUserId)) {
        return next();
      }

      return res.status(403).json({
        EM: "Forbidden - Bạn không có quyền",
        EC: "-1",
        DT: null,
      });
    } catch (error) {
      console.error("Admin or owner check error:", error);
      return res.status(500).json({
        EM: "Lỗi kiểm tra quyền",
        EC: "-2",
        DT: null,
      });
    }
  };
};

module.exports = {
  checkOwnership,
  checkAdminOrOwner,
};


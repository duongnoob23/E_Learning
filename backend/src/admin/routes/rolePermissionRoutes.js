const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware");
const { authorizeByRole } = require("../../middleware/authorizeMiddleware");
const rolePermissionController = require("../controllers/rolePermissionController");

/**
 * ===============================
 *  ROLE MANAGEMENT (CRUD ROLE)
 * ===============================
 */


// gan role cho user
/**
 * @route POST /api/admin/roles
 * @desc Tạo role mới
 * @body { role_name }
 */
router.post(
  "/roles",
  authMiddleware,
  authorizeByRole("admin"),
  rolePermissionController.createRole
);

/**
 * @route GET /api/admin/roles
 * @desc Lấy danh sách toàn bộ roles
 */
router.get(
  "/roles",
  authMiddleware,
  authorizeByRole("admin"),
  rolePermissionController.getAllRoles
);

/**
 * @route GET /api/admin/roles/:role_id
 * @desc Lấy thông tin chi tiết 1 role
 */
router.get(
  "/roles/:role_id",
  authMiddleware,
  authorizeByRole("admin"),
  rolePermissionController.getRoleById
);

/**
 * @route PUT /api/admin/roles/:role_id
 * @desc Cập nhật tên role
 * @body { role_name }
 */
router.patch(
  "/roles/:role_id",
  authMiddleware,
  authorizeByRole("admin"),
  rolePermissionController.updateRole
);

/**
 * @route DELETE /api/admin/roles/:role_id
 * @desc Xóa role
 */
router.delete(
  "/roles/:role_id",
  authMiddleware,
  authorizeByRole("admin"),
  rolePermissionController.deleteRole
);

/**
 * ==================================
 *  PERMISSION MANAGEMENT (CRUD PERM)
 * ==================================
 */

/**
 * @route POST /api/admin/permissions
 * @desc Tạo permission mới
 * @body { permission_name }
 */
router.post(
  "/permissions",
  authMiddleware,
  authorizeByRole("admin"),
  rolePermissionController.createPermission
);

/**
 * @route GET /api/admin/permissions
 * @desc Lấy danh sách toàn bộ permissions
 */
router.get(
  "/permissions",
  authMiddleware,
  authorizeByRole("admin"),
  rolePermissionController.getAllPermissions
);

/**
 * @route GET /api/admin/permissions/:permission_id
 * @desc Lấy thông tin chi tiết 1 permission
 */
router.get(
  "/permissions/:permission_id",
  authMiddleware,
  authorizeByRole("admin"),
  rolePermissionController.getPermissionById
);

/**
 * @route PUT /api/admin/permissions/:permission_id
 * @desc Cập nhật permission
 * @body { permission_name }
 */
router.put(
  "/permissions/:permission_id",
  authMiddleware,
  authorizeByRole("admin"),
  rolePermissionController.updatePermission
);

/**
 * @route DELETE /api/admin/permissions/:permission_id
 * @desc Xóa permission
 */
router.delete(
  "/permissions/:permission_id",
  authMiddleware,
  authorizeByRole("admin"),
  rolePermissionController.deletePermission
);

/**
 * ================================================
 *  ROLE - PERMISSION RELATION (GÁN/GỠ QUYỀN CHO ROLE)
 * ================================================
 */

/**
 * @route POST /api/admin/roles/:role_id/permissions
 * @desc Gán 1 hoặc nhiều permission cho role
 * @body { permission_ids: [1,2,3] }
 */
router.post(
  "/roles/:role_id/permissions",
  authMiddleware,
  authorizeByRole("admin"),
  rolePermissionController.assignPermissionToRole
);

/**
 * @route DELETE /api/admin/roles/:role_id/permissions
 * @desc Gỡ permission khỏi role
 * @body { permission_id }
 */
router.delete(
  "/roles/:role_id/permissions",
  authMiddleware,
  authorizeByRole("admin"),
  rolePermissionController.removePermissionFromRole
);

/**
 * @route GET /api/admin/roles/:role_id/permissions
 * @desc Lấy danh sách permissions thuộc role này
 */
router.get(
  "/roles/:role_id/permissions",
  authMiddleware,
  authorizeByRole("admin"),
  rolePermissionController.getPermissionsByRole
);

/**
 * @route GET /api/admin/permissions/:permission_id/roles
 * @desc Lấy danh sách roles có quyền này
 */
router.get(
  "/permissions/:permission_id/roles",
  authMiddleware,
  authorizeByRole("admin"),
  rolePermissionController.getRolesByPermission
);

/**
 * =================================
 *  USER - ROLE RELATION (GÁN ROLE)
 * =================================
 */

/**
 * @route POST /api/admin/users/:user_id/roles
 * @desc Gán role cho user
 * @body { role_id }
 */
router.post(
  "/users/:user_id/roles",
  authMiddleware,
  authorizeByRole("admin"),
  rolePermissionController.assignRoleToUser
);

/**
 * @route DELETE /api/admin/users/:user_id/roles
 * @desc Thu hồi role của user
 * @body { role_id }
 */
router.delete(
  "/users/:user_id/roles",
  authMiddleware,
  authorizeByRole("admin"),
  rolePermissionController.removeRoleFromUser
);

/**
 * @route GET /api/admin/users/:user_id/roles
 * @desc Lấy danh sách roles của user
 */
router.get(
  "/users/:user_id/roles",
  authMiddleware,
  authorizeByRole("admin"),
  rolePermissionController.getUserRoles
);

module.exports = router;

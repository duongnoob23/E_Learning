const rolePermissionService = require("../services/rolePermissionService");

// ==================== ROLE CRUD ====================

/**
 * Tạo role mới
 */
exports.createRole = async (req, res) => {
  try {
    const { role_name, description } = req.body;

    if (!role_name) {
      return res.status(400).json({
        EM: "role_name là bắt buộc",
        EC: "-1",
        DT: null,
      });
    }

    const result = await rolePermissionService.createRole(role_name, description);

    if (!result.success) {
      return res.status(400).json({
        EM: result.message,
        EC: "-1",
        DT: null,
      });
    }

    return res.status(201).json({
      EM: result.message,
      EC: "0",
      DT: result.data,
    });
  } catch (error) {
    console.error("Create role error:", error);
    return res.status(500).json({
      EM: "Lỗi tạo role",
      EC: "-2",
      DT: null,
    });
  }
};

/**
 * Lấy danh sách tất cả roles
 */
exports.getAllRoles = async (req, res) => {
  try {
    const result = await rolePermissionService.getAllRoles();

    if (!result.success) {
      return res.status(500).json({
        EM: result.message,
        EC: "-2",
        DT: null,
      });
    }

    return res.status(200).json({
      EM: result.message,
      EC: "0",
      DT: result.data,
    });
  } catch (error) {
    console.error("Get all roles error:", error);
    return res.status(500).json({
      EM: "Lỗi lấy danh sách roles",
      EC: "-2",
      DT: null,
    });
  }
};

/**
 * Lấy thông tin chi tiết 1 role
 */
exports.getRoleById = async (req, res) => {
  try {
    const { role_id } = req.params;

    if (!role_id) {
      return res.status(400).json({
        EM: "role_id là bắt buộc",
        EC: "-1",
        DT: null,
      });
    }

    const result = await rolePermissionService.getRoleById(role_id);

    if (!result.success) {
      return res.status(404).json({
        EM: result.message,
        EC: "-1",
        DT: null,
      });
    }

    return res.status(200).json({
      EM: result.message,
      EC: "0",
      DT: result.data,
    });
  } catch (error) {
    console.error("Get role by id error:", error);
    return res.status(500).json({
      EM: "Lỗi lấy thông tin role",
      EC: "-2",
      DT: null,
    });
  }
};

/**
 * Cập nhật role
 */
exports.updateRole = async (req, res) => {
  try {
    const { role_id } = req.params;
    const { role_name, description } = req.body;

    if (!role_id) {
      return res.status(400).json({
        EM: "role_id là bắt buộc",
        EC: "-1",
        DT: null,
      });
    }

    const result = await rolePermissionService.updateRole(role_id, role_name, description);

    if (!result.success) {
      const statusCode = result.message.includes("không tồn tại") ? 404 : 400;
      return res.status(statusCode).json({
        EM: result.message,
        EC: "-1",
        DT: null,
      });
    }

    return res.status(200).json({
      EM: result.message,
      EC: "0",
      DT: result.data,
    });
  } catch (error) {
    console.error("Update role error:", error);
    return res.status(500).json({
      EM: "Lỗi cập nhật role",
      EC: "-2",
      DT: null,
    });
  }
};

/**
 * Xóa role
 */
exports.deleteRole = async (req, res) => {
  try {
    const { role_id } = req.params;

    if (!role_id) {
      return res.status(400).json({
        EM: "role_id là bắt buộc",
        EC: "-1",
        DT: null,
      });
    }

    const result = await rolePermissionService.deleteRole(role_id);

    if (!result.success) {
      return res.status(404).json({
        EM: result.message,
        EC: "-1",
        DT: null,
      });
    }

    return res.status(200).json({
      EM: result.message,
      EC: "0",
      DT: result.data,
    });
  } catch (error) {
    console.error("Delete role error:", error);
    return res.status(500).json({
      EM: "Lỗi xóa role",
      EC: "-2",
      DT: null,
    });
  }
};

// ==================== PERMISSION CRUD ====================

/**
 * Tạo permission mới
 */
exports.createPermission = async (req, res) => {
  try {
    const { permission_name, description, resource, action } = req.body;

    if (!permission_name) {
      return res.status(400).json({
        EM: "permission_name là bắt buộc",
        EC: "-1",
        DT: null,
      });
    }

    const result = await rolePermissionService.createPermission(permission_name, description, resource, action);

    if (!result.success) {
      return res.status(400).json({
        EM: result.message,
        EC: "-1",
        DT: null,
      });
    }

    return res.status(201).json({
      EM: result.message,
      EC: "0",
      DT: result.data,
    });
  } catch (error) {
    console.error("Create permission error:", error);
    return res.status(500).json({
      EM: "Lỗi tạo permission",
      EC: "-2",
      DT: null,
    });
  }
};

/**
 * Lấy danh sách tất cả permissions
 */
exports.getAllPermissions = async (req, res) => {
  try {
    const result = await rolePermissionService.getAllPermissions();

    if (!result.success) {
      return res.status(500).json({
        EM: result.message,
        EC: "-2",
        DT: null,
      });
    }

    return res.status(200).json({
      EM: result.message,
      EC: "0",
      DT: result.data,
    });
  } catch (error) {
    console.error("Get all permissions error:", error);
    return res.status(500).json({
      EM: "Lỗi lấy danh sách permissions",
      EC: "-2",
      DT: null,
    });
  }
};

/**
 * Lấy thông tin chi tiết 1 permission
 */
exports.getPermissionById = async (req, res) => {
  try {
    const { permission_id } = req.params;

    if (!permission_id) {
      return res.status(400).json({
        EM: "permission_id là bắt buộc",
        EC: "-1",
        DT: null,
      });
    }

    const result = await rolePermissionService.getPermissionById(permission_id);

    if (!result.success) {
      return res.status(404).json({
        EM: result.message,
        EC: "-1",
        DT: null,
      });
    }

    return res.status(200).json({
      EM: result.message,
      EC: "0",
      DT: result.data,
    });
  } catch (error) {
    console.error("Get permission by id error:", error);
    return res.status(500).json({
      EM: "Lỗi lấy thông tin permission",
      EC: "-2",
      DT: null,
    });
  }
};

/**
 * Cập nhật permission
 */
exports.updatePermission = async (req, res) => {
  try {
    const { permission_id } = req.params;
    const { permission_name, description, resource, action } = req.body;

    if (!permission_id) {
      return res.status(400).json({
        EM: "permission_id là bắt buộc",
        EC: "-1",
        DT: null,
      });
    }

    const result = await rolePermissionService.updatePermission(permission_id, permission_name, description, resource, action);

    if (!result.success) {
      const statusCode = result.message.includes("không tồn tại") ? 404 : 400;
      return res.status(statusCode).json({
        EM: result.message,
        EC: "-1",
        DT: null,
      });
    }

    return res.status(200).json({
      EM: result.message,
      EC: "0",
      DT: result.data,
    });
  } catch (error) {
    console.error("Update permission error:", error);
    return res.status(500).json({
      EM: "Lỗi cập nhật permission",
      EC: "-2",
      DT: null,
    });
  }
};

/**
 * Xóa permission
 */
exports.deletePermission = async (req, res) => {
  try {
    const { permission_id } = req.params;

    if (!permission_id) {
      return res.status(400).json({
        EM: "permission_id là bắt buộc",
        EC: "-1",
        DT: null,
      });
    }

    const result = await rolePermissionService.deletePermission(permission_id);

    if (!result.success) {
      return res.status(404).json({
        EM: result.message,
        EC: "-1",
        DT: null,
      });
    }

    return res.status(200).json({
      EM: result.message,
      EC: "0",
      DT: result.data,
    });
  } catch (error) {
    console.error("Delete permission error:", error);
    return res.status(500).json({
      EM: "Lỗi xóa permission",
      EC: "-2",
      DT: null,
    });
  }
};

// ==================== ROLE-PERMISSION RELATION ====================

/**
 * Gán permission cho role
 */
exports.assignPermissionToRole = async (req, res) => {
  try {
    const { role_id } = req.params;
    const { permission_ids } = req.body;

    if (!role_id || !permission_ids) {
      return res.status(400).json({
        EM: "role_id và permission_ids là bắt buộc",
        EC: "-1",
        DT: null,
      });
    }

    const result = await rolePermissionService.assignPermissionToRole(role_id, permission_ids);

    if (!result.success) {
      const statusCode = result.message.includes("không tồn tại") ? 404 : 400;
      return res.status(statusCode).json({
        EM: result.message,
        EC: "-1",
        DT: null,
      });
    }

    return res.status(201).json({
      EM: result.message,
      EC: "0",
      DT: result.data,
    });
  } catch (error) {
    console.error("Assign permission to role error:", error);
    return res.status(500).json({
      EM: "Lỗi gán permission cho role",
      EC: "-2",
      DT: null,
    });
  }
};

/**
 * Gỡ permission khỏi role
 */
exports.removePermissionFromRole = async (req, res) => {
  try {
    const { role_id } = req.params;
    const { permission_id } = req.body;

    if (!role_id || !permission_id) {
      return res.status(400).json({
        EM: "role_id và permission_id là bắt buộc",
        EC: "-1",
        DT: null,
      });
    }

    const result = await rolePermissionService.removePermissionFromRole(role_id, permission_id);

    if (!result.success) {
      return res.status(400).json({
        EM: result.message,
        EC: "-1",
        DT: null,
      });
    }

    return res.status(200).json({
      EM: result.message,
      EC: "0",
      DT: result.data,
    });
  } catch (error) {
    console.error("Remove permission from role error:", error);
    return res.status(500).json({
      EM: "Lỗi gỡ permission khỏi role",
      EC: "-2",
      DT: null,
    });
  }
};

/**
 * Lấy danh sách permissions của role
 */
exports.getPermissionsByRole = async (req, res) => {
  try {
    const { role_id } = req.params;

    if (!role_id) {
      return res.status(400).json({
        EM: "role_id là bắt buộc",
        EC: "-1",
        DT: null,
      });
    }

    const result = await rolePermissionService.getPermissionsByRole(role_id);

    if (!result.success) {
      return res.status(404).json({
        EM: result.message,
        EC: "-1",
        DT: null,
      });
    }

    return res.status(200).json({
      EM: result.message,
      EC: "0",
      DT: result.data,
    });
  } catch (error) {
    console.error("Get permissions by role error:", error);
    return res.status(500).json({
      EM: "Lỗi lấy danh sách permissions",
      EC: "-2",
      DT: null,
    });
  }
};

/**
 * Lấy danh sách roles có permission này
 */
exports.getRolesByPermission = async (req, res) => {
  try {
    const { permission_id } = req.params;

    if (!permission_id) {
      return res.status(400).json({
        EM: "permission_id là bắt buộc",
        EC: "-1",
        DT: null,
      });
    }

    const result = await rolePermissionService.getRolesByPermission(permission_id);

    if (!result.success) {
      return res.status(404).json({
        EM: result.message,
        EC: "-1",
        DT: null,
      });
    }

    return res.status(200).json({
      EM: result.message,
      EC: "0",
      DT: result.data,
    });
  } catch (error) {
    console.error("Get roles by permission error:", error);
    return res.status(500).json({
      EM: "Lỗi lấy danh sách roles",
      EC: "-2",
      DT: null,
    });
  }
};

// ==================== USER-ROLE RELATION ====================

/**
 * Gán role cho user
 */
exports.assignRoleToUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { role_id } = req.body;

    if (!user_id || !role_id) {
      return res.status(400).json({
        EM: "user_id và role_id là bắt buộc",
        EC: "-1",
        DT: null,
      });
    }

    const result = await rolePermissionService.assignRoleToUser(user_id, role_id);

    if (!result.success) {
      const statusCode = result.message.includes("không tồn tại") ? 404 : 400;
      return res.status(statusCode).json({
        EM: result.message,
        EC: "-1",
        DT: null,
      });
    }

    return res.status(201).json({
      EM: result.message,
      EC: "0",
      DT: result.data,
    });
  } catch (error) {
    console.error("Assign role error:", error);
    return res.status(500).json({
      EM: "Lỗi gán role",
      EC: "-2",
      DT: null,
    });
  }
};

/**
 * Thu hồi role từ user
 */
exports.removeRoleFromUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { role_id } = req.body;

    if (!user_id || !role_id) {
      return res.status(400).json({
        EM: "user_id và role_id là bắt buộc",
        EC: "-1",
        DT: null,
      });
    }

    const result = await rolePermissionService.removeRoleFromUser(user_id, role_id);

    if (!result.success) {
      return res.status(400).json({
        EM: result.message,
        EC: "-1",
        DT: null,
      });
    }

    return res.status(200).json({
      EM: result.message,
      EC: "0",
      DT: result.data,
    });
  } catch (error) {
    console.error("Remove role error:", error);
    return res.status(500).json({
      EM: "Lỗi thu hồi role",
      EC: "-2",
      DT: null,
    });
  }
};

/**
 * Lấy roles của user
 */
exports.getUserRoles = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({
        EM: "user_id là bắt buộc",
        EC: "-1",
        DT: null,
      });
    }

    const result = await rolePermissionService.getUserRoles(user_id);

    if (!result.success) {
      return res.status(404).json({
        EM: result.message,
        EC: "-1",
        DT: null,
      });
    }

    return res.status(200).json({
      EM: result.message,
      EC: "0",
      DT: result.data,
    });
  } catch (error) {
    console.error("Get user roles error:", error);
    return res.status(500).json({
      EM: "Lỗi lấy roles của user",
      EC: "-2",
      DT: null,
    });
  }
};


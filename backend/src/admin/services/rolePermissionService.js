const { User, Role, Permission, UserRole, RolePermission } = require("../../models");

// ==================== ROLE CRUD ====================

/**
 * Tạo role mới
 */
exports.createRole = async (role_name, description = null) => {
  try {
    // Validate
    if (!role_name || role_name.trim() === "") {
      return {
        success: false,
        data: null,
        message: "role_name là bắt buộc",
      };
    }

    // Check if role already exists
    const existingRole = await Role.findOne({ where: { role_name } });
    if (existingRole) {
      return {
        success: false,
        data: null,
        message: "Role này đã tồn tại",
      };
    }

    // Create role
    const role = await Role.create({
      role_name: role_name.trim(),
      description: description ? description.trim() : null,
      is_active: true,
    });

    return {
      success: true,
      data: role,
      message: "Tạo role thành công",
    };
  } catch (error) {
    console.error("Create role error:", error);
    return {
      success: false,
      data: null,
      message: "Lỗi tạo role",
      error: error.message,
    };
  }
};

/**
 * Lấy danh sách tất cả roles với permissions
 */
exports.getAllRoles = async () => {
  try {
    const roles = await Role.findAll({
      where: { is_active: true },
      include: [
        {
          model: Permission,
          as: "permissions",
          through: { attributes: [] },
          attributes: ["permission_id", "permission_name", "description"],
        },
      ],
    });

    return {
      success: true,
      data: roles,
      message: "Lấy danh sách roles thành công",
    };
  } catch (error) {
    console.error("Get roles error:", error);
    return {
      success: false,
      data: null,
      message: "Lỗi lấy danh sách roles",
      error: error.message,
    };
  }
};

/**
 * Lấy thông tin chi tiết 1 role
 */
exports.getRoleById = async (role_id) => {
  try {
    const role = await Role.findByPk(role_id, {
      include: [
        {
          model: Permission,
          as: "permissions",
          through: { attributes: [] },
          attributes: ["permission_id", "permission_name", "description"],
        },
      ],
    });

    if (!role) {
      return {
        success: false,
        data: null,
        message: "Role không tồn tại",
      };
    }

    return {
      success: true,
      data: role,
      message: "Lấy thông tin role thành công",
    };
  } catch (error) {
    console.error("Get role by id error:", error);
    return {
      success: false,
      data: null,
      message: "Lỗi lấy thông tin role",
      error: error.message,
    };
  }
};

/**
 * Cập nhật role
 */
exports.updateRole = async (role_id, role_name, description = null) => {
  try {
    const role = await Role.findByPk(role_id);
    if (!role) {
      return {
        success: false,
        data: null,
        message: "Role không tồn tại",
      };
    }

    // Check if new role_name already exists
    if (role_name && role_name !== role.role_name) {
      const existingRole = await Role.findOne({ where: { role_name } });
      if (existingRole) {
        return {
          success: false,
          data: null,
          message: "Role name này đã tồn tại",
        };
      }
    }

    // Update
    await role.update({
      role_name: role_name || role.role_name,
      description: description !== undefined ? description : role.description,
    });

    return {
      success: true,
      data: role,
      message: "Cập nhật role thành công",
    };
  } catch (error) {
    console.error("Update role error:", error);
    return {
      success: false,
      data: null,
      message: "Lỗi cập nhật role",
      error: error.message,
    };
  }
};

/**
 * Xóa role (soft delete)
 */
exports.deleteRole = async (role_id) => {
  try {
    const role = await Role.findByPk(role_id);
    if (!role) {
      return {
        success: false,
        data: null,
        message: "Role không tồn tại",
      };
    }

    // Soft delete - set is_active to false
    await role.update({ is_active: false });

    return {
      success: true,
      data: null,
      message: "Xóa role thành công",
    };
  } catch (error) {
    console.error("Delete role error:", error);
    return {
      success: false,
      data: null,
      message: "Lỗi xóa role",
      error: error.message,
    };
  }
};

// ==================== PERMISSION CRUD ====================

/**
 * Tạo permission mới
 */
exports.createPermission = async (permission_name, description = null, resource = null, action = null) => {
  try {
    // Validate
    if (!permission_name || permission_name.trim() === "") {
      return {
        success: false,
        data: null,
        message: "permission_name là bắt buộc",
      };
    }

    // Check if permission already exists
    const existingPermission = await Permission.findOne({ where: { permission_name } });
    if (existingPermission) {
      return {
        success: false,
        data: null,
        message: "Permission này đã tồn tại",
      };
    }

    // Create permission
    const permission = await Permission.create({
      permission_name: permission_name.trim(),
      description: description ? description.trim() : null,
      resource: resource ? resource.trim() : null,
      action: action ? action.trim() : null,
      is_active: true,
    });

    return {
      success: true,
      data: permission,
      message: "Tạo permission thành công",
    };
  } catch (error) {
    console.error("Create permission error:", error);
    return {
      success: false,
      data: null,
      message: "Lỗi tạo permission",
      error: error.message,
    };
  }
};

/**
 * Lấy danh sách tất cả permissions
 */
exports.getAllPermissions = async () => {
  try {
    const permissions = await Permission.findAll({
      where: { is_active: true },
      attributes: ["permission_id", "permission_name", "description", "resource", "action"],
    });

    return {
      success: true,
      data: permissions,
      message: "Lấy danh sách permissions thành công",
    };
  } catch (error) {
    console.error("Get permissions error:", error);
    return {
      success: false,
      data: null,
      message: "Lỗi lấy danh sách permissions",
      error: error.message,
    };
  }
};

/**
 * Lấy thông tin chi tiết 1 permission
 */
exports.getPermissionById = async (permission_id) => {
  try {
    const permission = await Permission.findByPk(permission_id, {
      include: [
        {
          model: Role,
          as: "roles",
          through: { attributes: [] },
          attributes: ["role_id", "role_name"],
        },
      ],
    });

    if (!permission) {
      return {
        success: false,
        data: null,
        message: "Permission không tồn tại",
      };
    }

    return {
      success: true,
      data: permission,
      message: "Lấy thông tin permission thành công",
    };
  } catch (error) {
    console.error("Get permission by id error:", error);
    return {
      success: false,
      data: null,
      message: "Lỗi lấy thông tin permission",
      error: error.message,
    };
  }
};

/**
 * Cập nhật permission
 */
exports.updatePermission = async (permission_id, permission_name, description = null, resource = null, action = null) => {
  try {
    const permission = await Permission.findByPk(permission_id);
    if (!permission) {
      return {
        success: false,
        data: null,
        message: "Permission không tồn tại",
      };
    }

    // Check if new permission_name already exists
    if (permission_name && permission_name !== permission.permission_name) {
      const existingPermission = await Permission.findOne({ where: { permission_name } });
      if (existingPermission) {
        return {
          success: false,
          data: null,
          message: "Permission name này đã tồn tại",
        };
      }
    }

    // Update
    await permission.update({
      permission_name: permission_name || permission.permission_name,
      description: description !== undefined ? description : permission.description,
      resource: resource !== undefined ? resource : permission.resource,
      action: action !== undefined ? action : permission.action,
    });

    return {
      success: true,
      data: permission,
      message: "Cập nhật permission thành công",
    };
  } catch (error) {
    console.error("Update permission error:", error);
    return {
      success: false,
      data: null,
      message: "Lỗi cập nhật permission",
      error: error.message,
    };
  }
};

/**
 * Xóa permission (soft delete)
 */
exports.deletePermission = async (permission_id) => {
  try {
    const permission = await Permission.findByPk(permission_id);
    if (!permission) {
      return {
        success: false,
        data: null,
        message: "Permission không tồn tại",
      };
    }

    // Soft delete - set is_active to false
    await permission.update({ is_active: false });

    return {
      success: true,
      data: null,
      message: "Xóa permission thành công",
    };
  } catch (error) {
    console.error("Delete permission error:", error);
    return {
      success: false,
      data: null,
      message: "Lỗi xóa permission",
      error: error.message,
    };
  }
};

// ==================== ROLE-PERMISSION RELATION ====================

/**
 * Gán permission cho role
 */
exports.assignPermissionToRole = async (role_id, permission_ids) => {
  try {
    // Validate role exists
    const role = await Role.findByPk(role_id);
    if (!role) {
      return {
        success: false,
        data: null,
        message: "Role không tồn tại",
      };
    }

    // Validate permission_ids is array
    if (!Array.isArray(permission_ids) || permission_ids.length === 0) {
      return {
        success: false,
        data: null,
        message: "permission_ids phải là mảng và không rỗng",
      };
    }

    // Check all permissions exist
    const permissions = await Permission.findAll({
      where: { permission_id: permission_ids },
    });

    if (permissions.length !== permission_ids.length) {
      return {
        success: false,
        data: null,
        message: "Một số permission không tồn tại",
      };
    }

    // Get existing permissions for this role
    const existingPermissions = await RolePermission.findAll({
      where: { role_id },
      attributes: ["permission_id"],
    });

    const existingPermissionIds = existingPermissions.map((rp) => rp.permission_id);

    // Filter out permissions that already exist
    const newPermissionIds = permission_ids.filter((id) => !existingPermissionIds.includes(id));

    if (newPermissionIds.length === 0) {
      return {
        success: false,
        data: null,
        message: "Tất cả permissions đã được gán cho role này",
      };
    }

    // Create new role-permission relations
    const rolePermissions = await RolePermission.bulkCreate(
      newPermissionIds.map((permission_id) => ({
        role_id,
        permission_id,
      }))
    );

    return {
      success: true,
      data: rolePermissions,
      message: `Gán ${newPermissionIds.length} permission cho role thành công`,
    };
  } catch (error) {
    console.error("Assign permission to role error:", error);
    return {
      success: false,
      data: null,
      message: "Lỗi gán permission cho role",
      error: error.message,
    };
  }
};

/**
 * Gỡ permission khỏi role
 */
exports.removePermissionFromRole = async (role_id, permission_id) => {
  try {
    const deleted = await RolePermission.destroy({
      where: { role_id, permission_id },
    });

    if (deleted === 0) {
      return {
        success: false,
        data: null,
        message: "Role không có permission này",
      };
    }

    return {
      success: true,
      data: null,
      message: "Gỡ permission khỏi role thành công",
    };
  } catch (error) {
    console.error("Remove permission from role error:", error);
    return {
      success: false,
      data: null,
      message: "Lỗi gỡ permission khỏi role",
      error: error.message,
    };
  }
};

/**
 * Lấy danh sách permissions của role
 */
exports.getPermissionsByRole = async (role_id) => {
  try {
    const role = await Role.findByPk(role_id, {
      include: [
        {
          model: Permission,
          as: "permissions",
          through: { attributes: [] },
          attributes: ["permission_id", "permission_name", "description", "resource", "action"],
        },
      ],
    });

    if (!role) {
      return {
        success: false,
        data: null,
        message: "Role không tồn tại",
      };
    }

    return {
      success: true,
      data: role.permissions || [],
      message: "Lấy danh sách permissions của role thành công",
    };
  } catch (error) {
    console.error("Get permissions by role error:", error);
    return {
      success: false,
      data: null,
      message: "Lỗi lấy danh sách permissions",
      error: error.message,
    };
  }
};

/**
 * Lấy danh sách roles có permission này
 */
exports.getRolesByPermission = async (permission_id) => {
  try {
    const permission = await Permission.findByPk(permission_id, {
      include: [
        {
          model: Role,
          as: "roles",
          through: { attributes: [] },
          attributes: ["role_id", "role_name", "description"],
        },
      ],
    });

    if (!permission) {
      return {
        success: false,
        data: null,
        message: "Permission không tồn tại",
      };
    }

    return {
      success: true,
      data: permission.roles || [],
      message: "Lấy danh sách roles có permission này thành công",
    };
  } catch (error) {
    console.error("Get roles by permission error:", error);
    return {
      success: false,
      data: null,
      message: "Lỗi lấy danh sách roles",
      error: error.message,
    };
  }
};

// ==================== USER-ROLE RELATION ====================

/**
 * Gán role cho user
 */
exports.assignRoleToUser = async (user_id, role_id) => {
  try {
    // Kiểm tra user tồn tại
    const user = await User.findByPk(user_id);
    if (!user) {
      return {
        success: false,
        data: null,
        message: "User không tồn tại",
      };
    }

    // Kiểm tra role tồn tại
    const role = await Role.findByPk(role_id);
    if (!role) {
      return {
        success: false,
        data: null,
        message: "Role không tồn tại",
      };
    }

    // Kiểm tra user đã có role này chưa
    const existingUserRole = await UserRole.findOne({
      where: { user_id, role_id },
    });

    if (existingUserRole) {
      return {
        success: false,
        data: null,
        message: "User đã có role này",
      };
    }

    // Gán role
    const userRole = await UserRole.create({ user_id, role_id });

    return {
      success: true,
      data: userRole,
      message: "Gán role thành công",
    };
  } catch (error) {
    console.error("Assign role error:", error);
    return {
      success: false,
      data: null,
      message: "Lỗi gán role",
      error: error.message,
    };
  }
};

/**
 * Thu hồi role từ user
 */
exports.removeRoleFromUser = async (user_id, role_id) => {
  try {
    const deleted = await UserRole.destroy({
      where: { user_id, role_id },
    });

    if (deleted === 0) {
      return {
        success: false,
        data: null,
        message: "User không có role này",
      };
    }

    return {
      success: true,
      data: { user_id, role_id },
      message: "Thu hồi role thành công",
    };
  } catch (error) {
    console.error("Remove role error:", error);
    return {
      success: false,
      data: null,
      message: "Lỗi thu hồi role",
      error: error.message,
    };
  }
};

/**
 * Lấy roles của user
 */
exports.getUserRoles = async (user_id) => {
  try {
    const user = await User.findByPk(user_id, {
      include: [
        {
          model: Role,
          as: "roles",
          through: { attributes: [] },
          attributes: ["role_id", "role_name", "description"],
        },
      ],
    });

    if (!user) {
      return {
        success: false,
        data: null,
        message: "User không tồn tại",
      };
    }

    return {
      success: true,
      data: user.roles || [],
      message: "Lấy roles của user thành công",
    };
  } catch (error) {
    console.error("Get user roles error:", error);
    return {
      success: false,
      data: null,
      message: "Lỗi lấy roles của user",
      error: error.message,
    };
  }
};


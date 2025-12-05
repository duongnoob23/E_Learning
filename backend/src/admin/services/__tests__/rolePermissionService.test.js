/**
 * Unit Tests cho rolePermissionService
 * Chạy: npm test -- rolePermissionService
 */

const rolePermissionService = require("../rolePermissionService");
const { User, Role, Permission, UserRole } = require("../../../models");

// Mock models
jest.mock("../../../models", () => ({
  User: {
    findByPk: jest.fn(),
  },
  Role: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
  },
  Permission: {
    findAll: jest.fn(),
  },
  UserRole: {
    findOne: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
  },
}));

describe("rolePermissionService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllRoles", () => {
    it("should return all active roles with permissions", async () => {
      const mockRoles = [
        {
          role_id: 1,
          role_name: "admin",
          permissions: [{ permission_id: 1, permission_name: "user.manage" }],
        },
      ];

      Role.findAll.mockResolvedValue(mockRoles);

      const result = await rolePermissionService.getAllRoles();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockRoles);
      expect(result.message).toBe("Lấy danh sách roles thành công");
    });

    it("should handle error when fetching roles", async () => {
      const error = new Error("Database error");
      Role.findAll.mockRejectedValue(error);

      const result = await rolePermissionService.getAllRoles();

      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.message).toBe("Lỗi lấy danh sách roles");
    });
  });

  describe("getAllPermissions", () => {
    it("should return all active permissions", async () => {
      const mockPermissions = [
        { permission_id: 1, permission_name: "user.create" },
        { permission_id: 2, permission_name: "user.delete" },
      ];

      Permission.findAll.mockResolvedValue(mockPermissions);

      const result = await rolePermissionService.getAllPermissions();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockPermissions);
    });
  });

  describe("assignRoleToUser", () => {
    it("should assign role to user successfully", async () => {
      const mockUser = { user_id: 1, username: "john" };
      const mockRole = { role_id: 2, role_name: "student" };

      User.findByPk.mockResolvedValue(mockUser);
      Role.findByPk.mockResolvedValue(mockRole);
      UserRole.findOne.mockResolvedValue(null);
      UserRole.create.mockResolvedValue({ user_id: 1, role_id: 2 });

      const result = await rolePermissionService.assignRoleToUser(1, 2);

      expect(result.success).toBe(true);
      expect(result.message).toBe("Gán role thành công");
      expect(UserRole.create).toHaveBeenCalledWith({ user_id: 1, role_id: 2 });
    });

    it("should fail if user does not exist", async () => {
      User.findByPk.mockResolvedValue(null);

      const result = await rolePermissionService.assignRoleToUser(999, 2);

      expect(result.success).toBe(false);
      expect(result.message).toBe("User không tồn tại");
    });

    it("should fail if role does not exist", async () => {
      const mockUser = { user_id: 1, username: "john" };
      User.findByPk.mockResolvedValue(mockUser);
      Role.findByPk.mockResolvedValue(null);

      const result = await rolePermissionService.assignRoleToUser(1, 999);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Role không tồn tại");
    });

    it("should fail if user already has role", async () => {
      const mockUser = { user_id: 1, username: "john" };
      const mockRole = { role_id: 2, role_name: "student" };
      const existingUserRole = { user_id: 1, role_id: 2 };

      User.findByPk.mockResolvedValue(mockUser);
      Role.findByPk.mockResolvedValue(mockRole);
      UserRole.findOne.mockResolvedValue(existingUserRole);

      const result = await rolePermissionService.assignRoleToUser(1, 2);

      expect(result.success).toBe(false);
      expect(result.message).toBe("User đã có role này");
    });
  });

  describe("removeRoleFromUser", () => {
    it("should remove role from user successfully", async () => {
      UserRole.destroy.mockResolvedValue(1);

      const result = await rolePermissionService.removeRoleFromUser(1, 2);

      expect(result.success).toBe(true);
      expect(result.message).toBe("Thu hồi role thành công");
    });

    it("should fail if user does not have role", async () => {
      UserRole.destroy.mockResolvedValue(0);

      const result = await rolePermissionService.removeRoleFromUser(1, 2);

      expect(result.success).toBe(false);
      expect(result.message).toBe("User không có role này");
    });
  });

  describe("getUserRoles", () => {
    it("should return user roles successfully", async () => {
      const mockUser = {
        user_id: 1,
        username: "john",
        roles: [{ role_id: 2, role_name: "student" }],
      };

      User.findByPk.mockResolvedValue(mockUser);

      const result = await rolePermissionService.getUserRoles(1);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUser.roles);
    });

    it("should fail if user does not exist", async () => {
      User.findByPk.mockResolvedValue(null);

      const result = await rolePermissionService.getUserRoles(999);

      expect(result.success).toBe(false);
      expect(result.message).toBe("User không tồn tại");
    });
  });
});


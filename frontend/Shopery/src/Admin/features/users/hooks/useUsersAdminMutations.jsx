import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { usersAdminApi } from "../api/usersAdminApi";
import { adminUsersKeys } from "./useUsersAdminQueries";

// Helpers
const isOk = (data) => (data?.EC ?? data?.data?.EC) === "0";
const em = (data, fallback) => data?.EM || data?.data?.EM || fallback;

// ==================== USER MUTATIONS ==================== //

// Tạo user mới
export const useCreateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => usersAdminApi.createUser(payload),
    onSuccess: (data) => {
      if (isOk(data)) {
        toast.success(em(data, "Tạo người dùng thành công"));
        qc.invalidateQueries({ queryKey: adminUsersKeys.all });
      } else {
        toast.error(em(data, "Tạo người dùng thất bại"));
      }
    },
    onError: () => toast.error("Có lỗi xảy ra khi tạo người dùng"),
  });
};

// Cập nhật user
export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, payload }) => usersAdminApi.updateUser(userId, payload),
    onSuccess: (data) => {
      if (isOk(data)) {
        toast.success(em(data, "Cập nhật người dùng thành công"));
        qc.invalidateQueries({ queryKey: adminUsersKeys.all });
      } else {
        toast.error(em(data, "Cập nhật người dùng thất bại"));
      }
    },
    onError: () => toast.error("Có lỗi xảy ra khi cập nhật người dùng"),
  });
};

// Xóa user
export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId) => usersAdminApi.deleteUser(userId),
    onSuccess: (data) => {
      if (isOk(data)) {
        toast.success(em(data, "Xóa người dùng thành công"));
        qc.invalidateQueries({ queryKey: adminUsersKeys.all });
      } else {
        toast.error(em(data, "Xóa người dùng thất bại"));
      }
    },
    onError: () => toast.error("Có lỗi xảy ra khi xóa người dùng"),
  });
};

// ==================== STATUS MUTATIONS ==================== //

// Ban user
export const useBanUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId) => usersAdminApi.banUser(userId),
    onSuccess: (data) => {
      if (isOk(data)) {
        toast.success(em(data, "Chặn người dùng thành công"));
        qc.invalidateQueries({ queryKey: adminUsersKeys.all });
      } else {
        toast.error(em(data, "Chặn người dùng thất bại"));
      }
    },
    onError: () => toast.error("Có lỗi xảy ra khi chặn người dùng"),
  });
};

// Unban user
export const useUnbanUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId) => usersAdminApi.unbanUser(userId),
    onSuccess: (data) => {
      if (isOk(data)) {
        toast.success(em(data, "Bỏ chặn người dùng thành công"));
        qc.invalidateQueries({ queryKey: adminUsersKeys.all });
      } else {
        toast.error(em(data, "Bỏ chặn người dùng thất bại"));
      }
    },
    onError: () => toast.error("Có lỗi xảy ra khi bỏ chặn người dùng"),
  });
};

// Update user status
export const useUpdateUserStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, status }) => usersAdminApi.updateUserStatus(userId, status),
    onSuccess: (data) => {
      if (isOk(data)) {
        toast.success(em(data, "Cập nhật trạng thái thành công"));
        qc.invalidateQueries({ queryKey: adminUsersKeys.all });
      } else {
        toast.error(em(data, "Cập nhật trạng thái thất bại"));
      }
    },
    onError: () => toast.error("Có lỗi xảy ra khi cập nhật trạng thái"),
  });
};

// ==================== VERIFY MUTATIONS ==================== //

// Verify email
export const useVerifyEmail = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId) => usersAdminApi.verifyEmail(userId),
    onSuccess: (data) => {
      if (isOk(data)) {
        toast.success(em(data, "Xác thực email thành công"));
        qc.invalidateQueries({ queryKey: adminUsersKeys.all });
      } else {
        toast.error(em(data, "Xác thực email thất bại"));
      }
    },
    onError: () => toast.error("Có lỗi xảy ra khi xác thực email"),
  });
};

// Verify phone
export const useVerifyPhone = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId) => usersAdminApi.verifyPhone(userId),
    onSuccess: (data) => {
      if (isOk(data)) {
        toast.success(em(data, "Xác thực số điện thoại thành công"));
        qc.invalidateQueries({ queryKey: adminUsersKeys.all });
      } else {
        toast.error(em(data, "Xác thực số điện thoại thất bại"));
      }
    },
    onError: () => toast.error("Có lỗi xảy ra khi xác thực số điện thoại"),
  });
};


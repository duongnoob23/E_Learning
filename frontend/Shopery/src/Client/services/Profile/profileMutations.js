// D:\KY_II_NAM_4\Thuc_Tap_Tot_Nghiep\E-commerce\frontend\Shopery\src\Client\services\Profile\profileMutations.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { queryKeys } from "../../../lib/queryKeys";
import { profileApi } from "../../api/Profile/profileApi";

// Mutation để cập nhật profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: (data) => {
      const { EM, EC } = data;
      if (EC === "0") {
        toast.success(EM || "Cập nhật profile thành công!");
        // Invalidate profile query để refetch dữ liệu mới
        queryClient.invalidateQueries({
          queryKey: queryKeys.user.profile,
        });
      } else {
        toast.error(EM || "Cập nhật profile thất bại!");
      }
    },
    onError: (error) => {
      console.error("Update profile error:", error);

      // Xử lý lỗi validation 422
      if (error?.response?.status === 422) {
        const validationErrors = error.response.data?.errors;
        if (validationErrors && Array.isArray(validationErrors)) {
          const errorMessages = validationErrors
            .map((err) => err.msg)
            .join(", ");
          toast.error(`Lỗi validation: ${errorMessages}`);
        } else {
          toast.error("Dữ liệu không hợp lệ");
        }
      } else if (error?.response?.status === 500) {
        console.error("Server error 500:", error.response.data);
        toast.error("Lỗi server. Vui lòng thử lại sau.");
      } else {
        const errorMessage =
          error?.response?.data?.EM ||
          error?.response?.data?.message ||
          "Cập nhật profile thất bại!";
        toast.error(errorMessage);
      }
    },
  });
};

// Mutation để đổi mật khẩu
export const useChangePassword = () => {
  return useMutation({
    mutationFn: profileApi.changePassword,
    onSuccess: (data) => {
      const { EM, EC } = data || {};
      if (EC === "0") {
        toast.success(EM || "Đổi mật khẩu thành công!");
      } else {
        toast.error(EM || "Đổi mật khẩu thất bại!");
      }
    },
    onError: (error) => {
      console.error("Change password error:", error);

      // Xử lý lỗi validation 422
      if (error?.response?.status === 422) {
        const validationErrors = error.response.data?.errors;
        if (validationErrors && Array.isArray(validationErrors)) {
          const errorMessages = validationErrors
            .map((err) => err.msg)
            .join(", ");
          toast.error(`Lỗi validation: ${errorMessages}`);
        } else {
          toast.error("Dữ liệu không hợp lệ");
        }
      } else {
        const errorMessage =
          error?.response?.data?.EM ||
          error?.response?.data?.message ||
          "Đổi mật khẩu thất bại!";
        toast.error(errorMessage);
      }
    },
  });
};

// Mutation để upload avatar
export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileApi.uploadAvatar,
    onSuccess: (data) => {
      const { EM, EC } = data;
      if (EC === "0") {
        toast.success(EM || "Upload avatar thành công!");
        // Invalidate profile query để refetch dữ liệu mới
        queryClient.invalidateQueries({
          queryKey: queryKeys.user.profile,
        });
      } else {
        toast.error(EM || "Upload avatar thất bại!");
      }
    },
    onError: (error) => {
      console.error("Upload avatar error:", error);
      const errorMessage =
        error?.response?.data?.EM ||
        error?.response?.data?.message ||
        "Upload avatar thất bại!";
      toast.error(errorMessage);
    },
  });
};

// Mutation để đổi email (bước 1: gửi OTP)
export const useChangeEmail = () => {
  return useMutation({
    mutationFn: profileApi.changeEmail,
    onSuccess: (data) => {
      const { EM, EC } = data || {};
      if (EC === "0") {
        toast.success(
          EM || "Vui lòng kiểm tra email để lấy mã OTP xác thực!"
        );
      } else {
        toast.error(EM || "Gửi OTP thất bại!");
      }
    },
    onError: (error) => {
      console.error("Change email error:", error);

      // Xử lý lỗi validation 400
      if (error?.response?.status === 400) {
        const validationErrors = error.response.data?.errors;
        if (validationErrors && Array.isArray(validationErrors)) {
          const errorMessages = validationErrors
            .map((err) => err.msg)
            .join(", ");
          toast.error(`Lỗi validation: ${errorMessages}`);
        } else {
          toast.error("Dữ liệu không hợp lệ");
        }
      } else {
        const errorMessage =
          error?.response?.data?.EM ||
          error?.response?.data?.message ||
          "Gửi OTP thất bại!";
        toast.error(errorMessage);
      }
    },
  });
};

// Mutation để xác thực OTP đổi email (bước 2)
export const useVerifyEmailOtp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileApi.verifyEmailOtp,
    onSuccess: (data) => {
      const { EM, EC } = data || {};
      if (EC === "0") {
        toast.success(EM || "Xác thực email thành công!");
        // Invalidate profile query để refetch dữ liệu mới
        queryClient.invalidateQueries({
          queryKey: queryKeys.user.profile,
        });
      } else {
        toast.error(EM || "Xác thực email thất bại!");
      }
    },
    onError: (error) => {
      console.error("Verify email OTP error:", error);

      // Xử lý lỗi validation 400
      if (error?.response?.status === 400) {
        const validationErrors = error.response.data?.errors;
        if (validationErrors && Array.isArray(validationErrors)) {
          const errorMessages = validationErrors
            .map((err) => err.msg)
            .join(", ");
          toast.error(`Lỗi validation: ${errorMessages}`);
        } else {
          toast.error("Dữ liệu không hợp lệ");
        }
      } else {
        const errorMessage =
          error?.response?.data?.EM ||
          error?.response?.data?.message ||
          "Xác thực email thất bại!";
        toast.error(errorMessage);
      }
    },
  });
};



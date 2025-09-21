import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { profileApi } from "../../api/Profile/profileApi";

export const useUpdateProfile = (options = {}) =>
  useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: (data) => {
      // Gọi callback từ component nếu có
      if (options.onSuccess) {
        options.onSuccess(data);
      } else {
        // Chỉ hiển thị toast mặc định nếu component không xử lý
        const { EM, EC } = data;
        if (EC === "0") toast.success(EM || "Profile updated");
        else toast.error(EM || "Update failed");
      }
    },
    onError: (error) => {
      console.error("Update profile error:", error);
      console.error("Error response:", error?.response);
      console.error("Error response data:", error?.response?.data);
      console.error("Error status:", error?.response?.status);

      // Gọi callback từ component nếu có
      if (options.onError) {
        options.onError(error);
      } else {
        // Chỉ hiển thị toast error mặc định nếu component không xử lý
        toast.error("Cập nhật profile thất bại!");
      }

      // Xử lý lỗi validation 422
      if (error?.response?.status === 422) {
        const validationErrors = error.response.data?.errors;
        if (validationErrors && Array.isArray(validationErrors)) {
          const errorMessages = validationErrors.map(err => err.msg).join(", ");
          toast.error(`Validation error: ${errorMessages}`);
        } else {
          toast.error("Dữ liệu không hợp lệ");
        }
      } else if (error?.response?.status === 500) {
        console.error("Server error 500:", error.response.data);
        toast.error("Lỗi server. Vui lòng kiểm tra console và server logs.");
      } else {
        const errorMessage = error?.response?.data?.EM || error?.response?.data?.message || "Request failed";
        toast.error(errorMessage);
      }
    },
  });

export const useChangePassword = () =>
  useMutation({
    mutationFn: profileApi.changePassword,
    onSuccess: (data) => {
      const { EM, EC } = data || {};
      if (EC === "0") toast.success(EM || "Password updated");
      else toast.error(EM || "Update failed");
    },
    onError: () => toast.error("Request failed"),
  });

export const useChangeEmail = () =>
  useMutation({
    mutationFn: profileApi.changeEmail,
    onSuccess: (data) => {
      const { EM, EC } = data || {};
      if (EC === "0") toast.success(EM || "Email updated");
      else toast.error(EM || "Update failed");
    },
    onError: () => toast.error("Request failed"),
  });

export const useUpdateLocalization = () =>
  useMutation({
    mutationFn: profileApi.updateLocalization,
    onSuccess: (data) => {
      const { EM, EC } = data || {};
      if (EC === "0") toast.success(EM || "Updated");
      else toast.error(EM || "Update failed");
    },
    onError: () => toast.error("Request failed"),
  });

export const useVerifyEmailOtp = () =>
  useMutation({
    mutationFn: profileApi.verifyEmailOtp,
    onSuccess: (data) => {
      const { EM, EC } = data || {};
      if (EC === "0") toast.success(EM || "Email verified successfully");
      else toast.error(EM || "Verification failed");
    },
    onError: () => toast.error("Verification request failed"),
  });



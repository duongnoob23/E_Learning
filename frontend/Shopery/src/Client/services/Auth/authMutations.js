import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { queryKeys } from "../../../lib/queryKeys";
import { authApi } from "../../api/Auth/authApi";

// Mutation để verify email
export const useVerifyEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.verifyEmail,
    onSuccess: (data) => {
      const { EM, EC } = data;
      if (EC === "0") {
        toast.success(EM || "Xác thực email thành công!");
        // Invalidate user query để refetch thông tin mới nhất
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
      } else {
        toast.error(EM || "Xác thực email thất bại!");
      }
    },
    onError: (error) => {
      console.error("Verify email error:", error);
      toast.error("Có lỗi xảy ra khi xác thực email");
    },
  });
};

// Mutation để quên mật khẩu
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: (data) => {
      const { EM, EC } = data;
      if (EC === "0") {
        toast.success(EM || "Đã gửi email khôi phục mật khẩu!");
      } else {
        toast.error(EM || "Gửi email khôi phục thất bại!");
      }
    },
    onError: (error) => {
      console.error("Forgot password error:", error);
      toast.error("Có lỗi xảy ra khi gửi email khôi phục");
    },
  });
};

// Mutation để reset mật khẩu
export const useResetPassword = () => {
  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: (data) => {
      const { EM, EC } = data;
      if (EC === "0") {
        toast.success(EM || "Đặt lại mật khẩu thành công!");
      } else {
        toast.error(EM || "Đặt lại mật khẩu thất bại!");
      }
    },
    onError: (error) => {
      console.error("Reset password error:", error);
      toast.error("Có lỗi xảy ra khi đặt lại mật khẩu");
    },
  });
};

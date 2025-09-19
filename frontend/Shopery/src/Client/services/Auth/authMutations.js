import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { queryKeys } from "../../../lib/queryKeys";
import { useAuthStore } from "../../../stores/authStore";
import { authApi, authApi1 } from "../../api/Auth/authApi";

// Mutation để verify email
export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setCredentials, setError } = useAuthStore();
  return useMutation({
    mutationFn: authApi1.login,
    onSuccess: (data) => {
      const { EM, EC, DT } = data.data;
      console.log(EC);
      if (+EC === 0) {
        // Lưu token vào localStorage
        if (DT?.token) {
          localStorage.setItem("access_token", DT.token);
        }
        if (DT?.refresh_token) {
          localStorage.setItem("refresh_token", DT.refresh_token);
        }

        // Lưu thông tin user
        if (DT?.user) {
          localStorage.setItem("user", JSON.stringify(DT.user));
        }

        setCredentials({
          token: DT.token,
          refreshToken: DT.refresh_token,
          user: DT.user,
        });

        toast.success(EM || "Đăng nhập thành công");

        // Invalidate queries để refetch data mới
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
      } else {
        toast.error(EM || "Đăng nhập thất bại");
        setError(EM || "Đăng nhập thất bại");
      }
    },
    onError: (error) => {
      console.error("Login error:", error);
      toast.error("Có lỗi xảy ra khi đăng nhập");
      setError(EM || "Đăng nhập thất bại");
    },
  });
};

export const useRegister = () => {
  console.log("run useRegister");
  return useMutation({
    mutationFn: authApi1.register,
    onSuccess: (data) => {
      console.log(data.data);
      const { EM, EC, DT } = data.data;
      if (+EC === 0) {
        toast.success(EM || "Đăng ký thành công");
      } else {
        toast.error(EM || "Đăng ký thất bại");
      }
    },
  });
};

export const useVerifyEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi1.verifyEmail,
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

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../lib/queryKeys";
import { authApi } from "./authApi";

// Query để kiểm tra trạng thái verify email
export const useVerifyEmailStatus = (email, enabled = false) => {
  return useQuery({
    queryKey: queryKeys.auth.verifyEmail(email),
    queryFn: () => authApi.checkVerifyStatus(email),
    enabled,
    staleTime: 30 * 1000, // 30 giây
  });
};

// Query để lấy thông tin user hiện tại
export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: authApi.getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};

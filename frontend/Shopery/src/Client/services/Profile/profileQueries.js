// D:\KY_II_NAM_4\Thuc_Tap_Tot_Nghiep\E-commerce\frontend\Shopery\src\Client\services\Profile\profileQueries.js
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../lib/queryKeys";
import { profileApi } from "../../api/Profile/profileApi";

// Query để lấy thông tin profile của user hiện tại
export const useGetProfile = (enabled = true) => {
  return useQuery({
    queryKey: queryKeys.user.profile,
    queryFn: () => profileApi.getProfile(),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 phút
    gcTime: 10 * 60 * 1000, // 10 phút
  });
};

// Query để lấy thống kê của user
export const useGetUserStats = (enabled = true) => {
  return useQuery({
    queryKey: [...queryKeys.user.all, "stats"],
    queryFn: () => profileApi.getUserStats(),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 phút
    gcTime: 5 * 60 * 1000, // 5 phút
  });
};




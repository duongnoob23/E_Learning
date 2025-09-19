import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../lib/queryKeys";
import { profileApi } from "../../api/Profile/profileApi";

export const useGetProfile = () => {
  return useQuery({
    queryKey: queryKeys.profile.me(),
    queryFn: profileApi.getMe,
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};


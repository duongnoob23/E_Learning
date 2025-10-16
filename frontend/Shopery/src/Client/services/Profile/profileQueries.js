import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../lib/queryKeys";
import { profileApi } from "../../api/Profile/profileApi";

export const useGetProfile = () => {
  return useQuery({
    queryKey: queryKeys.user.profile,
    queryFn: profileApi.getMe,
  });
};




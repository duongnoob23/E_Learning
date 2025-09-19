import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { profileApi } from "../../api/Profile/profileApi";

export const useUpdateProfile = () =>
  useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: (data) => {
      const { EM, EC, DT } = data.data;
      if (+EC === 0) toast.success(EM || "Profile updated");
      else toast.error(EM || "Update failed");
    },
    onError: () => toast.error("Request failed"),
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



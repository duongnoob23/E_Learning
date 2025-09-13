// Custom hooks để sử dụng auth mutations
import {
  useForgotPassword,
  useResetPassword,
  useVerifyEmail,
} from "../../../Client/services/Auth/authMutations";

export const useAuthMutations = () => {
  const verifyEmailMutation = useVerifyEmail();
  const forgotPasswordMutation = useForgotPassword();
  const resetPasswordMutation = useResetPassword();

  return {
    verifyEmail: verifyEmailMutation,
    forgotPassword: forgotPasswordMutation,
    resetPassword: resetPasswordMutation,
  };
};

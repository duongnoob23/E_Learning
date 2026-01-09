import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import OTP from "../../../components/Auth/OTP/OTP";
import { useLogin, useVerifyEmail } from "../../../services/Auth/authMutations";
import "./Login.css";
const Login = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Lấy state từ Redux
  const {
    isAuthenticated,
    user,
    error: authError,
  } = useSelector((state) => state.auth);

  // Nếu đã đăng nhập, chuyển hướng
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Xóa lỗi khi user bắt đầu nhập
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    }

    if (isLoginMode && !formData.password.trim()) {
      newErrors.password = "Mật khẩu không được để trống";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loginMutation = useLogin();
  const verifyEmailMutation = useVerifyEmail();

  const handleSubmit = async (e) => {
    e.preventDefault(); // dừng submit
    if (!validateForm()) {
      return;
    } // kiểm tra chưa validate form thì return
    setIsLoading(true);
    setErrors({});
    try {
      if (isLoginMode) {
        const result = await loginMutation.mutateAsync({
          email: formData.email,
          password: formData.password,
        });
        
        // Nếu EC === "3" thì cần verify OTP
        if (result.data?.EC === "3") {
          setShowOtpModal(true);
          toast.info(result.data?.EM || "Vui lòng xác thực email");
        } else if (result.data?.EC === "0") {
          navigate("/");
        }
      } else if (!isLoginMode) {
        // gọi api lấy lại mật khẩu;
        setShowOtpModal(true);
      }
      // Đăng nhập
    } catch (error) {
      const errorMessage = error?.response?.data?.EM || error?.EM || "Đăng nhập thất bại";
      toast.error(errorMessage);

      setErrors({
        submit: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTP = async ({ message, code }) => {
    if (message === "RESEND") {
      // TODO: Gọi API gửi lại OTP nếu cần
      toast.info("Chức năng gửi lại OTP sẽ được phát triển");
      return;
    }

    if (message === "SEND") {
      setIsLoading(true);
      setErrors("");
      try {
        // Gọi API verify email với type = "login"
        const result = await verifyEmailMutation.mutateAsync({
          email: formData.email,
          otp: code,
          type: "login",
        });

        if (result.data.EC === "0") {
          // Tắt modal ngay lập tức khi verify thành công
          setShowOtpModal(false);
          toast.success(result.EM || "Xác nhận OTP thành công");
          
          // Nếu có autoLogin và token thì đã được xử lý trong useVerifyEmail mutation
          // Chỉ cần navigate về trang chủ
          if (result.data.DT?.autoLogin) {
            navigate("/");
          }
        } else {
          toast.error(result?.EM || "Mã OTP không đúng hoặc đã hết hạn");
        }
      } catch (error) {
        console.error("Verify email error:", error);
        const errorMessage = error?.response?.data?.EM || "Có lỗi khi xác thực OTP. Vui lòng thử lại.";
        setErrors(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };
  return (
    <>
      <div className="auth-page">
        <div className="auth-page__container">
          {/* Phần bên trái - Hình ảnh */}
          <div className="auth-page__image-section">
            <div className="auth-page__image-overlay">
              <h2 className="auth-page__image-title">Chào mừng đến với TOTC</h2>
              <p className="auth-page__image-subtitle">
                Khám phá hàng ngàn khóa học chất lượng với giá tốt nhất. Mua sắm
                thông minh, tiết kiệm thời gian và chi phí.
              </p>
            </div>
          </div>

          {/* Phần bên phải - Form */}
          <div className="auth-page__form-section">
            {!isLoginMode && (
              <button
                className="auth-page__return"
                onClick={(e) => setIsLoginMode(true)}
              >
                <i class="fa-solid fa-arrow-left"></i>
              </button>
            )}
            <div className="auth-page__form-container">
              {/* Header */}
              <div className="auth-page__header">
                <h1 className="auth-page__welcome">
                  {isLoginMode == true
                    ? `Chào mừng đến với TOTC!`
                    : `Lấy lại mật khẩu!`}
                </h1>

                {/* Toggle buttons */}
                {isLoginMode == true && (
                  <div className="auth-page__toggle">
                    <div className={`auth-page__toggle-slider `}></div>
                    <button
                      className={`auth-page__toggle-btn auth-page__toggle-btn--active`}
                      onClick={() => navigate("/login")}
                      type="button"
                    >
                      Đăng nhập
                    </button>
                    <button
                      className={`auth-page__toggle-btn `}
                      onClick={() => navigate("/register")}
                      type="button"
                    >
                      Đăng kí
                    </button>
                  </div>
                )}
                {/* <Auth /> */}

                <p className="auth-page__description">
                  {isLoginMode
                    ? `Đăng nhập để truy cập vào tài khoản của bạn 
                    và khám phá hàng ngàn khóa học chất lượng 
                    với ưu đãi đặc biệt`
                    : "Nhập email hoặc số điện thoại của bạn để đặt lại mật khẩu nhanh chóng"}
                </p>
              </div>

              {/* Form */}
              <form className="auth-page__form" onSubmit={handleSubmit}>
                {/* Hiển thị lỗi */}
                {/* {authError && (
                <div className="auth-page__error">{authError?.EM}</div>
              )}
              {errors.submit && (
                <div className="auth-page__error">{errors.submit}</div>
              )} */}

                {/* Email field - chỉ hiển thị khi Register */}
                <div className={`auth-page__field `}>
                  <label className="auth-page__label">Email</label>
                  <input
                    type="text"
                    name="email"
                    className={`auth-page__input ${
                      errors.email ? "error" : ""
                    }`}
                    placeholder="Nhập địa chỉ email của bạn"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  {errors.email && (
                    <span className="auth-page__error-text">
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Password field */}
                {isLoginMode && (
                  <div className="auth-page__field">
                    <label className="auth-page__label">Mật khẩu</label>
                    <div className="auth-page__password-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className={`auth-page__input ${
                          errors.password ? "error" : ""
                        }`}
                        placeholder="Nhập mật khẩu của bạn"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                      <button
                        type="button"
                        className="auth-page__password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>
                    {errors.password && (
                      <span className="auth-page__error-text">
                        {errors.password}
                      </span>
                    )}
                  </div>
                )}

                {/* Remember me và Forgot password - chỉ hiển thị khi Login */}
                {isLoginMode && (
                  <div
                    className={`auth-page__options auth-page__options--visible`}
                  >
                    <label className="auth-page__checkbox">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <span className="auth-page__checkbox-text">
                        Ghi nhớ đăng nhập
                      </span>
                    </label>
                    <button
                      type="button"
                      className="auth-page__forgot-link"
                      onClick={(e) => setIsLoginMode(false)}
                    >
                      Quên mật khẩu
                    </button>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  className="auth-page__submit-btn"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Đang xử lý..."
                    : isLoginMode
                    ? "Đăng nhập"
                    : "Nhận mã OTP"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {showOtpModal && (
        <OTP
          onClose={() => setShowOtpModal(false)}
          email={formData.email}
          onSubmit={handleOTP}
        />
      )}
    </>
  );
};

export default Login;

// luồng đăng nhập của admin cũng đang bị lỗi , khi nhập tài khoản client vào tài khoản của admin thì nó ko phản hổi gì

// có nên code riêng luồng login admin/client register admin/client và user login/register không

// chưa có chức năng đăng kí trên web

// code lại giao diện đơn vị REM

// một web cần phải check gì nhiều, lỗi khi fetch api , sập server, responsive...

// đọc lại db e_learnning2 để hiểu xem giữ liệu nó thực tế chưachưa

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import OTP from "../../../components/Auth/OTP/OTP";
import {
  useRegister,
  useVerifyEmail,
} from "../../../services/Auth/authMutations";
import "./Register.css";
const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
  });

  const [data, setData] = useState({
    usename: "",
    password: "",
    confirmPassword: "",
    email: "",
  });

  const handleChangeDate = (name, value) => {
    let newData = [...data];
    newData[name] = value;
    setData(newData);
    setData((pre) => ({ ...pre, [name]: value }));
  };
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
      if (user.role === "client") {
        navigate("/login");
      }
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.username.trim()) {
      newErrors.username = "Tên đăng nhập không được để trống";
    } else if (formData.username.length < 3) {
      newErrors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const registerMutation = useRegister();

  const handleSubmit = async (e) => {
    e.preventDefault(); // dừng submit

    if (!validateForm()) {
      return;
    } // kiểm tra chưa validate form thì return
    setIsLoading(true);
    setErrors({});

    try {
      const result = await registerMutation.mutateAsync({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      console.log(">>>", result);
      if (+result.data.EC === 0) {
        toast.success(result?.EM || "Đăng ký thành công");
        setShowOtpModal(true);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error?.EM || "Đăng kí tài khoản thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmailMutation = useVerifyEmail();

  const handleOtpSubmit = async ({ message, code }) => {
    console.log("🚀 OTP nhận được từ OTP.jsx:", message, code);

    if (message === "RESEND") {
      // TODO: Gọi API gửi lại OTP nếu cần
      console.log("🚀 Người dùng bấm Gửi lại OTP");
      toast.info("Chức năng gửi lại OTP sẽ được phát triển");
      return;
    }

    if (message === "SEND") {
      setIsLoading(true);
      setErrors("");
      try {
        // ✅ Gọi API verify email bằng TanStack Query
        const result = await verifyEmailMutation.mutateAsync({
          email: formData.email,
          otp: code,
        });
        console.log(result);

        if (result.data.EC === "0") {
          toast.success(result.EM || "Xác nhận OTP thành công");
          setShowOtpModal(false);
        } else {
          // Xác thực thất bại
          toast.error(result?.EM || "Mã OTP không đúng hoặc đã hết hạn");
        }
      } catch (error) {
        console.error("Verify email error:", error);
        setErrors("Có lỗi khi xác thực OTP. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    }
  };
  return (
    <div>
      <div className="auth-page">
        <div className="auth-page__container">
          {/* Phần bên trái - Form */}
          <div className="auth-page__form-section">
            <div className="auth-page__form-container">
              {/* Header */}
              <div className="auth-page__header">
                <h1 className="auth-page__welcome">Chào mừng đến với TOTC!</h1>

                {/* Toggle buttons */}
                <div className="auth-page__toggle">
                  <div
                    className={`auth-page__toggle-slider auth-page__toggle-slider--register`}
                  ></div>
                  <button
                    className={`auth-page__toggle-btn `}
                    onClick={() => navigate("/login")}
                    type="button"
                  >
                    Đăng nhập
                  </button>
                  <button
                    className={`auth-page__toggle-btn auth-page__toggle-btn--active`}
                    onClick={() => navigate("/register")}
                    type="button"
                  >
                    Đăng kí
                  </button>
                </div>

                {/* <Auth /> */}

                <p className="auth-page__description">
                  Tạo tài khoản mới để bắt đầu hành trình học tập tuyệt vời cùng
                  TOTC. Nhận ngay voucher 50K cho khóa học đầu tiên!
                </p>
              </div>

              {/* Form */}
              <form className="auth-page__form" onSubmit={handleSubmit}>
                {/* Hiển thị lỗi */}
                {/* {authError && <div className="auth-page__error">{authError?.EM}</div>}
              {errors.submit && (
                <div className="auth-page__error">{errors.submit}</div>
              )} */}

                {/* Username field */}
                <div className={`auth-page__field `}>
                  <div className="auth-page__field">
                    <label className="auth-page__label">Tên đăng nhập</label>
                    <input
                      type="text"
                      name="username"
                      className={`auth-page__input ${
                        errors.username ? "error" : ""
                      }`}
                      placeholder="Nhập tên đăng nhập của bạn"
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                    {errors.username && (
                      <span className="auth-page__error-text">
                        {errors.username}
                      </span>
                    )}
                  </div>
                </div>

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

                {/* Confirm Password - chỉ hiển thị khi Register */}
                <div
                  className={`auth-page__field auth-page__field--register auth-page__field--visible`}
                >
                  <label className="auth-page__label">Xác nhận mật khẩu</label>
                  <div className="auth-page__password-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      className={`auth-page__input ${
                        errors.confirmPassword ? "error" : ""
                      }`}
                      placeholder="Nhập lại mật khẩu của bạn"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      className="auth-page__password-toggle"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span className="auth-page__error-text">
                      {errors.confirmPassword}
                    </span>
                  )}
                </div>

                {/* Remember me và Forgot password - chỉ hiển thị khi Login */}

                {/* Submit button */}
                <button
                  type="submit"
                  className="auth-page__submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang xử lý..." : "Đăng ký"}
                </button>
              </form>
            </div>
          </div>
          {/* Phần bên phải - Hình ảnh */}

          <div className="auth-page__image-section">
            <div className="auth-page__image-overlay">
              <h2 className="auth-page__image-title">Chào mừng đến với TOTC</h2>
              <p className="auth-page__image-subtitle">
                Khám phá hàng ngàn khóa học chất lượng với giá tốt nhất. Mua sắm
                thông minh, tiết kiệm thời gian và chi phí.
              </p>
            </div>
          </div>
        </div>
      </div>
      {showOtpModal && (
        <OTP
          open={showOtpModal}
          onClose={() => setShowOtpModal(false)}
          email={formData?.email}
          onSubmit={handleOtpSubmit}
        />
      )}
    </div>
  );
};

export default Register;

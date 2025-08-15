import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../../redux/slices/authSlice";
import "./Login.css";

const Login = ({ isAdmin = false }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
  React.useEffect(() => {
    if (isAuthenticated && user) {
      if (isAdmin && user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (!isAdmin && user.role === "client") {
        navigate("/");
      }
    }
  }, [isAuthenticated, user, navigate, isAdmin]);

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

    if (!formData.username.trim()) {
      newErrors.username = "Tên đăng nhập không được để trống";
    }

    if (!isLoginMode && !formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Mật khẩu không được để trống";
    }

    if (!isLoginMode && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      if (isLoginMode) {
        // Đăng nhập
        const result = await dispatch(
          loginUser({
            username: formData.username,
            password: formData.password,
          })
        ).unwrap();

        if (result.success) {
          // Chuyển hướng dựa vào role
          if (result.user.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/");
          }
        }
      } else {
        // Đăng ký - tạm thời chưa implement
        console.log("Đăng ký:", formData);
      }
    } catch (error) {
      setErrors({ submit: error.message || "Có lỗi xảy ra" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
          <div className="auth-page__form-container">
            {/* Header */}
            <div className="auth-page__header">
              <h1 className="auth-page__welcome">
                {isAdmin
                  ? "Chào mừng đến Admin Panel"
                  : "Chào mừng đến với TOTC!"}
              </h1>

              {/* Toggle buttons */}
              <div className="auth-page__toggle">
                <div
                  className={`auth-page__toggle-slider ${
                    !isLoginMode ? "auth-page__toggle-slider--register" : ""
                  }`}
                ></div>
                <button
                  className={`auth-page__toggle-btn ${
                    isLoginMode ? "auth-page__toggle-btn--active" : ""
                  }`}
                  onClick={() => setIsLoginMode(true)}
                  type="button"
                >
                  Đăng nhập
                </button>
                <button
                  className={`auth-page__toggle-btn ${
                    !isLoginMode ? "auth-page__toggle-btn--active" : ""
                  }`}
                  onClick={() => setIsLoginMode(false)}
                  type="button"
                >
                  Đăng ký
                </button>
              </div>

              <p className="auth-page__description">
                {isLoginMode
                  ? "Đăng nhập để truy cập vào tài khoản của bạn và khám phá hàng ngàn khóa học chất lượng với ưu đãi đặc biệt."
                  : "Tạo tài khoản mới để bắt đầu hành trình học tập tuyệt vời cùng TOTC. Nhận ngay voucher 50K cho khóa học đầu tiên!"}
              </p>
            </div>

            {/* Form */}
            <form className="auth-page__form" onSubmit={handleSubmit}>
              {/* Hiển thị lỗi */}
              {authError && <div className="auth-page__error">{authError}</div>}
              {errors.submit && (
                <div className="auth-page__error">{errors.submit}</div>
              )}

              {/* Username field */}
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

              {/* Email field - chỉ hiển thị khi Register */}
              <div
                className={`auth-page__field auth-page__field--register ${
                  !isLoginMode ? "auth-page__field--visible" : ""
                }`}
              >
                <label className="auth-page__label">Email</label>
                <input
                  type="text"
                  name="email"
                  className={`auth-page__input ${errors.email ? "error" : ""}`}
                  placeholder="Nhập địa chỉ email của bạn"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && (
                  <span className="auth-page__error-text">{errors.email}</span>
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
                className={`auth-page__field auth-page__field--register ${
                  !isLoginMode ? "auth-page__field--visible" : ""
                }`}
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
              <div
                className={`auth-page__options ${
                  isLoginMode ? "auth-page__options--visible" : ""
                }`}
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
                <button type="button" className="auth-page__forgot-link">
                  Quên mật khẩu?
                </button>
              </div>

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
                  : "Đăng ký"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

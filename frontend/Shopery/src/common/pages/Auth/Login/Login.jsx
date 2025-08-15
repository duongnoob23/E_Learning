import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../hooks/useAuth";
import "./Login.css";

const Login = ({ isAdmin = false }) => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearAuthError } = useAuth();

  // State quản lý form
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

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (error) {
      clearAuthError();
    }
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoginMode) {
      // Validate login form
      if (!formData.username.trim() || !formData.password.trim()) {
        alert("Vui lòng điền đầy đủ thông tin đăng nhập");
        return;
      }

      // Xử lý đăng nhập
      const credentials = {
        username: formData.username.trim(),
        password: formData.password.trim(),
      };

      const result = await login(credentials);

      if (result.success) {
        // Redirect based on role
        if (isAdmin) {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else {
        // Error sẽ được hiển thị từ Redux state
        console.log("Login failed:", result.error);
      }
    } else {
      // Validate register form
      if (
        !formData.username.trim() ||
        !formData.password.trim() ||
        !formData.email.trim() ||
        !formData.confirmPassword.trim()
      ) {
        alert("Vui lòng điền đầy đủ thông tin đăng ký");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        alert("Mật khẩu xác nhận không khớp");
        return;
      }

      // Xử lý đăng ký
      console.log("Register:", formData);
      // TODO: Implement register logic
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
              {error && <div className="auth-page__error">{error}</div>}

              {/* Username field */}
              <div className="auth-page__field">
                <label className="auth-page__label">Tên đăng nhập</label>
                <input
                  type="text"
                  name="username"
                  className="auth-page__input"
                  placeholder="Nhập tên đăng nhập của bạn"
                  value={formData.username}
                  onChange={handleInputChange}
                />
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
                  className="auth-page__input"
                  placeholder="Nhập địa chỉ email của bạn"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              {/* Password field */}
              <div className="auth-page__field">
                <label className="auth-page__label">Mật khẩu</label>
                <div className="auth-page__password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="auth-page__input"
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
                    className="auth-page__input"
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

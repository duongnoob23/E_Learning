// Register Page - Trang đăng ký
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../../../redux/slices/authSlice";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
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

    if (!formData.username.trim()) {
      newErrors.username = "Tên đăng nhập không được để trống";
    } else if (formData.username.length < 3) {
      newErrors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Họ tên không được để trống";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (formData.phone && !/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
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
      const result = await dispatch(
        registerUser({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          phone: formData.phone,
        })
      ).unwrap();

      if (result.success) {
        navigate("/");
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
        {/* Left Side - Image */}
        <div className="auth-page__image">
          <div className="auth-page__image-content">
            <h2 className="auth-page__image-title">Chào mừng đến với TOTC</h2>
            <p className="auth-page__image-subtitle">
              Nền tảng học tiếng Anh trực tuyến hàng đầu Việt Nam
            </p>
            <p className="auth-page__description">
              Tạo tài khoản mới để bắt đầu hành trình học tiếng Anh
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-page__form">
          <div className="auth-page__header">
            <h1 className="auth-page__title">Đăng ký</h1>
            <p className="auth-page__subtitle">
              Tạo tài khoản mới để bắt đầu học tập
            </p>
          </div>

          {/* Error Message */}
          {authError && <div className="auth-page__error">{authError}</div>}

          {errors.submit && (
            <div className="auth-page__error">{errors.submit}</div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-page__form-content">
            {/* Full Name Field */}
            <div className="auth-page__field">
              <label htmlFor="fullName" className="auth-page__label">
                Họ và tên
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`auth-page__input ${errors.fullName ? "error" : ""}`}
                placeholder="Nhập họ và tên của bạn"
              />
              {errors.fullName && (
                <span className="auth-page__error-text">{errors.fullName}</span>
              )}
            </div>

            {/* Username Field */}
            <div className="auth-page__field">
              <label htmlFor="username" className="auth-page__label">
                Tên đăng nhập
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`auth-page__input ${errors.username ? "error" : ""}`}
                placeholder="Nhập tên đăng nhập"
              />
              {errors.username && (
                <span className="auth-page__error-text">{errors.username}</span>
              )}
            </div>

            {/* Email Field */}
            <div className="auth-page__field">
              <label htmlFor="email" className="auth-page__label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`auth-page__input ${errors.email ? "error" : ""}`}
                placeholder="Nhập email của bạn"
              />
              {errors.email && (
                <span className="auth-page__error-text">{errors.email}</span>
              )}
            </div>

            {/* Phone Field */}
            <div className="auth-page__field">
              <label htmlFor="phone" className="auth-page__label">
                Số điện thoại (tùy chọn)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`auth-page__input ${errors.phone ? "error" : ""}`}
                placeholder="Nhập số điện thoại"
              />
              {errors.phone && (
                <span className="auth-page__error-text">{errors.phone}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="auth-page__field">
              <label htmlFor="password" className="auth-page__label">
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`auth-page__input ${errors.password ? "error" : ""}`}
                placeholder="Nhập mật khẩu"
              />
              {errors.password && (
                <span className="auth-page__error-text">{errors.password}</span>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="auth-page__field">
              <label htmlFor="confirmPassword" className="auth-page__label">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`auth-page__input ${
                  errors.confirmPassword ? "error" : ""
                }`}
                placeholder="Nhập lại mật khẩu"
              />
              {errors.confirmPassword && (
                <span className="auth-page__error-text">
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="auth-page__terms">
              <input
                type="checkbox"
                id="terms"
                className="auth-page__checkbox"
                required
              />
              <label htmlFor="terms" className="auth-page__checkbox-label">
                Tôi đồng ý với{" "}
                <a href="#" className="auth-page__terms-link">
                  Điều khoản sử dụng
                </a>{" "}
                và{" "}
                <a href="#" className="auth-page__terms-link">
                  Chính sách bảo mật
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="auth-page__submit-btn"
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Đăng ký"}
            </button>
          </form>

          {/* Footer */}
          <div className="auth-page__footer">
            <p className="auth-page__footer-text">
              Đã có tài khoản?
              <a href="/login" className="auth-page__footer-link">
                Đăng nhập ngay
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../../redux/slices/authSlice";
import "./Register.css";

const Register = () => {
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
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "client") {
        navigate("/");
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

    if (!isLoginMode && !formData.username.trim()) {
      newErrors.username = "Tên đăng nhập không được để trống";
    }

    if (!formData.email.trim()) {
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
    e.preventDefault(); // dừng submit
    if (!validateForm()) {
      return;
    } // kiểm tra chưa validate form thì return
    setIsLoading(true);
    setErrors({});

    try {
      if (isLoginMode) {
        // Đăng nhập
        console.log("🚀 ~ handleSubmit ~ 3:", 3);
        const result = await dispatch(
          loginUser({
            email: formData.email,
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
        {/* Phần bên trái - Form */}
        <div className="auth-page__form-section">
          <div className="auth-page__form-container">
            {/* Header */}
            <div className="auth-page__header">
              <h1 className="auth-page__welcome">Chào mừng đến với TOTC!</h1>

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
                  onClick={() => navigate("/login")}
                  type="button"
                >
                  Đăng nhập
                </button>
                <button
                  className={`auth-page__toggle-btn ${
                    !isLoginMode ? "auth-page__toggle-btn--active" : ""
                  }`}
                  onClick={() => navigate("/register")}
                  type="button"
                >
                  Đăng kí
                </button>
              </div>

              {/* <Auth /> */}

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
  );
};

export default Register;

// luồng đăng nhập của admin cũng đang bị lỗi , khi nhập tài khoản client vào tài khoản của admin thì nó ko phản hổi gì

// có nên code riêng luồng login admin/client register admin/client và user login/register không

// chưa có chức năng đăng kí trên web

// code lại giao diện đơn vị REM

// một web cần phải check gì nhiều, lỗi khi fetch api , sập server, responsive...

// đọc lại db e_learnning2 để hiểu xem giữ liệu nó thực tế chưachưa

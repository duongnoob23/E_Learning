import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAdminAuthStore } from "../stores/adminAuthStore";
import { adminAuthApi } from "../api/adminAuthApi";
import "./AdminLoginPage.scss";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAdminCredentials, isAdminAuthenticated, checkAdminAuth } = useAdminAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Nếu đã đăng nhập admin, redirect về dashboard
  useEffect(() => {
    if (checkAdminAuth() && isAdminAuthenticated) {
      const from = location.state?.from || "/admin/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAdminAuthenticated, navigate, location, checkAdminAuth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error khi user nhập
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
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await adminAuthApi.login(formData.email, formData.password);

      if (response.EC === "0") {
        // Lưu credentials vào store
        setAdminCredentials({
          accessToken: response.DT.accessToken,
          refreshToken: response.DT.refreshToken,
          user: response.DT.user,
        });

        toast.success(response.EM || "Đăng nhập admin thành công!");

        // Redirect về trang trước đó hoặc dashboard
        const from = location.state?.from || "/admin/dashboard";
        navigate(from, { replace: true });
      } else {
        toast.error(response.EM || "Đăng nhập thất bại!");
        setErrors({ submit: response.EM });
      }
    } catch (error) {
      console.error("Admin login error:", error);
      const errorMessage =
        error.response?.data?.EM ||
        error.message ||
        "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại!";
      toast.error(errorMessage);
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <h1>Admin Login</h1>
            <p>Đăng nhập vào trang quản trị</p>
          </div>

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email của bạn"
                className={errors.email ? "error" : ""}
                disabled={loading}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu của bạn"
                className={errors.password ? "error" : ""}
                disabled={loading}
              />
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            {errors.submit && (
              <div className="error-message submit-error">{errors.submit}</div>
            )}

            <button
              type="submit"
              className="admin-login-button"
              disabled={loading}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <div className="admin-login-footer">
            <p>
              Quay lại{" "}
              <a href="/" onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}>
                trang chủ
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;


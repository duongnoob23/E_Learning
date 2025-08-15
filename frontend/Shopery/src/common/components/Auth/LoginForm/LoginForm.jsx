// Login Form Component - Dùng chung cho Admin và Client
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../../../utils/validateForm";
import Button from "../../Button/Button";
import Input from "../../Input/Input";
import "./LoginForm.css";

const LoginForm = ({
  onSubmit,
  loading = false,
  error = null,
  isAdmin = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      loginType: isAdmin ? "admin" : "client",
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="login-form">
      {error && <div className="error-message">{error}</div>}

      <Input
        label={isAdmin ? "Email quản trị" : "Email"}
        type="email"
        placeholder={isAdmin ? "admin@example.com" : "Nhập email của bạn"}
        error={errors.email?.message}
        {...register("email")}
      />

      <div className="password-field">
        <Input
          label="Mật khẩu"
          type={showPassword ? "text" : "password"}
          placeholder={isAdmin ? "Nhập mật khẩu admin" : "Nhập mật khẩu"}
          error={errors.password?.message}
          {...register("password")}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "🙈" : "👁️"}
        </button>
      </div>

      <div className="form-options">
        <label className="remember-me">
          <input type="checkbox" />
          <span>Ghi nhớ đăng nhập</span>
        </label>
        {!isAdmin && (
          <a href="/forgot-password" className="forgot-password">
            Quên mật khẩu?
          </a>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="large"
        loading={loading}
        className="submit-button"
      >
        {isAdmin ? "Đăng nhập Admin" : "Đăng nhập"}
      </Button>
    </form>
  );
};

export default LoginForm;

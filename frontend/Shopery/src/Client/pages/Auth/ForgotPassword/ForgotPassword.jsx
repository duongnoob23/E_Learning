const ForgotPassword = () => {
  return (
    <div className="forgot-password-page">
      <h1>Quên mật khẩu</h1>
      <p>
        Vui lòng nhập địa chỉ email của bạn để nhận hướng dẫn đặt lại mật khẩu.
      </p>
      <form>
        <input type="email" placeholder="Email của bạn" required />
        <button type="submit">Gửi</button>
      </form>
    </div>
  );
};
export default ForgotPassword;

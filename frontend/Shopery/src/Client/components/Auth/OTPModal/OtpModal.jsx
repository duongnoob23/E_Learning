import React, { useRef, useState } from "react";
import "./OtpModal.css";

const OtpModal = ({ open, onClose, onSubmit, email, isLoading, error }) => {
  const OTP_LENGTH = 6;
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  console.log("🚀 ~ OtpModal ~ otp:", otp);
  const inputs = useRef([]);

  // Xử lý nhập số
  const handleChange = (e, idx) => {
    console.log(e.target.value);
    const val = e.target.value.replace(/[^0-9]/g, ""); // lấy ra phần tử vừa nhập, nếu có khác số thì regex lại
    if (!val) return;
    const newOtp = [...otp]; // tạo một mảng mới từ otp hiện tại
    newOtp[idx] = val[0]; // cập nhật giá trị mới vào vị trí idx trường hợp có mảng > 2 số thì chỉ lấy số đầu tiên
    setOtp(newOtp);

    // Tự động focus sang ô tiếp theo
    if (idx < OTP_LENGTH - 1) {
      inputs.current[idx + 1].focus();
    }
  };

  // Xử lý phím Backspace
  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      if (otp[idx]) {
        // Xóa số hiện tại
        const newOtp = [...otp];
        newOtp[idx] = "";
        setOtp(newOtp);
        if (idx > 0) {
          inputs.current[idx - 1].focus();
        }
      } else if (idx > 0) {
        // Lùi về ô trước
        inputs.current[idx - 1].focus();
      }
    }
  };

  // Xử lý paste
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g, "");
    if (paste.length === OTP_LENGTH) {
      setOtp(paste.split(""));
      inputs.current[OTP_LENGTH - 1].focus();
      e.preventDefault();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.join("").length === OTP_LENGTH) {
      onSubmit(otp.join(""));
    }
  };

  if (!open) return null;

  return (
    <div className="otp-modal__backdrop">
      <div className="otp-modal__container">
        <button className="otp-modal__close" onClick={onClose}>
          ×
        </button>
        <div className="otp-modal__logo">
          <img
            src="https://cdn-icons-png.flaticon.com/512/9405/9405615.png"
            alt="Logo"
          />
        </div>
        <h2 className="otp-modal__title">Nhập mã OTP</h2>
        <p className="otp-modal__desc">
          Chúng tôi đã gửi mã OTP tới email <b>{email}</b>
        </p>
        <form className="otp-modal__form" onSubmit={handleSubmit}>
          <div className="otp-modal__inputs" onPaste={handlePaste}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="otp-modal__input"
                value={digit}
                ref={(el) => (inputs.current[idx] = el)}
                onInput={(e) => handleChange(e, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                autoFocus={idx === 0}
              />
            ))}
          </div>
          {error && (
            <div className="otp-modal__error">{error && error?.EM}</div>
          )}
          <button
            className="otp-modal__submit"
            type="submit"
            disabled={isLoading || otp.join("").length < OTP_LENGTH}
          >
            {isLoading ? "Đang xác thực..." : "Xác nhận"}
          </button>
        </form>
        <div className="otp-modal__footer">
          <span>Không nhận được mã? </span>
          <button
            className="otp-modal__resend"
            type="button"
            onClick={() => onSubmit("resend")}
            disabled={isLoading}
          >
            Gửi lại OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;

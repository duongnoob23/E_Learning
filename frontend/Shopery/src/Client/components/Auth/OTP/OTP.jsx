import { useRef, useState } from "react";
import "./OTP.css";

const OTP = ({ open, onClose, email, onSubmit }) => {
  const numberOTP = 6;
  const [otp, setOtp] = useState(Array(numberOTP).fill(""));

  const inputsRef = useRef([]);

  const handleDelete = (e, index) => {
    if (e.key === "Backspace") {
      if (e.key === "Backspace") {
        const value = e.target.value;
        var newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
        inputsRef.current[index] = "";
        if (index > 0) {
          inputsRef.current[index - 1].focus();
        }
      }
    }
  };

  const handleChangeInput = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // chỉ cho số
    if (!value) return;
    var newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (newOtp[index] !== "" && index < numberOTP - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleSubmit = (e, message) => {
    e.preventDefault();
    const submitOtp = otp.join("").toString();
    onSubmit({
      message: message,
      code: submitOtp,
    }); // ✅ gửi OTP ra ngoài Register
  };

  return (
    <>
      <div className="OTP__overlay">
        <div className="OTP__container">
          <button className="OTP__btn--close" onClick={(e) => onClose()}>
            <i class="fa-solid fa-xmark"></i>
          </button>
          <div className="OTP__image--otp">
            <img
              src="https://cdn-icons-png.flaticon.com/512/9405/9405615.png"
              alt=""
            />
          </div>
          <h3 className="OTP__title">Nhập mã OTP</h3>
          <p className="OTP__desc">
            Chúng tôi đã gửi mã OTP tới email:
            <span className="OTP__">{email}</span>
          </p>
          <form className="OTP__form" onSubmit={(e) => handleSubmit(e, "SEND")}>
            <div className="OTP__inputs">
              {otp &&
                otp?.map((item, index) => (
                  <input
                    type="text"
                    key={index}
                    className="OTP__input"
                    value={item}
                    maxLength={1}
                    inputMode="numberic"
                    onKeyDown={(e) => handleDelete(e, index)}
                    onChange={(e) => handleChangeInput(e, index)}
                    ref={(e) => (inputsRef.current[index] = e)}
                  />
                ))}
            </div>
            <button
              className={`OTP__btn--submit ${
                +otp.join("").length == numberOTP ? "OTP__btn--active" : ""
              }`}
              type="submit"
            >
              Xác nhận
            </button>
          </form>
          <div className="OTP__last">
            <p className="OTP__notReceive">Không nhận được mã?</p>
            <p
              className="OTP__resend"
              onClick={(e) => handleSubmit(e, "RESEND")}
            >
              Gửi lại OTP
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OTP;

// với sự kiện onChange thì nó luôn chạy bất kể khi input thay đổi => ko thể  dùng e.key ==="Backspace" để ngăn không cho onChange chạy được => phải kiểm tra xem nó có phải số không,nếu không phải số thì return vì lúc chúng ta bấm Backspace thì ko phải số

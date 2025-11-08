import React, { useState } from "react";
import "./PaymentModal.css";

const PaymentModal = ({ isOpen, onClose, course, onPaymentSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState("momo");
  const [isPaying, setIsPaying] = useState(false);

  if (!isOpen) return null;

  const handleConfirmPayment = async () => {
    setIsPaying(true);
    try {
      // Giả lập API xác nhận thanh toán
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Gọi callback thành công
      onPaymentSuccess(course.course_id);
    } catch (error) {
      console.error("Payment error:", error);
      alert("Thanh toán thất bại. Vui lòng thử lại!");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="payment-modal__overlay">
      <div className="payment-modal__container">
        <h2 className="payment-modal__title">Xác nhận thanh toán</h2>

        <div className="payment-modal__course">
          <p className="payment-modal__course-name">{course.title}</p>
          <div className="payment-modal__price">
            <span className="payment-modal__price-sale">
              {course.pricing?.price_display || "0₫"}
            </span>
            {course.pricing?.has_discount && (
              <>
                <span className="payment-modal__price-old">
                  {course.pricing?.old_price_display}
                </span>
                <span className="payment-modal__discount-badge">
                  {course.pricing?.discount_badge}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="payment-modal__methods">
          <h3>Chọn phương thức thanh toán:</h3>
          <div className="payment-modal__method-list">
            {["momo", "vnpay", "stripe"].map((method) => (
              <label
                key={method}
                className={`payment-modal__method ${
                  selectedMethod === method ? "active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="method"
                  value={method}
                  checked={selectedMethod === method}
                  onChange={() => setSelectedMethod(method)}
                />
                {method === "momo" && "MoMo"}
                {method === "vnpay" && "VNPay"}
                {method === "stripe" && "Stripe"}
              </label>
            ))}
          </div>
        </div>

        <div className="payment-modal__actions">
          <button
            className="payment-modal__btn payment-modal__btn--cancel"
            onClick={onClose}
            disabled={isPaying}
          >
            Hủy
          </button>
          <button
            className="payment-modal__btn payment-modal__btn--confirm"
            onClick={handleConfirmPayment}
            disabled={isPaying}
          >
            {isPaying ? "Đang xử lý..." : "Xác nhận thanh toán"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

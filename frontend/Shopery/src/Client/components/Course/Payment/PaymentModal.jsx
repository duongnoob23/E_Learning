import React, { useState } from "react";
import "./PaymentModal.css";
import { courseApi } from "../../../api/Course/courseApi";

const PaymentModal = ({ isOpen, onClose, course, enrollmentId, onPaymentSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState("vnpay");
  const [isPaying, setIsPaying] = useState(false);
  console.log("DEBUG: selectedMethod =", selectedMethod);
  console.log("DEBUG: enrollmentId (before API) =", enrollmentId);
  if (!isOpen) return null;

  /* ============================================================
     XỬ LÝ THANH TOÁN
  ============================================================ */
  const handleConfirmPayment = async () => {
    setIsPaying(true);
    try {
      
   

    // call
    const res = await courseApi.createVnpayPayment(enrollmentId);
    console.log("DEBUG: API response createVnpayPayment =", res);
      // ==================== VNPAY ====================
      if (selectedMethod === "vnpay") {
        const res = await courseApi.createVnpayPayment(enrollmentId);
        console.log("VNPAY RESPONSE:", res);

        if (res.EC === 0) {
          const paymentUrl = res.DT.payment_url;
          window.location.href = paymentUrl; // <-- Redirect sang VNPAY
          return;
        } else {
          alert(res.EM || "Không thể tạo giao dịch VNPAY");
        }
      }

      // ==================== MoMo — chưa kích hoạt ====================
      if (selectedMethod === "momo") {
        alert("MoMo chưa được kích hoạt. Vui lòng chọn VNPAY.");
      }

      // ==================== Stripe — chưa kích hoạt ====================
      if (selectedMethod === "stripe") {
        alert("Stripe chưa được kích hoạt.");
      }

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

        {/* ================= Thông tin khóa học ================= */}
        <div className="payment-modal__course">
          <p className="payment-modal__course-name">{course.title}</p>

          <div className="payment-modal__price">
            <span className="payment-modal__price-sale">
            {Number(course.price).toLocaleString("vi-VN")}₫
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

        {/* ================= Phương thức thanh toán ================= */}
        <div className="payment-modal__methods">
          <h3>Chọn phương thức thanh toán:</h3>

          <div className="payment-modal__method-list">
            {["vnpay", "momo", "stripe"].map((method) => (
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

                {method === "vnpay" && "VNPay"}
                {method === "momo" && "MoMo"}
                {method === "stripe" && "Stripe"}
              </label>
            ))}
          </div>
        </div>

        {/* ================= Buttons ================= */}
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

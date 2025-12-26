import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { paymentApi } from "../../../api/Payment/paymentApi";
import "./PaymentModal.css";

const PaymentModal = ({ isOpen, onClose, course, onPaymentSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState("bank_transfer");
  const [isPaying, setIsPaying] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    address: "",
  });

  // Lấy thông tin user từ localStorage
  useEffect(() => {
    if (isOpen) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setFormData({
        full_name: user.full_name || user.name || "",
        phone: user.phone || user.phone_number || "",
        email: user.email || "",
        address: user.address || "",
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleConfirmPayment = async () => {
    // Validate form
    if (!formData.full_name || !formData.phone || !formData.address) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc (*)");
      return;
    }

    // Validate phone number
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
      toast.error("Số điện thoại không hợp lệ");
      return;
    }

    setIsPaying(true);
    try {
      // Gọi API tạo đơn hàng
      const response = await paymentApi.createOrder([course]);

      if (response.code === "success" && response.data.payment_url) {
        // Mở VNPay trong tab mới, giữ nguyên trang hiện tại
        window.open(response.data.payment_url, "_blank");
        toast.success("Đang chuyển đến trang thanh toán...");
        setIsPaying(false);
        // Đóng modal sau 1 giây
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        toast.error(response.message || "Không thể tạo đơn hàng");
        setIsPaying(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi tạo đơn hàng"
      );
      setIsPaying(false);
    }
  };

  // Tính giá
  const currentPrice = course.price || 0;
  const oldPrice = course.old_price || 0;
  const discountPercent =
    oldPrice > currentPrice
      ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100)
      : 0;

  return (
    <div className="payment-modal__overlay" onClick={onClose}>
      <div
        className="payment-modal__container"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="payment-modal__close" onClick={onClose}>
          ×
        </button>

        <h2 className="payment-modal__title">Mua khoá học: {course.title}</h2>

        {/* Special Offer */}
        <div className="payment-modal__offer">
          Ưu đãi đặc biệt tháng {new Date().getMonth() + 1}/
          {new Date().getFullYear()}:
        </div>

        {/* Price */}
        <div className="payment-modal__price-section">
          <span className="payment-modal__price-sale">
            {Number(currentPrice).toLocaleString("vi-VN")}₫
          </span>
          {oldPrice > currentPrice && (
            <>
              <span className="payment-modal__price-old">
                {Number(oldPrice).toLocaleString("vi-VN")}₫
              </span>
              <span className="payment-modal__discount-badge">
                -{discountPercent}%
              </span>
            </>
          )}
        </div>

        {/* Payment Method */}
        <div className="payment-modal__methods">
          <button
            className={`payment-modal__method-btn ${
              selectedMethod === "bank_transfer" ? "active" : ""
            }`}
            onClick={() => setSelectedMethod("bank_transfer")}
          >
            Chuyển khoản trực tiếp
          </button>
        </div>

        {/* Warning */}
        <div className="payment-modal__warning">
          <span style={{ color: "#ef4444" }}>
            ⚠️ Vui lòng kiểm tra kỹ số điện thoại để có thể nhận mã kích hoạt
            gửi về SMS.
          </span>
        </div>

        {/* Form */}
        <div className="payment-modal__form">
          <div className="payment-modal__form-group">
            <label>
              Họ tên<span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              placeholder="Nhập họ tên"
              required
            />
          </div>

          <div className="payment-modal__form-group">
            <label>
              Số điện thoại<span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Nhập số điện thoại"
              required
            />
          </div>

          <div className="payment-modal__form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Nhập email"
            />
          </div>

          <div className="payment-modal__form-group">
            <label>
              Địa chỉ<span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Nhập địa chỉ"
              required
            />
          </div>
        </div>

        {/* Actions */}
        <div className="payment-modal__actions">
          <button
            className="payment-modal__btn payment-modal__btn--order"
            onClick={handleConfirmPayment}
            disabled={isPaying}
          >
            {isPaying ? "Đang xử lý..." : "ĐẶT HÀNG NGAY"}
          </button>
        </div>

        {/* Links */}
        <div className="payment-modal__links">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            Điều khoản và điều kiện giao dịch
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            Hướng dẫn thanh toán
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

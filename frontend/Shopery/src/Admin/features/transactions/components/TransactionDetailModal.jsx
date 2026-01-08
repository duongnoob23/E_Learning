import React from "react";
import { HiXMark, HiCheckCircle, HiXCircle, HiClock, HiArrowPath } from "react-icons/hi2";
import { useAdminTransactionDetail } from "../hooks/useTransactionsAdminQueries";
import "./TransactionDetailModal.scss";

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleString("vi-VN");
}

function formatCurrency(amount) {
  if (amount === null || amount === undefined) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function formatPaymentStatus(status) {
  const statusMap = {
    pending: "Chờ thanh toán",
    paid: "Đã thanh toán",
    failed: "Thất bại",
    refunded: "Đã hoàn tiền",
  };
  return statusMap[status] || status;
}

function formatOrderStatus(status) {
  const statusMap = {
    pending: "Chờ xử lý",
    confirmed: "Đã xác nhận",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
    refunded: "Đã hoàn tiền",
  };
  return statusMap[status] || status;
}

function formatPaymentMethod(method) {
  const methodMap = {
    vnpay: "VNPay",
    momo: "MoMo",
    zalopay: "ZaloPay",
    bank_transfer: "Chuyển khoản",
    cod: "COD",
    free: "Miễn phí",
  };
  return methodMap[method] || method;
}

function getStatusIcon(status) {
  switch (status) {
    case "paid":
    case "completed":
      return <HiCheckCircle className="status-icon status-icon--success" />;
    case "failed":
    case "cancelled":
      return <HiXCircle className="status-icon status-icon--danger" />;
    case "pending":
      return <HiClock className="status-icon status-icon--warning" />;
    case "refunded":
      return <HiArrowPath className="status-icon status-icon--info" />;
    default:
      return null;
  }
}

export default function TransactionDetailModal({ orderId, onClose }) {
  const { data, isLoading, error } = useAdminTransactionDetail(orderId);
  const order = data?.DT;

  if (isLoading) {
    return (
      <div className="transaction-detail-modal__overlay" onClick={onClose}>
        <div className="transaction-detail-modal" onClick={(e) => e.stopPropagation()}>
          <div className="transaction-detail-modal__loading">Đang tải...</div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="transaction-detail-modal__overlay" onClick={onClose}>
        <div className="transaction-detail-modal" onClick={(e) => e.stopPropagation()}>
          <div className="transaction-detail-modal__error">Không thể tải thông tin giao dịch</div>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-detail-modal__overlay" onClick={onClose}>
      <div className="transaction-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="transaction-detail-modal__header">
          <h2>Chi tiết giao dịch</h2>
          <button className="transaction-detail-modal__close" onClick={onClose}>
            <HiXMark />
          </button>
        </div>

        <div className="transaction-detail-modal__content">
          {/* Order Info */}
          <div className="transaction-detail-modal__section">
            <h3>Thông tin đơn hàng</h3>
            <div className="transaction-detail-modal__info-grid">
              <div className="transaction-detail-modal__info-item">
                <label>Mã đơn hàng</label>
                <span className="order-number">{order.order_number}</span>
              </div>
              <div className="transaction-detail-modal__info-item">
                <label>Trạng thái đơn hàng</label>
                <span className={`status-badge status-badge--${order.order_status}`}>
                  {getStatusIcon(order.order_status)}
                  {formatOrderStatus(order.order_status)}
                </span>
              </div>
              <div className="transaction-detail-modal__info-item">
                <label>Trạng thái thanh toán</label>
                <span className={`status-badge status-badge--${order.payment_status}`}>
                  {getStatusIcon(order.payment_status)}
                  {formatPaymentStatus(order.payment_status)}
                </span>
              </div>
              <div className="transaction-detail-modal__info-item">
                <label>Phương thức thanh toán</label>
                <span>{formatPaymentMethod(order.payment_method)}</span>
              </div>
              <div className="transaction-detail-modal__info-item">
                <label>Ngày tạo</label>
                <span>{formatDate(order.created_at)}</span>
              </div>
              <div className="transaction-detail-modal__info-item">
                <label>Ngày thanh toán</label>
                <span>{formatDate(order.paid_at)}</span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="transaction-detail-modal__section">
            <h3>Thông tin khách hàng</h3>
            <div className="transaction-detail-modal__customer">
              <div className="transaction-detail-modal__customer-avatar">
                {order.user?.avatar_url ? (
                  <img src={order.user.avatar_url} alt="" />
                ) : (
                  <span>{(order.user?.username || order.user?.full_name || "U")[0].toUpperCase()}</span>
                )}
              </div>
              <div className="transaction-detail-modal__customer-info">
                <div className="customer-name">{order.user?.full_name || order.user?.username}</div>
                <div className="customer-email">{order.user?.email}</div>
                {order.user?.phone && <div className="customer-phone">{order.user.phone}</div>}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="transaction-detail-modal__section">
            <h3>Khóa học đã mua</h3>
            <div className="transaction-detail-modal__items">
              {order.items?.map((item, idx) => (
                <div key={idx} className="transaction-detail-modal__item">
                  <div className="item-image">
                    {item.course?.image || item.course_image ? (
                      <img src={item.course?.image || item.course_image} alt="" />
                    ) : (
                      <div className="item-image-placeholder"></div>
                    )}
                  </div>
                  <div className="item-info">
                    <div className="item-title">{item.course?.title || item.course_title}</div>
                    <div className="item-instructor">{item.instructor_name}</div>
                  </div>
                  <div className="item-prices">
                    {item.original_price !== item.final_price && (
                      <div className="item-original-price">{formatCurrency(item.original_price)}</div>
                    )}
                    <div className="item-final-price">{formatCurrency(item.final_price)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="transaction-detail-modal__section">
            <h3>Tổng kết thanh toán</h3>
            <div className="transaction-detail-modal__summary">
              <div className="summary-row">
                <span>Tạm tính</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="summary-row summary-row--discount">
                  <span>Giảm giá {order.coupon_code && `(${order.coupon_code})`}</span>
                  <span>-{formatCurrency(order.discount_amount)}</span>
                </div>
              )}
              <div className="summary-row summary-row--total">
                <span>Tổng cộng</span>
                <span>{formatCurrency(order.total_amount)}</span>
              </div>
            </div>
          </div>

          {/* Payment History */}
          {order.payments && order.payments.length > 0 && (
            <div className="transaction-detail-modal__section">
              <h3>Lịch sử thanh toán</h3>
              <div className="transaction-detail-modal__payments">
                {order.payments.map((payment, idx) => (
                  <div key={idx} className="transaction-detail-modal__payment">
                    <div className="payment-info">
                      <div className="payment-method">{formatPaymentMethod(payment.payment_method)}</div>
                      <div className="payment-transaction">
                        {payment.transaction_id && `Mã GD: ${payment.transaction_id}`}
                      </div>
                      <div className="payment-date">{formatDate(payment.paid_at || payment.created_at)}</div>
                    </div>
                    <div className="payment-status">
                      <span className={`status-badge status-badge--${payment.payment_status}`}>
                        {formatPaymentStatus(payment.payment_status)}
                      </span>
                      <div className="payment-amount">{formatCurrency(payment.amount)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


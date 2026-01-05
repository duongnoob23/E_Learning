import React, { useState } from "react";
import { HiXMark, HiCheckCircle, HiXCircle, HiAcademicCap, HiCreditCard, HiChartBar, HiBookOpen, HiClipboardDocumentList, HiFolderOpen } from "react-icons/hi2";
import { useAdminUserDetail } from "../hooks/useUsersAdminQueries";
import UserExamsTab from "./UserExamsTab";
import UserFlashcardsTab from "./UserFlashcardsTab";
import UserCreatedTopicsTab from "./UserCreatedTopicsTab";
import UserCoursesTab from "./UserCoursesTab";
import "./UserModals.scss";

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(amount) {
  if (!amount) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function formatStatus(status) {
  const statusMap = {
    active: "Active",
    banned: "Banned",
    inactive: "Inactive",
    pending_verification: "Pending Verification",
  };
  return statusMap[status] || status;
}

function formatEnrollmentStatus(status) {
  const statusMap = {
    active: { text: "Đang học", class: "active" },
    completed: { text: "Hoàn thành", class: "completed" },
    cancelled: { text: "Đã hủy", class: "cancelled" },
    expired: { text: "Hết hạn", class: "expired" },
  };
  return statusMap[status] || { text: status, class: "default" };
}

function formatPaymentStatus(status) {
  const statusMap = {
    pending: { text: "Chờ xử lý", class: "pending" },
    processing: { text: "Đang xử lý", class: "processing" },
    completed: { text: "Thành công", class: "completed" },
    failed: { text: "Thất bại", class: "failed" },
    cancelled: { text: "Đã hủy", class: "cancelled" },
    refunded: { text: "Hoàn tiền", class: "refunded" },
  };
  return statusMap[status] || { text: status, class: "default" };
}

export default function UserDetailModal({ userId, onClose }) {
  const [activeTab, setActiveTab] = useState("info");
  const { data: userData, isLoading, error } = useAdminUserDetail(userId);

  const data = userData?.DT;
  const user = data?.user;
  const enrollments = data?.enrollments || [];
  const payments = data?.payments || [];
  const stats = data?.stats || {};

  if (isLoading) {
    return (
      <div className="user-modal__backdrop" onClick={onClose}>
        <div className="user-modal__wrapper user-modal__wrapper--detail-extended" onClick={(e) => e.stopPropagation()}>
          <div className="user-modal__loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="user-modal__backdrop" onClick={onClose}>
        <div className="user-modal__wrapper user-modal__wrapper--detail-extended" onClick={(e) => e.stopPropagation()}>
          <div className="user-modal__header">
            <h2>User Details</h2>
            <button className="user-modal__btn-close" onClick={onClose}>
              <HiXMark />
            </button>
          </div>
          <div className="user-modal__content">
            <p className="user-modal__error-text">Error loading user details</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-modal__backdrop" onClick={onClose}>
      <div className="user-modal__wrapper user-modal__wrapper--detail-extended" onClick={(e) => e.stopPropagation()}>
        <div className="user-modal__header">
          <h2>User Details</h2>
          <button className="user-modal__btn-close" onClick={onClose}>
            <HiXMark />
          </button>
        </div>

        {/* Stats Summary */}
        <div className="user-detail__stats">
          <div className="user-detail__stat-card">
            <HiAcademicCap className="user-detail__stat-icon" />
            <div className="user-detail__stat-info">
              <span className="user-detail__stat-value">{stats.totalEnrollments || 0}</span>
              <span className="user-detail__stat-label">Khóa học</span>
            </div>
          </div>
          <div className="user-detail__stat-card">
            <HiChartBar className="user-detail__stat-icon" />
            <div className="user-detail__stat-info">
              <span className="user-detail__stat-value">{stats.completedCourses || 0}</span>
              <span className="user-detail__stat-label">Hoàn thành</span>
            </div>
          </div>
          <div className="user-detail__stat-card">
            <HiCreditCard className="user-detail__stat-icon" />
            <div className="user-detail__stat-info">
              <span className="user-detail__stat-value">{formatCurrency(stats.totalSpent || 0)}</span>
              <span className="user-detail__stat-label">Tổng chi tiêu</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="user-detail__tabs">
          <button
            className={`user-detail__tab ${activeTab === "info" ? "user-detail__tab--active" : ""}`}
            onClick={() => setActiveTab("info")}
          >
            Thông tin
          </button>
          <button
            className={`user-detail__tab ${activeTab === "exams" ? "user-detail__tab--active" : ""}`}
            onClick={() => setActiveTab("exams")}
          >
            <HiClipboardDocumentList /> Bài thi
          </button>
          <button
            className={`user-detail__tab ${activeTab === "flashcards" ? "user-detail__tab--active" : ""}`}
            onClick={() => setActiveTab("flashcards")}
          >
            <HiBookOpen /> Flashcards
          </button>
          <button
            className={`user-detail__tab ${activeTab === "created-topics" ? "user-detail__tab--active" : ""}`}
            onClick={() => setActiveTab("created-topics")}
          >
            <HiFolderOpen /> Topics đã tạo
          </button>
          <button
            className={`user-detail__tab ${activeTab === "courses" ? "user-detail__tab--active" : ""}`}
            onClick={() => setActiveTab("courses")}
          >
            <HiAcademicCap /> Khóa học
          </button>
          <button
            className={`user-detail__tab ${activeTab === "payments" ? "user-detail__tab--active" : ""}`}
            onClick={() => setActiveTab("payments")}
          >
            <HiCreditCard /> Giao dịch ({payments.length})
          </button>
        </div>

        <div className="user-modal__content user-modal__content--scrollable">
          {/* Tab: Info */}
          {activeTab === "info" && (
            <>
              {/* Avatar & Basic Info */}
              <div className="user-detail__profile">
                <div className="user-detail__avatar">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.username} />
                  ) : (
                    <span>{(user.username || user.full_name || "U")[0].toUpperCase()}</span>
                  )}
                </div>
                <div className="user-detail__basic">
                  <h3>{user.full_name || user.username}</h3>
                  <p>@{user.username}</p>
                  <span className={`user-detail__status user-detail__status--${user.status}`}>
                    {formatStatus(user.status)}
                  </span>
                </div>
              </div>

              {/* Info Grid */}
              <div className="user-detail__grid">
                <div className="user-detail__item">
                  <label>User ID</label>
                  <span>{user.user_id}</span>
                </div>
                <div className="user-detail__item">
                  <label>Email</label>
                  <span className="user-detail__with-icon">
                    {user.email}
                    {user.email_verified ? (
                      <HiCheckCircle className="user-detail__icon--success" />
                    ) : (
                      <HiXCircle className="user-detail__icon--muted" />
                    )}
                  </span>
                </div>
                <div className="user-detail__item">
                  <label>Phone</label>
                  <span className="user-detail__with-icon">
                    {user.phone_number || "Not provided"}
                    {user.phone_verified ? (
                      <HiCheckCircle className="user-detail__icon--success" />
                    ) : (
                      <HiXCircle className="user-detail__icon--muted" />
                    )}
                  </span>
                </div>
                <div className="user-detail__item">
                  <label>Created At</label>
                  <span>{formatDate(user.created_at)}</span>
                </div>
                <div className="user-detail__item">
                  <label>Updated At</label>
                  <span>{formatDate(user.updated_at)}</span>
                </div>
                <div className="user-detail__item">
                  <label>Last Login</label>
                  <span>{formatDate(user.last_login) || "Never"}</span>
                </div>
              </div>
            </>
          )}

          {/* Tab: Exams */}
          {activeTab === "exams" && <UserExamsTab userId={userId} />}

          {/* Tab: Flashcards */}
          {activeTab === "flashcards" && <UserFlashcardsTab userId={userId} />}

          {/* Tab: Created Topics */}
          {activeTab === "created-topics" && <UserCreatedTopicsTab userId={userId} />}

          {/* Tab: Courses */}
          {activeTab === "courses" && <UserCoursesTab userId={userId} />}

          {/* Tab: Enrollments (Legacy - redirect to courses) */}
          {activeTab === "enrollments" && (
            <div className="user-detail__enrollments">
              {enrollments.length === 0 ? (
                <p className="user-detail__empty">Người dùng chưa đăng ký khóa học nào</p>
              ) : (
                <table className="user-detail__table">
                  <thead>
                    <tr>
                      <th>Khóa học</th>
                      <th>Giá</th>
                      <th>Tiến độ</th>
                      <th>Trạng thái</th>
                      <th>Ngày đăng ký</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollments.map((enrollment) => {
                      const enrollStatus = formatEnrollmentStatus(enrollment.status);
                      return (
                        <tr key={enrollment.enrollment_id}>
                          <td>
                            <div className="user-detail__course-info">
                              {enrollment.Course?.image && (
                                <img src={enrollment.Course.image} alt="" className="user-detail__course-img" />
                              )}
                              <span>{enrollment.Course?.title || "N/A"}</span>
                            </div>
                          </td>
                          <td>
                            {enrollment.Course?.is_free ? (
                              <span className="user-detail__badge user-detail__badge--free">Miễn phí</span>
                            ) : (
                              formatCurrency(enrollment.Course?.price)
                            )}
                          </td>
                          <td>
                            <div className="user-detail__progress">
                              <div
                                className="user-detail__progress-bar"
                                style={{ width: `${enrollment.progress_percent || 0}%` }}
                              />
                              <span>{enrollment.progress_percent || 0}%</span>
                            </div>
                          </td>
                          <td>
                            <span className={`user-detail__badge user-detail__badge--${enrollStatus.class}`}>
                              {enrollStatus.text}
                            </span>
                          </td>
                          <td>{formatDate(enrollment.enrolled_at)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Tab: Payments */}
          {activeTab === "payments" && (
            <div className="user-detail__payments">
              {payments.length === 0 ? (
                <p className="user-detail__empty">Người dùng chưa có giao dịch nào</p>
              ) : (
                <table className="user-detail__table">
                  <thead>
                    <tr>
                      <th>Mã đơn hàng</th>
                      <th>Khóa học</th>
                      <th>Số tiền</th>
                      <th>Phương thức</th>
                      <th>Trạng thái</th>
                      <th>Ngày tạo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => {
                      const payStatus = formatPaymentStatus(payment.payment_status);
                      const courses = payment.order?.items?.map((item) => item.course?.title).join(", ") || "N/A";
                      return (
                        <tr key={payment.payment_id}>
                          <td>{payment.order?.order_number || "N/A"}</td>
                          <td className="user-detail__cell-truncate" title={courses}>
                            {courses}
                          </td>
                          <td>{formatCurrency(payment.amount)}</td>
                          <td>
                            <span className="user-detail__payment-method">
                              {payment.payment_method?.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <span className={`user-detail__badge user-detail__badge--${payStatus.class}`}>
                              {payStatus.text}
                            </span>
                          </td>
                          <td>{formatDate(payment.created_at)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        <div className="user-modal__actions">
          <button className="user-modal__btn user-modal__btn--secondary" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}


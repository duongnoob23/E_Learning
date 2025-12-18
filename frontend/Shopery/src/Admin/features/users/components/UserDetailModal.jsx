import React from "react";
import { HiXMark, HiCheckCircle, HiXCircle } from "react-icons/hi2";
import { useAdminUserDetail } from "../hooks/useUsersAdminQueries";
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

function formatStatus(status) {
  const statusMap = {
    active: "Active",
    banned: "Banned",
    inactive: "Inactive",
    pending_verification: "Pending Verification",
  };
  return statusMap[status] || status;
}

export default function UserDetailModal({ userId, onClose }) {
  const { data: userData, isLoading, error } = useAdminUserDetail(userId);

  const user = userData?.DT;

  if (isLoading) {
    return (
      <div className="user-modal__backdrop" onClick={onClose}>
        <div className="user-modal__wrapper user-modal__wrapper--detail" onClick={(e) => e.stopPropagation()}>
          <div className="user-modal__loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="user-modal__backdrop" onClick={onClose}>
        <div className="user-modal__wrapper user-modal__wrapper--detail" onClick={(e) => e.stopPropagation()}>
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
      <div className="user-modal__wrapper user-modal__wrapper--detail" onClick={(e) => e.stopPropagation()}>
        <div className="user-modal__header">
          <h2>User Details</h2>
          <button className="user-modal__btn-close" onClick={onClose}>
            <HiXMark />
          </button>
        </div>

        <div className="user-modal__content">
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
        </div>

        <div className="user-modal__actions">
          <button className="user-modal__btn user-modal__btn--secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}


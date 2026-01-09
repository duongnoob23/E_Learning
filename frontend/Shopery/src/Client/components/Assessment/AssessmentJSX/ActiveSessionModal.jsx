// components/Assessment/AssessmentJSX/ActiveSessionModal.jsx
import { useState } from "react";
import "../AssessmentCSS/ActiveSessionModal.css";

/**
 * Modal hiển thị danh sách active sessions khi user đang có bài thi chưa hoàn thành
 */
export default function ActiveSessionModal({
  isOpen,
  sessions = [],
  requestedTestId,
  onContinue,
  onCancel,
  onClose,
  isLoading = false,
}) {
  const [cancelingSessionId, setCancelingSessionId] = useState(null);

  if (!isOpen) return null;

  // Format thời gian
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Tính thời gian đã làm
  const getElapsedTime = (startTime) => {
    const start = new Date(startTime);
    const now = new Date();
    const diffMs = now - start;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffHours > 0) {
      return `${diffHours} giờ ${diffMins % 60} phút`;
    }
    return `${diffMins} phút`;
  };

  const handleContinue = (session) => {
    if (onContinue) {
      onContinue(session);
    }
  };

  const handleCancel = async (sessionId) => {
    setCancelingSessionId(sessionId);
    try {
      if (onCancel) {
        await onCancel(sessionId);
      }
    } finally {
      setCancelingSessionId(null);
    }
  };

  return (
    <div className="active-session-modal__overlay" onClick={onClose}>
      <div
        className="active-session-modal__container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="active-session-modal__header">
          <h2 className="active-session-modal__title">
            ⚠️ Bạn đang có bài thi chưa hoàn thành
          </h2>
          <button className="active-session-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="active-session-modal__body">
          <p className="active-session-modal__description">
            Bạn có thể tiếp tục bài thi đang làm dở hoặc hủy để bắt đầu bài thi
            mới.
          </p>

          <div className="active-session-modal__sessions">
            {sessions.map((session) => (
              <div
                key={session.exam_session_id}
                className={`active-session-modal__session ${
                  session.test_id === requestedTestId ? "active-session-modal__session--current" : ""
                }`}
              >
                <div className="active-session-modal__session-info">
                  <h3 className="active-session-modal__session-title">
                    {session.test?.title || `Bài thi #${session.test_id}`}
                    {session.test_id === requestedTestId && (
                      <span className="active-session-modal__badge">
                        Bài thi đang chọn
                      </span>
                    )}
                  </h3>
                  <div className="active-session-modal__session-meta">
                    <span className="active-session-modal__meta-item">
                      🕐 Bắt đầu: {formatTime(session.start_time)}
                    </span>
                    <span className="active-session-modal__meta-item">
                      ⏱️ Đã làm: {getElapsedTime(session.start_time)}
                    </span>
                    <span className="active-session-modal__meta-item">
                      ✅ Đã trả lời: {session.cached_answers_count || 0} câu
                    </span>
                  </div>
                </div>

                <div className="active-session-modal__session-actions">
                  <button
                    className="active-session-modal__btn active-session-modal__btn--continue"
                    onClick={() => handleContinue(session)}
                    disabled={isLoading || cancelingSessionId === session.exam_session_id}
                  >
                    Tiếp tục làm bài
                  </button>
                  <button
                    className="active-session-modal__btn active-session-modal__btn--cancel"
                    onClick={() => handleCancel(session.exam_session_id)}
                    disabled={isLoading || cancelingSessionId === session.exam_session_id}
                  >
                    {cancelingSessionId === session.exam_session_id
                      ? "Đang hủy..."
                      : "Hủy bài này"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="active-session-modal__footer">
          <button
            className="active-session-modal__btn active-session-modal__btn--secondary"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}


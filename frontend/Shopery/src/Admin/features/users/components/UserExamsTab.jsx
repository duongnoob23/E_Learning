import React, { useMemo } from "react";
import {
  useUserExams,
  useUserExamStatistics,
} from "../hooks/useUsersAdminQueries";
import "./UserExamsTab.scss";

export default function UserExamsTab({ userId }) {
  // Sử dụng admin API để lấy thống kê và lịch sử exam
  const {
    data: examsData,
    isLoading: loadingExams,
    error: examsError,
  } = useUserExams(userId, { page: 1, limit: 50 });
  const {
    data: statsData,
    isLoading: loadingStats,
    error: statsError,
  } = useUserExamStatistics(userId);

  // Helper function để convert sang number an toàn
  const toNumber = (value, defaultValue = 0) => {
    if (value === null || value === undefined) return defaultValue;
    const num = typeof value === "string" ? parseFloat(value) : Number(value);
    return isNaN(num) ? defaultValue : num;
  };

  // Lấy dữ liệu từ API response
  const stats = statsData?.DT || {};
  const examsResponse = examsData?.DT || {};
  const exams = Array.isArray(examsResponse.exams)
    ? examsResponse.exams
    : Array.isArray(examsResponse)
    ? examsResponse
    : [];
  const userStats = stats.overall || {};

  // Parse selected_parts từ string hoặc array
  const parseSelectedParts = (selectedParts) => {
    if (!selectedParts) return [];
    if (Array.isArray(selectedParts)) return selectedParts;
    try {
      return JSON.parse(selectedParts);
    } catch (e) {
      return [];
    }
  };

  // Format thời gian làm bài
  const formatDuration = (seconds) => {
    if (!seconds || seconds === 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Format ngày
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Tính tổng số câu hỏi
  const getTotalQuestions = (exam) => {
    return (
      toNumber(exam.correct_answers, 0) +
      toNumber(exam.wrong_answers, 0) +
      toNumber(exam.skipped_answers, 0)
    );
  };

  // Debug log
  console.log("=== UserExamsTab Debug ===");
  console.log("examsData:", examsData);
  console.log("exams:", exams);
  console.log("userStats:", userStats);
  console.log("=========================");

  if (loadingExams || loadingStats) {
    return (
      <div className="user-exams-tab__loading">Đang tải dữ liệu bài thi...</div>
    );
  }

  if (examsError || statsError) {
    return (
      <div className="user-exams-tab__error">
        <p>
          Lỗi khi tải dữ liệu: {examsError?.message || statsError?.message}
        </p>
      </div>
    );
  }

  return (
    <div className="user-exams-tab">
      {/* Statistics Cards */}
      {userStats && Object.keys(userStats).length > 0 && (
        <div className="user-exams-tab__stats-grid">
          <div className="user-exams-tab__stat-card">
            <div className="user-exams-tab__stat-card-value">
              {toNumber(userStats.total_exams, 0)}
            </div>
            <div className="user-exams-tab__stat-card-label">
              Tổng số bài thi
            </div>
          </div>
          <div className="user-exams-tab__stat-card">
            <div className="user-exams-tab__stat-card-value">
              {toNumber(userStats.average_score, 0).toFixed(1)}
            </div>
            <div className="user-exams-tab__stat-card-label">
              Điểm trung bình
            </div>
          </div>
          <div className="user-exams-tab__stat-card">
            <div className="user-exams-tab__stat-card-value">
              {toNumber(userStats.best_score, 0)}
            </div>
            <div className="user-exams-tab__stat-card-label">Điểm cao nhất</div>
          </div>
          <div className="user-exams-tab__stat-card">
            <div className="user-exams-tab__stat-card-value">
              {toNumber(userStats.worst_score, 0)}
            </div>
            <div className="user-exams-tab__stat-card-label">Điểm thấp nhất</div>
          </div>
        </div>
      )}

      {/* Lịch sử làm bài */}
      <div className="user-exams-tab__statistics">
        <h4 className="user-exams-tab__section-title">
          Lịch sử làm bài của người dùng
        </h4>
        {exams.length === 0 ? (
          <div className="user-exams-tab__empty">
            Người dùng chưa làm bài thi nào
          </div>
        ) : (
          <div className="user-exams-tab__statistics-table">
            <div className="user-exams-tab__statistics-header">
              <div className="user-exams-tab__statistics-cell">Ngày làm</div>
              <div className="user-exams-tab__statistics-cell">Kết quả</div>
              <div className="user-exams-tab__statistics-cell">
                Thời gian làm bài
              </div>
              <div className="user-exams-tab__statistics-cell">Hành động</div>
            </div>
            <div className="user-exams-tab__statistics-body">
              {exams.map((session) => {
                const selectedParts = parseSelectedParts(session.selected_parts);
                const totalQuestions = getTotalQuestions(session);
                const isFullTest =
                  session.session_type === "FULL_TEST" ||
                  selectedParts.length >= 7;

                return (
                  <div
                    key={session.exam_session_id}
                    className="user-exams-tab__statistics-row"
                  >
                    <div className="user-exams-tab__statistics-cell">
                      <div className="user-exams-tab__session-date">
                        {formatDate(session.end_time || session.start_time)}
                      </div>
                      <div className="user-exams-tab__session-tags">
                        <span
                          className={`user-exams-tab__session-tag ${
                            isFullTest
                              ? "user-exams-tab__session-tag--practice"
                              : ""
                          }`}
                        >
                          {isFullTest ? "Làm Full Test" : "Luyện Tập"}
                        </span>
                        {selectedParts.map((part) => (
                          <span
                            key={part}
                            className="user-exams-tab__session-tag"
                          >
                            Part {part}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="user-exams-tab__statistics-cell">
                      <div className="user-exams-tab__session-result">
                        {toNumber(session.correct_answers, 0)}/{totalQuestions}
                      </div>
                    </div>
                    <div className="user-exams-tab__statistics-cell">
                      <div className="user-exams-tab__session-duration">
                        {formatDuration(toNumber(session.duration_seconds, 0))}
                      </div>
                    </div>
                    <div className="user-exams-tab__statistics-cell">
                      {session.exam_session_id && session.test_id && (
                        <button
                          className="user-exams-tab__session-detail-btn"
                          onClick={() => {
                            // Điều hướng đến trang kết quả chi tiết
                            window.open(
                              `/assessment/${session.test_id}/result?sessionId=${session.exam_session_id}`,
                              "_blank"
                            );
                          }}
                        >
                          Xem chi tiết
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

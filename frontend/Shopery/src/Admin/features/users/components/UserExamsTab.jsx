import React from "react";
import { HiCheckCircle, HiClock, HiXCircle } from "react-icons/hi2";
import {
  useUserExams,
  useUserExamStatistics,
} from "../hooks/useUsersAdminQueries";

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(seconds) {
  if (!seconds) return "N/A";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

export default function UserExamsTab({ userId }) {
  // Sử dụng admin API để lấy thống kê và lịch sử exam
  const {
    data: examsData,
    isLoading: loadingExams,
    error: examsError,
  } = useUserExams(userId, { page: 1, limit: 10 });
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

  // Format số với 1 chữ số thập phân
  const formatScore = (value) => {
    const num = toNumber(value, 0);
    return num.toFixed(1);
  };

  // Lấy dữ liệu từ API response
  const stats = statsData?.DT || {};
  const examsResponse = examsData?.DT || {};
  // Backend trả về DT.exams (array), không phải DT.exams.exams
  const exams = Array.isArray(examsResponse.exams)
    ? examsResponse.exams
    : Array.isArray(examsResponse)
    ? examsResponse
    : [];
  const userStats = stats.overall || {};
  const partStats = Array.isArray(stats.by_part) ? stats.by_part : [];

  // Debug log để kiểm tra dữ liệu
  console.log("=== UserExamsTab Debug ===");
  console.log("examsData (raw):", examsData);
  console.log("statsData (raw):", statsData);
  console.log("examsResponse:", examsResponse);
  console.log("exams (parsed):", exams);
  console.log("exams.length:", exams.length);
  console.log("userStats:", userStats);
  console.log("partStats:", partStats);
  console.log("=========================");

  if (loadingExams || loadingStats) {
    return <div className="user-detail__loading">Loading exam data...</div>;
  }

  if (examsError || statsError) {
    return (
      <div className="user-detail__error">
        <p>
          Error loading exam data: {examsError?.message || statsError?.message}
        </p>
      </div>
    );
  }

  return (
    <div className="user-detail__exams">
      {/* Statistics Cards */}
      {userStats && (
        <div className="user-detail__stats-grid">
          <div className="user-detail__stat-card">
            <div className="user-detail__stat-value">
              {toNumber(userStats.total_exams, 0)}
            </div>
            <div className="user-detail__stat-label">Tổng số bài thi</div>
          </div>
          <div className="user-detail__stat-card">
            <div className="user-detail__stat-value">
              {formatScore(userStats.average_score)}
            </div>
            <div className="user-detail__stat-label">Điểm trung bình</div>
          </div>
          <div className="user-detail__stat-card">
            <div className="user-detail__stat-value">
              {toNumber(userStats.best_score, 0)}
            </div>
            <div className="user-detail__stat-label">Điểm cao nhất</div>
          </div>
          <div className="user-detail__stat-card">
            <div className="user-detail__stat-value">
              {toNumber(userStats.worst_score, 0)}
            </div>
            <div className="user-detail__stat-label">Điểm thấp nhất</div>
          </div>
        </div>
      )}

      {/* Exam History Table */}
      <div className="user-detail__table-wrapper">
        <h3 className="user-detail__section-title">Lịch sử làm bài thi</h3>
        {exams.length === 0 ? (
          <p className="user-detail__empty">Người dùng chưa làm bài thi nào</p>
        ) : (
          <>
            <table className="user-detail__table">
              <thead>
                <tr>
                  <th>Bài thi</th>
                  <th>Loại</th>
                  <th>Điểm</th>
                  <th>Đúng/Sai</th>
                  <th>Thời gian</th>
                  <th>Ngày làm</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam, idx) => (
                  <tr key={exam.exam_session_id || idx}>
                    <td>
                      <div>
                        <div>
                          {exam.test_name || exam.title || "Unknown Test"}
                        </div>
                        {exam.selected_parts &&
                          Array.isArray(exam.selected_parts) &&
                          exam.selected_parts.length > 0 && (
                            <div
                              style={{
                                fontSize: "0.85em",
                                color: "#666",
                                marginTop: "4px",
                              }}
                            >
                              Parts: {exam.selected_parts.join(", ")}
                            </div>
                          )}
                        {exam.session_type && (
                          <span
                            className="user-detail__badge user-detail__badge--secondary"
                            style={{
                              marginTop: "4px",
                              display: "inline-block",
                            }}
                          >
                            {exam.session_type === "FULL_TEST"
                              ? "Full Test"
                              : exam.session_type}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="user-detail__badge user-detail__badge--info">
                        {exam.exam_type || "TOEIC"}
                      </span>
                    </td>
                    <td>
                      <strong className="user-detail__score">
                        {toNumber(exam.total_score, 0)}
                      </strong>
                    </td>
                    <td>
                      <span className="user-detail__correct">
                        {toNumber(exam.correct_answers, 0)}
                      </span>{" "}
                      /{" "}
                      <span className="user-detail__wrong">
                        {toNumber(exam.wrong_answers, 0)}
                      </span>
                    </td>
                    <td>
                      <span className="user-detail__with-icon">
                        <HiClock />{" "}
                        {formatDuration(toNumber(exam.duration_seconds, 0))}
                      </span>
                    </td>
                    <td>{formatDate(exam.start_time)}</td>
                    <td>
                      {exam.status === "COMPLETED" ? (
                        <HiCheckCircle className="user-detail__icon--success" />
                      ) : (
                        <HiXCircle className="user-detail__icon--muted" />
                      )}
                    </td>
                    <td>
                      {exam.exam_session_id && exam.test_id && (
                        <button
                          className="user-detail__btn user-detail__btn--primary"
                          onClick={() =>
                            window.open(
                              `/assessment/${exam.test_id}/result?sessionId=${exam.exam_session_id}`,
                              "_blank"
                            )
                          }
                        >
                          Xem chi tiết
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination - Note: recent_sessions chỉ trả về 10 items, không có pagination */}
          </>
        )}
      </div>

      {/* Part Statistics */}
      {partStats && partStats.length > 0 && (
        <div className="user-detail__table-wrapper">
          <h3 className="user-detail__section-title">Thống kê theo phần</h3>
          <table className="user-detail__table">
            <thead>
              <tr>
                <th>Phần</th>
                <th>Loại</th>
                <th>Tỷ lệ đúng</th>
                <th>Số lần làm</th>
                <th>Lần làm gần nhất</th>
              </tr>
            </thead>
            <tbody>
              {partStats.map((part, idx) => (
                <tr key={part.part_id || idx}>
                  <td>{part.part_name || "Unknown"}</td>
                  <td>
                    <span className="user-detail__badge user-detail__badge--secondary">
                      {part.part_type || "LISTENING"}
                    </span>
                  </td>
                  <td>{formatScore(part.accuracy_rate)}%</td>
                  <td>{toNumber(part.total_attempts, 0)}</td>
                  <td>{formatDate(part.last_attempt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

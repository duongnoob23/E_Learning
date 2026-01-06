import React, { useState } from "react";
import {
  useUserExams,
  useUserExamStatistics,
} from "../hooks/useUsersAdminQueries";
import ExamResultModal from "./ExamResultModal";
import { HiClipboardDocumentList, HiChartBar } from "react-icons/hi2";
import "./UserExamsTab.scss";

export default function UserExamsTab({ userId }) {
  const [selectedSessionId, setSelectedSessionId] = useState(null);
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

  // Xác định test type từ test object hoặc session
  const getTestType = (session) => {
    const test = session.test || session.Test || {};
    // Kiểm tra từ test type field
    if (test.test_type) {
      const type = test.test_type.toLowerCase();
      if (type.includes('listening') || type.includes('reading')) return 'listening-reading';
      if (type.includes('writing')) return 'writing';
      if (type.includes('speaking')) return 'speaking';
    }
    // Kiểm tra từ test name/title
    const title = (test.title || test.test_title || '').toLowerCase();
    if (title.includes('listening') || title.includes('reading') || title.includes('toeic')) {
      return 'listening-reading';
    }
    if (title.includes('writing')) return 'writing';
    if (title.includes('speaking')) return 'speaking';
    // Mặc định là listening-reading
    return 'listening-reading';
  };

  // Kiểm tra có phải Full Test không dựa trên test type và số part
  const isFullTest = (session) => {
    const selectedParts = parseSelectedParts(session.selected_parts);
    const testType = getTestType(session);
    
    // Nếu session_type là FULL_TEST thì là Full Test
    if (session.session_type === "FULL_TEST") return true;
    
    // Kiểm tra theo test type
    if (testType === 'listening-reading') {
      // Listening-Reading: cần đủ part 1-7
      const requiredParts = [1, 2, 3, 4, 5, 6, 7];
      return requiredParts.every(part => selectedParts.includes(part));
    } else if (testType === 'writing' || testType === 'speaking') {
      // Writing/Speaking: cần đủ part 1-5
      const requiredParts = [1, 2, 3, 4, 5];
      return requiredParts.every(part => selectedParts.includes(part));
    }
    
    // Fallback: nếu có >= 7 part thì coi là Full Test
    return selectedParts.length >= 7;
  };

  // Format test type để hiển thị
  const formatTestType = (type) => {
    const typeMap = {
      'listening-reading': 'Listening-Reading',
      'writing': 'Writing',
      'speaking': 'Speaking'
    };
    return typeMap[type] || type;
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

  // Tính tổng số lượt làm bài
  const totalAttempts = exams.length;
  
  // Tính số bài thi khác nhau đã làm
  const uniqueTests = new Set(exams.map((e) => e.test_id)).size;

  return (
    <div className="user-exams-tab">
      {/* Statistics Cards - Hiển thị nằm ngang */}
      <div className="user-exams-tab__stats-grid">
        <div className="user-exams-tab__stat-card">
          <HiClipboardDocumentList className="user-exams-tab__stat-icon" />
          <div className="user-exams-tab__stat-info">
            <div className="user-exams-tab__stat-card-value">
              {uniqueTests}
            </div>
            <div className="user-exams-tab__stat-card-label">
              Số bài thi đã làm
            </div>
          </div>
        </div>
        <div className="user-exams-tab__stat-card">
          <HiChartBar className="user-exams-tab__stat-icon" />
          <div className="user-exams-tab__stat-info">
            <div className="user-exams-tab__stat-card-value">
              {totalAttempts}
            </div>
            <div className="user-exams-tab__stat-card-label">
              Tổng số lượt làm
            </div>
          </div>
        </div>
        {userStats && Object.keys(userStats).length > 0 && (
          <>
            <div className="user-exams-tab__stat-card">
              <div className="user-exams-tab__stat-info">
                <div className="user-exams-tab__stat-card-value">
                  {toNumber(userStats.average_score, 0).toFixed(1)}
                </div>
                <div className="user-exams-tab__stat-card-label">
                  Điểm trung bình
                </div>
              </div>
            </div>
            <div className="user-exams-tab__stat-card">
              <div className="user-exams-tab__stat-info">
                <div className="user-exams-tab__stat-card-value">
                  {toNumber(userStats.best_score, 0)}
                </div>
                <div className="user-exams-tab__stat-card-label">Điểm cao nhất</div>
              </div>
            </div>
          </>
        )}
      </div>

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
              <div className="user-exams-tab__statistics-cell">Bài thi</div>
              <div className="user-exams-tab__statistics-cell">Type</div>
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
                const testType = getTestType(session);
                const fullTest = isFullTest(session);
                const test = session.test || session.Test || {};
                const testTitle = test.title || test.test_title || `Test ${session.test_id || "N/A"}`;

                return (
                  <div
                    key={session.exam_session_id}
                    className="user-exams-tab__statistics-row"
                  >
                    <div className="user-exams-tab__statistics-cell">
                      <div className="user-exams-tab__test-title">
                        {testTitle}
                      </div>
                    </div>
                    <div className="user-exams-tab__statistics-cell">
                      <div className="user-exams-tab__test-type">
                        {formatTestType(testType)}
                      </div>
                    </div>
                    <div className="user-exams-tab__statistics-cell">
                      <div className="user-exams-tab__session-date">
                        {formatDate(session.end_time || session.start_time)}
                      </div>
                      <div className="user-exams-tab__session-tags">
                        <span
                          className={`user-exams-tab__session-tag ${
                            fullTest
                              ? "user-exams-tab__session-tag--practice"
                              : ""
                          }`}
                        >
                          {fullTest ? "Làm Full Test" : "Luyện Tập"}
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
                      {session.exam_session_id && (
                        <button
                          className="user-exams-tab__session-detail-btn"
                          onClick={() => {
                            // Mở modal để xem chi tiết kết quả
                            setSelectedSessionId(session.exam_session_id);
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

      {/* Exam Result Modal */}
      {selectedSessionId && (
        <ExamResultModal
          userId={userId}
          examSessionId={selectedSessionId}
          onClose={() => setSelectedSessionId(null)}
        />
      )}
    </div>
  );
}

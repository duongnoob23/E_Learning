import React, { useMemo, useState } from "react";
import { useUserStatistics } from "../../../services/Assessment/assessmentQueries";
import "../AssessmentCSS/InfoBox.css";

const InfoBox = ({ exam, data, testId, userStats }) => {
  const [activeTab, setActiveTab] = useState("info"); // "info", "answer", "statistics"

  console.log("[STEP - 03]", userStats);
  console.log("exam", exam);
  // Lấy thống kê người dùng
  const { data: userStatsData, isLoading: userStatsLoading } =
    useUserStatistics();

  const arrayUserStats = useMemo(() => {
    if (userStats.recent_sessions) {
      return userStats.recent_sessions.filter((item, index) => {
        return item.test_id == 1;
      });
    } else return [];
  }, [userStats, exam?.id]);

  console.log("array", arrayUserStats);

  const isCompleted = useMemo(() => {
    if (arrayUserStats) {
      return arrayUserStats.length;
    }
  }, [arrayUserStats]);

  console.log("boolean", isCompleted);
  return (
    <div className="assessment-info">
      {/* Tags */}
      <div className="assessment-info__tag">#{data?.exam_type}</div>

      {/* Title */}
      <h2 className="assessment-info__title">{data?.title}</h2>

      <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
        <button
          className={`assessment-tab ${activeTab === "info" ? "active" : ""}`}
          onClick={() => setActiveTab("info")}
        >
          Thông tin đề thi
        </button>
        <button
          className={`assessment-tab ${activeTab === "answer" ? "active" : ""}`}
          onClick={() => setActiveTab("answer")}
        >
          Đáp án / Transcript
        </button>
        {isCompleted && (
          <button
            className={`assessment-tab ${
              activeTab === "statistics" ? "active" : ""
            }`}
            onClick={() => setActiveTab("statistics")}
          >
            Thống kê của bạn
          </button>
        )}
      </div>

      {/* Tab content */}
      {activeTab === "info" && (
        <div className="assessment-content">
          <ul className="assessment-info__stats">
            <li>⏱ Thời gian làm bài: {data?.total_duration} phút |</li>
            <li>7 Phần thi |</li>
            <li>🧩{data?.total_questions} câu hỏi |</li>
            <li>💬0 bình luận</li>
          </ul>
          <div>👥1 người đã luyện tập đề thi này</div>

          <p className="assessment-info__note">
            <i>
              Chú ý: để được quy đổi sang scaled score (ví dụ trên thang điểm
              990 cho TOEIC hoặc 9.0 cho IELTS), vui lòng chọn chế độ làm FULL
              TEST.
            </i>
          </p>
        </div>
      )}

      {activeTab === "answer" && (
        <div className="assessment-content">
          <h4>Xem đáp án đề thi</h4>
          <ul className="assessment-answer-list">
            {exam?.parts?.map((part, i) => (
              <li key={i}>
                Part {i + 1}: <a href={part.link}>Đáp án</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "statistics" && (
        <div className="assessment-content">
          <h4>Lịch sử làm bài của bạn</h4>
          <div className="assessment-statistics">
            <div className="statistics-table">
              <div className="statistics-table__header">
                <div className="statistics-table__cell">Ngày làm</div>
                <div className="statistics-table__cell">Kết quả</div>
                <div className="statistics-table__cell">Thời gian làm bài</div>
                <div className="statistics-table__cell">Hành động</div>
              </div>
              <div className="statistics-table__body">
                {arrayUserStats.map((session, index) => (
                  <div
                    key={session.exam_session_id}
                    className="statistics-table__row"
                  >
                    <div className="statistics-table__cell">
                      <div className="session-date">
                        {new Date(session.end_time).toLocaleDateString("vi-VN")}
                      </div>
                      <div className="session-tags">
                        <span className="session-tag session-tag--practice">
                          Luyện tập
                        </span>
                        {JSON.parse(session.selected_parts || "[]").map(
                          (part) => (
                            <span key={part} className="session-tag">
                              Part {part}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                    <div className="statistics-table__cell">
                      <div className="session-result">
                        {session.correct_answers}/
                        {session.correct_answers +
                          session.wrong_answers +
                          session.skipped_answers}
                      </div>
                    </div>
                    <div className="statistics-table__cell">
                      <div className="session-duration">
                        {Math.floor(session.duration_seconds / 60)}:
                        {(session.duration_seconds % 60)
                          .toString()
                          .padStart(2, "0")}
                      </div>
                    </div>
                    <div className="statistics-table__cell">
                      <button
                        className="session-detail-btn"
                        onClick={() => {
                          // Điều hướng đến trang kết quả chi tiết
                          window.location.href = `/assessment/${testId}/result?sessionId=${session.exam_session_id}`;
                        }}
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoBox;

// import React, { useState } from "react";
// import "../AssessmentCSS/InfoBox.css";

// const InfoBox = ({ exam, data }) => {
//   const [activeTab, setActiveTab] = useState("info"); // "info" hoặc "answer"

//   return (
//     <div className="assessment-info">
//       {/* Tags */}
//       <div className="assessment-info__tag">#{data?.exam_type}</div>

//       {/* Title */}
//       <h2 className="assessment-info__title">{data?.title}</h2>

//       <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
//         <button
//           className={`assessment-tab ${activeTab === "info" ? "active" : ""}`}
//           onClick={() => setActiveTab("info")}
//         >
//           Thông tin đề thi
//         </button>
//         <button
//           className={`assessment-tab ${activeTab === "answer" ? "active" : ""}`}
//           onClick={() => setActiveTab("answer")}
//         >
//           Đáp án / Transcript
//         </button>
//       </div>

//       {/* Tab content */}
//       {activeTab === "info" && (
//         <div className="assessment-content">
//           <ul className="assessment-info__stats">
//             <li>⏱ Thời gian làm bài: {data?.total_duration} phút |</li>
//             <li>7 Phần thi |</li>
//             <li>🧩{data?.total_questions} câu hỏi |</li>
//             <li>💬0 bình luận</li>
//           </ul>
//           <div>👥1 người đã luyện tập đề thi này</div>

//           <p className="assessment-info__note">
//             <i>
//               Chú ý: để được quy đổi sang scaled score (ví dụ trên thang điểm
//               990 cho TOEIC hoặc 9.0 cho IELTS), vui lòng chọn chế độ làm FULL
//               TEST.
//             </i>
//           </p>
//         </div>
//       )}

//       {activeTab === "answer" && (
//         <div className="assessment-content">
//           <h4>Xem đáp án đề thi</h4>
//           <ul className="assessment-answer-list">
//             {exam.parts.map((part, i) => (
//               <li key={i}>
//                 Part {i + 1}: <a href={part.link}>Đáp án</a>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InfoBox;

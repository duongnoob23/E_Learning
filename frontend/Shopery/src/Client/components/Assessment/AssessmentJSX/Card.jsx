// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "../AssessmentCSS/Card.css";

// const Card = ({ exam, id, isCompleted, userStats }) => {
//   const navigate = useNavigate();

//   const handleNavigate = () => {
//     if (isCompleted) {
//       // Nếu đã hoàn thành, điều hướng đến trang kết quả
//       navigate(`/assessment/${id}/result`, {
//         state: { testId: exam.test_id, isCompleted: true },
//       });
//     } else {
//       // Nếu chưa làm, điều hướng đến trang chi tiết
//       navigate(`/assessment/${id}`, {
//         state: { testId: exam.test_id },
//       });
//     }
//   };

//   // Tìm session gần nhất cho test này
//   const getLatestSession = () => {
//     if (!userStats?.recent_sessions) return null;

//     return userStats.recent_sessions
//       .filter(
//         (session) =>
//           session.test_id === exam.test_id && session.status === "COMPLETED"
//       )
//       .sort((a, b) => new Date(b.end_time) - new Date(a.end_time))[0];
//   };

//   const latestSession = getLatestSession();

//   return (
//     <div
//       className={`assessment-card ${
//         isCompleted ? "assessment-card--completed" : ""
//       }`}
//       onClick={handleNavigate}
//     >
//       {/* Icon hoàn thành */}
//       {isCompleted && <div className="assessment-card__completed-icon">✅</div>}

//       <div className="assessment-card__title">{exam?.title}</div>
//       <div className="assessment-card__info">
//         <span>🕒 Thời gian: {exam?.total_duration} Phút</span>
//       </div>
//       <div className="assessment-card__info">
//         <span>👥 1 Người đã làm đề thi</span>
//       </div>
//       <div className="assessment-card__details">
//         {exam?.total_parts} phần thi
//       </div>
//       <div className="assessment-card__details">
//         {exam?.total_questions} câu hỏi
//       </div>

//       {/* Hiển thị kết quả nếu đã hoàn thành */}
//       {isCompleted && latestSession && (
//         <div className="assessment-card__result">
//           <span className="assessment-card__score">
//             Điểm: {latestSession.total_score}
//           </span>
//           <span className="assessment-card__accuracy">
//             Đúng: {latestSession.correct_answers}/
//             {latestSession.correct_answers +
//               latestSession.wrong_answers +
//               latestSession.skipped_answers}
//           </span>
//         </div>
//       )}

//       <div className="assessment-card__tags">
//         <span className="assessment-card__tag">#{exam?.exam_type}</span>
//       </div>
//       <button
//         className={`assessment-card__button ${
//           isCompleted ? "assessment-card__button--result" : ""
//         }`}
//       >
//         {isCompleted ? "Xem kết quả" : "Chi tiết"}
//       </button>
//     </div>
//   );
// };

// export default Card;

import React from "react";
import { useNavigate } from "react-router-dom";
import "../AssessmentCSS/Card.css";
const Card = ({ exam, id, isCompleted, userStats }) => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate(`/assessment/${id}`, {
      state: { testId: exam.test_id, userStats: userStats },
    });
  };

  return (
    <div className="assessment-card" onClick={handleNavigate}>
      <div className="assessment-card__title">
        {" "}
        {isCompleted && (
          <>
            <i
              class="fa-solid fa-circle-check"
              style={{ background: "white", color: "#3CB46E" }}
            ></i>
          </>
        )}
        <></>
        {exam?.title}
      </div>

      <div className="assessment-card__info">
        <span>🕒 Thời gian:{exam?.total_duration} Phút</span>
      </div>
      <div className="assessment-card__info">
        <span>👥 1 Người đã làm đề thi</span>
      </div>
      <div className="assessment-card__details">
        {exam?.total_parts} phần thi
      </div>
      <div className="assessment-card__details">
        {exam?.total_questions} câu hỏi
      </div>
      <div className="assessment-card__tags">
        <span className="assessment-card__tag">#{exam?.exam_type}</span>
      </div>
      <button className="assessment-card__button">
        {isCompleted ? "Xem kết quả" : "Chi tiết"}
      </button>
    </div>
  );
};

export default Card;

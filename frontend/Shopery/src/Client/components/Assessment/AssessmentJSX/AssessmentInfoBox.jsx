import React, { useState } from "react";
import "../AssessmentCSS/AssessmentInfoBox.css";

const AssessmentInfoBox = ({ exam }) => {
  const [activeTab, setActiveTab] = useState("info"); // "info" hoặc "answer"

  return (
    <div className="assessment-info">
      {/* Tags */}
      <div className="assessment-info__tags">
        {exam.tags.map((tag, i) => (
          <span key={i} className="assessment-info__tag">
            #{tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h2 className="assessment-info__title">{exam.title}</h2>

      {/* Tabs */}
      <div className="assessment-tabs" style={{ display: "flex", gap: "8px" }}>
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
          Đáp án/transcript
        </button>
      </div>

      {/* Tab content */}
      {activeTab === "info" && (
        <div className="assessment-content">
          <ul className="assessment-info__stats">
            <li>⏱ {exam.duration} phút</li>
            <li>🧩 {exam.questions} câu</li>
            <li>👥 {exam.participants.toLocaleString()} người luyện tập</li>
            <li>💬 {exam.comments} bình luận</li>
          </ul>

          <p className="assessment-info__note">
            Chú ý: để được quy đổi sang scaled score (ví dụ trên thang điểm 990
            cho TOEIC hoặc 9.0 cho IELTS), vui lòng chọn chế độ làm FULL TEST.
          </p>
        </div>
      )}

      {activeTab === "answer" && (
        <div className="assessment-content">
          <h4>Xem đáp án đề thi</h4>
          <ul className="assessment-answer-list">
            {exam.parts.map((part, i) => (
              <li key={i}>
                Part {i + 1}: <a href={part.link}>Đáp án</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AssessmentInfoBox;

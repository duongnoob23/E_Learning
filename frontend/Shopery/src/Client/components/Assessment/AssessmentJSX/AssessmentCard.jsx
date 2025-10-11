import React from "react";
import "../AssessmentCSS/AssessmentCard.css";
import { useNavigate } from "react-router-dom";
const AssessmentCard = ({ exam, id }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/assessment/${id}`);
  };

  return (
    <div className="assessment-card" onClick={handleNavigate}>
      <div className="assessment-card__title">{exam.title}</div>
      <div className="assessment-card__info">
        <span>🕒 {exam.duration}</span>
        <span>👥 {exam.users.toLocaleString()}</span>
      </div>
      <div className="assessment-card__details">
        {exam.parts} phần thi | {exam.questions} câu hỏi
      </div>
      <div className="assessment-card__tags">
        <span className="assessment-card__tag">#TOEIC</span>
      </div>
      <button className="assessment-card__button">Chi tiết</button>
    </div>
  );
};

export default AssessmentCard;

import React from "react";
import { useNavigate } from "react-router-dom";
import "../AssessmentCSS/Card.css";
const Card = ({ exam, id }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/assessment/${id}`, {
      state: { testId: exam.test_id },
    });
  };

  return (
    <div className="assessment-card" onClick={handleNavigate}>
      <div className="assessment-card__title">{exam?.title}</div>
      <div className="assessment-card__info">
        <span>🕒 {exam?.total_duration}</span>
        <span>👥 1</span>
      </div>
      <div className="assessment-card__details">
        {exam?.total_parts} phần thi | {exam?.total_questions} câu hỏi
      </div>
      <div className="assessment-card__tags">
        <span className="assessment-card__tag">#{exam?.exam_type}</span>
      </div>
      <button className="assessment-card__button">Chi tiết</button>
    </div>
  );
};

export default Card;

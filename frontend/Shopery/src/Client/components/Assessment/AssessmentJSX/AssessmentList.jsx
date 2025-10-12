import React from "react";
import "../AssessmentCSS/AssessmentList.css";
import AssessmentCard from "./AssessmentCard";

const data = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  title: `New Economy TOEIC Test ${i + 1}`,
  duration: "120 phút",
  users: Math.floor(Math.random() * 1000000),
  questions: 200,
  parts: 7,
}));

const AssessmentList = () => {
  return (
    <div className="assessment-list">
      {data.map((assessment) => (
        <AssessmentCard
          key={assessment.id}
          exam={assessment}
          id={assessment.id}
        />
      ))}
    </div>
  );
};

export default AssessmentList;

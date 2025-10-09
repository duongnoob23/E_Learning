import React from "react";
import "../AssessmentCSS/AssessmentPagination.css";

const AssessmentPagination = () => {
  return (
    <div className="assessment-pagination">
      <button className="assessment-pagination__btn" disabled>
        «
      </button>
      <button className="assessment-pagination__btn assessment-pagination__btn--active">
        1
      </button>
      <button className="assessment-pagination__btn">2</button>
      <button className="assessment-pagination__btn">3</button>
      <button className="assessment-pagination__btn">»</button>
    </div>
  );
};

export default AssessmentPagination;

import React from "react";
import "../AssessmentCSS/AssessmentLayout.css";

const AssessmentLayout = ({ left, right }) => {
  return (
    <div className="assessment-layout">
      <div className="assessment-layout__left">{left}</div>
      <div className="assessment-layout__right">{right}</div>
    </div>
  );
};

export default AssessmentLayout;

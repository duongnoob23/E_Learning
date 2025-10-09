import React from "react";
import "../AssessmentCSS/AssessmentTabPanel.css";

const AssessmentTabPanel = ({ children, active, tab }) => {
  if (!active) return null;
  return (
    <div className="assessment-tab-panel" data-tab={tab}>
      {children}
    </div>
  );
};

export default AssessmentTabPanel;

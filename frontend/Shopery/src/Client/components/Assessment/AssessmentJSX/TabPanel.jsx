import React from "react";
import "../AssessmentCSS/TabPanel.css";

const TabPanel = ({ children, active, tab }) => {
  if (!active) return null;
  return (
    <div className="assessment-tab-panel" data-tab={tab}>
      {children}
    </div>
  );
};

export default TabPanel;

import React from "react";
import "../AssessmentCSS/Layout.css";

const Layout = ({ left, right }) => {
  return (
    <div className="assessment-layout">
      <div className="assessment-layout__left">{left}</div>
      <div className="assessment-layout__right">{right}</div>
    </div>
  );
};

export default Layout;

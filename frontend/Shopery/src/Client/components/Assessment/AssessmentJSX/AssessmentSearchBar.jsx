import React from "react";
import "../AssessmentCSS/AssessmentSearchBar.css";

const AssessmentSearchBar = () => {
  return (
    <div className="assessment-search">
      <input
        type="text"
        className="assessment-search__input"
        placeholder="Nhập từ khóa bạn muốn tìm kiếm..."
      />
      <button className="assessment-search__button">Tìm kiếm</button>
    </div>
  );
};

export default AssessmentSearchBar;

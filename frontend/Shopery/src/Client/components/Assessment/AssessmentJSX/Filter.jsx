import React from "react";
import "../AssessmentCSS/Filter.css";

const categories = [
  "Tất cả",
  "toeic speaking",
  "toeic writing",
  "toeic listening-reading",
];

const Filter = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div className="assessment-filter">
      <div className="assessment-filter__categories">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`assessment-filter__btn ${selectedCategory === cat ? "assessment-filter__btn--active" : ""
              }`}
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Filter;

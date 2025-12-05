import React from "react";
import "../AssessmentCSS/Filter.css";

const categories = [
  "Tất cả",
  "IELTS Academic",
  "IELTS General",
  "TOEIC",
  "TOEIC SW",
  "HSK 1",
  "HSK 2",
  "HSK 3",
  "HSK 4",
  "TOPIK I",
  "TOPIK II",
];

const subCategories = [
  "2024",
  "2023",
  "2022",
  "2021",
  "2020",
  "New economy",
  "Y1",
  "Y2",
  "ETS (old format)",
];

const Filter = () => {
  return (
    <div className="assessment-filter">
      <div className="assessment-filter__categories">
        {categories.map((cat) => (
          <button key={cat} className="assessment-filter__btn">
            {cat}
          </button>
        ))}
      </div>
      <div className="assessment-filter__sub">
        {subCategories.map((sub) => (
          <button
            key={sub}
            className="assessment-filter__btn assessment-filter__btn--small"
          >
            {sub}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Filter;

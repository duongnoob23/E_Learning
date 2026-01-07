import React from "react";
import "../AssessmentCSS/SearchBar.css";

const SearchBar = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="assessment-search">
      <input
        type="text"
        className="assessment-search__input"
        placeholder="Nhập từ khóa bạn muốn tìm kiếm..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <button className="assessment-search__button">Tìm kiếm</button>
    </div>
  );
};

export default SearchBar;

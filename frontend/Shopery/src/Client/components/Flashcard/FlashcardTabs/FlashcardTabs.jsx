// Client/components/Flashcard/FlashcardTabs/FlashcardTabs.jsx
import React from "react";
import "./FlashcardTabs.css";

const FlashcardTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "explore", label: "Khám phá" },
    { id: "my-lists", label: "List từ của tôi" },
    { id: "learning", label: "Đang học" },
  ];

  return (
    <div className="flashcard-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`flashcard-tab ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default FlashcardTabs;

import React, { useState } from "react";
import "../AssessmentCSS/AssessmentTabs.css";
import AssessmentPartSelector from "./AssessmentPartSelector";
import AssessmentComment from "./AssessmentComment";
import { useNavigate } from "react-router-dom";

const tabs = ["Luyện tập", "Full test", "Thảo luận"];

const parts = [
  {
    name: "Part 1",
    description: "Tranh và người và vật",
    count: 6,
  },
  {
    name: "Part 2",
    description: "Câu hỏi ngắn",
    count: 25,
  },
  {
    name: "Part 3",
    description: "Hội thoại ngắn",
    count: 39,
  },
  {
    name: "Part 4",
    description: "Bài nói ngắn",
    count: 30,
  },
  {
    name: "Part 5",
    description: "Từ vựng & ngữ pháp",
    count: 40,
  },
  {
    name: "Part 6",
    description: "Hoàn thành đoạn văn",
    count: 12,
  },
  {
    name: "Part 7",
    description: "Đọc hiểu",
    count: 48,
  },
];

const AssessmentTabs = () => {
  const [activeTab, setActiveTab] = useState("Luyện tập");

  const navigate = useNavigate();
  const handleStartTest = () => {
    // 👇 Chuyển sang trang làm bài
    console.log("run");

    navigate("/assessmentTest");
  };
  return (
    <div className="assessment-tabs">
      <div className="assessment-tabs__header">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`assessment-tabs__btn ${
              activeTab === tab ? "assessment-tabs__btn--active" : ""
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Luyện tập" && <AssessmentPartSelector />}

      {activeTab === "Full test" && (
        <div className="assessment-tabs_content_fix">
          <div className="assessment-tabs__content">
            <p>Chế độ Full Test sẽ làm toàn bộ 200 câu trong 120 phút.</p>
            <button
              className="assessment-tabs__start-btn"
              onClick={handleStartTest}
            >
              Bắt đầu làm bài
            </button>
          </div>
        </div>
      )}

      {activeTab === "Thảo luận" && (
        <div className="assessment-tabs__content">
          <AssessmentComment />
        </div>
      )}
    </div>
  );
};

export default AssessmentTabs;

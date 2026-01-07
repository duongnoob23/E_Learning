import {
  HiOutlineAcademicCap,
  HiOutlineBookmark,
  HiOutlineGlobeAlt,
} from "react-icons/hi2";
import "./FlashcardTabs.css";

const FlashcardTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: "explore",
      label: "Khám phá",
      icon: HiOutlineGlobeAlt,
      description: "Các chủ đề từ hệ thống",
    },
    {
      id: "my-lists",
      label: "List từ của tôi",
      icon: HiOutlineBookmark,
      description: "Danh sách bạn đã tạo",
    },
    {
      id: "learning",
      label: "Đang học",
      icon: HiOutlineAcademicCap,
      description: "Từ vựng đang ôn luyện",
    },
  ];

  return (
    <div className="flashcard-tabs-container">
      <div className="flashcard-tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`flashcard-tab ${
                activeTab === tab.id ? "active" : ""
              }`}
              onClick={() => onTabChange(tab.id)}
            >
              <Icon className="tab-icon" />
              <span className="tab-label">{tab.label}</span>
            </button>
          );
        })}

        {/* Active Tab Indicator */}
        <div
          className="tab-indicator"
          style={{
            left: `${
              tabs.findIndex((t) => t.id === activeTab) * (100 / tabs.length)
            }%`,
            width: `${100 / tabs.length}%`,
          }}
        />
      </div>
    </div>
  );
};

export default FlashcardTabs;

// Client/pages/Flashcard/Flashcard.jsx
import React, { useState } from "react";
import FlashcardTabs from "../../components/Flashcard/FlashcardTabs/FlashcardTabs";
import FlashcardCard from "../../components/Flashcard/FlashcardCard/FlashcardCard";
import FlashcardDetail from "../../components/Flashcard/FlashcardDetail/FlashcardDetail";
import "./Flashcard.css";

const Flashcard = () => {
  const [activeTab, setActiveTab] = useState("explore");
  const [selectedTopic, setSelectedTopic] = useState(null);

  // Dữ liệu fake cho tab "Khám phá"
  const exploreTopics = [
    {
      id: 1,
      title: "Từ vựng tiếng Anh văn phòng",
      description: "Bộ từ vựng cơ bản cho môi trường công sở",
      wordCount: 536,
      viewCount: 23598,
      logo: "/images/study4-logo.png",
      category: "business",
      difficulty: "intermediate",
    },
    {
      id: 2,
      title: "Từ vựng tiếng Anh giao tiếp trung cấp",
      description: "Từ vựng cần thiết cho giao tiếp hàng ngày",
      wordCount: 798,
      viewCount: 14835,
      logo: "/images/study4-logo.png",
      category: "communication",
      difficulty: "intermediate",
    },
    {
      id: 3,
      title: "Từ vựng Tiếng Anh giao tiếp cơ bản",
      description: "Những từ vựng cơ bản nhất cho người mới bắt đầu",
      wordCount: 993,
      viewCount: 37563,
      logo: "/images/study4-logo.png",
      category: "communication",
      difficulty: "beginner",
    },
    {
      id: 4,
      title: "900 từ TOEFL (có ảnh)",
      description: "Bộ từ vựng TOEFL với hình ảnh minh họa",
      wordCount: 899,
      viewCount: 6801,
      logo: "/images/study4-logo.png",
      category: "exam",
      difficulty: "advanced",
    },
    {
      id: 5,
      title: "900 từ IELTS (có ảnh)",
      description: "Từ vựng IELTS với hình ảnh trực quan",
      wordCount: 899,
      viewCount: 29427,
      logo: "/images/study4-logo.png",
      category: "exam",
      difficulty: "advanced",
    },
    {
      id: 6,
      title: "900 từ SAT (có ảnh)",
      description: "Từ vựng SAT cho học sinh trung học",
      wordCount: 860,
      viewCount: 2781,
      logo: "/images/study4-logo.png",
      category: "exam",
      difficulty: "advanced",
    },
    {
      id: 7,
      title: "GRE-GMAT Vocabulary List",
      description: "Từ vựng chuyên ngành cho GRE và GMAT",
      wordCount: 868,
      viewCount: 693,
      logo: "/images/study4-logo.png",
      category: "exam",
      difficulty: "advanced",
    },
    {
      id: 8,
      title: "Academic word list",
      description: "Từ vựng học thuật cho nghiên cứu",
      wordCount: 570,
      viewCount: 3471,
      logo: "/images/study4-logo.png",
      category: "academic",
      difficulty: "advanced",
    },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSelectedTopic(null);
  };

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
  };

  const handlePractice = () => {
    console.log("Practice mode for topic:", selectedTopic.id);
  };

  const handleStudy = () => {
    console.log("Study mode for topic:", selectedTopic.id);
  };

  const handleBack = () => {
    setSelectedTopic(null);
  };

  const getCurrentTopics = () => {
    switch (activeTab) {
      case "explore":
        return exploreTopics;
      case "my-lists":
        return [];
      case "learning":
        return [];
      default:
        return [];
    }
  };

  const currentTopics = getCurrentTopics();

  if (selectedTopic) {
    return (
      <FlashcardDetail
        topic={selectedTopic}
        onBack={handleBack}
        onPractice={handlePractice}
        onStudy={handleStudy}
      />
    );
  }

  return (
    <div className="flashcard-page">
      <div className="flashcard-container">
        <div className="flashcard-header">
          <h1>Flashcards</h1>
        </div>

        <FlashcardTabs activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Info Banner */}
        <div className="info-banner">
          <div className="info-icon">ℹ</div>
          <p>
            Chú ý: Bạn có thể tạo flashcards từ highlights (bao gồm các
            highlights các bạn đã tạo trước đây) trong trang chi tiết
          </p>
        </div>

        {/* Content based on active tab */}
        {activeTab === "explore" && (
          <div className="topics-section">
            <h3>Khám phá các chủ đề:</h3>
            <div className="topics-grid">
              {currentTopics.map((topic) => (
                <FlashcardCard
                  key={topic.id}
                  topic={topic}
                  onClick={handleTopicClick}
                  showUserInfo={false}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "my-lists" && (
          <div className="topics-section">
            <h3>List từ đã tạo:</h3>
            <div className="empty-learning">
              <p>Chưa có list từ nào được tạo.</p>
            </div>
          </div>
        )}

        {activeTab === "learning" && (
          <div className="topics-section">
            <h3>Đang học:</h3>
            <div className="empty-learning">
              <p>
                Bạn chưa học list từ nào. Khám phá ngay hoặc bắt đầu tạo các
                list từ mới.
              </p>
            </div>
          </div>
        )}

        {/* Pagination */}
        {currentTopics.length > 0 && (
          <div className="pagination">
            <button className="pagination-btn active">1</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Flashcard;

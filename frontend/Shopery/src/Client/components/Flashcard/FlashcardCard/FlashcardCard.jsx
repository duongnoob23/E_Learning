import React from "react";
import { FiPlus, FiBook, FiUsers, FiClock } from "react-icons/fi";
import { HiOutlineBookOpen, HiOutlineAcademicCap } from "react-icons/hi2";
import "./FlashcardCard.css";

const FlashcardCard = ({
  topic,
  isCreateCard = false,
  onClick,
  showUserInfo = false,
  viewMode = "grid",
}) => {
  if (isCreateCard) {
    return (
      <div
        className={`flashcard-card create-card ${viewMode === "list" ? "list-view" : ""}`}
        onClick={onClick}
      >
        <div className="create-card-content">
          <div className="create-card-icon">
            <FiPlus />
          </div>
          <div className="create-card-text">
            <span className="create-title">Tạo danh sách mới</span>
            <span className="create-subtitle">Thêm từ vựng của riêng bạn</span>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="flashcard-card list-view" onClick={() => onClick(topic)}>
        <div className="card-list-left">
          {topic.logo ? (
            <div className="card-list-image">
              <img src={topic.logo} alt={topic.title} />
            </div>
          ) : (
            <div className="card-list-icon">
              <HiOutlineBookOpen />
            </div>
          )}
          
          <div className="card-list-info">
            <h3 className="card-list-title">{topic.title}</h3>
            {topic.description && (
              <p className="card-list-description">{topic.description}</p>
            )}
            
            <div className="card-list-meta">
              <span className="meta-item">
                <FiBook />
                <span>{topic.wordCount || 0} từ</span>
              </span>
              {topic.learnedCount > 0 && (
                <span className="meta-item learned">
                  <HiOutlineAcademicCap />
                  <span>{topic.learnedCount} đã học</span>
                </span>
              )}
              {topic.viewCount > 0 && (
                <span className="meta-item">
                  <FiUsers />
                  <span>{topic.viewCount} lượt học</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="card-list-right">
          {topic.topicType === "system" ? (
            <span className="topic-badge system">Hệ thống</span>
          ) : (
            <span className="topic-badge user">Cá nhân</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flashcard-card grid-view" onClick={() => onClick(topic)}>
      {/* Card Image/Icon */}
      <div className="card-visual">
        {topic.logo ? (
          <img src={topic.logo} alt={topic.title} className="card-image" />
        ) : (
          <div className="card-icon-placeholder">
            <HiOutlineBookOpen />
          </div>
        )}
        
        {/* Topic Type Badge */}
        {topic.topicType === "system" ? (
          <span className="topic-badge-corner system">Hệ thống</span>
        ) : (
          <span className="topic-badge-corner user">Cá nhân</span>
        )}
      </div>

      {/* Card Content */}
      <div className="card-content">
        <h3 className="card-title">{topic.title}</h3>
        
        {topic.description && (
          <p className="card-description">{topic.description}</p>
        )}

        {/* Stats */}
        <div className="card-stats">
          <div className="stat-item primary">
            <FiBook className="stat-icon" />
            <span>{topic.wordCount || 0} từ</span>
          </div>
          
          {topic.viewCount > 0 && (
            <div className="stat-item">
              <FiUsers className="stat-icon" />
              <span>{topic.viewCount}</span>
            </div>
          )}
        </div>

        {/* Progress Bar (if has learned words) */}
        {topic.wordCount > 0 && topic.learnedCount > 0 && (
          <div className="card-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${Math.min((topic.learnedCount / topic.wordCount) * 100, 100)}%` }}
              ></div>
            </div>
            <span className="progress-text">
              {topic.learnedCount}/{topic.wordCount} đã học
            </span>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="card-footer">
        {showUserInfo && topic.createdBy ? (
          <div className="card-author">
            <div className="author-avatar">
              {topic.createdBy.avatar ? (
                <img src={topic.createdBy.avatar} alt={topic.createdBy.name} />
              ) : (
                <span>{topic.createdBy.name?.charAt(0)?.toUpperCase() || "U"}</span>
              )}
            </div>
            <span className="author-name">{topic.createdBy.name || "Bạn"}</span>
          </div>
        ) : (
          <div className="card-provider">
            <div className="provider-logo">
              {topic.logo ? (
                <img src={topic.logo} alt={topic.provider || "EngMoon"} />
              ) : (
                <span className="provider-initial">E</span>
              )}
            </div>
            <span className="provider-name">{topic.provider || "EngMoon"}</span>
          </div>
        )}

        <button className="card-action-btn" onClick={(e) => { e.stopPropagation(); onClick(topic); }}>
          Học ngay
        </button>
      </div>
    </div>
  );
};

export default FlashcardCard;

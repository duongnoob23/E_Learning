import React from "react";
import "./FlashcardCard.css";

const FlashcardCard = ({
  topic,
  isCreateCard = false,
  onClick,
  showUserInfo = false,
}) => {
  if (isCreateCard) {
    return (
      <div className="flashcard-card create-card" onClick={onClick}>
        <div className="create-card-icon">+</div>
        <div className="create-card-text">Tạo list từ</div>
      </div>
    );
  }

  return (
    <div className="flashcard-card" onClick={() => onClick(topic)}>
      <div className="card-header">
        <h3 className="card-title">{topic.title}</h3>
        <div className="card-stats">
          <span className="word-count">
            {topic.wordCount || 0} từ
          </span>
          <span className="divider">|</span>
          <span className="view-count">
            {topic.viewCount || 0} lượt học
          </span>
        </div>
      </div>

      <div className="card-description">{topic.description}</div>

      <div className="card-footer">
        {showUserInfo && topic.createdBy ? (
          <div className="card-user">
            <div className="user-avatar">
              {topic.createdBy.avatar ? (
                <img src={topic.createdBy.avatar} alt={topic.createdBy.name} />
              ) : (
                <span>{topic.createdBy.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <span className="user-name">{topic.createdBy.name}</span>
          </div>
        ) : (
          <div className="provider-info">
            <div className="provider-avatar">
              {topic.logo ? (
                <img src={topic.logo} alt={topic.provider || "study4"} />
              ) : (
                <span>{(topic.provider || "study4").charAt(0).toUpperCase()}</span>
              )}
            </div>
            <span className="provider-name">{topic.provider || "study4"}</span>
          </div>
        )}

        {topic.logo && (
          <div className="card-logo">
            <img src={topic.logo} alt="Logo" />
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardCard;

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
          <span className="word-count">{topic.wordCount} từ</span>
          {topic.viewCount && (
            <span className="view-count">{topic.viewCount}</span>
          )}
        </div>
      </div>

      <div className="card-description">{topic.description}</div>

      {showUserInfo && topic.createdBy && (
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
      )}

      {topic.logo && (
        <div className="card-logo">
          <img src={topic.logo} alt="Logo" />
        </div>
      )}
    </div>
  );
};

export default FlashcardCard;

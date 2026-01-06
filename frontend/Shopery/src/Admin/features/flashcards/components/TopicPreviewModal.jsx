import React, { useState, useEffect } from "react";
import { HiXMark } from "react-icons/hi2";
import { useAdminWords } from "../../words/hooks/useWordsAdminQueries";
import WordListDisplay from "../../../../Client/components/Flashcard/WordListDisplay/WordListDisplay";
import "./TopicPreviewModal.scss";

export default function TopicPreviewModal({ topic, onClose }) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50; // Load all words for preview
  
  // Fetch words from this topic
  const {
    data: wordsData,
    isLoading,
    error,
  } = useAdminWords({
    page: currentPage,
    limit: rowsPerPage,
    topic_id: topic?.topic_id,
  });
  
  const words = wordsData?.DT?.words || [];
  
  if (!topic) return null;
  
  return (
    <div className="topic-preview-modal-overlay" onClick={onClose}>
      <div className="topic-preview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="topic-preview-modal__header">
          <div className="topic-preview-modal__header-content">
            {topic.image_url && (
              <img
                src={topic.image_url}
                alt={topic.topic_name}
                className="topic-preview-modal__topic-image"
              />
            )}
            <div className="topic-preview-modal__topic-info">
              <h2 className="topic-preview-modal__topic-title">{topic.topic_name}</h2>
              <p className="topic-preview-modal__topic-description">
                {topic.description || "No description"}
              </p>
              <div className="topic-preview-modal__topic-meta">
                <span className={`topic-preview-modal__type-badge ${
                  topic.topic_type === "system"
                    ? "topic-preview-modal__type-badge--system"
                    : "topic-preview-modal__type-badge--user"
                }`}>
                  {topic.topic_type === "system" ? "SYSTEM" : "USER"}
                </span>
                <span className="topic-preview-modal__word-count">
                  {words.length} words
                </span>
              </div>
            </div>
          </div>
          <button className="topic-preview-modal__close" onClick={onClose}>
            <HiXMark />
          </button>
        </div>
        
        <div className="topic-preview-modal__content">
          {isLoading ? (
            <div className="topic-preview-modal__loading">Loading words...</div>
          ) : error ? (
            <div className="topic-preview-modal__error">Error loading words</div>
          ) : words.length === 0 ? (
            <div className="topic-preview-modal__empty">
              No words in this topic yet.
            </div>
          ) : (
            <WordListDisplay
              words={words}
              topicType={topic.topic_type || "system"}
              topicId={topic.topic_id}
            />
          )}
        </div>
      </div>
    </div>
  );
}


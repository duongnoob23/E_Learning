// Client/components/Flashcard/FlashcardDetail/FlashcardDetail.jsx (cập nhật)
import React, { useState } from "react";
import { useWordsByTopic } from "../../../hooks/Flashcard/useFlashcardQueries";
import "./FlashcardDetail.css";

const FlashcardDetail = ({ topic, onBack, showActionButtons = false }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  const [studyMode, setStudyMode] = useState("list"); // "list" hoặc "flashcard"
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddWordModal, setShowAddWordModal] = useState(false);
  const [showBulkAddModal, setShowBulkAddModal] = useState(false);

  // Debug logs
  console.log("=== FLASHCARD DETAIL DEBUG ===");
  console.log("showActionButtons:", showActionButtons);
  console.log("topic:", topic);
  console.log("=============================");

  // API call để lấy words theo topic_id
  const {
    data: wordsData,
    isLoading: wordsLoading,
    error: wordsError,
  } = useWordsByTopic(topic.id, {
    page: 1,
    limit: 100, // Lấy tối đa 100 words
  });

  // Extract words từ API response
  const words = wordsData?.DT?.words || [];
  const currentWord = words[currentWordIndex];

  const handleNext = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setShowDefinition(false);
    }
  };

  const handlePrevious = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
      setShowDefinition(false);
    }
  };

  const handleFlip = () => {
    setShowDefinition(!showDefinition);
  };

  const handleModeChange = (mode) => {
    setStudyMode(mode);
    setCurrentWordIndex(0);
    setShowDefinition(false);
  };

  // Xử lý xem ngẫu nhiên
  const handleRandomView = () => {
    if (words.length > 0) {
      const randomIndex = Math.floor(Math.random() * words.length);
      setCurrentWordIndex(randomIndex);
      setShowDefinition(false);
    }
  };

  // Xử lý dừng học list từ
  const handleStopStudying = () => {
    if (window.confirm("Bạn có chắc chắn muốn dừng học list từ này?")) {
      onBack(); // Quay lại trang chủ flashcard
    }
  };

  // Xử lý chỉnh sửa topic
  const handleEditTopic = () => {
    setShowEditModal(true);
  };

  // Xử lý thêm từ mới
  const handleAddWord = () => {
    setShowAddWordModal(true);
  };

  // Xử lý tạo hàng loạt
  const handleBulkAdd = () => {
    setShowBulkAddModal(true);
  };

  // Loading state
  if (wordsLoading) {
    return (
      <div className="flashcard-detail">
        <div className="detail-header">
          <button className="back-btn" onClick={onBack}></button>
          <h1 className="detail-title">Flashcards: {topic.title}</h1>
          <div></div>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải danh sách từ vựng...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (wordsError) {
    return (
      <div className="flashcard-detail">
        <div className="detail-header">
          <button className="back-btn" onClick={onBack}>
            ←
          </button>
          <h1 className="detail-title">Flashcards: {topic.title}</h1>
        </div>
        <div className="error-container">
          <p>Có lỗi xảy ra khi tải danh sách từ vựng. Vui lòng thử lại sau.</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (words.length === 0) {
    return (
      <div className="flashcard-detail">
        <div className="detail-header">
          <button className="back-btn" onClick={onBack}>
            ←
          </button>
          <h1 className="detail-title">Flashcards: {topic.title}</h1>
        </div>
        <div className="empty-container">
          <p>Chủ đề này chưa có từ vựng nào.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flashcard-detail">
      {/* Header */}
      <div className="detail-header">
        <button className="back-btn" onClick={onBack}>
          ←
        </button>
        <h1 className="detail-title">Flashcards: {topic.title}</h1>
      </div>

      {/* Action Buttons - Chỉ hiển thị cho topics từ "List từ của tôi" */}
      {showActionButtons && (
        <div className="action-buttons-container">
          <button className="action-btn edit-btn" onClick={handleEditTopic}>
            Chỉnh sửa
          </button>
          <button className="action-btn add-word-btn" onClick={handleAddWord}>
            Thêm từ mới
          </button>
          <button className="action-btn bulk-add-btn" onClick={handleBulkAdd}>
            Tạo hàng loạt
          </button>
        </div>
      )}

      {/* Study Mode Toggle */}
      <div className="study-mode-toggle">
        <button
          className={`mode-btn ${studyMode === "list" ? "active" : ""}`}
          onClick={() => handleModeChange("list")}
        >
          📋 Danh sách từ
        </button>
        <button
          className={`mode-btn ${studyMode === "flashcard" ? "active" : ""}`}
          onClick={() => handleModeChange("flashcard")}
        >
          🃏 Flashcard
        </button>
      </div>

      {/* Action Buttons */}
      <div className="detail-actions">
        {/* <button className="action-btn practice-btn" onClick={onPractice}>
          Luyện tập flashcards
        </button> */}
        <div className="action-links">
          <button
            className="action-link"
            onClick={handleRandomView}
            disabled={words.length === 0}
            title={
              words.length === 0
                ? "Chưa có từ vựng để xem ngẫu nhiên"
                : "Xem từ vựng ngẫu nhiên"
            }
          >
            <span className="link-icon">↻</span>
            Xem ngẫu nhiên
          </button>
          <button className="action-link stop-btn" onClick={handleStopStudying}>
            <span className="link-icon">✕</span>
            Dừng học list từ này
          </button>
        </div>
      </div>

      {/* Word Count */}
      <div className="word-count-info">List có {words.length} từ</div>

      {/* Content based on study mode */}
      {studyMode === "list" ? (
        /* List Mode */
        <div className="word-list-container">
          <div className="word-list">
            {words.map((word, index) => (
              <div key={word.id} className="word-list-item">
                <div className="word-list-number">{index + 1}</div>
                <div className="word-list-content">
                  <div className="word-list-text">
                    <div className="word-list-header">
                      <h3 className="word-list-word">{word.word}</h3>
                      <span className="word-list-type">
                        ({word.partOfSpeech})
                      </span>
                      <span className="word-list-pronunciation">
                        {word.pronunciation}
                      </span>
                    </div>
                    <p className="word-list-definition">{word.meaningVi}</p>
                    <div className="word-list-example">
                      <p className="example-en">{word.exampleEn}</p>
                      <p className="example-vi">{word.exampleVi}</p>
                    </div>
                  </div>
                  {word.imageUrl && (
                    <div className="word-list-image">
                      <img src={word.imageUrl} alt={word.word} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Flashcard Mode */
        <div className="flashcard-container">
          <div className="flashcard-progress">
            {currentWordIndex + 1} / {words.length}
          </div>

          <div className="flashcard" onClick={handleFlip}>
            <div
              className={`flashcard-inner ${showDefinition ? "flipped" : ""}`}
            >
              {/* Front */}
              <div className="flashcard-front">
                <div className="word-section">
                  <h2 className="word">{currentWord.word}</h2>
                  <span className="word-type">
                    ({currentWord.partOfSpeech})
                  </span>
                </div>
                <div className="pronunciation-section">
                  <span className="pronunciation">
                    {currentWord.pronunciation}
                  </span>
                  <button className="audio-btn">🔊</button>
                </div>
                <p className="flip-hint">Nhấp để xem nghĩa</p>
              </div>

              {/* Back */}
              <div className="flashcard-back">
                <h3 className="definition-title">Định nghĩa:</h3>
                <p className="definition">{currentWord.meaningVi}</p>

                <h4 className="example-title">Ví dụ:</h4>
                <div className="example">
                  <p className="example-en">{currentWord.exampleEn}</p>
                  <p className="example-vi">{currentWord.exampleVi}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Word Image */}
          {currentWord.imageUrl && (
            <div className="word-image">
              <img src={currentWord.imageUrl} alt={currentWord.word} />
            </div>
          )}

          {/* Controls */}
          <div className="flashcard-controls">
            <button
              className="control-btn prev-btn"
              onClick={handlePrevious}
              disabled={currentWordIndex === 0}
            >
              ← Trước
            </button>

            <button className="control-btn flip-btn" onClick={handleFlip}>
              {showDefinition ? "Xem từ" : "Xem nghĩa"}
            </button>

            <button
              className="control-btn next-btn"
              onClick={handleNext}
              disabled={currentWordIndex === words.length - 1}
            >
              Tiếp →
            </button>
          </div>

          {/* Action Buttons */}
          <div className="word-actions">
            <button className="word-action-btn">Đánh dấu đã học</button>
            <button className="word-action-btn">Thêm vào yêu thích</button>
          </div>
        </div>
      )}

      {/* Edit Topic Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chỉnh sửa chủ đề</h2>
              <button
                className="modal-close"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Chức năng chỉnh sửa chủ đề đang được phát triển...</p>
              <div className="modal-actions">
                <button
                  className="btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Word Modal */}
      {showAddWordModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowAddWordModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Thêm từ mới</h2>
              <button
                className="modal-close"
                onClick={() => setShowAddWordModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Chức năng thêm từ mới đang được phát triển...</p>
              <div className="modal-actions">
                <button
                  className="btn-secondary"
                  onClick={() => setShowAddWordModal(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Add Modal */}
      {showBulkAddModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowBulkAddModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Tạo hàng loạt</h2>
              <button
                className="modal-close"
                onClick={() => setShowBulkAddModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Chức năng tạo hàng loạt đang được phát triển...</p>
              <div className="modal-actions">
                <button
                  className="btn-secondary"
                  onClick={() => setShowBulkAddModal(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardDetail;

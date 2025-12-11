// VocabularyList.jsx - Danh sách từ vựng (list/flashcard mode)
// Hỗ trợ: 2 chế độ (danh sách và flashcard), phát âm UK/US, đánh giá mức độ quen thuộc
import { useState } from "react";
import "./VocabularyList.css";

export default function VocabularyList({ lesson }) {
  const lessonData = lesson?.lesson_data || {};
  const words = lessonData.words || [];
  const displayMode = lessonData.display_mode || "list";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  const [studyMode, setStudyMode] = useState(displayMode); // "list" hoặc "flashcard"

  if (words.length === 0) {
    return <div className="vocabulary-list-empty">Không có từ vựng nào</div>;
  }

  const currentWord = words[currentIndex];

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowDefinition(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowDefinition(false);
    }
  };

  const handleFlip = () => {
    setShowDefinition(!showDefinition);
  };

  const handleModeChange = (mode) => {
    setStudyMode(mode);
    setCurrentIndex(0);
    setShowDefinition(false);
  };

  // Phát âm UK
  const playUKAudio = () => {
    if (currentWord.audio_url) {
      const audio = new Audio(currentWord.audio_url);
      audio.play();
    }
  };

  // Phát âm US (giả sử cùng URL, có thể tách riêng sau)
  const playUSAudio = () => {
    if (currentWord.audio_url) {
      const audio = new Audio(currentWord.audio_url);
      audio.play();
    }
  };

  // Xử lý đánh giá mức độ quen thuộc
  const handleRating = (rating) => {
    console.log(`Đánh giá từ "${currentWord.en}" là: ${rating}`);
    // Có thể lưu vào state hoặc gửi lên server
    // Tự động chuyển sang từ tiếp theo
    if (currentIndex < words.length - 1) {
      setTimeout(() => {
        handleNext();
      }, 500);
    }
  };

  // Chế độ Flashcard
  if (studyMode === "flashcard") {
    return (
      <div className="vocabulary-list-container vocabulary-flashcard-mode">
        {/* Header */}
        {/* <div className="vocabulary-list-header">
          <h3>{lesson.title}</h3>
          <div className="vocabulary-progress">
            {currentIndex + 1} / {words.length}
          </div>
        </div> */}

        {/* Study Mode Toggle */}
        <div className="vocabulary-study-mode-toggle">
          <button
            className={`vocabulary-mode-btn ${
              studyMode === "list" ? "active" : ""
            }`}
            onClick={() => handleModeChange("list")}
          >
            📋 Danh sách từ
          </button>
          <button
            className={`vocabulary-mode-btn ${
              studyMode === "flashcard" ? "active" : ""
            }`}
            onClick={() => handleModeChange("flashcard")}
          >
            🃏 Flashcard
          </button>
        </div>

        {/* Flashcard Container */}
        <div className="vocabulary-flashcard-wrapper">
          {/* Badge "Từ mới" */}
          <div className="vocabulary-new-word-badge">Từ mới</div>

          {/* Flashcard */}
          <div className="vocabulary-flashcard" onClick={handleFlip}>
            <div
              className={`vocabulary-flashcard-inner ${
                showDefinition ? "flipped" : ""
              }`}
            >
              {/* Front - Từ tiếng Anh */}
              <div className="vocabulary-flashcard-front">
                <div className="vocabulary-word-section">
                  <h2 className="vocabulary-word">{currentWord.en}</h2>
                </div>
                <div className="vocabulary-pronunciation-section">
                  <span className="vocabulary-pronunciation">
                    {currentWord.pronunciation || "/" + currentWord.en + "/"}
                  </span>
                  <div className="vocabulary-audio-buttons">
                    <button
                      className="vocabulary-audio-btn uk-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        playUKAudio();
                      }}
                      title="Phát âm UK"
                    >
                      🔊 UK
                    </button>
                    <button
                      className="vocabulary-audio-btn us-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        playUSAudio();
                      }}
                      title="Phát âm US"
                    >
                      🔊 US
                    </button>
                  </div>
                </div>
                <p className="vocabulary-flip-hint">Nhấp để xem nghĩa</p>
              </div>

              {/* Back - Nghĩa tiếng Việt */}
              <div className="vocabulary-flashcard-back">
                <h3 className="vocabulary-definition-title">Định nghĩa:</h3>
                <p className="vocabulary-definition">{currentWord.vi}</p>
                {currentWord.example && (
                  <>
                    <h4 className="vocabulary-example-title">Ví dụ:</h4>
                    <div className="vocabulary-example">
                      <p className="vocabulary-example-en">
                        {currentWord.example}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Hình ảnh */}
          {currentWord.image_url && (
            <div className="vocabulary-word-image">
              <img src={currentWord.image_url} alt={currentWord.en} />
            </div>
          )}

          {/* Controls */}
          <div className="vocabulary-flashcard-controls">
            <button
              className="vocabulary-control-btn prev-btn"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              ← Trước
            </button>

            <button
              className="vocabulary-control-btn flip-btn"
              onClick={handleFlip}
            >
              {showDefinition ? "Xem từ" : "Xem nghĩa"}
            </button>

            <button
              className="vocabulary-control-btn next-btn"
              onClick={handleNext}
              disabled={currentIndex === words.length - 1}
            >
              Tiếp →
            </button>
          </div>

          {/* Action Buttons - Đánh giá mức độ quen thuộc */}
          <div className="vocabulary-word-actions">
            <button
              className="vocabulary-action-btn easy-btn"
              onClick={() => handleRating("easy")}
            >
              😊 Dễ
            </button>
            <button
              className="vocabulary-action-btn medium-btn"
              onClick={() => handleRating("medium")}
            >
              😐 Trung bình
            </button>
            <button
              className="vocabulary-action-btn hard-btn"
              onClick={() => handleRating("hard")}
            >
              😓 Khó
            </button>
            <button
              className="vocabulary-action-btn known-btn"
              onClick={() => handleRating("known")}
            >
              ↪️ Đã biết, loại khỏi danh sách ôn tập
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Chế độ Danh sách
  return (
    <div className="vocabulary-list-container vocabulary-list-mode">
      {/* Header */}
      {/* <div className="vocabulary-list-header">
        <h3>{lesson.title}</h3>
      </div> */}

      {/* Study Mode Toggle */}
      <div className="vocabulary-study-mode-toggle">
        <button
          className={`vocabulary-mode-btn ${
            studyMode === "list" ? "active" : ""
          }`}
          onClick={() => handleModeChange("list")}
        >
          📋 Danh sách từ
        </button>
        <button
          className={`vocabulary-mode-btn ${
            studyMode === "flashcard" ? "active" : ""
          }`}
          onClick={() => handleModeChange("flashcard")}
        >
          🃏 Flashcard
        </button>
      </div>

      {/* Word List */}
      <div className="vocabulary-word-list-container">
        <div className="vocabulary-word-list">
          {words.map((word, index) => (
            <div
              key={word.word_id || index}
              className="vocabulary-word-list-item"
            >
              <div className="vocabulary-word-list-number">{index + 1}</div>
              <div className="vocabulary-word-list-content">
                <div className="vocabulary-word-list-text">
                  <div className="vocabulary-word-list-header">
                    <h3 className="vocabulary-word-list-word">{word.en}</h3>
                    <span className="vocabulary-word-list-pronunciation">
                      {word.pronunciation || "/" + word.en + "/"}
                    </span>
                    <div className="vocabulary-word-list-audio">
                      <button
                        className="vocabulary-audio-btn-small uk-btn"
                        onClick={() => {
                          if (word.audio_url) {
                            new Audio(word.audio_url).play();
                          }
                        }}
                        title="Phát âm UK"
                      >
                        🔊 UK
                      </button>
                      <button
                        className="vocabulary-audio-btn-small us-btn"
                        onClick={() => {
                          if (word.audio_url) {
                            new Audio(word.audio_url).play();
                          }
                        }}
                        title="Phát âm US"
                      >
                        🔊 US
                      </button>
                    </div>
                  </div>
                  <p className="vocabulary-word-list-definition">{word.vi}</p>
                  {word.example && (
                    <div className="vocabulary-word-list-example">
                      <p className="vocabulary-example-en">{word.example}</p>
                    </div>
                  )}
                </div>
                {word.image_url && (
                  <div className="vocabulary-word-list-image">
                    <img src={word.image_url} alt={word.en} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

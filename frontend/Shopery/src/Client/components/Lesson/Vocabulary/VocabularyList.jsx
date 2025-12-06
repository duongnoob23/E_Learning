// VocabularyList.jsx - Danh sách từ mới (list/flashcard)
import React, { useState } from "react";
import "./VocabularyList.css";

export default function VocabularyList({ lesson }) {
  const lessonData = lesson?.lesson_data || {};
  const words = lessonData.words || [];
  const displayMode = lessonData.display_mode || "list";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(lessonData.settings?.show_translation || false);
  const [flipped, setFlipped] = useState(false);

  if (words.length === 0) {
    return <div className="vocabulary-list-empty">Không có từ vựng nào</div>;
  }

  const currentWord = words[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % words.length);
    setFlipped(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + words.length) % words.length);
    setFlipped(false);
  };

  if (displayMode === "flashcard") {
    return (
      <div className="vocabulary-flashcard-container">
        <div className="vocabulary-flashcard-header">
          <h3>{lesson.title}</h3>
          <div className="vocabulary-progress">
            {currentIndex + 1} / {words.length}
          </div>
        </div>

        <div 
          className={`vocabulary-flashcard ${flipped ? "flipped" : ""}`}
          onClick={() => setFlipped(!flipped)}
        >
          <div className="vocabulary-flashcard-front">
            <div className="vocabulary-flashcard-image">
              {currentWord.image_url && (
                <img src={currentWord.image_url} alt={currentWord.en} />
              )}
            </div>
            <div className="vocabulary-flashcard-word">
              <h2>{currentWord.en}</h2>
              {currentWord.audio_url && (
                <audio controls className="vocabulary-audio">
                  <source src={currentWord.audio_url} type="audio/mpeg" />
                </audio>
              )}
            </div>
            <div className="vocabulary-flashcard-hint">
              Click để xem nghĩa
            </div>
          </div>

          <div className="vocabulary-flashcard-back">
            <div className="vocabulary-flashcard-translation">
              <h2>{currentWord.vi}</h2>
              <p className="vocabulary-example">{currentWord.example}</p>
            </div>
          </div>
        </div>

        <div className="vocabulary-flashcard-controls">
          <button onClick={handlePrev} disabled={words.length <= 1}>
            <i className="fa fa-chevron-left"></i> Trước
          </button>
          <button onClick={handleNext} disabled={words.length <= 1}>
            Sau <i className="fa fa-chevron-right"></i>
          </button>
        </div>
      </div>
    );
  }

  // List mode
  return (
    <div className="vocabulary-list-container">
      <h3>{lesson.title}</h3>
      <div className="vocabulary-list-grid">
        {words.map((word, index) => (
          <div key={word.word_id || index} className="vocabulary-list-item">
            <div className="vocabulary-item-image">
              {word.image_url && (
                <img src={word.image_url} alt={word.en} />
              )}
            </div>
            <div className="vocabulary-item-content">
              <h4>{word.en}</h4>
              <p className="vocabulary-item-vi">{word.vi}</p>
              {word.example && (
                <p className="vocabulary-item-example">{word.example}</p>
              )}
              {word.audio_url && (
                <audio controls className="vocabulary-item-audio">
                  <source src={word.audio_url} type="audio/mpeg" />
                </audio>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}




// Flashcard Page - Trang học từ vựng
import React, { useState } from "react";
import "./Flashcard.css";

const Flashcard = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Dữ liệu mẫu - sau này sẽ lấy từ API
  const flashcards = [
    {
      id: 1,
      word: "Hello",
      meaning: "Xin chào",
      example: "Hello, how are you?",
      pronunciation: "/həˈloʊ/",
    },
    {
      id: 2,
      word: "Goodbye",
      meaning: "Tạm biệt",
      example: "Goodbye, see you later!",
      pronunciation: "/ˌɡʊdˈbaɪ/",
    },
    {
      id: 3,
      word: "Thank you",
      meaning: "Cảm ơn",
      example: "Thank you for your help.",
      pronunciation: "/ˈθæŋk ju/",
    },
  ];

  const handleNext = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const currentCard = flashcards[currentCardIndex];

  return (
    <div className="flashcard-page">
      <div className="flashcard-container">
        <div className="flashcard-header">
          <h1>Học từ vựng</h1>
          <p>Thẻ học từ vựng tiếng Anh</p>
        </div>

        <div className="flashcard-progress">
          <span>
            {currentCardIndex + 1} / {flashcards.length}
          </span>
        </div>

        <div className="flashcard-card" onClick={handleFlip}>
          <div className={`flashcard-inner ${isFlipped ? "flipped" : ""}`}>
            <div className="flashcard-front">
              <h2 className="flashcard-word">{currentCard.word}</h2>
              <p className="flashcard-pronunciation">
                {currentCard.pronunciation}
              </p>
              <p className="flashcard-hint">Nhấp để xem nghĩa</p>
            </div>
            <div className="flashcard-back">
              <h3 className="flashcard-meaning">{currentCard.meaning}</h3>
              <p className="flashcard-example">{currentCard.example}</p>
            </div>
          </div>
        </div>

        <div className="flashcard-controls">
          <button
            className="flashcard-btn flashcard-btn--prev"
            onClick={handlePrevious}
            disabled={currentCardIndex === 0}
          >
            ← Trước
          </button>

          <button
            className="flashcard-btn flashcard-btn--flip"
            onClick={handleFlip}
          >
            {isFlipped ? "Xem từ" : "Xem nghĩa"}
          </button>

          <button
            className="flashcard-btn flashcard-btn--next"
            onClick={handleNext}
            disabled={currentCardIndex === flashcards.length - 1}
          >
            Tiếp →
          </button>
        </div>

        <div className="flashcard-actions">
          <button className="flashcard-action-btn">Đánh dấu đã học</button>
          <button className="flashcard-action-btn">Thêm vào yêu thích</button>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;

// Client/components/Flashcard/FlashcardDetail/FlashcardDetail.jsx (cập nhật)
import React, { useState } from "react";
import "./FlashcardDetail.css";

const FlashcardDetail = ({ topic, onBack, onPractice, onStudy }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  const [studyMode, setStudyMode] = useState("list"); // "list" hoặc "flashcard"

  // Dữ liệu fake cho words
  const fakeWords = [
    {
      id: 1,
      word: "absent",
      type: "adjective",
      pronunciation: "/'æbsənt/",
      definition: "vắng mặt (vì đau ốm,...)",
      example: {
        en: "Most students were absent from school at least once",
        vi: "Hầu hết sinh viên đã vắng mặt ít nhất một lần",
      },
      image:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 2,
      word: "accept",
      type: "verb",
      pronunciation: "/ǝk'sept/",
      definition: "nhận, chấp nhận",
      example: {
        en: "We accept payment by Visa Electron, Visa, Switch, Maestro, Mastercard, JCB, Solo, check or cash.",
        vi: "Chúng tôi chấp nhận thanh toán bằng thẻ Visa Electron, Visa, Switch, Maestro, Mastercard, JCB, Solo, séc hoặc tiền mặt.",
      },
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 3,
      word: "accomplish",
      type: "verb",
      pronunciation: "/ǝ'kʌmplɪʃ/",
      definition: "hoàn thành, đạt được",
      example: {
        en: "She accomplished all her goals for the year.",
        vi: "Cô ấy đã hoàn thành tất cả mục tiêu trong năm.",
      },
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 4,
      word: "accurate",
      type: "adjective",
      pronunciation: "/'ækjərət/",
      definition: "chính xác, đúng đắn",
      example: {
        en: "The weather forecast was very accurate.",
        vi: "Dự báo thời tiết rất chính xác.",
      },
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
      id: 5,
      word: "achieve",
      type: "verb",
      pronunciation: "/ǝ'tʃiːv/",
      definition: "đạt được, thành công",
      example: {
        en: "He achieved his dream of becoming a doctor.",
        vi: "Anh ấy đã đạt được ước mơ trở thành bác sĩ.",
      },
      image:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
  ];

  // Sử dụng words từ topic hoặc fake words
  const words = topic.words && topic.words.length > 0 ? topic.words : fakeWords;
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

  return (
    <div className="flashcard-detail">
      {/* Header */}
      <div className="detail-header">
        <button className="back-btn" onClick={onBack}>
          ← Quay lại
        </button>
        <h1 className="detail-title">Flashcards: {topic.title}</h1>
      </div>

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
          <button className="action-link">
            <span className="link-icon">↻</span>
            Xem ngẫu nhiên
          </button>
          <button className="action-link stop-btn">
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
                      <span className="word-list-type">({word.type})</span>
                      <span className="word-list-pronunciation">
                        {word.pronunciation}
                      </span>
                    </div>
                    <p className="word-list-definition">{word.definition}</p>
                    <div className="word-list-example">
                      <p className="example-en">{word.example.en}</p>
                      <p className="example-vi">{word.example.vi}</p>
                    </div>
                  </div>
                  {word.image && (
                    <div className="word-list-image">
                      <img src={word.image} alt={word.word} />
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
                  <span className="word-type">({currentWord.type})</span>
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
                <p className="definition">{currentWord.definition}</p>

                <h4 className="example-title">Ví dụ:</h4>
                <div className="example">
                  <p className="example-en">{currentWord.example.en}</p>
                  <p className="example-vi">{currentWord.example.vi}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Word Image */}
          {currentWord.image && (
            <div className="word-image">
              <img src={currentWord.image} alt={currentWord.word} />
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
    </div>
  );
};

export default FlashcardDetail;

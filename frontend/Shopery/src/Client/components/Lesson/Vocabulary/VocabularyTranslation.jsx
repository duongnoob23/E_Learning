// VocabularyTranslation.jsx - Dịch nghĩa (nhập text)
import React, { useState } from "react";
import "./VocabularyTranslation.css";

export default function VocabularyTranslation({ lesson }) {
  const lessonData = lesson?.lesson_data || {};
  const [answer, setAnswer] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const correctAnswer = lessonData.correct_answer || "";
  const maxAttempts = lessonData.max_attempts || 3;
  const hints = lessonData.hints || [];

  const handleSubmit = () => {
    if (!answer.trim()) return;

    const normalizedAnswer = answer.trim().toLowerCase();
    const normalizedCorrect = correctAnswer.toLowerCase();
    
    const correct = normalizedAnswer === normalizedCorrect;
    setIsCorrect(correct);
    setShowResult(true);
    setAttempts(prev => prev + 1);

    if (correct) {
      // Success!
    }
  };

  const handleNext = () => {
    setAnswer("");
    setShowResult(false);
    setIsCorrect(false);
  };

  return (
    <div className="vocabulary-translation-container">
      <h3>{lesson.title}</h3>
      
      <div className="vocabulary-translation-content">
        {lessonData.image_url && (
          <div className="vocabulary-translation-image">
            <img src={lessonData.image_url} alt="Question" />
          </div>
        )}

        <div className="vocabulary-translation-question">
          <p className="vocabulary-translation-vi">{lessonData.vi_text}</p>
          <p className="vocabulary-translation-hint">Nhập từ tiếng Anh:</p>
        </div>

        <div className="vocabulary-translation-input-group">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Nhập từ tiếng Anh..."
            disabled={showResult && isCorrect}
            className="vocabulary-translation-input"
          />
          <button
            onClick={handleSubmit}
            disabled={showResult && isCorrect || attempts >= maxAttempts}
            className="vocabulary-translation-submit"
          >
            Kiểm tra
          </button>
        </div>

        {showResult && (
          <div className={`vocabulary-translation-result ${isCorrect ? "correct" : "wrong"}`}>
            {isCorrect ? (
              <>
                <i className="fa fa-check-circle"></i>
                <p>Chính xác! Đáp án đúng là: <strong>{correctAnswer}</strong></p>
                <button onClick={handleNext} className="vocabulary-translation-next">
                  Câu tiếp theo
                </button>
              </>
            ) : (
              <>
                <i className="fa fa-times-circle"></i>
                <p>Sai rồi! Thử lại nhé.</p>
                {attempts < maxAttempts && hints[attempts] && (
                  <p className="vocabulary-translation-hint-text">
                    Gợi ý: {hints[attempts]}
                  </p>
                )}
                {attempts >= maxAttempts && (
                  <p className="vocabulary-translation-answer">
                    Đáp án đúng: <strong>{correctAnswer}</strong>
                  </p>
                )}
              </>
            )}
          </div>
        )}

        <div className="vocabulary-translation-stats">
          <span>Số lần thử: {attempts} / {maxAttempts}</span>
        </div>
      </div>
    </div>
  );
}




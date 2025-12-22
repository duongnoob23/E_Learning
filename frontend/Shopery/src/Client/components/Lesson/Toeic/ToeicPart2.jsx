// ToeicPart2.jsx - Component hiển thị lesson TOEIC Part 2 cho học viên
// Khác biệt với Part 1: KHÔNG có image, chỉ có 3 đáp án (A, B, C)
import { useEffect, useState } from "react";
import "./ToeicPart2.css";

const CHOICE_LETTERS = ["A", "B", "C"]; // ❌ KHÔNG có D

export default function ToeicPart2({ lesson }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState({}); // { question_id: "A" | "B" | "C" }
  const [hasChecked, setHasChecked] = useState({}); // { question_id: true/false }
  const [showTranscript, setShowTranscript] = useState({}); // { question_id: true/false }
  const [showExplanation, setShowExplanation] = useState({}); // { question_id: true/false }
  const [autoSwitch, setAutoSwitch] = useState(false); // Tự động chuyển câu

  // Parse questions từ lesson_data (hỗ trợ cả string JSON)
  let lessonData = lesson?.lesson_data;
  if (lessonData && typeof lessonData === "string") {
    try {
      lessonData = JSON.parse(lessonData);
    } catch (e) {
      console.error("Error parsing lesson_data:", e);
      lessonData = null;
    }
  }
  const questions = lessonData?.questions || [];

  const currentQuestion = questions[currentQuestionIndex] || null;

  // Reset state khi lesson thay đổi
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedChoices({});
    setHasChecked({});
    setShowTranscript({});
    setShowExplanation({});
  }, [lesson?.lesson_id]);

  const handleSelectChoice = (questionId, choice) => {
    setSelectedChoices((prev) => ({ ...prev, [questionId]: choice }));
  };

  const handleCheckAnswer = (questionId) => {
    setHasChecked((prev) => ({ ...prev, [questionId]: true }));
    setShowTranscript((prev) => ({ ...prev, [questionId]: true }));
    setShowExplanation((prev) => ({ ...prev, [questionId]: true }));

    // Tự động chuyển câu nếu bật auto switch
    if (autoSwitch && currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 1000);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleClearAnswer = (questionId) => {
    setHasChecked((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
    setShowTranscript((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
    setShowExplanation((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
    setSelectedChoices((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  if (!lesson || questions.length === 0) {
    return (
      <div className="toeic-p2-lesson">
        <div className="toeic-p2-lesson__empty">
          Chưa có câu hỏi nào trong bài học này.
        </div>
      </div>
    );
  }

  return (
    <div className="toeic-p2-lesson">
      <div className="toeic-p2-lesson__header">
        <h2 className="toeic-p2-lesson__title">{lesson.title}</h2>
        {lesson.description && (
          <p className="toeic-p2-lesson__description">{lesson.description}</p>
        )}
      </div>

      {/* Current Question */}
      {currentQuestion && (
        <div className="toeic-p2-lesson__question">
          {/* Audio */}
          <div className="toeic-p2-lesson__audio-row">
            {currentQuestion.audio_file ? (
              <audio controls src={currentQuestion.audio_file} />
            ) : (
              <div className="toeic-p2-lesson__audio-placeholder">
                Chưa có audio cho câu này
              </div>
            )}
          </div>

          {/* Options - Chỉ có 3 options, KHÔNG có image */}
          <div className="toeic-p2-lesson__options-col">
            <div className="toeic-p2-lesson__options">
              {CHOICE_LETTERS.map((letter) => {
                const isSelected =
                  selectedChoices[currentQuestion.question_id] === letter;
                const isCorrect =
                  hasChecked[currentQuestion.question_id] &&
                  currentQuestion.correct_choice === letter;
                const isWrong =
                  hasChecked[currentQuestion.question_id] &&
                  selectedChoices[currentQuestion.question_id] === letter &&
                  selectedChoices[currentQuestion.question_id] !==
                    currentQuestion.correct_choice;

                return (
                  <label
                    key={letter}
                    className={`toeic-p2-lesson__option ${
                      isCorrect ? "toeic-p2-lesson__option--correct" : ""
                    } ${isWrong ? "toeic-p2-lesson__option--wrong" : ""}`}
                  >
                    <input
                      type="radio"
                      name={`toeic-p2-q-${currentQuestion.question_id}`}
                      checked={isSelected}
                      onChange={() =>
                        handleSelectChoice(
                          currentQuestion.question_id,
                          letter
                        )
                      }
                      disabled={hasChecked[currentQuestion.question_id]}
                    />
                    <span>{letter}.</span>
                  </label>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="toeic-p2-lesson__buttons">
              <button
                type="button"
                className="toeic-p2-lesson__btn toeic-p2-lesson__btn--primary"
                onClick={() => handleCheckAnswer(currentQuestion.question_id)}
                disabled={hasChecked[currentQuestion.question_id]}
              >
                Kiểm tra đáp án
              </button>
              <button
                type="button"
                className="toeic-p2-lesson__btn"
                onClick={() => handleClearAnswer(currentQuestion.question_id)}
              >
                Xóa hết
              </button>
            </div>

            {/* Transcript & Explanation - Ngay dưới options */}
            {hasChecked[currentQuestion.question_id] && (
              <div className="toeic-p2-lesson__footer">
                {/* Transcript */}
                <div className="toeic-p2-lesson__section">
                  <button
                    type="button"
                    className="toeic-p2-lesson__section-toggle"
                    onClick={() =>
                      setShowTranscript((prev) => ({
                        ...prev,
                        [currentQuestion.question_id]:
                          !prev[currentQuestion.question_id],
                      }))
                    }
                  >
                    Transcript{" "}
                    {showTranscript[currentQuestion.question_id] ? "▲" : "▼"}
                  </button>
                    {showTranscript[currentQuestion.question_id] &&
                      currentQuestion.transcript && (
                        <div className="toeic-p2-lesson__section-body">
                          {CHOICE_LETTERS.map((letter) => (
                            <p key={letter}>
                              <strong>({letter})</strong>{" "}
                              {currentQuestion.transcript[letter] || ""}
                            </p>
                          ))}
                        </div>
                      )}
                </div>

                {/* Explanation */}
                <div className="toeic-p2-lesson__section">
                  <button
                    type="button"
                    className="toeic-p2-lesson__section-toggle"
                    onClick={() =>
                      setShowExplanation((prev) => ({
                        ...prev,
                        [currentQuestion.question_id]:
                          !prev[currentQuestion.question_id],
                      }))
                    }
                  >
                    Giải thích đáp án{" "}
                    {showExplanation[currentQuestion.question_id] ? "▲" : "▼"}
                  </button>
                    {showExplanation[currentQuestion.question_id] &&
                      currentQuestion.explanation && (
                        <div className="toeic-p2-lesson__section-body">
                          <p>
                            Đáp án đúng:{" "}
                            <strong>{currentQuestion.correct_choice}</strong>
                          </p>
                          <p>
                            <strong>Dịch nghĩa từng đáp án:</strong>
                          </p>
                          {CHOICE_LETTERS.map((letter) => (
                            <p key={letter}>
                              <strong>({letter})</strong>{" "}
                              {currentQuestion.explanation[letter] || ""}
                            </p>
                          ))}
                          {currentQuestion.explanation.note && (
                            <>
                              <br />
                              <p>{currentQuestion.explanation.note}</p>
                            </>
                          )}
                        </div>
                      )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Question Navigation với grid - Ở dưới cùng */}
      {questions.length > 1 && (
        <div className="toeic-p2-lesson__nav-wrapper">
          <div className="toeic-p2-lesson__nav-controls">
            <div className="toeic-p2-lesson__nav-controls-left">
              <button
                className="toeic-p2-lesson__nav-btn"
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
              >
                ← Câu trước
              </button>
            </div>
            <div className="toeic-p2-lesson__nav-controls-right">
              <label className="toeic-p2-lesson__auto-switch">
                <input
                  type="checkbox"
                  checked={autoSwitch}
                  onChange={(e) => setAutoSwitch(e.target.checked)}
                />
                Tự động chuyển câu
              </label>
              <button
                className="toeic-p2-lesson__nav-btn"
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                Câu sau →
              </button>
            </div>
          </div>
          <div className="toeic-p2-lesson__nav-grid">
            {questions.map((q, idx) => (
              <button
                key={q.question_id}
                className={`toeic-p2-lesson__nav-grid-btn ${
                  idx === currentQuestionIndex
                    ? "toeic-p2-lesson__nav-grid-btn--active"
                    : ""
                }`}
                onClick={() => setCurrentQuestionIndex(idx)}
              >
                {q.question_number || idx + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


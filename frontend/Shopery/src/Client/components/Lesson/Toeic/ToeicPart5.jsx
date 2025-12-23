// ToeicPart5.jsx - Viewer for TOEIC Part 5 (Incomplete Sentences)
// - Question text + 4 options text
// - No audio/image/transcript
// - After Check: show translation, analysis, explanation

import { useEffect, useState } from "react";
import "./ToeicPart5.css";

const CHOICE_LETTERS = ["A", "B", "C", "D"];

export default function ToeicPart5({ lesson }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState({});
  const [hasChecked, setHasChecked] = useState({});
  const [autoSwitch, setAutoSwitch] = useState(false);

  // parse lesson_data
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

  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedChoices({});
    setHasChecked({});
  }, [lesson?.lesson_id]);

  const handleSelectChoice = (questionId, choice) => {
    setSelectedChoices((prev) => ({ ...prev, [questionId]: choice }));
  };

  const handleCheckAnswer = (questionId) => {
    setHasChecked((prev) => ({ ...prev, [questionId]: true }));

    if (autoSwitch && currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 1000);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex((prev) => prev - 1);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1)
      setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handleClearAnswer = (questionId) => {
    setHasChecked((prev) => {
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
      <div className="toeic-p5-lesson">
        <div className="toeic-p5-lesson__empty">
          Chưa có câu hỏi nào trong bài học này.
        </div>
      </div>
    );
  }

  return (
    <div className="toeic-p5-lesson">
      <div className="toeic-p5-lesson__header">
        <h2 className="toeic-p5-lesson__title">{lesson.title}</h2>
        {lesson.description && (
          <p className="toeic-p5-lesson__description">{lesson.description}</p>
        )}
      </div>

      {currentQuestion && (
        <div className="toeic-p5-lesson__question">
          <div className="toeic-p5-lesson__question-text">
            {currentQuestion.questionText}
          </div>

          <div className="toeic-p5-lesson__options-col">
            <div className="toeic-p5-lesson__options">
              {CHOICE_LETTERS.map((letter) => {
                const isSelected =
                  selectedChoices[currentQuestion.question_id] === letter;
                const isCorrect =
                  hasChecked[currentQuestion.question_id] &&
                  currentQuestion.correctAnswer === letter;
                const isWrong =
                  hasChecked[currentQuestion.question_id] &&
                  selectedChoices[currentQuestion.question_id] === letter &&
                  selectedChoices[currentQuestion.question_id] !==
                    currentQuestion.correctAnswer;

                const option =
                  (currentQuestion.options || []).find(
                    (opt) => opt.label === letter
                  ) || {};

                return (
                  <label
                    key={letter}
                    className={`toeic-p5-lesson__option ${
                      isCorrect ? "toeic-p5-lesson__option--correct" : ""
                    } ${isWrong ? "toeic-p5-lesson__option--wrong" : ""}`}
                  >
                    <input
                      type="radio"
                      name={`toeic-p5-q-${currentQuestion.question_id}`}
                      checked={isSelected}
                      onChange={() =>
                        handleSelectChoice(currentQuestion.question_id, letter)
                      }
                      disabled={hasChecked[currentQuestion.question_id]}
                    />
                    <span className="toeic-p5-lesson__option-label">
                      {letter}.
                    </span>
                    <span className="toeic-p5-lesson__option-text">
                      {option.text || ""}
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="toeic-p5-lesson__buttons">
              <button
                type="button"
                className="toeic-p5-lesson__btn toeic-p5-lesson__btn--primary"
                onClick={() => handleCheckAnswer(currentQuestion.question_id)}
                disabled={hasChecked[currentQuestion.question_id]}
              >
                Kiểm tra đáp án
              </button>
              <button
                type="button"
                className="toeic-p5-lesson__btn"
                onClick={() => handleClearAnswer(currentQuestion.question_id)}
              >
                Xóa hết
              </button>
            </div>

            {hasChecked[currentQuestion.question_id] && (
              <div className="toeic-p5-lesson__explanation">
                {currentQuestion.translation && (
                  <div className="toeic-p5-lesson__section">
                    <div className="toeic-p5-lesson__section-header">
                      Dịch nghĩa
                    </div>
                    <div className="toeic-p5-lesson__section-body">
                      {currentQuestion.translation}
                    </div>
                  </div>
                )}
                {currentQuestion.analysis && (
                  <div className="toeic-p5-lesson__section">
                    <div className="toeic-p5-lesson__section-header">
                      Phân tích
                    </div>
                    <div className="toeic-p5-lesson__section-body">
                      {currentQuestion.analysis}
                    </div>
                  </div>
                )}
                {currentQuestion.explanation && (
                  <div className="toeic-p5-lesson__section">
                    <div className="toeic-p5-lesson__section-header">
                      Giải thích
                    </div>
                    <div className="toeic-p5-lesson__section-body">
                      {currentQuestion.explanation}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {questions.length > 1 && (
        <div className="toeic-p5-lesson__nav-wrapper">
          <div className="toeic-p5-lesson__nav-controls">
            <div className="toeic-p5-lesson__nav-controls-left">
              <button
                className="toeic-p5-lesson__nav-btn"
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
              >
                ← Câu trước
              </button>
            </div>
            <div className="toeic-p5-lesson__nav-controls-right">
              <label className="toeic-p5-lesson__auto-switch">
                <input
                  type="checkbox"
                  checked={autoSwitch}
                  onChange={(e) => setAutoSwitch(e.target.checked)}
                />
                Tự động chuyển câu
              </label>
              <button
                className="toeic-p5-lesson__nav-btn"
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                Câu sau →
              </button>
            </div>
          </div>
          <div className="toeic-p5-lesson__nav-grid">
            {questions.map((q, idx) => (
              <button
                key={q.question_id}
                className={`toeic-p5-lesson__nav-grid-btn ${
                  idx === currentQuestionIndex
                    ? "toeic-p5-lesson__nav-grid-btn--active"
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



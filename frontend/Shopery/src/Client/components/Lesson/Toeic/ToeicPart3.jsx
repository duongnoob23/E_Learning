// ToeicPart3.jsx - Component hiển thị lesson TOEIC Part 3 cho học viên
// - Audio hội thoại + câu hỏi text + 4 đáp án text
// - Transcript (EN) + Dịch nghĩa (VI) luôn hiển thị (có thể thu gọn)
// - Giải thích đáp án: dịch 4 đáp án + note (sau khi bấm Kiểm tra đáp án)

import { useEffect, useState } from "react";
import "./ToeicPart3.css";

const CHOICE_LETTERS = ["A", "B", "C", "D"];

export default function ToeicPart3({ lesson }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState({});
  const [hasChecked, setHasChecked] = useState({});
  const [showTranscript, setShowTranscript] = useState({});
  const [showTranslation, setShowTranslation] = useState({});
  const [showExplanation, setShowExplanation] = useState({});
  const [autoSwitch, setAutoSwitch] = useState(false);

  // Parse lesson_data (string hoặc object)
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
    setShowTranscript({});
    setShowTranslation({});
    setShowExplanation({});
  }, [lesson?.lesson_id]);

  const handleSelectChoice = (questionId, choice) => {
    setSelectedChoices((prev) => ({ ...prev, [questionId]: choice }));
  };

  const handleCheckAnswer = (questionId) => {
    setHasChecked((prev) => ({ ...prev, [questionId]: true }));
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
      <div className="toeic-p3-lesson">
        <div className="toeic-p3-lesson__empty">
          Chưa có câu hỏi nào trong bài học này.
        </div>
      </div>
    );
  }

  return (
    <div className="toeic-p3-lesson">
      <div className="toeic-p3-lesson__header">
        <h2 className="toeic-p3-lesson__title">{lesson.title}</h2>
        {lesson.description && (
          <p className="toeic-p3-lesson__description">
            {lesson.description}
          </p>
        )}
      </div>

      {currentQuestion && (
        <div className="toeic-p3-lesson__question">
          <div className="toeic-p3-lesson__audio-row">
            {currentQuestion.audio_file ? (
              <audio controls src={currentQuestion.audio_file} />
            ) : (
              <div className="toeic-p3-lesson__audio-placeholder">
                Chưa có audio cho câu này
              </div>
            )}
          </div>

          <div className="toeic-p3-lesson__body">
            {currentQuestion.questionText && (
              <div className="toeic-p3-lesson__question-text">
                {currentQuestion.questionText}
              </div>
            )}

            {currentQuestion.image_file && (
              <div className="toeic-p3-lesson__image">
                <img src={currentQuestion.image_file} alt="Illustration" />
              </div>
            )}

            <div className="toeic-p3-lesson__options-col">
              <div className="toeic-p3-lesson__options">
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
                      className={`toeic-p3-lesson__option ${
                        isCorrect ? "toeic-p3-lesson__option--correct" : ""
                      } ${isWrong ? "toeic-p3-lesson__option--wrong" : ""}`}
                    >
                      <input
                        type="radio"
                        name={`toeic-p3-q-${currentQuestion.question_id}`}
                        checked={isSelected}
                        onChange={() =>
                          handleSelectChoice(
                            currentQuestion.question_id,
                            letter
                          )
                        }
                        disabled={hasChecked[currentQuestion.question_id]}
                      />
                      <span className="toeic-p3-lesson__option-label">
                        {letter}.
                      </span>
                      <span className="toeic-p3-lesson__option-text">
                        {option.text || ""}
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="toeic-p3-lesson__buttons">
                <button
                  type="button"
                  className="toeic-p3-lesson__btn toeic-p3-lesson__btn--primary"
                  onClick={() => handleCheckAnswer(currentQuestion.question_id)}
                  disabled={hasChecked[currentQuestion.question_id]}
                >
                  Kiểm tra đáp án
                </button>
                <button
                  type="button"
                  className="toeic-p3-lesson__btn"
                  onClick={() => handleClearAnswer(currentQuestion.question_id)}
                >
                  Xóa hết
                </button>
              </div>

              {/* Transcript & Translation luôn hiển thị (có thể thu gọn) */}
              <div className="toeic-p3-lesson__footer">
                <div className="toeic-p3-lesson__section">
                  <button
                    type="button"
                    className="toeic-p3-lesson__section-toggle"
                    onClick={() =>
                      setShowTranscript((prev) => ({
                        ...prev,
                        [currentQuestion.question_id]:
                          !prev[currentQuestion.question_id],
                      }))
                    }
                  >
                    Transcript (EN){" "}
                    {showTranscript[currentQuestion.question_id] ? "▲" : "▼"}
                  </button>
                  {showTranscript[currentQuestion.question_id] && (
                    <div className="toeic-p3-lesson__section-body">
                      {currentQuestion.transcript || (
                        <span style={{ color: "#9ca3af" }}>
                          Chưa có transcript
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="toeic-p3-lesson__section">
                  <button
                    type="button"
                    className="toeic-p3-lesson__section-toggle"
                    onClick={() =>
                      setShowTranslation((prev) => ({
                        ...prev,
                        [currentQuestion.question_id]:
                          !prev[currentQuestion.question_id],
                      }))
                    }
                  >
                    Dịch nghĩa (VI){" "}
                    {showTranslation[currentQuestion.question_id] ? "▲" : "▼"}
                  </button>
                  {showTranslation[currentQuestion.question_id] && (
                    <div className="toeic-p3-lesson__section-body">
                      {currentQuestion.translation || (
                        <span style={{ color: "#9ca3af" }}>
                          Chưa có dịch nghĩa
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Giải thích đáp án - chỉ sau khi check */}
              {hasChecked[currentQuestion.question_id] && (
                <div className="toeic-p3-lesson__explanation">
                  <button
                    type="button"
                    className="toeic-p3-lesson__section-toggle"
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
                  {showExplanation[currentQuestion.question_id] && (
                    <div className="toeic-p3-lesson__section-body">
                      <p>
                        Đáp án đúng:{" "}
                        <strong>{currentQuestion.correctAnswer}</strong>
                      </p>
                      <p>
                        <strong>Dịch nghĩa từng đáp án:</strong>
                      </p>
                      {CHOICE_LETTERS.map((letter) => (
                        <p key={letter}>
                          <strong>({letter})</strong>{" "}
                          {currentQuestion.explanation?.[letter] || ""}
                        </p>
                      ))}
                      {currentQuestion.explanation?.note && (
                        <>
                          <br />
                          <p>{currentQuestion.explanation.note}</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Question navigation với grid */}
      {questions.length > 1 && (
        <div className="toeic-p3-lesson__nav-wrapper">
          <div className="toeic-p3-lesson__nav-controls">
            <div className="toeic-p3-lesson__nav-controls-left">
              <button
                className="toeic-p3-lesson__nav-btn"
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
              >
                ← Câu trước
              </button>
            </div>
            <div className="toeic-p3-lesson__nav-controls-right">
              <label className="toeic-p3-lesson__auto-switch">
                <input
                  type="checkbox"
                  checked={autoSwitch}
                  onChange={(e) => setAutoSwitch(e.target.checked)}
                />
                Tự động chuyển câu
              </label>
              <button
                className="toeic-p3-lesson__nav-btn"
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                Câu sau →
              </button>
            </div>
          </div>
          <div className="toeic-p3-lesson__nav-grid">
            {questions.map((q, idx) => (
              <button
                key={q.question_id}
                className={`toeic-p3-lesson__nav-grid-btn ${
                  idx === currentQuestionIndex
                    ? "toeic-p3-lesson__nav-grid-btn--active"
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



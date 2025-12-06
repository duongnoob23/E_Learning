// VocabularyTranslation.jsx - Dịch nghĩa (nhập text)
// Hỗ trợ: nhiều câu hỏi, từ tiếng Việt + hình ảnh, input box, sai->shake+hiển thị đáp án, đúng->border xanh+auto next
import React, { useCallback, useEffect, useState } from "react";
import "./VocabularyTranslation.css";

export default function VocabularyTranslation({ lesson }) {
  const lessonData = lesson?.lesson_data || {};

  // Hỗ trợ nhiều câu hỏi hoặc 1 câu hỏi
  const questions =
    lessonData.questions ||
    (lessonData.vi_text
      ? [
          {
            vi_text: lessonData.vi_text,
            image_url: lessonData.image_url,
            correct_answer: lessonData.correct_answer,
          },
        ]
      : []);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [autoSwitch, setAutoSwitch] = useState(true); // Tự động chuyển câu
  const [answers, setAnswers] = useState({}); // { questionIndex: answer }
  const [isCorrect, setIsCorrect] = useState({}); // { questionIndex: boolean }
  const [showAnswer, setShowAnswer] = useState({}); // { questionIndex: boolean } - hiển thị đáp án khi sai
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set()); // Set of question indices

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex] || "";
  const currentIsCorrect = isCorrect[currentQuestionIndex] || false;
  const currentShowAnswer = showAnswer[currentQuestionIndex] || false;

  // Reset input khi chuyển câu
  useEffect(() => {
    setAnswers((prev) => {
      if (!prev[currentQuestionIndex]) {
        return { ...prev, [currentQuestionIndex]: "" };
      }
      return prev;
    });
    // Reset trạng thái khi chuyển câu
    setIsCorrect((prev) => {
      const newState = { ...prev };
      delete newState[currentQuestionIndex];
      return newState;
    });
    setShowAnswer((prev) => {
      const newState = { ...prev };
      delete newState[currentQuestionIndex];
      return newState;
    });
  }, [currentQuestionIndex]);

  // Xử lý nhập text - đơn giản hóa để tránh giật
  const handleAnswerChange = (e) => {
    const value = e.target.value;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: value,
    }));
    // Reset trạng thái khi người dùng nhập lại
    if (currentIsCorrect || currentShowAnswer) {
      setIsCorrect((prev) => ({
        ...prev,
        [currentQuestionIndex]: false,
      }));
      setShowAnswer((prev) => ({
        ...prev,
        [currentQuestionIndex]: false,
      }));
    }
  };

  // Xử lý submit
  const handleSubmit = useCallback(() => {
    if (!currentAnswer.trim()) return;

    // Nếu đã trả lời đúng câu này rồi thì không cho submit nữa
    if (answeredQuestions.has(currentQuestionIndex)) {
      return;
    }

    const normalizedAnswer = currentAnswer.trim().toLowerCase();
    const normalizedCorrect = (
      currentQuestion?.correct_answer || ""
    ).toLowerCase();

    const correct = normalizedAnswer === normalizedCorrect;

    setIsCorrect((prev) => ({
      ...prev,
      [currentQuestionIndex]: correct,
    }));

    if (correct) {
      // Đáp án đúng: border xanh + tự động chuyển câu (nếu auto switch bật)
      setAnsweredQuestions((prev) => new Set([...prev, currentQuestionIndex]));

      // Tự động chuyển câu sau 1 giây
      if (autoSwitch && currentQuestionIndex < questions.length - 1) {
        setTimeout(() => {
          setCurrentQuestionIndex((prev) => prev + 1);
        }, 1000);
      }
    } else {
      // Đáp án sai: shake + hiển thị đáp án
      setShowAnswer((prev) => ({
        ...prev,
        [currentQuestionIndex]: true,
      }));

      // Vibrate (nếu browser hỗ trợ)
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }

      // Thêm class shake animation
      const inputElement = document.querySelector(
        `.vocabulary-translation-input[data-question-index="${currentQuestionIndex}"]`
      );
      if (inputElement) {
        inputElement.classList.add("vocabulary-translation-input--shake");
        setTimeout(() => {
          inputElement.classList.remove("vocabulary-translation-input--shake");
        }, 500);
      }
    }
  }, [
    currentAnswer,
    currentQuestion,
    currentQuestionIndex,
    autoSwitch,
    questions.length,
    answeredQuestions,
  ]);

  // Chuyển câu trước
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Chuyển câu sau
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  // Chuyển đến câu cụ thể
  const handleJumpToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  if (!currentQuestion) {
    return (
      <div className="vocabulary-translation-container">Không có câu hỏi</div>
    );
  }

  const isAnswered = answeredQuestions.has(currentQuestionIndex);
  const inputClass = `vocabulary-translation-input ${
    currentIsCorrect ? "vocabulary-translation-input--correct" : ""
  } ${currentShowAnswer ? "vocabulary-translation-input--wrong" : ""}`;

  return (
    <div className="vocabulary-translation-container">
      {/* Câu hỏi */}
      <div className="vocabulary-translation-question">
        {/* Hình ảnh */}
        {currentQuestion.image_url && (
          <div className="vocabulary-translation-image">
            <img
              src={currentQuestion.image_url}
              alt="Question"
              className="vocabulary-translation-question-image"
            />
          </div>
        )}

        {/* Từ tiếng Việt */}
        {currentQuestion.vi_text && (
          <h2 className="vocabulary-translation-vi">
            {currentQuestion.vi_text}
          </h2>
        )}

        <p className="vocabulary-translation-hint">Nhập từ tiếng Anh:</p>
      </div>

      {/* Input box */}
      <div className="vocabulary-translation-input-group">
        <input
          type="text"
          data-question-index={currentQuestionIndex}
          value={currentAnswer}
          onChange={handleAnswerChange}
          onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Nhập từ tiếng Anh..."
          disabled={isAnswered}
          className={inputClass}
          autoComplete="off"
        />
        <button
          onClick={handleSubmit}
          disabled={isAnswered || !currentAnswer.trim()}
          className="vocabulary-translation-submit"
        >
          Kiểm tra
        </button>
      </div>

      {/* Hiển thị đáp án khi sai */}
      {currentShowAnswer && !currentIsCorrect && (
        <div className="vocabulary-translation-answer-display">
          <i className="fa fa-times-circle"></i>
          <p>
            Đáp án đúng: <strong>{currentQuestion.correct_answer}</strong>
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="vocabulary-translation-navigation">
        <button
          className="vocabulary-translation-nav-btn"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          ← Câu trước
        </button>

        <label className="vocabulary-translation-auto-switch">
          <input
            type="checkbox"
            checked={autoSwitch}
            onChange={(e) => setAutoSwitch(e.target.checked)}
          />
          <span>Tự động chuyển câu</span>
        </label>

        <button
          className="vocabulary-translation-nav-btn"
          onClick={handleNext}
          disabled={currentQuestionIndex === questions.length - 1}
        >
          Câu sau →
        </button>
      </div>

      {/* Danh sách số câu hỏi */}
      {questions.length > 1 && (
        <div className="vocabulary-translation-question-list">
          <span className="vocabulary-translation-question-list-label">
            Danh sách bài tập:
          </span>
          <div className="vocabulary-translation-question-numbers">
            {questions.map((_, index) => {
              const isAnswered = answeredQuestions.has(index);
              const isCurrent = index === currentQuestionIndex;
              return (
                <button
                  key={index}
                  className={`vocabulary-translation-question-number ${
                    isCurrent
                      ? "vocabulary-translation-question-number--active"
                      : ""
                  } ${
                    isAnswered
                      ? "vocabulary-translation-question-number--answered"
                      : ""
                  }`}
                  onClick={() => handleJumpToQuestion(index)}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

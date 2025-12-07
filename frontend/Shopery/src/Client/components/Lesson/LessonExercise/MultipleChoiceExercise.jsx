import { useState } from "react";
import "./LessonExercise.css";

export default function MultipleChoiceExercise({ exerciseData, passScore, maxScore }) {
  const questions = exerciseData?.questions || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = questions[currentIndex];
  const selectedAnswer = selectedAnswers[currentIndex];

  const handleSelectAnswer = (answer) => {
    if (submitted) return;
    setSelectedAnswers({ ...selectedAnswers, [currentIndex]: answer });
  };

  const handleSubmit = () => {
    setShowResult(true);
    setSubmitted(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowResult(false);
      setSubmitted(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowResult(false);
      setSubmitted(false);
    }
  };

  const isCorrect = (questionIndex) => {
    const question = questions[questionIndex];
    const selected = selectedAnswers[questionIndex];
    return selected === question.answer;
  };

  const correctCount = questions.filter((q, idx) => isCorrect(idx)).length;
  const score = Math.round((correctCount / questions.length) * 100);
  const passed = passScore ? score >= passScore : true;

  if (!currentQuestion) {
    return <div className="exercise-empty">Chưa có câu hỏi nào.</div>;
  }

  return (
    <div className="exercise-multiple-choice">
      <div className="exercise-progress">
        Câu {currentIndex + 1} / {questions.length} | 
        Điểm: {correctCount} / {questions.length} ({score}%)
        {passScore && ` | Đạt: ${passScore}%`}
      </div>

      <div className="question-container">
        <div className="question-text">
          <h4>{currentQuestion.question}</h4>
        </div>

        <div className="options-list">
          {currentQuestion.options?.map((option, idx) => (
            <button
              key={idx}
              className={`option-btn ${
                selectedAnswer === option ? "selected" : ""
              } ${
                showResult
                  ? option === currentQuestion.answer
                    ? "correct"
                    : selectedAnswer === option && option !== currentQuestion.answer
                    ? "incorrect"
                    : ""
                  : ""
              }`}
              onClick={() => handleSelectAnswer(option)}
              disabled={submitted}
            >
              {option}
            </button>
          ))}
        </div>

        {!submitted && selectedAnswer && (
          <button onClick={handleSubmit} className="submit-btn">
            Xác nhận
          </button>
        )}

        {showResult && (
          <div className={`result ${isCorrect(currentIndex) ? "correct" : "incorrect"}`}>
            {isCorrect(currentIndex) ? (
              <div className="result-message">
                ✅ Đúng! {currentQuestion.explanation && (
                  <span className="explanation">{currentQuestion.explanation}</span>
                )}
              </div>
            ) : (
              <div className="result-message">
                ❌ Sai. Đáp án đúng: "{currentQuestion.answer}"
                {currentQuestion.explanation && (
                  <div className="explanation">💡 {currentQuestion.explanation}</div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="exercise-navigation">
          <button onClick={handlePrev} disabled={currentIndex === 0}>
            ← Trước
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
          >
            Sau →
          </button>
        </div>
      </div>

      {submitted && currentIndex === questions.length - 1 && (
        <div className={`exercise-summary ${passed ? "passed" : "failed"}`}>
          <h4>Kết quả</h4>
          <p>
            Bạn đã trả lời đúng {correctCount} / {questions.length} câu ({score}%)
          </p>
          {passScore && (
            <p className={passed ? "passed-text" : "failed-text"}>
              {passed ? "✅ Đạt yêu cầu!" : `❌ Chưa đạt yêu cầu (cần ${passScore}%)`}
            </p>
          )}
        </div>
      )}
    </div>
  );
}


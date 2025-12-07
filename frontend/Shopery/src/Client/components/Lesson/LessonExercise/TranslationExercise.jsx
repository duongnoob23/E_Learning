import { useState } from "react";
import "./LessonExercise.css";

export default function TranslationExercise({ exerciseData }) {
  const questions = exerciseData?.questions || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = questions[currentIndex];
  const userAnswer = userAnswers[currentIndex] || "";

  const handleSubmit = () => {
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowResult(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowResult(false);
    }
  };

  const isCorrect = (answer) => {
    if (!currentQuestion) return false;
    return answer.trim().toLowerCase() === currentQuestion.correct_answer.trim().toLowerCase();
  };

  const correctCount = questions.filter((q, idx) => 
    isCorrect(userAnswers[idx] || "")
  ).length;

  if (!currentQuestion) {
    return <div className="exercise-empty">Chưa có câu hỏi nào.</div>;
  }

  return (
    <div className="exercise-translation">
      <div className="exercise-progress">
        Câu {currentIndex + 1} / {questions.length} | 
        Đúng: {correctCount} / {questions.length}
      </div>

      <div className="question-container">
        <div className="question-word">
          <h4>Dịch từ sau sang tiếng Việt:</h4>
          <div className="word-to-translate">{currentQuestion.word}</div>
        </div>

        <div className="answer-input">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) =>
              setUserAnswers({ ...userAnswers, [currentIndex]: e.target.value })
            }
            placeholder="Nhập nghĩa tiếng Việt..."
            disabled={showResult}
          />
          {!showResult && (
            <button onClick={handleSubmit} className="submit-btn">
              Kiểm tra
            </button>
          )}
        </div>

        {showResult && (
          <div className={`result ${isCorrect(userAnswer) ? "correct" : "incorrect"}`}>
            {isCorrect(userAnswer) ? (
              <div className="result-message">
                ✅ Đúng! "{currentQuestion.correct_answer}"
              </div>
            ) : (
              <div className="result-message">
                ❌ Sai. Đáp án đúng: "{currentQuestion.correct_answer}"
              </div>
            )}
            {currentQuestion.hint && (
              <div className="hint">💡 Gợi ý: {currentQuestion.hint}</div>
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
    </div>
  );
}


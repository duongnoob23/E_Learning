// VocabularyQuiz.jsx - Trắc nghiệm từ vựng
// Hỗ trợ: câu hỏi (en/vi/image/audio), đáp án (text/image+text), click sai->đỏ+vibrate, đúng->xanh+auto next
import { useCallback, useEffect, useState } from "react";
import "./VocabularyQuiz.css";

export default function VocabularyQuiz({ lesson }) {
  const lessonData = lesson?.lesson_data || {};

  // Hỗ trợ nhiều câu hỏi hoặc 1 câu hỏi
  const questions =
    lessonData.questions || (lessonData.question ? [lessonData.question] : []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [autoSwitch, setAutoSwitch] = useState(true); // Tự động chuyển câu
  const [selectedChoices, setSelectedChoices] = useState({}); // { questionIndex: choiceId }
  const [wrongChoices, setWrongChoices] = useState({}); // { questionIndex: [choiceIds] }
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set()); // Set of question indices

  const currentQuestion = questions[currentQuestionIndex];
  const currentChoices = currentQuestion?.choices || [];
  const [shuffledChoices, setShuffledChoices] = useState([]);

  // Shuffle choices khi chuyển câu hỏi
  useEffect(() => {
    if (currentChoices.length > 0) {
      if (lessonData.shuffle_choices) {
        const shuffled = [...currentChoices].sort(() => Math.random() - 0.5);
        setShuffledChoices(shuffled);
      } else {
        setShuffledChoices(currentChoices);
      }
    }
  }, [currentQuestionIndex, currentChoices, lessonData.shuffle_choices]);

  // Xử lý click vào đáp án
  const handleChoiceClick = useCallback(
    (choiceId) => {
      // Nếu đã trả lời đúng câu này rồi thì không cho click nữa
      if (answeredQuestions.has(currentQuestionIndex)) {
        return;
      }

      const choice = shuffledChoices.find((c) => c.id === choiceId);
      if (!choice) return;

      const isCorrect = choice.is_correct;

      if (isCorrect) {
        // Đáp án đúng: xanh + tự động chuyển câu (nếu auto switch bật)
        setSelectedChoices((prev) => ({
          ...prev,
          [currentQuestionIndex]: choiceId,
        }));
        setAnsweredQuestions(
          (prev) => new Set([...prev, currentQuestionIndex])
        );

        // Tự động chuyển câu sau 1 giây
        if (autoSwitch && currentQuestionIndex < questions.length - 1) {
          setTimeout(() => {
            setCurrentQuestionIndex((prev) => prev + 1);
          }, 1000);
        }
      } else {
        // Đáp án sai: đỏ + vibrate + thêm vào danh sách sai
        setWrongChoices((prev) => ({
          ...prev,
          [currentQuestionIndex]: [
            ...(prev[currentQuestionIndex] || []),
            choiceId,
          ],
        }));

        // Vibrate (nếu browser hỗ trợ)
        if (navigator.vibrate) {
          navigator.vibrate(200);
        }

        // Thêm class shake animation
        const choiceElement = document.querySelector(
          `[data-choice-id="${choiceId}"]`
        );
        if (choiceElement) {
          choiceElement.classList.add("vocabulary-quiz-choice--shake");
          setTimeout(() => {
            choiceElement.classList.remove("vocabulary-quiz-choice--shake");
          }, 500);
        }
      }
    },
    [
      currentQuestionIndex,
      shuffledChoices,
      autoSwitch,
      questions.length,
      answeredQuestions,
    ]
  );

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
    return <div className="vocabulary-quiz-container">Không có câu hỏi</div>;
  }

  const selectedChoiceId = selectedChoices[currentQuestionIndex];
  const wrongChoiceIds = wrongChoices[currentQuestionIndex] || [];
  const isAnswered = answeredQuestions.has(currentQuestionIndex);

  // Render câu hỏi
  const renderQuestion = () => {
    // Câu hỏi có thể là: en, vi, question_text, image, audio
    // Hỗ trợ nhiều format: en, question_text, vi, vi_text
    const questionText = currentQuestion.en || 
                        currentQuestion.question_text || 
                        currentQuestion.text || 
                        "";
    const questionViText = currentQuestion.vi || 
                          currentQuestion.vi_text || 
                          "";
    
    return (
      <div className="vocabulary-quiz-question">
        {/* Image */}
        {(currentQuestion.image_url || currentQuestion.question_image_url) && (
          <img
            src={currentQuestion.image_url || currentQuestion.question_image_url}
            alt="Question"
            className="vocabulary-quiz-question-image"
          />
        )}

        {/* English word / Question text */}
        {questionText && (
          <h3 className="vocabulary-quiz-question-text">
            {questionText}
          </h3>
        )}

        {/* Vietnamese word */}
        {questionViText && (
          <h2 className="vocabulary-quiz-question-text">
            {questionViText}
          </h2>
        )}

        {/* Audio */}
        {(currentQuestion.audio_url || currentQuestion.question_audio_url) && (
          <audio controls className="vocabulary-quiz-audio">
            <source src={currentQuestion.audio_url || currentQuestion.question_audio_url} type="audio/mpeg" />
            <source src={currentQuestion.audio_url || currentQuestion.question_audio_url} type="audio/wav" />
            Trình duyệt không hỗ trợ audio.
          </audio>
        )}
      </div>
    );
  };

  // Render đáp án
  const renderChoice = (choice, index) => {
    console.log("JSON", JSON.stringify(choice, null, 2));
    const isSelected = selectedChoiceId === choice.id;
    const isWrong = wrongChoiceIds.includes(choice.id);
    const isCorrect = choice.is_correct && isSelected;

    let choiceClass = "vocabulary-quiz-choice";
    if (isCorrect) {
      choiceClass += " vocabulary-quiz-choice--correct";
    } else if (isWrong) {
      choiceClass += " vocabulary-quiz-choice--wrong";
    } else if (isSelected) {
      choiceClass += " vocabulary-quiz-choice--selected";
    }

    // Disable nếu đã trả lời đúng hoặc đã click sai
    const isDisabled = isAnswered || isWrong;

    return (
      <button
        key={choice.id || index}
        data-choice-id={choice.id}
        className={choiceClass}
        onClick={() => handleChoiceClick(choice.id)}
        disabled={isDisabled}
      >
        {/* Đáp án có thể là: image + text, hoặc chỉ text */}
        {choice.image_url && (
          <img
            src={choice.image_url}
            alt={choice.vi || choice.en}
            className="vocabulary-quiz-choice-image"
          />
        )}

        <div style={{ flexDirection: "row" }}>
          <span className="vocabulary-quiz-choice-letter">
            {String.fromCharCode(65 + index)}.
          </span>
          <span className="vocabulary-quiz-choice-text">
            {choice.text || choice.vi || choice.vi_text || choice.en || choice.en_text || ""}
          </span>
        </div>
        {/* Icon check/x */}
        {isCorrect && (
          <i className="fa fa-check vocabulary-quiz-choice-icon vocabulary-quiz-choice-icon--correct"></i>
        )}
        {isWrong && (
          <i className="fa fa-times vocabulary-quiz-choice-icon vocabulary-quiz-choice-icon--wrong"></i>
        )}
      </button>
    );
  };

  return (
    <div className="vocabulary-quiz-container">
      {/* Câu hỏi */}
      {renderQuestion()}

      {/* Đáp án */}
      <div className="vocabulary-quiz-choices">
        {shuffledChoices.map((choice, index) => renderChoice(choice, index))}
      </div>

      {/* Navigation */}
      <div className="vocabulary-quiz-navigation">
        <button
          className="vocabulary-quiz-nav-btn"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          ← Câu trước
        </button>

        <label className="vocabulary-quiz-auto-switch">
          <input
            type="checkbox"
            checked={autoSwitch}
            onChange={(e) => setAutoSwitch(e.target.checked)}
          />
          <span>Tự động chuyển câu</span>
        </label>

        <button
          className="vocabulary-quiz-nav-btn"
          onClick={handleNext}
          disabled={currentQuestionIndex === questions.length - 1}
        >
          Câu sau →
        </button>
      </div>

      {/* Danh sách số câu hỏi */}
      {questions.length > 1 && (
        <div className="vocabulary-quiz-question-list">
          <span className="vocabulary-quiz-question-list-label">
            Danh sách bài tập:
          </span>
          <div className="vocabulary-quiz-question-numbers">
            {questions.map((_, index) => {
              const isAnswered = answeredQuestions.has(index);
              const isCurrent = index === currentQuestionIndex;
              return (
                <button
                  key={index}
                  className={`vocabulary-quiz-question-number ${
                    isCurrent ? "vocabulary-quiz-question-number--active" : ""
                  } ${
                    isAnswered
                      ? "vocabulary-quiz-question-number--answered"
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

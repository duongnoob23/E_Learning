import React, { useState, useEffect } from "react";
import "./ListeningReadingQuestionEditor.scss";

/**
 * Component tạo Questions cho Listening & Reading
 * Tái sử dụng logic từ course editor nhưng format dữ liệu cho exam
 */
export default function ListeningReadingQuestionEditor({
  questions = [],
  onChange,
}) {
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Load questions
  useEffect(() => {
    if (questions.length > 0) {
      setCurrentQuestions(questions);
    } else {
      // Tạo question mẫu đầu tiên
      setCurrentQuestions([createEmptyQuestion()]);
    }
  }, []);

  // Push changes lên parent
  useEffect(() => {
    if (currentQuestions.length > 0) {
      onChange(currentQuestions);
    }
  }, [currentQuestions]);

  // Tạo question rỗng
  function createEmptyQuestion() {
    return {
      id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      question_number: 1,
      question_text: "",
      question_type: "MULTIPLE_CHOICE",
      audio_file: "",
      image_file: "",
      transcript: "",
      explanation: "",
      choices: [
        { choice_letter: "A", choice_text: "", is_correct: false },
        { choice_letter: "B", choice_text: "", is_correct: false },
        { choice_letter: "C", choice_text: "", is_correct: false },
        { choice_letter: "D", choice_text: "", is_correct: false },
      ],
    };
  }

  // Thêm question mới
  const handleAddQuestion = () => {
    const newQuestion = createEmptyQuestion();
    newQuestion.question_number = currentQuestions.length + 1;
    setCurrentQuestions([...currentQuestions, newQuestion]);
    setCurrentIndex(currentQuestions.length);
  };

  // Xóa question
  const handleDeleteQuestion = (index) => {
    if (currentQuestions.length <= 1) {
      alert("Phải có ít nhất 1 câu hỏi");
      return;
    }
    const newQuestions = currentQuestions.filter((_, idx) => idx !== index);
    // Cập nhật số thứ tự
    newQuestions.forEach((q, idx) => {
      q.question_number = idx + 1;
    });
    setCurrentQuestions(newQuestions);
    if (currentIndex >= newQuestions.length) {
      setCurrentIndex(newQuestions.length - 1);
    }
  };

  // Cập nhật question hiện tại
  const updateCurrentQuestion = (field, value) => {
    const newQuestions = [...currentQuestions];
    newQuestions[currentIndex] = {
      ...newQuestions[currentIndex],
      [field]: value,
    };
    setCurrentQuestions(newQuestions);
  };

  // Cập nhật choice
  const updateChoice = (choiceIndex, field, value) => {
    const newQuestions = [...currentQuestions];
    const newChoices = [...newQuestions[currentIndex].choices];
    newChoices[choiceIndex] = {
      ...newChoices[choiceIndex],
      [field]: value,
    };
    newQuestions[currentIndex] = {
      ...newQuestions[currentIndex],
      choices: newChoices,
    };
    setCurrentQuestions(newQuestions);
  };

  const currentQuestion = currentQuestions[currentIndex] || createEmptyQuestion();

  return (
    <div className="listening-reading-question-editor">
      {/* Navigation */}
      <div className="listening-reading-question-editor__nav">
        <button
          className="listening-reading-question-editor__nav-btn"
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
        >
          ← Câu trước
        </button>
        <span className="listening-reading-question-editor__nav-info">
          Câu {currentIndex + 1} / {currentQuestions.length}
        </span>
        <button
          className="listening-reading-question-editor__nav-btn"
          onClick={() =>
            setCurrentIndex(
              Math.min(currentQuestions.length - 1, currentIndex + 1)
            )
          }
          disabled={currentIndex === currentQuestions.length - 1}
        >
          Câu sau →
        </button>
      </div>

      {/* Question Form */}
      <div className="listening-reading-question-editor__form">
        {/* Question Number */}
        <div className="listening-reading-question-editor__field">
          <label>Số thứ tự câu hỏi</label>
          <input
            type="number"
            value={currentQuestion.question_number}
            onChange={(e) =>
              updateCurrentQuestion(
                "question_number",
                parseInt(e.target.value) || 1
              )
            }
            min="1"
          />
        </div>

        {/* Question Text */}
        <div className="listening-reading-question-editor__field">
          <label>Nội dung câu hỏi</label>
          <textarea
            value={currentQuestion.question_text}
            onChange={(e) =>
              updateCurrentQuestion("question_text", e.target.value)
            }
            rows={3}
            placeholder="Nhập nội dung câu hỏi..."
          />
        </div>

        {/* Audio File */}
        <div className="listening-reading-question-editor__field">
          <label>File âm thanh (URL hoặc upload)</label>
          <input
            type="text"
            value={currentQuestion.audio_file}
            onChange={(e) =>
              updateCurrentQuestion("audio_file", e.target.value)
            }
            placeholder="https://..."
          />
        </div>

        {/* Image File */}
        <div className="listening-reading-question-editor__field">
          <label>File hình ảnh (URL hoặc upload)</label>
          <input
            type="text"
            value={currentQuestion.image_file}
            onChange={(e) =>
              updateCurrentQuestion("image_file", e.target.value)
            }
            placeholder="https://..."
          />
        </div>

        {/* Choices */}
        <div className="listening-reading-question-editor__choices">
          <label>Đáp án (A, B, C, D)</label>
          {currentQuestion.choices.map((choice, idx) => (
            <div key={idx} className="listening-reading-question-editor__choice">
              <div className="listening-reading-question-editor__choice-header">
                <span className="listening-reading-question-editor__choice-letter">
                  {choice.choice_letter}
                </span>
                <label className="listening-reading-question-editor__choice-correct">
                  <input
                    type="radio"
                    name={`correct_${currentIndex}`}
                    checked={choice.is_correct}
                    onChange={() => {
                      // Chỉ cho phép 1 đáp án đúng
                      const newChoices = currentQuestion.choices.map((c, i) => ({
                        ...c,
                        is_correct: i === idx,
                      }));
                      updateCurrentQuestion("choices", newChoices);
                    }}
                  />
                  Đáp án đúng
                </label>
              </div>
              <input
                type="text"
                value={choice.choice_text}
                onChange={(e) => updateChoice(idx, "choice_text", e.target.value)}
                placeholder={`Nhập đáp án ${choice.choice_letter}...`}
              />
            </div>
          ))}
        </div>

        {/* Transcript */}
        <div className="listening-reading-question-editor__field">
          <label>Transcript (nếu có)</label>
          <textarea
            value={currentQuestion.transcript}
            onChange={(e) =>
              updateCurrentQuestion("transcript", e.target.value)
            }
            rows={3}
            placeholder="Nhập transcript..."
          />
        </div>

        {/* Explanation */}
        <div className="listening-reading-question-editor__field">
          <label>Giải thích đáp án</label>
          <textarea
            value={currentQuestion.explanation}
            onChange={(e) =>
              updateCurrentQuestion("explanation", e.target.value)
            }
            rows={4}
            placeholder="Nhập giải thích..."
          />
        </div>
      </div>

      {/* Actions */}
      <div className="listening-reading-question-editor__actions">
        <button
          className="listening-reading-question-editor__add-btn"
          onClick={handleAddQuestion}
        >
          + Thêm câu hỏi
        </button>
        {currentQuestions.length > 1 && (
          <button
            className="listening-reading-question-editor__delete-btn"
            onClick={() => handleDeleteQuestion(currentIndex)}
          >
            Xóa câu hỏi này
          </button>
        )}
      </div>
    </div>
  );
}


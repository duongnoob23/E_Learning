import React, { useState, useEffect } from "react";
import "./WritingQuestionEditor.scss";

/**
 * Component tạo Questions cho Writing
 * Không có choices, chỉ có question_text, image_file (optional), explanation
 */
export default function WritingQuestionEditor({ questions = [], onChange }) {
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (questions.length > 0) {
      setCurrentQuestions(questions);
    } else {
      setCurrentQuestions([createEmptyQuestion()]);
    }
  }, []);

  useEffect(() => {
    if (currentQuestions.length > 0) {
      onChange(currentQuestions);
    }
  }, [currentQuestions]);

  function createEmptyQuestion() {
    return {
      id: `wq_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      question_number: 1,
      question_text: "",
      question_type: "WRITING",
      image_file: "",
      explanation: "",
    };
  }

  const handleAddQuestion = () => {
    const newQuestion = createEmptyQuestion();
    newQuestion.question_number = currentQuestions.length + 1;
    setCurrentQuestions([...currentQuestions, newQuestion]);
    setCurrentIndex(currentQuestions.length);
  };

  const handleDeleteQuestion = (index) => {
    if (currentQuestions.length <= 1) {
      alert("Phải có ít nhất 1 câu hỏi");
      return;
    }
    const newQuestions = currentQuestions.filter((_, idx) => idx !== index);
    newQuestions.forEach((q, idx) => {
      q.question_number = idx + 1;
    });
    setCurrentQuestions(newQuestions);
    if (currentIndex >= newQuestions.length) {
      setCurrentIndex(newQuestions.length - 1);
    }
  };

  const updateCurrentQuestion = (field, value) => {
    const newQuestions = [...currentQuestions];
    newQuestions[currentIndex] = {
      ...newQuestions[currentIndex],
      [field]: value,
    };
    setCurrentQuestions(newQuestions);
  };

  const currentQuestion = currentQuestions[currentIndex] || createEmptyQuestion();

  return (
    <div className="writing-question-editor">
      <div className="writing-question-editor__nav">
        <button
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
        >
          ← Câu trước
        </button>
        <span>Câu {currentIndex + 1} / {currentQuestions.length}</span>
        <button
          onClick={() =>
            setCurrentIndex(Math.min(currentQuestions.length - 1, currentIndex + 1))
          }
          disabled={currentIndex === currentQuestions.length - 1}
        >
          Câu sau →
        </button>
      </div>

      <div className="writing-question-editor__form">
        <div className="writing-question-editor__field">
          <label>Số thứ tự câu hỏi</label>
          <input
            type="number"
            value={currentQuestion.question_number}
            onChange={(e) =>
              updateCurrentQuestion("question_number", parseInt(e.target.value) || 1)
            }
            min="1"
          />
        </div>

        <div className="writing-question-editor__field">
          <label>Nội dung câu hỏi *</label>
          <textarea
            value={currentQuestion.question_text}
            onChange={(e) => updateCurrentQuestion("question_text", e.target.value)}
            rows={6}
            placeholder="Nhập đề bài cho học viên..."
          />
        </div>

        <div className="writing-question-editor__field">
          <label>File hình ảnh (URL hoặc upload) - Tùy chọn</label>
          <input
            type="text"
            value={currentQuestion.image_file}
            onChange={(e) => updateCurrentQuestion("image_file", e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="writing-question-editor__field">
          <label>Hướng dẫn/Yêu cầu</label>
          <textarea
            value={currentQuestion.explanation}
            onChange={(e) => updateCurrentQuestion("explanation", e.target.value)}
            rows={4}
            placeholder="Nhập hướng dẫn và yêu cầu cho học viên (ví dụ: viết ít nhất 150 từ)..."
          />
        </div>
      </div>

      <div className="writing-question-editor__actions">
        <button onClick={handleAddQuestion}>+ Thêm câu hỏi</button>
        {currentQuestions.length > 1 && (
          <button onClick={() => handleDeleteQuestion(currentIndex)}>
            Xóa câu hỏi này
          </button>
        )}
      </div>
    </div>
  );
}


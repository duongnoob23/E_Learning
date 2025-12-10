// VocabularyTranslationCreator.jsx - Form tạo lesson vocabulary_translation
import React, { useState } from "react";
import "./CreatorForm.css";

export default function VocabularyTranslationCreator({ onDataChange }) {
  const [questions, setQuestions] = useState([
    {
      question_id: 1,
      vi_text: "",
      image_url: "",
      correct_answer: "",
    },
  ]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_id: Date.now(),
        vi_text: "",
        image_url: "",
        correct_answer: "",
      },
    ]);
  };

  const handleRemoveQuestion = (questionId) => {
    setQuestions(questions.filter((q) => q.question_id !== questionId));
  };

  const handleQuestionChange = (questionId, field, value) => {
    setQuestions(
      questions.map((q) =>
        q.question_id === questionId ? { ...q, [field]: value } : q
      )
    );
    // Gửi dữ liệu lên parent
    const updatedQuestions = questions.map((q) =>
      q.question_id === questionId ? { ...q, [field]: value } : q
    );
    onDataChange?.({
      type: "vocabulary_translation",
      questions: updatedQuestions,
    });
  };

  return (
    <div className="creator-form">
      <h4 className="creator-form-title">Tạo Lesson: Dịch nghĩa</h4>

      <div className="creator-form-group">
        <div className="creator-form-group-header">
          <label className="creator-form-label">Danh sách câu hỏi *</label>
          <button
            type="button"
            className="creator-form-add-btn"
            onClick={handleAddQuestion}
          >
            + Thêm câu hỏi
          </button>
        </div>

        {questions.map((question, index) => (
          <div key={question.question_id} className="creator-form-item-card">
            <div className="creator-form-item-header">
              <span className="creator-form-item-number">
                Câu hỏi {index + 1}
              </span>
              {questions.length > 1 && (
                <button
                  type="button"
                  className="creator-form-remove-btn"
                  onClick={() => handleRemoveQuestion(question.question_id)}
                >
                  × Xóa
                </button>
              )}
            </div>

            <div className="creator-form-grid">
              <div className="creator-form-field creator-form-field-full">
                <label>Câu tiếng Việt *</label>
                <input
                  type="text"
                  value={question.vi_text}
                  onChange={(e) =>
                    handleQuestionChange(
                      question.question_id,
                      "vi_text",
                      e.target.value
                    )
                  }
                  placeholder="vui mừng"
                />
              </div>

              <div className="creator-form-field">
                <label>URL ảnh</label>
                <input
                  type="url"
                  value={question.image_url}
                  onChange={(e) =>
                    handleQuestionChange(
                      question.question_id,
                      "image_url",
                      e.target.value
                    )
                  }
                  placeholder="https://..."
                />
              </div>

              <div className="creator-form-field">
                <label>Đáp án đúng (Tiếng Anh) *</label>
                <input
                  type="text"
                  value={question.correct_answer}
                  onChange={(e) =>
                    handleQuestionChange(
                      question.question_id,
                      "correct_answer",
                      e.target.value
                    )
                  }
                  placeholder="happy"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


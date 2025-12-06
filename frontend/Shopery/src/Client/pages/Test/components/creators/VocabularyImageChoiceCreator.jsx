// VocabularyImageChoiceCreator.jsx - Form tạo lesson vocabulary_image_choice
import React, { useState } from "react";
import "./CreatorForm.css";

export default function VocabularyImageChoiceCreator({ onDataChange }) {
  const [questions, setQuestions] = useState([
    {
      question_id: 1,
      question_type: "text",
      question_text: "",
      question_audio_url: "",
      images: [
        { image_id: 1, image_url: "", is_correct: false },
      ],
    },
  ]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_id: Date.now(),
        question_type: "text",
        question_text: "",
        question_audio_url: "",
        images: [
          { image_id: Date.now(), image_url: "", is_correct: false },
        ],
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
  };

  const handleAddImage = (questionId) => {
    setQuestions(
      questions.map((q) =>
        q.question_id === questionId
          ? {
              ...q,
              images: [
                ...q.images,
                { image_id: Date.now(), image_url: "", is_correct: false },
              ],
            }
          : q
      )
    );
  };

  const handleRemoveImage = (questionId, imageId) => {
    setQuestions(
      questions.map((q) =>
        q.question_id === questionId
          ? {
              ...q,
              images: q.images.filter((img) => img.image_id !== imageId),
            }
          : q
      )
    );
  };

  const handleImageChange = (questionId, imageId, field, value) => {
    setQuestions(
      questions.map((q) =>
        q.question_id === questionId
          ? {
              ...q,
              images: q.images.map((img) =>
                img.image_id === imageId ? { ...img, [field]: value } : img
              ),
            }
          : q
      )
    );
  };

  React.useEffect(() => {
    onDataChange?.({
      type: "vocabulary_image_choice",
      questions: questions,
    });
  }, [questions, onDataChange]);

  return (
    <div className="creator-form">
      <h4 className="creator-form-title">Tạo Lesson: Chọn ảnh</h4>

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

        {questions.map((question, qIndex) => (
          <div key={question.question_id} className="creator-form-item-card">
            <div className="creator-form-item-header">
              <span className="creator-form-item-number">
                Câu hỏi {qIndex + 1}
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
              <div className="creator-form-field">
                <label>Loại câu hỏi</label>
                <select
                  value={question.question_type}
                  onChange={(e) =>
                    handleQuestionChange(
                      question.question_id,
                      "question_type",
                      e.target.value
                    )
                  }
                >
                  <option value="text">Text</option>
                  <option value="audio">Audio</option>
                </select>
              </div>

              {question.question_type === "text" && (
                <div className="creator-form-field">
                  <label>Câu hỏi (Text) *</label>
                  <input
                    type="text"
                    value={question.question_text}
                    onChange={(e) =>
                      handleQuestionChange(
                        question.question_id,
                        "question_text",
                        e.target.value
                      )
                    }
                    placeholder="What does 'happy' mean?"
                  />
                </div>
              )}

              {question.question_type === "audio" && (
                <div className="creator-form-field">
                  <label>URL Audio *</label>
                  <input
                    type="url"
                    value={question.question_audio_url}
                    onChange={(e) =>
                      handleQuestionChange(
                        question.question_id,
                        "question_audio_url",
                        e.target.value
                      )
                    }
                    placeholder="https://..."
                  />
                </div>
              )}
            </div>

            {/* Images */}
            <div className="creator-form-group" style={{ marginTop: "16px" }}>
              <div className="creator-form-group-header">
                <label className="creator-form-label">Danh sách ảnh *</label>
                <button
                  type="button"
                  className="creator-form-add-btn"
                  onClick={() => handleAddImage(question.question_id)}
                >
                  + Thêm ảnh
                </button>
              </div>

              {question.images.map((image, imgIndex) => (
                <div
                  key={image.image_id}
                  className="creator-form-item-card"
                  style={{ background: "#fff", marginTop: "12px" }}
                >
                  <div className="creator-form-item-header">
                    <span className="creator-form-item-number">
                      Ảnh {imgIndex + 1}
                    </span>
                    {question.images.length > 1 && (
                      <button
                        type="button"
                        className="creator-form-remove-btn"
                        onClick={() =>
                          handleRemoveImage(question.question_id, image.image_id)
                        }
                      >
                        × Xóa
                      </button>
                    )}
                  </div>

                  <div className="creator-form-grid">
                    <div className="creator-form-field">
                      <label>URL ảnh *</label>
                      <input
                        type="url"
                        value={image.image_url}
                        onChange={(e) =>
                          handleImageChange(
                            question.question_id,
                            image.image_id,
                            "image_url",
                            e.target.value
                          )
                        }
                        placeholder="https://..."
                      />
                    </div>

                    <div className="creator-form-field">
                      <label>Đáp án đúng</label>
                      <label className="creator-form-radio">
                        <input
                          type="checkbox"
                          checked={image.is_correct}
                          onChange={(e) =>
                            handleImageChange(
                              question.question_id,
                              image.image_id,
                              "is_correct",
                              e.target.checked
                            )
                          }
                        />
                        <span>Đánh dấu là đáp án đúng</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


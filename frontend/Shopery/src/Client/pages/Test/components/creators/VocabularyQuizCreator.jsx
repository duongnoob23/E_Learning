// VocabularyQuizCreator.jsx - Form tạo lesson vocabulary_quiz
import React, { useState } from "react";
import "./CreatorForm.css";

export default function VocabularyQuizCreator({ onDataChange }) {
  const [questions, setQuestions] = useState([
    {
      question_id: 1,
      question_type: "text",
      question_text: "",
      question_image_url: "",
      question_audio_url: "",
      choices: [
        { choice_id: 1, text: "", image_url: "", is_correct: false },
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
        question_image_url: "",
        question_audio_url: "",
        choices: [
          { choice_id: Date.now(), text: "", image_url: "", is_correct: false },
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

  const handleAddChoice = (questionId) => {
    setQuestions(
      questions.map((q) =>
        q.question_id === questionId
          ? {
              ...q,
              choices: [
                ...q.choices,
                { choice_id: Date.now(), text: "", image_url: "", is_correct: false },
              ],
            }
          : q
      )
    );
  };

  const handleRemoveChoice = (questionId, choiceId) => {
    setQuestions(
      questions.map((q) =>
        q.question_id === questionId
          ? {
              ...q,
              choices: q.choices.filter((c) => c.choice_id !== choiceId),
            }
          : q
      )
    );
  };

  const handleChoiceChange = (questionId, choiceId, field, value) => {
    setQuestions(
      questions.map((q) =>
        q.question_id === questionId
          ? {
              ...q,
              choices: q.choices.map((c) =>
                c.choice_id === choiceId ? { ...c, [field]: value } : c
              ),
            }
          : q
      )
    );
  };

  React.useEffect(() => {
    onDataChange?.({
      type: "vocabulary_quiz",
      questions: questions,
    });
  }, [questions, onDataChange]);

  return (
    <div className="creator-form">
      <h4 className="creator-form-title">Tạo Lesson: Trắc nghiệm</h4>

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
                  <option value="image">Image</option>
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

              {question.question_type === "image" && (
                <div className="creator-form-field">
                  <label>URL ảnh câu hỏi</label>
                  <input
                    type="url"
                    value={question.question_image_url}
                    onChange={(e) =>
                      handleQuestionChange(
                        question.question_id,
                        "question_image_url",
                        e.target.value
                      )
                    }
                    placeholder="https://..."
                  />
                </div>
              )}

              {question.question_type === "audio" && (
                <div className="creator-form-field">
                  <label>URL audio câu hỏi</label>
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

            {/* Choices */}
            <div className="creator-form-group" style={{ marginTop: "16px" }}>
              <div className="creator-form-group-header">
                <label className="creator-form-label">Các lựa chọn *</label>
                <button
                  type="button"
                  className="creator-form-add-btn"
                  onClick={() => handleAddChoice(question.question_id)}
                >
                  + Thêm lựa chọn
                </button>
              </div>

              {question.choices.map((choice, cIndex) => (
                <div
                  key={choice.choice_id}
                  className="creator-form-item-card"
                  style={{ background: "#fff", marginTop: "12px" }}
                >
                  <div className="creator-form-item-header">
                    <span className="creator-form-item-number">
                      Lựa chọn {cIndex + 1}
                    </span>
                    {question.choices.length > 1 && (
                      <button
                        type="button"
                        className="creator-form-remove-btn"
                        onClick={() =>
                          handleRemoveChoice(question.question_id, choice.choice_id)
                        }
                      >
                        × Xóa
                      </button>
                    )}
                  </div>

                  <div className="creator-form-grid">
                    <div className="creator-form-field">
                      <label>Text *</label>
                      <input
                        type="text"
                        value={choice.text}
                        onChange={(e) =>
                          handleChoiceChange(
                            question.question_id,
                            choice.choice_id,
                            "text",
                            e.target.value
                          )
                        }
                        placeholder="happy"
                      />
                    </div>

                    <div className="creator-form-field">
                      <label>URL ảnh</label>
                      <input
                        type="url"
                        value={choice.image_url}
                        onChange={(e) =>
                          handleChoiceChange(
                            question.question_id,
                            choice.choice_id,
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
                          checked={choice.is_correct}
                          onChange={(e) =>
                            handleChoiceChange(
                              question.question_id,
                              choice.choice_id,
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


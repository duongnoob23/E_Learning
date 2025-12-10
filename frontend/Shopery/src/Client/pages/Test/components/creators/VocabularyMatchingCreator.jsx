// VocabularyMatchingCreator.jsx - Form tạo lesson vocabulary_matching
import React, { useState } from "react";
import "./CreatorForm.css";

export default function VocabularyMatchingCreator({ onDataChange }) {
  const [questions, setQuestions] = useState([
    {
      question_id: 1,
      pairs: [
        {
          pair_id: 1,
          left_text: "",
          left_image_url: "",
          right_text: "",
        },
      ],
      grid_size: { rows: 4, cols: 4 },
    },
  ]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_id: Date.now(),
        pairs: [
          {
            pair_id: Date.now(),
            left_text: "",
            left_image_url: "",
            right_text: "",
          },
        ],
        grid_size: { rows: 4, cols: 4 },
      },
    ]);
  };

  const handleRemoveQuestion = (questionId) => {
    setQuestions(questions.filter((q) => q.question_id !== questionId));
  };

  const handleAddPair = (questionId) => {
    setQuestions(
      questions.map((q) =>
        q.question_id === questionId
          ? {
              ...q,
              pairs: [
                ...q.pairs,
                {
                  pair_id: Date.now(),
                  left_text: "",
                  left_image_url: "",
                  right_text: "",
                },
              ],
            }
          : q
      )
    );
  };

  const handleRemovePair = (questionId, pairId) => {
    setQuestions(
      questions.map((q) =>
        q.question_id === questionId
          ? {
              ...q,
              pairs: q.pairs.filter((p) => p.pair_id !== pairId),
            }
          : q
      )
    );
  };

  const handlePairChange = (questionId, pairId, field, value) => {
    setQuestions(
      questions.map((q) =>
        q.question_id === questionId
          ? {
              ...q,
              pairs: q.pairs.map((p) =>
                p.pair_id === pairId ? { ...p, [field]: value } : p
              ),
            }
          : q
      )
    );
    // Gửi dữ liệu lên parent
    const updatedQuestions = questions.map((q) =>
      q.question_id === questionId
        ? {
            ...q,
            pairs: q.pairs.map((p) =>
              p.pair_id === pairId ? { ...p, [field]: value } : p
            ),
          }
        : q
    );
    onDataChange?.({
      type: "vocabulary_matching",
      questions: updatedQuestions,
    });
  };

  const handleGridSizeChange = (questionId, field, value) => {
    setQuestions(
      questions.map((q) =>
        q.question_id === questionId
          ? {
              ...q,
              grid_size: { ...q.grid_size, [field]: parseInt(value) },
            }
          : q
      )
    );
  };

  return (
    <div className="creator-form">
      <h4 className="creator-form-title">Tạo Lesson: Tìm cặp</h4>

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

            {/* Grid Size */}
            <div className="creator-form-grid" style={{ marginBottom: "16px" }}>
              <div className="creator-form-field">
                <label>Số hàng (rows)</label>
                <input
                  type="number"
                  min="2"
                  max="6"
                  value={question.grid_size.rows}
                  onChange={(e) =>
                    handleGridSizeChange(
                      question.question_id,
                      "rows",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="creator-form-field">
                <label>Số cột (cols)</label>
                <input
                  type="number"
                  min="2"
                  max="6"
                  value={question.grid_size.cols}
                  onChange={(e) =>
                    handleGridSizeChange(
                      question.question_id,
                      "cols",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            {/* Pairs */}
            <div className="creator-form-group">
              <div className="creator-form-group-header">
                <label className="creator-form-label">Các cặp từ *</label>
                <button
                  type="button"
                  className="creator-form-add-btn"
                  onClick={() => handleAddPair(question.question_id)}
                >
                  + Thêm cặp
                </button>
              </div>

              {question.pairs.map((pair, pIndex) => (
                <div
                  key={pair.pair_id}
                  className="creator-form-item-card"
                  style={{ background: "#fff", marginTop: "12px" }}
                >
                  <div className="creator-form-item-header">
                    <span className="creator-form-item-number">
                      Cặp {pIndex + 1}
                    </span>
                    {question.pairs.length > 1 && (
                      <button
                        type="button"
                        className="creator-form-remove-btn"
                        onClick={() =>
                          handleRemovePair(question.question_id, pair.pair_id)
                        }
                      >
                        × Xóa
                      </button>
                    )}
                  </div>

                  <div className="creator-form-grid">
                    <div className="creator-form-field">
                      <label>Bên trái - Text (Tiếng Việt) *</label>
                      <input
                        type="text"
                        value={pair.left_text}
                        onChange={(e) =>
                          handlePairChange(
                            question.question_id,
                            pair.pair_id,
                            "left_text",
                            e.target.value
                          )
                        }
                        placeholder="vui mừng"
                      />
                    </div>

                    <div className="creator-form-field">
                      <label>Bên trái - URL ảnh</label>
                      <input
                        type="url"
                        value={pair.left_image_url}
                        onChange={(e) =>
                          handlePairChange(
                            question.question_id,
                            pair.pair_id,
                            "left_image_url",
                            e.target.value
                          )
                        }
                        placeholder="https://..."
                      />
                    </div>

                    <div className="creator-form-field creator-form-field-full">
                      <label>Bên phải - Text (Tiếng Anh) *</label>
                      <input
                        type="text"
                        value={pair.right_text}
                        onChange={(e) =>
                          handlePairChange(
                            question.question_id,
                            pair.pair_id,
                            "right_text",
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
        ))}
      </div>
    </div>
  );
}


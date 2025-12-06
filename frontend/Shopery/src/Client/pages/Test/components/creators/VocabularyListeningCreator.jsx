// VocabularyListeningCreator.jsx - Form tạo lesson vocabulary_listening
import React, { useState } from "react";
import "./CreatorForm.css";

export default function VocabularyListeningCreator({ onDataChange }) {
  const [questions, setQuestions] = useState([
    {
      question_id: 1,
      audio_url: "",
      grid: {
        rows: 3,
        cols: 3,
        cells: [
          {
            cell_id: 1,
            image_url: "",
            vi_text: "",
            is_correct: false,
            position: { row: 0, col: 0 },
          },
        ],
      },
      play_count: 3,
    },
  ]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_id: Date.now(),
        audio_url: "",
        grid: {
          rows: 3,
          cols: 3,
          cells: [
            {
              cell_id: Date.now(),
              image_url: "",
              vi_text: "",
              is_correct: false,
              position: { row: 0, col: 0 },
            },
          ],
        },
        play_count: 3,
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

  const handleGridSizeChange = (questionId, field, value) => {
    setQuestions(
      questions.map((q) =>
        q.question_id === questionId
          ? {
              ...q,
              grid: { ...q.grid, [field]: parseInt(value) },
            }
          : q
      )
    );
  };

  const handleAddCell = (questionId) => {
    const question = questions.find((q) => q.question_id === questionId);
    const newRow = Math.floor(question.grid.cells.length / question.grid.cols);
    const newCol = question.grid.cells.length % question.grid.cols;
    setQuestions(
      questions.map((q) =>
        q.question_id === questionId
          ? {
              ...q,
              grid: {
                ...q.grid,
                cells: [
                  ...q.grid.cells,
                  {
                    cell_id: Date.now(),
                    image_url: "",
                    vi_text: "",
                    is_correct: false,
                    position: { row: newRow, col: newCol },
                  },
                ],
              },
            }
          : q
      )
    );
  };

  const handleRemoveCell = (questionId, cellId) => {
    setQuestions(
      questions.map((q) =>
        q.question_id === questionId
          ? {
              ...q,
              grid: {
                ...q.grid,
                cells: q.grid.cells.filter((c) => c.cell_id !== cellId),
              },
            }
          : q
      )
    );
  };

  const handleCellChange = (questionId, cellId, field, value) => {
    setQuestions(
      questions.map((q) =>
        q.question_id === questionId
          ? {
              ...q,
              grid: {
                ...q.grid,
                cells: q.grid.cells.map((c) =>
                  c.cell_id === cellId ? { ...c, [field]: value } : c
                ),
              },
            }
          : q
      )
    );
  };

  React.useEffect(() => {
    onDataChange?.({
      type: "vocabulary_listening",
      questions: questions,
    });
  }, [questions, onDataChange]);

  return (
    <div className="creator-form">
      <h4 className="creator-form-title">Tạo Lesson: Nghe từ vựng</h4>

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
                <label>URL Audio *</label>
                <input
                  type="url"
                  value={question.audio_url}
                  onChange={(e) =>
                    handleQuestionChange(
                      question.question_id,
                      "audio_url",
                      e.target.value
                    )
                  }
                  placeholder="https://..."
                />
              </div>

              <div className="creator-form-field">
                <label>Số lần phát lại</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={question.play_count}
                  onChange={(e) =>
                    handleQuestionChange(
                      question.question_id,
                      "play_count",
                      parseInt(e.target.value)
                    )
                  }
                />
              </div>

              <div className="creator-form-field">
                <label>Số hàng (rows)</label>
                <input
                  type="number"
                  min="2"
                  max="4"
                  value={question.grid.rows}
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
                  max="4"
                  value={question.grid.cols}
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

            {/* Grid Cells */}
            <div className="creator-form-group" style={{ marginTop: "16px" }}>
              <div className="creator-form-group-header">
                <label className="creator-form-label">Các ô trong grid *</label>
                <button
                  type="button"
                  className="creator-form-add-btn"
                  onClick={() => handleAddCell(question.question_id)}
                >
                  + Thêm ô
                </button>
              </div>

              {question.grid.cells.map((cell, cIndex) => (
                <div
                  key={cell.cell_id}
                  className="creator-form-item-card"
                  style={{ background: "#fff", marginTop: "12px" }}
                >
                  <div className="creator-form-item-header">
                    <span className="creator-form-item-number">
                      Ô {cIndex + 1}
                    </span>
                    {question.grid.cells.length > 1 && (
                      <button
                        type="button"
                        className="creator-form-remove-btn"
                        onClick={() =>
                          handleRemoveCell(question.question_id, cell.cell_id)
                        }
                      >
                        × Xóa
                      </button>
                    )}
                  </div>

                  <div className="creator-form-grid">
                    <div className="creator-form-field">
                      <label>Text tiếng Việt *</label>
                      <input
                        type="text"
                        value={cell.vi_text}
                        onChange={(e) =>
                          handleCellChange(
                            question.question_id,
                            cell.cell_id,
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
                        value={cell.image_url}
                        onChange={(e) =>
                          handleCellChange(
                            question.question_id,
                            cell.cell_id,
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
                          checked={cell.is_correct}
                          onChange={(e) =>
                            handleCellChange(
                              question.question_id,
                              cell.cell_id,
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


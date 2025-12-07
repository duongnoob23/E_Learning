// ListeningEditor.jsx - Editor cho dạng bài Vocabulary Listening
// Audio + Grid 3x3 (9 ô) với VI text + Image, click để chọn đáp án đúng
import React, { useCallback, useEffect, useRef, useState } from "react";
import VocabularyListening from "../../Vocabulary/VocabularyListening";
import "./ListeningEditor.css";

const GRID_SIZE = 9; // 3x3 = 9 ô

export default function ListeningEditor({ data, onChange }) {
  const [questions, setQuestions] = useState([]); // [{ id, audioUrl, cells: [...], playCount }]
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRefs = useRef({});
  const imageInputRefs = useRef({});
  const isInitialMount = useRef(true);

  // Khởi tạo: không load data có sẵn, tạo question mới
  useEffect(() => {
    if (isInitialMount.current && questions.length === 0) {
      setQuestions([
        {
          id: Date.now(),
          audioUrl: "",
          cells: Array(GRID_SIZE)
            .fill(null)
            .map((_, idx) => ({
              id: `cell_${Date.now()}_${idx}`,
              text: "",
              imageUrl: "",
              is_correct: false,
            })),
          playCount: 3,
        },
      ]);
      isInitialMount.current = false;
    }
  }, [questions.length]);

  // Update data và gửi lên parent
  const updateData = useCallback(() => {
    if (isInitialMount.current) return;

    const questionsData = questions.map((q) => ({
      question_id: q.id,
      audio_url: q.audioUrl,
      grid: {
        rows: 3,
        cols: 3,
        cells: q.cells.map((cell) => ({
          id: cell.id,
          text: cell.text.trim(),
          image: cell.imageUrl || "",
          is_correct: cell.is_correct,
        })),
      },
      play_count: q.playCount || 3,
    }));

    onChange({
      type: "vocabulary_listening",
      questions: questionsData,
    });
  }, [questions, onChange]);

  // Debounce updateData
  useEffect(() => {
    if (isInitialMount.current) return;

    const timer = setTimeout(() => {
      updateData();
    }, 150);

    return () => clearTimeout(timer);
  }, [questions, updateData]);

  const currentQuestion =
    questions[currentQuestionIndex] || questions[0] || null;
  const currentCells = currentQuestion?.cells || [];

  // Validate question
  const validateQuestion = (q) => {
    const errors = [];
    if (!q.audioUrl) errors.push("Thiếu audio");
    const validCells = q.cells.filter((c) => c.text.trim() && c.imageUrl);
    if (validCells.length < GRID_SIZE) {
      errors.push(`Cần đủ ${GRID_SIZE} ô (VI text + Image)`);
    }
    const correctCount = q.cells.filter((c) => c.is_correct).length;
    if (correctCount !== 1) {
      errors.push("Phải có đúng 1 đáp án đúng");
    }
    return errors;
  };

  // Thêm question mới
  const handleAddQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      audioUrl: "",
      cells: Array(GRID_SIZE)
        .fill(null)
        .map((_, idx) => ({
          id: `cell_${Date.now()}_${idx}`,
          text: "",
          imageUrl: "",
          is_correct: false,
        })),
      playCount: 3,
    };
    setQuestions((prev) => [...prev, newQuestion]);
    setCurrentQuestionIndex(questions.length);
  };

  // Xóa question
  const handleRemoveQuestion = (questionIndex) => {
    if (questions.length === 1) {
      alert("Phải có ít nhất 1 bài tập");
      return;
    }
    setQuestions((prev) => prev.filter((_, idx) => idx !== questionIndex));
    if (currentQuestionIndex >= questions.length - 1) {
      setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1));
    }
  };

  // Chuyển question
  const handleSwitchQuestion = (index) => {
    setCurrentQuestionIndex(index);
    setShowPreview(false);
  };

  // Upload audio
  const handleAudioUpload = (questionId, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      alert("Vui lòng chọn file audio");
      return;
    }

    const url = URL.createObjectURL(file);
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, audioUrl: url } : q))
    );
  };

  // Update cell text
  const handleCellTextChange = (questionId, cellId, value) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              cells: q.cells.map((c) =>
                c.id === cellId ? { ...c, text: value } : c
              ),
            }
          : q
      )
    );
  };

  // Upload cell image
  const handleCellImageUpload = (questionId, cellId, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh");
      return;
    }

    const url = URL.createObjectURL(file);
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              cells: q.cells.map((c) =>
                c.id === cellId ? { ...c, imageUrl: url } : c
              ),
            }
          : q
      )
    );
  };

  // Remove cell image
  const handleRemoveCellImage = (questionId, cellId) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              cells: q.cells.map((c) =>
                c.id === cellId ? { ...c, imageUrl: "" } : c
              ),
            }
          : q
      )
    );
  };

  // Toggle correct answer
  const handleToggleCorrect = (questionId, cellId) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              cells: q.cells.map((c) => ({
                ...c,
                is_correct: c.id === cellId ? !c.is_correct : false, // Chỉ 1 đáp án đúng
              })),
            }
          : q
      )
    );
  };

  // Update play count
  const handlePlayCountChange = (questionId, value) => {
    const count = parseInt(value) || 3;
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, playCount: count } : q))
    );
  };

  // Toggle preview
  const handleTogglePreview = () => {
    const errors = validateQuestion(currentQuestion);
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }
    setShowPreview(!showPreview);
  };

  // Tạo lesson data cho preview
  const getPreviewLessonData = () => {
    if (!currentQuestion) return null;

    return {
      lesson_data: {
        questions: [
          {
            question_id: currentQuestion.id,
            audio_url: currentQuestion.audioUrl,
            grid: {
              rows: 3,
              cols: 3,
              cells: currentQuestion.cells.map((cell) => ({
                id: cell.id,
                text: cell.text.trim(),
                image: cell.imageUrl || "",
                is_correct: cell.is_correct,
              })),
            },
            play_count: currentQuestion.playCount || 3,
          },
        ],
      },
    };
  };

  const errors = currentQuestion ? validateQuestion(currentQuestion) : [];

  return (
    <div className="listening-editor">
      {/* Header */}
      <div className="le-header">
        <div className="le-header-left">
          <h3 className="le-title">Vocabulary Listening</h3>
          <div className="le-questions-tabs">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                className={`le-tab ${
                  idx === currentQuestionIndex ? "active" : ""
                }`}
                onClick={() => handleSwitchQuestion(idx)}
              >
                Bài tập {idx + 1}
                {idx === currentQuestionIndex && (
                  <span
                    className="le-tab-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveQuestion(idx);
                    }}
                  >
                    ×
                  </span>
                )}
              </button>
            ))}
            <button className="le-add-question-btn" onClick={handleAddQuestion}>
              + Thêm bài tập
            </button>
          </div>
        </div>
        <div className="le-header-right">
          <button
            className={`le-preview-btn ${
              errors.length === 0 ? "" : "disabled"
            }`}
            onClick={handleTogglePreview}
            disabled={errors.length > 0}
          >
            {showPreview ? "✕ Đóng Preview" : "👁 Preview"}
          </button>
        </div>
      </div>

      {showPreview ? (
        /* Preview mode */
        <div className="le-preview-container">
          <div className="le-preview-header">
            <span>Preview: Bài tập {currentQuestionIndex + 1}</span>
            <button
              className="le-close-preview"
              onClick={() => setShowPreview(false)}
            >
              ✕
            </button>
          </div>
          <div className="le-preview-content">
            <VocabularyListening lesson={getPreviewLessonData()} />
          </div>
        </div>
      ) : currentQuestion ? (
        /* Editor mode */
        <>
          {/* Errors */}
          {errors.length > 0 && (
            <div className="le-errors">
              {errors.map((error, idx) => (
                <span key={idx} className="le-error">
                  ⚠️ {error}
                </span>
              ))}
            </div>
          )}

          {/* Audio Section */}
          <div className="le-audio-section">
            <label className="le-label">
              Audio (MP3) <span className="required">*</span>
            </label>
            <div className="le-audio-upload">
              <input
                ref={(el) => (fileInputRefs.current[currentQuestion.id] = el)}
                type="file"
                accept="audio/*"
                onChange={(e) => handleAudioUpload(currentQuestion.id, e)}
                className="le-file-input"
              />
              {!currentQuestion.audioUrl ? (
                <button
                  className="le-upload-btn"
                  onClick={() =>
                    fileInputRefs.current[currentQuestion.id]?.click()
                  }
                >
                  📤 Upload audio
                </button>
              ) : (
                <div className="le-audio-preview">
                  <audio controls>
                    <source src={currentQuestion.audioUrl} type="audio/mpeg" />
                  </audio>
                  <button
                    className="le-audio-remove"
                    onClick={() =>
                      setQuestions((prev) =>
                        prev.map((q) =>
                          q.id === currentQuestion.id
                            ? { ...q, audioUrl: "" }
                            : q
                        )
                      )
                    }
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Play Count */}
          <div className="le-play-count-section">
            <label className="le-label">Số lần nghe tối đa</label>
            <input
              type="number"
              min="1"
              max="10"
              value={currentQuestion.playCount || 3}
              onChange={(e) =>
                handlePlayCountChange(currentQuestion.id, e.target.value)
              }
              className="le-input le-number-input"
            />
          </div>

          {/* Grid 3x3 */}
          <div className="le-grid-section">
            <label className="le-label">
              Grid 3x3 (9 ô) - Click để chọn đáp án đúng{" "}
              <span className="required">*</span>
            </label>
            <div className="le-grid">
              {currentCells.map((cell, index) => (
                <div key={cell.id} className="le-cell">
                  <div className="le-cell-header">
                    <span className="le-cell-number">Ô {index + 1}</span>
                    <button
                      className={`le-cell-correct-btn ${
                        cell.is_correct ? "active" : ""
                      }`}
                      onClick={() =>
                        handleToggleCorrect(currentQuestion.id, cell.id)
                      }
                      title="Chọn làm đáp án đúng"
                    >
                      {cell.is_correct ? "✅ Đúng" : "⭕ Chọn đúng"}
                    </button>
                  </div>

                  <div className="le-cell-content">
                    {/* Vietnamese text */}
                    <input
                      type="text"
                      value={cell.text}
                      onChange={(e) =>
                        handleCellTextChange(
                          currentQuestion.id,
                          cell.id,
                          e.target.value
                        )
                      }
                      className="le-input le-cell-text"
                      placeholder="Tiếng Việt"
                    />

                    {/* Image */}
                    <div className="le-cell-image">
                      <input
                        ref={(el) => (imageInputRefs.current[cell.id] = el)}
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleCellImageUpload(currentQuestion.id, cell.id, e)
                        }
                        className="le-file-input"
                      />
                      {!cell.imageUrl ? (
                        <button
                          className="le-upload-btn-small"
                          onClick={() =>
                            imageInputRefs.current[cell.id]?.click()
                          }
                        >
                          📤 Ảnh
                        </button>
                      ) : (
                        <div className="le-cell-image-preview">
                          <img src={cell.imageUrl} alt={cell.text} />
                          <button
                            className="le-image-remove-small"
                            onClick={() =>
                              handleRemoveCellImage(currentQuestion.id, cell.id)
                            }
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hint */}
          <div className="le-hint">
            💡 <strong>Lưu ý:</strong> Mỗi bài tập cần 1 audio và 9 ô (VI text +
            Image). Chỉ có 1 đáp án đúng. Click "Chọn đúng" trên ô để đánh dấu
            đáp án.
          </div>
        </>
      ) : (
        <div className="le-empty">
          <p>Đang tải...</p>
        </div>
      )}
    </div>
  );
}

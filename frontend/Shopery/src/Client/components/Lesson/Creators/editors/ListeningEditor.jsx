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
  const [showImportJSON, setShowImportJSON] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState(null);
  const fileInputRefs = useRef({});
  const imageInputRefs = useRef({});
  const isInitialMount = useRef(true);
  const hasLoadedInitialData = useRef(false);

  // Load dữ liệu khi edit
  useEffect(() => {
    if (
      data?.questions &&
      Array.isArray(data.questions) &&
      data.questions.length > 0 &&
      !hasLoadedInitialData.current
    ) {
      const mapped = data.questions.map((q, idx) => ({
        id: q.question_id || `q_${idx}_${Date.now()}`,
        audioUrl: q.audio_url || "",
        playCount: q.play_count || 3,
        cells: (q.grid?.cells || []).map((cell, cidx) => ({
          id: cell.id || `cell_${idx}_${cidx}_${Date.now()}`,
          text: cell.text || "",
          imageUrl: cell.image || "",
          is_correct: !!cell.is_correct,
        })),
      }));
      setQuestions(mapped);
      setCurrentQuestionIndex(0);
      hasLoadedInitialData.current = true;
      isInitialMount.current = false;
    }
  }, [data]);

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

  // Import JSON - Paste từ clipboard
  const handlePasteJSON = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJsonInput(text);
      setJsonError(null);
    } catch (err) {
      setJsonError("Không thể đọc clipboard: " + err.message);
    }
  };

  // Thêm câu hỏi từ JSON
  const handleAddQuestionFromJSON = () => {
    if (!jsonInput.trim()) {
      setJsonError("Vui lòng nhập JSON");
      return;
    }

    let jsonData;
    try {
      jsonData = JSON.parse(jsonInput);
    } catch (e) {
      setJsonError("Lỗi JSON: " + e.message);
      return;
    }

    // Hỗ trợ cả object đơn lẻ và array
    let questionsToAdd = Array.isArray(jsonData) ? jsonData : [jsonData];

    // Validate và thêm từng câu hỏi
    const newQuestions = [];
    for (const q of questionsToAdd) {
      if (!q.audio_url) {
        setJsonError("Câu hỏi thiếu trường 'audio_url'");
        return;
      }

      if (!q.grid || !q.grid.cells || !Array.isArray(q.grid.cells)) {
        setJsonError("Câu hỏi thiếu trường 'grid.cells' (array)");
        return;
      }

      // Convert cells từ format database sang format nội bộ
      const cells = q.grid.cells.map((cell, idx) => ({
        id: cell.id || `cell_${Date.now()}_${idx}`,
        text: cell.vi_text || cell.text || "",
        imageUrl: cell.image_url || cell.image || "",
        is_correct: cell.is_correct || false,
      }));

      newQuestions.push({
        id: q.question_id || Date.now() + Math.random(),
        audioUrl: q.audio_url,
        cells: cells,
        playCount: q.play_count || 3,
      });
    }

    // Thêm vào danh sách
    setQuestions((prev) => {
      const updated = [...prev, ...newQuestions];
      setCurrentQuestionIndex(updated.length - 1);
      return updated;
    });

    setShowImportJSON(false);
    setJsonInput("");
    setJsonError(null);
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
                vi_text: cell.text.trim(),
                image_url: cell.imageUrl || "",
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
            <button
              className="le-add-question-btn"
              onClick={() => setShowImportJSON(true)}
              style={{
                marginLeft: "8px",
                backgroundColor: "#17a2b8",
                borderColor: "#17a2b8",
              }}
              title="Thêm bài tập từ JSON"
            >
              📝 Import JSON
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

      {/* Modal Import JSON */}
      {showImportJSON && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowImportJSON(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "24px",
              width: "90%",
              maxWidth: "700px",
              maxHeight: "85vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h3 style={{ margin: 0 }}>📝 Import JSON - Thêm bài tập</h3>
              <button
                onClick={() => setShowImportJSON(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                ×
              </button>
            </div>

            {/*
              🌟 Nút dán nhanh format mẫu với ảnh thật từ Unsplash cho vocabulary_listening.
            */}
            {(() => {
              const sampleListeningJSON = `{
  "question_id": "listen_01",
  "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  "grid": {
    "rows": 3,
    "cols": 3,
    "cells": [
      { "id": 1, "vi_text": "vui mừng", "image_url": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80", "is_correct": true },
      { "id": 2, "vi_text": "buồn bã", "image_url": "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80", "is_correct": false },
      { "id": 3, "vi_text": "tức giận", "image_url": "https://images.unsplash.com/photo-1504194104404-433180773017?auto=format&fit=crop&w=600&q=80", "is_correct": false },
      { "id": 4, "vi_text": "sợ hãi", "image_url": "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80", "is_correct": false },
      { "id": 5, "vi_text": "ngạc nhiên", "image_url": "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80", "is_correct": false },
      { "id": 6, "vi_text": "bối rối", "image_url": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80", "is_correct": false },
      { "id": 7, "vi_text": "phấn khích", "image_url": "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=600&q=80", "is_correct": false },
      { "id": 8, "vi_text": "thất vọng", "image_url": "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80", "is_correct": false },
      { "id": 9, "vi_text": "tự hào", "image_url": "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=600&q=80", "is_correct": false }
    ]
  },
  "play_count": 3
}`;
              return (
                <div style={{ marginBottom: "12px" }}>
                  <button
                    onClick={() => {
                      setJsonInput(sampleListeningJSON);
                      setJsonError(null);
                    }}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "14px",
                      marginRight: "8px",
                    }}
                  >
                    📥 Dán format mẫu
                  </button>
                </div>
              );
            })()}

            <div style={{ marginBottom: "16px" }}>
              <p
                style={{
                  margin: "0 0 8px 0",
                  color: "#666",
                  lineHeight: "1.6",
                }}
              >
                Paste JSON của một bài tập hoặc array bài tập. Format: mỗi bài
                tập cần có <strong>audio_url</strong> (URL audio),{" "}
                <strong>grid</strong> với <strong>cells</strong> (array 9 ô),
                mỗi cell có <strong>vi_text</strong> (tiếng Việt),{" "}
                <strong>image_url</strong> (URL ảnh), và{" "}
                <strong>is_correct</strong> (true/false). Chỉ có 1 cell được
                đánh dấu <strong>is_correct: true</strong>.
              </p>
              <details style={{ marginTop: "12px" }}>
                <summary
                  style={{
                    cursor: "pointer",
                    color: "#007bff",
                    fontWeight: "500",
                    marginBottom: "8px",
                  }}
                >
                  📋 Xem format mẫu
                </summary>
                <pre
                  style={{
                    backgroundColor: "#f5f5f5",
                    padding: "16px",
                    borderRadius: "4px",
                    fontSize: "13px",
                    overflow: "auto",
                    marginTop: "8px",
                    border: "1px solid #ddd",
                  }}
                >
                  {`{
  "question_id": "listen_01",
  "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  "grid": {
    "rows": 3,
    "cols": 3,
    "cells": [
      { "id": 1, "vi_text": "vui mừng", "image_url": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80", "is_correct": true },
      { "id": 2, "vi_text": "buồn bã", "image_url": "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80", "is_correct": false },
      { "id": 3, "vi_text": "tức giận", "image_url": "https://images.unsplash.com/photo-1504194104404-433180773017?auto=format&fit=crop&w=600&q=80", "is_correct": false },
      { "id": 4, "vi_text": "sợ hãi", "image_url": "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80", "is_correct": false },
      { "id": 5, "vi_text": "ngạc nhiên", "image_url": "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80", "is_correct": false },
      { "id": 6, "vi_text": "bối rối", "image_url": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80", "is_correct": false },
      { "id": 7, "vi_text": "phấn khích", "image_url": "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=600&q=80", "is_correct": false },
      { "id": 8, "vi_text": "thất vọng", "image_url": "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80", "is_correct": false },
      { "id": 9, "vi_text": "tự hào", "image_url": "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=600&q=80", "is_correct": false }
    ]
  },
  "play_count": 3
}`}
                </pre>
              </details>
            </div>

            <div style={{ marginBottom: "12px" }}>
              <button
                onClick={handlePasteJSON}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                📋 Paste từ Clipboard
              </button>
            </div>

            {jsonError && (
              <div
                style={{
                  backgroundColor: "#f8d7da",
                  color: "#721c24",
                  padding: "12px",
                  borderRadius: "4px",
                  marginBottom: "12px",
                }}
              >
                {jsonError}
              </div>
            )}

            <textarea
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                setJsonError(null);
              }}
              placeholder="Paste JSON ở đây..."
              style={{
                width: "100%",
                minHeight: "250px",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontFamily: "monospace",
                fontSize: "14px",
                marginBottom: "12px",
                resize: "vertical",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              <button
                onClick={() => {
                  setJsonInput("");
                  setJsonError(null);
                  setShowImportJSON(false);
                }}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Hủy
              </button>
              <button
                onClick={handleAddQuestionFromJSON}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                ✅ Thêm bài tập
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

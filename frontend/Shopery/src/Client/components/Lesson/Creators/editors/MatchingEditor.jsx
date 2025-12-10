// MatchingEditor.jsx - Editor theo flow mới: thêm cặp (pair), không phải từng ô
// Hỗ trợ nhiều bài tập (questions), mỗi bài tập 4x4 (8 cặp)
import React, { useCallback, useEffect, useRef, useState } from "react";
import VocabularyMatching from "../../Vocabulary/VocabularyMatching";
import "./MatchingEditor.css";

const MAX_PAIRS = 8; // 4x4 = 16 ô = 8 cặp

export default function MatchingEditor({ data, onChange }) {
  const [questions, setQuestions] = useState([]); // [{ id, pairs: [...] }]
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showImportJSON, setShowImportJSON] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState(null);
  const fileInputRefs = useRef({});
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
        pairs: (q.pairs || []).map((p, pidx) => ({
          id: p.pair_id || `pair_${idx}_${pidx}_${Date.now()}`,
          vi: p.left?.text || "",
          en: p.right?.text || "",
          imageUrl: p.left?.image || "",
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
    if (isInitialMount.current) {
      // Tạo question đầu tiên nếu chưa có
      if (questions.length === 0) {
        setQuestions([{ id: Date.now(), pairs: [] }]);
      }
      isInitialMount.current = false;
    }
  }, []);

  // Update data và gửi lên parent
  const updateData = useCallback(() => {
    if (isInitialMount.current) return;

    // Convert questions sang format của component
    const questionsData = questions.map((q, index) => ({
      question_id: q.id,
      pairs: q.pairs.map((pair) => ({
        pair_id: pair.id,
        left: {
          type: pair.imageUrl ? "image_vi" : "text_vi",
          text: pair.vi,
          image: pair.imageUrl || "",
        },
        right: {
          type: "text",
          text: pair.en,
        },
      })),
      grid_size: {
        rows: 4,
        cols: 4,
      },
    }));

    onChange({
      type: "vocabulary_matching",
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

  const currentQuestion = questions[currentQuestionIndex];
  const currentPairs = currentQuestion?.pairs || [];

  // Kiểm tra xem có đủ 8 cặp và mỗi cặp có EN + VI chưa, và các cặp phải khác nhau
  const canPreview = () => {
    // Kiểm tra số lượng
    if (!currentPairs || currentPairs.length !== MAX_PAIRS) {
      return false;
    }

    // Kiểm tra mỗi cặp có đủ EN và VI
    const allHaveContent = currentPairs.every(
      (pair) => pair.en && pair.vi && pair.en.trim() && pair.vi.trim()
    );
    if (!allHaveContent) {
      return false;
    }

    // Kiểm tra các cặp phải khác nhau (không trùng EN hoặc VI)
    const enValues = currentPairs.map((p) => p.en.trim().toLowerCase());
    const viValues = currentPairs.map((p) => p.vi.trim().toLowerCase());

    const hasDuplicateEn = new Set(enValues).size !== enValues.length;
    const hasDuplicateVi = new Set(viValues).size !== viValues.length;

    return !hasDuplicateEn && !hasDuplicateVi;
  };

  // Lấy thông báo lỗi chi tiết
  const getPreviewError = () => {
    if (!currentPairs || currentPairs.length !== MAX_PAIRS) {
      return `Cần đủ ${MAX_PAIRS} cặp. Hiện tại có ${
        currentPairs?.length || 0
      } cặp.`;
    }

    const missingContent = currentPairs.filter(
      (pair) => !pair.en?.trim() || !pair.vi?.trim()
    );
    if (missingContent.length > 0) {
      return `Có ${missingContent.length} cặp chưa đủ nội dung (EN hoặc VI).`;
    }

    const enValues = currentPairs.map((p) => p.en.trim().toLowerCase());
    const viValues = currentPairs.map((p) => p.vi.trim().toLowerCase());

    const enSet = new Set(enValues);
    const viSet = new Set(viValues);

    if (enSet.size !== enValues.length) {
      return "Có các từ tiếng Anh trùng lặp. Mỗi cặp phải có từ tiếng Anh khác nhau.";
    }

    if (viSet.size !== viValues.length) {
      return "Có các từ tiếng Việt trùng lặp. Mỗi cặp phải có từ tiếng Việt khác nhau.";
    }

    return null;
  };

  // Thêm cặp mới (thêm vào đầu)
  const handleAddPair = () => {
    if (currentPairs.length >= MAX_PAIRS) {
      alert(`Tối đa ${MAX_PAIRS} cặp cho một bài tập 4x4`);
      return;
    }

    const newPair = {
      id: `pair_${Date.now()}`,
      en: "",
      vi: "",
      imageUrl: "",
    };

    setQuestions((prev) =>
      prev.map((q, idx) =>
        idx === currentQuestionIndex
          ? { ...q, pairs: [newPair, ...q.pairs] } // Unshift: thêm vào đầu
          : q
      )
    );
  };

  // Xóa cặp
  const handleRemovePair = (pairId) => {
    setQuestions((prev) =>
      prev.map((q, idx) =>
        idx === currentQuestionIndex
          ? { ...q, pairs: q.pairs.filter((p) => p.id !== pairId) }
          : q
      )
    );
  };

  // Update EN
  const handleEnChange = (pairId, value) => {
    setQuestions((prev) =>
      prev.map((q, idx) =>
        idx === currentQuestionIndex
          ? {
              ...q,
              pairs: q.pairs.map((p) =>
                p.id === pairId ? { ...p, en: value } : p
              ),
            }
          : q
      )
    );
  };

  // Update VI
  const handleViChange = (pairId, value) => {
    setQuestions((prev) =>
      prev.map((q, idx) =>
        idx === currentQuestionIndex
          ? {
              ...q,
              pairs: q.pairs.map((p) =>
                p.id === pairId ? { ...p, vi: value } : p
              ),
            }
          : q
      )
    );
  };

  // Upload image cho pair
  const handleImageUpload = (pairId, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh");
      return;
    }

    const url = URL.createObjectURL(file);
    setQuestions((prev) =>
      prev.map((q, idx) =>
        idx === currentQuestionIndex
          ? {
              ...q,
              pairs: q.pairs.map((p) =>
                p.id === pairId ? { ...p, imageUrl: url } : p
              ),
            }
          : q
      )
    );
  };

  // Xóa ảnh
  const handleRemoveImage = (pairId) => {
    setQuestions((prev) =>
      prev.map((q, idx) =>
        idx === currentQuestionIndex
          ? {
              ...q,
              pairs: q.pairs.map((p) =>
                p.id === pairId ? { ...p, imageUrl: "" } : p
              ),
            }
          : q
      )
    );
  };

  // Thêm question mới
  const handleAddQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      pairs: [],
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
      if (!q.pairs || !Array.isArray(q.pairs)) {
        setJsonError("Câu hỏi thiếu trường 'pairs' (array)");
        return;
      }

      // Convert pairs từ format database sang format nội bộ
      const pairs = q.pairs.map((pair, idx) => {
        const left = pair.left || {};
        const right = pair.right || {};

        return {
          id: pair.pair_id || Date.now() + idx,
          vi: left.text || "",
          en: right.text || "",
          imageUrl: left.image || "",
        };
      });

      newQuestions.push({
        id: q.question_id || Date.now() + Math.random(),
        pairs: pairs,
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

    // Điều chỉnh currentQuestionIndex
    if (currentQuestionIndex >= questions.length - 1) {
      setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1));
    }
  };

  // Chuyển question
  const handleSwitchQuestion = (index) => {
    setCurrentQuestionIndex(index);
    setShowPreview(false);
  };

  // Toggle preview
  const handleTogglePreview = () => {
    if (!canPreview()) {
      const errorMsg = getPreviewError();
      alert(
        errorMsg ||
          `Vui lòng nhập đủ ${MAX_PAIRS} cặp và đảm bảo mỗi cặp có cả English và Vietnamese, và các cặp phải khác nhau.`
      );
      return;
    }
    setShowPreview(!showPreview);
  };

  // Tạo lesson data cho preview
  const getPreviewLessonData = () => {
    if (!currentQuestion) return null;

    const pairsData = currentQuestion.pairs.map((pair) => ({
      pair_id: pair.id,
      left: {
        type: pair.imageUrl ? "image_vi" : "text_vi",
        text: pair.vi,
        image: pair.imageUrl || "",
      },
      right: {
        type: "text",
        text: pair.en,
      },
    }));

    return {
      lesson_data: {
        questions: [
          {
            question_id: currentQuestion.id,
            pairs: pairsData,
            grid_size: { rows: 4, cols: 4 },
          },
        ],
      },
    };
  };

  return (
    <div className="matching-editor">
      {/* Header với tabs cho các questions */}
      <div className="me-header">
        <div className="me-header-left">
          <h3 className="me-title">Tìm cặp từ vựng</h3>
          <div className="me-questions-tabs">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                className={`me-tab ${
                  idx === currentQuestionIndex ? "active" : ""
                }`}
                onClick={() => handleSwitchQuestion(idx)}
              >
                Bài tập {idx + 1}
                {idx === currentQuestionIndex && (
                  <span
                    className="me-tab-remove"
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
            <button className="me-add-question-btn" onClick={handleAddQuestion}>
              + Thêm bài tập
            </button>
            <button
              className="me-add-question-btn"
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
        <div className="me-header-right">
          <button
            className={`me-preview-btn ${canPreview() ? "" : "disabled"}`}
            onClick={handleTogglePreview}
            disabled={!canPreview()}
          >
            {showPreview ? "✕ Đóng Preview" : "👁 Preview"}
          </button>
        </div>
      </div>

      {showPreview ? (
        /* Preview mode */
        <div className="me-preview-container">
          <div className="me-preview-header">
            <span>Preview: Bài tập {currentQuestionIndex + 1}</span>
            <button
              className="me-close-preview"
              onClick={() => setShowPreview(false)}
            >
              ✕
            </button>
          </div>
          <div className="me-preview-content">
            <VocabularyMatching lesson={getPreviewLessonData()} />
          </div>
        </div>
      ) : (
        /* Editor mode */
        <>
          {/* Thông tin bài tập hiện tại */}
          <div className="me-question-info">
            <span>
              Bài tập {currentQuestionIndex + 1} / {questions.length} -{" "}
              {currentPairs.length} / {MAX_PAIRS} cặp
            </span>
            {!canPreview() && (
              <span className="me-warning">
                ⚠️{" "}
                {getPreviewError() ||
                  `Cần đủ ${MAX_PAIRS} cặp và đảm bảo mỗi cặp có đủ nội dung, không trùng lặp`}
              </span>
            )}
            {canPreview() && (
              <span className="me-success">✅ Đã sẵn sàng preview</span>
            )}
          </div>

          {/* Nút thêm cặp */}
          <div className="me-add-pair-section">
            <button
              className="me-add-btn"
              onClick={handleAddPair}
              disabled={currentPairs.length >= MAX_PAIRS}
            >
              + Thêm cặp mới
            </button>
            {currentPairs.length >= MAX_PAIRS && (
              <span className="me-limit-reached">
                Đã đạt tối đa {MAX_PAIRS} cặp
              </span>
            )}
          </div>

          {/* Danh sách các cặp */}
          {currentPairs.length === 0 ? (
            <div className="me-empty">
              <p>Chưa có cặp nào. Nhấn "Thêm cặp mới" để bắt đầu.</p>
            </div>
          ) : (
            <div className="me-pairs-list">
              {currentPairs.map((pair, index) => (
                <div key={pair.id} className="me-pair-card">
                  <div className="me-pair-header">
                    <span className="me-pair-number">✅ Pair #{index + 1}</span>
                    <button
                      className="me-pair-remove"
                      onClick={() => handleRemovePair(pair.id)}
                      title="Xóa cặp"
                    >
                      🗑️ Xóa cặp
                    </button>
                  </div>

                  <div className="me-pair-content">
                    {/* English word */}
                    <div className="me-pair-field">
                      <label className="me-label">English word *</label>
                      <input
                        type="text"
                        value={pair.en}
                        onChange={(e) =>
                          handleEnChange(pair.id, e.target.value)
                        }
                        className="me-input"
                        placeholder="Ví dụ: happy"
                      />
                    </div>

                    {/* Vietnamese meaning */}
                    <div className="me-pair-field">
                      <label className="me-label">Vietnamese meaning *</label>
                      <input
                        type="text"
                        value={pair.vi}
                        onChange={(e) =>
                          handleViChange(pair.id, e.target.value)
                        }
                        className="me-input"
                        placeholder="Ví dụ: vui mừng"
                      />
                    </div>

                    {/* Image */}
                    <div className="me-pair-field">
                      <label className="me-label">Image</label>
                      <div className="me-image-upload">
                        <input
                          ref={(el) => (fileInputRefs.current[pair.id] = el)}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(pair.id, e)}
                          className="me-file-input"
                        />
                        {!pair.imageUrl ? (
                          <button
                            className="me-upload-btn"
                            onClick={() =>
                              fileInputRefs.current[pair.id]?.click()
                            }
                          >
                            📤 Upload image
                          </button>
                        ) : (
                          <div className="me-image-preview">
                            <img src={pair.imageUrl} alt={`${pair.vi}`} />
                            <button
                              className="me-image-remove"
                              onClick={() => handleRemoveImage(pair.id)}
                              title="Xóa ảnh"
                            >
                              ×
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Hint */}
          {currentPairs.length > 0 && (
            <div className="me-hint">
              💡 <strong>Lưu ý:</strong> Mỗi bài tập cần đủ {MAX_PAIRS} cặp (16
              ô) để tạo ma trận 4x4. Hệ thống sẽ tự động trộn các ô cho học
              viên.
            </div>
          )}
        </>
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

            <div style={{ marginBottom: "16px" }}>
              <p
                style={{
                  margin: "0 0 8px 0",
                  color: "#666",
                  lineHeight: "1.6",
                }}
              >
                Paste JSON của một bài tập hoặc array bài tập. Format: mỗi bài
                tập cần có <strong>pairs</strong> (array các cặp từ), mỗi cặp có{" "}
                <strong>left</strong> (tiếng Việt, có thể có image) và{" "}
                <strong>right</strong> (tiếng Anh).
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
  "question_id": "123",
  "pairs": [
    {
      "pair_id": 1,
      "left": {
        "type": "text_vi",
        "text": "vui mừng",
        "image": ""
      },
      "right": {
        "type": "text",
        "text": "happy"
      }
    },
    {
      "pair_id": 2,
      "left": {
        "type": "text_vi",
        "text": "buồn bã",
        "image": ""
      },
      "right": {
        "type": "text",
        "text": "sad"
      }
    },
    {
      "pair_id": 3,
      "left": {
        "type": "text_vi",
        "text": "tức giận",
        "image": ""
      },
      "right": {
        "type": "text",
        "text": "angry"
      }
    },
    {
      "pair_id": 4,
      "left": {
        "type": "text_vi",
        "text": "sợ hãi",
        "image": ""
      },
      "right": {
        "type": "text",
        "text": "scared"
      }
    },
    {
      "pair_id": 5,
      "left": {
        "type": "text_vi",
        "text": "ngạc nhiên",
        "image": ""
      },
      "right": {
        "type": "text",
        "text": "surprised"
      }
    },
    {
      "pair_id": 6,
      "left": {
        "type": "text_vi",
        "text": "phấn khích",
        "image": ""
      },
      "right": {
        "type": "text",
        "text": "excited"
      }
    },
    {
      "pair_id": 7,
      "left": {
        "type": "text_vi",
        "text": "thất vọng",
        "image": ""
      },
      "right": {
        "type": "text",
        "text": "disappointed"
      }
    },
    {
      "pair_id": 8,
      "left": {
        "type": "text_vi",
        "text": "tự hào",
        "image": ""
      },
      "right": {
        "type": "text",
        "text": "proud"
      }
    }
  ],
  "grid_size": {
    "rows": 4,
    "cols": 4
  }
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

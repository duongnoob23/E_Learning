// MatchingEditor.jsx - Editor theo flow mới: thêm cặp (pair), không phải từng ô
// Hỗ trợ nhiều bài tập (questions), mỗi bài tập 4x4 (8 cặp)
import React, { useState, useRef, useEffect, useCallback } from "react";
import VocabularyMatching from "../../Vocabulary/VocabularyMatching";
import "./MatchingEditor.css";

const MAX_PAIRS = 8; // 4x4 = 16 ô = 8 cặp

export default function MatchingEditor({ data, onChange }) {
  const [questions, setQuestions] = useState([]); // [{ id, pairs: [...] }]
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRefs = useRef({});
  const isInitialMount = useRef(true);

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
      return `Cần đủ ${MAX_PAIRS} cặp. Hiện tại có ${currentPairs?.length || 0} cặp.`;
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
      alert(errorMsg || `Vui lòng nhập đủ ${MAX_PAIRS} cặp và đảm bảo mỗi cặp có cả English và Vietnamese, và các cặp phải khác nhau.`);
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
                className={`me-tab ${idx === currentQuestionIndex ? "active" : ""}`}
                onClick={() => handleSwitchQuestion(idx)}
              >
                Bài tập {idx + 1}
                {idx === currentQuestionIndex && (
                  <span className="me-tab-remove" onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveQuestion(idx);
                  }}>
                    ×
                  </span>
                )}
              </button>
            ))}
            <button className="me-add-question-btn" onClick={handleAddQuestion}>
              + Thêm bài tập
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
                ⚠️ {getPreviewError() || `Cần đủ ${MAX_PAIRS} cặp và đảm bảo mỗi cặp có đủ nội dung, không trùng lặp`}
              </span>
            )}
            {canPreview() && (
              <span className="me-success">
                ✅ Đã sẵn sàng preview
              </span>
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
                        onChange={(e) => handleEnChange(pair.id, e.target.value)}
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
                        onChange={(e) => handleViChange(pair.id, e.target.value)}
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
                            onClick={() => fileInputRefs.current[pair.id]?.click()}
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
              💡 <strong>Lưu ý:</strong> Mỗi bài tập cần đủ {MAX_PAIRS} cặp (16 ô) để tạo ma trận 4x4.
              Hệ thống sẽ tự động trộn các ô cho học viên.
            </div>
          )}
        </>
      )}
    </div>
  );
}

// TranslationEditor.jsx - Editor cho dạng bài Vocabulary Translation
// Nhập theo list từ, 1 card = 1 từ, hỗ trợ nhiều đáp án đúng
import React, { useState, useRef, useEffect, useCallback } from "react";
import VocabularyTranslation from "../../Vocabulary/VocabularyTranslation";
import "./TranslationEditor.css";

export default function TranslationEditor({ data, onChange }) {
  const [items, setItems] = useState([]); // [{ id, vi, imageUrl, answers: [...] }]
  const [showPreview, setShowPreview] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const fileInputRefs = useRef({});
  const answerInputRefs = useRef({});
  const isInitialMount = useRef(true);

  // Khởi tạo: không load data có sẵn, tạo item mới
  useEffect(() => {
    if (isInitialMount.current) {
      if (items.length === 0) {
        setItems([{ id: Date.now(), vi: "", imageUrl: "", answers: [""] }]);
      }
      isInitialMount.current = false;
    }
  }, []);

  // Update data và gửi lên parent
  const updateData = useCallback(() => {
    if (isInitialMount.current) return;

    // Convert items sang format của component
    // VocabularyTranslation hỗ trợ nhiều đáp án cách nhau dấu phẩy
    const questions = items
      .filter((item) => item.vi.trim() && item.imageUrl && item.answers.some((a) => a.trim()))
      .map((item) => ({
        question_id: item.id,
        vi_text: item.vi.trim(),
        image_url: item.imageUrl,
        correct_answer: item.answers.filter((a) => a.trim()).join(", "), // Join multiple answers với dấu phẩy
      }));

    onChange({
      type: "vocabulary_translation",
      questions: questions,
    });
  }, [items, onChange]);

  // Debounce updateData
  useEffect(() => {
    if (isInitialMount.current) return;

    const timer = setTimeout(() => {
      updateData();
    }, 150);

    return () => clearTimeout(timer);
  }, [items, updateData]);

  // Thêm item mới
  const handleAddItem = () => {
    const newItem = {
      id: Date.now(),
      vi: "",
      imageUrl: "",
      answers: [""],
    };
    setItems((prev) => [...prev, newItem]);
  };

  // Xóa item
  const handleRemoveItem = (itemId) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    if (previewIndex >= items.length - 1) {
      setPreviewIndex(Math.max(0, items.length - 2));
    }
  };

  // Update Vietnamese word
  const handleViChange = (itemId, value) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, vi: value } : item))
    );
  };

  // Upload image
  const handleImageUpload = (itemId, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh");
      return;
    }

    const url = URL.createObjectURL(file);
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, imageUrl: url } : item))
    );
  };

  // Xóa ảnh
  const handleRemoveImage = (itemId) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, imageUrl: "" } : item))
    );
  };

  // Thêm đáp án mới
  const handleAddAnswer = (itemId) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, answers: [...item.answers, ""] }
          : item
      )
    );
  };

  // Xóa đáp án
  const handleRemoveAnswer = (itemId, answerIndex) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              answers: item.answers.filter((_, idx) => idx !== answerIndex),
            }
          : item
      )
    );
  };

  // Update đáp án
  const handleAnswerChange = (itemId, answerIndex, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              answers: item.answers.map((ans, idx) =>
                idx === answerIndex ? value : ans
              ),
            }
          : item
      )
    );
  };

  // Xử lý paste nhiều đáp án (comma-separated)
  const handleAnswerPaste = (itemId, answerIndex, e) => {
    const pastedText = e.clipboardData.getData("text");
    if (pastedText.includes(",")) {
      e.preventDefault();
      const answers = pastedText
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a);

      if (answers.length > 1) {
        setItems((prev) =>
          prev.map((item) => {
            if (item.id !== itemId) return item;

            const newAnswers = [...item.answers];
            newAnswers[answerIndex] = answers[0];
            // Thêm các đáp án còn lại
            for (let i = 1; i < answers.length; i++) {
              newAnswers.push(answers[i]);
            }

            return { ...item, answers: newAnswers };
          })
        );
      }
    }
  };

  // Enter để thêm đáp án mới
  const handleAnswerKeyDown = (itemId, answerIndex, e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const currentAnswer = items.find((i) => i.id === itemId)?.answers[answerIndex] || "";
      if (currentAnswer.trim()) {
        handleAddAnswer(itemId);
        // Focus vào input mới sau khi render
        setTimeout(() => {
          const nextInput = answerInputRefs.current[`${itemId}-${answerIndex + 1}`];
          if (nextInput) nextInput.focus();
        }, 0);
      }
    }
  };

  // Validate item
  const validateItem = (item) => {
    const errors = [];
    if (!item.vi.trim()) errors.push("Thiếu từ tiếng Việt");
    if (!item.imageUrl) errors.push("Thiếu hình ảnh");
    const validAnswers = item.answers.filter((a) => a.trim());
    if (validAnswers.length === 0) errors.push("Thiếu đáp án đúng");
    return errors;
  };

  // Toggle preview
  const handleTogglePreview = () => {
    const validItems = items.filter((item) => validateItem(item).length === 0);
    if (validItems.length === 0) {
      alert("Vui lòng nhập ít nhất 1 từ đầy đủ (VI + Image + Answer) để preview");
      return;
    }
    setShowPreview(!showPreview);
    if (!showPreview) {
      setPreviewIndex(0);
    }
  };

  // Tạo lesson data cho preview
  const getPreviewLessonData = () => {
    const validItems = items.filter((item) => validateItem(item).length === 0);
    if (validItems.length === 0 || previewIndex >= validItems.length) return null;

    const item = validItems[previewIndex];
    return {
      lesson_data: {
        questions: [
          {
            question_id: item.id,
            vi_text: item.vi.trim(),
            image_url: item.imageUrl,
            correct_answer: item.answers.filter((a) => a.trim()).join(", "),
          },
        ],
      },
    };
  };

  // Chuyển preview item
  const handlePreviewNext = () => {
    const validItems = items.filter((item) => validateItem(item).length === 0);
    if (previewIndex < validItems.length - 1) {
      setPreviewIndex(previewIndex + 1);
    }
  };

  const handlePreviewPrev = () => {
    if (previewIndex > 0) {
      setPreviewIndex(previewIndex - 1);
    }
  };

  const validItems = items.filter((item) => validateItem(item).length === 0);

  return (
    <div className="translation-editor">
      {/* Header */}
      <div className="te-header">
        <div className="te-header-left">
          <h3 className="te-title">Vocabulary Translation</h3>
          <button className="te-add-btn" onClick={handleAddItem}>
            + Thêm từ mới
          </button>
        </div>
        <div className="te-header-right">
          <button
            className={`te-preview-btn ${validItems.length > 0 ? "" : "disabled"}`}
            onClick={handleTogglePreview}
            disabled={validItems.length === 0}
          >
            {showPreview ? "✕ Đóng Preview" : "👁 Preview"}
          </button>
        </div>
      </div>

      {showPreview ? (
        /* Preview mode */
        <div className="te-preview-container">
          <div className="te-preview-header">
            <div className="te-preview-nav">
              <button
                className="te-preview-nav-btn"
                onClick={handlePreviewPrev}
                disabled={previewIndex === 0}
              >
                ← Trước
              </button>
              <span>
                Preview: {previewIndex + 1} / {validItems.length}
              </span>
              <button
                className="te-preview-nav-btn"
                onClick={handlePreviewNext}
                disabled={previewIndex >= validItems.length - 1}
              >
                Sau →
              </button>
            </div>
            <button
              className="te-close-preview"
              onClick={() => setShowPreview(false)}
            >
              ✕
            </button>
          </div>
          <div className="te-preview-content">
            <VocabularyTranslation lesson={getPreviewLessonData()} />
          </div>
        </div>
      ) : (
        /* Editor mode */
        <>
          {items.length === 0 ? (
            <div className="te-empty">
              <p>Chưa có từ nào. Nhấn "Thêm từ mới" để bắt đầu.</p>
            </div>
          ) : (
            <div className="te-items-list">
              {items.map((item, index) => {
                const errors = validateItem(item);
                const isValid = errors.length === 0;

                return (
                  <div
                    key={item.id}
                    className={`te-item-card ${isValid ? "" : "has-errors"}`}
                  >
                    <div className="te-item-header">
                      <span className="te-item-number">
                        Từ #{index + 1} {isValid && "✅"}
                      </span>
                      <button
                        className="te-item-remove"
                        onClick={() => handleRemoveItem(item.id)}
                        title="Xóa từ"
                      >
                        🗑️ Xóa
                      </button>
                    </div>

                    {/* Errors */}
                    {errors.length > 0 && (
                      <div className="te-item-errors">
                        {errors.map((error, idx) => (
                          <span key={idx} className="te-error">
                            ⚠️ {error}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="te-item-content">
                      {/* Vietnamese word */}
                      <div className="te-item-field">
                        <label className="te-label">
                          Vietnamese word <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          value={item.vi}
                          onChange={(e) => handleViChange(item.id, e.target.value)}
                          className="te-input"
                          placeholder="Ví dụ: hạnh phúc"
                        />
                      </div>

                      {/* Image */}
                      <div className="te-item-field">
                        <label className="te-label">
                          Image <span className="required">*</span>
                        </label>
                        <div className="te-image-upload">
                          <input
                            ref={(el) => (fileInputRefs.current[item.id] = el)}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(item.id, e)}
                            className="te-file-input"
                          />
                          {!item.imageUrl ? (
                            <button
                              className="te-upload-btn"
                              onClick={() => fileInputRefs.current[item.id]?.click()}
                            >
                              📤 Upload image
                            </button>
                          ) : (
                            <div className="te-image-preview">
                              <img src={item.imageUrl} alt={item.vi} />
                              <button
                                className="te-image-remove"
                                onClick={() => handleRemoveImage(item.id)}
                                title="Xóa ảnh"
                              >
                                ×
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Answers */}
                      <div className="te-item-field te-answers-field">
                        <label className="te-label">
                          Correct English answer(s){" "}
                          <span className="required">*</span>
                          <span className="te-hint">
                            (Enter để thêm đáp án, paste nhiều đáp án cách nhau dấu phẩy)
                          </span>
                        </label>
                        <div className="te-answers-list">
                          {item.answers.map((answer, ansIndex) => (
                            <div key={ansIndex} className="te-answer-item">
                              <input
                                ref={(el) =>
                                  (answerInputRefs.current[
                                    `${item.id}-${ansIndex}`
                                  ] = el)
                                }
                                type="text"
                                value={answer}
                                onChange={(e) =>
                                  handleAnswerChange(item.id, ansIndex, e.target.value)
                                }
                                onPaste={(e) =>
                                  handleAnswerPaste(item.id, ansIndex, e)
                                }
                                onKeyDown={(e) =>
                                  handleAnswerKeyDown(item.id, ansIndex, e)
                                }
                                className="te-input te-answer-input"
                                placeholder="Ví dụ: happy"
                              />
                              {item.answers.length > 1 && (
                                <button
                                  className="te-answer-remove"
                                  onClick={() =>
                                    handleRemoveAnswer(item.id, ansIndex)
                                  }
                                  title="Xóa đáp án"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            className="te-add-answer-btn"
                            onClick={() => handleAddAnswer(item.id)}
                          >
                            + Add synonym
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Hint */}
          {items.length > 0 && (
            <div className="te-hint-box">
              💡 <strong>Mẹo:</strong> Nhấn Enter trong ô đáp án để thêm đáp án mới. Paste
              nhiều đáp án cách nhau dấu phẩy để tự động tách thành nhiều đáp án.
            </div>
          )}
        </>
      )}
    </div>
  );
}


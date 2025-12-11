// TranslationEditor.jsx - Editor cho dạng bài Vocabulary Translation
// Nhập theo list từ, 1 card = 1 từ, hỗ trợ nhiều đáp án đúng
import React, { useCallback, useEffect, useRef, useState } from "react";
import VocabularyTranslation from "../../Vocabulary/VocabularyTranslation";
import "./TranslationEditor.css";

export default function TranslationEditor({ data, onChange }) {
  const [items, setItems] = useState([]); // [{ id, vi, imageUrl, answers: [...] }]
  const [showPreview, setShowPreview] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [showImportJSON, setShowImportJSON] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState(null);
  const fileInputRefs = useRef({});
  const answerInputRefs = useRef({});
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
        vi: q.vi_text || "",
        imageUrl: q.image_url || "",
        answers: q.correct_answer
          ? q.correct_answer.split(",").map((a) => a.trim())
          : [""],
      }));
      setItems(mapped);
      setPreviewIndex(0);
      hasLoadedInitialData.current = true;
      isInitialMount.current = false;
    }
  }, [data]);

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
      .filter(
        (item) =>
          item.vi.trim() && item.imageUrl && item.answers.some((a) => a.trim())
      )
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
      prev.map((item) =>
        item.id === itemId ? { ...item, imageUrl: url } : item
      )
    );
  };

  // Xóa ảnh
  const handleRemoveImage = (itemId) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, imageUrl: "" } : item
      )
    );
  };

  // Thêm đáp án mới
  const handleAddAnswer = (itemId) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, answers: [...item.answers, ""] } : item
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
      const currentAnswer =
        items.find((i) => i.id === itemId)?.answers[answerIndex] || "";
      if (currentAnswer.trim()) {
        handleAddAnswer(itemId);
        // Focus vào input mới sau khi render
        setTimeout(() => {
          const nextInput =
            answerInputRefs.current[`${itemId}-${answerIndex + 1}`];
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
      alert(
        "Vui lòng nhập ít nhất 1 từ đầy đủ (VI + Image + Answer) để preview"
      );
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
    if (validItems.length === 0 || previewIndex >= validItems.length)
      return null;

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
    const newItems = [];
    for (const q of questionsToAdd) {
      if (!q.vi_text || !q.correct_answer) {
        setJsonError(
          "Câu hỏi thiếu các trường bắt buộc: vi_text, correct_answer"
        );
        return;
      }

      // Tách đáp án (có thể có nhiều đáp án cách nhau dấu phẩy)
      const answers = q.correct_answer
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a);

      if (answers.length === 0) {
        setJsonError("Đáp án không được để trống");
        return;
      }

      newItems.push({
        id: Date.now() + Math.random(),
        vi: q.vi_text,
        imageUrl: q.image_url || "",
        answers: answers,
      });
    }

    // Thêm vào danh sách
    setItems((prev) => [...prev, ...newItems]);
    setShowImportJSON(false);
    setJsonInput("");
    setJsonError(null);
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
          <button
            className="te-add-btn"
            onClick={() => setShowImportJSON(true)}
            style={{
              marginLeft: "8px",
              backgroundColor: "#17a2b8",
              borderColor: "#17a2b8",
            }}
            title="Thêm từ mới từ JSON"
          >
            📝 Import JSON
          </button>
        </div>
        <div className="te-header-right">
          <button
            className={`te-preview-btn ${
              validItems.length > 0 ? "" : "disabled"
            }`}
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
                          onChange={(e) =>
                            handleViChange(item.id, e.target.value)
                          }
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
                              onClick={() =>
                                fileInputRefs.current[item.id]?.click()
                              }
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
                            (Enter để thêm đáp án, paste nhiều đáp án cách nhau
                            dấu phẩy)
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
                                  handleAnswerChange(
                                    item.id,
                                    ansIndex,
                                    e.target.value
                                  )
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
              💡 <strong>Mẹo:</strong> Nhấn Enter trong ô đáp án để thêm đáp án
              mới. Paste nhiều đáp án cách nhau dấu phẩy để tự động tách thành
              nhiều đáp án.
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
              <h3 style={{ margin: 0 }}>📝 Import JSON - Thêm từ mới</h3>
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
              🌟 Nút dán nhanh format mẫu với ảnh thật từ Unsplash cho vocabulary_translation.
            */}
            {(() => {
              const sampleTranslationJSON = `{
  "vi_text": "hạnh phúc",
  "image_url": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
  "correct_answer": "happy, joyful, cheerful"
}`;
              return (
                <div style={{ marginBottom: "12px" }}>
                  <button
                    onClick={() => {
                      setJsonInput(sampleTranslationJSON);
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
                Paste JSON của một từ hoặc array từ. Format: mỗi từ cần có{" "}
                <strong>vi_text</strong> (từ tiếng Việt),{" "}
                <strong>image_url</strong> (URL ảnh, có thể để trống), và{" "}
                <strong>correct_answer</strong> (đáp án tiếng Anh, có thể nhiều
                đáp án cách nhau dấu phẩy - hệ thống sẽ tự động tách và chấp
                nhận bất kỳ đáp án nào trong danh sách).
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
  "vi_text": "hạnh phúc",
  "image_url": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
  "correct_answer": "happy, joyful, cheerful"
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
                ✅ Thêm từ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

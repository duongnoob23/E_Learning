// ImageChoiceEditor.jsx - Editor đơn giản: nhập câu hỏi → upload ảnh → click chọn đáp án
import React, { useCallback, useEffect, useRef, useState } from "react";
import VocabularyImageChoice from "../../Vocabulary/VocabularyImageChoice";
import "./ImageChoiceEditor.css";

export default function ImageChoiceEditor({ data, onChange }) {
  const genId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const [questions, setQuestions] = useState([]);
  const [activeQuestionId, setActiveQuestionId] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showImportJSON, setShowImportJSON] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState(null);

  const fileInputRef = useRef(null);
  const questionImageInputRef = useRef(null);
  const questionAudioInputRef = useRef(null);
  const isInternalUpdate = useRef(false);

  // Load data từ props
  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    if (data?.questions?.length) {
      const seen = new Set();
      const qs = data.questions.map((q, idx) => {
        let qid = q.question_id || genId();
        if (seen.has(qid)) qid = genId();
        seen.add(qid);
        const derivedType = q.question_type
          ? q.question_type
          : q.question_image_url
          ? "image"
          : q.question_audio_url
          ? "audio"
          : "text";
        return {
          question_id: qid,
          vi_text: q.vi_text || "",
          question_type: derivedType,
          question_text: q.question_text || "",
          question_audio_url: q.question_audio_url || "",
          question_image_url: q.question_image_url || "",
          images: (q.images || []).map((img, i) => ({
            id: img.image_id || img.id || `img_${i + 1}`,
            url: img.image_url || img.url || "",
            isCorrect: !!img.is_correct,
          })),
        };
      });
      setQuestions(qs);
      if (
        !activeQuestionId ||
        !qs.some((q) => q.question_id === activeQuestionId)
      ) {
        setActiveQuestionId(qs[0]?.question_id || null);
      }
    } else {
      const firstId = genId();
      setQuestions([
        {
          question_id: firstId,
          vi_text: "",
          question_type: "text",
          question_text: "",
          question_audio_url: "",
          question_image_url: "",
          images: [],
        },
      ]);
      setActiveQuestionId(firstId);
    }
  }, [data]);

  const updateData = useCallback(
    (qs) => {
      isInternalUpdate.current = true;
      onChange({
        type: "vocabulary_image_choice",
        questions: qs.map((q) => ({
          question_id: q.question_id || Date.now(),
          vi_text: q.vi_text || "",
          question_type: q.question_type || "text",
          question_text:
            q.question_type === "text" ? q.question_text : undefined,
          question_audio_url:
            q.question_type === "audio" ? q.question_audio_url : undefined,
          question_image_url:
            q.question_type === "image" ? q.question_image_url : undefined,
          images: (q.images || []).map((img) => ({
            image_id: img.id,
            image_url: img.url,
            is_correct: img.isCorrect,
          })),
        })),
      });
    },
    [onChange]
  );

  const updateActiveQuestion = (updater) => {
    setQuestions((prev) => {
      const idx = prev.findIndex((q) => q.question_id === activeQuestionId);
      if (idx === -1) return prev;
      const next = [...prev];
      next[idx] = updater(prev[idx]);
      updateData(next);
      return next;
    });
  };

  const handleAddQuestion = () => {
    setQuestions((prev) => {
      const newId = genId();
      const next = [
        ...prev,
        {
          question_id: newId,
          vi_text: "",
          question_type: "text",
          question_text: "",
          question_audio_url: "",
          question_image_url: "",
          images: [],
        },
      ];
      updateData(next);
      setActiveQuestionId(newId);
      return next;
    });
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
      if (!q.images || !Array.isArray(q.images)) {
        setJsonError("Câu hỏi thiếu trường 'images' (array)");
        return;
      }

      // Xác định question type
      let questionType = "text";
      if (q.question_audio_url) questionType = "audio";
      else if (q.question_image_url) questionType = "image";

      // Convert images
      const images = q.images.map((img, idx) => ({
        id: img.image_id || img.id || `img_${Date.now()}_${idx}`,
        url: img.image_url || img.url || "",
        isCorrect: img.is_correct || false,
      }));

      newQuestions.push({
        question_id: q.question_id || genId(),
        vi_text: q.vi_text || "",
        question_type: questionType,
        question_text: q.question_text || "",
        question_audio_url: q.question_audio_url || "",
        question_image_url: q.question_image_url || "",
        images: images,
      });
    }

    // Thêm vào danh sách
    setQuestions((prev) => {
      const updated = [...prev, ...newQuestions];
      setActiveQuestionId(updated[updated.length - 1].question_id);
      updateData(updated);
      return updated;
    });
    
    setShowImportJSON(false);
    setJsonInput("");
    setJsonError(null);
  };

  const handleRemoveQuestion = (idx) => {
    setQuestions((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      updateData(next);

      if (!next.length) {
        const firstId = genId();
        const fallback = [
          {
            question_id: firstId,
            vi_text: "",
            question_type: "text",
            question_text: "",
            question_audio_url: "",
            question_image_url: "",
            images: [],
          },
        ];
        updateData(fallback);
        setActiveQuestionId(firstId);
        return fallback;
      }

      if (prev[idx]?.question_id === activeQuestionId) {
        const nextIdx = Math.min(idx, next.length - 1);
        setActiveQuestionId(next[nextIdx].question_id);
      }

      return next.length ? next : prev;
    });
  };

  const activeIndex = questions.findIndex(
    (q) => q.question_id === activeQuestionId
  );
  const resolvedIndex = activeIndex >= 0 ? activeIndex : 0;
  const currentQuestion = questions[resolvedIndex];

  // Validate question
  const validateQuestion = (q) => {
    const errors = [];
    if (!q.vi_text.trim()) errors.push("Thiếu câu tiếng Việt");
    if (q.question_type === "text" && !q.question_text.trim()) {
      errors.push("Thiếu câu hỏi (text)");
    }
    if (q.question_type === "audio" && !q.question_audio_url) {
      errors.push("Thiếu audio");
    }
    if (q.question_type === "image" && !q.question_image_url) {
      errors.push("Thiếu ảnh câu hỏi");
    }
    const validImages = q.images.filter((img) => img.url);
    if (validImages.length < 2) {
      errors.push("Cần ít nhất 2 ảnh");
    }
    const correctCount = q.images.filter((img) => img.isCorrect).length;
    if (correctCount !== 1) {
      errors.push("Phải có đúng 1 đáp án đúng");
    }
    return errors;
  };

  // Toggle preview
  const handleTogglePreview = () => {
    if (!currentQuestion) return;
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
            question_id: currentQuestion.question_id,
            vi_text: currentQuestion.vi_text,
            question_type: currentQuestion.question_type,
            question_text: currentQuestion.question_text,
            question_audio_url: currentQuestion.question_audio_url,
            question_image_url: currentQuestion.question_image_url,
            images: currentQuestion.images.map((img) => ({
              image_id: img.id,
              image_url: img.url,
              is_correct: img.isCorrect,
            })),
          },
        ],
      },
    };
  };
  const activeQ = questions[resolvedIndex] || {};
  const questionType = activeQ.question_type || "text";
  const questionText = activeQ.question_text || "";
  const questionAudioUrl = activeQ.question_audio_url || "";
  const questionImageUrl = activeQ.question_image_url || "";
  const viText = activeQ.vi_text || "";
  const images = activeQ.images || [];

  // Handle question type change - chỉ set state, không block
  const handleQuestionTypeChange = (type) => {
    updateActiveQuestion((q) => ({
      ...q,
      question_type: type,
      question_text: type === "text" ? q.question_text : "",
      question_audio_url: type === "audio" ? q.question_audio_url : "",
      question_image_url: type === "image" ? q.question_image_url : "",
      // reset images when switching type? giữ lại để user không mất đáp án
    }));
  };

  // Handle question text change
  const handleQuestionTextChange = (e) => {
    updateActiveQuestion((q) => ({ ...q, question_text: e.target.value }));
  };

  // Handle vi_text change
  const handleViTextChange = (e) => {
    updateActiveQuestion((q) => ({ ...q, vi_text: e.target.value }));
  };

  // Handle question audio upload
  const handleQuestionAudioUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      alert("Vui lòng chọn file audio");
      return;
    }

    const url = URL.createObjectURL(file);
    updateActiveQuestion((q) => ({ ...q, question_audio_url: url }));
  };

  // Handle question image upload
  const handleQuestionImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh");
      return;
    }

    const url = URL.createObjectURL(file);
    updateActiveQuestion((q) => ({ ...q, question_image_url: url }));
  };

  // Handle multiple images upload
  const handleImagesUpload = (e) => {
    const files = Array.from(e.target.files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (files.length === 0) {
      alert("Vui lòng chọn file ảnh");
      return;
    }

    const newImages = files.map((file, index) => {
      const id = `img_${Date.now()}_${index}`;
      return {
        id,
        url: URL.createObjectURL(file),
        isCorrect: false,
      };
    });

    updateActiveQuestion((q) => ({
      ...q,
      images: [...(q.images || []), ...newImages],
    }));
  };

  // Handle click chọn đáp án đúng
  const handleToggleCorrect = (imageId) => {
    updateActiveQuestion((q) => ({
      ...q,
      images: (q.images || []).map((img) => ({
        ...img,
        isCorrect: img.id === imageId, // Chỉ cho phép 1 đáp án đúng
      })),
    }));
  };

  // Handle remove image
  const handleRemoveImage = (imageId) => {
    updateActiveQuestion((q) => ({
      ...q,
      images: (q.images || []).filter((img) => img.id !== imageId),
    }));
  };

  const errors = currentQuestion ? validateQuestion(currentQuestion) : [];

  return (
    <div className="image-choice-editor">
      {/* Tabs câu hỏi */}
      <div className="ice-question-tabs">
        <div className="ice-question-list">
          {questions.map((q, idx) => (
            <button
              key={q.question_id || idx}
              className={`ice-question-tab ${
                q.question_id === activeQuestionId ? "active" : ""
              }`}
              onClick={() => setActiveQuestionId(q.question_id)}
            >
              Câu {idx + 1}
            </button>
          ))}
          <button className="ice-add-question" onClick={handleAddQuestion}>
            + Thêm câu
          </button>
          <button
            className="ice-add-question"
            onClick={() => setShowImportJSON(true)}
            style={{
              marginLeft: "8px",
              backgroundColor: "#17a2b8",
              borderColor: "#17a2b8",
            }}
            title="Thêm câu hỏi từ JSON"
          >
            📝 Import JSON
          </button>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {questions.length > 1 && (
            <button
              className="ice-remove-question"
              onClick={() => handleRemoveQuestion(activeIndex)}
              title="Xóa câu hiện tại"
            >
              🗑 Xóa câu này
            </button>
          )}
          <button
            className={`ice-add-question ${
              errors.length === 0 ? "" : "disabled"
            }`}
            onClick={handleTogglePreview}
            disabled={errors.length > 0}
            style={{
              backgroundColor: errors.length === 0 ? "#28a745" : "#6c757d",
              borderColor: errors.length === 0 ? "#28a745" : "#6c757d",
            }}
          >
            {showPreview ? "✕ Đóng Preview" : "👁 Preview"}
          </button>
        </div>
      </div>

      {showPreview ? (
        /* Preview mode */
        <div className="ice-preview-container">
          <div className="ice-preview-header">
            <span>Preview: Câu {resolvedIndex + 1}</span>
            <button
              className="ice-close-preview"
              onClick={() => setShowPreview(false)}
            >
              ✕
            </button>
          </div>
          <div className="ice-preview-content">
            <VocabularyImageChoice lesson={getPreviewLessonData()} />
          </div>
        </div>
      ) : (
        /* Editor mode */
        <>

      {/* Câu tiếng Việt */}
      <div className="ice-field">
        <label className="ice-label">Đáp án tiếng Việt *</label>
        <input
          type="text"
          value={activeQ.vi_text || ""}
          onChange={handleViTextChange}
          className="ice-input"
          placeholder="Ví dụ: Táo"
        />
      </div>

      {/* Loại câu hỏi */}
      <div className="ice-field">
        <label className="ice-label">Loại câu hỏi</label>
        <div className="ice-type-tabs">
          <button
            className={`ice-tab ${questionType === "text" ? "active" : ""}`}
            onClick={() => handleQuestionTypeChange("text")}
          >
            📝 Text
          </button>
          <button
            className={`ice-tab ${questionType === "audio" ? "active" : ""}`}
            onClick={() => handleQuestionTypeChange("audio")}
          >
            🎧 Audio
          </button>
          <button
            className={`ice-tab ${questionType === "image" ? "active" : ""}`}
            onClick={() => handleQuestionTypeChange("image")}
          >
            🖼️ Image
          </button>
        </div>
      </div>

      {/* Nhập câu hỏi */}
      <div className="ice-field">
        {questionType === "text" && (
          <>
            <label className="ice-label">Câu hỏi (Tiếng Anh) *</label>
            <input
              type="text"
              value={questionText}
              onChange={handleQuestionTextChange}
              className="ice-input"
              placeholder="Ví dụ: Apple"
            />
          </>
        )}

        {questionType === "audio" && (
          <>
            <label className="ice-label">File âm thanh *</label>
            <div className="ice-upload">
              <input
                ref={questionAudioInputRef}
                type="file"
                accept="audio/*"
                onChange={handleQuestionAudioUpload}
                className="ice-file-input"
              />
              <button
                className="ice-btn"
                onClick={() => questionAudioInputRef.current?.click()}
              >
                📤 Upload MP3
              </button>
              {questionAudioUrl && (
                <audio
                  controls
                  src={questionAudioUrl}
                  style={{ marginTop: "8px", width: "100%" }}
                />
              )}
            </div>
          </>
        )}

        {questionType === "image" && (
          <>
            <label className="ice-label">Hình ảnh câu hỏi *</label>
            <div className="ice-upload">
              <input
                ref={questionImageInputRef}
                type="file"
                accept="image/*"
                onChange={handleQuestionImageUpload}
                className="ice-file-input"
              />
              <button
                className="ice-btn"
                onClick={() => questionImageInputRef.current?.click()}
              >
                📤 Upload Ảnh
              </button>
              {questionImageUrl && (
                <img
                  src={questionImageUrl}
                  alt="Question"
                  style={{
                    marginTop: "8px",
                    maxWidth: "200px",
                    borderRadius: "4px",
                  }}
                />
              )}
            </div>
          </>
        )}
      </div>

      {/* Upload và chọn đáp án */}
      <div className="ice-field">
        <label className="ice-label">Đáp án (Hình ảnh) *</label>
        <div className="ice-upload">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagesUpload}
            className="ice-file-input"
          />
          <button
            className="ice-btn ice-btn-primary"
            onClick={() => fileInputRef.current?.click()}
          >
            📤 Upload nhiều ảnh
          </button>
        </div>

        {images.length > 0 && (
          <div className="ice-images-grid">
            {images.map((img) => (
              <div
                key={img.id}
                className={`ice-image-card ${img.isCorrect ? "correct" : ""}`}
                onClick={() => handleToggleCorrect(img.id)}
              >
                <img src={img.url} alt="Option" />
                {img.isCorrect && <div className="ice-check-mark">✓</div>}
                <button
                  className="ice-remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(img.id);
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {images.length === 0 && (
          <p className="ice-hint">
            💡 Upload ảnh, sau đó click vào ảnh để chọn đáp án đúng
          </p>
        )}
      </div>
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
              <h3 style={{ margin: 0 }}>📝 Import JSON - Thêm câu hỏi</h3>
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
              <p style={{ margin: "0 0 8px 0", color: "#666", lineHeight: "1.6" }}>
                Paste JSON của một câu hỏi hoặc array câu hỏi. Format: mỗi câu hỏi cần có{" "}
                <strong>images</strong> (array các ảnh), và có thể có{" "}
                <strong>question_text</strong> (text), <strong>question_audio_url</strong> (audio), hoặc{" "}
                <strong>question_image_url</strong> (image). Mỗi image cần có{" "}
                <strong>image_url</strong> và <strong>is_correct</strong> (true/false). Chỉ có 1 image được đánh dấu{" "}
                <strong>is_correct: true</strong>.
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
  "vi_text": "Chọn ảnh mô tả 'happy'",
  "question_type": "text",
  "question_text": "Which image shows 'happy'?",
  "images": [
    {
      "image_id": 1,
      "image_url": "https://example.com/happy.jpg",
      "is_correct": true
    },
    {
      "image_id": 2,
      "image_url": "https://example.com/sad.jpg",
      "is_correct": false
    },
    {
      "image_id": 3,
      "image_url": "https://example.com/angry.jpg",
      "is_correct": false
    },
    {
      "image_id": 4,
      "image_url": "https://example.com/excited.jpg",
      "is_correct": false
    }
  ]
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
                ✅ Thêm câu hỏi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

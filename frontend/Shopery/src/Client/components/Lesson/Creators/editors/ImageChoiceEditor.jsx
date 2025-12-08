// ImageChoiceEditor.jsx - Editor đơn giản: nhập câu hỏi → upload ảnh → click chọn đáp án
import React, { useCallback, useEffect, useRef, useState } from "react";
import "./ImageChoiceEditor.css";

export default function ImageChoiceEditor({ data, onChange }) {
  const genId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const [questions, setQuestions] = useState([]);
  const [activeQuestionId, setActiveQuestionId] = useState(null);

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
  }, [data, activeQuestionId]);

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
        </div>
        {questions.length > 1 && (
          <button
            className="ice-remove-question"
            onClick={() => handleRemoveQuestion(activeIndex)}
            title="Xóa câu hiện tại"
          >
            🗑 Xóa câu này
          </button>
        )}
      </div>

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
    </div>
  );
}

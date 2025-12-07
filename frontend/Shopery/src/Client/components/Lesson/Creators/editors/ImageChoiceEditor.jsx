// ImageChoiceEditor.jsx - Editor đơn giản: nhập câu hỏi → upload ảnh → click chọn đáp án
import React, { useCallback, useEffect, useRef, useState } from "react";
import "./ImageChoiceEditor.css";

export default function ImageChoiceEditor({ data, onChange }) {
  const [questionType, setQuestionType] = useState("text"); // "text" | "audio" | "image"
  const [questionText, setQuestionText] = useState("");
  const [questionAudioUrl, setQuestionAudioUrl] = useState("");
  const [questionImageUrl, setQuestionImageUrl] = useState("");
  const [viText, setViText] = useState(""); // Đáp án tiếng Việt
  const [images, setImages] = useState([]); // [{ id, url, isCorrect }]
  const fileInputRef = useRef(null);
  const questionImageInputRef = useRef(null);
  const questionAudioInputRef = useRef(null);
  const isInitialMount = useRef(true);

  // Load data từ props
  useEffect(() => {
    if (!data || !data.questions || data.questions.length === 0) {
      if (isInitialMount.current) {
        setQuestionText("");
        setQuestionAudioUrl("");
        setQuestionImageUrl("");
        setViText("");
        setImages([]);
        setQuestionType("text");
        isInitialMount.current = false;
      }
      return;
    }

    const question = data.questions[0];

    // Load vi_text
    setViText(question.vi_text || "");

    // Xác định question type
    if (question.question_image_url) {
      setQuestionType("image");
      setQuestionImageUrl(question.question_image_url);
    } else if (question.question_audio_url) {
      setQuestionType("audio");
      setQuestionAudioUrl(question.question_audio_url);
    } else {
      setQuestionType("text");
      setQuestionText(question.question_text || "");
    }

    // Load images
    if (question.images && Array.isArray(question.images)) {
      const loadedImages = question.images.map((img, index) => ({
        id: img.image_id || img.id || `img_${index + 1}`,
        url: img.image_url || img.url || "",
        isCorrect: img.is_correct || false,
      }));
      setImages(loadedImages);
    }

    isInitialMount.current = false;
  }, [data]);

  // Update data và gửi lên parent (dùng useCallback để tránh re-render)
  const updateData = useCallback(() => {
    // Không update nếu đang trong quá trình load data
    if (isInitialMount.current) return;

    const questionId = data?.questions?.[0]?.question_id || Date.now();

    const questionObj = {
      question_id: questionId,
      vi_text: viText,
    };

    if (questionType === "text") {
      questionObj.question_text = questionText;
    } else if (questionType === "audio") {
      questionObj.question_audio_url = questionAudioUrl;
    } else if (questionType === "image") {
      questionObj.question_image_url = questionImageUrl;
    }

    const imagesData = images.map((img) => ({
      image_id: img.id,
      image_url: img.url,
      is_correct: img.isCorrect,
    }));

    questionObj.images = imagesData;

    onChange({
      type: "vocabulary_image_choice",
      questions: [questionObj],
    });
  }, [
    questionType,
    questionText,
    questionAudioUrl,
    questionImageUrl,
    viText,
    images,
    data,
    onChange,
  ]);

  // Debounce updateData để tránh gọi quá nhiều
  useEffect(() => {
    if (isInitialMount.current) return;

    const timer = setTimeout(() => {
      updateData();
    }, 150);

    return () => clearTimeout(timer);
  }, [
    questionText,
    questionAudioUrl,
    questionImageUrl,
    viText,
    images,
    questionType,
    updateData,
  ]);

  // Handle question type change - chỉ set state, không block
  const handleQuestionTypeChange = (type) => {
    setQuestionType(type);
  };

  // Handle question text change
  const handleQuestionTextChange = (e) => {
    setQuestionText(e.target.value);
  };

  // Handle vi_text change
  const handleViTextChange = (e) => {
    setViText(e.target.value);
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
    setQuestionAudioUrl(url);
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
    setQuestionImageUrl(url);
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

    setImages((prev) => [...prev, ...newImages]);
  };

  // Handle click chọn đáp án đúng
  const handleToggleCorrect = (imageId) => {
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        isCorrect: img.id === imageId, // Chỉ cho phép 1 đáp án đúng
      }))
    );
  };

  // Handle remove image
  const handleRemoveImage = (imageId) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  return (
    <div className="image-choice-editor">
      {/* Câu tiếng Việt */}
      <div className="ice-field">
        <label className="ice-label">Đáp án tiếng Việt *</label>
        <input
          type="text"
          value={viText}
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

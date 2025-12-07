// VocabularyListEditor.jsx - Editor cho dạng bài Vocabulary List
// Danh sách từ vựng với flashcard mode
import React, { useState, useRef, useEffect, useCallback } from "react";
import VocabularyList from "../../Vocabulary/VocabularyList";
import "./VocabularyListEditor.css";

export default function VocabularyListEditor({ data, onChange }) {
  const [words, setWords] = useState([]); // [{ id, en, vi, pronunciation, audioUrl, imageUrl, example }]
  const [displayMode, setDisplayMode] = useState("list"); // "list" hoặc "flashcard"
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRefs = useRef({});
  const imageInputRefs = useRef({});
  const isInitialMount = useRef(true);

  // Khởi tạo: không load data có sẵn, tạo word mới
  useEffect(() => {
    if (isInitialMount.current) {
      if (words.length === 0) {
        setWords([
          {
            id: Date.now(),
            en: "",
            vi: "",
            pronunciation: "",
            audioUrl: "",
            imageUrl: "",
            example: "",
          },
        ]);
      }
      isInitialMount.current = false;
    }
  }, []); // Chỉ chạy 1 lần khi mount

  // Update data và gửi lên parent
  const updateData = useCallback(() => {
    if (isInitialMount.current) return;

    const wordsData = words
      .filter((w) => w.en.trim() && w.vi.trim())
      .map((word) => ({
        word_id: word.id,
        en: word.en.trim(),
        vi: word.vi.trim(),
        pronunciation: word.pronunciation.trim() || undefined,
        audio_url: word.audioUrl || undefined,
        image_url: word.imageUrl || undefined,
        example: word.example.trim() || undefined,
      }));

    onChange({
      type: "vocabulary_list",
      words: wordsData,
      display_mode: displayMode,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words, displayMode]); // Bỏ onChange để tránh vòng lặp

  // Debounce updateData
  useEffect(() => {
    if (isInitialMount.current) return;

    const timer = setTimeout(() => {
      updateData();
    }, 150);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words, displayMode]); // Bỏ updateData để tránh vòng lặp

  // Thêm word mới
  const handleAddWord = () => {
    const newWord = {
      id: Date.now(),
      en: "",
      vi: "",
      pronunciation: "",
      audioUrl: "",
      imageUrl: "",
      example: "",
    };
    setWords((prev) => [...prev, newWord]);
  };

  // Xóa word
  const handleRemoveWord = (wordId) => {
    setWords((prev) => prev.filter((w) => w.id !== wordId));
  };

  // Update word field
  const handleWordChange = (wordId, field, value) => {
    setWords((prev) =>
      prev.map((w) => (w.id === wordId ? { ...w, [field]: value } : w))
    );
  };

  // Upload audio
  const handleAudioUpload = (wordId, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      alert("Vui lòng chọn file audio");
      return;
    }

    const url = URL.createObjectURL(file);
    handleWordChange(wordId, "audioUrl", url);
  };

  // Upload image
  const handleImageUpload = (wordId, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh");
      return;
    }

    const url = URL.createObjectURL(file);
    handleWordChange(wordId, "imageUrl", url);
  };

  // Remove image
  const handleRemoveImage = (wordId) => {
    handleWordChange(wordId, "imageUrl", "");
  };

  // Validate word
  const validateWord = (word) => {
    const errors = [];
    if (!word.en.trim()) errors.push("Thiếu từ tiếng Anh");
    if (!word.vi.trim()) errors.push("Thiếu nghĩa tiếng Việt");
    return errors;
  };

  // Toggle preview
  const handleTogglePreview = () => {
    const validWords = words.filter((w) => validateWord(w).length === 0);
    if (validWords.length === 0) {
      alert("Vui lòng nhập ít nhất 1 từ đầy đủ (EN + VI) để preview");
      return;
    }
    setShowPreview(!showPreview);
  };

  // Tạo lesson data cho preview
  const getPreviewLessonData = () => {
    const validWords = words.filter((w) => validateWord(w).length === 0);
    if (validWords.length === 0) return null;

    return {
      title: "Vocabulary List",
      lesson_data: {
        words: validWords.map((word) => ({
          word_id: word.id,
          en: word.en.trim(),
          vi: word.vi.trim(),
          pronunciation: word.pronunciation.trim() || undefined,
          audio_url: word.audioUrl || undefined,
          image_url: word.imageUrl || undefined,
          example: word.example.trim() || undefined,
        })),
        display_mode: displayMode,
      },
    };
  };

  const validWords = words.filter((w) => validateWord(w).length === 0);

  return (
    <div className="vocabulary-list-editor">
      {/* Header */}
      <div className="vle-header">
        <div className="vle-header-left">
          <h3 className="vle-title">Vocabulary List</h3>
          <button className="vle-add-btn" onClick={handleAddWord}>
            + Thêm từ mới
          </button>
        </div>
        <div className="vle-header-right">
          <div className="vle-display-mode">
            <label className="vle-label">Chế độ hiển thị:</label>
            <select
              value={displayMode}
              onChange={(e) => setDisplayMode(e.target.value)}
              className="vle-select"
            >
              <option value="list">📋 Danh sách</option>
              <option value="flashcard">🃏 Flashcard</option>
            </select>
          </div>
          <button
            className={`vle-preview-btn ${validWords.length > 0 ? "" : "disabled"}`}
            onClick={handleTogglePreview}
            disabled={validWords.length === 0}
          >
            {showPreview ? "✕ Đóng Preview" : "👁 Preview"}
          </button>
        </div>
      </div>

      {showPreview ? (
        /* Preview mode */
        <div className="vle-preview-container">
          <div className="vle-preview-header">
            <span>Preview: {displayMode === "list" ? "Danh sách" : "Flashcard"}</span>
            <button
              className="vle-close-preview"
              onClick={() => setShowPreview(false)}
            >
              ✕
            </button>
          </div>
          <div className="vle-preview-content">
            {getPreviewLessonData() ? (
              <VocabularyList lesson={getPreviewLessonData()} />
            ) : (
              <div className="vle-empty">
                <p>Không có từ hợp lệ để preview</p>
              </div>
            )}
          </div>
        </div>
      ) : words.length === 0 ? (
        <div className="vle-empty">
          <p>Chưa có từ nào. Nhấn "Thêm từ mới" để bắt đầu.</p>
        </div>
      ) : (
        /* Editor mode */
        <div className="vle-words-list">
          {words.map((word, index) => {
            const errors = validateWord(word);
            const isValid = errors.length === 0;

            return (
              <div
                key={word.id}
                className={`vle-word-card ${isValid ? "" : "has-errors"}`}
              >
                <div className="vle-word-header">
                  <span className="vle-word-number">
                    Từ #{index + 1} {isValid && "✅"}
                  </span>
                  <button
                    className="vle-word-remove"
                    onClick={() => handleRemoveWord(word.id)}
                    title="Xóa từ"
                  >
                    🗑️ Xóa
                  </button>
                </div>

                {/* Errors */}
                {errors.length > 0 && (
                  <div className="vle-word-errors">
                    {errors.map((error, idx) => (
                      <span key={idx} className="vle-error">
                        ⚠️ {error}
                      </span>
                    ))}
                  </div>
                )}

                <div className="vle-word-content">
                  {/* English word */}
                  <div className="vle-word-field">
                    <label className="vle-label">
                      English word <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      value={word.en}
                      onChange={(e) =>
                        handleWordChange(word.id, "en", e.target.value)
                      }
                      className="vle-input"
                      placeholder="Ví dụ: happy"
                    />
                  </div>

                  {/* Vietnamese meaning */}
                  <div className="vle-word-field">
                    <label className="vle-label">
                      Vietnamese meaning <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      value={word.vi}
                      onChange={(e) =>
                        handleWordChange(word.id, "vi", e.target.value)
                      }
                      className="vle-input"
                      placeholder="Ví dụ: vui mừng"
                    />
                  </div>

                  {/* Pronunciation */}
                  <div className="vle-word-field">
                    <label className="vle-label">Pronunciation</label>
                    <input
                      type="text"
                      value={word.pronunciation}
                      onChange={(e) =>
                        handleWordChange(word.id, "pronunciation", e.target.value)
                      }
                      className="vle-input"
                      placeholder="Ví dụ: /ˈhæpi/"
                    />
                  </div>

                  {/* Audio */}
                  <div className="vle-word-field">
                    <label className="vle-label">Audio (MP3)</label>
                    <div className="vle-audio-upload">
                      <input
                        ref={(el) => (fileInputRefs.current[word.id] = el)}
                        type="file"
                        accept="audio/*"
                        onChange={(e) => handleAudioUpload(word.id, e)}
                        className="vle-file-input"
                      />
                      {!word.audioUrl ? (
                        <button
                          className="vle-upload-btn"
                          onClick={() => fileInputRefs.current[word.id]?.click()}
                        >
                          📤 Upload audio
                        </button>
                      ) : (
                        <div className="vle-audio-preview">
                          <audio controls>
                            <source src={word.audioUrl} type="audio/mpeg" />
                          </audio>
                          <button
                            className="vle-audio-remove"
                            onClick={() => handleWordChange(word.id, "audioUrl", "")}
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Image */}
                  <div className="vle-word-field">
                    <label className="vle-label">Image</label>
                    <div className="vle-image-upload">
                      <input
                        ref={(el) => (imageInputRefs.current[word.id] = el)}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(word.id, e)}
                        className="vle-file-input"
                      />
                      {!word.imageUrl ? (
                        <button
                          className="vle-upload-btn"
                          onClick={() => imageInputRefs.current[word.id]?.click()}
                        >
                          📤 Upload image
                        </button>
                      ) : (
                        <div className="vle-image-preview">
                          <img src={word.imageUrl} alt={word.en} />
                          <button
                            className="vle-image-remove"
                            onClick={() => handleRemoveImage(word.id)}
                            title="Xóa ảnh"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Example */}
                  <div className="vle-word-field">
                    <label className="vle-label">Example sentence</label>
                    <textarea
                      value={word.example}
                      onChange={(e) =>
                        handleWordChange(word.id, "example", e.target.value)
                      }
                      className="vle-textarea"
                      placeholder="Ví dụ: I am very happy today."
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Hint */}
      {words.length > 0 && !showPreview && (
        <div className="vle-hint">
          💡 <strong>Lưu ý:</strong> Mỗi từ cần có English word và Vietnamese meaning (bắt buộc).
          Các trường khác (pronunciation, audio, image, example) là tùy chọn nhưng sẽ làm phong phú
          nội dung học tập.
        </div>
      )}
    </div>
  );
}


// VocabularyListEditor.jsx - Editor cho dạng bài Vocabulary List
// Danh sách từ vựng với flashcard mode
import { useCallback, useEffect, useRef, useState } from "react";
import {
  HiCheck,
  HiClipboardDocument,
  HiDocumentText,
  HiEye,
  HiPlus,
  HiTrash,
  HiXMark,
} from "react-icons/hi2";
import VocabularyList from "../../Vocabulary/VocabularyList";
import "./VocabularyListEditor.css";

export default function VocabularyListEditor({ data, onChange }) {
  const [words, setWords] = useState([]); // [{ id, en, vi, pronunciation, audioUrl, imageUrl, example }]
  const [displayMode, setDisplayMode] = useState("list"); // "list" hoặc "flashcard"
  const [showPreview, setShowPreview] = useState(false);
  const [showImportJSON, setShowImportJSON] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState(null);
  const fileInputRefs = useRef({});
  const imageInputRefs = useRef({});
  const isInitialMount = useRef(true);
  const hasLoadedData = useRef(false);

  // Load dữ liệu từ data prop khi có (khi edit)
  useEffect(() => {
    if (
      data?.words &&
      Array.isArray(data.words) &&
      data.words.length > 0 &&
      !hasLoadedData.current
    ) {
      console.log("VocabularyListEditor: Loading words from data:", data.words);
      // Chuyển đổi từ format database sang format editor
      const loadedWords = data.words.map((w) => ({
        id: w.word_id || Date.now() + Math.random(),
        en: w.en || "",
        vi: w.vi || "",
        pronunciation: w.pronunciation || "",
        audioUrl: w.audio_url || "",
        imageUrl: w.image_url || "",
        example: w.example || "",
      }));
      setWords(loadedWords);
      hasLoadedData.current = true;

      // Load display_mode nếu có
      if (data.display_mode) {
        setDisplayMode(data.display_mode);
      }
    } else if (!data?.words && words.length === 0 && isInitialMount.current) {
      // Nếu không có data, tạo word mới
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

    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, [data]); // Chạy khi data thay đổi

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

  // Thêm từ từ JSON
  const handleAddWordsFromJSON = () => {
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

    // Hỗ trợ cả object đơn lẻ, array words, hoặc object có words array
    let wordsToAdd = [];
    if (Array.isArray(jsonData)) {
      wordsToAdd = jsonData;
    } else if (jsonData.words && Array.isArray(jsonData.words)) {
      wordsToAdd = jsonData.words;
    } else if (jsonData.en || jsonData.word_id) {
      wordsToAdd = [jsonData];
    } else {
      setJsonError("JSON phải là array words hoặc object có trường 'words'");
      return;
    }

    // Validate và thêm từng từ
    const newWords = [];
    for (const w of wordsToAdd) {
      if (!w.en || !w.vi) {
        setJsonError("Từ thiếu các trường bắt buộc: en, vi");
        return;
      }

      newWords.push({
        id: w.word_id || Date.now() + Math.random(),
        en: w.en,
        vi: w.vi,
        pronunciation: w.pronunciation || "",
        audioUrl: w.audio_url || "",
        imageUrl: w.image_url || "",
        example: w.example || "",
      });
    }

    // Thêm vào danh sách
    setWords((prev) => [...prev, ...newWords]);
    setShowImportJSON(false);
    setJsonInput("");
    setJsonError(null);
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
            <HiPlus
              style={{ marginRight: "6px", width: "16px", height: "16px" }}
            />
            Thêm từ mới
          </button>
          <button
            className="vle-add-btn"
            onClick={() => setShowImportJSON(true)}
            style={{
              marginLeft: "8px",
              backgroundColor: "#17a2b8",
              borderColor: "#17a2b8",
            }}
            title="Thêm từ mới từ JSON"
          >
            <HiDocumentText
              style={{ marginRight: "6px", width: "16px", height: "16px" }}
            />
            Import JSON
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
              <option value="list">Danh sách</option>
              <option value="flashcard">Flashcard</option>
            </select>
          </div>
          <button
            className={`vle-preview-btn ${
              validWords.length > 0 ? "" : "disabled"
            }`}
            onClick={handleTogglePreview}
            disabled={validWords.length === 0}
          >
            {showPreview ? (
              <>
                <HiXMark
                  style={{ marginRight: "6px", width: "16px", height: "16px" }}
                />
                Đóng Preview
              </>
            ) : (
              <>
                <HiEye
                  style={{ marginRight: "6px", width: "16px", height: "16px" }}
                />
                Preview
              </>
            )}
          </button>
        </div>
      </div>

      {showPreview ? (
        /* Preview mode */
        <div className="vle-preview-container">
          <div className="vle-preview-header">
            <span>
              Preview: {displayMode === "list" ? "Danh sách" : "Flashcard"}
            </span>
            <button
              className="vle-close-preview"
              onClick={() => setShowPreview(false)}
            >
              <HiXMark />
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
                    Từ #{index + 1}{" "}
                    {isValid && (
                      <HiCheck
                        style={{
                          marginLeft: "6px",
                          width: "16px",
                          height: "16px",
                          color: "#10b981",
                        }}
                      />
                    )}
                  </span>
                  <button
                    className="vle-word-remove"
                    onClick={() => handleRemoveWord(word.id)}
                    title="Xóa từ"
                  >
                    <HiTrash
                      style={{
                        marginRight: "6px",
                        width: "16px",
                        height: "16px",
                      }}
                    />
                    Xóa
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
                        handleWordChange(
                          word.id,
                          "pronunciation",
                          e.target.value
                        )
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
                          onClick={() =>
                            fileInputRefs.current[word.id]?.click()
                          }
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
                            onClick={() =>
                              handleWordChange(word.id, "audioUrl", "")
                            }
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
                          onClick={() =>
                            imageInputRefs.current[word.id]?.click()
                          }
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
          💡 <strong>Lưu ý:</strong> Mỗi từ cần có English word và Vietnamese
          meaning (bắt buộc). Các trường khác (pronunciation, audio, image,
          example) là tùy chọn nhưng sẽ làm phong phú nội dung học tập.
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
              <h3
                style={{
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <HiDocumentText style={{ width: "20px", height: "20px" }} />
                Import JSON - Thêm từ mới
              </h3>
              <button
                onClick={() => setShowImportJSON(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#666",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <HiXMark style={{ width: "24px", height: "24px" }} />
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
                Paste JSON của một từ hoặc array từ. Format: mỗi từ cần có{" "}
                <strong>en</strong> (từ tiếng Anh) và <strong>vi</strong> (nghĩa
                tiếng Việt). Các trường khác như <strong>pronunciation</strong>,{" "}
                <strong>audio_url</strong>, <strong>image_url</strong>,{" "}
                <strong>example</strong> là tùy chọn.
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
                  <HiClipboardDocument
                    style={{
                      marginRight: "6px",
                      width: "16px",
                      height: "16px",
                    }}
                  />
                  Xem format mẫu
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
  "word_id": 1,
  "en": "happy",
  "vi": "vui mừng",
  "pronunciation": "/ˈhæpi/",
  "audio_url": "https://example.com/happy.mp3",
  "image_url": "https://example.com/happy.jpg",
  "example": "I am very happy today"
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
                <HiClipboardDocument
                  style={{ marginRight: "6px", width: "16px", height: "16px" }}
                />
                Paste từ Clipboard
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
                onClick={handleAddWordsFromJSON}
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

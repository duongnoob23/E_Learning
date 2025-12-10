// VocabularyListCreator.jsx - Form tạo lesson vocabulary_list
import React, { useState } from "react";
import "./CreatorForm.css";

export default function VocabularyListCreator({ onDataChange }) {
  const [displayMode, setDisplayMode] = useState("flashcard");
  const [words, setWords] = useState([
    { word_id: 1, en: "", vi: "", image_url: "", audio_url: "", example: "" },
  ]);

  const handleAddWord = () => {
    setWords([
      ...words,
      {
        word_id: Date.now(),
        en: "",
        vi: "",
        image_url: "",
        audio_url: "",
        example: "",
      },
    ]);
  };

  const handleRemoveWord = (wordId) => {
    setWords(words.filter((w) => w.word_id !== wordId));
  };

  const handleWordChange = (wordId, field, value) => {
    setWords(
      words.map((w) => (w.word_id === wordId ? { ...w, [field]: value } : w))
    );
    // Gửi dữ liệu lên parent
    const updatedWords = words.map((w) =>
      w.word_id === wordId ? { ...w, [field]: value } : w
    );
    onDataChange?.({
      type: "vocabulary_list",
      display_mode: displayMode,
      words: updatedWords,
    });
  };

  const handleDisplayModeChange = (mode) => {
    setDisplayMode(mode);
    onDataChange?.({
      type: "vocabulary_list",
      display_mode: mode,
      words: words,
    });
  };

  return (
    <div className="creator-form">
      <h4 className="creator-form-title">Tạo Lesson: Danh sách từ mới</h4>

      {/* Display Mode */}
      <div className="creator-form-group">
        <label className="creator-form-label">Chế độ hiển thị *</label>
        <div className="creator-form-radio-group">
          <label className="creator-form-radio">
            <input
              type="radio"
              value="flashcard"
              checked={displayMode === "flashcard"}
              onChange={(e) => handleDisplayModeChange(e.target.value)}
            />
            <span>Flashcard</span>
          </label>
          <label className="creator-form-radio">
            <input
              type="radio"
              value="list"
              checked={displayMode === "list"}
              onChange={(e) => handleDisplayModeChange(e.target.value)}
            />
            <span>Danh sách</span>
          </label>
        </div>
      </div>

      {/* Words List */}
      <div className="creator-form-group">
        <div className="creator-form-group-header">
          <label className="creator-form-label">Danh sách từ *</label>
          <button
            type="button"
            className="creator-form-add-btn"
            onClick={handleAddWord}
          >
            + Thêm từ
          </button>
        </div>

        {words.map((word, index) => (
          <div key={word.word_id} className="creator-form-item-card">
            <div className="creator-form-item-header">
              <span className="creator-form-item-number">Từ {index + 1}</span>
              {words.length > 1 && (
                <button
                  type="button"
                  className="creator-form-remove-btn"
                  onClick={() => handleRemoveWord(word.word_id)}
                >
                  × Xóa
                </button>
              )}
            </div>

            <div className="creator-form-grid">
              <div className="creator-form-field">
                <label>Từ tiếng Anh *</label>
                <input
                  type="text"
                  value={word.en}
                  onChange={(e) =>
                    handleWordChange(word.word_id, "en", e.target.value)
                  }
                  placeholder="happy"
                />
              </div>

              <div className="creator-form-field">
                <label>Nghĩa tiếng Việt *</label>
                <input
                  type="text"
                  value={word.vi}
                  onChange={(e) =>
                    handleWordChange(word.word_id, "vi", e.target.value)
                  }
                  placeholder="vui mừng"
                />
              </div>

              <div className="creator-form-field">
                <label>URL ảnh</label>
                <input
                  type="url"
                  value={word.image_url}
                  onChange={(e) =>
                    handleWordChange(word.word_id, "image_url", e.target.value)
                  }
                  placeholder="https://..."
                />
              </div>

              <div className="creator-form-field">
                <label>URL audio</label>
                <input
                  type="url"
                  value={word.audio_url}
                  onChange={(e) =>
                    handleWordChange(word.word_id, "audio_url", e.target.value)
                  }
                  placeholder="https://..."
                />
              </div>

              <div className="creator-form-field creator-form-field-full">
                <label>Ví dụ</label>
                <input
                  type="text"
                  value={word.example}
                  onChange={(e) =>
                    handleWordChange(word.word_id, "example", e.target.value)
                  }
                  placeholder="I am happy today"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


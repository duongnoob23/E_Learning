// MatchingEditor.jsx - Editor theo flow mới: thêm cặp (pair), không phải từng ô
import React, { useState, useRef, useEffect, useCallback } from "react";
import "./MatchingEditor.css";

export default function MatchingEditor({ data, onChange }) {
  const [pairs, setPairs] = useState([]); // [{ id, en, vi, imageUrl }]
  const fileInputRefs = useRef({}); // Lưu ref cho từng input upload ảnh
  const isInitialMount = useRef(true);

  // Load data từ props
  useEffect(() => {
    if (!data || !data.questions || data.questions.length === 0) {
      if (isInitialMount.current) {
        setPairs([]);
        isInitialMount.current = false;
      }
      return;
    }

    const question = data.questions[0];
    
    // Load pairs từ data
    if (question.pairs && Array.isArray(question.pairs)) {
      const loadedPairs = question.pairs.map((pair, index) => ({
        id: pair.pair_id || pair.id || `pair_${index + 1}`,
        en: pair.right?.text || pair.right_text || "",
        vi: pair.left?.text || pair.left_text || "",
        imageUrl: pair.left?.image || pair.left?.image_url || pair.left_image_url || "",
      }));
      setPairs(loadedPairs);
    } else {
      setPairs([]);
    }

    isInitialMount.current = false;
  }, [data]);

  // Update data và gửi lên parent
  const updateData = useCallback(() => {
    if (isInitialMount.current) return;

    const questionId = data?.questions?.[0]?.question_id || Date.now();
    
    // Convert pairs sang format của component
    const pairsData = pairs.map((pair) => ({
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

    const questionObj = {
      question_id: questionId,
      pairs: pairsData,
      grid_size: {
        rows: 4,
        cols: 4,
      },
    };

    onChange({
      type: "vocabulary_matching",
      questions: [questionObj],
    });
  }, [pairs, data, onChange]);

  // Debounce updateData
  useEffect(() => {
    if (isInitialMount.current) return;
    
    const timer = setTimeout(() => {
      updateData();
    }, 150);

    return () => clearTimeout(timer);
  }, [pairs, updateData]);

  // Thêm cặp mới
  const handleAddPair = () => {
    const newPair = {
      id: `pair_${Date.now()}`,
      en: "",
      vi: "",
      imageUrl: "",
    };
    setPairs((prev) => [...prev, newPair]);
  };

  // Xóa cặp
  const handleRemovePair = (pairId) => {
    setPairs((prev) => prev.filter((p) => p.id !== pairId));
  };

  // Update EN
  const handleEnChange = (pairId, value) => {
    setPairs((prev) =>
      prev.map((p) => (p.id === pairId ? { ...p, en: value } : p))
    );
  };

  // Update VI
  const handleViChange = (pairId, value) => {
    setPairs((prev) =>
      prev.map((p) => (p.id === pairId ? { ...p, vi: value } : p))
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
    setPairs((prev) =>
      prev.map((p) => (p.id === pairId ? { ...p, imageUrl: url } : p))
    );
  };

  // Xóa ảnh
  const handleRemoveImage = (pairId) => {
    setPairs((prev) =>
      prev.map((p) => (p.id === pairId ? { ...p, imageUrl: "" } : p))
    );
  };

  return (
    <div className="matching-editor">
      {/* Header */}
      <div className="me-header">
        <h3 className="me-title">Tìm cặp: Cảm xúc</h3>
        <button className="me-add-btn" onClick={handleAddPair}>
          + Thêm cặp mới
        </button>
      </div>

      {/* Danh sách các cặp */}
      {pairs.length === 0 ? (
        <div className="me-empty">
          <p>Chưa có cặp nào. Nhấn "Thêm cặp mới" để bắt đầu.</p>
        </div>
      ) : (
        <div className="me-pairs-list">
          {pairs.map((pair, index) => (
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
      {pairs.length > 0 && (
        <div className="me-hint">
          💡 <strong>Lưu ý:</strong> Hệ thống sẽ tự động trộn các ô và tạo lưới cho học viên.
          Bạn chỉ cần nhập các cặp từ vựng.
        </div>
      )}
    </div>
  );
}


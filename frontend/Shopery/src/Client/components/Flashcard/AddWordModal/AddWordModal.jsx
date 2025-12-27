// Client/components/Flashcard/AddWordModal/AddWordModal.jsx
import React, { useState, useEffect, useRef } from "react";
import { wordApi } from "../../../api/Word/wordApi";
import "./AddWordModal.css";

const AddWordModal = ({ isOpen, onClose, onSubmit, topicId, existingWords = [] }) => {
  const [formData, setFormData] = useState({
    word: "",
    type: "noun",
    pronunciation: "",
    definition: "",
    exampleEn: "",
    exampleVi: "",
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [isSearching, setIsSearching] = useState(false);
  const [foundWord, setFoundWord] = useState(null);
  const searchTimeoutRef = useRef(null);

  const wordTypes = [
    { value: "noun", label: "Danh từ" },
    { value: "verb", label: "Động từ" },
    { value: "adjective", label: "Tính từ" },
    { value: "adverb", label: "Trạng từ" },
    { value: "pronoun", label: "Đại từ" },
    { value: "preposition", label: "Giới từ" },
    { value: "conjunction", label: "Liên từ" },
    { value: "interjection", label: "Thán từ" },
  ];

  // Tìm từ trong hệ thống khi user nhập
  const searchWord = async (wordName) => {
    if (!wordName || wordName.trim().length < 2) {
      setFoundWord(null);
      // Reset các trường nếu user xóa text
      setFormData((prev) => ({
        ...prev,
        pronunciation: "",
        definition: "",
        exampleEn: "",
        exampleVi: "",
        type: "noun",
      }));
      return;
    }

    setIsSearching(true);
    try {
      const result = await wordApi.findWordByName(wordName.trim());
      if (result.EC === "0" && result.DT) {
        // Tìm thấy từ, auto-fill các trường
        const word = result.DT;
        setFoundWord(word);
        
        // Chỉ auto-fill nếu các trường đang trống
        setFormData((prev) => ({
          ...prev,
          pronunciation: prev.pronunciation || word.pronunciation || "",
          definition: prev.definition || word.meaning_vi || "",
          exampleEn: prev.exampleEn || word.example_en || "",
          exampleVi: prev.exampleVi || word.example_vi || "",
          type: prev.type || mapPartOfSpeech(word.part_of_speech) || "noun",
        }));
      } else {
        setFoundWord(null);
        // Reset các trường nếu không tìm thấy từ
        setFormData((prev) => ({
          ...prev,
          pronunciation: "",
          definition: "",
          exampleEn: "",
          exampleVi: "",
          type: "noun",
        }));
      }
    } catch (error) {
      console.error("Error searching word:", error);
      setFoundWord(null);
      // Reset các trường khi có lỗi
      setFormData((prev) => ({
        ...prev,
        pronunciation: "",
        definition: "",
        exampleEn: "",
        exampleVi: "",
        type: "noun",
      }));
    } finally {
      setIsSearching(false);
    }
  };

  // Map part_of_speech từ database sang form type
  const mapPartOfSpeech = (pos) => {
    if (!pos) return "noun";
    const posLower = pos.toLowerCase();
    const mapping = {
      "noun": "noun",
      "verb": "verb",
      "adjective": "adjective",
      "adverb": "adverb",
      "pronoun": "pronoun",
      "preposition": "preposition",
      "conjunction": "conjunction",
      "interjection": "interjection",
    };
    return mapping[posLower] || "noun";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Nếu đang nhập trường "word", tìm kiếm từ sau 500ms
    if (name === "word") {
      // Clear timeout trước đó
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Set timeout mới
      searchTimeoutRef.current = setTimeout(() => {
        searchWord(value);
      }, 500);
    }
  };

  // Cleanup timeout khi component unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Reset form khi modal đóng
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        word: "",
        type: "noun",
        pronunciation: "",
        definition: "",
        exampleEn: "",
        exampleVi: "",
        image: null,
      });
      setFoundWord(null);
      setErrors({});
      setIsSearching(false);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    }
  }, [isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.word.trim()) {
      newErrors.word = "Từ không được để trống";
    } else {
      // Kiểm tra từ trùng trong danh sách hiện tại
      const wordLower = formData.word.trim().toLowerCase();
      const isDuplicate = existingWords.some(
        (word) => word.word && word.word.toLowerCase() === wordLower
      );
      
      if (isDuplicate) {
        newErrors.word = "Từ này đã tồn tại trong danh sách";
      }
    }

    if (!formData.pronunciation.trim()) {
      newErrors.pronunciation = "Phiên âm không được để trống";
    }

    if (!formData.definition.trim()) {
      newErrors.definition = "Định nghĩa không được để trống";
    }

    if (!formData.exampleEn.trim()) {
      newErrors.exampleEn = "Ví dụ tiếng Anh không được để trống";
    }

    if (!formData.exampleVi.trim()) {
      newErrors.exampleVi = "Ví dụ tiếng Việt không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const wordData = {
        ...formData,
        topicId,
        example: {
          en: formData.exampleEn,
          vi: formData.exampleVi,
        },
      };

      onSubmit(wordData);
      setFormData({
        word: "",
        type: "noun",
        pronunciation: "",
        definition: "",
        exampleEn: "",
        exampleVi: "",
        image: null,
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content add-word-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Thêm từ mới</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="word">Từ *</label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  id="word"
                  name="word"
                  value={formData.word}
                  onChange={handleInputChange}
                  placeholder="Nhập từ"
                  className={errors.word ? "error" : ""}
                />
                {isSearching && (
                  <span style={{ 
                    position: "absolute", 
                    right: "10px", 
                    top: "50%", 
                    transform: "translateY(-50%)",
                    fontSize: "12px",
                    color: "#64748b"
                  }}>
                    Đang tìm...
                  </span>
                )}
              </div>
              {foundWord && (
                <div style={{
                  marginTop: "4px",
                  padding: "8px 12px",
                  backgroundColor: "#dbeafe",
                  border: "1px solid #3b82f6",
                  borderRadius: "6px",
                  fontSize: "13px",
                  color: "#1e40af"
                }}>
                  ✓ Tìm thấy từ trong hệ thống. Đã tự động điền thông tin.
                </div>
              )}
              {errors.word && <span className="error-text">{errors.word}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="type">Loại từ *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
              >
                {wordTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="pronunciation">Phiên âm *</label>
            <input
              type="text"
              id="pronunciation"
              name="pronunciation"
              value={formData.pronunciation}
              onChange={handleInputChange}
              placeholder="Nhập phiên âm"
              className={errors.pronunciation ? "error" : ""}
            />
            {errors.pronunciation && (
              <span className="error-text">{errors.pronunciation}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="definition">Định nghĩa *</label>
            <textarea
              id="definition"
              name="definition"
              value={formData.definition}
              onChange={handleInputChange}
              placeholder="Nhập định nghĩa"
              rows="3"
              className={errors.definition ? "error" : ""}
            />
            {errors.definition && (
              <span className="error-text">{errors.definition}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="exampleEn">Ví dụ tiếng Anh *</label>
              <textarea
                id="exampleEn"
                name="exampleEn"
                value={formData.exampleEn}
                onChange={handleInputChange}
                placeholder="Nhập ví dụ tiếng Anh"
                rows="3"
                className={errors.exampleEn ? "error" : ""}
              />
              {errors.exampleEn && (
                <span className="error-text">{errors.exampleEn}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="exampleVi">Ví dụ tiếng Việt *</label>
              <textarea
                id="exampleVi"
                name="exampleVi"
                value={formData.exampleVi}
                onChange={handleInputChange}
                placeholder="Nhập ví dụ tiếng Việt"
                rows="3"
                className={errors.exampleVi ? "error" : ""}
              />
              {errors.exampleVi && (
                <span className="error-text">{errors.exampleVi}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="image">Hình ảnh (tùy chọn)</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn-primary">
              Thêm từ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWordModal;

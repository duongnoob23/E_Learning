// Client/components/Flashcard/AddWordModal/AddWordModal.jsx
import React, { useState } from "react";
import "./AddWordModal.css";

const AddWordModal = ({ isOpen, onClose, onSubmit, topicId }) => {
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
  };

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
              <input
                type="text"
                id="word"
                name="word"
                value={formData.word}
                onChange={handleInputChange}
                placeholder="Nhập từ"
                className={errors.word ? "error" : ""}
              />
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

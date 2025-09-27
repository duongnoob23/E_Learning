// Client/components/Flashcard/AddWordModal/AddWordModal.jsx
import React, { useState, useEffect } from "react";
import "./AddWordModal.css";

const AddWordModal = ({ 
  isOpen, 
  onClose, 
  topic, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    word: "",
    partOfSpeech: "",
    pronunciation: "",
    meaningVi: "",
    exampleEn: "",
    exampleVi: "",
    notes: ""
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFormData({
        word: "",
        partOfSpeech: "",
        pronunciation: "",
        meaningVi: "",
        exampleEn: "",
        exampleVi: "",
        notes: ""
      });
      setSelectedImage(null);
      setImagePreview(null);
      setError(""); // Clear error when modal opens
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra kích thước file (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Kích thước ảnh không được vượt quá 5MB");
        return;
      }
      
      // Kiểm tra loại file
      if (!file.type.startsWith('image/')) {
        setError("Chỉ cho phép upload file ảnh");
        return;
      }
      
      setSelectedImage(file);
      setError("");
      
      // Tạo preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.word.trim() || !formData.meaningVi.trim()) {
      setError("Vui lòng nhập từ và nghĩa tiếng Việt");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      // Tạo FormData để gửi file
      const formDataToSend = new FormData();
      formDataToSend.append('word', formData.word);
      formDataToSend.append('part_of_speech', formData.partOfSpeech);
      formDataToSend.append('pronunciation', formData.pronunciation);
      formDataToSend.append('meaning_vi', formData.meaningVi);
      formDataToSend.append('example_en', formData.exampleEn);
      formDataToSend.append('example_vi', formData.exampleVi);
      formDataToSend.append('notes', formData.notes);
      formDataToSend.append('word_type', 'user_created');
      
      // Thêm ảnh nếu có
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      await onSave({
        ...formData,
        topicId: topic.id,
        formData: formDataToSend
      });
      onClose();
    } catch (error) {
      console.error("Error saving word:", error);
      
      // Extract detailed error message
      let errorMessage = "Có lỗi xảy ra khi lưu từ mới";
      
      if (error?.response?.data?.EM) {
        errorMessage = error.response.data.EM;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="add-word-modal-overlay">
      <div className="add-word-modal">
        <div className="add-word-modal-header">
          <h2>Thêm từ mới vào "{topic?.title || 'Topic'}"</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSave} className="add-word-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="word">Từ tiếng Anh *</label>
              <input
                type="text"
                id="word"
                name="word"
                value={formData.word}
                onChange={handleInputChange}
                placeholder="Nhập từ tiếng Anh..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="partOfSpeech">Từ loại</label>
              <select
                id="partOfSpeech"
                name="partOfSpeech"
                value={formData.partOfSpeech}
                onChange={handleInputChange}
              >
                <option value="">Chọn từ loại</option>
                <option value="noun">Danh từ (n)</option>
                <option value="verb">Động từ (v)</option>
                <option value="adjective">Tính từ (adj)</option>
                <option value="adverb">Trạng từ (adv)</option>
                <option value="preposition">Giới từ (prep)</option>
                <option value="conjunction">Liên từ (conj)</option>
                <option value="interjection">Thán từ (interj)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="pronunciation">Phiên âm</label>
            <input
              type="text"
              id="pronunciation"
              name="pronunciation"
              value={formData.pronunciation}
              onChange={handleInputChange}
              placeholder="Ví dụ: /ˈhæpi/ (happy)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="meaningVi">Nghĩa tiếng Việt *</label>
            <textarea
              id="meaningVi"
              name="meaningVi"
              value={formData.meaningVi}
              onChange={handleInputChange}
              placeholder="Nhập nghĩa tiếng Việt..."
              rows="3"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="exampleEn">Ví dụ tiếng Anh</label>
              <textarea
                id="exampleEn"
                name="exampleEn"
                value={formData.exampleEn}
                onChange={handleInputChange}
                placeholder="Ví dụ: I am happy today."
                rows="2"
              />
            </div>

            <div className="form-group">
              <label htmlFor="exampleVi">Ví dụ tiếng Việt</label>
              <textarea
                id="exampleVi"
                name="exampleVi"
                value={formData.exampleVi}
                onChange={handleInputChange}
                placeholder="Ví dụ: Tôi hạnh phúc hôm nay."
                rows="2"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Ghi chú</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Ghi chú thêm về từ này..."
              rows="2"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Ảnh minh họa</label>
            <div className="image-upload-container">
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="image-input"
              />
              <label htmlFor="image" className="image-upload-label">
                <span className="upload-icon">📷</span>
                <span className="upload-text">
                  {selectedImage ? 'Thay đổi ảnh' : 'Chọn ảnh'}
                </span>
              </label>
              
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button 
                    type="button" 
                    className="remove-image-btn"
                    onClick={removeImage}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
            <small className="upload-hint">
              Chỉ chấp nhận file ảnh (JPG, PNG, GIF) tối đa 5MB
            </small>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Đang lưu..." : "Thêm từ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWordModal;
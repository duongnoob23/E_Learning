// Client/components/Flashcard/EditTopicModal/EditTopicModal.jsx
import React, { useState, useEffect } from "react";
import "./EditTopicModal.css";

const EditTopicModal = ({ 
  isOpen, 
  onClose, 
  topic, 
  onSave, 
  onDelete,
  onAddWords 
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isPublic: false
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (topic && isOpen) {
      setFormData({
        title: topic.title || "",
        description: topic.description || "",
        isPublic: topic.isPublic || false
      });
    }
  }, [topic, isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Vui lòng nhập tên topic");
      return;
    }

    setIsLoading(true);
    try {
      await onSave({
        ...formData,
        id: topic.id
      });
      onClose();
    } catch (error) {
      console.error("Error saving topic:", error);
      alert("Có lỗi xảy ra khi lưu topic");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa topic này? Hành động này không thể hoàn tác.")) {
      setIsLoading(true);
      try {
        await onDelete(topic.id);
        onClose();
      } catch (error) {
        console.error("Error deleting topic:", error);
        alert("Có lỗi xảy ra khi xóa topic");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddWords = () => {
    onAddWords(topic);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="edit-topic-modal-overlay">
      <div className="edit-topic-modal">
        <div className="edit-topic-modal-header">
          <h2>Chỉnh sửa topic</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSave} className="edit-topic-form">
          <div className="form-group">
            <label htmlFor="title">Tên topic *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Nhập tên topic..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Mô tả</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Nhập mô tả topic..."
              rows="4"
            />
          </div>


          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleInputChange}
              />
              <span className="checkmark"></span>
              Công khai (người khác có thể xem)
            </label>
          </div>

          <div className="modal-actions">
            <div className="left-actions">
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={isLoading}
              >
                Xóa topic
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleAddWords}
                disabled={isLoading}
              >
                Thêm từ mới
              </button>
            </div>
            
            <div className="right-actions">
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
                {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTopicModal;

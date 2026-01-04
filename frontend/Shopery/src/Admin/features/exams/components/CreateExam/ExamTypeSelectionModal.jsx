import React from "react";
import "./ExamTypeSelectionModal.scss";

/**
 * Modal chọn loại bài thi
 * Hiển thị 3 options: Listening & Reading, Speaking, Writing
 */
const EXAM_TYPES = [
  {
    id: "LISTENING_READING",
    name: "Listening & Reading",
    description: "Bài thi nghe và đọc hiểu. Bao gồm các phần Listening (Part 1-4) và Reading (Part 5-7).",
  },
  {
    id: "SPEAKING",
    name: "Speaking",
    description: "Bài thi nói. Học viên sẽ ghi âm câu trả lời cho từng câu hỏi.",
  },
  {
    id: "WRITING",
    name: "Writing",
    description: "Bài thi viết. Học viên sẽ viết bài luận hoặc câu trả lời cho từng câu hỏi.",
  },
];

export default function ExamTypeSelectionModal({
  open,
  onClose,
  onSelect,
  selectedType = null,
}) {
  if (!open) return null;

  const handleSelect = (examType) => {
    onSelect(examType);
    onClose();
  };

  return (
    <div className="exam-type-selection-modal-overlay" onClick={onClose}>
      <div
        className="exam-type-selection-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="exam-type-selection-modal__header">
          <h2 className="exam-type-selection-modal__title">Chọn loại bài thi</h2>
          <button
            className="exam-type-selection-modal__close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="exam-type-selection-modal__content">
          <p className="exam-type-selection-modal__description">
            Vui lòng chọn loại bài thi bạn muốn tạo. Mỗi loại có cách tạo nội dung khác nhau.
          </p>

          <div className="exam-type-selection-modal__options">
            {EXAM_TYPES.map((type) => (
              <div
                key={type.id}
                className={`exam-type-selection-modal__option ${
                  selectedType === type.id
                    ? "exam-type-selection-modal__option--selected"
                    : ""
                }`}
                onClick={() => handleSelect(type.id)}
              >
                <div className="exam-type-selection-modal__option-header">
                  <h3 className="exam-type-selection-modal__option-name">
                    {type.name}
                  </h3>
                  {selectedType === type.id && (
                    <span className="exam-type-selection-modal__checkmark">✓</span>
                  )}
                </div>
                <p className="exam-type-selection-modal__option-description">
                  {type.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="exam-type-selection-modal__footer">
          <button
            className="exam-type-selection-modal__cancel"
            onClick={onClose}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}


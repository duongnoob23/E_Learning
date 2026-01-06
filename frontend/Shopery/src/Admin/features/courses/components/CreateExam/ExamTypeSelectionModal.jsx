import React from "react";
import "./ExamTypeSelectionModal.scss";

/**
 * Exam Type Selection Modal
 * Displays 3 options: Listening & Reading, Speaking, Writing
 */
const EXAM_TYPES = [
  {
    id: "LISTENING_READING",
    name: "Listening & Reading",
    description: "Listening and reading comprehension exam. Includes Listening (Part 1-4) and Reading (Part 5-7) sections.",
  },
  {
    id: "SPEAKING",
    name: "Speaking",
    description: "Speaking exam. Students will record their answers for each question.",
  },
  {
    id: "WRITING",
    name: "Writing",
    description: "Writing exam. Students will write essays or answers for each question.",
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
          <h2 className="exam-type-selection-modal__title">Select Exam Type</h2>
          <button
            className="exam-type-selection-modal__close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="exam-type-selection-modal__content">
          <p className="exam-type-selection-modal__description">
            Please select the type of exam you want to create. Each type has different content creation methods.
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
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

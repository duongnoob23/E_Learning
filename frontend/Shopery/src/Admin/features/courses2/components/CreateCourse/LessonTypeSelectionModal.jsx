import React from "react";
import "./LessonTypeSelectionModal.scss";

const LESSON_TYPES = [
  {
    id: "video",
    name: "Video Lesson",
    icon: "🎥",
    description: "Video bài giảng từ YouTube, Vimeo, hoặc upload",
  },
  {
    id: "vocabulary_list",
    name: "Vocabulary List",
    icon: "📝",
    description: "Danh sách từ vựng với hình ảnh, audio, ví dụ",
  },
  {
    id: "vocabulary_matching",
    name: "Vocabulary Matching",
    icon: "🔗",
    description: "Nối từ tiếng Việt với tiếng Anh",
  },
  {
    id: "vocabulary_translation",
    name: "Vocabulary Translation",
    icon: "🔄",
    description: "Dịch từ tiếng Việt sang tiếng Anh",
  },
  {
    id: "vocabulary_quiz",
    name: "Vocabulary Quiz",
    icon: "❓",
    description: "Trắc nghiệm từ vựng với nhiều lựa chọn",
  },
  {
    id: "vocabulary_listening",
    name: "Vocabulary Listening",
    icon: "👂",
    description: "Nghe và chọn đáp án đúng",
  },
  {
    id: "vocabulary_image_choice",
    name: "Image Choice",
    icon: "🖼️",
    description: "Chọn hình ảnh đúng theo câu hỏi",
  },
  {
    id: "vocabulary_sentence_completion",
    name: "Sentence Completion",
    icon: "✏️",
    description: "Điền từ vào chỗ trống trong câu",
  },
  {
    id: "grammar_theory",
    name: "Grammar Theory",
    icon: "📚",
    description: "Lý thuyết ngữ pháp với ví dụ",
  },
];

export default function LessonTypeSelectionModal({ open, onClose, onSelect }) {
  if (!open) return null;

  const handleSelect = (lessonType) => {
    // Chỉ gọi onSelect, để parent component tự quản lý việc đóng modal
    onSelect(lessonType);
    // Không gọi onClose() ở đây vì handleSelectLessonType sẽ tự đóng modal
  };

  return (
    <div
      className="lesson-type-selection-modal__backdrop"
      onMouseDown={(e) => {
        if (
          e.target.classList.contains("lesson-type-selection-modal__backdrop")
        ) {
          onClose();
        }
      }}
    >
      <div
        className="lesson-type-selection-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="lesson-type-selection-modal__header">
          <h3>Chọn loại bài học</h3>
          <button
            className="lesson-type-selection-modal__close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="lesson-type-selection-modal__content">
          <div className="lesson-type-selection-modal__grid">
            {LESSON_TYPES.map((type) => (
              <div
                key={type.id}
                className="lesson-type-selection-modal__card"
                onClick={() => handleSelect(type.id)}
              >
                <div className="lesson-type-selection-modal__icon">
                  {type.icon}
                </div>
                <h4 className="lesson-type-selection-modal__name">
                  {type.name}
                </h4>
                <p className="lesson-type-selection-modal__description">
                  {type.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="lesson-type-selection-modal__footer">
          <button
            type="button"
            className="lesson-type-selection-modal__btn"
            onClick={onClose}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}

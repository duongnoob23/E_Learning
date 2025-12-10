// TemplateLibrary.jsx - Thư viện template cho từng loại lesson
import React from "react";
import "./TemplateLibrary.css";

const TEMPLATES = {
  vocabulary_matching: [
    {
      id: "matching_emotions",
      name: "Cảm xúc cơ bản",
      description: "8 cặp từ về cảm xúc",
      data: {
        type: "vocabulary_matching",
        questions: [
          {
            question_id: 1,
            pairs: [
              { pair_id: 1, left_text: "vui mừng", left_image_url: "", right_text: "happy" },
              { pair_id: 2, left_text: "buồn", left_image_url: "", right_text: "sad" },
              { pair_id: 3, left_text: "giận", left_image_url: "", right_text: "angry" },
              { pair_id: 4, left_text: "hào hứng", left_image_url: "", right_text: "excited" },
            ],
            grid_size: { rows: 4, cols: 4 },
          },
        ],
      },
    },
  ],
  vocabulary_translation: [
    {
      id: "translation_basic",
      name: "Dịch cơ bản",
      description: "Câu hỏi dịch đơn giản",
      data: {
        type: "vocabulary_translation",
        questions: [
          {
            question_id: 1,
            vi_text: "vui mừng",
            image_url: "",
            correct_answer: "happy",
          },
        ],
      },
    },
  ],
  vocabulary_sentence_completion: [
    {
      id: "sentence_basic",
      name: "Hoàn thiện câu cơ bản",
      description: "Câu hoàn thiện đơn giản",
      data: {
        type: "vocabulary_sentence_completion",
        questions: [
          {
            question_id: 1,
            vi_text: "Tôi vui mừng vì hôm nay trời nắng",
            sentence_template: "I am {blank1} because today is {blank2}",
            shuffled_words: [
              { id: 1, text: "happy" },
              { id: 2, text: "sunny" },
            ],
            blanks: [
              { id: "blank1", correct_word_id: 1 },
              { id: "blank2", correct_word_id: 2 },
            ],
          },
        ],
      },
    },
  ],
};

export default function TemplateLibrary({ lessonType, onSelect, onClose }) {
  const templates = TEMPLATES[lessonType] || [];

  return (
    <div className="template-library-overlay" onClick={onClose}>
      <div className="template-library" onClick={(e) => e.stopPropagation()}>
        <div className="template-library-header">
          <h3>📚 Template Library</h3>
          <button className="template-library-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="template-library-content">
          {templates.length === 0 ? (
            <div className="template-library-empty">
              <p>Chưa có template cho loại lesson này</p>
            </div>
          ) : (
            <div className="template-library-grid">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="template-library-card"
                  onClick={() => onSelect(template)}
                >
                  <h4>{template.name}</h4>
                  <p>{template.description}</p>
                  <button className="template-library-use-btn">
                    Sử dụng template
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


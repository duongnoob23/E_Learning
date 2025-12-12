// ImportGuide.jsx - Hướng dẫn format JSON cho từng lesson type
import React from "react";
import { HiXMark, HiClipboardDocument } from "react-icons/hi2";
import "./ImportGuide.css";

const JSON_EXAMPLES = {
  vocabulary_matching: {
    description: "Mỗi câu hỏi có grid_size (rows x cols) và các cặp từ. Số cặp tối đa = (rows × cols) / 2",
    example: {
      type: "vocabulary_matching",
      questions: [
        {
          question_id: 1,
          pairs: [
            {
              pair_id: 1,
              left_text: "vui mừng",
              left_image_url: "https://example.com/image.jpg",
              right_text: "happy",
            },
            {
              pair_id: 2,
              left_text: "buồn",
              left_image_url: "",
              right_text: "sad",
            },
          ],
          grid_size: { rows: 4, cols: 4 },
        },
      ],
    },
    rules: [
      "grid_size.rows × grid_size.cols phải là số chẵn",
      "Số cặp (pairs.length) không được vượt quá (rows × cols) / 2",
      "Ví dụ: 4×4 = 16 ô → tối đa 8 cặp",
      "Ví dụ: 3×3 = 9 ô → không hợp lệ (số lẻ)",
    ],
  },
  vocabulary_translation: {
    description: "Mỗi câu hỏi có câu tiếng Việt, ảnh (tùy chọn), và đáp án tiếng Anh",
    example: {
      type: "vocabulary_translation",
      questions: [
        {
          question_id: 1,
          vi_text: "vui mừng",
          image_url: "https://example.com/image.jpg",
          correct_answer: "happy",
        },
      ],
    },
    rules: [
      "vi_text: bắt buộc - Câu tiếng Việt",
      "correct_answer: bắt buộc - Đáp án tiếng Anh",
      "image_url: tùy chọn - URL ảnh minh họa",
    ],
  },
  vocabulary_sentence_completion: {
    description: "Mỗi câu hỏi có câu tiếng Việt, template câu tiếng Anh với {blank1}, {blank2}..., danh sách từ, và các ô trống",
    example: {
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
    rules: [
      "vi_text: bắt buộc - Câu tiếng Việt",
      "sentence_template: bắt buộc - Template với {blank1}, {blank2}...",
      "shuffled_words: bắt buộc - Mảng các từ để điền",
      "blanks: bắt buộc - Mảng các ô trống với correct_word_id trỏ đến id trong shuffled_words",
      "correct_word_id phải khớp với id trong shuffled_words",
    ],
  },
  vocabulary_quiz: {
    description: "Mỗi câu hỏi có loại (text/image/audio), nội dung câu hỏi, và các lựa chọn",
    example: {
      type: "vocabulary_quiz",
      questions: [
        {
          question_id: 1,
          question_type: "text",
          question_text: "What does 'happy' mean?",
          question_image_url: "",
          question_audio_url: "",
          choices: [
            { choice_id: 1, text: "vui mừng", image_url: "", is_correct: true },
            { choice_id: 2, text: "buồn", image_url: "", is_correct: false },
          ],
        },
      ],
    },
    rules: [
      "question_type: 'text', 'image', hoặc 'audio'",
      "Nếu question_type = 'text': cần question_text",
      "Nếu question_type = 'image': cần question_image_url",
      "Nếu question_type = 'audio': cần question_audio_url",
      "choices: mảng các lựa chọn, ít nhất 1 lựa chọn có is_correct = true",
    ],
  },
  vocabulary_listening: {
    description: "Mỗi câu hỏi có audio URL, grid (rows x cols), và các cells",
    example: {
      type: "vocabulary_listening",
      questions: [
        {
          question_id: 1,
          audio_url: "https://example.com/audio.mp3",
          grid: {
            rows: 3,
            cols: 3,
            cells: [
              {
                id: 1,
                image_url: "https://example.com/image.jpg",
                vi_text: "vui mừng",
                is_correct: true,
                position: { row: 0, col: 0 },
              },
            ],
          },
          play_count: 3,
        },
      ],
    },
    rules: [
      "audio_url: bắt buộc - URL file audio",
      "grid.rows × grid.cols = số cells",
      "Mỗi cell phải có position (row, col) hợp lệ",
      "Ít nhất 1 cell có is_correct = true",
    ],
  },
  vocabulary_image_choice: {
    description: "Mỗi câu hỏi có loại (text/audio), nội dung câu hỏi, và các ảnh lựa chọn",
    example: {
      type: "vocabulary_image_choice",
      questions: [
        {
          question_id: 1,
          question_type: "text",
          question_text: "What does 'happy' mean?",
          question_audio_url: "",
          images: [
            { image_id: 1, image_url: "https://example.com/happy.jpg", is_correct: true },
            { image_id: 2, image_url: "https://example.com/sad.jpg", is_correct: false },
          ],
        },
      ],
    },
    rules: [
      "question_type: 'text' hoặc 'audio'",
      "Nếu question_type = 'text': cần question_text",
      "Nếu question_type = 'audio': cần question_audio_url",
      "images: mảng các ảnh, ít nhất 1 ảnh có is_correct = true",
    ],
  },
  vocabulary_list: {
    description: "Danh sách từ với display_mode (flashcard/list) và mảng words",
    example: {
      type: "vocabulary_list",
      display_mode: "flashcard",
      words: [
        {
          word_id: 1,
          en: "happy",
          vi: "vui mừng",
          image_url: "https://example.com/image.jpg",
          audio_url: "https://example.com/audio.mp3",
          example: "I am happy today",
        },
      ],
    },
    rules: [
      "display_mode: 'flashcard' hoặc 'list'",
      "words: mảng các từ, mỗi từ cần en và vi",
    ],
  },
};

export default function ImportGuide({ lessonType, onClose }) {
  const guide = JSON_EXAMPLES[lessonType];

  if (!guide) {
    return (
      <div className="import-guide-overlay" onClick={onClose}>
        <div className="import-guide" onClick={(e) => e.stopPropagation()}>
          <div className="import-guide-header">
            <h3>Hướng dẫn Import JSON</h3>
            <button className="import-guide-close" onClick={onClose}>
              <HiXMark />
            </button>
          </div>
          <div className="import-guide-content">
            <p>Chưa có hướng dẫn cho loại lesson này.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="import-guide-overlay" onClick={onClose}>
      <div className="import-guide" onClick={(e) => e.stopPropagation()}>
        <div className="import-guide-header">
          <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <HiClipboardDocument style={{ width: "20px", height: "20px" }} />
            Hướng dẫn Format JSON - {lessonType}
          </h3>
          <button className="import-guide-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="import-guide-content">
          <div className="import-guide-section">
            <h4>Mô tả:</h4>
            <p>{guide.description}</p>
          </div>

          <div className="import-guide-section">
            <h4>Quy tắc:</h4>
            <ul className="import-guide-rules">
              {guide.rules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          </div>

          <div className="import-guide-section">
            <h4>Ví dụ JSON:</h4>
            <pre className="import-guide-code">
              {JSON.stringify(guide.example, null, 2)}
            </pre>
          </div>

          <div className="import-guide-actions">
            <button
              className="import-guide-copy-btn"
              onClick={() => {
                navigator.clipboard.writeText(
                  JSON.stringify(guide.example, null, 2)
                );
                alert("Đã copy vào clipboard!");
              }}
            >
              <HiClipboardDocument style={{ marginRight: "6px", width: "16px", height: "16px" }} />
              Copy ví dụ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// LessonStudioPage.jsx - Trang riêng để tạo/chỉnh sửa lesson
import React, { useState } from "react";
import LessonStudio from "../../components/Lesson/Creators/LessonStudio";
import "./LessonStudioPage.css";

const LESSON_TYPES = [
  { value: "vocabulary_list", label: "📚 Danh sách từ mới" },
  { value: "vocabulary_matching", label: "🔗 Tìm cặp" },
  { value: "vocabulary_translation", label: "✍️ Dịch nghĩa" },
  { value: "vocabulary_quiz", label: "❓ Trắc nghiệm" },
  { value: "vocabulary_listening", label: "🎧 Nghe từ vựng" },
  { value: "vocabulary_image_choice", label: "🖼️ Chọn ảnh" },
  { value: "vocabulary_sentence_completion", label: "📝 Hoàn thiện câu" },
];

export default function LessonStudioPage() {
  const [selectedLessonType, setSelectedLessonType] = useState(
    LESSON_TYPES[0].value
  );
  const [lessonData, setLessonData] = useState(null);

  const handleSave = (data) => {
    setLessonData(data);
    console.log("Saved lesson data:", data);
    alert("Lesson data đã được lưu! (Check console)");
  };

  return (
    <div className="lesson-studio-page">
      <div className="lesson-studio-page-container">
        <h1 className="lesson-studio-page-title">Lesson Studio</h1>
        <p className="lesson-studio-page-subtitle">
          Tạo và chỉnh sửa lesson cho từng loại bài tập
        </p>

        {/* Lesson Type Selector */}
        <div className="lesson-studio-page-selector">
          <label>Chọn loại lesson:</label>
          <select
            value={selectedLessonType}
            onChange={(e) => {
              setSelectedLessonType(e.target.value);
              setLessonData(null);
            }}
            className="lesson-studio-page-select"
          >
            {LESSON_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Lesson Studio */}
        <LessonStudio
          lessonType={selectedLessonType}
          initialData={lessonData}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}


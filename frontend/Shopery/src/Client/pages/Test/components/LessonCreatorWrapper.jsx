// LessonCreatorWrapper.jsx - Component hiển thị UI tạo lesson cho từng loại
import React, { useState } from "react";
import VocabularyListCreator from "./creators/VocabularyListCreator";
import VocabularyMatchingCreator from "./creators/VocabularyMatchingCreator";
import VocabularyTranslationCreator from "./creators/VocabularyTranslationCreator";
import VocabularyQuizCreator from "./creators/VocabularyQuizCreator";
import VocabularyListeningCreator from "./creators/VocabularyListeningCreator";
import VocabularyImageChoiceCreator from "./creators/VocabularyImageChoiceCreator";
import VocabularySentenceCompletionCreator from "./creators/VocabularySentenceCompletionCreator";
import "./LessonCreatorWrapper.css";

export default function LessonCreatorWrapper({ lessonType, onDataChange }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderCreator = () => {
    switch (lessonType) {
      case "vocabulary_list":
        return <VocabularyListCreator onDataChange={onDataChange} />;
      case "vocabulary_matching":
        return <VocabularyMatchingCreator onDataChange={onDataChange} />;
      case "vocabulary_translation":
        return <VocabularyTranslationCreator onDataChange={onDataChange} />;
      case "vocabulary_quiz":
        return <VocabularyQuizCreator onDataChange={onDataChange} />;
      case "vocabulary_listening":
        return <VocabularyListeningCreator onDataChange={onDataChange} />;
      case "vocabulary_image_choice":
        return <VocabularyImageChoiceCreator onDataChange={onDataChange} />;
      case "vocabulary_sentence_completion":
        return (
          <VocabularySentenceCompletionCreator onDataChange={onDataChange} />
        );
      default:
        return <div>Chưa hỗ trợ loại lesson này</div>;
    }
  };

  const getLessonTypeName = () => {
    const names = {
      vocabulary_list: "Danh sách từ mới",
      vocabulary_matching: "Tìm cặp",
      vocabulary_translation: "Dịch nghĩa",
      vocabulary_quiz: "Trắc nghiệm",
      vocabulary_listening: "Nghe từ vựng",
      vocabulary_image_choice: "Chọn ảnh",
      vocabulary_sentence_completion: "Hoàn thiện câu",
    };
    return names[lessonType] || lessonType;
  };

  return (
    <div className="lesson-creator-wrapper">
      <div
        className="lesson-creator-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="lesson-creator-title">
          🛠️ UI Tạo Lesson: {getLessonTypeName()}
        </h3>
        <span className="lesson-creator-toggle">
          {isExpanded ? "−" : "+"}
        </span>
      </div>
      {isExpanded && (
        <div className="lesson-creator-content">{renderCreator()}</div>
      )}
    </div>
  );
}


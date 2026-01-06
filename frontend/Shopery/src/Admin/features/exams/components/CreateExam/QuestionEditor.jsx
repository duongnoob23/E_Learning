import React, { useState, useEffect } from "react";
import "./QuestionEditor.scss";
import ListeningReadingQuestionEditor from "./ListeningReadingQuestionEditor";
import SpeakingQuestionEditor from "./SpeakingQuestionEditor";
import WritingQuestionEditor from "./WritingQuestionEditor";

/**
 * Component chính để tạo Questions
 * Router component - chọn editor phù hợp dựa trên partType
 */
export default function QuestionEditor({
  open,
  partType,
  questions = [],
  onSave,
  onCancel,
}) {
  const [currentQuestions, setCurrentQuestions] = useState([]);

  // Load questions khi mở modal
  useEffect(() => {
    if (open) {
      setCurrentQuestions(questions.length > 0 ? questions : []);
    }
  }, [open, questions]);

  // Xử lý thay đổi questions
  const handleQuestionsChange = (newQuestions) => {
    setCurrentQuestions(newQuestions);
  };

  // Xử lý lưu
  const handleSave = () => {
    onSave(currentQuestions);
  };

  if (!open) return null;

  // Render editor phù hợp
  const renderEditor = () => {
    if (partType === "LISTENING" || partType === "READING") {
      return (
        <ListeningReadingQuestionEditor
          questions={currentQuestions}
          onChange={handleQuestionsChange}
        />
      );
    } else if (partType === "SPEAKING") {
      return (
        <SpeakingQuestionEditor
          questions={currentQuestions}
          onChange={handleQuestionsChange}
        />
      );
    } else if (partType === "WRITING") {
      return (
        <WritingQuestionEditor
          questions={currentQuestions}
          onChange={handleQuestionsChange}
        />
      );
    }
    return <div>Loại Part không hợp lệ</div>;
  };

  return (
    <div className="question-editor-overlay" onClick={onCancel}>
      <div className="question-editor" onClick={(e) => e.stopPropagation()}>
        <div className="question-editor__header">
          <h3 className="question-editor__title">
            Tạo câu hỏi cho {partType}
          </h3>
          <button className="question-editor__close" onClick={onCancel}>
            ×
          </button>
        </div>

        <div className="question-editor__content">
          {renderEditor()}
        </div>

        <div className="question-editor__footer">
          <button className="question-editor__cancel-btn" onClick={onCancel}>
            Hủy
          </button>
          <button className="question-editor__save-btn" onClick={handleSave}>
            Lưu câu hỏi ({currentQuestions.length})
          </button>
        </div>
      </div>
    </div>
  );
}


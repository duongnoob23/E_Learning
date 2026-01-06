import React, { useCallback, useEffect, useState } from "react";
import ExamPart1Editor from "./editors/ExamPart1Editor";
import ExamPart2Editor from "./editors/ExamPart2Editor";
import ExamPart3Editor from "./editors/ExamPart3Editor";
import ExamPart5Editor from "./editors/ExamPart5Editor";
import ExamPart6Editor from "./editors/ExamPart6Editor";
import ExamPart7Editor from "./editors/ExamPart7Editor";
import ExamSpeakingPart1Editor from "./editors/ExamSpeakingPart1Editor";
import ExamSpeakingPart2Editor from "./editors/ExamSpeakingPart2Editor";
import ExamSpeakingPart3Editor from "./editors/ExamSpeakingPart3Editor";
import ExamSpeakingPart4Editor from "./editors/ExamSpeakingPart4Editor";
import ExamSpeakingPart5Editor from "./editors/ExamSpeakingPart5Editor";
import ExamWritingPart1Editor from "./editors/ExamWritingPart1Editor";
import ExamWritingPart2Editor from "./editors/ExamWritingPart2Editor";
import ExamWritingPart3Editor from "./editors/ExamWritingPart3Editor";
import "./QuestionEditor.scss";

/**
 * Question Editor Component
 * Router component - selects appropriate editor based on partType and partNumber
 * Uses specialized editors for Listening/Reading parts (1-7) with preview and JSON import
 */
export default function QuestionEditor({
  open,
  partType,
  partNumber,
  questions = [],
  onSave,
  onCancel,
}) {
  const [currentQuestions, setCurrentQuestions] = useState([]);

  // Load questions when modal opens
  useEffect(() => {
    if (open) {
      // Deep clone to avoid mutation
      const loadedQuestions =
        questions.length > 0 ? JSON.parse(JSON.stringify(questions)) : [];
      setCurrentQuestions(loadedQuestions);
    }
  }, [open, questions]);

  // Handle questions changes from child editor
  const handleQuestionsChange = useCallback((newQuestions) => {
    // Deep clone to avoid mutation
    setCurrentQuestions(JSON.parse(JSON.stringify(newQuestions)));
  }, []);

  // Handle save
  const handleSave = useCallback(() => {
    // Deep clone before saving
    onSave(JSON.parse(JSON.stringify(currentQuestions)));
  }, [currentQuestions, onSave]);

  if (!open) return null;

  // Render appropriate editor based on partType and partNumber
  const renderEditor = () => {
    // Listening & Reading parts (1-7) use specialized editors
    if (partType === "LISTENING" || partType === "READING") {
      // Route to specific part editor based on partNumber
      if (partNumber === 1) {
        return (
          <ExamPart1Editor
            questions={currentQuestions}
            onChange={handleQuestionsChange}
          />
        );
      } else if (partNumber === 2) {
        return (
          <ExamPart2Editor
            questions={currentQuestions}
            onChange={handleQuestionsChange}
          />
        );
      } else if (partNumber === 3 || partNumber === 4) {
        // Part 3 and Part 4 use the same editor (Conversations)
        return (
          <ExamPart3Editor
            questions={currentQuestions}
            onChange={handleQuestionsChange}
          />
        );
      } else if (partNumber === 5) {
        return (
          <ExamPart5Editor
            questions={currentQuestions}
            onChange={handleQuestionsChange}
          />
        );
      } else if (partNumber === 6) {
        return (
          <ExamPart6Editor
            questions={currentQuestions}
            onChange={handleQuestionsChange}
          />
        );
      } else if (partNumber === 7) {
        return (
          <ExamPart7Editor
            questions={currentQuestions}
            onChange={handleQuestionsChange}
          />
        );
      }

      // Fallback to generic editor if part editor not available yet
      return (
        <div>
          <p>
            Part {partNumber} editor is being created. Using generic editor for
            now.
          </p>
          <p>Part Type: {partType}</p>
        </div>
      );
    } else if (partType === "SPEAKING") {
      // Route to specific Speaking part editor based on partNumber
      switch (partNumber) {
        case 1:
          return (
            <ExamSpeakingPart1Editor
              questions={currentQuestions}
              onChange={handleQuestionsChange}
            />
          );
        case 2:
          return (
            <ExamSpeakingPart2Editor
              questions={currentQuestions}
              onChange={handleQuestionsChange}
            />
          );
        case 3:
          return (
            <ExamSpeakingPart3Editor
              questions={currentQuestions}
              onChange={handleQuestionsChange}
            />
          );
        case 4:
          return (
            <ExamSpeakingPart4Editor
              questions={currentQuestions}
              onChange={handleQuestionsChange}
            />
          );
        case 5:
          return (
            <ExamSpeakingPart5Editor
              questions={currentQuestions}
              onChange={handleQuestionsChange}
            />
          );
        default:
          return <div>Invalid Speaking Part (must be 1-5)</div>;
      }
    } else if (partType === "WRITING") {
      // Route to specific Writing part editor based on partNumber
      switch (partNumber) {
        case 1:
          return (
            <ExamWritingPart1Editor
              questions={currentQuestions}
              onChange={handleQuestionsChange}
            />
          );
        case 2:
          return (
            <ExamWritingPart2Editor
              questions={currentQuestions}
              onChange={handleQuestionsChange}
            />
          );
        case 3:
          return (
            <ExamWritingPart3Editor
              questions={currentQuestions}
              onChange={handleQuestionsChange}
            />
          );
        default:
          return <div>Invalid Writing Part (must be 1-3)</div>;
      }
    }
    return <div>Invalid Part Type</div>;
  };

  return (
    <div className="question-editor-overlay" onClick={onCancel}>
      <div className="question-editor" onClick={(e) => e.stopPropagation()}>
        <div className="question-editor__header">
          <h3 className="question-editor__title">
            Create Questions for {partType}
          </h3>
          <button className="question-editor__close" onClick={onCancel}>
            ×
          </button>
        </div>

        <div className="question-editor__content">{renderEditor()}</div>

        <div className="question-editor__footer">
          <button className="question-editor__cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="question-editor__save-btn" onClick={handleSave}>
            Save Questions ({currentQuestions.length})
          </button>
        </div>
      </div>
    </div>
  );
}

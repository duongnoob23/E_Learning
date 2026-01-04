import React, { useState, useCallback } from "react";
import "./ExamBuilderModalNew.scss";
import ExamBuilderTab from "./ExamBuilderTab";

/**
 * Main modal for creating new exam
 * Manages exam state and validation
 */
export default function ExamBuilderModalNew({ open, onClose, onSubmit }) {
  const [examInfo, setExamInfo] = useState({
    title: "",
    description: "",
    exam_type: "TOEIC",
    total_duration: 120,
    difficulty_level: "MEDIUM",
    exam_type_selected: null, // LISTENING_READING, SPEAKING, WRITING
    parts: [],
  });
  const [errors, setErrors] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Validation function
  const validateExamInfo = useCallback((info) => {
    const newErrors = {};

    if (!info.title || info.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!info.description || info.description.trim().length === 0) {
      newErrors.description = "Description is required";
    }

    if (!info.exam_type) {
      newErrors.exam_type = "Exam type is required";
    }

    if (info.total_duration !== null && info.total_duration !== undefined) {
      if (info.total_duration < 0) {
        newErrors.total_duration = "Duration must be 0 or greater";
      }
      if (info.total_duration > 600) {
        newErrors.total_duration = "Duration cannot exceed 600 minutes";
      }
    }

    if (!info.difficulty_level) {
      newErrors.difficulty_level = "Difficulty level is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  // Handle exam info changes
  const handleExamInfoChange = useCallback((newInfo) => {
    setExamInfo((prev) => {
      const updated = { ...prev, ...newInfo };
      setHasUnsavedChanges(true);
      return updated;
    });
    // Clear errors when user types
    Object.keys(newInfo).forEach((key) => {
      if (errors[key]) {
        setErrors((prev) => ({ ...prev, [key]: null }));
      }
    });
  }, [errors]);

  // Handle submit
  const handleSubmit = async () => {
    // Validate basic info
    if (!validateExamInfo(examInfo)) {
      alert("Please fill in all required fields correctly");
      return;
    }

    if (!examInfo.exam_type_selected) {
      alert("Please select an exam type");
      return;
    }

    if (!examInfo.parts || examInfo.parts.length === 0) {
      alert("Please create at least 1 Part");
      return;
    }

    // Validate each part has at least 1 question
    for (const part of examInfo.parts) {
      if (!part.questions || part.questions.length === 0) {
        alert(`Part "${part.part_name}" has no questions. Please add at least one question.`);
        return;
      }
    }

    // Format and submit data
    if (onSubmit) {
      try {
        await onSubmit({
          testInfo: {
            title: examInfo.title.trim(),
            description: examInfo.description.trim(),
            exam_type: examInfo.exam_type,
            total_duration: examInfo.total_duration || 0,
            difficulty_level: examInfo.difficulty_level,
          },
          parts: examInfo.parts.map((part) => ({
            part_number: part.part_number,
            part_name: part.part_name,
            part_type: part.part_type,
            duration_minutes: part.duration_minutes || 0,
            description: part.description || null,
            display_template: part.display_template || null,
            questions: part.questions.map((q) => ({
              question_number: q.question_number,
              question_text: q.question_text || "",
              question_type: q.question_type || "MULTIPLE_CHOICE",
              audio_file: q.audio_file || null,
              image_file: q.image_file || null,
              transcript: q.transcript || null,
              explanation: q.explanation || null,
              grammar_notes: q.grammar_notes || null,
              choices:
                part.part_type === "LISTENING" || part.part_type === "READING"
                  ? (q.choices || []).map((c) => ({
                      choice_letter: c.choice_letter,
                      choice_text: c.choice_text || "",
                      choice_translation: c.choice_translation || null,
                      choice_explanation: c.choice_explanation || null,
                      is_correct: c.is_correct || false,
                    }))
                  : [],
            })),
          })),
        });

        // Reset and close on success
        handleReset();
        onClose();
      } catch (error) {
        console.error("Error submitting exam:", error);
        alert("Failed to create exam. Please try again.");
      }
    }
  };

  // Reset form
  const handleReset = () => {
    setExamInfo({
      title: "",
      description: "",
      exam_type: "TOEIC",
      total_duration: 120,
      difficulty_level: "MEDIUM",
      exam_type_selected: null,
      parts: [],
    });
    setErrors({});
    setHasUnsavedChanges(false);
  };

  // Handle close with confirmation
  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (window.confirm("You have unsaved changes. Are you sure you want to close?")) {
        handleReset();
        onClose();
      }
    } else {
      onClose();
    }
  };

  // Early return AFTER all hooks
  if (!open) return null;

  return (
    <div
      className="exam-builder-modal-new-overlay"
      onMouseDown={(e) => {
        if (e.target.classList.contains("exam-builder-modal-new-overlay")) {
          handleClose();
        }
      }}
    >
      <div
        className="exam-builder-modal-new"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="exam-builder-modal-new__header">
          <h2 className="exam-builder-modal-new__title">Create New Exam</h2>
          <button
            className="exam-builder-modal-new__close"
            onClick={handleClose}
          >
            ×
          </button>
        </div>

        <div className="exam-builder-modal-new__content">
          <ExamBuilderTab
            examInfo={examInfo}
            onChange={handleExamInfoChange}
            errors={errors}
          />
        </div>

        <div className="exam-builder-modal-new__footer">
          <button
            className="exam-builder-modal-new__reset-btn"
            onClick={handleReset}
          >
            Reset
          </button>
          <div className="exam-builder-modal-new__footer-right">
            <button
              className="exam-builder-modal-new__cancel-btn"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              className="exam-builder-modal-new__submit-btn"
              onClick={handleSubmit}
            >
              Create Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

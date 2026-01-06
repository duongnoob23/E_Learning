import React, { useCallback, useEffect, useState } from "react";
import "./PartEditor.scss";
import QuestionEditor from "./QuestionEditor";

/**
 * Part Editor Modal Component
 * Create/edit Part and manage Questions
 */
export default function PartEditor({
  open,
  part = null,
  examType,
  defaultPartType = null,
  existingParts = [],
  onSave,
  onCancel,
}) {
  const [partData, setPartData] = useState({
    part_number: 1,
    part_name: "",
    part_type: defaultPartType || "LISTENING",
    duration_minutes: 0,
    description: "",
    display_template: null,
  });
  const [errors, setErrors] = useState({});
  const [showQuestionEditor, setShowQuestionEditor] = useState(false);

  // Get Speaking part name by number
  const getSpeakingPartName = useCallback((partNumber) => {
    const names = {
      1: "Part 1: Read a text aloud",
      2: "Part 2: Describe a picture",
      3: "Part 3: Respond to questions",
      4: "Part 4: Respond to questions using information provided",
      5: "Part 5: Propose a solution",
    };
    return names[partNumber] || `Part ${partNumber}`;
  }, []);

  // Load data when editing
  useEffect(() => {
    if (part) {
      setPartData({
        part_number: part.part_number || 1,
        part_name: part.part_name || "",
        part_type: part.part_type || defaultPartType || "LISTENING",
        duration_minutes: part.duration_minutes || 0,
        description: part.description || "",
        display_template: part.display_template || null,
      });
    } else {
      // Reset to defaults for new part
      const partNumber = part?.part_number || 1;
      let partName = part?.part_name || "";

      // Auto-fill part name for Speaking
      if (defaultPartType === "SPEAKING" && !partName) {
        partName = getSpeakingPartName(partNumber);
      }

      setPartData({
        part_number: partNumber,
        part_name: partName,
        part_type: defaultPartType || "LISTENING",
        duration_minutes: 0,
        description: "",
        display_template: null,
      });
    }
    setErrors({});
  }, [part, defaultPartType, open, getSpeakingPartName]);

  // Handle field changes
  const handleChange = useCallback(
    (field, value) => {
      setPartData((prev) => ({ ...prev, [field]: value }));
      // Clear error when user types
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: null }));
      }
    },
    [errors]
  );

  // Validation
  const validate = useCallback(() => {
    const newErrors = {};

    if (!partData.part_name || partData.part_name.trim().length === 0) {
      newErrors.part_name = "Part name is required";
    } else if (partData.part_name.length > 100) {
      newErrors.part_name = "Part name cannot exceed 100 characters";
    }

    if (!partData.part_type) {
      newErrors.part_type = "Part type is required";
    }

    if (partData.duration_minutes < 0) {
      newErrors.duration_minutes = "Duration cannot be negative";
    }

    // Check for duplicate part numbers (only if creating new part)
    if (!part) {
      const duplicate = existingParts.find(
        (p) => p.part_number === partData.part_number
      );
      if (duplicate) {
        newErrors.part_number = `Part ${partData.part_number} already exists`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [partData, part, existingParts]);

  // Handle save part
  const handleSave = useCallback(() => {
    if (validate()) {
      onSave({
        ...partData,
        questions: part?.questions || [],
      });
    }
  }, [validate, partData, part, onSave]);

  // Handle save questions
  const handleSaveQuestions = useCallback(
    (questions) => {
      // Deep clone to avoid mutation
      const clonedQuestions = JSON.parse(JSON.stringify(questions));
      onSave({
        ...partData,
        questions: clonedQuestions,
      });
      setShowQuestionEditor(false);
    },
    [partData, onSave]
  );

  if (!open) return null;

  return (
    <div className="part-editor-overlay" onClick={onCancel}>
      <div className="part-editor" onClick={(e) => e.stopPropagation()}>
        <div className="part-editor__header">
          <h3 className="part-editor__title">
            {part ? "Edit Part" : "Add New Part"}
          </h3>
          <button className="part-editor__close" onClick={onCancel}>
            ×
          </button>
        </div>

        <div className="part-editor__content">
          {/* Part Number */}
          <div className="part-editor__field">
            <label className="part-editor__label">
              Part Number <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="number"
              className={`part-editor__input ${
                errors.part_number ? "part-editor__input--error" : ""
              }`}
              value={partData.part_number}
              onChange={(e) => {
                const newPartNumber = parseInt(e.target.value) || 1;
                handleChange("part_number", newPartNumber);
                // Auto-update part name for Speaking
                if (partData.part_type === "SPEAKING" && !part) {
                  handleChange("part_name", getSpeakingPartName(newPartNumber));
                }
              }}
              min="1"
              max={
                examType === "LISTENING_READING"
                  ? "7"
                  : examType === "SPEAKING"
                  ? "5"
                  : undefined
              }
              disabled={!!part} // Disable when editing existing part
            />
            {errors.part_number && (
              <div className="part-editor__error">{errors.part_number}</div>
            )}
          </div>

          {/* Part Name */}
          <div className="part-editor__field">
            <label className="part-editor__label">
              Part Name <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              className={`part-editor__input ${
                errors.part_name ? "part-editor__input--error" : ""
              }`}
              placeholder="Part 1: Picture Description"
              value={partData.part_name}
              onChange={(e) => handleChange("part_name", e.target.value)}
              maxLength={100}
            />
            {errors.part_name && (
              <div className="part-editor__error">{errors.part_name}</div>
            )}
          </div>

          {/* Part Type */}
          <div className="part-editor__field">
            <label className="part-editor__label">
              Part Type <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <select
              className={`part-editor__select ${
                errors.part_type ? "part-editor__select--error" : ""
              }`}
              value={partData.part_type}
              onChange={(e) => handleChange("part_type", e.target.value)}
              disabled={examType !== "LISTENING_READING"}
            >
              {examType === "LISTENING_READING" && (
                <>
                  <option value="LISTENING">Listening</option>
                  <option value="READING">Reading</option>
                </>
              )}
              {examType === "SPEAKING" && (
                <option value="SPEAKING">Speaking</option>
              )}
              {examType === "WRITING" && (
                <option value="WRITING">Writing</option>
              )}
            </select>
            {errors.part_type && (
              <div className="part-editor__error">{errors.part_type}</div>
            )}
          </div>

          {/* Duration */}
          <div className="part-editor__field">
            <label className="part-editor__label">
              Duration (minutes) <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="number"
              className={`part-editor__input ${
                errors.duration_minutes ? "part-editor__input--error" : ""
              }`}
              value={partData.duration_minutes}
              onChange={(e) =>
                handleChange("duration_minutes", parseInt(e.target.value) || 0)
              }
              min="0"
            />
            {errors.duration_minutes && (
              <div className="part-editor__error">
                {errors.duration_minutes}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="part-editor__field">
            <label className="part-editor__label">Description</label>
            <textarea
              className="part-editor__textarea"
              placeholder="Enter description about this part..."
              value={partData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
            />
          </div>

          {/* Questions Section */}
          <div className="part-editor__questions-section">
            <div className="part-editor__questions-header">
              <h4 className="part-editor__questions-title">
                Questions ({part?.questions?.length || 0})
              </h4>
              <button
                className="part-editor__add-question-btn"
                onClick={() => setShowQuestionEditor(true)}
              >
                + Add Questions
              </button>
            </div>
            {part?.questions && part.questions.length > 0 && (
              <div className="part-editor__questions-preview">
                <p>
                  This part has {part.questions.length} question
                  {part.questions.length !== 1 ? "s" : ""}.
                </p>
                <p className="part-editor__questions-hint">
                  Click "Add Questions" to edit or add more questions.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="part-editor__footer">
          <button className="part-editor__cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="part-editor__save-btn" onClick={handleSave}>
            Save Part
          </button>
        </div>

        {/* Question Editor Modal */}
        {showQuestionEditor && (
          <QuestionEditor
            open={showQuestionEditor}
            partType={partData.part_type}
            partNumber={partData.part_number}
            questions={part?.questions || []}
            onSave={handleSaveQuestions}
            onCancel={() => setShowQuestionEditor(false)}
          />
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import "./PartEditor.scss";
import QuestionEditor from "./QuestionEditor";

/**
 * Component Modal để tạo/sửa Part
 * Cho phép nhập thông tin Part và tạo Questions cho Part đó
 */
export default function PartEditor({
  open,
  part = null,
  examType,
  defaultPartType = null,
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

  // Load data khi edit
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
      // Reset về giá trị mặc định khi tạo mới
      setPartData({
        part_number: 1,
        part_name: "",
        part_type: defaultPartType || "LISTENING",
        duration_minutes: 0,
        description: "",
        display_template: null,
      });
    }
    setErrors({});
  }, [part, defaultPartType, open]);

  // Xử lý thay đổi giá trị
  const handleChange = (field, value) => {
    setPartData((prev) => ({ ...prev, [field]: value }));
    // Xóa lỗi khi user nhập
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Validation
  const validate = () => {
    const newErrors = {};

    if (!partData.part_name || partData.part_name.trim().length === 0) {
      newErrors.part_name = "Tên Part là bắt buộc";
    } else if (partData.part_name.length > 100) {
      newErrors.part_name = "Tên Part không được vượt quá 100 ký tự";
    }

    if (!partData.part_type) {
      newErrors.part_type = "Loại Part là bắt buộc";
    }

    if (partData.duration_minutes < 0) {
      newErrors.duration_minutes = "Thời gian không được âm";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý lưu Part
  const handleSave = () => {
    if (validate()) {
      onSave({
        ...partData,
        questions: part?.questions || [],
      });
    }
  };

  // Xử lý lưu Questions
  const handleSaveQuestions = (questions) => {
    onSave({
      ...partData,
      questions: questions,
    });
    setShowQuestionEditor(false);
  };

  if (!open) return null;

  return (
    <div className="part-editor-overlay" onClick={onCancel}>
      <div className="part-editor" onClick={(e) => e.stopPropagation()}>
        <div className="part-editor__header">
          <h3 className="part-editor__title">
            {part ? "Sửa Part" : "Thêm Part mới"}
          </h3>
          <button className="part-editor__close" onClick={onCancel}>
            ×
          </button>
        </div>

        <div className="part-editor__content">
          {/* Part Number */}
          <div className="part-editor__field">
            <label className="part-editor__label">
              Số thứ tự Part <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="number"
              className={`part-editor__input ${errors.part_number ? "part-editor__input--error" : ""}`}
              value={partData.part_number}
              onChange={(e) => handleChange("part_number", parseInt(e.target.value) || 1)}
              min="1"
            />
            {errors.part_number && (
              <div className="part-editor__error">{errors.part_number}</div>
            )}
          </div>

          {/* Part Name */}
          <div className="part-editor__field">
            <label className="part-editor__label">
              Tên Part <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              className={`part-editor__input ${errors.part_name ? "part-editor__input--error" : ""}`}
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
              Loại Part <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <select
              className={`part-editor__select ${errors.part_type ? "part-editor__select--error" : ""}`}
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
              {examType === "SPEAKING" && <option value="SPEAKING">Speaking</option>}
              {examType === "WRITING" && <option value="WRITING">Writing</option>}
            </select>
            {errors.part_type && (
              <div className="part-editor__error">{errors.part_type}</div>
            )}
          </div>

          {/* Duration */}
          <div className="part-editor__field">
            <label className="part-editor__label">
              Thời gian (phút) <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="number"
              className={`part-editor__input ${errors.duration_minutes ? "part-editor__input--error" : ""}`}
              value={partData.duration_minutes}
              onChange={(e) => handleChange("duration_minutes", parseInt(e.target.value) || 0)}
              min="0"
            />
            {errors.duration_minutes && (
              <div className="part-editor__error">{errors.duration_minutes}</div>
            )}
          </div>

          {/* Description */}
          <div className="part-editor__field">
            <label className="part-editor__label">Mô tả</label>
            <textarea
              className="part-editor__textarea"
              placeholder="Nhập mô tả về Part này..."
              value={partData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
            />
          </div>

          {/* Questions Section */}
          <div className="part-editor__questions-section">
            <div className="part-editor__questions-header">
              <h4 className="part-editor__questions-title">
                Câu hỏi ({part?.questions?.length || 0})
              </h4>
              <button
                className="part-editor__add-question-btn"
                onClick={() => setShowQuestionEditor(true)}
              >
                + Thêm câu hỏi
              </button>
            </div>
          </div>
        </div>

        <div className="part-editor__footer">
          <button className="part-editor__cancel-btn" onClick={onCancel}>
            Hủy
          </button>
          <button className="part-editor__save-btn" onClick={handleSave}>
            Lưu Part
          </button>
        </div>

        {/* Question Editor Modal */}
        {showQuestionEditor && (
          <QuestionEditor
            open={showQuestionEditor}
            partType={partData.part_type}
            questions={part?.questions || []}
            onSave={handleSaveQuestions}
            onCancel={() => setShowQuestionEditor(false)}
          />
        )}
      </div>
    </div>
  );
}


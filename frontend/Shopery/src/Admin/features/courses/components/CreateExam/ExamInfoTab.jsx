import React, { useEffect, forwardRef } from "react";
import "./ExamInfoTab.scss";

/**
 * Exam Info Tab Component
 * Form for entering basic exam information
 */
const ExamInfoTab = forwardRef(({ data, onChange, errors = {}, refs = {} }, ref) => {
  const {
    title = "",
    description = "",
    exam_type = "TOEIC",
    total_duration = 120,
    difficulty_level = "MEDIUM",
  } = data;

  // Handle field changes
  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  return (
    <div className="exam-info-tab">
      <h2 className="exam-info-tab__title">Exam Information</h2>

      {/* Exam Title */}
      <div className="exam-info-tab__field">
        <label className="exam-info-tab__label">
          Exam Title <span style={{ color: "#ef4444" }}>*</span>
        </label>
        <input
          ref={refs?.titleRef}
          type="text"
          className={`exam-info-tab__input ${errors.title ? "exam-info-tab__input--error" : ""}`}
          placeholder="TOEIC Practice Test 1"
          value={title}
          onChange={(e) => handleChange("title", e.target.value)}
          maxLength={255}
        />
        <div className="exam-info-tab__helper">
          Title must be at least 3 characters and no more than 255 characters.
        </div>
        {errors.title && (
          <div className="exam-info-tab__error">{errors.title.message || errors.title}</div>
        )}
      </div>

      {/* Exam Description */}
      <div className="exam-info-tab__field">
        <label className="exam-info-tab__label">
          Description <span style={{ color: "#ef4444" }}>*</span>
        </label>
        <textarea
          ref={refs?.descriptionRef}
          className={`exam-info-tab__textarea ${errors.description ? "exam-info-tab__textarea--error" : ""}`}
          placeholder="Enter detailed description about the exam..."
          value={description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={6}
        />
        <div className="exam-info-tab__helper">
          HTML or plain text allowed. No emoji. This field is required.
        </div>
        {errors.description && (
          <div className="exam-info-tab__error">{errors.description.message || errors.description}</div>
        )}
      </div>

      {/* Exam Type */}
      <div className="exam-info-tab__field">
        <label className="exam-info-tab__label">
          Exam Type <span style={{ color: "#ef4444" }}>*</span>
        </label>
        <select
          ref={refs?.examTypeRef}
          className={`exam-info-tab__select ${errors.exam_type ? "exam-info-tab__select--error" : ""}`}
          value={exam_type}
          onChange={(e) => handleChange("exam_type", e.target.value)}
        >
          <option value="TOEIC">TOEIC</option>
          <option value="IELTS">IELTS</option>
        </select>
        <div className="exam-info-tab__helper">
          Select the exam type that matches your content.
        </div>
        {errors.exam_type && (
          <div className="exam-info-tab__error">{errors.exam_type.message || errors.exam_type}</div>
        )}
      </div>

      {/* Duration */}
      <div className="exam-info-tab__field">
        <label className="exam-info-tab__label">
          Duration (minutes) <span style={{ color: "#ef4444" }}>*</span>
        </label>
        <input
          ref={refs?.totalDurationRef}
          type="number"
          className={`exam-info-tab__input ${errors.total_duration ? "exam-info-tab__input--error" : ""}`}
          placeholder="120"
          value={total_duration}
          onChange={(e) => handleChange("total_duration", parseInt(e.target.value) || 0)}
          min="0"
          max="600"
        />
        <div className="exam-info-tab__helper">
          Exam duration in minutes. Must be 0 or greater and not exceed 600 minutes. Enter 0 for no time limit.
        </div>
        {errors.total_duration && (
          <div className="exam-info-tab__error">
            {errors.total_duration.message || errors.total_duration}
          </div>
        )}
      </div>

      {/* Difficulty Level */}
      <div className="exam-info-tab__field">
        <label className="exam-info-tab__label">
          Difficulty Level <span style={{ color: "#ef4444" }}>*</span>
        </label>
        <select
          ref={refs?.difficultyLevelRef}
          className={`exam-info-tab__select ${errors.difficulty_level ? "exam-info-tab__select--error" : ""}`}
          value={difficulty_level}
          onChange={(e) => handleChange("difficulty_level", e.target.value)}
        >
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>
        <div className="exam-info-tab__helper">
          Select the difficulty level appropriate for your students.
        </div>
        {errors.difficulty_level && (
          <div className="exam-info-tab__error">
            {errors.difficulty_level.message || errors.difficulty_level}
          </div>
        )}
      </div>
    </div>
  );
});

ExamInfoTab.displayName = "ExamInfoTab";

export default ExamInfoTab;

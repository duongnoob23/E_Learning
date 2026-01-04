import React, { useEffect, forwardRef } from "react";
import "./ExamInfoTab.scss";

/**
 * Component hiển thị form nhập thông tin chi tiết bài thi
 * Tương tự CourseInfoTab nhưng dành cho Exam
 */
const ExamInfoTab = forwardRef(({ data, onChange, errors = {}, refs = {} }, ref) => {
  const {
    title = "",
    description = "",
    exam_type = "TOEIC",
    total_duration = 120,
    difficulty_level = "MEDIUM",
  } = data;

  // Xử lý thay đổi giá trị
  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  return (
    <div className="exam-info-tab">
      <h2 className="exam-info-tab__title">Thông tin bài thi</h2>

      {/* Tiêu đề bài thi */}
      <div className="exam-info-tab__field">
        <label className="exam-info-tab__label">
          Tiêu đề bài thi <span style={{ color: "#ef4444" }}>*</span>
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
          Tiêu đề phải có ít nhất 3 ký tự và không quá 255 ký tự.
        </div>
        {errors.title && (
          <div className="exam-info-tab__error">{errors.title.message || errors.title}</div>
        )}
      </div>

      {/* Mô tả bài thi */}
      <div className="exam-info-tab__field">
        <label className="exam-info-tab__label">
          Mô tả bài thi <span style={{ color: "#ef4444" }}>*</span>
        </label>
        <textarea
          ref={refs?.descriptionRef}
          className={`exam-info-tab__textarea ${errors.description ? "exam-info-tab__textarea--error" : ""}`}
          placeholder="Nhập mô tả chi tiết về bài thi..."
          value={description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={6}
        />
        <div className="exam-info-tab__helper">
          HTML hoặc văn bản thuần được phép. Không sử dụng emoji. Trường này là bắt buộc.
        </div>
        {errors.description && (
          <div className="exam-info-tab__error">{errors.description.message || errors.description}</div>
        )}
      </div>

      {/* Loại bài thi */}
      <div className="exam-info-tab__field">
        <label className="exam-info-tab__label">
          Loại bài thi <span style={{ color: "#ef4444" }}>*</span>
        </label>
        <select
          ref={refs?.examTypeRef}
          className={`exam-info-tab__select ${errors.exam_type ? "exam-info-tab__select--error" : ""}`}
          value={exam_type}
          onChange={(e) => handleChange("exam_type", e.target.value)}
        >
          <option value="TOEIC">TOEIC</option>
          <option value="IELTS">IELTS</option>
          <option value="HSK">HSK</option>
          <option value="THPT">THPT</option>
        </select>
        <div className="exam-info-tab__helper">
          Chọn loại bài thi phù hợp với nội dung bạn đang tạo.
        </div>
        {errors.exam_type && (
          <div className="exam-info-tab__error">{errors.exam_type.message || errors.exam_type}</div>
        )}
      </div>

      {/* Thời gian làm bài */}
      <div className="exam-info-tab__field">
        <label className="exam-info-tab__label">
          Thời gian làm bài (phút) <span style={{ color: "#ef4444" }}>*</span>
        </label>
        <input
          ref={refs?.totalDurationRef}
          type="number"
          className={`exam-info-tab__input ${errors.total_duration ? "exam-info-tab__input--error" : ""}`}
          placeholder="120"
          value={total_duration}
          onChange={(e) => handleChange("total_duration", parseInt(e.target.value) || 0)}
          min="1"
          max="600"
        />
        <div className="exam-info-tab__helper">
          Thời gian làm bài tính bằng phút. Phải lớn hơn 0 và không quá 600 phút.
        </div>
        {errors.total_duration && (
          <div className="exam-info-tab__error">
            {errors.total_duration.message || errors.total_duration}
          </div>
        )}
      </div>

      {/* Mức độ khó */}
      <div className="exam-info-tab__field">
        <label className="exam-info-tab__label">
          Mức độ khó <span style={{ color: "#ef4444" }}>*</span>
        </label>
        <select
          ref={refs?.difficultyLevelRef}
          className={`exam-info-tab__select ${errors.difficulty_level ? "exam-info-tab__select--error" : ""}`}
          value={difficulty_level}
          onChange={(e) => handleChange("difficulty_level", e.target.value)}
        >
          <option value="EASY">Dễ</option>
          <option value="MEDIUM">Trung bình</option>
          <option value="HARD">Khó</option>
        </select>
        <div className="exam-info-tab__helper">
          Chọn mức độ khó phù hợp với trình độ của học viên.
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


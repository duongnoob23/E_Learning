import React, { useState, useEffect } from "react";
import { HiXMark } from "react-icons/hi2";
import "./LessonFormModal.scss";

const VIDEO_SOURCES = ["YouTube", "Vimeo", "Google Drive", "Local Upload"];

export default function LessonFormModal({ open, onClose, lesson, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoSource: "",
    videoUrl: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title || "",
        description: lesson.description || "",
        videoSource: lesson.videoSource || "",
        videoUrl: lesson.videoUrl || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        videoSource: "",
        videoUrl: "",
      });
    }
    setErrors({});
  }, [lesson, open]);

  if (!open) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Lesson title is required";
    }
    if (!formData.videoUrl.trim()) {
      newErrors.videoUrl = "Video URL is required";
    } else if (formData.videoSource === "YouTube" && !formData.videoUrl.includes("youtube.com/watch")) {
      newErrors.videoUrl = "Invalid YouTube URL format";
    } else if (formData.videoSource === "Vimeo" && !formData.videoUrl.includes("vimeo.com")) {
      newErrors.videoUrl = "Invalid Vimeo URL format";
    } else if (formData.videoSource === "Google Drive" && !formData.videoUrl.includes("drive.google.com")) {
      newErrors.videoUrl = "Invalid Google Drive URL format";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <div
      className="lesson-form-modal__backdrop"
      onMouseDown={(e) => {
        if (e.target.classList.contains("lesson-form-modal__backdrop")) {
          onClose();
        }
      }}
    >
      <div
        className="lesson-form-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="lesson-form-modal__header">
          <h3>{lesson ? "Edit Lesson" : "Add New Lesson"}</h3>
          <button className="lesson-form-modal__close" onClick={onClose}>
            <HiXMark />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="lesson-form-modal__content">
          <div className="lesson-form-modal__field">
            <label>
              Lesson Title <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter lesson title"
              className={errors.title ? "lesson-form-modal__input--error" : ""}
            />
            {errors.title && (
              <div className="lesson-form-modal__error">{errors.title}</div>
            )}
          </div>

          <div className="lesson-form-modal__field">
            <label>Lesson Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter lesson description"
              rows={4}
            />
          </div>

          <div className="lesson-form-modal__field">
            <label>
              Video Source <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <select
              value={formData.videoSource}
              onChange={(e) => handleChange("videoSource", e.target.value)}
            >
              <option value="">Select a source</option>
              {VIDEO_SOURCES.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>

          {formData.videoSource && (
            <div className="lesson-form-modal__field">
              <label>
                Video URL <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="text"
                value={formData.videoUrl}
                onChange={(e) => handleChange("videoUrl", e.target.value)}
                placeholder="Add Your Video URL here."
                className={errors.videoUrl ? "lesson-form-modal__input--error" : ""}
              />
              {errors.videoUrl && (
                <div className="lesson-form-modal__error">{errors.videoUrl}</div>
              )}
              <div className="lesson-form-modal__helper">
                Example:{" "}
                {formData.videoSource === "YouTube"
                  ? "https://www.youtube.com/watch?v=yourvideoid"
                  : formData.videoSource === "Vimeo"
                  ? "https://vimeo.com/123456789"
                  : formData.videoSource === "Google Drive"
                  ? "https://drive.google.com/file/d/yourfileid/view"
                  : "Upload a video file from your device"}
              </div>
            </div>
          )}

          <div className="lesson-form-modal__footer">
            <button
              type="button"
              className="lesson-form-modal__btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="lesson-form-modal__btn lesson-form-modal__btn--primary"
            >
              {lesson ? "Update Lesson" : "Add Lesson"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


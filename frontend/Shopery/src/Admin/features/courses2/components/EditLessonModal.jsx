import React, { useState, useEffect } from "react";
import { useUpdateLesson } from "../hooks/useCoursesAdminMutations";
import "./EditLessonModal.scss";

const VIDEO_SOURCES = ["YouTube", "Vimeo", "Google Drive", "Local Upload"];

const VIDEO_EXAMPLES = {
  YouTube: "https://www.youtube.com/watch?v=yourvideoid",
  Vimeo: "https://vimeo.com/123456789",
  "Google Drive": "https://drive.google.com/file/d/yourfileid/view",
  "Local Upload": "Upload a video file from your device",
};

export default function EditLessonModal({ open, onClose, lesson, courseId, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoSource: "",
    videoUrl: "",
  });
  const [errors, setErrors] = useState({});

  const updateLessonMutation = useUpdateLesson();

  useEffect(() => {
    if (lesson) {
      // Detect video source from URL
      let videoSource = "";
      if (lesson.video_url) {
        if (lesson.video_url.includes("youtube.com") || lesson.video_url.includes("youtu.be")) {
          videoSource = "YouTube";
        } else if (lesson.video_url.includes("vimeo.com")) {
          videoSource = "Vimeo";
        } else if (lesson.video_url.includes("drive.google.com")) {
          videoSource = "Google Drive";
        } else {
          videoSource = "Local Upload";
        }
      }

      setFormData({
        title: lesson.title || "",
        description: lesson.description || lesson.content || "",
        videoSource: videoSource,
        videoUrl: lesson.video_url || "",
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
    } else if (formData.videoSource === "YouTube" && !formData.videoUrl.includes("youtube.com/watch") && !formData.videoUrl.includes("youtu.be")) {
      newErrors.videoUrl = "Invalid YouTube URL format";
    } else if (formData.videoSource === "Vimeo" && !formData.videoUrl.includes("vimeo.com")) {
      newErrors.videoUrl = "Invalid Vimeo URL format";
    } else if (formData.videoSource === "Google Drive" && !formData.videoUrl.includes("drive.google.com")) {
      newErrors.videoUrl = "Invalid Google Drive URL format";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    if (!lesson?.lesson_id) {
      alert("Lesson ID is missing");
      return;
    }

    try {
      const payload = {
        title: formData.title,
        description: formData.description || null,
        video_url: formData.videoUrl,
        video_duration: null, // Can be calculated later if needed
        lesson_type: "video",
        is_free: false, // Can be added to form if needed
      };

      const result = await updateLessonMutation.mutateAsync({
        lessonId: lesson.lesson_id,
        payload,
        courseId,
      });

      if (result?.EC !== "0") {
        throw new Error(result?.EM || "Cập nhật bài học thất bại");
      }

      if (onSuccess) {
        onSuccess(result);
      }
      onClose();
    } catch (error) {
      console.error("Error updating lesson:", error);
      alert(error.message || "Có lỗi xảy ra khi cập nhật bài học");
    }
  };

  return (
    <div
      className="admin-edit-lesson-modal__backdrop"
      onMouseDown={(e) => {
        if (e.target.classList.contains("admin-edit-lesson-modal__backdrop")) {
          onClose();
        }
      }}
    >
      <div
        className="admin-edit-lesson-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="admin-edit-lesson-modal__header">
          <h3>Edit Lesson</h3>
          <button className="admin-btn-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-edit-lesson-modal__content">
          <div className="admin-edit-lesson-modal__field">
            <label>
              Lesson Title <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter lesson title"
              className={errors.title ? "admin-edit-lesson-modal__input--error" : ""}
            />
            {errors.title && (
              <div className="admin-edit-lesson-modal__error">{errors.title}</div>
            )}
          </div>

          <div className="admin-edit-lesson-modal__field">
            <label>Lesson Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter lesson description"
              rows={4}
            />
          </div>

          <div className="admin-edit-lesson-modal__field">
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
            <div className="admin-edit-lesson-modal__field">
              <label>
                Video URL <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="text"
                value={formData.videoUrl}
                onChange={(e) => handleChange("videoUrl", e.target.value)}
                placeholder="Add Your Video URL here."
                className={errors.videoUrl ? "admin-edit-lesson-modal__input--error" : ""}
              />
              {errors.videoUrl && (
                <div className="admin-edit-lesson-modal__error">{errors.videoUrl}</div>
              )}
              <div className="admin-edit-lesson-modal__helper">
                Example: {VIDEO_EXAMPLES[formData.videoSource]}
              </div>
            </div>
          )}

          <div className="admin-edit-lesson-modal__footer">
            <button
              type="button"
              className="admin-edit-lesson-modal__btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-edit-lesson-modal__btn admin-edit-lesson-modal__btn--primary"
              disabled={updateLessonMutation.isPending}
            >
              {updateLessonMutation.isPending ? "Updating..." : "Update Lesson"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


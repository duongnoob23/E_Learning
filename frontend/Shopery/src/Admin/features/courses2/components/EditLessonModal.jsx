import React, { useState, useEffect } from "react";
import { HiXMark } from "react-icons/hi2";
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
      // Load video_url từ lesson.video_url hoặc lesson.lesson_data.video_url
      const videoUrl = lesson.video_url || lesson.lesson_data?.video_url || "";
      // Load video_type từ lesson.lesson_data.video_type để xác định source chính xác
      const videoType = lesson.lesson_data?.video_type || "";
      
      // Detect video source từ URL và video_type
      let videoSource = "";
      if (videoUrl) {
        if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
          videoSource = "YouTube";
        } else if (videoUrl.includes("vimeo.com")) {
          videoSource = "Vimeo";
        } else if (videoUrl.includes("drive.google.com")) {
          videoSource = "Google Drive";
        } else if (videoUrl.includes("storage.googleapis.com") || 
                   videoUrl.includes("googleapis.com") ||
                   videoUrl.match(/\.(mp4|webm|ogg|mov|avi)$/i)) {
          // Google Cloud Storage hoặc direct video URL
          videoSource = "Local Upload";
        } else {
          videoSource = "Local Upload";
        }
      }
      
      // Nếu có video_type trong lesson_data, ưu tiên dùng nó để xác định source
      if (videoType === "direct" && videoSource === "Local Upload") {
        // Giữ nguyên Local Upload cho Google Cloud Storage
      } else if (videoType === "youtube" && videoSource !== "YouTube") {
        // Nếu video_type là youtube nhưng detect không đúng, ưu tiên video_type
        videoSource = "YouTube";
      }

      setFormData({
        title: lesson.title || "",
        description: lesson.description || lesson.content || "",
        videoSource: videoSource,
        videoUrl: videoUrl,
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
    
    // Chỉ validate video URL nếu lesson_type là "video"
    if (lesson?.lesson_type === "video") {
      if (!formData.videoUrl.trim()) {
        newErrors.videoUrl = "Video URL is required";
      } else if (formData.videoSource === "YouTube" && !formData.videoUrl.includes("youtube.com/watch") && !formData.videoUrl.includes("youtu.be")) {
        newErrors.videoUrl = "Invalid YouTube URL format";
      } else if (formData.videoSource === "Vimeo" && !formData.videoUrl.includes("vimeo.com")) {
        newErrors.videoUrl = "Invalid Vimeo URL format";
      } else if (formData.videoSource === "Google Drive" && !formData.videoUrl.includes("drive.google.com")) {
        newErrors.videoUrl = "Invalid Google Drive URL format";
      }
      // Local Upload và Google Cloud Storage không cần validate format nghiêm ngặt
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
      // Detect video_type từ videoSource và URL
      let detectedVideoType = "youtube";
      if (formData.videoSource === "YouTube") {
        detectedVideoType = "youtube";
      } else if (formData.videoSource === "Local Upload" || 
                 formData.videoUrl.includes("storage.googleapis.com") ||
                 formData.videoUrl.includes("googleapis.com") ||
                 formData.videoUrl.match(/\.(mp4|webm|ogg|mov|avi)$/i)) {
        detectedVideoType = "direct";
      }

      // QUAN TRỌNG: Giữ nguyên lesson_type hiện tại, không hardcode "video"
      const currentLessonType = lesson.lesson_type || "video";
      
      const payload = {
        title: formData.title,
        description: formData.description || null,
        lesson_type: currentLessonType, // Giữ nguyên lesson_type hiện tại
        is_free: lesson.is_free !== undefined ? lesson.is_free : false,
      };

      // Chỉ update video_url và video_duration nếu lesson_type là "video"
      if (currentLessonType === "video") {
        payload.video_url = formData.videoUrl;
        payload.video_duration = lesson.video_duration || null;
        
        // Lưu video_type vào lesson_data để VideoLesson component có thể đọc
        payload.lesson_data = {
          ...(lesson.lesson_data || {}),
          video_type: detectedVideoType,
          video_url: formData.videoUrl,
          content: formData.description || lesson.lesson_data?.content || "",
        };
      } else {
        // Với các lesson type khác, giữ nguyên lesson_data hiện tại
        if (lesson.lesson_data) {
          payload.lesson_data = lesson.lesson_data;
        }
      }

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
            <HiXMark />
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

          {/* Chỉ hiển thị video fields nếu lesson_type là "video" */}
          {lesson?.lesson_type === "video" ? (
            <>
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
            </>
          ) : (
            /* Hiển thị thông báo cho các lesson type khác */
            <div className="admin-edit-lesson-modal__field">
              <div className="admin-edit-lesson-modal__helper" style={{ 
                backgroundColor: "#f0f9ff", 
                border: "1px solid #bae6fd",
                padding: "12px",
                borderRadius: "4px"
              }}>
                ℹ️ Loại bài học: <strong>{lesson?.lesson_type || "N/A"}</strong>. 
                Để chỉnh sửa nội dung chi tiết, vui lòng sử dụng Lesson Studio từ Course Builder.
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


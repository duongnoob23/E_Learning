// VideoLessonEditor.jsx - Editor cho Video Lesson
// Hỗ trợ: YouTube URL, Google Cloud Storage URL, nội dung mô tả
import React, { useState, useRef, useEffect, useCallback } from "react";
import VideoLesson from "../../Video/VideoLesson";
import "./VideoLessonEditor.css";

export default function VideoLessonEditor({ data, onChange }) {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoType, setVideoType] = useState("youtube"); // "youtube" hoặc "direct"
  const [content, setContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const isInitialMount = useRef(true);

  // Load data từ props
  useEffect(() => {
    if (data) {
      setVideoUrl(data.video_url || data.lesson_data?.video_url || "");
      setVideoType(data.video_type || data.lesson_data?.video_type || "youtube");
      setContent(data.content || data.lesson_data?.content || "");
    }
    isInitialMount.current = false;
  }, [data]);

  // Update data và gửi lên parent
  const updateData = useCallback(() => {
    if (isInitialMount.current) return;

    onChange({
      type: "video_lesson",
      video_url: videoUrl.trim(),
      video_type: videoType,
      content: content.trim(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoUrl, videoType, content]); // Bỏ onChange để tránh vòng lặp

  // Debounce updateData
  useEffect(() => {
    if (isInitialMount.current) return;

    const timer = setTimeout(() => {
      updateData();
    }, 300);

    return () => clearTimeout(timer);
  }, [videoUrl, videoType, content, updateData]);

  // Auto-detect video type từ URL
  const handleVideoUrlChange = (value) => {
    setVideoUrl(value);

    // Auto-detect: nếu URL là YouTube thì set type là youtube
    if (value) {
      try {
        const urlObj = new URL(value);
        const isYouTube =
          urlObj.hostname.includes("youtube.com") ||
          urlObj.hostname.includes("youtu.be");
        if (isYouTube) {
          setVideoType("youtube");
        } else if (videoType === "youtube") {
          // Nếu đang là youtube nhưng URL không phải YouTube, chuyển sang direct
          setVideoType("direct");
        }
      } catch {
        // Invalid URL, giữ nguyên type
      }
    }
  };

  // Validate
  const validate = () => {
    const errors = [];
    if (!videoUrl.trim()) {
      errors.push("Vui lòng nhập video URL");
    }
    return errors;
  };

  // Toggle preview
  const handleTogglePreview = () => {
    const errors = validate();
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }
    setShowPreview(!showPreview);
  };

  // Tạo lesson data cho preview
  const getPreviewLessonData = () => {
    return {
      title: "Video Lesson Preview",
      lesson_data: {
        video_url: videoUrl.trim(),
        video_type: videoType,
        content: content.trim(),
      },
    };
  };

  const errors = validate();
  const isValid = errors.length === 0;

  return (
    <div className="video-lesson-editor">
      {/* Header */}
      <div className="vle-header">
        <h3 className="vle-title">Video Lesson</h3>
        <button
          className={`vle-preview-btn ${isValid ? "" : "disabled"}`}
          onClick={handleTogglePreview}
          disabled={!isValid}
        >
          {showPreview ? "✕ Đóng Preview" : "👁 Preview"}
        </button>
      </div>

      {showPreview ? (
        /* Preview mode */
        <div className="vle-preview-container">
          <div className="vle-preview-header">
            <span>Preview</span>
            <button
              className="vle-close-preview"
              onClick={() => setShowPreview(false)}
            >
              ✕
            </button>
          </div>
          <div className="vle-preview-content">
            <VideoLesson lesson={getPreviewLessonData()} />
          </div>
        </div>
      ) : (
        /* Editor mode */
        <>
          {/* Errors */}
          {errors.length > 0 && (
            <div className="vle-errors">
              {errors.map((error, idx) => (
                <span key={idx} className="vle-error">
                  ⚠️ {error}
                </span>
              ))}
            </div>
          )}

          {/* Video URL Section */}
          <div className="vle-section">
            <label className="vle-label">
              Video URL <span className="required">*</span>
            </label>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => handleVideoUrlChange(e.target.value)}
              className="vle-input"
              placeholder="https://www.youtube.com/watch?v=... hoặc https://storage.googleapis.com/..."
            />
            <p className="vle-hint">
              💡 Hỗ trợ: YouTube URL hoặc Google Cloud Storage URL (MP4, WebM)
            </p>
          </div>

          {/* Video Type */}
          <div className="vle-section">
            <label className="vle-label">Loại video</label>
            <div className="vle-radio-group">
              <label className="vle-radio-label">
                <input
                  type="radio"
                  value="youtube"
                  checked={videoType === "youtube"}
                  onChange={(e) => setVideoType(e.target.value)}
                  className="vle-radio"
                />
                <span>YouTube</span>
              </label>
              <label className="vle-radio-label">
                <input
                  type="radio"
                  value="direct"
                  checked={videoType === "direct"}
                  onChange={(e) => setVideoType(e.target.value)}
                  className="vle-radio"
                />
                <span>Direct Video (Google Cloud / URL trực tiếp)</span>
              </label>
            </div>
            <p className="vle-hint">
              💡 Hệ thống sẽ tự động phát hiện loại video từ URL. Bạn có thể chọn thủ công nếu cần.
            </p>
          </div>

          {/* Content Section */}
          <div className="vle-section">
            <label className="vle-label">Nội dung bài học</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="vle-textarea"
              placeholder="Nhập nội dung mô tả bài học (tùy chọn)..."
              rows={8}
            />
            <p className="vle-hint">
              💡 Nội dung này sẽ hiển thị bên dưới video để học viên tham khảo.
            </p>
          </div>

          {/* Examples */}
          <div className="vle-examples">
            <h4 className="vle-examples-title">📝 Ví dụ URL:</h4>
            <div className="vle-examples-list">
              <div className="vle-example-item">
                <strong>YouTube:</strong>
                <code>https://www.youtube.com/watch?v=dQw4w9WgXcQ</code>
              </div>
              <div className="vle-example-item">
                <strong>YouTube (short):</strong>
                <code>https://youtu.be/dQw4w9WgXcQ</code>
              </div>
              <div className="vle-example-item">
                <strong>Google Cloud Storage:</strong>
                <code>https://storage.googleapis.com/bucket-name/video.mp4</code>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


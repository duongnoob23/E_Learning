// VideoLessonEditor.jsx - Editor cho Video Lesson
// Hỗ trợ: YouTube URL, Google Cloud Storage URL, nội dung mô tả (HTML)
// Sử dụng TipTap để tránh lỗi findDOMNode của React 19
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useCallback, useEffect, useRef, useState } from "react";
import VideoLesson from "../../Video/VideoLesson";
import "./VideoLessonEditor.css";

export default function VideoLessonEditor({ data, onChange }) {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoType, setVideoType] = useState("youtube"); // "youtube" hoặc "direct"
  const [content, setContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const isInitialMount = useRef(true);
  const prevDataRef = useRef(null);

  // TipTap editor cho content
  const contentEditor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ allowBase64: true }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content || "<p></p>",
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  // Update editor content khi content state thay đổi từ data load ban đầu
  const prevContentRef = useRef(null);
  useEffect(() => {
    if (contentEditor && content !== prevContentRef.current) {
      const editorHtml = contentEditor.getHTML();
      // Chỉ update nếu content khác với editor content (tránh vòng lặp)
      if (content && content !== editorHtml && content !== "<p></p>") {
        contentEditor.commands.setContent(content);
      }
      prevContentRef.current = content;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, contentEditor]);

  // Cleanup editor khi unmount
  useEffect(() => {
    return () => {
      if (contentEditor) {
        contentEditor.destroy();
      }
    };
  }, [contentEditor]);

  // Load data từ props
  useEffect(() => {
    const dataReferenceChanged = prevDataRef.current !== data;

    // Reset flag khi data reference thay đổi (có thể là lesson khác)
    if (dataReferenceChanged && !isInitialMount.current) {
      // Detect lesson khác bằng cách so sánh video_url
      const prevVideoUrl =
        prevDataRef.current?.video_url ||
        prevDataRef.current?.lesson_data?.video_url ||
        "";
      const currentVideoUrl =
        data?.video_url || data?.lesson_data?.video_url || "";

      if (prevVideoUrl !== currentVideoUrl) {
        // Lesson khác - reset và load lại
        isInitialMount.current = true;
      }
    }

    if (dataReferenceChanged) {
      prevDataRef.current = data;
    }

    if (data && isInitialMount.current) {
      // Lần đầu mount hoặc lesson khác - load data
      const videoUrlFromData =
        data.video_url || data.lesson_data?.video_url || "";
      const videoTypeFromData = data.video_type || data.lesson_data?.video_type;
      const contentFromData = data.content || data.lesson_data?.content || "";

      setVideoUrl(videoUrlFromData);
      setContent(contentFromData);

      if (videoTypeFromData) {
        setVideoType(videoTypeFromData);
      } else if (videoUrlFromData) {
        try {
          const urlObj = new URL(videoUrlFromData);
          const isYouTube =
            urlObj.hostname.includes("youtube.com") ||
            urlObj.hostname.includes("youtu.be");
          const isGoogleCloud =
            urlObj.hostname.includes("storage.googleapis.com") ||
            urlObj.hostname.includes("googleapis.com") ||
            videoUrlFromData.match(/\.(mp4|webm|ogg|mov|avi)$/i);

          setVideoType(
            isYouTube ? "youtube" : isGoogleCloud ? "direct" : "youtube"
          );
        } catch {
          const detectedType = videoUrlFromData.match(
            /\.(mp4|webm|ogg|mov|avi)$/i
          )
            ? "direct"
            : "youtube";
          setVideoType(detectedType);
        }
      } else {
        setVideoType("youtube");
      }
      isInitialMount.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Update data và gửi lên parent
  const updateData = useCallback(() => {
    if (isInitialMount.current) return;

    onChange({
      type: "video_lesson",
      video_url: videoUrl.trim(),
      video_type: videoType,
      // QUAN TRỌNG: Không trim content vì có thể là HTML với whitespace quan trọng
      content: content || "",
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

    // Auto-detect: nếu URL là YouTube thì set type là youtube, Google Cloud thì direct
    if (value) {
      try {
        const urlObj = new URL(value);
        const isYouTube =
          urlObj.hostname.includes("youtube.com") ||
          urlObj.hostname.includes("youtu.be");
        const isGoogleCloud =
          urlObj.hostname.includes("storage.googleapis.com") ||
          urlObj.hostname.includes("googleapis.com") ||
          value.match(/\.(mp4|webm|ogg|mov|avi)$/i);

        if (isYouTube) {
          setVideoType("youtube");
        } else if (isGoogleCloud) {
          setVideoType("direct");
        } else if (videoType === "youtube" && !isYouTube) {
          // Nếu đang là youtube nhưng URL không phải YouTube, chuyển sang direct
          setVideoType("direct");
        }
      } catch {
        // Invalid URL hoặc không parse được, kiểm tra extension
        if (value.match(/\.(mp4|webm|ogg|mov|avi)$/i)) {
          setVideoType("direct");
        }
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
              💡 Hệ thống sẽ tự động phát hiện loại video từ URL. Bạn có thể
              chọn thủ công nếu cần.
            </p>
          </div>

          {/* Content Section */}
          <div className="vle-section">
            <label className="vle-label">Nội dung bài học</label>
            {contentEditor && (
              <div className="vle-content-editor-wrapper">
                <div className="vle-toolbar">
                  <button
                    type="button"
                    className={`vle-toolbar-btn ${
                      contentEditor.isActive("bold") ? "active" : ""
                    }`}
                    onClick={() =>
                      contentEditor.chain().focus().toggleBold().run()
                    }
                  >
                    B
                  </button>
                  <button
                    type="button"
                    className={`vle-toolbar-btn ${
                      contentEditor.isActive("italic") ? "active" : ""
                    }`}
                    onClick={() =>
                      contentEditor.chain().focus().toggleItalic().run()
                    }
                  >
                    I
                  </button>
                  <button
                    type="button"
                    className={`vle-toolbar-btn ${
                      contentEditor.isActive("heading", { level: 1 })
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      contentEditor
                        .chain()
                        .focus()
                        .toggleHeading({ level: 1 })
                        .run()
                    }
                  >
                    H1
                  </button>
                  <button
                    type="button"
                    className={`vle-toolbar-btn ${
                      contentEditor.isActive("heading", { level: 2 })
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      contentEditor
                        .chain()
                        .focus()
                        .toggleHeading({ level: 2 })
                        .run()
                    }
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    className={`vle-toolbar-btn ${
                      contentEditor.isActive("bulletList") ? "active" : ""
                    }`}
                    onClick={() =>
                      contentEditor.chain().focus().toggleBulletList().run()
                    }
                  >
                    •
                  </button>
                  <button
                    type="button"
                    className={`vle-toolbar-btn ${
                      contentEditor.isActive("orderedList") ? "active" : ""
                    }`}
                    onClick={() =>
                      contentEditor.chain().focus().toggleOrderedList().run()
                    }
                  >
                    1.
                  </button>
                  <button
                    type="button"
                    className={`vle-toolbar-btn ${
                      contentEditor.isActive("link") ? "active" : ""
                    }`}
                    onClick={() => {
                      const url = window.prompt(
                        "Nhập URL",
                        contentEditor.getAttributes("link").href || ""
                      );
                      if (url === null) return;
                      if (url === "")
                        return contentEditor.chain().focus().unsetLink().run();
                      contentEditor
                        .chain()
                        .focus()
                        .setLink({ href: url, target: "_blank" })
                        .run();
                    }}
                  >
                    Link
                  </button>
                  <button
                    type="button"
                    className="vle-toolbar-btn"
                    onClick={() => {
                      const url = window.prompt("Nhập URL hình ảnh");
                      if (url)
                        contentEditor
                          .chain()
                          .focus()
                          .setImage({ src: url })
                          .run();
                    }}
                  >
                    Ảnh
                  </button>
                  <button
                    type="button"
                    className="vle-toolbar-btn"
                    onClick={() => {
                      const r = parseInt(
                        window.prompt("Số hàng (2-6)?", "2"),
                        10
                      );
                      const c = parseInt(
                        window.prompt("Số cột (2-6)?", "2"),
                        10
                      );
                      const rows = isNaN(r) ? 2 : Math.min(Math.max(r, 2), 6);
                      const cols = isNaN(c) ? 2 : Math.min(Math.max(c, 2), 6);
                      contentEditor
                        .chain()
                        .focus()
                        .insertTable({ rows, cols, withHeaderRow: true })
                        .run();
                    }}
                  >
                    Table
                  </button>
                  <button
                    type="button"
                    className="vle-toolbar-btn"
                    onClick={() => contentEditor.chain().focus().undo().run()}
                  >
                    ⟳
                  </button>
                  <button
                    type="button"
                    className="vle-toolbar-btn"
                    onClick={() => contentEditor.chain().focus().redo().run()}
                  >
                    ⟲
                  </button>
                </div>
                <div
                  className="vle-tiptap-editor"
                  data-placeholder="Nhập nội dung mô tả bài học (tùy chọn)..."
                >
                  <EditorContent editor={contentEditor} />
                </div>
              </div>
            )}
            <p className="vle-hint">
              💡 Nội dung này sẽ hiển thị bên dưới video để học viên tham khảo.
              Hỗ trợ HTML và định dạng văn bản.
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
                <code>
                  https://storage.googleapis.com/bucket-name/video.mp4
                </code>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

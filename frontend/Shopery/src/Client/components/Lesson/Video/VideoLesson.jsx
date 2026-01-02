// VideoLesson.jsx - Component hiển thị video lesson
// Hỗ trợ: YouTube embed, Google Cloud Storage video, nội dung mô tả
import React from "react";
import "./VideoLesson.css";

export default function VideoLesson({ lesson }) {
  const lessonData = lesson?.lesson_data || {};
  const videoUrl = lessonData.video_url || lesson?.video_url || "";
  const videoType = lessonData.video_type || "youtube"; // "youtube" hoặc "direct"
  const content = lessonData.content || lesson?.content || "";
  const title = lesson?.title || "";

  // Convert YouTube URL sang embed URL
  const convertYoutubeUrlToEmbed = (url) => {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      let videoId = "";

      if (urlObj.searchParams.get("v")) {
        videoId = urlObj.searchParams.get("v");
      } else if (urlObj.hostname === "youtu.be") {
        videoId = urlObj.pathname.replace("/", "");
      } else if (urlObj.pathname.startsWith("/embed/")) {
        videoId = urlObj.pathname.split("/embed/")[1];
      }

      if (!videoId) return null;
      return `https://www.youtube.com/embed/${videoId}`;
    } catch (error) {
      return null;
    }
  };

  // Kiểm tra xem URL có phải YouTube không
  const isYouTubeUrl = (url) => {
    if (!url) return false;
    try {
      const urlObj = new URL(url);
      return (
        urlObj.hostname.includes("youtube.com") ||
        urlObj.hostname.includes("youtu.be")
      );
    } catch {
      return false;
    }
  };

  // Kiểm tra xem URL có phải Google Cloud Storage không
  const isGoogleCloudStorageUrl = (url) => {
    if (!url) return false;
    try {
      const urlObj = new URL(url);
      return (
        urlObj.hostname.includes("storage.googleapis.com") ||
        urlObj.hostname.includes("googleapis.com") ||
        urlObj.hostname.includes("cloud.google.com")
      );
    } catch {
      // Kiểm tra extension nếu không parse được URL
      return url.match(/\.(mp4|webm|ogg|mov|avi)$/i) !== null;
    }
  };

  // Xác định video type và URL
  const getVideoSource = () => {
    if (!videoUrl) return null;

    // Ưu tiên 1: Nếu video_type được chỉ định trong lesson_data
    if (videoType === "youtube") {
      const embedUrl = convertYoutubeUrlToEmbed(videoUrl);
      return embedUrl ? { type: "youtube", url: embedUrl } : null;
    }
    if (videoType === "direct") {
      return { type: "direct", url: videoUrl };
    }

    // Ưu tiên 2: Auto-detect từ URL
    if (isYouTubeUrl(videoUrl)) {
      const embedUrl = convertYoutubeUrlToEmbed(videoUrl);
      return embedUrl ? { type: "youtube", url: embedUrl } : null;
    }
    if (isGoogleCloudStorageUrl(videoUrl)) {
      return { type: "direct", url: videoUrl };
    }

    // Ưu tiên 3: Nếu có extension video, coi như direct
    if (videoUrl.match(/\.(mp4|webm|ogg|mov|avi)$/i)) {
      return { type: "direct", url: videoUrl };
    }

    // Mặc định: coi như direct video
    return { type: "direct", url: videoUrl };
  };

  const videoSource = getVideoSource();

  return (
    <div className="video-lesson-container">
      {/* Header */}
      {title && (
        <div className="video-lesson-header">
          <h2 className="video-lesson-title">{title}</h2>
        </div>
      )}

      {/* Video Player */}
      <div className="video-lesson-player">
        {videoSource ? (
          videoSource.type === "youtube" && videoSource.url ? (
            <iframe
              src={videoSource.url}
              title={title || "Video Lesson"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="video-lesson-iframe"
            />
          ) : videoSource.type === "direct" ? (
            <video
              controls
              className="video-lesson-video"
              src={videoSource.url}
            >
              Trình duyệt không hỗ trợ video.
            </video>
          ) : (
            <div className="video-lesson-error">
              <p>⚠️ Không thể tải video. Vui lòng kiểm tra lại URL.</p>
            </div>
          )
        ) : (
          <div className="video-lesson-placeholder">
            <p>📹 Chưa có video</p>
            <p className="video-lesson-hint">
              Vui lòng thêm video URL trong phần editor
            </p>
          </div>
        )}
      </div>

      {/* Content */}
      {content && (
        <div className="video-lesson-content">
          <h3 className="video-lesson-content-title">Nội dung bài học</h3>
          <div
            className="video-lesson-content-text"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      )}
    </div>
  );
}

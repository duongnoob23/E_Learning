import React, { useState } from "react";
import "./CourseIntroVideoTab.scss";

const VIDEO_SOURCES = ["YouTube", "Vimeo", "Google Drive", "Local Upload"];

const VIDEO_EXAMPLES = {
  YouTube: "https://www.youtube.com/watch?v=yourvideoid",
  Vimeo: "https://vimeo.com/123456789",
  "Google Drive": "https://drive.google.com/file/d/yourfileid/view",
  "Local Upload": "Upload a video file from your device",
};

export default function CourseIntroVideoTab({ data, onChange }) {
  const { videoSource = "", videoUrl = "" } = data;
  const [urlError, setUrlError] = useState("");

  const handleSourceChange = (source) => {
    onChange({ videoSource: source, videoUrl: "" });
    setUrlError("");
  };

  const handleUrlChange = (url) => {
    onChange({ videoUrl: url });
    setUrlError("");

    // Validate URL based on source
    if (videoSource && url) {
      if (videoSource === "YouTube" && !url.includes("youtube.com/watch")) {
        setUrlError("Invalid YouTube URL format");
      } else if (videoSource === "Vimeo" && !url.includes("vimeo.com")) {
        setUrlError("Invalid Vimeo URL format");
      } else if (
        videoSource === "Google Drive" &&
        !url.includes("drive.google.com")
      ) {
        setUrlError("Invalid Google Drive URL format");
      }
    }
  };

  return (
    <div className="course-intro-video-tab">
      <h2 className="course-intro-video-tab__title">Course Intro Video</h2>

      {/* Select Video Source */}
      <div className="course-intro-video-tab__field">
        <label className="course-intro-video-tab__label">
          Select Video Sources
        </label>
        <select
          className="course-intro-video-tab__select"
          value={videoSource}
          onChange={(e) => handleSourceChange(e.target.value)}
        >
          <option value="">Select a source</option>
          {VIDEO_SOURCES.map((source) => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </select>
      </div>

      {/* Add Video URL */}
      {videoSource && (
        <div className="course-intro-video-tab__field">
          <label className="course-intro-video-tab__label">
            Add Your Video URL
          </label>
          <input
            type="text"
            className={`course-intro-video-tab__input ${
              urlError ? "course-intro-video-tab__input--error" : ""
            }`}
            placeholder="Add Your Video URL here."
            value={videoUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
          />
          {urlError && (
            <div className="course-intro-video-tab__error">{urlError}</div>
          )}
          <div className="course-intro-video-tab__helper">
            Example: {VIDEO_EXAMPLES[videoSource]}
          </div>
        </div>
      )}

      {/* Video Preview */}
      {videoUrl && !urlError && videoSource === "YouTube" && (
        <div className="course-intro-video-tab__preview">
          <h3 className="course-intro-video-tab__preview-title">
            Video Preview
          </h3>
          <div className="course-intro-video-tab__preview-embed">
            <iframe
              width="100%"
              height="400"
              src={videoUrl.replace("watch?v=", "embed/")}
              title="Video preview"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}


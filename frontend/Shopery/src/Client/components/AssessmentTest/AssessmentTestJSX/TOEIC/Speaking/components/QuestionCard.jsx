import React from "react";
import AudioPlayerSimple from "./AudioPlayerSimple";

/**
 * Component hiển thị nội dung câu hỏi (bên trái)
 */
export default function QuestionCard({ question, questionNumber }) {
  const { content } = question || {};

  return (
    <div
      style={{
        padding: "20px",
        background: "#fff",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
        lineHeight: 1.6,
      }}
    >
      <h3
        style={{
          fontSize: "18px",
          fontWeight: 600,
          marginBottom: "16px",
          color: "#333",
        }}
      >
        Read a text aloud
      </h3>

      {/* Text Content */}
      {content?.text && (
        <div
          style={{
            fontSize: "15px",
            color: "#333",
            marginBottom: "16px",
            whiteSpace: "pre-line",
          }}
        >
          {content.text}
        </div>
      )}

      {/* Image */}
      {content?.image_file && (
        <div style={{ marginBottom: "16px" }}>
          <img
            src={content.image_file}
            alt={`Question ${questionNumber}`}
            style={{
              maxWidth: "100%",
              height: "auto",
              borderRadius: "6px",
              border: "1px solid #ddd",
            }}
          />
        </div>
      )}

      {/* Audio Prompt */}
      {content?.audio_file && (
        <div style={{ marginTop: "16px" }}>
          <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
            Audio prompt:
          </div>
          <AudioPlayerSimple src={content.audio_file} />
        </div>
      )}
    </div>
  );
}

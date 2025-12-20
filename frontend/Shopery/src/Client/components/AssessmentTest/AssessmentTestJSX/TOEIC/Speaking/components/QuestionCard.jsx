import React from "react";
import AudioPlayerSimple from "./AudioPlayerSimple";

/**
 * Component hiển thị nội dung câu hỏi (bên trái)
 */
export default function QuestionCard({ question, questionNumber }) {
  const { content, question_text, transcript, image_file, audio_file } = question || {};

  // ✅ Ưu tiên: content.text → question_text → transcript
  const textContent = content?.text || question_text || transcript;
  const imageUrl = content?.image_file || image_file;
  const audioUrl = content?.audio_file || audio_file;

  return (
    <div
      style={{
        padding: "20px",
        background: "#fff",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
        lineHeight: 1.6,
        width: "100%",
        boxSizing: "border-box",
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
        Question {questionNumber}
      </h3>

      {/* Text Content */}
      {textContent && (
        <div
          style={{
            fontSize: "15px",
            color: "#333",
            marginBottom: "16px",
            whiteSpace: "pre-line",
          }}
        >
          {textContent}
        </div>
      )}

      {/* Image */}
      {imageUrl && (
        <div style={{ marginBottom: "16px" }}>
          <img
            src={imageUrl}
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
      {audioUrl && (
        <div style={{ marginTop: "16px" }}>
          <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
            Audio prompt:
          </div>
          <AudioPlayerSimple src={audioUrl} />
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState, useRef } from "react";
import { useAudioRecorder } from "../hooks/useAudioRecorder";
import AudioPlayerSimple from "./AudioPlayerSimple";

/**
 * Component cho phần ghi chú và ghi âm (bên phải)
 */
export default function NotesAndRecorder({
  questionId,
  questionNumber,
  initialNotes = "",
  initialRecordingUrl = null,
  initialDuration = null, // ✅ Thêm prop để nhận duration từ answers
  onNotesChange,
  onRecordStart,
  onRecordStop,
  maxDuration = 45,
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [showNotes, setShowNotes] = useState(false);

  const {
    state: recordState,
    start: startRecord,
    stop: stopRecord,
    recordingUrl,
    blob,
    duration,
    error: recordError,
  } = useAudioRecorder({ maxDuration });

  // Sync initial notes
  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  // Sync initial recording
  const [currentRecordingUrl, setCurrentRecordingUrl] =
    useState(initialRecordingUrl);
  useEffect(() => {
    if (recordingUrl) {
      setCurrentRecordingUrl(recordingUrl);
    }
  }, [recordingUrl]);

  // ✅ FIX: Watch blob và recordingUrl - khi recording stop, blob sẽ được set
  // ✅ Gọi onRecordStop khi blob đã sẵn sàng (sau khi onstop event fire)
  const prevBlobRef = useRef(null);
  useEffect(() => {
    // ✅ Chỉ gọi khi blob mới được set (từ stopped state)
    if (blob && blob !== prevBlobRef.current && recordState === "stopped" && onRecordStop) {
      console.log("✅ [NotesAndRecorder] Blob ready, calling onRecordStop:", {
        questionId,
        blobSize: blob.size,
        duration,
        recordingUrl,
      });
      prevBlobRef.current = blob;
      onRecordStop(questionId, blob, duration);
    }
  }, [blob, recordState, duration, questionId, onRecordStop, recordingUrl]);

  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    if (onNotesChange) {
      onNotesChange(questionId, newNotes);
    }
  };

  const handleStartRecord = async () => {
    try {
      // ✅ Reset prevBlobRef khi start recording mới
      prevBlobRef.current = null;
      await startRecord();
      if (onRecordStart) {
        onRecordStart(questionId);
      }
    } catch (err) {
      console.error("Error starting record:", err);
    }
  };

  const handleStopRecord = () => {
    console.log("🛑 [NotesAndRecorder] handleStopRecord:", {
      questionId,
      currentState: recordState,
      hasBlob: !!blob,
      duration,
      hasOnRecordStop: !!onRecordStop,
      note: "Calling stopRecord(), blob will be set in onstop event",
    });
    // ✅ Chỉ gọi stopRecord(), blob sẽ được set trong onstop callback
    // ✅ useEffect sẽ tự động gọi onRecordStop khi blob ready
    stopRecord();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "20px",
        background: "#fff",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Question Number */}
      <div style={{ fontSize: "18px", fontWeight: 600, color: "#333" }}>
        {questionNumber}
      </div>

      {/* Notes Button */}
      <button
        onClick={() => setShowNotes(!showNotes)}
        style={{
          padding: "8px 16px",
          border: "1px solid #ddd",
          borderRadius: "6px",
          background: "#f9f9f9",
          cursor: "pointer",
          fontSize: "14px",
          color: "#666",
        }}
      >
        {showNotes ? "Ẩn ghi chú" : "Viết ghi chú / dàn ý"}
      </button>

      {/* Notes Textarea */}
      {showNotes && (
        <textarea
          value={notes}
          onChange={handleNotesChange}
          placeholder="Thêm ghi chú tại đây..."
          style={{
            width: "100%",
            minHeight: "100px",
            padding: "12px",
            border: "1px solid #ddd",
            borderRadius: "6px",
            fontSize: "14px",
            fontFamily: "inherit",
            resize: "vertical",
          }}
        />
      )}

      {/* Record Button */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {recordState === "idle" || recordState === "stopped" ? (
          <button
            onClick={handleStartRecord}
            disabled={recordError}
            style={{
              padding: "12px 24px",
              border: "none",
              borderRadius: "6px",
              background: recordError ? "#ccc" : "#f44336",
              color: "#fff",
              cursor: recordError ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            🎤 THU ÂM
          </button>
        ) : recordState === "recording" ? (
          <button
            onClick={handleStopRecord}
            style={{
              padding: "12px 24px",
              border: "none",
              borderRadius: "6px",
              background: "#666",
              color: "#fff",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            ⏹ DỪNG LẠI
          </button>
        ) : null}

        {/* Recording Timer */}
        {recordState === "recording" && (
          <div
            style={{
              textAlign: "center",
              fontSize: "14px",
              color: "#f44336",
              fontWeight: 600,
            }}
          >
            {formatTime(duration)}
          </div>
        )}

        {/* Error Message */}
        {recordError && (
          <div
            style={{
              padding: "8px",
              background: "#ffebee",
              color: "#c62828",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          >
            {recordError}
          </div>
        )}
      </div>

      {/* Audio Playback */}
      {currentRecordingUrl && (
        <div>
          <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
            Phát lại:
          </div>
          <AudioPlayerSimple 
            src={currentRecordingUrl} 
            duration={initialDuration || duration} // ✅ Ưu tiên initialDuration (từ answers), fallback về duration (từ recording hiện tại)
          />
        </div>
      )}
    </div>
  );
}

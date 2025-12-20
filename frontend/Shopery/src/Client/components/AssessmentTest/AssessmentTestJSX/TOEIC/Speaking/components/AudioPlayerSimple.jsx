import React, { useEffect, useRef, useState } from "react";

/**
 * Component đơn giản để phát audio
 * @param {string} src - URL của audio file hoặc blob URL
 * @param {boolean} autoPlay - Tự động phát khi load
 * @param {Function} onTimeUpdate - Callback khi thời gian thay đổi
 */
export default function AudioPlayerSimple({
  src,
  autoPlay = false,
  onTimeUpdate,
  duration: propDuration, // ✅ Nhận duration từ props nếu có (từ recording)
}) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(propDuration || 0); // ✅ Khởi tạo với propDuration nếu có

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      if (onTimeUpdate) onTimeUpdate(audio.currentTime);
    };

    const updateDuration = () => {
      // ✅ Chỉ set duration khi nó là số hợp lệ (finite và không phải NaN)
      // ✅ Và chỉ update nếu propDuration không có (ưu tiên propDuration)
      if (!propDuration && audio.duration && isFinite(audio.duration) && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("durationchange", updateDuration); // ✅ Thêm để catch khi duration thay đổi
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("durationchange", updateDuration);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [onTimeUpdate]);

  const formatTime = (seconds) => {
    // ✅ Check cả NaN và Infinity
    if (isNaN(seconds) || !isFinite(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    audio.currentTime = percent * audio.duration;
  };

  if (!src) {
    return <div style={{ padding: "8px", color: "#999" }}>Không có audio</div>;
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        width: "100%",
      }}
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      <button
        onClick={handlePlayPause}
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          padding: "4px",
          display: "flex",
          alignItems: "center",
        }}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? "⏸" : "▶"}
      </button>

      <div
        style={{
          flex: 1,
          height: "4px",
          background: "#e0e0e0",
          borderRadius: "2px",
          cursor: "pointer",
          position: "relative",
        }}
        onClick={handleSeek}
      >
        <div
          style={{
            width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
            height: "100%",
            background: "#4CAF50",
            borderRadius: "2px",
          }}
        />
      </div>

      <div
        style={{
          fontSize: "12px",
          color: "#666",
          minWidth: "50px",
          textAlign: "right",
        }}
      >
        {formatTime(currentTime)} / {formatTime(propDuration || duration)}
      </div>
    </div>
  );
}

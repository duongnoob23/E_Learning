import { useState, useRef, useCallback, useEffect } from "react";

/**
 * Custom hook để quản lý MediaRecorder cho việc ghi âm
 * @param {Object} options
 * @param {number} options.maxDuration - Thời gian tối đa ghi âm (giây)
 * @param {string} options.mime - MIME type cho audio (default: 'audio/webm;codecs=opus')
 * @returns {Object} { state, start, stop, pause, resume, recordingUrl, blob, duration, error }
 */
export const useAudioRecorder = ({ maxDuration = 45, mime = "audio/webm;codecs=opus" } = {}) => {
  const [state, setState] = useState("idle"); // 'idle' | 'recording' | 'paused' | 'stopped'
  const [recordingUrl, setRecordingUrl] = useState(null);
  const [blob, setBlob] = useState(null);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // Cleanup khi unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (recordingUrl) {
        URL.revokeObjectURL(recordingUrl);
      }
    };
  }, [recordingUrl]);

  // Kiểm tra hỗ trợ MediaRecorder
  const isSupported = useCallback(() => {
    if (typeof MediaRecorder === "undefined") {
      setError("Trình duyệt không hỗ trợ ghi âm. Vui lòng sử dụng Chrome, Edge hoặc Firefox.");
      return false;
    }
    return true;
  }, []);

  // Yêu cầu quyền microphone
  const requestPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      return stream;
    } catch (err) {
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setError("Quyền truy cập microphone bị từ chối. Vui lòng cấp quyền trong cài đặt trình duyệt.");
      } else if (err.name === "NotFoundError") {
        setError("Không tìm thấy microphone. Vui lòng kiểm tra thiết bị của bạn.");
      } else {
        setError(`Lỗi khi truy cập microphone: ${err.message}`);
      }
      throw err;
    }
  }, []);

  // Bắt đầu ghi âm
  const start = useCallback(async () => {
    if (!isSupported()) return;

    try {
      setError(null);
      chunksRef.current = [];
      setDuration(0);

      // Yêu cầu quyền và lấy stream
      const stream = await requestPermission();

      // Tạo MediaRecorder
      let mimeType = mime;
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        // Fallback về mime type được hỗ trợ
        mimeType = "audio/webm";
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = "audio/mp4";
        }
      }

      const recorder = new MediaRecorder(stream, {
        mimeType: mimeType,
      });

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: mimeType });
        setBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setRecordingUrl(url);
        setState("stopped");

        // Dừng tất cả tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
      };

      recorder.onerror = (event) => {
        setError("Lỗi khi ghi âm: " + event.error);
        setState("idle");
      };

      mediaRecorderRef.current = recorder;
      startTimeRef.current = Date.now();
      recorder.start(1000); // Thu thập data mỗi 1 giây
      setState("recording");

      // Timer để đếm thời gian
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setDuration(elapsed);

        // Tự động dừng khi đạt maxDuration
        if (elapsed >= maxDuration) {
          stop();
        }
      }, 1000);
    } catch (err) {
      console.error("Error starting recording:", err);
      setState("idle");
    }
  }, [isSupported, requestPermission, mime, maxDuration]);

  // Dừng ghi âm
  const stop = useCallback(() => {
    if (mediaRecorderRef.current && state === "recording") {
      mediaRecorderRef.current.stop();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } else if (mediaRecorderRef.current && state === "paused") {
      mediaRecorderRef.current.stop();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [state]);

  // Tạm dừng
  const pause = useCallback(() => {
    if (mediaRecorderRef.current && state === "recording") {
      mediaRecorderRef.current.pause();
      setState("paused");
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [state]);

  // Tiếp tục
  const resume = useCallback(() => {
    if (mediaRecorderRef.current && state === "paused") {
      mediaRecorderRef.current.resume();
      setState("recording");
      startTimeRef.current = Date.now() - duration * 1000;
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setDuration(elapsed);
        if (elapsed >= maxDuration) {
          stop();
        }
      }, 1000);
    }
  }, [state, duration, maxDuration, stop]);

  // Reset về trạng thái ban đầu
  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (recordingUrl) {
      URL.revokeObjectURL(recordingUrl);
    }
    setState("idle");
    setRecordingUrl(null);
    setBlob(null);
    setDuration(0);
    setError(null);
    chunksRef.current = [];
    mediaRecorderRef.current = null;
    streamRef.current = null;
  }, [recordingUrl]);

  return {
    state,
    start,
    stop,
    pause,
    resume,
    reset,
    recordingUrl,
    blob,
    duration,
    error,
    isSupported: isSupported(),
  };
};


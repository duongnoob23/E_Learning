// VocabularyListening.jsx - Nghe từ vựng (audio + 3x3 matrix)
// Hỗ trợ: nhiều câu hỏi, audio mp3, grid 3x3 (tiếng Việt + ảnh), sai->rung, đúng->xanh+auto next
import { useCallback, useEffect, useRef, useState } from "react";
import "./VocabularyListening.css";

// Component AudioPlayer riêng để force re-mount mỗi lần src thay đổi
function AudioPlayer({ src, onPlay, questionId, questionIndex }) {
  const audioRef = useRef(null);
  const previousSrcRef = useRef(null);
  const previousQuestionIndexRef = useRef(null);

  // Log khi component mount hoặc khi questionIndex thay đổi
  useEffect(() => {
    if (previousQuestionIndexRef.current !== questionIndex) {
      console.log("🎧 AudioPlayer - MOUNT/REMOUNT:", {
        questionIndex,
        questionId,
        audioUrl: src,
        previousQuestionIndex: previousQuestionIndexRef.current,
      });
      previousQuestionIndexRef.current = questionIndex;
    }
  }, [questionIndex, questionId, src]);

  useEffect(() => {
    // Force load audio khi src thay đổi
    if (audioRef.current && src) {
      // Chỉ reload nếu src thực sự thay đổi
      if (previousSrcRef.current !== src) {
        console.log(" AudioPlayer - Loading new audio:", {
          questionId,
          questionIndex,
          audioUrl: src,
          previousUrl: previousSrcRef.current,
        });

        // Pause và reset trước khi load audio mới
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;

          // Xóa src cũ và set src mới để force reload
          audioRef.current.src = "";
          audioRef.current.load();

          // Set src mới sau một tick để đảm bảo reset hoàn toàn
          setTimeout(() => {
            if (audioRef.current && src) {
              audioRef.current.src = src;
              audioRef.current.load();
              previousSrcRef.current = src;

              console.log("✅ AudioPlayer - Audio loaded successfully:", {
                questionId,
                questionIndex,
                audioUrl: src,
                audioElementSrc: audioRef.current.src,
                audioElementCurrentSrc: audioRef.current.currentSrc,
              });
            }
          }, 50);
        }
      }
    }
  }, [src, questionId, questionIndex]);

  // Xử lý khi click play
  const handlePlay = (e) => {
    console.log("▶️ AudioPlayer - PLAY BUTTON CLICKED:", {
      questionId,
      questionIndex,
      expectedAudioUrl: src,
      audioElementSrc: audioRef.current?.src,
      audioElementCurrentSrc: audioRef.current?.currentSrc,
      audioElementReadyState: audioRef.current?.readyState,
      audioElementNetworkState: audioRef.current?.networkState,
    });

    // Đảm bảo audio element đang sử dụng đúng URL
    if (audioRef.current && src) {
      const currentSrc =
        audioRef.current.src || audioRef.current.currentSrc || "";
      const expectedSrc = src;

      // So sánh URL (bỏ qua query params và hash)
      const normalizeUrl = (url) => {
        try {
          const u = new URL(url);
          return u.origin + u.pathname;
        } catch {
          return url.split("?")[0].split("#")[0];
        }
      };

      const normalizedCurrent = normalizeUrl(currentSrc);
      const normalizedExpected = normalizeUrl(expectedSrc);

      if (normalizedCurrent !== normalizedExpected && currentSrc) {
        console.warn("⚠️ AudioPlayer - URL MISMATCH! Fixing:", {
          expected: expectedSrc,
          actual: currentSrc,
          normalizedExpected,
          normalizedCurrent,
        });
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = src;
        audioRef.current.load();
      }
    }

    if (onPlay) {
      onPlay(e);
    }
  };

  return (
    <audio
      ref={audioRef}
      controls
      className="vocabulary-listening-audio"
      onPlay={handlePlay}
      preload="auto"
    >
      <source src={src} type="audio/mpeg" />
      <source src={src} type="audio/mp3" />
      Trình duyệt không hỗ trợ audio.
    </audio>
  );
}

export default function VocabularyListening({ lesson }) {
  const lessonData = lesson?.lesson_data || {};

  // Hỗ trợ nhiều câu hỏi hoặc 1 câu hỏi
  const questions =
    lessonData.questions ||
    (lessonData.audio_url
      ? [
          {
            audio_url: lessonData.audio_url,
            grid: lessonData.grid || {},
          },
        ]
      : []);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [autoSwitch, setAutoSwitch] = useState(true); // Tự động chuyển câu
  const [selectedCells, setSelectedCells] = useState({}); // { questionIndex: cellId }
  const [wrongCells, setWrongCells] = useState({}); // { questionIndex: [cellIds] }
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set()); // Set of question indices
  const [playCounts, setPlayCounts] = useState({}); // { questionIndex: count }

  const currentQuestion = questions[currentQuestionIndex];
  const currentGrid = currentQuestion?.grid || {};
  const currentCells = currentGrid.cells || [];
  const currentAudioUrl = currentQuestion?.audio_url;
  const currentPlayCount = playCounts[currentQuestionIndex] || 0;
  const maxPlayCount = currentQuestion?.play_count || 3;

  // Log audio URL ngay khi chuyển question để debug
  useEffect(() => {
    console.log("═══════════════════════════════════════════════════");
    console.log("🔄 VocabularyListening - CHUYỂN QUESTION:", {
      "Câu hỏi số": currentQuestionIndex + 1,
      "Question ID": currentQuestion?.question_id || "N/A",
      "Audio URL": currentAudioUrl || "KHÔNG CÓ AUDIO",
      "Tổng số câu hỏi": questions.length,
    });
    console.log("📋 Danh sách tất cả questions:");
    questions.forEach((q, idx) => {
      console.log(
        `  [${idx + 1}] ID: ${q.question_id || "N/A"}, Audio: ${
          q.audio_url || "KHÔNG CÓ"
        }`
      );
    });
    console.log("═══════════════════════════════════════════════════");
  }, [currentQuestionIndex]); // Chỉ log khi currentQuestionIndex thay đổi

  // Reset khi chuyển câu
  useEffect(() => {
    setPlayCounts((prev) => {
      // Chỉ set nếu chưa có giá trị cho questionIndex này
      if (!prev[currentQuestionIndex]) {
        return { ...prev, [currentQuestionIndex]: 0 };
      }
      return prev; // Không thay đổi nếu đã có
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex]); // Bỏ playCounts khỏi dependency để tránh vòng lặp

  // Xử lý click vào ô
  const handleCellClick = useCallback(
    (cellId) => {
      // Nếu đã trả lời đúng câu này rồi thì không cho click nữa
      if (answeredQuestions.has(currentQuestionIndex)) {
        return;
      }

      const cell = currentCells.find((c) => c.id === cellId);
      if (!cell) return;

      const isCorrect = cell.is_correct;

      if (isCorrect) {
        // Đáp án đúng: xanh + tự động chuyển câu (nếu auto switch bật)
        setSelectedCells((prev) => ({
          ...prev,
          [currentQuestionIndex]: cellId,
        }));
        setAnsweredQuestions(
          (prev) => new Set([...prev, currentQuestionIndex])
        );

        // Tự động chuyển câu sau 1 giây
        if (autoSwitch && currentQuestionIndex < questions.length - 1) {
          setTimeout(() => {
            setCurrentQuestionIndex((prev) => prev + 1);
          }, 1000);
        }
      } else {
        // Đáp án sai: đỏ + vibrate + thêm vào danh sách sai
        setWrongCells((prev) => ({
          ...prev,
          [currentQuestionIndex]: [
            ...(prev[currentQuestionIndex] || []),
            cellId,
          ],
        }));

        // Vibrate (nếu browser hỗ trợ)
        if (navigator.vibrate) {
          navigator.vibrate(200);
        }

        // Thêm class shake animation
        const cellElement = document.querySelector(
          `[data-cell-id="${cellId}"]`
        );
        if (cellElement) {
          cellElement.classList.add("vocabulary-listening-cell--shake");
          setTimeout(() => {
            cellElement.classList.remove("vocabulary-listening-cell--shake");
          }, 500);
        }
      }
    },
    [
      currentQuestionIndex,
      currentCells,
      autoSwitch,
      questions.length,
      answeredQuestions,
    ]
  );

  // Xử lý phát audio
  const handlePlayAudio = useCallback(() => {
    console.log("🎵 VocabularyListening - handlePlayAudio called:", {
      questionIndex: currentQuestionIndex,
      questionId: currentQuestion?.question_id,
      audioUrl: currentAudioUrl,
      currentPlayCount,
      maxPlayCount,
    });

    if (currentPlayCount < maxPlayCount) {
      setPlayCounts((prev) => ({
        ...prev,
        [currentQuestionIndex]: (prev[currentQuestionIndex] || 0) + 1,
      }));
    } else {
      console.warn(
        "⚠️ VocabularyListening - Max play count reached for question:",
        {
          questionIndex: currentQuestionIndex,
          questionId: currentQuestion?.question_id,
        }
      );
    }
  }, [
    currentPlayCount,
    maxPlayCount,
    currentQuestionIndex,
    currentQuestion,
    currentAudioUrl,
  ]);

  // Chuyển câu trước
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const newIndex = currentQuestionIndex - 1;
      console.log("⬅️ Chuyển sang câu trước:", {
        từ: currentQuestionIndex + 1,
        sang: newIndex + 1,
        audioUrl: questions[newIndex]?.audio_url || "KHÔNG CÓ",
      });
      setCurrentQuestionIndex(newIndex);
    }
  };

  // Chuyển câu sau
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const newIndex = currentQuestionIndex + 1;
      console.log("➡️ Chuyển sang câu sau:", {
        từ: currentQuestionIndex + 1,
        sang: newIndex + 1,
        audioUrl: questions[newIndex]?.audio_url || "KHÔNG CÓ",
      });
      setCurrentQuestionIndex(newIndex);
    }
  };

  // Chuyển đến câu cụ thể
  const handleJumpToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      console.log("🔀 Chuyển đến câu hỏi:", {
        từ: currentQuestionIndex + 1,
        sang: index + 1,
        audioUrl: questions[index]?.audio_url || "KHÔNG CÓ",
      });
      setCurrentQuestionIndex(index);
    }
  };

  if (!currentQuestion || currentCells.length === 0) {
    return (
      <div className="vocabulary-listening-container">Không có câu hỏi</div>
    );
  }

  const selectedCellId = selectedCells[currentQuestionIndex];
  const wrongCellIds = wrongCells[currentQuestionIndex] || [];
  const isAnswered = answeredQuestions.has(currentQuestionIndex);

  return (
    <div className="vocabulary-listening-container">
      {/* Audio Section */}
      <div className="vocabulary-listening-audio-section">
        <p className="vocabulary-listening-instruction">
          Nghe audio và chọn đáp án đúng trong bảng
        </p>
        {currentAudioUrl && (
          <div className="vocabulary-listening-audio-wrapper">
            {/* Tạo audio element mới hoàn toàn mỗi lần chuyển question bằng key unique */}
            {/* Key bao gồm questionIndex để force remount khi chuyển question */}
            <AudioPlayer
              key={`audio-${currentQuestionIndex}-${
                currentQuestion?.question_id || "no-id"
              }-${currentAudioUrl.substring(0, 50)}`}
              src={currentAudioUrl}
              onPlay={handlePlayAudio}
              questionId={currentQuestion?.question_id}
              questionIndex={currentQuestionIndex}
            />
            <p className="vocabulary-listening-plays">
              Số lần nghe còn lại: {maxPlayCount - currentPlayCount} /{" "}
              {maxPlayCount}
            </p>
          </div>
        )}
      </div>

      {/* Grid 3x3 */}
      <div className="vocabulary-listening-grid">
        {currentCells.map((cell) => {
          const isSelected = selectedCellId === cell.id;
          const isWrong = wrongCellIds.includes(cell.id);
          const isCorrect = cell.is_correct && isSelected;

          let cellClass = "vocabulary-listening-cell";
          if (isCorrect) {
            cellClass += " vocabulary-listening-cell--correct";
          } else if (isWrong) {
            cellClass += " vocabulary-listening-cell--wrong";
          } else if (isSelected) {
            cellClass += " vocabulary-listening-cell--selected";
          }

          // Disable nếu đã trả lời đúng
          const isDisabled = isAnswered;

          // Hỗ trợ nhiều format: image_url hoặc image, vi_text hoặc text
          const cellImageUrl = cell.image_url || cell.image || "";
          const cellText = cell.text || cell.vi_text || "";

          return (
            <div
              key={cell.id}
              data-cell-id={cell.id}
              className={cellClass}
              onClick={() => !isDisabled && handleCellClick(cell.id)}
            >
              {cellImageUrl && (
                <img
                  src={cellImageUrl}
                  alt={cellText}
                  className="vocabulary-listening-cell-image"
                />
              )}
              {cellText && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <span className="vocabulary-listening-cell-text">
                    {cellText}
                  </span>
                </div>
              )}

              {/* Icon check/x */}
              {isCorrect && (
                <i className="fa fa-check vocabulary-listening-cell-icon vocabulary-listening-cell-icon--correct"></i>
              )}
              {isWrong && (
                <i className="fa fa-times vocabulary-listening-cell-icon vocabulary-listening-cell-icon--wrong"></i>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="vocabulary-listening-navigation">
        <button
          className="vocabulary-listening-nav-btn"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          ← Câu trước
        </button>

        <label className="vocabulary-listening-auto-switch">
          <input
            type="checkbox"
            checked={autoSwitch}
            onChange={(e) => setAutoSwitch(e.target.checked)}
          />
          <span>Tự động chuyển câu</span>
        </label>

        <button
          className="vocabulary-listening-nav-btn"
          onClick={handleNext}
          disabled={currentQuestionIndex === questions.length - 1}
        >
          Câu sau →
        </button>
      </div>

      {/* Danh sách số câu hỏi */}
      {questions.length > 1 && (
        <div className="vocabulary-listening-question-list">
          <span className="vocabulary-listening-question-list-label">
            Danh sách bài tập:
          </span>
          <div className="vocabulary-listening-question-numbers">
            {questions.map((_, index) => {
              const isAnswered = answeredQuestions.has(index);
              const isCurrent = index === currentQuestionIndex;
              return (
                <button
                  key={index}
                  className={`vocabulary-listening-question-number ${
                    isCurrent
                      ? "vocabulary-listening-question-number--active"
                      : ""
                  } ${
                    isAnswered
                      ? "vocabulary-listening-question-number--answered"
                      : ""
                  }`}
                  onClick={() => handleJumpToQuestion(index)}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

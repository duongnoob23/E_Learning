// VocabularyListening.jsx - Nghe từ vựng (audio + 3x3 matrix)
// Hỗ trợ: nhiều câu hỏi, audio mp3, grid 3x3 (tiếng Việt + ảnh), sai->rung, đúng->xanh+auto next
import { useCallback, useEffect, useState } from "react";
import "./VocabularyListening.css";

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
    if (currentPlayCount < maxPlayCount) {
      setPlayCounts((prev) => ({
        ...prev,
        [currentQuestionIndex]: (prev[currentQuestionIndex] || 0) + 1,
      }));
    }
  }, [currentPlayCount, maxPlayCount, currentQuestionIndex]);

  // Chuyển câu trước
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Chuyển câu sau
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  // Chuyển đến câu cụ thể
  const handleJumpToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
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
            <audio
              controls
              className="vocabulary-listening-audio"
              onPlay={handlePlayAudio}
            >
              <source src={currentAudioUrl} type="audio/mpeg" />
              <source src={currentAudioUrl} type="audio/mp3" />
              Trình duyệt không hỗ trợ audio.
            </audio>
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

          return (
            <div
              key={cell.id}
              data-cell-id={cell.id}
              className={cellClass}
              onClick={() => !isDisabled && handleCellClick(cell.id)}
            >
              {cell.image_url && (
                <img
                  src={cell.image_url}
                  alt={cell.vi_text || ""}
                  className="vocabulary-listening-cell-image"
                />
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span className="vocabulary-listening-cell-text">
                  {cell.vi_text}
                </span>
              </div>

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

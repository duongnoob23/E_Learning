// VocabularyMatching.jsx - Tìm cặp từ vựng (4x4 grid, 8 cặp)
// Hỗ trợ: nhiều câu hỏi, chọn 2 ô cùng nghĩa, đúng->xanh+biến mất, sai->đỏ+rung, pháo hoa khi hoàn thành
import React, { useCallback, useEffect, useState } from "react";
import "./VocabularyMatching.css";

export default function VocabularyMatching({ lesson }) {
  const lessonData = lesson?.lesson_data || {};

  // Hỗ trợ nhiều câu hỏi hoặc 1 câu hỏi
  const questions =
    lessonData.questions ||
    (lessonData.pairs ? [{ pairs: lessonData.pairs }] : []);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [autoSwitch, setAutoSwitch] = useState(true); // Tự động chuyển câu
  const [selectedCells, setSelectedCells] = useState([]); // [cellId1, cellId2] - tối đa 2 ô
  const [matchedPairs, setMatchedPairs] = useState(new Set()); // Set of pairIds đã được chọn đúng
  const [wrongCells, setWrongCells] = useState([]); // [cellId1, cellId2] - các ô đang hiển thị sai
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set()); // Set of question indices
  const [showFireworks, setShowFireworks] = useState(false); // Hiển thị pháo hoa

  const currentQuestion = questions[currentQuestionIndex];
  const currentPairs = currentQuestion?.pairs || [];

  // Tạo mảng 16 ô từ 8 cặp
  const createCells = useCallback(() => {
    const cells = [];
    currentPairs.forEach((pair) => {
      // Ô tiếng Việt + ảnh
      const leftImage = pair.left?.image || pair.left?.image_url || null;
      cells.push({
        id: `pair-${pair.pair_id}-vi`,
        pairId: pair.pair_id,
        type: "vi",
        text: pair.left?.text || "",
        image: leftImage,
        en: pair.right?.text || "",
      });
      // Ô tiếng Anh
      cells.push({
        id: `pair-${pair.pair_id}-en`,
        pairId: pair.pair_id,
        type: "en",
        text: pair.right?.text || "",
        image: null,
        vi: pair.left?.text || "",
      });
    });
    // Shuffle các ô
    return cells.sort(() => Math.random() - 0.5);
  }, [currentPairs]);

  const [cells, setCells] = useState([]);

  // Khởi tạo cells khi chuyển câu
  useEffect(() => {
    if (currentPairs.length > 0) {
      setCells(createCells());
      setSelectedCells([]);
      setMatchedPairs(new Set());
      setWrongCells([]);
    }
  }, [currentQuestionIndex, createCells, currentPairs.length]);

  // Kiểm tra xem 2 ô có phải là cặp đúng không
  const checkMatch = useCallback(
    (cellId1, cellId2) => {
      const cell1 = cells.find((c) => c.id === cellId1);
      const cell2 = cells.find((c) => c.id === cellId2);
      if (!cell1 || !cell2) return false;
      return cell1.pairId === cell2.pairId;
    },
    [cells]
  );

  // Xử lý click vào ô
  const handleCellClick = useCallback(
    (cellId) => {
      // Không cho click nếu ô đã được match hoặc đã trả lời đúng câu này
      const cell = cells.find((c) => c.id === cellId);
      if (!cell || matchedPairs.has(cell.pairId) || answeredQuestions.has(currentQuestionIndex)) {
        return;
      }

      // Nếu đã chọn 2 ô, reset về chọn ô mới
      if (selectedCells.length >= 2) {
        setSelectedCells([cellId]);
        setWrongCells([]);
        return;
      }

      // Nếu đã chọn 1 ô
      if (selectedCells.length === 1) {
        const firstCellId = selectedCells[0];
        
        // Không cho chọn lại cùng 1 ô
        if (firstCellId === cellId) {
          setSelectedCells([]);
          setWrongCells([]);
          return;
        }

        // Kiểm tra xem có phải cặp đúng không
        const isMatch = checkMatch(firstCellId, cellId);

        if (isMatch) {
          // Đúng: xanh lá + biến mất
          const cell1 = cells.find((c) => c.id === firstCellId);
          const newMatchedPairs = new Set([...matchedPairs, cell1.pairId]);
          setMatchedPairs(newMatchedPairs);
          setSelectedCells([]);
          setWrongCells([]);

          // Kiểm tra xem đã chọn hết 8 cặp chưa
          if (newMatchedPairs.size === currentPairs.length) {
            // Bắn pháo hoa
            setShowFireworks(true);
            setAnsweredQuestions(
              (prev) => new Set([...prev, currentQuestionIndex])
            );

            // Tự động chuyển câu sau 2 giây (nếu auto switch bật)
            if (autoSwitch && currentQuestionIndex < questions.length - 1) {
              setTimeout(() => {
                setShowFireworks(false);
                setCurrentQuestionIndex((prev) => prev + 1);
              }, 2000);
            } else {
              // Ẩn pháo hoa sau 2 giây
              setTimeout(() => {
                setShowFireworks(false);
              }, 2000);
            }
          }
        } else {
          // Sai: đỏ + rung
          setWrongCells([firstCellId, cellId]);
          
          // Vibrate (nếu browser hỗ trợ)
          if (navigator.vibrate) {
            navigator.vibrate(200);
          }

          // Sau 1 giây, reset về bình thường
          setTimeout(() => {
            setSelectedCells([]);
            setWrongCells([]);
          }, 1000);
        }
      } else {
        // Chọn ô đầu tiên
        setSelectedCells([cellId]);
        setWrongCells([]);
      }
    },
    [
      cells,
      selectedCells,
      matchedPairs,
      checkMatch,
      currentPairs.length,
      currentQuestionIndex,
      autoSwitch,
      questions.length,
      answeredQuestions,
    ]
  );

  // Chuyển câu trước
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setShowFireworks(false);
    }
  };

  // Chuyển câu sau
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setShowFireworks(false);
    }
  };

  // Chuyển đến câu cụ thể
  const handleJumpToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
      setShowFireworks(false);
    }
  };

  if (!currentQuestion || cells.length === 0) {
    return (
      <div className="vocabulary-matching-container">Không có câu hỏi</div>
    );
  }

  const isAnswered = answeredQuestions.has(currentQuestionIndex);
  const allMatched = matchedPairs.size === currentPairs.length;

  return (
    <div className="vocabulary-matching-container">
      {/* Pháo hoa khi hoàn thành */}
      {showFireworks && (
        <div className="vocabulary-matching-fireworks">
          <div className="firework"></div>
          <div className="firework"></div>
          <div className="firework"></div>
          <div className="firework"></div>
          <div className="firework"></div>
        </div>
      )}

      {/* Grid 4x4 */}
      <div className="vocabulary-matching-grid-4x4">
        {cells.map((cell) => {
          const isMatched = matchedPairs.has(cell.pairId);
          const isSelected = selectedCells.includes(cell.id);
          const isWrong = wrongCells.includes(cell.id);
          const isCorrect = isMatched;

          let cellClass = "vocabulary-matching-cell";
          if (isCorrect) {
            cellClass += " vocabulary-matching-cell--correct";
          } else if (isWrong) {
            cellClass += " vocabulary-matching-cell--wrong";
          } else if (isSelected) {
            cellClass += " vocabulary-matching-cell--selected";
          }

          return (
            <div
              key={cell.id}
              className={cellClass}
              onClick={() => handleCellClick(cell.id)}
            >
              {cell.image && (
                <img
                  src={cell.image}
                  alt={cell.text}
                  className="vocabulary-matching-cell-image"
                />
              )}
              <span className="vocabulary-matching-cell-text">{cell.text}</span>
            </div>
          );
        })}
      </div>

      {/* Progress */}
      <div className="vocabulary-matching-progress">
        Đã ghép: {matchedPairs.size} / {currentPairs.length}
      </div>

      {/* Navigation */}
      <div className="vocabulary-matching-navigation">
        <button
          className="vocabulary-matching-nav-btn"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          ← Câu trước
        </button>

        <label className="vocabulary-matching-auto-switch">
          <input
            type="checkbox"
            checked={autoSwitch}
            onChange={(e) => setAutoSwitch(e.target.checked)}
          />
          <span>Tự động chuyển câu</span>
        </label>

        <button
          className="vocabulary-matching-nav-btn"
          onClick={handleNext}
          disabled={currentQuestionIndex === questions.length - 1}
        >
          Câu sau →
        </button>
      </div>

      {/* Danh sách số câu hỏi */}
      {questions.length > 1 && (
        <div className="vocabulary-matching-question-list">
          <span className="vocabulary-matching-question-list-label">
            Danh sách bài tập:
          </span>
          <div className="vocabulary-matching-question-numbers">
            {questions.map((_, index) => {
              const isAnswered = answeredQuestions.has(index);
              const isCurrent = index === currentQuestionIndex;
              return (
                <button
                  key={index}
                  className={`vocabulary-matching-question-number ${
                    isCurrent
                      ? "vocabulary-matching-question-number--active"
                      : ""
                  } ${
                    isAnswered
                      ? "vocabulary-matching-question-number--answered"
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

import { useState, useEffect } from "react";
import "./LessonExercise.css";

export default function PairMatchingExercise({ exerciseData }) {
  const pairs = exerciseData?.pairs || [];
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [shuffledRight, setShuffledRight] = useState([]);
  const [incorrectSelection, setIncorrectSelection] = useState(null); // Lưu cặp sai: { leftId, rightId }
  const [fadingOutPairs, setFadingOutPairs] = useState([]); // Lưu các cặp đang fade out

  useEffect(() => {
    // Shuffle right side nếu có
    if (exerciseData?.shuffle !== false) {
      const shuffled = [...pairs].sort(() => Math.random() - 0.5);
      setShuffledRight(shuffled);
    } else {
      setShuffledRight(pairs);
    }
  }, [pairs, exerciseData?.shuffle]);

  const handleLeftClick = (pair) => {
    // Chỉ cho chọn nếu chưa matched
    if (matchedPairs.find((p) => p.id === pair.id)) return;
    setSelectedLeft(pair);
    setSelectedRight(null);
    // Reset incorrect state khi chọn lại
    setIncorrectSelection(null);
  };

  const handleRightClick = (pair) => {
    // Chỉ cho chọn nếu chưa matched
    if (matchedPairs.find((p) => p.id === pair.id)) return;

    if (selectedLeft && selectedLeft.id === pair.id) {
      // ✅ GHÉP ĐÚNG: Thêm vào fadingOutPairs trước, sau đó mới matched
      setFadingOutPairs([...fadingOutPairs, pair.id]);
      setSelectedLeft(null);
      setSelectedRight(null);
      setIncorrectSelection(null);
      
      // Sau khi animation fadeOut (0.5s), mới thêm vào matchedPairs để remove khỏi DOM
      setTimeout(() => {
        setMatchedPairs([...matchedPairs, pair]);
        setFadingOutPairs((prev) => prev.filter((id) => id !== pair.id));
      }, 500);
    } else if (selectedLeft) {
      // ❌ GHÉP SAI: Hiện màu đỏ cho cả 2 cặp vừa chọn sai (từ trái + nghĩa phải)
      // Lưu chính xác cặp vừa chọn sai để chỉ đánh dấu đúng cặp đó
      setIncorrectSelection({ leftId: selectedLeft.id, rightId: pair.id });
      setSelectedRight(pair);
      
      // Reset sau 1.5s để cho chọn lại
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        setIncorrectSelection(null);
      }, 1500);
    } else {
      // Chọn right trước
      setSelectedRight(pair);
    }
  };

  const isMatched = (pair) => {
    return matchedPairs.find((p) => p.id === pair.id);
  };

  const isFadingOut = (pair) => {
    return fadingOutPairs.includes(pair.id);
  };

  const isIncorrect = (pair, isLeft = false) => {
    if (!incorrectSelection) return false;
    // Chỉ đánh dấu đỏ nếu đúng là cặp vừa chọn sai
    if (isLeft) {
      return incorrectSelection.leftId === pair.id;
    } else {
      return incorrectSelection.rightId === pair.id;
    }
  };

  // Lọc ra các cặp chưa matched để hiển thị (nhưng vẫn hiển thị những cặp đang fade out)
  const remainingPairs = pairs.filter((pair) => !isMatched(pair));
  const remainingShuffledRight = shuffledRight.filter((pair) => !isMatched(pair));

  return (
    <div className="exercise-pair-matching">
      <div className="exercise-progress">
        Đã ghép: {matchedPairs.length} / {pairs.length}
      </div>

      <div className="pair-container">
        <div className="pair-column pair-left">
          <h4>Từ tiếng Anh</h4>
          {remainingPairs.map((pair) => (
            <button
              key={`left-${pair.id}`}
              className={`pair-item pair-word ${
                selectedLeft?.id === pair.id ? "selected" : ""
              } ${isIncorrect(pair, true) ? "incorrect" : ""} ${
                isFadingOut(pair) ? "matched" : ""
              }`}
              onClick={() => handleLeftClick(pair)}
              disabled={isFadingOut(pair)}
            >
              {pair.word}
            </button>
          ))}
        </div>

        <div className="pair-column pair-right">
          <h4>Nghĩa tiếng Việt</h4>
          {remainingShuffledRight.map((pair) => (
            <button
              key={`right-${pair.id}`}
              className={`pair-item pair-meaning ${
                selectedRight?.id === pair.id ? "selected" : ""
              } ${isIncorrect(pair, false) ? "incorrect" : ""} ${
                isFadingOut(pair) ? "matched" : ""
              }`}
              onClick={() => handleRightClick(pair)}
              disabled={isFadingOut(pair)}
            >
              {pair.meaning}
            </button>
          ))}
        </div>
      </div>

      {matchedPairs.length === pairs.length && (
        <div className="exercise-complete">
          🎉 Hoàn thành! Bạn đã ghép đúng tất cả các cặp!
        </div>
      )}
    </div>
  );
}


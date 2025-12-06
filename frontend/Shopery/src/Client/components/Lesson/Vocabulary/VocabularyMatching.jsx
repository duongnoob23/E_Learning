// VocabularyMatching.jsx - Tìm cặp (4x4 matrix)
import React, { useState } from "react";
import "./VocabularyMatching.css";

export default function VocabularyMatching({ lesson }) {
  const lessonData = lesson?.lesson_data || {};
  const pairs = lessonData.pairs || [];
  const gridSize = lessonData.grid_size || { rows: 4, cols: 4 };
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState(new Set());

  const handleCellClick = (pairId, side) => {
    if (matchedPairs.has(pairId)) return;

    if (side === "left") {
      if (selectedLeft === pairId) {
        setSelectedLeft(null);
      } else {
        setSelectedLeft(pairId);
        if (selectedRight === pairId) {
          // Match found!
          setMatchedPairs(new Set([...matchedPairs, pairId]));
          setSelectedLeft(null);
          setSelectedRight(null);
        }
      }
    } else {
      if (selectedRight === pairId) {
        setSelectedRight(null);
      } else {
        setSelectedRight(pairId);
        if (selectedLeft === pairId) {
          // Match found!
          setMatchedPairs(new Set([...matchedPairs, pairId]));
          setSelectedLeft(null);
          setSelectedRight(null);
        }
      }
    }
  };

  // Split pairs into left and right
  const leftCells = pairs.map(p => ({ ...p.left, pairId: p.pair_id }));
  const rightCells = pairs.map(p => ({ ...p.right, pairId: p.pair_id }));

  return (
    <div className="vocabulary-matching-container">
      <h3>{lesson.title}</h3>
      <div className="vocabulary-matching-grid">
        <div className="vocabulary-matching-left">
          <h4>Hình ảnh + Tiếng Việt</h4>
          <div className="vocabulary-matching-cells">
            {leftCells.map((cell, index) => {
              const isMatched = matchedPairs.has(cell.pairId);
              const isSelected = selectedLeft === cell.pairId;
              
              return (
                <div
                  key={index}
                  className={`vocabulary-matching-cell vocabulary-matching-cell-left ${
                    isMatched ? "matched" : ""
                  } ${isSelected ? "selected" : ""}`}
                  onClick={() => !isMatched && handleCellClick(cell.pairId, "left")}
                >
                  {cell.image && <img src={cell.image} alt={cell.text} />}
                  <span>{cell.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="vocabulary-matching-right">
          <h4>Tiếng Anh</h4>
          <div className="vocabulary-matching-cells">
            {rightCells.map((cell, index) => {
              const pair = pairs.find(p => p.right.text === cell.text);
              const isMatched = matchedPairs.has(pair?.pair_id);
              const isSelected = selectedRight === pair?.pair_id;
              
              return (
                <div
                  key={index}
                  className={`vocabulary-matching-cell vocabulary-matching-cell-right ${
                    isMatched ? "matched" : ""
                  } ${isSelected ? "selected" : ""}`}
                  onClick={() => !isMatched && pair && handleCellClick(pair.pair_id, "right")}
                >
                  <span>{cell.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="vocabulary-matching-progress">
        Đã ghép: {matchedPairs.size} / {pairs.length}
      </div>
    </div>
  );
}




// VocabularyListening.jsx - Nghe từ vựng (audio + 3x3 matrix)
import React, { useState } from "react";
import "./VocabularyListening.css";

export default function VocabularyListening({ lesson }) {
  const lessonData = lesson?.lesson_data || {};
  const audioUrl = lessonData.audio_url;
  const grid = lessonData.grid || {};
  const cells = grid.cells || [];
  const playCount = lessonData.play_count || 3;
  const [selectedCell, setSelectedCell] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [playsRemaining, setPlaysRemaining] = useState(playCount);

  const handleCellClick = (cellId) => {
    if (showResult) return;
    setSelectedCell(cellId);
  };

  const handleSubmit = () => {
    if (selectedCell === null) return;
    const selected = cells.find(c => c.id === selectedCell);
    setShowResult(selected?.is_correct || false);
  };

  const handlePlayAudio = () => {
    if (playsRemaining > 0) {
      setPlaysRemaining(prev => prev - 1);
    }
  };

  return (
    <div className="vocabulary-listening-container">
      <h3>{lesson.title}</h3>
      
      <div className="vocabulary-listening-content">
        <div className="vocabulary-listening-audio-section">
          <p className="vocabulary-listening-instruction">
            Nghe audio và chọn đáp án đúng trong lưới 3x3
          </p>
          {audioUrl && (
            <div className="vocabulary-listening-audio-wrapper">
              <audio
                controls
                className="vocabulary-listening-audio"
                onPlay={handlePlayAudio}
              >
                <source src={audioUrl} type="audio/mpeg" />
              </audio>
              <p className="vocabulary-listening-plays">
                Số lần nghe còn lại: {playsRemaining}
              </p>
            </div>
          )}
        </div>

        <div className="vocabulary-listening-grid">
          {cells.map((cell) => {
            const isSelected = selectedCell === cell.id;
            let cellClass = "vocabulary-listening-cell";
            
            if (showResult) {
              if (cell.is_correct) {
                cellClass += " correct";
              } else if (isSelected && !cell.is_correct) {
                cellClass += " wrong";
              }
            } else if (isSelected) {
              cellClass += " selected";
            }

            return (
              <div
                key={cell.id}
                className={cellClass}
                onClick={() => handleCellClick(cell.id)}
              >
                {cell.image_url && (
                  <img src={cell.image_url} alt={cell.vi_text} />
                )}
                <span>{cell.vi_text}</span>
                {showResult && cell.is_correct && (
                  <i className="fa fa-check vocabulary-listening-check"></i>
                )}
                {showResult && isSelected && !cell.is_correct && (
                  <i className="fa fa-times vocabulary-listening-times"></i>
                )}
              </div>
            );
          })}
        </div>

        {!showResult && (
          <button
            onClick={handleSubmit}
            disabled={selectedCell === null}
            className="vocabulary-listening-submit"
          >
            Xác nhận
          </button>
        )}

        {showResult && (
          <div className={`vocabulary-listening-result ${showResult ? "correct" : "wrong"}`}>
            {showResult ? (
              <>
                <i className="fa fa-check-circle"></i>
                <p>Chính xác! Bạn đã chọn đúng.</p>
              </>
            ) : (
              <>
                <i className="fa fa-times-circle"></i>
                <p>Sai rồi! Hãy thử lại.</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}




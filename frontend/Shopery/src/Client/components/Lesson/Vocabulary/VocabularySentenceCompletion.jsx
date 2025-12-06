// VocabularySentenceCompletion.jsx - Hoàn thiện câu (drag & drop)
import React, { useState } from "react";
import "./VocabularySentenceCompletion.css";

export default function VocabularySentenceCompletion({ lesson }) {
  const lessonData = lesson?.lesson_data || {};
  const sentenceTemplate = lessonData.sentence_template || "";
  const shuffledWords = lessonData.shuffled_words || [];
  const blanks = lessonData.blanks || [];
  const [wordPositions, setWordPositions] = useState({});
  const [showResult, setShowResult] = useState(false);

  const handleDrop = (blankId, wordId) => {
    if (showResult) return;
    setWordPositions(prev => ({
      ...prev,
      [blankId]: wordId
    }));
  };

  const handleDragStart = (e, wordId) => {
    e.dataTransfer.setData("wordId", wordId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = () => {
    setShowResult(true);
  };

  const getWordById = (wordId) => {
    return shuffledWords.find(w => w.id === wordId);
  };

  const isCorrect = blanks.every(blank => {
    const placedWordId = wordPositions[blank.id];
    return placedWordId === blank.correct_word_id;
  });

  // Render sentence với blanks
  const renderSentence = () => {
    let sentence = sentenceTemplate;
    blanks.forEach((blank) => {
      const wordId = wordPositions[blank.id];
      const word = wordId ? getWordById(wordId) : null;
      const placeholder = `{${blank.id}}`;
      
      sentence = sentence.replace(
        placeholder,
        word ? word.text : placeholder
      );
    });
    return sentence;
  };

  const handleDropOnBlank = (e, blankId) => {
    e.preventDefault();
    const wordId = parseInt(e.dataTransfer.getData("wordId"));
    if (wordId) {
      handleDrop(blankId, wordId);
    }
  };

  const availableWords = shuffledWords.filter(word => {
    return !Object.values(wordPositions).includes(word.id);
  });

  return (
    <div className="vocabulary-sentence-container">
      <h3>{lesson.title}</h3>
      
      <div className="vocabulary-sentence-content">
        <div className="vocabulary-sentence-instruction">
          <p>Kéo các từ bên dưới vào chỗ trống để hoàn thiện câu:</p>
        </div>

        <div className="vocabulary-sentence-display">
          <div className="vocabulary-sentence-text">
            {sentenceTemplate.split(/(\{[^}]+\})/).map((part, index) => {
              const blankMatch = part.match(/\{([^}]+)\}/);
              if (blankMatch) {
                const blankId = blankMatch[1];
                const blank = blanks.find(b => b.id === blankId);
                if (!blank) return <span key={index}>{part}</span>;
                
                const wordId = wordPositions[blankId];
                const word = wordId ? getWordById(wordId) : null;
                
                return (
                  <span
                    key={index}
                    className="sentence-blank"
                    onDrop={(e) => handleDropOnBlank(e, blankId)}
                    onDragOver={handleDragOver}
                  >
                    {word ? word.text : `{${blankId}}`}
                  </span>
                );
              }
              return <span key={index}>{part}</span>;
            })}
          </div>
        </div>

        <div className="vocabulary-sentence-words">
          <h4>Từ để chọn:</h4>
          <div className="vocabulary-sentence-words-list">
            {availableWords.map((word) => (
              <div
                key={word.id}
                className="vocabulary-sentence-word"
                draggable={!showResult}
                onDragStart={(e) => handleDragStart(e, word.id)}
              >
                {word.text}
              </div>
            ))}
          </div>
        </div>

        {Object.keys(wordPositions).length === blanks.length && !showResult && (
          <button
            onClick={handleSubmit}
            className="vocabulary-sentence-submit"
          >
            Kiểm tra
          </button>
        )}

        {showResult && (
          <div className={`vocabulary-sentence-result ${isCorrect ? "correct" : "wrong"}`}>
            {isCorrect ? (
              <>
                <i className="fa fa-check-circle"></i>
                <p>Chính xác! Câu đã được hoàn thiện đúng.</p>
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


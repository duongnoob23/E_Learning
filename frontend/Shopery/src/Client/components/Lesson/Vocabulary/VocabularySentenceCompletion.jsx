// VocabularySentenceCompletion.jsx - Hoàn thiện câu (drag & drop)
// Hỗ trợ: nhiều câu hỏi, drag & drop, dấu X để xóa, kiểm tra (xanh/đỏ), đáp án (auto fill), auto next
import React, { useCallback, useEffect, useState } from "react";
import "./VocabularySentenceCompletion.css";

export default function VocabularySentenceCompletion({ lesson }) {
  const lessonData = lesson?.lesson_data || {};

  // Hỗ trợ nhiều câu hỏi hoặc 1 câu hỏi
  const questions =
    lessonData.questions ||
    (lessonData.sentence_template
      ? [
          {
            vi_text: lessonData.vi_text || "",
            sentence_template: lessonData.sentence_template,
            shuffled_words: lessonData.shuffled_words || [],
            blanks: lessonData.blanks || [],
          },
        ]
      : []);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [autoSwitch, setAutoSwitch] = useState(true); // Tự động chuyển câu
  const [wordPositions, setWordPositions] = useState({}); // { questionIndex: { blankId: wordId } }
  const [checkResults, setCheckResults] = useState({}); // { questionIndex: { blankId: boolean } }
  const [isChecking, setIsChecking] = useState(false); // Đang kiểm tra
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set()); // Set of question indices
  const [draggedWord, setDraggedWord] = useState(null); // { wordId, sourceBlankId }
  const [hoveredBlank, setHoveredBlank] = useState(null); // blankId đang hover
  const [isAutoFilling, setIsAutoFilling] = useState(false); // Đang tự động điền đáp án

  const currentQuestion = questions[currentQuestionIndex];
  const currentSentenceTemplate = currentQuestion?.sentence_template || "";
  const currentShuffledWords = currentQuestion?.shuffled_words || [];
  const currentBlanks = currentQuestion?.blanks || [];
  const currentViText = currentQuestion?.vi_text || "";

  const currentWordPositions = wordPositions[currentQuestionIndex] || {};
  const currentCheckResults = checkResults[currentQuestionIndex] || {};

  // Reset khi chuyển câu
  useEffect(() => {
    if (!wordPositions[currentQuestionIndex]) {
      setWordPositions((prev) => ({ ...prev, [currentQuestionIndex]: {} }));
    }
    setCheckResults((prev) => ({ ...prev, [currentQuestionIndex]: {} }));
    setIsChecking(false);
    setIsAutoFilling(false);
    setDraggedWord(null);
    setHoveredBlank(null);
  }, [currentQuestionIndex, wordPositions]);

  // Lấy từ theo ID
  const getWordById = useCallback(
    (wordId) => {
      return currentShuffledWords.find((w) => w.id === wordId);
    },
    [currentShuffledWords]
  );

  // Lấy danh sách từ còn trống
  const getAvailableWords = useCallback(() => {
    const usedWordIds = Object.values(currentWordPositions);
    return currentShuffledWords.filter(
      (word) => !usedWordIds.includes(word.id)
    );
  }, [currentShuffledWords, currentWordPositions]);

  // Xử lý bắt đầu kéo
  const handleDragStart = useCallback((e, wordId, sourceBlankId = null) => {
    setDraggedWord({ wordId, sourceBlankId });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("wordId", wordId);
    e.dataTransfer.setData("sourceBlankId", sourceBlankId || "");
  }, []);

  // Xử lý kéo qua ô trống
  const handleDragOver = useCallback((e, blankId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setHoveredBlank(blankId);
  }, []);

  // Xử lý rời khỏi ô trống
  const handleDragLeave = useCallback(() => {
    setHoveredBlank(null);
  }, []);

  // Xử lý thả vào ô trống
  const handleDrop = useCallback(
    (e, blankId) => {
      e.preventDefault();
      setHoveredBlank(null);

      if (isChecking || isAutoFilling) return;

      const wordId = parseInt(e.dataTransfer.getData("wordId"));
      const sourceBlankId = e.dataTransfer.getData("sourceBlankId");

      if (!wordId) return;

      // CHỈ cho phép kéo từ danh sách vào ô, KHÔNG cho kéo từ ô này sang ô khác
      if (!sourceBlankId) {
        // Kéo từ danh sách vào ô
        setWordPositions((prev) => {
          const questionPositions = prev[currentQuestionIndex] || {};
          return {
            ...prev,
            [currentQuestionIndex]: {
              ...questionPositions,
              [blankId]: wordId,
            },
          };
        });

        // Reset kết quả kiểm tra khi thay đổi
        setCheckResults((prev) => {
          const questionResults = prev[currentQuestionIndex] || {};
          const newResults = { ...questionResults };
          delete newResults[blankId];
          return {
            ...prev,
            [currentQuestionIndex]: newResults,
          };
        });
      }

      setDraggedWord(null);
    },
    [currentQuestionIndex, isChecking, isAutoFilling]
  );

  // Xử lý xóa từ khỏi ô (dấu X) - chỉ xóa khi click vào dấu X
  const handleRemoveWord = useCallback(
    (e, blankId) => {
      e.stopPropagation(); // Ngăn chặn event bubble
      if (isChecking || isAutoFilling) return;

      setWordPositions((prev) => {
        const questionPositions = prev[currentQuestionIndex] || {};
        const newPositions = { ...questionPositions };
        delete newPositions[blankId];
        return {
          ...prev,
          [currentQuestionIndex]: newPositions,
        };
  });

      // Reset kết quả kiểm tra cho ô này
      setCheckResults((prev) => {
        const questionResults = prev[currentQuestionIndex] || {};
        const newResults = { ...questionResults };
        delete newResults[blankId];
        return {
          ...prev,
          [currentQuestionIndex]: newResults,
        };
      });
    },
    [currentQuestionIndex, isChecking, isAutoFilling]
  );

  // Xử lý kiểm tra
  const handleCheck = useCallback(() => {
    if (isChecking || isAutoFilling) return;

    const results = {};
    let allCorrect = true;

    currentBlanks.forEach((blank) => {
      const placedWordId = currentWordPositions[blank.id];
      const isCorrect = placedWordId === blank.correct_word_id;
      results[blank.id] = isCorrect;
      if (!isCorrect) allCorrect = false;
    });

    setCheckResults((prev) => ({
      ...prev,
      [currentQuestionIndex]: results,
    }));
    setIsChecking(true);

    // Nếu tất cả đúng, tự động chuyển câu sau 1 giây
    if (allCorrect) {
      setAnsweredQuestions((prev) => new Set([...prev, currentQuestionIndex]));
      if (autoSwitch && currentQuestionIndex < questions.length - 1) {
        setTimeout(() => {
          setCurrentQuestionIndex((prev) => prev + 1);
        }, 1000);
      }
    }
  }, [
    currentQuestionIndex,
    currentBlanks,
    currentWordPositions,
    autoSwitch,
    questions.length,
    isChecking,
    isAutoFilling,
  ]);

  // Xử lý hiển thị đáp án
  const handleShowAnswer = useCallback(() => {
    if (isChecking || isAutoFilling) return;

    setIsAutoFilling(true);

    // Tự động điền từng từ với animation
    const newPositions = {};
    currentBlanks.forEach((blank, index) => {
      setTimeout(() => {
        setWordPositions((prev) => {
          const questionPositions = prev[currentQuestionIndex] || {};
          newPositions[blank.id] = blank.correct_word_id;
          return {
            ...prev,
            [currentQuestionIndex]: {
              ...questionPositions,
              ...newPositions,
            },
          };
        });
      }, index * 200); // Delay 200ms cho mỗi từ
    });

    // Sau khi điền xong, hiển thị kết quả đúng và chuyển câu
    setTimeout(() => {
      const results = {};
      currentBlanks.forEach((blank) => {
        results[blank.id] = true;
      });
      setCheckResults((prev) => ({
        ...prev,
        [currentQuestionIndex]: results,
      }));
      setIsChecking(true);
      setAnsweredQuestions((prev) => new Set([...prev, currentQuestionIndex]));

      // Tự động chuyển câu sau 1 giây
      if (autoSwitch && currentQuestionIndex < questions.length - 1) {
        setTimeout(() => {
          setCurrentQuestionIndex((prev) => prev + 1);
        }, 1000);
      }
    }, currentBlanks.length * 200 + 500);
  }, [
    currentQuestionIndex,
    currentBlanks,
    autoSwitch,
    questions.length,
    isChecking,
    isAutoFilling,
  ]);

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

  if (!currentQuestion) {
  return (
      <div className="vocabulary-sentence-container">Không có câu hỏi</div>
    );
  }

  const availableWords = getAvailableWords();
  const isAnswered = answeredQuestions.has(currentQuestionIndex);
  const allBlanksFilled =
    Object.keys(currentWordPositions).length === currentBlanks.length;

  // Render câu với các ô trống
  const renderSentence = () => {
    const parts = currentSentenceTemplate.split(/(\{[^}]+\})/);
    return parts.map((part, index) => {
              const blankMatch = part.match(/\{([^}]+)\}/);
              if (blankMatch) {
                const blankId = blankMatch[1];
        const blank = currentBlanks.find((b) => b.id === blankId);
                if (!blank) return <span key={index}>{part}</span>;
                
        const wordId = currentWordPositions[blankId];
                const word = wordId ? getWordById(wordId) : null;
        const isCorrect = currentCheckResults[blankId];
        const isHovered = hoveredBlank === blankId;

        let blankClass = "sentence-blank";
        // Ban đầu màu xám, chỉ có màu khi đã kiểm tra
        if (isCorrect === true) {
          blankClass += " sentence-blank--correct";
        } else if (isCorrect === false) {
          blankClass += " sentence-blank--wrong";
        } else if (!word) {
          blankClass += " sentence-blank--empty";
        } else {
          blankClass += " sentence-blank--filled";
        }
        if (isHovered) {
          blankClass += " sentence-blank--hovered";
        }
                
                return (
                  <span
                    key={index}
            className={blankClass}
            onDrop={(e) => handleDrop(e, blankId)}
            onDragOver={(e) => handleDragOver(e, blankId)}
            onDragLeave={handleDragLeave}
                  >
            {word ? (
              <>
                <span className="sentence-blank-word">{word.text}</span>
                {!isChecking && !isAutoFilling && (
                  <button
                    className="sentence-blank-remove"
                    onClick={(e) => handleRemoveWord(e, blankId)}
                    onMouseDown={(e) => e.stopPropagation()}
                    title="Xóa từ này"
                  >
                    ×
                  </button>
                )}
              </>
            ) : (
              <span className="sentence-blank-placeholder">____</span>
            )}
                  </span>
                );
              }
              return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="vocabulary-sentence-container">
      {/* Câu tiếng Việt - Căn giữa */}
      {currentViText && (
        <div className="vocabulary-sentence-vi">
          <p>{currentViText}</p>
        </div>
      )}

      {/* Câu tiếng Anh với các ô trống */}
      <div className="vocabulary-sentence-display">
        <div className="vocabulary-sentence-text">{renderSentence()}</div>
        </div>

      {/* Danh sách từ để kéo thả */}
        <div className="vocabulary-sentence-words">
          <h4>Từ để chọn:</h4>
          <div className="vocabulary-sentence-words-list">
            {availableWords.map((word) => (
              <div
                key={word.id}
                className="vocabulary-sentence-word"
              draggable={!isChecking && !isAutoFilling}
                onDragStart={(e) => handleDragStart(e, word.id)}
              >
                {word.text}
              </div>
            ))}
          </div>
        </div>

      {/* Nút Kiểm tra và Đáp án */}
      <div className="vocabulary-sentence-actions">
        <button
          onClick={handleCheck}
          disabled={!allBlanksFilled || isChecking || isAutoFilling}
          className="vocabulary-sentence-check-btn"
        >
          ✓ Kiểm tra
        </button>
        <button
          onClick={handleShowAnswer}
          disabled={isChecking || isAutoFilling}
          className="vocabulary-sentence-answer-btn"
        >
          Đáp án
        </button>
      </div>

      {/* Navigation */}
      <div className="vocabulary-sentence-navigation">
        <button
          className="vocabulary-sentence-nav-btn"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          ← Câu trước
        </button>

        <label className="vocabulary-sentence-auto-switch">
          <input
            type="checkbox"
            checked={autoSwitch}
            onChange={(e) => setAutoSwitch(e.target.checked)}
          />
          <span>Tự động chuyển câu</span>
        </label>

          <button
          className="vocabulary-sentence-nav-btn"
          onClick={handleNext}
          disabled={currentQuestionIndex === questions.length - 1}
          >
          Câu sau →
          </button>
      </div>

      {/* Danh sách số câu hỏi */}
      {questions.length > 1 && (
        <div className="vocabulary-sentence-question-list">
          <span className="vocabulary-sentence-question-list-label">
            Danh sách bài tập:
          </span>
          <div className="vocabulary-sentence-question-numbers">
            {questions.map((_, index) => {
              const isAnswered = answeredQuestions.has(index);
              const isCurrent = index === currentQuestionIndex;
              return (
                <button
                  key={index}
                  className={`vocabulary-sentence-question-number ${
                    isCurrent
                      ? "vocabulary-sentence-question-number--active"
                      : ""
                  } ${
                    isAnswered
                      ? "vocabulary-sentence-question-number--answered"
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

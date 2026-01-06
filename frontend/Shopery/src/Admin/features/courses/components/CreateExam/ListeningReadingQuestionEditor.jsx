import React, { useState, useEffect, useCallback, useRef } from "react";
import "./ListeningReadingQuestionEditor.scss";

/**
 * Listening & Reading Question Editor
 * Includes question list sidebar for quick navigation
 * Supports future CSV/JSON import structure
 */
export default function ListeningReadingQuestionEditor({
  questions = [],
  onChange,
}) {
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showQuestionList, setShowQuestionList] = useState(true);
  const debounceTimer = useRef(null);

  // Load questions on mount
  useEffect(() => {
    if (questions.length > 0) {
      // Deep clone to avoid mutation
      const cloned = JSON.parse(JSON.stringify(questions));
      setCurrentQuestions(cloned);
    } else {
      // Create first empty question
      setCurrentQuestions([createEmptyQuestion()]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount - prevent infinite loops

  // Debounced push changes to parent
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    debounceTimer.current = setTimeout(() => {
      if (currentQuestions.length > 0) {
        onChange(JSON.parse(JSON.stringify(currentQuestions)));
      }
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [currentQuestions, onChange]);

  // Create empty question
  function createEmptyQuestion() {
    return {
      id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      question_number: 1,
      question_text: "",
      question_type: "MULTIPLE_CHOICE",
      audio_file: "",
      image_file: "",
      transcript: "",
      explanation: "",
      choices: [
        { choice_letter: "A", choice_text: "", is_correct: false },
        { choice_letter: "B", choice_text: "", is_correct: false },
        { choice_letter: "C", choice_text: "", is_correct: false },
        { choice_letter: "D", choice_text: "", is_correct: false },
      ],
    };
  }

  // Add new question
  const handleAddQuestion = useCallback(() => {
    const newQuestion = createEmptyQuestion();
    newQuestion.question_number = currentQuestions.length + 1;
    const newQuestions = [...currentQuestions, newQuestion];
    setCurrentQuestions(newQuestions);
    setCurrentIndex(newQuestions.length - 1);
  }, [currentQuestions]);

  // Delete question
  const handleDeleteQuestion = useCallback((index) => {
    if (currentQuestions.length <= 1) {
      alert("At least 1 question is required");
      return;
    }
    const newQuestions = currentQuestions.filter((_, idx) => idx !== index);
    // Update question numbers
    newQuestions.forEach((q, idx) => {
      q.question_number = idx + 1;
    });
    setCurrentQuestions(newQuestions);
    if (currentIndex >= newQuestions.length) {
      setCurrentIndex(newQuestions.length - 1);
    } else if (currentIndex > index) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentQuestions, currentIndex]);

  // Update current question
  const updateCurrentQuestion = useCallback((field, value) => {
    setCurrentQuestions((prev) => {
      const newQuestions = [...prev];
      newQuestions[currentIndex] = {
        ...newQuestions[currentIndex],
        [field]: value,
      };
      return newQuestions;
    });
  }, [currentIndex]);

  // Update choice
  const updateChoice = useCallback((choiceIndex, field, value) => {
    setCurrentQuestions((prev) => {
      const newQuestions = [...prev];
      const newChoices = [...newQuestions[currentIndex].choices];
      newChoices[choiceIndex] = {
        ...newChoices[choiceIndex],
        [field]: value,
      };
      newQuestions[currentIndex] = {
        ...newQuestions[currentIndex],
        choices: newChoices,
      };
      return newQuestions;
    });
  }, [currentIndex]);

  // Navigate to question
  const goToQuestion = useCallback((index) => {
    if (index >= 0 && index < currentQuestions.length) {
      setCurrentIndex(index);
    }
  }, [currentQuestions.length]);

  // Jump to question number
  const jumpToQuestionNumber = useCallback((questionNumber) => {
    const index = currentQuestions.findIndex(q => q.question_number === questionNumber);
    if (index !== -1) {
      setCurrentIndex(index);
    }
  }, [currentQuestions]);

  const currentQuestion = currentQuestions[currentIndex] || createEmptyQuestion();

  return (
    <div className="listening-reading-question-editor">
      <div className="listening-reading-question-editor__layout">
        {/* Question List Sidebar */}
        {showQuestionList && (
          <div className="listening-reading-question-editor__sidebar">
            <div className="listening-reading-question-editor__sidebar-header">
              <h4>Questions ({currentQuestions.length})</h4>
              <button
                className="listening-reading-question-editor__toggle-sidebar"
                onClick={() => setShowQuestionList(false)}
              >
                Hide
              </button>
            </div>
            <div className="listening-reading-question-editor__question-list">
              {currentQuestions.map((q, idx) => (
                <div
                  key={q.id || idx}
                  className={`listening-reading-question-editor__question-item ${
                    idx === currentIndex ? "listening-reading-question-editor__question-item--active" : ""
                  }`}
                  onClick={() => goToQuestion(idx)}
                >
                  <div className="listening-reading-question-editor__question-item-number">
                    Q{q.question_number}
                  </div>
                  <div className="listening-reading-question-editor__question-item-preview">
                    {q.question_text ? (
                      <p>{q.question_text.substring(0, 50)}{q.question_text.length > 50 ? '...' : ''}</p>
                    ) : (
                      <p className="listening-reading-question-editor__question-item-empty">Empty question</p>
                    )}
                  </div>
                  {q.choices && q.choices.some(c => c.is_correct) && (
                    <span className="listening-reading-question-editor__question-item-badge">Has answer</span>
                  )}
                </div>
              ))}
            </div>
            <div className="listening-reading-question-editor__sidebar-footer">
              <input
                type="number"
                className="listening-reading-question-editor__jump-input"
                placeholder="Jump to Q#"
                min="1"
                max={currentQuestions.length}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const num = parseInt(e.target.value);
                    if (num >= 1 && num <= currentQuestions.length) {
                      jumpToQuestionNumber(num);
                      e.target.value = '';
                    }
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Main Editor */}
        <div className="listening-reading-question-editor__main">
          {!showQuestionList && (
            <button
              className="listening-reading-question-editor__show-sidebar-btn"
              onClick={() => setShowQuestionList(true)}
            >
              Show Question List
            </button>
          )}

          {/* Navigation */}
          <div className="listening-reading-question-editor__nav">
            <button
              className="listening-reading-question-editor__nav-btn"
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
            >
              ← Previous
            </button>
            <span className="listening-reading-question-editor__nav-info">
              Question {currentIndex + 1} / {currentQuestions.length}
            </span>
            <button
              className="listening-reading-question-editor__nav-btn"
              onClick={() =>
                setCurrentIndex(
                  Math.min(currentQuestions.length - 1, currentIndex + 1)
                )
              }
              disabled={currentIndex === currentQuestions.length - 1}
            >
              Next →
            </button>
          </div>

          {/* Question Form */}
          <div className="listening-reading-question-editor__form">
            {/* Question Number */}
            <div className="listening-reading-question-editor__field">
              <label>Question Number</label>
              <input
                type="number"
                value={currentQuestion.question_number}
                onChange={(e) =>
                  updateCurrentQuestion(
                    "question_number",
                    parseInt(e.target.value) || 1
                  )
                }
                min="1"
              />
            </div>

            {/* Question Text */}
            <div className="listening-reading-question-editor__field">
              <label>Question Text</label>
              <textarea
                value={currentQuestion.question_text}
                onChange={(e) =>
                  updateCurrentQuestion("question_text", e.target.value)
                }
                rows={3}
                placeholder="Enter question content..."
              />
            </div>

            {/* Audio File */}
            <div className="listening-reading-question-editor__field">
              <label>Audio File (URL or upload)</label>
              <input
                type="text"
                value={currentQuestion.audio_file}
                onChange={(e) =>
                  updateCurrentQuestion("audio_file", e.target.value)
                }
                placeholder="https://..."
              />
            </div>

            {/* Image File */}
            <div className="listening-reading-question-editor__field">
              <label>Image File (URL or upload)</label>
              <input
                type="text"
                value={currentQuestion.image_file}
                onChange={(e) =>
                  updateCurrentQuestion("image_file", e.target.value)
                }
                placeholder="https://..."
              />
            </div>

            {/* Choices */}
            <div className="listening-reading-question-editor__choices">
              <label>Answer Choices (A, B, C, D)</label>
              {currentQuestion.choices.map((choice, idx) => (
                <div key={idx} className="listening-reading-question-editor__choice">
                  <div className="listening-reading-question-editor__choice-header">
                    <span className="listening-reading-question-editor__choice-letter">
                      {choice.choice_letter}
                    </span>
                    <label className="listening-reading-question-editor__choice-correct">
                      <input
                        type="radio"
                        name={`correct_${currentIndex}`}
                        checked={choice.is_correct}
                        onChange={() => {
                          // Only one correct answer allowed
                          const newChoices = currentQuestion.choices.map((c, i) => ({
                            ...c,
                            is_correct: i === idx,
                          }));
                          updateCurrentQuestion("choices", newChoices);
                        }}
                      />
                      Correct Answer
                    </label>
                  </div>
                  <input
                    type="text"
                    value={choice.choice_text}
                    onChange={(e) => updateChoice(idx, "choice_text", e.target.value)}
                    placeholder={`Enter choice ${choice.choice_letter}...`}
                  />
                </div>
              ))}
            </div>

            {/* Transcript */}
            <div className="listening-reading-question-editor__field">
              <label>Transcript (optional)</label>
              <textarea
                value={currentQuestion.transcript}
                onChange={(e) =>
                  updateCurrentQuestion("transcript", e.target.value)
                }
                rows={3}
                placeholder="Enter transcript..."
              />
            </div>

            {/* Explanation */}
            <div className="listening-reading-question-editor__field">
              <label>Explanation</label>
              <textarea
                value={currentQuestion.explanation}
                onChange={(e) =>
                  updateCurrentQuestion("explanation", e.target.value)
                }
                rows={4}
                placeholder="Enter explanation..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="listening-reading-question-editor__actions">
            <button
              className="listening-reading-question-editor__add-btn"
              onClick={handleAddQuestion}
            >
              + Add Question
            </button>
            {currentQuestions.length > 1 && (
              <button
                className="listening-reading-question-editor__delete-btn"
                onClick={() => handleDeleteQuestion(currentIndex)}
              >
                Delete This Question
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

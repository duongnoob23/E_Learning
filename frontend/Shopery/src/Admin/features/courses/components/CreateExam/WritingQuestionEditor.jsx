import React, { useState, useEffect, useCallback, useRef } from "react";
import "./WritingQuestionEditor.scss";

/**
 * Writing Question Editor
 * No choices, only question_text, image_file (optional), explanation
 */
export default function WritingQuestionEditor({ questions = [], onChange }) {
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const debounceTimer = useRef(null);

  useEffect(() => {
    if (questions.length > 0) {
      setCurrentQuestions(JSON.parse(JSON.stringify(questions)));
    } else {
      setCurrentQuestions([createEmptyQuestion()]);
    }
  }, []);

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

  function createEmptyQuestion() {
    return {
      id: `wq_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      question_number: 1,
      question_text: "",
      question_type: "WRITING",
      image_file: "",
      explanation: "",
    };
  }

  const handleAddQuestion = useCallback(() => {
    const newQuestion = createEmptyQuestion();
    newQuestion.question_number = currentQuestions.length + 1;
    setCurrentQuestions([...currentQuestions, newQuestion]);
    setCurrentIndex(currentQuestions.length);
  }, [currentQuestions]);

  const handleDeleteQuestion = useCallback((index) => {
    if (currentQuestions.length <= 1) {
      alert("At least 1 question is required");
      return;
    }
    const newQuestions = currentQuestions.filter((_, idx) => idx !== index);
    newQuestions.forEach((q, idx) => {
      q.question_number = idx + 1;
    });
    setCurrentQuestions(newQuestions);
    if (currentIndex >= newQuestions.length) {
      setCurrentIndex(newQuestions.length - 1);
    }
  }, [currentQuestions, currentIndex]);

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

  const currentQuestion = currentQuestions[currentIndex] || createEmptyQuestion();

  return (
    <div className="writing-question-editor">
      <div className="writing-question-editor__nav">
        <button
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
        >
          ← Previous
        </button>
        <span>Question {currentIndex + 1} / {currentQuestions.length}</span>
        <button
          onClick={() =>
            setCurrentIndex(Math.min(currentQuestions.length - 1, currentIndex + 1))
          }
          disabled={currentIndex === currentQuestions.length - 1}
        >
          Next →
        </button>
      </div>

      <div className="writing-question-editor__form">
        <div className="writing-question-editor__field">
          <label>Question Number</label>
          <input
            type="number"
            value={currentQuestion.question_number}
            onChange={(e) =>
              updateCurrentQuestion("question_number", parseInt(e.target.value) || 1)
            }
            min="1"
          />
        </div>

        <div className="writing-question-editor__field">
          <label>Question Text *</label>
          <textarea
            value={currentQuestion.question_text}
            onChange={(e) => updateCurrentQuestion("question_text", e.target.value)}
            rows={6}
            placeholder="Enter question prompt for students..."
          />
        </div>

        <div className="writing-question-editor__field">
          <label>Image File (URL or upload) - Optional</label>
          <input
            type="text"
            value={currentQuestion.image_file}
            onChange={(e) => updateCurrentQuestion("image_file", e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="writing-question-editor__field">
          <label>Instructions/Requirements</label>
          <textarea
            value={currentQuestion.explanation}
            onChange={(e) => updateCurrentQuestion("explanation", e.target.value)}
            rows={4}
            placeholder="Enter instructions and requirements for students (e.g., write at least 150 words)..."
          />
        </div>
      </div>

      <div className="writing-question-editor__actions">
        <button onClick={handleAddQuestion}>+ Add Question</button>
        {currentQuestions.length > 1 && (
          <button onClick={() => handleDeleteQuestion(currentIndex)}>
            Delete This Question
          </button>
        )}
      </div>
    </div>
  );
}

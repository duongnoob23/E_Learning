import React, { useState, useEffect, useCallback, useRef } from "react";
import "./SpeakingQuestionEditor.scss";

/**
 * Speaking Question Editor
 * No choices, only question_text, audio_file, transcript
 */
export default function SpeakingQuestionEditor({ questions = [], onChange }) {
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
      id: `sq_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      question_number: 1,
      question_text: "",
      question_type: "SPEAKING",
      audio_file: "",
      transcript: "",
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
    <div className="speaking-question-editor">
      <div className="speaking-question-editor__nav">
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

      <div className="speaking-question-editor__form">
        <div className="speaking-question-editor__field">
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

        <div className="speaking-question-editor__field">
          <label>Question Text *</label>
          <textarea
            value={currentQuestion.question_text}
            onChange={(e) => updateCurrentQuestion("question_text", e.target.value)}
            rows={4}
            placeholder="Enter question for students..."
          />
        </div>

        <div className="speaking-question-editor__field">
          <label>Sample Audio File (URL or upload)</label>
          <input
            type="text"
            value={currentQuestion.audio_file}
            onChange={(e) => updateCurrentQuestion("audio_file", e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="speaking-question-editor__field">
          <label>Transcript (optional)</label>
          <textarea
            value={currentQuestion.transcript}
            onChange={(e) => updateCurrentQuestion("transcript", e.target.value)}
            rows={3}
            placeholder="Enter transcript..."
          />
        </div>

        <div className="speaking-question-editor__field">
          <label>Instructions/Hints</label>
          <textarea
            value={currentQuestion.explanation}
            onChange={(e) => updateCurrentQuestion("explanation", e.target.value)}
            rows={4}
            placeholder="Enter instructions for students..."
          />
        </div>
      </div>

      <div className="speaking-question-editor__actions">
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

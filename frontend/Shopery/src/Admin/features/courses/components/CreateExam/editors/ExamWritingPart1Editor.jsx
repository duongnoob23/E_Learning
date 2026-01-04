// ExamWritingPart1Editor.jsx - Editor for Writing Part 1
// Part 1: 5 questions required
// Features: Preview, JSON Import, Tabs navigation

import { useCallback, useEffect, useRef, useState } from "react";
import "./ExamWritingPart1Editor.css";

const MAX_QUESTIONS = 5;
const MIN_QUESTIONS = 5;

function createEmptyQuestion() {
  const id = `writing_p1_q_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  return {
    id,
    question_number: 1,
    question_text: "",
    image_file: "", // Optional
  };
}

export default function ExamWritingPart1Editor({ questions = [], onChange }) {
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showImportJSON, setShowImportJSON] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState(null);

  // Preview state
  const [previewNotes, setPreviewNotes] = useState({});

  const isInitialMount = useRef(true);
  const hasLoadedInitialData = useRef(false);
  const prevQuestionsRef = useRef(null);

  // Map state to exam format
  const mapStateToExamData = useCallback((qs) => {
    return qs.map((q, idx) => ({
      question_id: q.id,
      question_number: q.question_number || idx + 1,
      question_text: q.question_text || "",
      question_type: "WRITING",
      audio_file: "", // Not used for Writing
      image_file: q.image_file || "", // Optional
      transcript: "", // Not used for Writing
      explanation: "", // Not used for Writing
      // NO choices array
    }));
  }, []);

  // Map exam data to state
  const mapExamDataToState = useCallback((examQuestions) => {
    if (!Array.isArray(examQuestions) || examQuestions.length === 0) {
      return Array.from({ length: MIN_QUESTIONS }, () => createEmptyQuestion());
    }

    // Ensure we have exactly 5 questions
    const mapped = examQuestions.map((q, idx) => ({
      id: q.question_id || q.id || `writing_p1_q_${idx}_${Date.now()}`,
      question_number: q.question_number || idx + 1,
      question_text: q.question_text || "",
      image_file: q.image_file || "", // Optional
    }));

    // Pad to 5 questions if less
    while (mapped.length < MIN_QUESTIONS) {
      mapped.push(createEmptyQuestion());
    }

    // Trim to 5 questions if more
    return mapped.slice(0, MAX_QUESTIONS);
  }, []);

  // Load initial data
  useEffect(() => {
    const questionsReferenceChanged = prevQuestionsRef.current !== questions;

    if (
      questionsReferenceChanged &&
      hasLoadedInitialData.current &&
      questions &&
      Array.isArray(questions) &&
      questions.length > 0
    ) {
      const prevFirstQuestionId =
        prevQuestionsRef.current?.[0]?.id ||
        prevQuestionsRef.current?.[0]?.question_id;
      const currentFirstQuestionId =
        questions[0]?.id || questions[0]?.question_id;

      if (prevFirstQuestionId !== currentFirstQuestionId) {
        hasLoadedInitialData.current = false;
      }
    }

    if (questionsReferenceChanged) {
      prevQuestionsRef.current = questions;
    }

    if (!hasLoadedInitialData.current) {
      if (questions && Array.isArray(questions) && questions.length > 0) {
        const initialQuestions = mapExamDataToState(questions);
        setCurrentQuestions(initialQuestions);
        setCurrentIndex(0);
        hasLoadedInitialData.current = true;
        isInitialMount.current = false;
      } else {
        const initialQuestions = Array.from({ length: MIN_QUESTIONS }, () =>
          createEmptyQuestion()
        );
        setCurrentQuestions(initialQuestions);
        setCurrentIndex(0);
        hasLoadedInitialData.current = true;
        isInitialMount.current = false;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions]);

  // Push changes to parent
  const pushChange = useCallback(
    (nextQuestions) => {
      if (isInitialMount.current) return;
      const examData = mapStateToExamData(nextQuestions);
      onChange?.(examData);
    },
    [mapStateToExamData, onChange]
  );

  // Debounce pushChange
  useEffect(() => {
    if (isInitialMount.current) return;
    const timer = setTimeout(() => {
      pushChange(currentQuestions);
    }, 150);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestions]);

  const currentQuestion =
    currentQuestions[currentIndex] || currentQuestions[0] || createEmptyQuestion();

  // Update question field
  const updateCurrentQuestion = useCallback(
    (field, value) => {
      setCurrentQuestions((prev) => {
        const newQuestions = [...prev];
        newQuestions[currentIndex] = {
          ...newQuestions[currentIndex],
          [field]: value,
        };
        return newQuestions;
      });
    },
    [currentIndex]
  );

  // JSON Import
  const handleImportJSON = () => {
    if (!jsonInput.trim()) {
      setJsonError("Please enter JSON content.");
      return;
    }

    let jsonData;
    try {
      jsonData = JSON.parse(jsonInput);
    } catch (e) {
      setJsonError("JSON parsing error: " + e.message);
      return;
    }

    const arr = Array.isArray(jsonData) ? jsonData : [jsonData];

    if (arr.length > MAX_QUESTIONS) {
      setJsonError(`Part 1 can only have ${MAX_QUESTIONS} questions.`);
      return;
    }

    const mapped = arr.map((q, idx) => ({
      id:
        q.question_id ||
        `writing_p1_q_${idx}_${Date.now()}_${Math.random()
          .toString(36)
          .slice(2, 8)}`,
      question_number: q.question_number || idx + 1,
      question_text: q.question_text || "",
      image_file: q.image_file || "", // Optional
    }));

    // Ensure we have exactly 5 questions
    while (mapped.length < MIN_QUESTIONS) {
      mapped.push(createEmptyQuestion());
    }

    setCurrentQuestions(mapped.slice(0, MAX_QUESTIONS));
    setCurrentIndex(0);
    setShowImportJSON(false);
    setJsonInput("");
    setJsonError(null);
  };

  // Sample JSON
  const sampleJSON = `[
  {
    "question_id": "writing_p1_q1",
    "question_number": 1,
    "question_text": "Write a sentence based on the picture."
  },
  {
    "question_id": "writing_p1_q2",
    "question_number": 2,
    "question_text": "Write a sentence based on the picture."
  },
  {
    "question_id": "writing_p1_q3",
    "question_number": 3,
    "question_text": "Write a sentence based on the picture."
  },
  {
    "question_id": "writing_p1_q4",
    "question_number": 4,
    "question_text": "Write a sentence based on the picture."
  },
  {
    "question_id": "writing_p1_q5",
    "question_number": 5,
    "question_text": "Write a sentence based on the picture."
  }
]`;

  return (
    <div className="exam-writing-p1-editor">
      {/* Toolbar */}
      <div className="exam-writing-p1-editor__toolbar">
        <div className="exam-writing-p1-editor__toolbar-left">
          <button
            className="exam-writing-p1-editor__btn exam-writing-p1-editor__btn--preview"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? "✏️ Edit Mode" : "👁️ Preview"}
          </button>
          <button
            className="exam-writing-p1-editor__btn exam-writing-p1-editor__btn--import"
            onClick={() => setShowImportJSON(!showImportJSON)}
          >
            📝 Import JSON
          </button>
        </div>
        <div className="exam-writing-p1-editor__toolbar-right">
          <span className="exam-writing-p1-editor__info">
            Part 1: Write a sentence based on a picture ({currentQuestions.length}/{MAX_QUESTIONS} questions)
          </span>
        </div>
      </div>

      {/* Import JSON Modal */}
      {showImportJSON && (
        <div className="exam-writing-p1-editor__import-modal">
          <div className="exam-writing-p1-editor__import-content">
            <h3>Import Questions from JSON</h3>
            <textarea
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                setJsonError(null);
              }}
              placeholder="Paste JSON here..."
              rows={10}
            />
            {jsonError && (
              <div className="exam-writing-p1-editor__error">{jsonError}</div>
            )}
            <div className="exam-writing-p1-editor__import-actions">
              <button onClick={handleImportJSON}>Import</button>
              <button
                onClick={() => {
                  setShowImportJSON(false);
                  setJsonInput("");
                  setJsonError(null);
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setJsonInput(sampleJSON);
                  setJsonError(null);
                }}
              >
                Load Sample
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Mode */}
      {showPreview ? (
        <div className="exam-writing-p1-editor__preview">
          <div className="exam-writing-p1-editor__preview-header">
            <h3>Part 1 - TOEIC Writing</h3>
            <div className="exam-writing-p1-editor__preview-nav">
              {currentQuestions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`exam-writing-p1-editor__preview-nav-btn ${
                    currentIndex === idx ? "active" : ""
                  }`}
                >
                  {q.question_number}
                </button>
              ))}
            </div>
          </div>

          <div className="exam-writing-p1-editor__preview-content">
            {/* Left: Question */}
            <div className="exam-writing-p1-editor__preview-question">
              <div className="exam-writing-p1-editor__preview-question-card">
                <h4>Question {currentQuestion.question_number}</h4>
                {currentQuestion.question_text && (
                  <div className="exam-writing-p1-editor__preview-text">
                    {currentQuestion.question_text}
                  </div>
                )}
                {currentQuestion.image_file && (
                  <div className="exam-writing-p1-editor__preview-image">
                    <img
                      src={currentQuestion.image_file}
                      alt={`Question ${currentQuestion.question_number}`}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right: Answer Section */}
            <div className="exam-writing-p1-editor__preview-answer">
              <div className="exam-writing-p1-editor__preview-answer-card">
                <div className="exam-writing-p1-editor__preview-answer-number">
                  {currentQuestion.question_number}
                </div>
                <textarea
                  value={previewNotes[currentQuestion.id] || ""}
                  onChange={(e) =>
                    setPreviewNotes((prev) => ({
                      ...prev,
                      [currentQuestion.id]: e.target.value,
                    }))
                  }
                  placeholder="Write essay here..."
                  className="exam-writing-p1-editor__preview-notes"
                />
                <div className="exam-writing-p1-editor__preview-word-count">
                  Word count: {previewNotes[currentQuestion.id]?.split(/\s+/).filter(Boolean).length || 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Edit Mode */
        <div className="exam-writing-p1-editor__edit">
          {/* Question Tabs */}
          <div className="exam-writing-p1-editor__tabs">
            {currentQuestions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`exam-writing-p1-editor__tab ${
                  currentIndex === idx ? "active" : ""
                }`}
              >
                Question {q.question_number}
              </button>
            ))}
          </div>

          {/* Question Form */}
          <div className="exam-writing-p1-editor__form">
            <div className="exam-writing-p1-editor__field">
              <label>
                Question Number <span className="required">*</span>
              </label>
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

            <div className="exam-writing-p1-editor__field">
              <label>
                Question Text <span className="required">*</span>
              </label>
              <textarea
                value={currentQuestion.question_text}
                onChange={(e) =>
                  updateCurrentQuestion("question_text", e.target.value)
                }
                rows={6}
                placeholder="Enter the question text..."
              />
            </div>

            <div className="exam-writing-p1-editor__field">
              <label>Image File (Optional)</label>
              <input
                type="text"
                value={currentQuestion.image_file}
                onChange={(e) =>
                  updateCurrentQuestion("image_file", e.target.value)
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ExamSpeakingPart2Editor.jsx - Editor for Speaking Part 2 (Describe a picture)
// Part 2: 2 questions required, has image_file
// Features: Preview, JSON Import, Tabs navigation

import { useCallback, useEffect, useRef, useState } from "react";
import "./ExamSpeakingPart2Editor.css";

const MAX_QUESTIONS = 2;
const MIN_QUESTIONS = 2;

function createEmptyQuestion(questionNumber = 1) {
  const id = `speaking_p2_q_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  return {
    id,
    question_number: questionNumber,
    question_text: "",
    image_file: "", // Part 2 has image
  };
}

export default function ExamSpeakingPart2Editor({ questions = [], onChange }) {
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showImportJSON, setShowImportJSON] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState(null);

  // Preview state
  const [previewNotes, setPreviewNotes] = useState({});

  const imageInputRefs = useRef({});
  const isInitialMount = useRef(true);
  const hasLoadedInitialData = useRef(false);
  const prevQuestionsRef = useRef(null);

  // Map state to exam format
  const mapStateToExamData = useCallback((qs) => {
    return qs.map((q, idx) => ({
      question_id: q.id,
      question_number: q.question_number || idx + 1,
      question_text: q.question_text || "",
      question_type: "SPEAKING",
      audio_file: "", // Not used for Speaking
      image_file: q.image_file || "", // Part 2 has image
      transcript: "", // Not used for Speaking
      explanation: "", // Not used for Speaking
    }));
  }, []);

  // Map exam data to state
  const mapExamDataToState = useCallback((examQuestions) => {
    if (!Array.isArray(examQuestions) || examQuestions.length === 0) {
      return [
        createEmptyQuestion(1),
        createEmptyQuestion(2),
      ];
    }

    const mapped = examQuestions.map((q, idx) => ({
      id: q.question_id || q.id || `speaking_p2_q_${idx}_${Date.now()}`,
      question_number: q.question_number || idx + 1,
      question_text: q.question_text || "",
      image_file: q.image_file || "", // Part 2 has image
    }));

    while (mapped.length < MIN_QUESTIONS) {
      mapped.push(createEmptyQuestion(mapped.length + 1));
    }

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
        const initialQuestions = [
          createEmptyQuestion(1),
          createEmptyQuestion(2),
        ];
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
    currentQuestions[currentIndex] || currentQuestions[0] || createEmptyQuestion(1);

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

  // Handle image file input
  const handleImageFileChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          updateCurrentQuestion("image_file", event.target.result);
        };
        reader.readAsDataURL(file);
      }
    },
    [updateCurrentQuestion]
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
      setJsonError(`Part 2 can only have ${MAX_QUESTIONS} questions.`);
      return;
    }

    const mapped = arr.map((q, idx) => ({
      id:
        q.question_id ||
        `speaking_p2_q_${idx}_${Date.now()}_${Math.random()
          .toString(36)
          .slice(2, 8)}`,
      question_number: q.question_number || idx + 1,
      question_text: q.question_text || "",
      image_file: q.image_file || "", // Part 2 has image
    }));

    while (mapped.length < MIN_QUESTIONS) {
      mapped.push(createEmptyQuestion(mapped.length + 1));
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
    "question_id": "speaking_p2_q1",
    "question_number": 1,
    "question_text": "Describe the picture in detail.",
    "image_file": "https://example.com/image.jpg",
    "transcript": "Sample transcript...",
    "explanation": "Instructions for students..."
  },
  {
    "question_id": "speaking_p2_q2",
    "question_number": 2,
    "question_text": "Describe the picture in detail.",
    "image_file": "https://example.com/image2.jpg",
    "transcript": "",
    "explanation": ""
  }
]`;

  return (
    <div className="exam-speaking-p2-editor">
      {/* Toolbar */}
      <div className="exam-speaking-p2-editor__toolbar">
        <div className="exam-speaking-p2-editor__toolbar-left">
          <button
            className="exam-speaking-p2-editor__btn exam-speaking-p2-editor__btn--preview"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? "✏️ Edit Mode" : "👁️ Preview"}
          </button>
          <button
            className="exam-speaking-p2-editor__btn exam-speaking-p2-editor__btn--import"
            onClick={() => setShowImportJSON(!showImportJSON)}
          >
            📝 Import JSON
          </button>
        </div>
        <div className="exam-speaking-p2-editor__toolbar-right">
          <span className="exam-speaking-p2-editor__info">
            Part 2: Describe a picture ({currentQuestions.length}/{MAX_QUESTIONS} questions)
          </span>
        </div>
      </div>

      {/* Import JSON Modal */}
      {showImportJSON && (
        <div className="exam-speaking-p2-editor__import-modal">
          <div className="exam-speaking-p2-editor__import-content">
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
              <div className="exam-speaking-p2-editor__error">{jsonError}</div>
            )}
            <div className="exam-speaking-p2-editor__import-actions">
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
        <div className="exam-speaking-p2-editor__preview">
          <div className="exam-speaking-p2-editor__preview-header">
            <h3>Part 2 - TOEIC Speaking</h3>
            <div className="exam-speaking-p2-editor__preview-nav">
              {currentQuestions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`exam-speaking-p2-editor__preview-nav-btn ${
                    currentIndex === idx ? "active" : ""
                  }`}
                >
                  {q.question_number}
                </button>
              ))}
            </div>
          </div>

          <div className="exam-speaking-p2-editor__preview-content">
            {/* Left: Question */}
            <div className="exam-speaking-p2-editor__preview-question">
              <div className="exam-speaking-p2-editor__preview-question-card">
                <h4>Question {currentQuestion.question_number}</h4>
                {currentQuestion.question_text && (
                  <div className="exam-speaking-p2-editor__preview-text">
                    {currentQuestion.question_text}
                  </div>
                )}
                {currentQuestion.image_file && (
                  <div className="exam-speaking-p2-editor__preview-image">
                    <img
                      src={currentQuestion.image_file}
                      alt={`Question ${currentQuestion.question_number}`}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right: Answer Section */}
            <div className="exam-speaking-p2-editor__preview-answer">
              <div className="exam-speaking-p2-editor__preview-answer-card">
                <div className="exam-speaking-p2-editor__preview-answer-number">
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
                  placeholder="Write notes / outline"
                  className="exam-speaking-p2-editor__preview-notes"
                />
                <button className="exam-speaking-p2-editor__preview-record-btn">
                  🎤 RECORD
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Edit Mode */
        <div className="exam-speaking-p2-editor__edit">
          {/* Question Tabs */}
          <div className="exam-speaking-p2-editor__tabs">
            {currentQuestions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`exam-speaking-p2-editor__tab ${
                  currentIndex === idx ? "active" : ""
                }`}
              >
                Question {q.question_number}
              </button>
            ))}
          </div>

          {/* Question Form */}
          <div className="exam-speaking-p2-editor__form">
            <div className="exam-speaking-p2-editor__field">
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

            <div className="exam-speaking-p2-editor__field">
              <label>
                Question Text <span className="required">*</span>
              </label>
              <textarea
                value={currentQuestion.question_text}
                onChange={(e) =>
                  updateCurrentQuestion("question_text", e.target.value)
                }
                rows={3}
                placeholder="Enter the question text (e.g., 'Describe the picture in detail.')..."
              />
            </div>

            <div className="exam-speaking-p2-editor__field">
              <label>Image File (Required)</label>
              <input
                type="file"
                accept="image/*"
                ref={(el) => {
                  imageInputRefs.current[currentQuestion.id] = el;
                }}
                onChange={handleImageFileChange}
              />
              {currentQuestion.image_file && (
                <div className="exam-speaking-p2-editor__image-preview">
                  <img
                    src={currentQuestion.image_file}
                    alt="Preview"
                    style={{ maxWidth: "100%", maxHeight: "200px" }}
                  />
                  <button
                    onClick={() => updateCurrentQuestion("image_file", "")}
                    style={{
                      marginTop: "8px",
                      padding: "4px 8px",
                      fontSize: "12px",
                    }}
                  >
                    Remove Image
                  </button>
                </div>
              )}
              <input
                type="text"
                value={currentQuestion.image_file}
                onChange={(e) =>
                  updateCurrentQuestion("image_file", e.target.value)
                }
                placeholder="Or enter image URL..."
                style={{ marginTop: "8px" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


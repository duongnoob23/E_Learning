// ExamSpeakingPart3Editor.jsx - Editor for Speaking Part 3 (Respond to questions)
// Part 3: 1 question required
// Features: Preview, JSON Import

import { useCallback, useEffect, useRef, useState } from "react";
import "./ExamSpeakingPart3Editor.css";

const MAX_QUESTIONS = 1;
const MIN_QUESTIONS = 1;

function createEmptyQuestion() {
  const id = `speaking_p3_q_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  return {
    id,
    question_number: 1,
    question_text: "",
    image_file: "", // Optional
  };
}

export default function ExamSpeakingPart3Editor({ questions = [], onChange }) {
  const [currentQuestion, setCurrentQuestion] = useState(createEmptyQuestion());
  const [showPreview, setShowPreview] = useState(false);
  const [showImportJSON, setShowImportJSON] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState(null);

  // Preview state
  const [previewNotes, setPreviewNotes] = useState("");

  const isInitialMount = useRef(true);
  const hasLoadedInitialData = useRef(false);
  const prevQuestionsRef = useRef(null);

  // Map state to exam format
  const mapStateToExamData = useCallback((q) => {
    return [
      {
        question_id: q.id,
        question_number: q.question_number || 1,
        question_text: q.question_text || "",
        question_type: "SPEAKING",
        audio_file: "", // Not used for Speaking
        image_file: q.image_file || "", // Optional
        transcript: "", // Not used for Speaking
        explanation: "", // Not used for Speaking
      },
    ];
  }, []);

  // Map exam data to state
  const mapExamDataToState = useCallback((examQuestions) => {
    if (!Array.isArray(examQuestions) || examQuestions.length === 0) {
      return createEmptyQuestion();
    }

    const q = examQuestions[0];
    return {
      id: q.question_id || q.id || `speaking_p3_q_${Date.now()}`,
      question_number: q.question_number || 1,
      question_text: q.question_text || "",
      image_file: q.image_file || "", // Optional
    };
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
        const initialQuestion = mapExamDataToState(questions);
        setCurrentQuestion(initialQuestion);
        hasLoadedInitialData.current = true;
        isInitialMount.current = false;
      } else {
        setCurrentQuestion(createEmptyQuestion());
        hasLoadedInitialData.current = true;
        isInitialMount.current = false;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions]);

  // Push changes to parent
  const pushChange = useCallback(
    (nextQuestion) => {
      if (isInitialMount.current) return;
      const examData = mapStateToExamData(nextQuestion);
      onChange?.(examData);
    },
    [mapStateToExamData, onChange]
  );

  // Debounce pushChange
  useEffect(() => {
    if (isInitialMount.current) return;
    const timer = setTimeout(() => {
      pushChange(currentQuestion);
    }, 150);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion]);

  // Update question field
  const updateQuestion = useCallback((field, value) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

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
      setJsonError(`Part 3 can only have ${MAX_QUESTIONS} question.`);
      return;
    }

    const q = arr[0] || {};
    const mapped = {
      id:
        q.question_id ||
        `speaking_p3_q_${Date.now()}_${Math.random()
          .toString(36)
          .slice(2, 8)}`,
      question_number: q.question_number || 1,
      question_text: q.question_text || "",
      image_file: q.image_file || "", // Optional
    };

    setCurrentQuestion(mapped);
    setShowImportJSON(false);
    setJsonInput("");
    setJsonError(null);
  };

  // Sample JSON
  const sampleJSON = `[
  {
    "question_id": "speaking_p3_q1",
    "question_number": 1,
    "question_text": "What are your plans for the weekend?"
  }
]`;

  return (
    <div className="exam-speaking-p3-editor">
      {/* Toolbar */}
      <div className="exam-speaking-p3-editor__toolbar">
        <div className="exam-speaking-p3-editor__toolbar-left">
          <button
            className="exam-speaking-p3-editor__btn exam-speaking-p3-editor__btn--preview"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? "✏️ Edit Mode" : "👁️ Preview"}
          </button>
          <button
            className="exam-speaking-p3-editor__btn exam-speaking-p3-editor__btn--import"
            onClick={() => setShowImportJSON(!showImportJSON)}
          >
            📝 Import JSON
          </button>
        </div>
        <div className="exam-speaking-p3-editor__toolbar-right">
          <span className="exam-speaking-p3-editor__info">
            Part 3: Respond to questions (1 question)
          </span>
        </div>
      </div>

      {/* Import JSON Modal */}
      {showImportJSON && (
        <div className="exam-speaking-p3-editor__import-modal">
          <div className="exam-speaking-p3-editor__import-content">
            <h3>Import Question from JSON</h3>
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
              <div className="exam-speaking-p3-editor__error">{jsonError}</div>
            )}
            <div className="exam-speaking-p3-editor__import-actions">
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
        <div className="exam-speaking-p3-editor__preview">
          <div className="exam-speaking-p3-editor__preview-header">
            <h3>Part 3 - TOEIC Speaking</h3>
          </div>

          <div className="exam-speaking-p3-editor__preview-content">
            {/* Left: Question */}
            <div className="exam-speaking-p3-editor__preview-question">
              <div className="exam-speaking-p3-editor__preview-question-card">
                <h4>Question {currentQuestion.question_number}</h4>
                {currentQuestion.question_text && (
                  <div className="exam-speaking-p3-editor__preview-text">
                    {currentQuestion.question_text}
                  </div>
                )}
                {currentQuestion.image_file && (
                  <div className="exam-speaking-p3-editor__preview-image">
                    <img
                      src={currentQuestion.image_file}
                      alt={`Question ${currentQuestion.question_number}`}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right: Answer Section */}
            <div className="exam-speaking-p3-editor__preview-answer">
              <div className="exam-speaking-p3-editor__preview-answer-card">
                <div className="exam-speaking-p3-editor__preview-answer-number">
                  {currentQuestion.question_number}
                </div>
                <textarea
                  value={previewNotes}
                  onChange={(e) => setPreviewNotes(e.target.value)}
                  placeholder="Write notes / outline"
                  className="exam-speaking-p3-editor__preview-notes"
                />
                <button className="exam-speaking-p3-editor__preview-record-btn">
                  🎤 RECORD
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Edit Mode */
        <div className="exam-speaking-p3-editor__edit">
          {/* Question Form */}
          <div className="exam-speaking-p3-editor__form">
            <div className="exam-speaking-p3-editor__field">
              <label>
                Question Number <span className="required">*</span>
              </label>
              <input
                type="number"
                value={currentQuestion.question_number}
                onChange={(e) =>
                  updateQuestion("question_number", parseInt(e.target.value) || 1)
                }
                min="1"
              />
            </div>

            <div className="exam-speaking-p3-editor__field">
              <label>
                Question Text <span className="required">*</span>
              </label>
              <textarea
                value={currentQuestion.question_text}
                onChange={(e) => updateQuestion("question_text", e.target.value)}
                rows={6}
                placeholder="Enter the question text..."
              />
            </div>

            <div className="exam-speaking-p3-editor__field">
              <label>Image File (Optional)</label>
              <input
                type="text"
                value={currentQuestion.image_file}
                onChange={(e) => updateQuestion("image_file", e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


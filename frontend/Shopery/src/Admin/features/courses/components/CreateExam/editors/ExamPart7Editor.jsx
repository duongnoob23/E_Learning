// ExamPart7Editor.jsx - Editor for Exam Part 7 (Reading Comprehension)
// Based on ToeicPart7Editor but adapted for Exam structure
// Features: Preview, JSON Import, Tabs navigation, 2-column layout

import { useCallback, useEffect, useRef, useState } from "react";
import "./ExamPart7Editor.css";

const CHOICE_LETTERS = ["A", "B", "C", "D"];

function createEmptyQuestion() {
  const id = `exam_p7_q_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  return {
    id,
    question_number: 1,
    reading_passage: "",
    question_text: "",
    options: [
      { label: "A", text: "" },
      { label: "B", text: "" },
      { label: "C", text: "" },
      { label: "D", text: "" },
    ],
    correctAnswer: "A",
    translation: "",
    explanation: "",
  };
}

export default function ExamPart7Editor({ questions = [], onChange }) {
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showImportJSON, setShowImportJSON] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState(null);

  // Preview state
  const [hasChecked, setHasChecked] = useState(false);
  const [previewSelectedChoice, setPreviewSelectedChoice] = useState(null);
  const [showTranslation, setShowTranslation] = useState(false);

  const isInitialMount = useRef(true);
  const hasLoadedInitialData = useRef(false);
  const prevQuestionsRef = useRef(null);

  // Map state to exam format
  const mapStateToExamData = useCallback((qs) => {
    return qs.map((q, idx) => ({
      question_id: q.id,
      question_number: q.question_number || idx + 1,
      question_text: q.question_text || "",
      question_type: "MULTIPLE_CHOICE",
      transcript: q.translation || "",
      explanation: q.explanation || "",
      choices: (q.options || []).map((opt) => ({
        choice_letter: opt.label || CHOICE_LETTERS[0],
        choice_text: opt.text || "",
        is_correct: opt.label === (q.correctAnswer || "A"),
      })),
    }));
  }, []);

  // Map exam data to state
  const mapExamDataToState = useCallback((examQuestions) => {
    if (!Array.isArray(examQuestions) || examQuestions.length === 0) {
      return [createEmptyQuestion()];
    }

    return examQuestions.map((q, idx) => {
      // Extract reading passage from question_text or a separate field
      // For Part 7, reading_passage might be stored differently
      const readingPassage = q.reading_passage || q.question_text?.split('\n\n')[0] || "";
      const questionText = q.reading_passage ? q.question_text : (q.question_text?.split('\n\n')[1] || q.question_text || "");

      // Find correct choice
      const correctChoice = q.choices?.find(c => c.is_correct)?.choice_letter || "A";

      return {
        id: q.question_id || q.id || `exam_p7_q_${idx}_${Date.now()}`,
        question_number: q.question_number || idx + 1,
        reading_passage: readingPassage,
        question_text: questionText,
        options: CHOICE_LETTERS.map((letter) => {
          const choice = q.choices?.find(c => c.choice_letter === letter);
          return {
            label: letter,
            text: choice?.choice_text || "",
          };
        }),
        correctAnswer: correctChoice,
        translation: typeof q.transcript === 'string' ? q.transcript : (q.transcript || ""),
        explanation: typeof q.explanation === 'string' ? q.explanation : (q.explanation || ""),
      };
    });
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
      const prevFirstQuestionId = prevQuestionsRef.current?.[0]?.id || prevQuestionsRef.current?.[0]?.question_id;
      const currentFirstQuestionId = questions[0]?.id || questions[0]?.question_id;
      
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
        setHasChecked(false);
        setPreviewSelectedChoice(null);
        setShowTranslation(false);
        hasLoadedInitialData.current = true;
        isInitialMount.current = false;
      } else {
        setCurrentQuestions([createEmptyQuestion()]);
        setCurrentIndex(0);
        setHasChecked(false);
        setPreviewSelectedChoice(null);
        setShowTranslation(false);
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

  const currentQuestion = currentQuestions[currentIndex] || currentQuestions[0];

  useEffect(() => {
    setHasChecked(false);
    setPreviewSelectedChoice(null);
    setShowTranslation(false);
  }, [currentIndex]);

  // CRUD
  const handleAddQuestion = () => {
    setCurrentQuestions((prev) => {
      const next = [...prev, createEmptyQuestion()];
      next[next.length - 1].question_number = next.length;
      setCurrentIndex(prev.length);
      return next;
    });
  };

  const handleAddMultipleQuestions = () => {
    const count = prompt("Enter number of questions to add:", "5");
    const num = parseInt(count);
    if (isNaN(num) || num <= 0) return;

    setCurrentQuestions((prev) => {
      const newQuestions = Array.from({ length: num }, (_, idx) => {
        const q = createEmptyQuestion();
        q.question_number = prev.length + idx + 1;
        return q;
      });
      return [...prev, ...newQuestions];
    });
  };

  const handleRemoveQuestion = (index) => {
    if (currentQuestions.length === 1) {
      alert("At least 1 question is required.");
      return;
    }
    setCurrentQuestions((prev) => {
      const filtered = prev.filter((_, idx) => idx !== index);
      filtered.forEach((q, idx) => {
        q.question_number = idx + 1;
      });
      return filtered;
    });
    if (currentIndex >= currentQuestions.length - 1) {
      setCurrentIndex(Math.max(0, currentIndex - 1));
    }
  };

  const updateCurrentQuestion = (updater) => {
    setCurrentQuestions((prev) =>
      prev.map((q, idx) => (idx === currentIndex ? { ...q, ...updater(q) } : q))
    );
  };

  const handleOptionTextChange = (label, value) => {
    updateCurrentQuestion((q) => ({
      options: (q.options || []).map((opt) =>
        opt.label === label ? { ...opt, text: value } : opt
      ),
    }));
  };

  // JSON import
  const handlePasteJSONFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJsonInput(text);
      setJsonError(null);
    } catch (err) {
      setJsonError("Cannot read clipboard: " + err.message);
    }
  };

  const handleImportJSON = () => {
    if (!jsonInput.trim()) {
      setJsonError("Please enter JSON");
      return;
    }
    let jsonData;
    try {
      jsonData = JSON.parse(jsonInput);
    } catch (e) {
      setJsonError("JSON error: " + e.message);
      return;
    }

    const arr = Array.isArray(jsonData) ? jsonData : [jsonData];
    const mapped = arr.map((q, idx) => ({
      id: q.question_id || `exam_p7_q_${Date.now()}_${idx}`,
      question_number: currentQuestions.length + idx + 1,
      reading_passage: q.reading_passage || "",
      question_text: q.question_text || "",
      options: (q.options || []).map((opt, i) => ({
        label: opt.label || CHOICE_LETTERS[i],
        text: opt.text || "",
      })),
      correctAnswer: q.correctAnswer || "A",
      translation: q.translation || "",
      explanation: q.explanation || "",
    }));

    setCurrentQuestions((prev) => [...prev, ...mapped]);
    setCurrentIndex(currentQuestions.length);
    setShowImportJSON(false);
    setJsonInput("");
    setJsonError(null);
  };

  // Preview logic
  const handleCheckAnswerPreview = () => {
    if (!previewSelectedChoice) return;
    setHasChecked(true);
  };

  const handleClearPreview = () => {
    setHasChecked(false);
    setPreviewSelectedChoice(null);
  };

  if (!currentQuestion) return <div>Loading Exam Part 7 Editor...</div>;

  return (
    <div className="exam-p7-editor">
      <div className="exam-p7-editor__header">
        <div className="exam-p7-editor__tabs">
          {currentQuestions.map((q, idx) => (
            <button
              key={q.id}
              className={`exam-p7-editor__tab ${
                idx === currentIndex ? "exam-p7-editor__tab--active" : ""
              }`}
              onClick={() => setCurrentIndex(idx)}
            >
              Question {idx + 1}
              {currentQuestions.length > 1 && (
                <span
                  className="exam-p7-editor__tab-close"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveQuestion(idx);
                  }}
                >
                  ×
                </span>
              )}
            </button>
          ))}
          <button
            className="exam-p7-editor__tab exam-p7-editor__tab--add"
            onClick={handleAddQuestion}
          >
            + Add Question
          </button>
          <button
            className="exam-p7-editor__tab exam-p7-editor__tab--add"
            onClick={handleAddMultipleQuestions}
          >
            + Add Multiple Questions
          </button>
          <button
            className="exam-p7-editor__tab exam-p7-editor__tab--json"
            onClick={() => setShowImportJSON(true)}
          >
            📝 Import JSON
          </button>
        </div>

        <div className="exam-p7-editor__header-actions">
          <button
            className={`exam-p7-editor__preview-btn ${
              showPreview ? "exam-p7-editor__preview-btn--active" : ""
            }`}
            onClick={() => setShowPreview((v) => !v)}
          >
            {showPreview ? "✕ Close Preview" : "👁 Preview"}
          </button>
        </div>
      </div>

      {showPreview ? (
        <div className="exam-p7-preview">
          <div className="exam-p7-preview__container">
            {/* Left: Reading Passage + Translation */}
            <div className="exam-p7-preview__left">
              <div className="exam-p7-preview__passage">
                {currentQuestion.reading_passage || "No reading passage"}
              </div>

              <div className="exam-p7-preview__translation">
                <button
                  type="button"
                  className="exam-p7-preview__section-header exam-p7-preview__toggle"
                  onClick={() => setShowTranslation((v) => !v)}
                >
                  Translation {showTranslation ? "▲" : "▼"}
                </button>
                {showTranslation && (
                  <div className="exam-p7-preview__section-body">
                    {currentQuestion.translation || "No translation"}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Question + Options + Explanation */}
            <div className="exam-p7-preview__right">
              <div className="exam-p7-preview__question-text">
                {currentQuestion.question_text || "No question"}
              </div>

              <div className="exam-p7-preview__options">
                {CHOICE_LETTERS.map((letter) => {
                  const isCorrect =
                    hasChecked && letter === currentQuestion.correctAnswer;
                  const isWrong =
                    hasChecked &&
                    previewSelectedChoice &&
                    previewSelectedChoice !== currentQuestion.correctAnswer &&
                    letter === previewSelectedChoice;

                  const option =
                    (currentQuestion.options || []).find(
                      (opt) => opt.label === letter
                    ) || {};

                  return (
                    <label
                      key={letter}
                      className={`exam-p7-preview__option ${
                        isCorrect ? "exam-p7-preview__option--correct" : ""
                      } ${isWrong ? "exam-p7-preview__option--wrong" : ""}`}
                    >
                      <input
                        type="radio"
                        name={`exam-p7-prev-q-${currentQuestion.id}`}
                        checked={previewSelectedChoice === letter}
                        onChange={() => setPreviewSelectedChoice(letter)}
                        disabled={hasChecked}
                      />
                      <span className="exam-p7-preview__option-label">
                        {letter}.
                      </span>
                      <span className="exam-p7-preview__option-text">
                        {option.text || ""}
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="exam-p7-preview__buttons">
                <button
                  type="button"
                  className="exam-p7-preview__btn exam-p7-preview__btn--primary"
                  onClick={handleCheckAnswerPreview}
                  disabled={!previewSelectedChoice || hasChecked}
                >
                  Check Answer
                </button>
                <button
                  type="button"
                  className="exam-p7-preview__btn"
                  onClick={handleClearPreview}
                >
                  Clear All
                </button>
              </div>

              {hasChecked && (
                <div className="exam-p7-preview__explanation">
                  <div className="exam-p7-preview__section-header">
                    Explanation
                  </div>
                  <div
                    className="exam-p7-preview__section-body"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {currentQuestion.explanation || "No explanation"}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="exam-p7-editor__body">
          <div className="exam-p7-editor__column">
            <label className="exam-p7-editor__label">
              Reading Passage{" "}
              <span className="exam-p7-editor__required">*</span>
            </label>
            <textarea
              className="exam-p7-editor__textarea exam-p7-editor__textarea--large"
              rows={12}
              placeholder="Enter long English reading passage..."
              value={currentQuestion.reading_passage}
              onChange={(e) =>
                updateCurrentQuestion(() => ({
                  reading_passage: e.target.value,
                }))
              }
            />

            <label className="exam-p7-editor__label">
              Question Text{" "}
              <span className="exam-p7-editor__required">*</span>
            </label>
            <textarea
              className="exam-p7-editor__textarea"
              rows={2}
              placeholder="Enter reading comprehension question..."
              value={currentQuestion.question_text}
              onChange={(e) =>
                updateCurrentQuestion(() => ({
                  question_text: e.target.value,
                }))
              }
            />

            <label className="exam-p7-editor__label">Answer Choices (A/B/C/D)</label>
            {CHOICE_LETTERS.map((letter) => {
              const option =
                (currentQuestion.options || []).find(
                  (opt) => opt.label === letter
                ) || {};
              return (
                <div
                  key={letter}
                  className="exam-p7-editor__field-group exam-p7-editor__field-group--inline"
                >
                  <div className="exam-p7-editor__field-label">({letter})</div>
                  <textarea
                    className="exam-p7-editor__textarea"
                    rows={1}
                    placeholder={`Content for option ${letter}...`}
                    value={option.text || ""}
                    onChange={(e) => handleOptionTextChange(letter, e.target.value)}
                  />
                </div>
              );
            })}

            <label className="exam-p7-editor__label">
              Correct Answer <span className="exam-p7-editor__required">*</span>
            </label>
            <div className="exam-p7-editor__choices-row">
              {CHOICE_LETTERS.map((letter) => (
                <label key={letter} className="exam-p7-editor__choice-radio">
                  <input
                    type="radio"
                    name={`correct-${currentQuestion.id}`}
                    checked={currentQuestion.correctAnswer === letter}
                    onChange={() =>
                      updateCurrentQuestion(() => ({ correctAnswer: letter }))
                    }
                  />
                  <span>{letter}</span>
                </label>
              ))}
            </div>

            <label className="exam-p7-editor__label">
              Translation (translate entire passage)
            </label>
            <textarea
              className="exam-p7-editor__textarea exam-p7-editor__textarea--large"
              rows={8}
              placeholder="Translate the entire reading passage..."
              value={currentQuestion.translation}
              onChange={(e) =>
                updateCurrentQuestion(() => ({ translation: e.target.value }))
              }
            />

            <label className="exam-p7-editor__label">
              Explanation (shown after check)
            </label>
            <textarea
              className="exam-p7-editor__textarea exam-p7-editor__textarea--large"
              rows={6}
              placeholder="Detailed explanation: correct answer, translate 4 options, and explain why that answer is chosen..."
              value={currentQuestion.explanation}
              onChange={(e) =>
                updateCurrentQuestion(() => ({ explanation: e.target.value }))
              }
            />
          </div>
        </div>
      )}

      {showImportJSON && (
        <div
          className="exam-p7-json-modal__backdrop"
          onMouseDown={(e) => {
            if (e.target.classList.contains("exam-p7-json-modal__backdrop")) {
              setShowImportJSON(false);
            }
          }}
        >
          <div
            className="exam-p7-json-modal"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="exam-p7-json-modal__header">
              <h3>📝 Import JSON - Exam Part 7</h3>
              <button
                type="button"
                className="exam-p7-json-modal__close"
                onClick={() => setShowImportJSON(false)}
              >
                ×
              </button>
            </div>

            <div className="exam-p7-json-modal__content">
              <p className="exam-p7-json-modal__hint">
                Paste JSON of <strong>one question</strong> or{" "}
                <strong>array of questions</strong>. Each question should have:
                <br />
                <code>
                  question_id, question_number, reading_passage, question_text,
                  options (A-D), correctAnswer, translation, explanation
                </code>
              </p>

              {(() => {
                const sampleJson = `{
  "question_id": "p7_q1",
  "question_number": 1,
  "reading_passage": "The monthly staff meeting will cover several important topics that are essential to the company's development. During the meeting, we will discuss the upcoming product launch, budget allocations for the next quarter and the new employee training program...",
  "question_text": "What does the press release announce?",
  "options": [
    { "label": "A", "text": "The launch of a new product line" },
    { "label": "B", "text": "The relocation of a company's headquarters" },
    { "label": "C", "text": "The increased earnings of a real estate firm" },
    { "label": "D", "text": "The start of a lengthy business partnership" }
  ],
  "correctAnswer": "D",
  "translation": "Cuộc họp nhân viên hàng tháng sẽ bao gồm một số chủ đề quan trọng cần thiết cho sự phát triển của công ty...",
  "explanation": "Correct Answer: D\\n\\nWhat does the press release announce? => find answer containing information about the press release content.\\n\\nA. The launch of a new product line\\nB. The relocation of a company's headquarters\\nC. Increased earnings of a real estate firm\\nD. The start of a lengthy business partnership. => first sentence mentions..."
}`;
                return (
                  <div style={{ marginBottom: 8, display: "flex", gap: 8 }}>
                    <button
                      type="button"
                      className="exam-p7-json-modal__btn"
                      onClick={() => {
                        setJsonInput(sampleJson);
                        setJsonError(null);
                      }}
                    >
                      📥 Paste Sample Format
                    </button>
                    <button
                      type="button"
                      className="exam-p7-json-modal__btn"
                      onClick={handlePasteJSONFromClipboard}
                    >
                      📋 Paste from Clipboard
                    </button>
                  </div>
                );
              })()}

              {jsonError && (
                <div className="exam-p7-json-modal__error">{jsonError}</div>
              )}

              <textarea
                className="exam-p7-json-modal__textarea"
                placeholder="Paste JSON here..."
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value);
                  setJsonError(null);
                }}
              />
            </div>

            <div className="exam-p7-json-modal__footer">
              <button
                type="button"
                className="exam-p7-json-modal__btn"
                onClick={() => setShowImportJSON(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="exam-p7-json-modal__btn exam-p7-json-modal__btn--primary"
                onClick={handleImportJSON}
              >
                ✅ Add Questions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


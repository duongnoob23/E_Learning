// ExamPart6Editor.jsx - Editor for Exam Part 6 (Text Completion)
// Based on ToeicPart6Editor but adapted for Exam structure
// Features: Preview, JSON Import, Tabs navigation
// Paragraph with "_____" placeholder + 4 options + translation + explanation

import { useCallback, useEffect, useRef, useState } from "react";
import "./ExamPart6Editor.css";

const CHOICE_LETTERS = ["A", "B", "C", "D"];

function createEmptyQuestion() {
  const id = `exam_p6_q_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  return {
    id,
    question_number: 1,
    title: "",
    questionLabel: "",
    paragraph: "",
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

export default function ExamPart6Editor({ questions = [], onChange }) {
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
      question_text: `${q.title ? `[${q.title}] ` : ""}${q.questionLabel ? `[${q.questionLabel}] ` : ""}${q.paragraph || ""}`,
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
      // Parse question_text to extract title, questionLabel, paragraph
      const questionText = q.question_text || "";
      let title = "";
      let questionLabel = "";
      let paragraph = questionText;
      
      // Try to extract title and questionLabel from question_text if formatted
      const titleMatch = questionText.match(/\[([^\]]+)\]/);
      if (titleMatch) {
        title = titleMatch[1];
        paragraph = questionText.replace(/\[([^\]]+)\]\s*/, "");
      }
      const labelMatch = paragraph.match(/\[([^\]]+)\]/);
      if (labelMatch) {
        questionLabel = labelMatch[1];
        paragraph = paragraph.replace(/\[([^\]]+)\]\s*/, "");
      }

      const correctChoice = q.choices?.find(c => c.is_correct)?.choice_letter || "A";

      return {
        id: q.question_id || q.id || `exam_p6_q_${idx}_${Date.now()}`,
        question_number: q.question_number || idx + 1,
        title: title || q.title || "",
        questionLabel: questionLabel || q.questionLabel || "",
        paragraph: paragraph || q.paragraph || "",
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
      id: q.question_id || `exam_p6_q_${Date.now()}_${idx}`,
      question_number: currentQuestions.length + idx + 1,
      title: q.title || "",
      questionLabel: q.questionLabel || "",
      paragraph: q.paragraph || "",
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

  if (!currentQuestion) return <div>Loading Exam Part 6 Editor...</div>;

  return (
    <div className="exam-p6-editor">
      <div className="exam-p6-editor__header">
        <div className="exam-p6-editor__tabs">
          {currentQuestions.map((q, idx) => (
            <button
              key={q.id}
              className={`exam-p6-editor__tab ${
                idx === currentIndex ? "exam-p6-editor__tab--active" : ""
              }`}
              onClick={() => setCurrentIndex(idx)}
            >
              Question {idx + 1}
              {currentQuestions.length > 1 && (
                <span
                  className="exam-p6-editor__tab-close"
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
            className="exam-p6-editor__tab exam-p6-editor__tab--add"
            onClick={handleAddQuestion}
          >
            + Add Question
          </button>
          <button
            className="exam-p6-editor__tab exam-p6-editor__tab--json"
            onClick={() => setShowImportJSON(true)}
          >
            📝 Import JSON
          </button>
        </div>

        <div className="exam-p6-editor__header-actions">
          <button
            className={`exam-p6-editor__preview-btn ${
              showPreview ? "exam-p6-editor__preview-btn--active" : ""
            }`}
            onClick={() => setShowPreview((v) => !v)}
          >
            {showPreview ? "✕ Close Preview" : "👁 Preview"}
          </button>
        </div>
      </div>

      {showPreview ? (
        <div className="exam-p6-preview">
          <div className="exam-p6-preview__body">
            {currentQuestion.title && (
              <div className="exam-p6-preview__title">{currentQuestion.title}</div>
            )}
            {currentQuestion.questionLabel && (
              <div className="exam-p6-preview__label">{currentQuestion.questionLabel}</div>
            )}
            <div className="exam-p6-preview__paragraph">
              {currentQuestion.paragraph || "No paragraph"}
            </div>

            <div className="exam-p6-preview__options">
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
                    className={`exam-p6-preview__option ${
                      isCorrect ? "exam-p6-preview__option--correct" : ""
                    } ${isWrong ? "exam-p6-preview__option--wrong" : ""}`}
                  >
                    <input
                      type="radio"
                      name={`exam-p6-prev-q-${currentQuestion.id}`}
                      checked={previewSelectedChoice === letter}
                      onChange={() => setPreviewSelectedChoice(letter)}
                      disabled={hasChecked}
                    />
                    <span className="exam-p6-preview__option-label">
                      {letter}.
                    </span>
                    <span className="exam-p6-preview__option-text">
                      {option.text || ""}
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="exam-p6-preview__buttons">
              <button
                type="button"
                className="exam-p6-preview__btn exam-p6-preview__btn--primary"
                onClick={handleCheckAnswerPreview}
                disabled={!previewSelectedChoice || hasChecked}
              >
                Check Answer
              </button>
              <button
                type="button"
                className="exam-p6-preview__btn"
                onClick={handleClearPreview}
              >
                Clear All
              </button>
            </div>

            <div className="exam-p6-preview__translation">
              <button
                type="button"
                className="exam-p6-preview__section-header exam-p6-preview__toggle"
                onClick={() => setShowTranslation((v) => !v)}
              >
                Translation {showTranslation ? "▲" : "▼"}
              </button>
              {showTranslation && (
                <div className="exam-p6-preview__section-body">
                  {currentQuestion.translation || "No translation"}
                </div>
              )}
            </div>

            {hasChecked && (
              <div className="exam-p6-preview__explanation">
                <div className="exam-p6-preview__section-header">
                  Explanation
                </div>
                <div className="exam-p6-preview__section-body">
                  {currentQuestion.explanation || "No explanation"}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="exam-p6-editor__body">
          <div className="exam-p6-editor__column">
            <label className="exam-p6-editor__label">Title (optional)</label>
            <input
              type="text"
              className="exam-p6-editor__input"
              placeholder="Enter question title..."
              value={currentQuestion.title}
              onChange={(e) =>
                updateCurrentQuestion(() => ({ title: e.target.value }))
              }
            />

            <label className="exam-p6-editor__label">Question Label (e.g., Q143)</label>
            <input
              type="text"
              className="exam-p6-editor__input"
              placeholder="Enter question label, e.g., Q143"
              value={currentQuestion.questionLabel}
              onChange={(e) =>
                updateCurrentQuestion(() => ({ questionLabel: e.target.value }))
              }
            />

            <label className="exam-p6-editor__label">
              Paragraph (insert "_____" where blank){" "}
              <span className="exam-p6-editor__required">*</span>
            </label>
            <textarea
              className="exam-p6-editor__textarea"
              rows={6}
              placeholder="Enter paragraph and insert '_____' where blank..."
              value={currentQuestion.paragraph}
              onChange={(e) =>
                updateCurrentQuestion(() => ({ paragraph: e.target.value }))
              }
            />

            <label className="exam-p6-editor__label">Answer Choices (A/B/C/D)</label>
            {CHOICE_LETTERS.map((letter) => {
              const option =
                (currentQuestion.options || []).find(
                  (opt) => opt.label === letter
                ) || {};
              return (
                <div
                  key={letter}
                  className="exam-p6-editor__field-group exam-p6-editor__field-group--inline"
                >
                  <div className="exam-p6-editor__field-label">({letter})</div>
                  <textarea
                    className="exam-p6-editor__textarea"
                    rows={1}
                    placeholder={`Content for option ${letter}...`}
                    value={option.text || ""}
                    onChange={(e) => handleOptionTextChange(letter, e.target.value)}
                  />
                </div>
              );
            })}

            <label className="exam-p6-editor__label">
              Correct Answer <span className="exam-p6-editor__required">*</span>
            </label>
            <div className="exam-p6-editor__choices-row">
              {CHOICE_LETTERS.map((letter) => (
                <label key={letter} className="exam-p6-editor__choice-radio">
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

            <label className="exam-p6-editor__label">Translation (always shown)</label>
            <textarea
              className="exam-p6-editor__textarea"
              rows={3}
              placeholder="Translate the paragraph..."
              value={currentQuestion.translation}
              onChange={(e) =>
                updateCurrentQuestion(() => ({ translation: e.target.value }))
              }
            />

            <label className="exam-p6-editor__label">
              Explanation (shown after check)
            </label>
            <textarea
              className="exam-p6-editor__textarea"
              rows={3}
              placeholder="Detailed explanation why this answer is chosen..."
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
          className="exam-p6-json-modal__backdrop"
          onMouseDown={(e) => {
            if (e.target.classList.contains("exam-p6-json-modal__backdrop")) {
              setShowImportJSON(false);
            }
          }}
        >
          <div
            className="exam-p6-json-modal"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="exam-p6-json-modal__header">
              <h3>📝 Import JSON - Exam Part 6</h3>
              <button
                type="button"
                className="exam-p6-json-modal__close"
                onClick={() => setShowImportJSON(false)}
              >
                ×
              </button>
            </div>

            <div className="exam-p6-json-modal__content">
              <p className="exam-p6-json-modal__hint">
                Paste JSON of <strong>one question</strong> or{" "}
                <strong>array of questions</strong>. Each question should have:
                <br />
                <code>
                  question_id, question_number, title, questionLabel,
                  paragraph (with "_____"), options (A-D), correctAnswer,
                  translation, explanation
                </code>
              </p>

              {(() => {
                const sampleJson = `{
  "question_id": "p6_q1",
  "question_number": 1,
  "title": "Education Fair",
  "questionLabel": "Q143",
  "paragraph": "(9 July) ... came to Jakarta ... _____ (143).",
  "options": [
    { "label": "A", "text": "heavy" },
    { "label": "B", "text": "heavily" },
    { "label": "C", "text": "heavier" },
    { "label": "D", "text": "heaviness" }
  ],
  "correctAnswer": "B",
  "translation": "Full paragraph translation...",
  "explanation": "Clear explanation: need adverb to modify 'represented' → heavily."
}`;
                return (
                  <div style={{ marginBottom: 8, display: "flex", gap: 8 }}>
                    <button
                      type="button"
                      className="exam-p6-json-modal__btn"
                      onClick={() => {
                        setJsonInput(sampleJson);
                        setJsonError(null);
                      }}
                    >
                      📥 Paste Sample Format
                    </button>
                    <button
                      type="button"
                      className="exam-p6-json-modal__btn"
                      onClick={handlePasteJSONFromClipboard}
                    >
                      📋 Paste from Clipboard
                    </button>
                  </div>
                );
              })()}

              {jsonError && (
                <div className="exam-p6-json-modal__error">{jsonError}</div>
              )}

              <textarea
                className="exam-p6-json-modal__textarea"
                placeholder="Paste JSON here..."
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value);
                  setJsonError(null);
                }}
              />
            </div>

            <div className="exam-p6-json-modal__footer">
              <button
                type="button"
                className="exam-p6-json-modal__btn"
                onClick={() => setShowImportJSON(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="exam-p6-json-modal__btn exam-p6-json-modal__btn--primary"
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


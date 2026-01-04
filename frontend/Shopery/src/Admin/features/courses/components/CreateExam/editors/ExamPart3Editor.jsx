// ExamPart3Editor.jsx - Editor for Exam Part 3 (Conversations)
// Based on ToeicPart3Editor but adapted for Exam structure
// Features: Preview, JSON Import, Tabs navigation
// Audio conversation + question text + 4 options + transcript + translation + explanation

import { useCallback, useEffect, useRef, useState } from "react";
import "./ExamPart3Editor.css";

const CHOICE_LETTERS = ["A", "B", "C", "D"];

function createEmptyQuestion() {
  const id = `exam_p3_q_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  return {
    id,
    question_number: 1,
    audio_file: "",
    image_file: "",
    question_text: "",
    options: [
      { label: "A", text: "" },
      { label: "B", text: "" },
      { label: "C", text: "" },
      { label: "D", text: "" },
    ],
    correctAnswer: "A",
    transcript: "",
    translation: "",
    explanation: {
      A: "",
      B: "",
      C: "",
      D: "",
      note: "",
    },
  };
}

export default function ExamPart3Editor({ questions = [], onChange }) {
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showImportJSON, setShowImportJSON] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState(null);

  // Preview state
  const [hasChecked, setHasChecked] = useState(false);
  const [previewSelectedChoice, setPreviewSelectedChoice] = useState(null);

  const audioInputRefs = useRef({});
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
      audio_file: q.audio_file || "",
      image_file: q.image_file || "",
      transcript: q.transcript || "",
      explanation: JSON.stringify(q.explanation || {}),
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
      let explanation = {};
      
      try {
        explanation = typeof q.explanation === 'string'
          ? JSON.parse(q.explanation)
          : (q.explanation || {});
      } catch (e) {
        console.warn("Failed to parse explanation:", e);
      }

      const correctChoice = q.choices?.find(c => c.is_correct)?.choice_letter || "A";

      return {
        id: q.question_id || q.id || `exam_p3_q_${idx}_${Date.now()}`,
        question_number: q.question_number || idx + 1,
        audio_file: q.audio_file || "",
        image_file: q.image_file || "",
        question_text: q.question_text || "",
        options: CHOICE_LETTERS.map((letter) => {
          const choice = q.choices?.find(c => c.choice_letter === letter);
          return {
            label: letter,
            text: choice?.choice_text || "",
          };
        }),
        correctAnswer: correctChoice,
        transcript: typeof q.transcript === 'string' ? q.transcript : (q.transcript || ""),
        translation: "",
        explanation: {
          A: explanation.A || "",
          B: explanation.B || "",
          C: explanation.C || "",
          D: explanation.D || "",
          note: explanation.note || "",
        },
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
        hasLoadedInitialData.current = true;
        isInitialMount.current = false;
      } else {
        setCurrentQuestions([createEmptyQuestion()]);
        setCurrentIndex(0);
        setHasChecked(false);
        setPreviewSelectedChoice(null);
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

  // Handlers
  const handleAudioChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("audio/")) {
      alert("Please select an audio file (mp3).");
      return;
    }
    const url = URL.createObjectURL(file);
    updateCurrentQuestion(() => ({ audio_file: url }));
  };

  const handleExplanationChange = (letter, value) => {
    updateCurrentQuestion((q) => ({
      explanation: { ...q.explanation, [letter]: value },
    }));
  };

  const handleExplanationNoteChange = (value) => {
    updateCurrentQuestion((q) => ({
      explanation: { ...q.explanation, note: value },
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
      id: q.question_id || `exam_p3_q_${Date.now()}_${idx}`,
      question_number: currentQuestions.length + idx + 1,
      audio_file: q.audio_file || "",
      image_file: q.image_file || "",
      question_text: q.questionText || q.question_text || "",
      options: (q.options || []).map((opt, i) => ({
        label: opt.label || CHOICE_LETTERS[i],
        text: opt.text || "",
      })),
      correctAnswer: q.correctAnswer || "A",
      transcript: q.transcript || "",
      translation: q.translation || "",
      explanation: {
        A: q.explanation?.A || "",
        B: q.explanation?.B || "",
        C: q.explanation?.C || "",
        D: q.explanation?.D || "",
        note: q.explanation?.note || "",
      },
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

  if (!currentQuestion) return <div>Loading Exam Part 3 Editor...</div>;

  return (
    <div className="exam-p3-editor">
      <div className="exam-p3-editor__header">
        <div className="exam-p3-editor__tabs">
          {currentQuestions.map((q, idx) => (
            <button
              key={q.id}
              className={`exam-p3-editor__tab ${
                idx === currentIndex ? "exam-p3-editor__tab--active" : ""
              }`}
              onClick={() => setCurrentIndex(idx)}
            >
              Question {idx + 1}
              {currentQuestions.length > 1 && (
                <span
                  className="exam-p3-editor__tab-close"
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
            className="exam-p3-editor__tab exam-p3-editor__tab--add"
            onClick={handleAddQuestion}
          >
            + Add Question
          </button>
          <button
            className="exam-p3-editor__tab exam-p3-editor__tab--json"
            onClick={() => setShowImportJSON(true)}
          >
            📝 Import JSON
          </button>
        </div>

        <div className="exam-p3-editor__header-actions">
          <button
            className={`exam-p3-editor__preview-btn ${
              showPreview ? "exam-p3-editor__preview-btn--active" : ""
            }`}
            onClick={() => setShowPreview((v) => !v)}
          >
            {showPreview ? "✕ Close Preview" : "👁 Preview"}
          </button>
        </div>
      </div>

      {showPreview ? (
        <div className="exam-p3-preview">
          <div className="exam-p3-preview__audio-row">
            {currentQuestion.audio_file ? (
              <audio
                style={{ width: "100%" }}
                controls
                src={currentQuestion.audio_file}
              />
            ) : (
              <div className="exam-p3-preview__audio-placeholder">
                No audio for this question
              </div>
            )}
          </div>

          {currentQuestion.transcript && (
            <div className="exam-p3-preview__transcript">
              <strong>Transcript:</strong> {currentQuestion.transcript}
            </div>
          )}

          {currentQuestion.translation && (
            <div className="exam-p3-preview__translation">
              <strong>Translation:</strong> {currentQuestion.translation}
            </div>
          )}

          <div className="exam-p3-preview__question-text">
            {currentQuestion.question_text || "No question"}
          </div>

          <div className="exam-p3-preview__options">
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
                  className={`exam-p3-preview__option ${
                    isCorrect ? "exam-p3-preview__option--correct" : ""
                  } ${isWrong ? "exam-p3-preview__option--wrong" : ""}`}
                >
                  <input
                    type="radio"
                    name={`exam-p3-prev-q-${currentQuestion.id}`}
                    checked={previewSelectedChoice === letter}
                    onChange={() => setPreviewSelectedChoice(letter)}
                    disabled={hasChecked}
                  />
                  <span className="exam-p3-preview__option-label">
                    {letter}.
                  </span>
                  <span className="exam-p3-preview__option-text">
                    {option.text || ""}
                  </span>
                </label>
              );
            })}
          </div>

          <div className="exam-p3-preview__buttons">
            <button
              type="button"
              className="exam-p3-preview__btn exam-p3-preview__btn--primary"
              onClick={handleCheckAnswerPreview}
              disabled={!previewSelectedChoice || hasChecked}
            >
              Check Answer
            </button>
            <button
              type="button"
              className="exam-p3-preview__btn"
              onClick={handleClearPreview}
            >
              Clear All
            </button>
          </div>

          {hasChecked && (
            <div className="exam-p3-preview__explanation">
              <div className="exam-p3-preview__section-header">
                Explanation
              </div>
              <div className="exam-p3-preview__section-body">
                {CHOICE_LETTERS.map((letter) => (
                  <p key={letter}>
                    <strong>({letter})</strong>{" "}
                    {currentQuestion.explanation?.[letter] || ""}
                  </p>
                ))}
                {currentQuestion.explanation?.note && (
                  <>
                    <br />
                    <p>{currentQuestion.explanation.note}</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="exam-p3-editor__body">
          <div className="exam-p3-editor__row">
            <div className="exam-p3-editor__column">
              <label className="exam-p3-editor__label">
                Audio (MP3) <span className="exam-p3-editor__required">*</span>
              </label>
              <div className="exam-p3-editor__field-group">
                <input
                  ref={(el) => {
                    if (el) audioInputRefs.current[currentQuestion.id] = el;
                  }}
                  type="file"
                  accept="audio/*"
                  style={{ display: "none" }}
                  onChange={handleAudioChange}
                />
                <button
                  type="button"
                  className="exam-p3-editor__btn"
                  onClick={() =>
                    audioInputRefs.current[currentQuestion.id]?.click()
                  }
                >
                  📤 Upload audio
                </button>
                <input
                  type="text"
                  className="exam-p3-editor__input"
                  placeholder="Or paste audio URL..."
                  value={currentQuestion.audio_file}
                  onChange={(e) =>
                    updateCurrentQuestion(() => ({ audio_file: e.target.value }))
                  }
                />
              </div>
              {currentQuestion.audio_file && (
                <div className="exam-p3-editor__audio-preview">
                  <audio controls src={currentQuestion.audio_file} />
                </div>
              )}
            </div>
          </div>

          <div className="exam-p3-editor__row">
            <div className="exam-p3-editor__column">
              <label className="exam-p3-editor__label">
                Question Text <span className="exam-p3-editor__required">*</span>
              </label>
              <textarea
                className="exam-p3-editor__textarea"
                rows={2}
                placeholder="Enter question text..."
                value={currentQuestion.question_text}
                onChange={(e) =>
                  updateCurrentQuestion(() => ({ question_text: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="exam-p3-editor__row">
            <div className="exam-p3-editor__column">
              <label className="exam-p3-editor__label">Answer Choices (A/B/C/D)</label>
              {CHOICE_LETTERS.map((letter) => {
                const option =
                  (currentQuestion.options || []).find(
                    (opt) => opt.label === letter
                  ) || {};
                return (
                  <div
                    key={letter}
                    className="exam-p3-editor__field-group exam-p3-editor__field-group--inline"
                  >
                    <div className="exam-p3-editor__field-label">({letter})</div>
                    <textarea
                      className="exam-p3-editor__textarea"
                      rows={1}
                      placeholder={`Content for option ${letter}...`}
                      value={option.text || ""}
                      onChange={(e) => handleOptionTextChange(letter, e.target.value)}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="exam-p3-editor__row">
            <div className="exam-p3-editor__column">
              <label className="exam-p3-editor__label">
                Correct Answer <span className="exam-p3-editor__required">*</span>
              </label>
              <div className="exam-p3-editor__choices-row">
                {CHOICE_LETTERS.map((letter) => (
                  <label key={letter} className="exam-p3-editor__choice-radio">
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
            </div>
          </div>

          <div className="exam-p3-editor__row exam-p3-editor__row--columns">
            <div className="exam-p3-editor__column">
              <label className="exam-p3-editor__label">Transcript (EN)</label>
              <textarea
                className="exam-p3-editor__textarea"
                rows={4}
                placeholder="Enter conversation transcript..."
                value={currentQuestion.transcript}
                onChange={(e) =>
                  updateCurrentQuestion(() => ({ transcript: e.target.value }))
                }
              />
            </div>

            <div className="exam-p3-editor__column">
              <label className="exam-p3-editor__label">Translation (VI)</label>
              <textarea
                className="exam-p3-editor__textarea"
                rows={4}
                placeholder="Enter translation..."
                value={currentQuestion.translation}
                onChange={(e) =>
                  updateCurrentQuestion(() => ({ translation: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="exam-p3-editor__row">
            <div className="exam-p3-editor__column">
              <label className="exam-p3-editor__label">Explanation (VI)</label>
              {CHOICE_LETTERS.map((letter) => (
                <div key={letter} className="exam-p3-editor__field-group">
                  <div className="exam-p3-editor__field-label">({letter})</div>
                  <textarea
                    className="exam-p3-editor__textarea"
                    rows={2}
                    placeholder={`Translation for option ${letter}...`}
                    value={currentQuestion.explanation?.[letter] || ""}
                    onChange={(e) =>
                      handleExplanationChange(letter, e.target.value)
                    }
                  />
                </div>
              ))}
              <div className="exam-p3-editor__field-group">
                <div className="exam-p3-editor__field-label">Note</div>
                <textarea
                  className="exam-p3-editor__textarea"
                  rows={3}
                  placeholder="Additional explanation..."
                  value={currentQuestion.explanation?.note || ""}
                  onChange={(e) => handleExplanationNoteChange(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {showImportJSON && (
        <div
          className="exam-p3-json-modal__backdrop"
          onMouseDown={(e) => {
            if (e.target.classList.contains("exam-p3-json-modal__backdrop")) {
              setShowImportJSON(false);
            }
          }}
        >
          <div
            className="exam-p3-json-modal"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="exam-p3-json-modal__header">
              <h3>📝 Import JSON - Exam Part 3</h3>
              <button
                type="button"
                className="exam-p3-json-modal__close"
                onClick={() => setShowImportJSON(false)}
              >
                ×
              </button>
            </div>

            <div className="exam-p3-json-modal__content">
              <p className="exam-p3-json-modal__hint">
                Paste JSON of <strong>one question</strong> or{" "}
                <strong>array of questions</strong>. Each question should have:
                <br />
                <code>
                  question_id, question_number, audio_file, questionText/question_text,
                  options (A-D), correctAnswer, transcript, translation, explanation
                </code>
              </p>

              {(() => {
                const sampleJson = `{
  "question_id": "p3_q1",
  "question_number": 1,
  "audio_file": "https://example.com/audio.mp3",
  "questionText": "What does the man suggest?",
  "options": [
    { "label": "A", "text": "To postpone the meeting" },
    { "label": "B", "text": "To change the venue" },
    { "label": "C", "text": "To cancel the event" },
    { "label": "D", "text": "To invite more people" }
  ],
  "correctAnswer": "A",
  "transcript": "Man: Should we reschedule? Woman: Yes, that would be better.",
  "translation": "Nam: Chúng ta có nên hoãn lại không? Nữ: Có, như vậy sẽ tốt hơn.",
  "explanation": {
    "A": "Hoãn cuộc họp",
    "B": "Thay đổi địa điểm",
    "C": "Hủy sự kiện",
    "D": "Mời thêm người",
    "note": "Man suggests rescheduling → Answer A"
  }
}`;
                return (
                  <div style={{ marginBottom: 8, display: "flex", gap: 8 }}>
                    <button
                      type="button"
                      className="exam-p3-json-modal__btn"
                      onClick={() => {
                        setJsonInput(sampleJson);
                        setJsonError(null);
                      }}
                    >
                      📥 Paste Sample Format
                    </button>
                    <button
                      type="button"
                      className="exam-p3-json-modal__btn"
                      onClick={handlePasteJSONFromClipboard}
                    >
                      📋 Paste from Clipboard
                    </button>
                  </div>
                );
              })()}

              {jsonError && (
                <div className="exam-p3-json-modal__error">{jsonError}</div>
              )}

              <textarea
                className="exam-p3-json-modal__textarea"
                placeholder="Paste JSON here..."
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value);
                  setJsonError(null);
                }}
              />
            </div>

            <div className="exam-p3-json-modal__footer">
              <button
                type="button"
                className="exam-p3-json-modal__btn"
                onClick={() => setShowImportJSON(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="exam-p3-json-modal__btn exam-p3-json-modal__btn--primary"
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


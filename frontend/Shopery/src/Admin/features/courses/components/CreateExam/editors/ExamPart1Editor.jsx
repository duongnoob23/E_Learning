// ExamPart1Editor.jsx - Editor for Exam Part 1 (Picture Description)
// Based on ToeicPart1Editor but adapted for Exam structure
// Features: Preview, JSON Import, Tabs navigation

import { useCallback, useEffect, useRef, useState } from "react";
import "./ExamPart1Editor.css";

const CHOICE_LETTERS = ["A", "B", "C", "D"];

function createEmptyQuestion() {
  const id = `exam_p1_q_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  return {
    id,
    question_number: 1,
    audio_file: "",
    image_file: "",
    correct_choice: "A",
    transcript: {
      A: "",
      B: "",
      C: "",
      D: "",
    },
    explanation: {
      A: "",
      B: "",
      C: "",
      D: "",
      note: "",
    },
  };
}

export default function ExamPart1Editor({ questions = [], onChange }) {
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showImportJSON, setShowImportJSON] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState(null);

  // Preview state
  const [showTranscript, setShowTranscript] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const [previewSelectedChoice, setPreviewSelectedChoice] = useState(null);

  const audioInputRefs = useRef({});
  const imageInputRefs = useRef({});
  const isInitialMount = useRef(true);
  const hasLoadedInitialData = useRef(false);
  const prevQuestionsRef = useRef(null);

  // Map state to exam format
  const mapStateToExamData = useCallback((qs) => {
    return qs.map((q, idx) => ({
      question_id: q.id,
      question_number: q.question_number || idx + 1,
      question_text: "", // Part 1 doesn't have question text
      question_type: "MULTIPLE_CHOICE",
      audio_file: q.audio_file || "",
      image_file: q.image_file || "",
      transcript: JSON.stringify(q.transcript || {}),
      explanation: JSON.stringify(q.explanation || {}),
      choices: CHOICE_LETTERS.map((letter) => ({
        choice_letter: letter,
        choice_text: q.transcript?.[letter] || "",
        is_correct: letter === (q.correct_choice || "A"),
      })),
    }));
  }, []);

  // Map exam data to state
  const mapExamDataToState = useCallback((examQuestions) => {
    if (!Array.isArray(examQuestions) || examQuestions.length === 0) {
      return [createEmptyQuestion()];
    }

    return examQuestions.map((q, idx) => {
      let transcript = {};
      let explanation = {};
      
      try {
        transcript = typeof q.transcript === 'string' 
          ? JSON.parse(q.transcript) 
          : (q.transcript || {});
        explanation = typeof q.explanation === 'string'
          ? JSON.parse(q.explanation)
          : (q.explanation || {});
      } catch (e) {
        console.warn("Failed to parse transcript/explanation:", e);
      }

      // Find correct choice from choices array
      const correctChoice = q.choices?.find(c => c.is_correct)?.choice_letter || "A";

      return {
        id: q.question_id || q.id || `exam_p1_q_${idx}_${Date.now()}`,
        question_number: q.question_number || idx + 1,
        audio_file: q.audio_file || "",
        image_file: q.image_file || "",
        correct_choice: correctChoice,
        transcript: {
          A: transcript.A || q.choices?.find(c => c.choice_letter === "A")?.choice_text || "",
          B: transcript.B || q.choices?.find(c => c.choice_letter === "B")?.choice_text || "",
          C: transcript.C || q.choices?.find(c => c.choice_letter === "C")?.choice_text || "",
          D: transcript.D || q.choices?.find(c => c.choice_letter === "D")?.choice_text || "",
        },
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
        setShowTranscript(false);
        setShowExplanation(false);
        setPreviewSelectedChoice(null);
        hasLoadedInitialData.current = true;
        isInitialMount.current = false;
      } else {
        setCurrentQuestions([createEmptyQuestion()]);
        setCurrentIndex(0);
        setHasChecked(false);
        setShowTranscript(false);
        setShowExplanation(false);
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

  // Reset preview state when switching questions
  useEffect(() => {
    setHasChecked(false);
    setShowTranscript(false);
    setShowExplanation(false);
    setPreviewSelectedChoice(null);
  }, [currentIndex]);

  // CRUD Question
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
      // Update question numbers
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

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }
    const url = URL.createObjectURL(file);
    updateCurrentQuestion(() => ({ image_file: url }));
  };

  const handleTranscriptChange = (letter, value) => {
    updateCurrentQuestion((q) => ({
      transcript: { ...q.transcript, [letter]: value },
    }));
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

  // JSON Import
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
      id: q.question_id || `exam_p1_q_${Date.now()}_${idx}`,
      question_number: currentQuestions.length + idx + 1,
      audio_file: q.audio_file || "",
      image_file: q.image_file || "",
      correct_choice: q.correct_choice || "A",
      transcript: {
        A: q.transcript?.A || "",
        B: q.transcript?.B || "",
        C: q.transcript?.C || "",
        D: q.transcript?.D || "",
      },
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
    setHasChecked(true);
    setShowTranscript(true);
    setShowExplanation(true);
  };

  const handleClearPreview = () => {
    setHasChecked(false);
    setShowTranscript(false);
    setShowExplanation(false);
    setPreviewSelectedChoice(null);
  };

  if (!currentQuestion) {
    return <div>Loading Exam Part 1 Editor...</div>;
  }

  return (
    <div className="exam-p1-editor">
      {/* Header: Tabs + Actions */}
      <div className="exam-p1-editor__header">
        <div className="exam-p1-editor__tabs">
          {currentQuestions.map((q, idx) => (
            <button
              key={q.id}
              className={`exam-p1-editor__tab ${
                idx === currentIndex ? "exam-p1-editor__tab--active" : ""
              }`}
              onClick={() => setCurrentIndex(idx)}
            >
              Question {idx + 1}
              {currentQuestions.length > 1 && (
                <span
                  className="exam-p1-editor__tab-close"
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
            className="exam-p1-editor__tab exam-p1-editor__tab--add"
            onClick={handleAddQuestion}
          >
            + Add Question
          </button>
          <button
            className="exam-p1-editor__tab exam-p1-editor__tab--json"
            onClick={() => setShowImportJSON(true)}
          >
            📝 Import JSON
          </button>
        </div>

        <div className="exam-p1-editor__header-actions">
          <button
            className={`exam-p1-editor__preview-btn ${
              showPreview ? "exam-p1-editor__preview-btn--active" : ""
            }`}
            onClick={() => setShowPreview((v) => !v)}
          >
            {showPreview ? "✕ Close Preview" : "👁 Preview"}
          </button>
        </div>
      </div>

      {showPreview ? (
        // ---------------- PREVIEW MODE ----------------
        <div className="exam-p1-preview">
          <div className="exam-p1-preview__audio-row">
            {currentQuestion.audio_file ? (
              <audio
                style={{ width: "100%" }}
                controls
                src={currentQuestion.audio_file}
              />
            ) : (
              <div className="exam-p1-preview__audio-placeholder">
                No audio for this question
              </div>
            )}
          </div>

          <div className="exam-p1-preview__body">
            <div className="exam-p1-preview__image-col">
              {currentQuestion.image_file ? (
                <img
                  src={currentQuestion.image_file}
                  alt={`Question ${currentQuestion.question_number}`}
                  className="exam-p1-preview__image"
                />
              ) : (
                <div className="exam-p1-preview__image-placeholder">
                  No image
                </div>
              )}
            </div>
            <div className="exam-p1-preview__options-col">
              <div className="exam-p1-preview__options">
                {CHOICE_LETTERS.map((letter) => (
                  <label
                    key={letter}
                    className={`exam-p1-preview__option ${
                      hasChecked && letter === currentQuestion.correct_choice
                        ? "exam-p1-preview__option--correct"
                        : ""
                    } ${
                      hasChecked &&
                      previewSelectedChoice &&
                      previewSelectedChoice !== currentQuestion.correct_choice &&
                      letter === previewSelectedChoice
                        ? "exam-p1-preview__option--wrong"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name={`exam-p1-prev-q-${currentQuestion.id}`}
                      checked={previewSelectedChoice === letter}
                      onChange={() => setPreviewSelectedChoice(letter)}
                    />
                    <span>{letter}.</span>
                  </label>
                ))}
              </div>

              <div className="exam-p1-preview__buttons">
                <button
                  type="button"
                  className="exam-p1-preview__btn exam-p1-preview__btn--primary"
                  onClick={handleCheckAnswerPreview}
                >
                  Check Answer
                </button>
                <button
                  type="button"
                  className="exam-p1-preview__btn"
                  onClick={handleClearPreview}
                >
                  Clear All
                </button>
              </div>

              {/* Transcript & Explanation */}
            </div>
          </div>

          <div className="exam-p1-preview__footer">
            {hasChecked && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                }}
              >
                <div className="exam-p1-preview__section">
                  <button
                    type="button"
                    className="exam-p1-preview__section-toggle"
                    onClick={() => setShowTranscript((v) => !v)}
                  >
                    Transcript {showTranscript ? "▲" : "▼"}
                  </button>
                  {showTranscript && (
                    <div className="exam-p1-preview__section-body">
                      {CHOICE_LETTERS.map((letter) => (
                        <p key={letter}>
                          <strong>({letter})</strong>{" "}
                          {currentQuestion.transcript?.[letter] || ""}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="exam-p1-preview__section">
                  <button
                    type="button"
                    className="exam-p1-preview__section-toggle"
                    onClick={() => setShowExplanation((v) => !v)}
                  >
                    Explanation {showExplanation ? "▲" : "▼"}
                  </button>
                  {showExplanation && (
                    <div className="exam-p1-preview__section-body">
                      <p>
                        Correct Answer:{" "}
                        <strong>{currentQuestion.correct_choice}</strong>
                      </p>
                      <p>
                        <strong>Translation of each option:</strong>
                      </p>
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
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // ---------------- EDITOR MODE ----------------
        <div className="exam-p1-editor__body">
          {/* Audio + Image config */}
          <div className="exam-p1-editor__row">
            <div className="exam-p1-editor__column">
              <label className="exam-p1-editor__label">
                Audio (MP3) <span className="exam-p1-editor__required">*</span>
              </label>
              <div className="exam-p1-editor__field-group">
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
                  className="exam-p1-editor__btn"
                  onClick={() =>
                    audioInputRefs.current[currentQuestion.id]?.click()
                  }
                >
                  📤 Upload audio
                </button>
                <input
                  type="text"
                  className="exam-p1-editor__input"
                  placeholder="Or paste audio URL..."
                  value={currentQuestion.audio_file}
                  onChange={(e) =>
                    updateCurrentQuestion(() => ({ audio_file: e.target.value }))
                  }
                />
              </div>
              {currentQuestion.audio_file && (
                <div className="exam-p1-editor__audio-preview">
                  <audio controls src={currentQuestion.audio_file} />
                </div>
              )}
            </div>

            <div className="exam-p1-editor__column">
              <label className="exam-p1-editor__label">
                Image <span className="exam-p1-editor__required">*</span>
              </label>
              <div className="exam-p1-editor__field-group">
                <input
                  ref={(el) => {
                    if (el) imageInputRefs.current[currentQuestion.id] = el;
                  }}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                <button
                  type="button"
                  className="exam-p1-editor__btn"
                  onClick={() =>
                    imageInputRefs.current[currentQuestion.id]?.click()
                  }
                >
                  📤 Upload image
                </button>
                <input
                  type="text"
                  className="exam-p1-editor__input"
                  placeholder="Or paste image URL..."
                  value={currentQuestion.image_file}
                  onChange={(e) =>
                    updateCurrentQuestion(() => ({ image_file: e.target.value }))
                  }
                />
              </div>
              {currentQuestion.image_file && (
                <div className="exam-p1-editor__image-preview">
                  <img
                    src={currentQuestion.image_file}
                    alt="Preview"
                    className="exam-p1-editor__image-preview-img"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Correct choice */}
          <div className="exam-p1-editor__row">
            <div className="exam-p1-editor__column">
              <label className="exam-p1-editor__label">
                Correct Answer <span className="exam-p1-editor__required">*</span>
              </label>
              <div className="exam-p1-editor__choices-row">
                {CHOICE_LETTERS.map((letter) => (
                  <label key={letter} className="exam-p1-editor__choice-radio">
                    <input
                      type="radio"
                      name={`correct-${currentQuestion.id}`}
                      checked={currentQuestion.correct_choice === letter}
                      onChange={() =>
                        updateCurrentQuestion(() => ({
                          correct_choice: letter,
                        }))
                      }
                    />
                    <span>{letter}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Transcript & Explanation editors */}
          <div className="exam-p1-editor__row exam-p1-editor__row--columns">
            <div className="exam-p1-editor__column">
              <label className="exam-p1-editor__label">Transcript (EN)</label>
              {CHOICE_LETTERS.map((letter) => (
                <div key={letter} className="exam-p1-editor__field-group">
                  <div className="exam-p1-editor__field-label">({letter})</div>
                  <textarea
                    className="exam-p1-editor__textarea"
                    rows={2}
                    placeholder={`English content for option ${letter}...`}
                    value={currentQuestion.transcript?.[letter] || ""}
                    onChange={(e) =>
                      handleTranscriptChange(letter, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>

            <div className="exam-p1-editor__column">
              <label className="exam-p1-editor__label">
                Explanation (VI)
              </label>
              {CHOICE_LETTERS.map((letter) => (
                <div key={letter} className="exam-p1-editor__field-group">
                  <div className="exam-p1-editor__field-label">({letter})</div>
                  <textarea
                    className="exam-p1-editor__textarea"
                    rows={2}
                    placeholder={`Translation for option ${letter}...`}
                    value={currentQuestion.explanation?.[letter] || ""}
                    onChange={(e) =>
                      handleExplanationChange(letter, e.target.value)
                    }
                  />
                </div>
              ))}
              <div className="exam-p1-editor__field-group">
                <div className="exam-p1-editor__field-label">Note</div>
                <textarea
                  className="exam-p1-editor__textarea"
                  rows={3}
                  placeholder="Additional explanation: why the answer is correct, traps to watch out for, etc."
                  value={currentQuestion.explanation?.note || ""}
                  onChange={(e) => handleExplanationNoteChange(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Import JSON */}
      {showImportJSON && (
        <div
          className="exam-p1-json-modal__backdrop"
          onMouseDown={(e) => {
            if (e.target.classList.contains("exam-p1-json-modal__backdrop")) {
              setShowImportJSON(false);
            }
          }}
        >
          <div
            className="exam-p1-json-modal"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="exam-p1-json-modal__header">
              <h3>📝 Import JSON - Exam Part 1</h3>
              <button
                type="button"
                className="exam-p1-json-modal__close"
                onClick={() => setShowImportJSON(false)}
              >
                ×
              </button>
            </div>

            <div className="exam-p1-json-modal__content">
              <p className="exam-p1-json-modal__hint">
                Paste JSON of <strong>one question</strong> or{" "}
                <strong>array of questions</strong>. Each question should have:
                <br />
                <code>
                  question_id, question_number, image_file, audio_file,
                  correct_choice, transcript.A/B/C/D, explanation.A/B/C/D,{" "}
                  explanation.note
                </code>
              </p>

              {(() => {
                const sampleJson = `{
  "question_id": "p1_q1",
  "question_number": 1,
  "image_file": "https://example.com/image.jpg",
  "audio_file": "https://example.com/audio.mp3",
  "correct_choice": "C",
  "transcript": {
    "A": "The man is grabbing a book from a shelf.",
    "B": "The woman is browsing through some magazines.",
    "C": "The woman is adjusting some blinds.",
    "D": "The man is leaning against a windowsill."
  },
  "explanation": {
    "A": "Người đàn ông đang lấy một cuốn sách trên kệ.",
    "B": "Người phụ nữ đang xem qua một số tạp chí.",
    "C": "Người phụ nữ đang điều chỉnh cái rèm.",
    "D": "Người đàn ông đang dựa vào bệ cửa sổ.",
    "note": "Nhìn vào bức tranh → chọn đáp án C."
  }
}`;
                return (
                  <div style={{ marginBottom: 8, display: "flex", gap: 8 }}>
                    <button
                      type="button"
                      className="exam-p1-json-modal__btn"
                      onClick={() => {
                        setJsonInput(sampleJson);
                        setJsonError(null);
                      }}
                    >
                      📥 Paste Sample Format
                    </button>
                    <button
                      type="button"
                      className="exam-p1-json-modal__btn"
                      onClick={handlePasteJSONFromClipboard}
                    >
                      📋 Paste from Clipboard
                    </button>
                  </div>
                );
              })()}

              {jsonError && (
                <div className="exam-p1-json-modal__error">{jsonError}</div>
              )}

              <textarea
                className="exam-p1-json-modal__textarea"
                placeholder="Paste JSON here..."
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value);
                  setJsonError(null);
                }}
              />
            </div>

            <div className="exam-p1-json-modal__footer">
              <button
                type="button"
                className="exam-p1-json-modal__btn"
                onClick={() => setShowImportJSON(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="exam-p1-json-modal__btn exam-p1-json-modal__btn--primary"
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


// ToeicPart3Editor.jsx - Editor cho dạng bài TOEIC Part 3 (Conversations)
// - Audio hội thoại + câu hỏi text + 4 đáp án text (A/B/C/D)
// - Transcript (EN) + Translation (VI) cho toàn đoạn hội thoại (luôn hiển thị trong view)
// - Giải thích đáp án: dịch 4 đáp án + note (hiện sau khi bấm Kiểm tra đáp án trong preview)

import { useCallback, useEffect, useRef, useState } from "react";
import "./ToeicPart3Editor.css";

const CHOICE_LETTERS = ["A", "B", "C", "D"];

function createEmptyQuestion() {
  const id = `toeic_p3_q_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  return {
    id,
    audioUrl: "",
    audioFile: null,
    questionText: "",
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

export default function ToeicPart3Editor({ data, onChange }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showImportJSON, setShowImportJSON] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState(null);

  // Preview state cho current question
  const [hasChecked, setHasChecked] = useState(false);
  const [previewSelectedChoice, setPreviewSelectedChoice] = useState(null);

  const audioInputRefs = useRef({});
  const isInitialMount = useRef(true);
  const hasLoadedInitialData = useRef(false);
  const prevDataRef = useRef(null);

  // ------- Helpers: map state <-> lesson_data -------

  const mapStateToLessonData = useCallback((qs) => {
    return {
      type: "toeic_part_3",
      questions: qs.map((q, idx) => ({
        question_id: q.id,
        question_number: idx + 1,
        audio_file: q.audioUrl || "",
        questionText: q.questionText || "",
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
      })),
    };
  }, []);

  const mapLessonDataToState = useCallback((lessonData) => {
    const srcQuestions = Array.isArray(lessonData?.questions)
      ? lessonData.questions
      : [];

    if (!srcQuestions.length) {
      return [createEmptyQuestion()];
    }

    return srcQuestions.map((q, idx) => ({
      id: q.question_id || `toeic_p3_q_${idx}_${Date.now()}`,
      audioUrl: q.audio_file || "",
      audioFile: null,
      questionText: q.questionText || "",
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
  }, []);

  // ------- Load initial data (pattern Part 1/2) -------

  useEffect(() => {
    const dataReferenceChanged = prevDataRef.current !== data;

    if (
      dataReferenceChanged &&
      hasLoadedInitialData.current &&
      data?.questions &&
      Array.isArray(data.questions) &&
      data.questions.length > 0
    ) {
      const prevFirstQuestionId =
        prevDataRef.current?.questions?.[0]?.question_id;
      const currentFirstQuestionId = data.questions[0]?.question_id;
      if (prevFirstQuestionId !== currentFirstQuestionId) {
        hasLoadedInitialData.current = false;
      }
    }

    if (dataReferenceChanged) {
      prevDataRef.current = data;
    }

    if (!hasLoadedInitialData.current) {
      if (
        data &&
        data.questions &&
        Array.isArray(data.questions) &&
        data.questions.length > 0
      ) {
        const initialQuestions = mapLessonDataToState(data);
        setQuestions(initialQuestions);
        setCurrentIndex(0);
        setHasChecked(false);
        setPreviewSelectedChoice(null);
        hasLoadedInitialData.current = true;
        isInitialMount.current = false;
      } else if (
        data &&
        (!data.questions ||
          !Array.isArray(data.questions) ||
          data.questions.length === 0)
      ) {
        const initialQuestions = mapLessonDataToState(data);
        setQuestions(initialQuestions);
        setCurrentIndex(0);
        setHasChecked(false);
        setPreviewSelectedChoice(null);
        hasLoadedInitialData.current = true;
        isInitialMount.current = false;
      } else if (!data && questions.length === 0) {
        setQuestions([createEmptyQuestion()]);
        setCurrentIndex(0);
        setHasChecked(false);
        setPreviewSelectedChoice(null);
        hasLoadedInitialData.current = true;
        isInitialMount.current = false;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // ------- Push change lên parent -------

  const pushChange = useCallback(
    (nextQuestions) => {
      if (isInitialMount.current) return;
      const lessonData = mapStateToLessonData(nextQuestions);
      onChange?.(lessonData);
    },
    [mapStateToLessonData, onChange]
  );

  useEffect(() => {
    if (isInitialMount.current) return;
    const timer = setTimeout(() => {
      pushChange(questions);
    }, 150);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions]);

  const currentQuestion = questions[currentIndex] || questions[0];

  useEffect(() => {
    setHasChecked(false);
    setPreviewSelectedChoice(null);
  }, [currentIndex]);

  // ------- CRUD Question -------

  const handleAddQuestion = () => {
    setQuestions((prev) => {
      const next = [...prev, createEmptyQuestion()];
      setCurrentIndex(prev.length);
      return next;
    });
  };

  const handleRemoveQuestion = (index) => {
    if (questions.length === 1) {
      alert("Phải có ít nhất 1 câu hỏi.");
      return;
    }
    setQuestions((prev) => prev.filter((_, idx) => idx !== index));
    if (currentIndex >= questions.length - 1) {
      setCurrentIndex(Math.max(0, currentIndex - 1));
    }
  };

  const updateCurrentQuestion = (updater) => {
    setQuestions((prev) =>
      prev.map((q, idx) => (idx === currentIndex ? { ...q, ...updater(q) } : q))
    );
  };

  // ------- Field handlers -------

  const handleAudioChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("audio/")) {
      alert("Vui lòng chọn file audio (mp3).");
      return;
    }
    const url = URL.createObjectURL(file);
    updateCurrentQuestion(() => ({ audioUrl: url }));
  };

  const handleOptionTextChange = (label, value) => {
    updateCurrentQuestion((q) => ({
      options: (q.options || []).map((opt) =>
        opt.label === label ? { ...opt, text: value } : opt
      ),
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

  // ------- JSON Import -------

  const handlePasteJSONFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJsonInput(text);
      setJsonError(null);
    } catch (err) {
      setJsonError("Không thể đọc clipboard: " + err.message);
    }
  };

  const handleImportJSON = () => {
    if (!jsonInput.trim()) {
      setJsonError("Vui lòng nhập JSON");
      return;
    }
    let jsonData;
    try {
      jsonData = JSON.parse(jsonInput);
    } catch (e) {
      setJsonError("Lỗi JSON: " + e.message);
      return;
    }

    const arr = Array.isArray(jsonData) ? jsonData : [jsonData];
    const mapped = arr.map((q, idx) => ({
      id: q.question_id || `toeic_p3_q_${idx}_${Date.now()}`,
      audioUrl: q.audio_file || "",
      audioFile: null,
      questionText: q.questionText || "",
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

    setQuestions((prev) => [...prev, ...mapped]);
    setCurrentIndex(questions.length);
    setShowImportJSON(false);
    setJsonInput("");
    setJsonError(null);
  };

  // ------- Preview logic -------

  const handleCheckAnswerPreview = () => {
    if (!previewSelectedChoice) return;
    setHasChecked(true);
  };

  const handleClearPreview = () => {
    setHasChecked(false);
    setPreviewSelectedChoice(null);
  };

  if (!currentQuestion) {
    return <div>Đang tải editor TOEIC Part 3...</div>;
  }

  // ------- Render -------

  return (
    <div className="toeic-p3-editor">
      <div className="toeic-p3-editor__header">
        <div className="toeic-p3-editor__tabs">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              className={`toeic-p3-editor__tab ${
                idx === currentIndex ? "toeic-p3-editor__tab--active" : ""
              }`}
              onClick={() => setCurrentIndex(idx)}
            >
              Câu {idx + 1}
              {questions.length > 1 && (
                <span
                  className="toeic-p3-editor__tab-close"
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
            className="toeic-p3-editor__tab toeic-p3-editor__tab--add"
            onClick={handleAddQuestion}
          >
            + Thêm câu hỏi
          </button>
          <button
            className="toeic-p3-editor__tab toeic-p3-editor__tab--json"
            onClick={() => setShowImportJSON(true)}
          >
            📝 Import JSON
          </button>
        </div>

        <div className="toeic-p3-editor__header-actions">
          <button
            className={`toeic-p3-editor__preview-btn ${
              showPreview ? "toeic-p3-editor__preview-btn--active" : ""
            }`}
            onClick={() => setShowPreview((v) => !v)}
          >
            {showPreview ? "✕ Đóng Preview" : "👁 Preview"}
          </button>
        </div>
      </div>

      {showPreview ? (
        // ---------------- PREVIEW MODE ----------------
        <div className="toeic-p3-preview">
          <div className="toeic-p3-preview__audio-row">
            {currentQuestion.audioUrl ? (
              <audio
                style={{ width: "100%" }}
                controls
                src={currentQuestion.audioUrl}
              />
            ) : (
              <div className="toeic-p3-preview__audio-placeholder">
                Chưa có audio cho câu này
              </div>
            )}
          </div>

          <div className="toeic-p3-preview__body">
            {currentQuestion.questionText && (
              <div className="toeic-p3-preview__question-text">
                {currentQuestion.questionText}
              </div>
            )}

            <div className="toeic-p3-preview__options">
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
                    className={`toeic-p3-preview__option ${
                      isCorrect ? "toeic-p3-preview__option--correct" : ""
                    } ${isWrong ? "toeic-p3-preview__option--wrong" : ""}`}
                  >
                    <input
                      type="radio"
                      name={`toeic-p3-prev-q-${currentQuestion.id}`}
                      checked={previewSelectedChoice === letter}
                      onChange={() => setPreviewSelectedChoice(letter)}
                    />
                    <span className="toeic-p3-preview__option-label">
                      {letter}.
                    </span>
                    <span className="toeic-p3-preview__option-text">
                      {option.text || ""}
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="toeic-p3-preview__buttons">
              <button
                type="button"
                className="toeic-p3-preview__btn toeic-p3-preview__btn--primary"
                onClick={handleCheckAnswerPreview}
              >
                Kiểm tra đáp án
              </button>
              <button
                type="button"
                className="toeic-p3-preview__btn"
                onClick={handleClearPreview}
              >
                Xóa hết
              </button>
            </div>

            {/* Transcript + Translation luôn hiển thị, Explanation sau khi check */}
            <div className="toeic-p3-preview__footer">
              <div className="toeic-p3-preview__section">
                <div className="toeic-p3-preview__section-header">
                  Transcript (EN)
                </div>
                <div className="toeic-p3-preview__section-body">
                  {currentQuestion.transcript || (
                    <span style={{ color: "#9ca3af" }}>
                      Chưa có transcript
                    </span>
                  )}
                </div>
              </div>

              <div className="toeic-p3-preview__section">
                <div className="toeic-p3-preview__section-header">
                  Dịch nghĩa (VI)
                </div>
                <div className="toeic-p3-preview__section-body">
                  {currentQuestion.translation || (
                    <span style={{ color: "#9ca3af" }}>
                      Chưa có dịch nghĩa
                    </span>
                  )}
                </div>
              </div>
            </div>

            {hasChecked && (
              <div className="toeic-p3-preview__explanation">
                <div className="toeic-p3-preview__section-header">
                  Giải thích đáp án
                </div>
                <div className="toeic-p3-preview__section-body">
                  <p>
                    Đáp án đúng:{" "}
                    <strong>{currentQuestion.correctAnswer}</strong>
                  </p>
                  <p>
                    <strong>Dịch nghĩa từng đáp án:</strong>
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
              </div>
            )}
          </div>
        </div>
      ) : (
        // ---------------- EDITOR MODE ----------------
        <div className="toeic-p3-editor__body">
          <div className="toeic-p3-editor__row toeic-p3-editor__row--columns">
            {/* Left: audio + question text + options + transcript + translation */}
            <div className="toeic-p3-editor__column">
              <label className="toeic-p3-editor__label">
                Audio (MP3) <span className="toeic-p3-editor__required">*</span>
              </label>
              <div className="toeic-p3-editor__field-group">
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
                  className="toeic-p3-editor__btn"
                  onClick={() =>
                    audioInputRefs.current[currentQuestion.id]?.click()
                  }
                >
                  📤 Upload audio
                </button>
                <input
                  type="text"
                  className="toeic-p3-editor__input"
                  placeholder="Hoặc dán URL audio..."
                  value={currentQuestion.audioUrl}
                  onChange={(e) =>
                    updateCurrentQuestion(() => ({ audioUrl: e.target.value }))
                  }
                />
              </div>
              {currentQuestion.audioUrl && (
                <div className="toeic-p3-editor__audio-preview">
                  <audio controls src={currentQuestion.audioUrl} />
                </div>
              )}

              <label className="toeic-p3-editor__label">Câu hỏi (EN)</label>
              <textarea
                className="toeic-p3-editor__textarea"
                rows={2}
                placeholder="Ví dụ: What are the speakers mainly discussing?"
                value={currentQuestion.questionText}
                onChange={(e) =>
                  updateCurrentQuestion(() => ({
                    questionText: e.target.value,
                  }))
                }
              />

              <label className="toeic-p3-editor__label">
                Đáp án (A/B/C/D)
              </label>
              {CHOICE_LETTERS.map((letter) => {
                const option =
                  (currentQuestion.options || []).find(
                    (opt) => opt.label === letter
                  ) || {};
                return (
                  <div
                    key={letter}
                    className="toeic-p3-editor__field-group toeic-p3-editor__field-group--inline"
                  >
                    <div className="toeic-p3-editor__field-label">
                      ({letter})
                    </div>
                    <textarea
                      className="toeic-p3-editor__textarea"
                      rows={1}
                      placeholder={`Nội dung đáp án ${letter}...`}
                      value={option.text || ""}
                      onChange={(e) =>
                        handleOptionTextChange(letter, e.target.value)
                      }
                    />
                  </div>
                );
              })}

              <label className="toeic-p3-editor__label">
                Transcript (EN)
              </label>
              <textarea
                className="toeic-p3-editor__textarea"
                rows={3}
                placeholder="Nội dung hội thoại tiếng Anh..."
                value={currentQuestion.transcript}
                onChange={(e) =>
                  updateCurrentQuestion(() => ({
                    transcript: e.target.value,
                  }))
                }
              />

              <label className="toeic-p3-editor__label">
                Dịch nghĩa (VI)
              </label>
              <textarea
                className="toeic-p3-editor__textarea"
                rows={3}
                placeholder="Nội dung hội thoại tiếng Việt..."
                value={currentQuestion.translation}
                onChange={(e) =>
                  updateCurrentQuestion(() => ({
                    translation: e.target.value,
                  }))
                }
              />
            </div>

            {/* Right: correct answer + giải thích đáp án */}
            <div className="toeic-p3-editor__column">
              <label className="toeic-p3-editor__label">
                Đáp án đúng <span className="toeic-p3-editor__required">*</span>
              </label>
              <div className="toeic-p3-editor__choices-row">
                {CHOICE_LETTERS.map((letter) => (
                  <label
                    key={letter}
                    className="toeic-p3-editor__choice-radio"
                  >
                    <input
                      type="radio"
                      name={`correct-${currentQuestion.id}`}
                      checked={currentQuestion.correctAnswer === letter}
                      onChange={() =>
                        updateCurrentQuestion(() => ({
                          correctAnswer: letter,
                        }))
                      }
                    />
                    <span>{letter}</span>
                  </label>
                ))}
              </div>

              <label className="toeic-p3-editor__label">
                Giải thích đáp án (dịch 4 đáp án + note)
              </label>
              {CHOICE_LETTERS.map((letter) => (
                <div
                  key={letter}
                  className="toeic-p3-editor__field-group toeic-p3-editor__field-group--inline"
                >
                  <div className="toeic-p3-editor__field-label">
                    ({letter})
                  </div>
                  <textarea
                    className="toeic-p3-editor__textarea"
                    rows={2}
                    placeholder={`Dịch nghĩa đáp án ${letter}...`}
                    value={currentQuestion.explanation?.[letter] || ""}
                    onChange={(e) =>
                      handleExplanationChange(letter, e.target.value)
                    }
                  />
                </div>
              ))}
              <div className="toeic-p3-editor__field-group">
                <div className="toeic-p3-editor__field-label">Ghi chú</div>
                <textarea
                  className="toeic-p3-editor__textarea"
                  rows={3}
                  placeholder="Giải thích thêm: tại sao đáp án đúng, lưu ý bẫy, v.v."
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
          className="toeic-p3-json-modal__backdrop"
          onMouseDown={(e) => {
            if (e.target.classList.contains("toeic-p3-json-modal__backdrop")) {
              setShowImportJSON(false);
            }
          }}
        >
          <div
            className="toeic-p3-json-modal"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="toeic-p3-json-modal__header">
              <h3>📝 Import JSON - TOEIC Part 3</h3>
              <button
                type="button"
                className="toeic-p3-json-modal__close"
                onClick={() => setShowImportJSON(false)}
              >
                ×
              </button>
            </div>

            <div className="toeic-p3-json-modal__content">
              <p className="toeic-p3-json-modal__hint">
                Paste JSON của <strong>một câu hỏi</strong> hoặc{" "}
                <strong>array câu hỏi</strong>. Mỗi câu hỏi nên có:
                <br />
                <code>
                  question_id, question_number, audio_file, questionText,
                  options (mảng các object với trường label, text),
                  correctAnswer, transcript, translation,
                  explanation.A/B/C/D, explanation.note
                </code>
              </p>

              {(() => {
                const sampleJson = `{
  "question_id": "p3_q1",
  "question_number": 1,
  "audio_file": "https://study4.com/ai_services/tts3/?q=What+are+the+speakers+discussing%3F&lang=en-US",
  "questionText": "What are the speakers mainly discussing?",
  "options": [
    { "label": "A", "text": "Buying a laptop" },
    { "label": "B", "text": "Scheduling a meeting" },
    { "label": "C", "text": "Booking a flight" },
    { "label": "D", "text": "Ordering lunch" }
  ],
  "correctAnswer": "B",
  "transcript": "They are talking about arranging a meeting next Monday morning...",
  "translation": "Họ đang trao đổi về việc sắp xếp một cuộc họp vào sáng thứ Hai tới...",
  "explanation": {
    "A": "Mua một chiếc laptop.",
    "B": "Sắp xếp một cuộc họp.",
    "C": "Đặt một chuyến bay.",
    "D": "Gọi đồ ăn trưa.",
    "note": "Trong đoạn hội thoại, họ nhắc rõ đến 'meeting' và bàn về thời gian → chọn B."
  }
}`;
                return (
                  <div style={{ marginBottom: 8, display: "flex", gap: 8 }}>
                    <button
                      type="button"
                      className="toeic-p3-json-modal__btn"
                      onClick={() => {
                        setJsonInput(sampleJson);
                        setJsonError(null);
                      }}
                    >
                      📥 Dán format mẫu
                    </button>
                    <button
                      type="button"
                      className="toeic-p3-json-modal__btn"
                      onClick={handlePasteJSONFromClipboard}
                    >
                      📋 Paste từ Clipboard
                    </button>
                  </div>
                );
              })()}

              {jsonError && (
                <div className="toeic-p3-json-modal__error">{jsonError}</div>
              )}

              <textarea
                className="toeic-p3-json-modal__textarea"
                placeholder="Paste JSON ở đây..."
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value);
                  setJsonError(null);
                }}
              />
            </div>

            <div className="toeic-p3-json-modal__footer">
              <button
                type="button"
                className="toeic-p3-json-modal__btn"
                onClick={() => setShowImportJSON(false)}
              >
                Hủy
              </button>
              <button
                type="button"
                className="toeic-p3-json-modal__btn toeic-p3-json-modal__btn--primary"
                onClick={handleImportJSON}
              >
                ✅ Thêm câu hỏi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



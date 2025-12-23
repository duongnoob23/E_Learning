// ToeicPart5Editor.jsx - Editor for TOEIC Part 5 (Incomplete Sentences)
// - Each question: questionText + 4 options text + correctAnswer
// - No audio, no image, no transcript
// - After Check in preview: show translation, analysis, explanation

import { useCallback, useEffect, useRef, useState } from "react";
import "./ToeicPart5Editor.css";

const CHOICE_LETTERS = ["A", "B", "C", "D"];

function createEmptyQuestion() {
  const id = `toeic_p5_q_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  return {
    id,
    questionText: "",
    options: [
      { label: "A", text: "" },
      { label: "B", text: "" },
      { label: "C", text: "" },
      { label: "D", text: "" },
    ],
    correctAnswer: "A",
    translation: "",
    analysis: "",
    explanation: "",
  };
}

export default function ToeicPart5Editor({ data, onChange }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showImportJSON, setShowImportJSON] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState(null);

  // Preview state
  const [hasChecked, setHasChecked] = useState(false);
  const [previewSelectedChoice, setPreviewSelectedChoice] = useState(null);

  const isInitialMount = useRef(true);
  const hasLoadedInitialData = useRef(false);
  const prevDataRef = useRef(null);

  // map state -> lesson_data
  const mapStateToLessonData = useCallback((qs) => {
    return {
      type: "toeic_part_5",
      questions: qs.map((q, idx) => ({
        question_id: q.id,
        question_number: idx + 1,
        questionText: q.questionText || "",
        options: (q.options || []).map((opt, i) => ({
          label: opt.label || CHOICE_LETTERS[i],
          text: opt.text || "",
        })),
        correctAnswer: q.correctAnswer || "A",
        translation: q.translation || "",
        analysis: q.analysis || "",
        explanation: q.explanation || "",
      })),
    };
  }, []);

  // map lesson_data -> state
  const mapLessonDataToState = useCallback((lessonData) => {
    const srcQuestions = Array.isArray(lessonData?.questions)
      ? lessonData.questions
      : [];
    if (!srcQuestions.length) return [createEmptyQuestion()];

    return srcQuestions.map((q, idx) => ({
      id: q.question_id || `toeic_p5_q_${idx}_${Date.now()}`,
      questionText: q.questionText || "",
      options: (q.options || []).map((opt, i) => ({
        label: opt.label || CHOICE_LETTERS[i],
        text: opt.text || "",
      })),
      correctAnswer: q.correctAnswer || "A",
      translation: q.translation || "",
      analysis: q.analysis || "",
      explanation: q.explanation || "",
    }));
  }, []);

  // load initial data (avoid loops)
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
        (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0)
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

  // push change with debounce
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
    const timer = setTimeout(() => pushChange(questions), 150);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions]);

  const currentQuestion = questions[currentIndex] || questions[0];

  useEffect(() => {
    setHasChecked(false);
    setPreviewSelectedChoice(null);
  }, [currentIndex]);

  // CRUD
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

  // handlers
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
      id: q.question_id || `toeic_p5_q_${idx}_${Date.now()}`,
      questionText: q.questionText || "",
      options: (q.options || []).map((opt, i) => ({
        label: opt.label || CHOICE_LETTERS[i],
        text: opt.text || "",
      })),
      correctAnswer: q.correctAnswer || "A",
      translation: q.translation || "",
      analysis: q.analysis || "",
      explanation: q.explanation || "",
    }));

    setQuestions((prev) => [...prev, ...mapped]);
    setCurrentIndex(questions.length);
    setShowImportJSON(false);
    setJsonInput("");
    setJsonError(null);
  };

  // preview logic
  const handleCheckAnswerPreview = () => {
    if (!previewSelectedChoice) return;
    setHasChecked(true);
  };

  const handleClearPreview = () => {
    setHasChecked(false);
    setPreviewSelectedChoice(null);
  };

  if (!currentQuestion) return <div>Đang tải editor TOEIC Part 5...</div>;

  return (
    <div className="toeic-p5-editor">
      <div className="toeic-p5-editor__header">
        <div className="toeic-p5-editor__tabs">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              className={`toeic-p5-editor__tab ${
                idx === currentIndex ? "toeic-p5-editor__tab--active" : ""
              }`}
              onClick={() => setCurrentIndex(idx)}
            >
              Câu {idx + 1}
              {questions.length > 1 && (
                <span
                  className="toeic-p5-editor__tab-close"
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
            className="toeic-p5-editor__tab toeic-p5-editor__tab--add"
            onClick={handleAddQuestion}
          >
            + Thêm câu hỏi
          </button>
          <button
            className="toeic-p5-editor__tab toeic-p5-editor__tab--json"
            onClick={() => setShowImportJSON(true)}
          >
            📝 Import JSON
          </button>
        </div>

        <div className="toeic-p5-editor__header-actions">
          <button
            className={`toeic-p5-editor__preview-btn ${
              showPreview ? "toeic-p5-editor__preview-btn--active" : ""
            }`}
            onClick={() => setShowPreview((v) => !v)}
          >
            {showPreview ? "✕ Đóng Preview" : "👁 Preview"}
          </button>
        </div>
      </div>

      {showPreview ? (
        <div className="toeic-p5-preview">
          <div className="toeic-p5-preview__body">
            <div className="toeic-p5-preview__question-text">
              {currentQuestion.questionText || "Chưa có câu hỏi"}
            </div>

            <div className="toeic-p5-preview__options">
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
                    className={`toeic-p5-preview__option ${
                      isCorrect ? "toeic-p5-preview__option--correct" : ""
                    } ${isWrong ? "toeic-p5-preview__option--wrong" : ""}`}
                  >
                    <input
                      type="radio"
                      name={`toeic-p5-prev-q-${currentQuestion.id}`}
                      checked={previewSelectedChoice === letter}
                      onChange={() => setPreviewSelectedChoice(letter)}
                    />
                    <span className="toeic-p5-preview__option-label">
                      {letter}.
                    </span>
                    <span className="toeic-p5-preview__option-text">
                      {option.text || ""}
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="toeic-p5-preview__buttons">
              <button
                type="button"
                className="toeic-p5-preview__btn toeic-p5-preview__btn--primary"
                onClick={handleCheckAnswerPreview}
              >
                Kiểm tra đáp án
              </button>
              <button
                type="button"
                className="toeic-p5-preview__btn"
                onClick={handleClearPreview}
              >
                Xóa hết
              </button>
            </div>

            {hasChecked && (
              <div className="toeic-p5-preview__explanation">
                {currentQuestion.translation && (
                  <div className="toeic-p5-preview__section">
                    <div className="toeic-p5-preview__section-header">
                      Dịch nghĩa
                    </div>
                    <div className="toeic-p5-preview__section-body">
                      {currentQuestion.translation}
                    </div>
                  </div>
                )}

                {currentQuestion.analysis && (
                  <div className="toeic-p5-preview__section">
                    <div className="toeic-p5-preview__section-header">
                      Phân tích
                    </div>
                    <div className="toeic-p5-preview__section-body">
                      {currentQuestion.analysis}
                    </div>
                  </div>
                )}

                {currentQuestion.explanation && (
                  <div className="toeic-p5-preview__section">
                    <div className="toeic-p5-preview__section-header">
                      Giải thích
                    </div>
                    <div className="toeic-p5-preview__section-body">
                      {currentQuestion.explanation}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="toeic-p5-editor__body">
          <div className="toeic-p5-editor__column">
            <label className="toeic-p5-editor__label">
              Câu hỏi (EN) <span className="toeic-p5-editor__required">*</span>
            </label>
            <textarea
              className="toeic-p5-editor__textarea"
              rows={3}
              placeholder="Nhập câu hỏi..."
              value={currentQuestion.questionText}
              onChange={(e) =>
                updateCurrentQuestion(() => ({ questionText: e.target.value }))
              }
            />

            <label className="toeic-p5-editor__label">Đáp án (A/B/C/D)</label>
            {CHOICE_LETTERS.map((letter) => {
              const option =
                (currentQuestion.options || []).find(
                  (opt) => opt.label === letter
                ) || {};
              return (
                <div
                  key={letter}
                  className="toeic-p5-editor__field-group toeic-p5-editor__field-group--inline"
                >
                  <div className="toeic-p5-editor__field-label">({letter})</div>
                  <textarea
                    className="toeic-p5-editor__textarea"
                    rows={1}
                    placeholder={`Nội dung đáp án ${letter}...`}
                    value={option.text || ""}
                    onChange={(e) => handleOptionTextChange(letter, e.target.value)}
                  />
                </div>
              );
            })}

            <label className="toeic-p5-editor__label">
              Đáp án đúng <span className="toeic-p5-editor__required">*</span>
            </label>
            <div className="toeic-p5-editor__choices-row">
              {CHOICE_LETTERS.map((letter) => (
                <label key={letter} className="toeic-p5-editor__choice-radio">
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

            <label className="toeic-p5-editor__label">Dịch nghĩa</label>
            <textarea
              className="toeic-p5-editor__textarea"
              rows={2}
              placeholder="Dịch nghĩa/diễn giải câu hỏi..."
              value={currentQuestion.translation}
              onChange={(e) =>
                updateCurrentQuestion(() => ({ translation: e.target.value }))
              }
            />

            <label className="toeic-p5-editor__label">Phân tích</label>
            <textarea
              className="toeic-p5-editor__textarea"
              rows={2}
              placeholder="Phân tích vì sao chọn đáp án..."
              value={currentQuestion.analysis}
              onChange={(e) =>
                updateCurrentQuestion(() => ({ analysis: e.target.value }))
              }
            />

            <label className="toeic-p5-editor__label">Giải thích</label>
            <textarea
              className="toeic-p5-editor__textarea"
              rows={3}
              placeholder="Giải thích chi tiết..."
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
          className="toeic-p5-json-modal__backdrop"
          onMouseDown={(e) => {
            if (e.target.classList.contains("toeic-p5-json-modal__backdrop")) {
              setShowImportJSON(false);
            }
          }}
        >
          <div
            className="toeic-p5-json-modal"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="toeic-p5-json-modal__header">
              <h3>📝 Import JSON - TOEIC Part 5</h3>
              <button
                type="button"
                className="toeic-p5-json-modal__close"
                onClick={() => setShowImportJSON(false)}
              >
                ×
              </button>
            </div>

            <div className="toeic-p5-json-modal__content">
              <p className="toeic-p5-json-modal__hint">
                Paste JSON của <strong>một câu hỏi</strong> hoặc{" "}
                <strong>array câu hỏi</strong>. Mỗi câu hỏi nên có:
                <br />
                <code>
                  question_id, question_number, questionText, options (A-D),
                  correctAnswer, translation, analysis, explanation
                </code>
              </p>

              {(() => {
                const sampleJson = `{
  "question_id": "p5_q1",
  "question_number": 1,
  "questionText": "The contractor had a fifteen-percent _____ in his business after advertising in the local newspaper.",
  "options": [
    { "label": "A", "text": "experience" },
    { "label": "B", "text": "growth" },
    { "label": "C", "text": "formula" },
    { "label": "D", "text": "incentive" }
  ],
  "correctAnswer": "B",
  "translation": "Nhà thầu đã có tăng trưởng 15% trong việc kinh doanh sau khi quảng cáo trên tờ báo địa phương.",
  "analysis": "Câu hỏi kiểm tra danh từ/cụm danh từ phù hợp. 'Growth' hợp ngữ cảnh tăng trưởng.",
  "explanation": "Đáp án đúng: B. growth."
}`;
                return (
                  <div style={{ marginBottom: 8, display: "flex", gap: 8 }}>
                    <button
                      type="button"
                      className="toeic-p5-json-modal__btn"
                      onClick={() => {
                        setJsonInput(sampleJson);
                        setJsonError(null);
                      }}
                    >
                      📥 Dán format mẫu
                    </button>
                    <button
                      type="button"
                      className="toeic-p5-json-modal__btn"
                      onClick={handlePasteJSONFromClipboard}
                    >
                      📋 Paste từ Clipboard
                    </button>
                  </div>
                );
              })()}

              {jsonError && (
                <div className="toeic-p5-json-modal__error">{jsonError}</div>
              )}

              <textarea
                className="toeic-p5-json-modal__textarea"
                placeholder="Paste JSON ở đây..."
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value);
                  setJsonError(null);
                }}
              />
            </div>

            <div className="toeic-p5-json-modal__footer">
              <button
                type="button"
                className="toeic-p5-json-modal__btn"
                onClick={() => setShowImportJSON(false)}
              >
                Hủy
              </button>
              <button
                type="button"
                className="toeic-p5-json-modal__btn toeic-p5-json-modal__btn--primary"
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



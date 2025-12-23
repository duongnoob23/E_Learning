// ToeicPart6Editor.jsx - Editor for TOEIC Part 6 (Text Completion - manual blanks)
// Each question: paragraph (with "_____" placeholder for one blank), 4 options text, correctAnswer,
// translation (always shown), explanation (shown after Check).

import { useCallback, useEffect, useRef, useState } from "react";
import "./ToeicPart6Editor.css";

const CHOICE_LETTERS = ["A", "B", "C", "D"];

function createEmptyQuestion() {
  const id = `toeic_p6_q_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  return {
    id,
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

export default function ToeicPart6Editor({ data, onChange }) {
  const [questions, setQuestions] = useState([]);
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
  const prevDataRef = useRef(null);

  // map state -> lesson_data
  const mapStateToLessonData = useCallback((qs) => {
    return {
      type: "toeic_part_6",
      questions: qs.map((q, idx) => ({
        question_id: q.id,
        question_number: idx + 1,
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
      id: q.question_id || `toeic_p6_q_${idx}_${Date.now()}`,
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
  }, []);

  // load initial data
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
    setShowTranslation(false);
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
      id: q.question_id || `toeic_p6_q_${idx}_${Date.now()}`,
      paragraph: q.paragraph || "",
      options: (q.options || []).map((opt, i) => ({
        label: opt.label || CHOICE_LETTERS[i],
        text: opt.text || "",
      })),
      correctAnswer: q.correctAnswer || "A",
      translation: q.translation || "",
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

  if (!currentQuestion) return <div>Đang tải editor TOEIC Part 6...</div>;

  return (
    <div className="toeic-p6-editor">
      <div className="toeic-p6-editor__header">
        <div className="toeic-p6-editor__tabs">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              className={`toeic-p6-editor__tab ${
                idx === currentIndex ? "toeic-p6-editor__tab--active" : ""
              }`}
              onClick={() => setCurrentIndex(idx)}
            >
              Câu {idx + 1}
              {questions.length > 1 && (
                <span
                  className="toeic-p6-editor__tab-close"
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
            className="toeic-p6-editor__tab toeic-p6-editor__tab--add"
            onClick={handleAddQuestion}
          >
            + Thêm câu hỏi
          </button>
          <button
            className="toeic-p6-editor__tab toeic-p6-editor__tab--json"
            onClick={() => setShowImportJSON(true)}
          >
            📝 Import JSON
          </button>
        </div>

        <div className="toeic-p6-editor__header-actions">
          <button
            className={`toeic-p6-editor__preview-btn ${
              showPreview ? "toeic-p6-editor__preview-btn--active" : ""
            }`}
            onClick={() => setShowPreview((v) => !v)}
          >
            {showPreview ? "✕ Đóng Preview" : "👁 Preview"}
          </button>
        </div>
      </div>

      {showPreview ? (
        <div className="toeic-p6-preview">
          <div className="toeic-p6-preview__body">
            {currentQuestion.title && (
              <div className="toeic-p6-preview__title">{currentQuestion.title}</div>
            )}
            {currentQuestion.questionLabel && (
              <div className="toeic-p6-preview__label">{currentQuestion.questionLabel}</div>
            )}
            <div className="toeic-p6-preview__paragraph">
              {currentQuestion.paragraph || "Chưa có đoạn văn"}
            </div>

            <div className="toeic-p6-preview__options">
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
                    className={`toeic-p6-preview__option ${
                      isCorrect ? "toeic-p6-preview__option--correct" : ""
                    } ${isWrong ? "toeic-p6-preview__option--wrong" : ""}`}
                  >
                    <input
                      type="radio"
                      name={`toeic-p6-prev-q-${currentQuestion.id}`}
                      checked={previewSelectedChoice === letter}
                      onChange={() => setPreviewSelectedChoice(letter)}
                    />
                    <span className="toeic-p6-preview__option-label">
                      {letter}.
                    </span>
                    <span className="toeic-p6-preview__option-text">
                      {option.text || ""}
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="toeic-p6-preview__buttons">
              <button
                type="button"
                className="toeic-p6-preview__btn toeic-p6-preview__btn--primary"
                onClick={handleCheckAnswerPreview}
              >
                Kiểm tra đáp án
              </button>
              <button
                type="button"
                className="toeic-p6-preview__btn"
                onClick={handleClearPreview}
              >
                Xóa hết
              </button>
            </div>

            <div className="toeic-p6-preview__translation">
              <button
                type="button"
                className="toeic-p6-preview__section-header toeic-p6-preview__toggle"
                onClick={() => setShowTranslation((v) => !v)}
              >
                Dịch nghĩa {showTranslation ? "▲" : "▼"}
              </button>
              {showTranslation && (
                <div className="toeic-p6-preview__section-body">
                  {currentQuestion.translation || "Chưa có dịch nghĩa"}
                </div>
              )}
            </div>

            {hasChecked && (
              <div className="toeic-p6-preview__explanation">
                <div className="toeic-p6-preview__section-header">
                  Giải thích đáp án
                </div>
                <div className="toeic-p6-preview__section-body">
                  {currentQuestion.explanation || "Chưa có giải thích"}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="toeic-p6-editor__body">
          <div className="toeic-p6-editor__column">
            <label className="toeic-p6-editor__label">Tiêu đề (tùy chọn)</label>
            <input
              type="text"
              className="toeic-p6-editor__input"
              placeholder="Nhập tiêu đề câu hỏi..."
              value={currentQuestion.title}
              onChange={(e) =>
                updateCurrentQuestion(() => ({ title: e.target.value }))
              }
            />

            <label className="toeic-p6-editor__label">Nhãn câu hỏi (ví dụ Q143)</label>
            <input
              type="text"
              className="toeic-p6-editor__input"
              placeholder="Nhập nhãn câu hỏi, ví dụ: Q143"
              value={currentQuestion.questionLabel}
              onChange={(e) =>
                updateCurrentQuestion(() => ({ questionLabel: e.target.value }))
              }
            />

            <label className="toeic-p6-editor__label">
              Đoạn văn (chèn “_____” vào vị trí cần điền){" "}
              <span className="toeic-p6-editor__required">*</span>
            </label>
            <textarea
              className="toeic-p6-editor__textarea"
              rows={6}
              placeholder="Nhập đoạn văn và chèn '_____' vào vị trí cần điền..."
              value={currentQuestion.paragraph}
              onChange={(e) =>
                updateCurrentQuestion(() => ({ paragraph: e.target.value }))
              }
            />

            <label className="toeic-p6-editor__label">Đáp án (A/B/C/D)</label>
            {CHOICE_LETTERS.map((letter) => {
              const option =
                (currentQuestion.options || []).find(
                  (opt) => opt.label === letter
                ) || {};
              return (
                <div
                  key={letter}
                  className="toeic-p6-editor__field-group toeic-p6-editor__field-group--inline"
                >
                  <div className="toeic-p6-editor__field-label">({letter})</div>
                  <textarea
                    className="toeic-p6-editor__textarea"
                    rows={1}
                    placeholder={`Nội dung đáp án ${letter}...`}
                    value={option.text || ""}
                    onChange={(e) => handleOptionTextChange(letter, e.target.value)}
                  />
                </div>
              );
            })}

            <label className="toeic-p6-editor__label">
              Đáp án đúng <span className="toeic-p6-editor__required">*</span>
            </label>
            <div className="toeic-p6-editor__choices-row">
              {CHOICE_LETTERS.map((letter) => (
                <label key={letter} className="toeic-p6-editor__choice-radio">
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

            <label className="toeic-p6-editor__label">Dịch nghĩa (luôn hiển)</label>
            <textarea
              className="toeic-p6-editor__textarea"
              rows={3}
              placeholder="Dịch nghĩa đoạn văn..."
              value={currentQuestion.translation}
              onChange={(e) =>
                updateCurrentQuestion(() => ({ translation: e.target.value }))
              }
            />

            <label className="toeic-p6-editor__label">
              Giải thích (hiện sau khi kiểm tra)
            </label>
            <textarea
              className="toeic-p6-editor__textarea"
              rows={3}
              placeholder="Giải thích chi tiết vì sao chọn đáp án..."
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
          className="toeic-p6-json-modal__backdrop"
          onMouseDown={(e) => {
            if (e.target.classList.contains("toeic-p6-json-modal__backdrop")) {
              setShowImportJSON(false);
            }
          }}
        >
          <div
            className="toeic-p6-json-modal"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="toeic-p6-json-modal__header">
              <h3>📝 Import JSON - TOEIC Part 6</h3>
              <button
                type="button"
                className="toeic-p6-json-modal__close"
                onClick={() => setShowImportJSON(false)}
              >
                ×
              </button>
            </div>

            <div className="toeic-p6-json-modal__content">
              <p className="toeic-p6-json-modal__hint">
                Paste JSON của <strong>một câu hỏi</strong> hoặc{" "}
                <strong>array câu hỏi</strong>. Mỗi câu hỏi nên có:
                <br />
                <code>
                  question_id, question_number, title, questionLabel,
                  paragraph (có "_____"), options (A-D), correctAnswer,
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
  "translation": "Đoạn dịch nghĩa đầy đủ...",
  "explanation": "Giải thích rõ: cần trạng từ bổ nghĩa cho 'represented' → heavily."
}`;
                return (
                  <div style={{ marginBottom: 8, display: "flex", gap: 8 }}>
                    <button
                      type="button"
                      className="toeic-p6-json-modal__btn"
                      onClick={() => {
                        setJsonInput(sampleJson);
                        setJsonError(null);
                      }}
                    >
                      📥 Dán format mẫu
                    </button>
                    <button
                      type="button"
                      className="toeic-p6-json-modal__btn"
                      onClick={handlePasteJSONFromClipboard}
                    >
                      📋 Paste từ Clipboard
                    </button>
                  </div>
                );
              })()}

              {jsonError && (
                <div className="toeic-p6-json-modal__error">{jsonError}</div>
              )}

              <textarea
                className="toeic-p6-json-modal__textarea"
                placeholder="Paste JSON ở đây..."
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value);
                  setJsonError(null);
                }}
              />
            </div>

            <div className="toeic-p6-json-modal__footer">
              <button
                type="button"
                className="toeic-p6-json-modal__btn"
                onClick={() => setShowImportJSON(false)}
              >
                Hủy
              </button>
              <button
                type="button"
                className="toeic-p6-json-modal__btn toeic-p6-json-modal__btn--primary"
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



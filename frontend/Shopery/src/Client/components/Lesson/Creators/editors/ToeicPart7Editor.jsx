// ToeicPart7Editor.jsx - Editor for TOEIC Part 7 (Reading Comprehension)
// Each question: reading_passage (long English text), question_text, 4 options text, correctAnswer,
// translation (translate full passage - always shown), explanation (shown after Check).

import { useCallback, useEffect, useRef, useState } from "react";
import "./ToeicPart7Editor.css";

const CHOICE_LETTERS = ["A", "B", "C", "D"];

function createEmptyQuestion() {
  const id = `toeic_p7_q_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  return {
    id,
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

export default function ToeicPart7Editor({ data, onChange }) {
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
      type: "toeic_part_7",
      questions: qs.map((q, idx) => ({
        question_id: q.id,
        question_number: idx + 1,
        reading_passage: q.reading_passage || "",
        question_text: q.question_text || "",
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
      id: q.question_id || `toeic_p7_q_${idx}_${Date.now()}`,
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
        console.log(
          "📌 ToeicPart7Editor - Different lesson detected, resetting load flag"
        );
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

  const handleAddMultipleQuestions = () => {
    const count = prompt("Nhập số lượng câu hỏi muốn thêm:", "5");
    const num = parseInt(count);
    if (isNaN(num) || num <= 0) return;

    setQuestions((prev) => {
      const newQuestions = Array.from({ length: num }, () =>
        createEmptyQuestion()
      );
      return [...prev, ...newQuestions];
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
      id: q.question_id || `toeic_p7_q_${idx}_${Date.now()}`,
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

  if (!currentQuestion) return <div>Đang tải editor TOEIC Part 7...</div>;

  return (
    <div className="toeic-p7-editor">
      <div className="toeic-p7-editor__header">
        <div className="toeic-p7-editor__tabs">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              className={`toeic-p7-editor__tab ${
                idx === currentIndex ? "toeic-p7-editor__tab--active" : ""
              }`}
              onClick={() => setCurrentIndex(idx)}
            >
              Câu {idx + 1}
              {questions.length > 1 && (
                <span
                  className="toeic-p7-editor__tab-close"
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
            className="toeic-p7-editor__tab toeic-p7-editor__tab--add"
            onClick={handleAddQuestion}
          >
            + Thêm câu hỏi
          </button>
          <button
            className="toeic-p7-editor__tab toeic-p7-editor__tab--add"
            onClick={handleAddMultipleQuestions}
          >
            + Thêm nhiều câu hỏi
          </button>
          <button
            className="toeic-p7-editor__tab toeic-p7-editor__tab--json"
            onClick={() => setShowImportJSON(true)}
          >
            📝 Import JSON
          </button>
        </div>

        <div className="toeic-p7-editor__header-actions">
          <button
            className={`toeic-p7-editor__preview-btn ${
              showPreview ? "toeic-p7-editor__preview-btn--active" : ""
            }`}
            onClick={() => setShowPreview((v) => !v)}
          >
            {showPreview ? "✕ Đóng Preview" : "👁 Preview"}
          </button>
        </div>
      </div>

      {showPreview ? (
        <div className="toeic-p7-preview">
          <div className="toeic-p7-preview__container">
            {/* Left: Reading Passage + Translation */}
            <div className="toeic-p7-preview__left">
              <div className="toeic-p7-preview__passage">
                {currentQuestion.reading_passage || "Chưa có đoạn văn"}
              </div>

              <div className="toeic-p7-preview__translation">
                <button
                  type="button"
                  className="toeic-p7-preview__section-header toeic-p7-preview__toggle"
                  onClick={() => setShowTranslation((v) => !v)}
                >
                  Dịch nghĩa {showTranslation ? "▲" : "▼"}
                </button>
                {showTranslation && (
                  <div className="toeic-p7-preview__section-body">
                    {currentQuestion.translation || "Chưa có dịch nghĩa"}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Question + Options + Explanation */}
            <div className="toeic-p7-preview__right">
              <div className="toeic-p7-preview__question-text">
                {currentQuestion.question_text || "Chưa có câu hỏi"}
              </div>

              <div className="toeic-p7-preview__options">
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
                      className={`toeic-p7-preview__option ${
                        isCorrect ? "toeic-p7-preview__option--correct" : ""
                      } ${isWrong ? "toeic-p7-preview__option--wrong" : ""}`}
                    >
                      <input
                        type="radio"
                        name={`toeic-p7-prev-q-${currentQuestion.id}`}
                        checked={previewSelectedChoice === letter}
                        onChange={() => setPreviewSelectedChoice(letter)}
                        disabled={hasChecked}
                      />
                      <span className="toeic-p7-preview__option-label">
                        {letter}.
                      </span>
                      <span className="toeic-p7-preview__option-text">
                        {option.text || ""}
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="toeic-p7-preview__buttons">
                <button
                  type="button"
                  className="toeic-p7-preview__btn toeic-p7-preview__btn--primary"
                  onClick={handleCheckAnswerPreview}
                  disabled={!previewSelectedChoice || hasChecked}
                >
                  Kiểm tra đáp án
                </button>
                <button
                  type="button"
                  className="toeic-p7-preview__btn"
                  onClick={handleClearPreview}
                >
                  Xóa hết
                </button>
              </div>

              {hasChecked && (
                <div className="toeic-p7-preview__explanation">
                  <div className="toeic-p7-preview__section-header">
                    Giải thích đáp án
                  </div>
                  <div
                    className="toeic-p7-preview__section-body"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {currentQuestion.explanation || "Chưa có giải thích"}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="toeic-p7-editor__body">
          <div className="toeic-p7-editor__column">
            <label className="toeic-p7-editor__label">
              Đoạn văn đọc hiểu (Reading Passage){" "}
              <span className="toeic-p7-editor__required">*</span>
            </label>
            <textarea
              className="toeic-p7-editor__textarea toeic-p7-editor__textarea--large"
              rows={12}
              placeholder="Nhập đoạn văn tiếng Anh dài..."
              value={currentQuestion.reading_passage}
              onChange={(e) =>
                updateCurrentQuestion(() => ({
                  reading_passage: e.target.value,
                }))
              }
            />

            <label className="toeic-p7-editor__label">
              Câu hỏi (Question Text){" "}
              <span className="toeic-p7-editor__required">*</span>
            </label>
            <textarea
              className="toeic-p7-editor__textarea"
              rows={2}
              placeholder="Nhập câu hỏi đọc hiểu..."
              value={currentQuestion.question_text}
              onChange={(e) =>
                updateCurrentQuestion(() => ({
                  question_text: e.target.value,
                }))
              }
            />

            <label className="toeic-p7-editor__label">Đáp án (A/B/C/D)</label>
            {CHOICE_LETTERS.map((letter) => {
              const option =
                (currentQuestion.options || []).find(
                  (opt) => opt.label === letter
                ) || {};
              return (
                <div
                  key={letter}
                  className="toeic-p7-editor__field-group toeic-p7-editor__field-group--inline"
                >
                  <div className="toeic-p7-editor__field-label">({letter})</div>
                  <textarea
                    className="toeic-p7-editor__textarea"
                    rows={1}
                    placeholder={`Nội dung đáp án ${letter}...`}
                    value={option.text || ""}
                    onChange={(e) => handleOptionTextChange(letter, e.target.value)}
                  />
                </div>
              );
            })}

            <label className="toeic-p7-editor__label">
              Đáp án đúng <span className="toeic-p7-editor__required">*</span>
            </label>
            <div className="toeic-p7-editor__choices-row">
              {CHOICE_LETTERS.map((letter) => (
                <label key={letter} className="toeic-p7-editor__choice-radio">
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

            <label className="toeic-p7-editor__label">
              Dịch nghĩa (dịch toàn bộ đoạn văn)
            </label>
            <textarea
              className="toeic-p7-editor__textarea toeic-p7-editor__textarea--large"
              rows={8}
              placeholder="Dịch nghĩa toàn bộ đoạn văn reading passage..."
              value={currentQuestion.translation}
              onChange={(e) =>
                updateCurrentQuestion(() => ({ translation: e.target.value }))
              }
            />

            <label className="toeic-p7-editor__label">
              Giải thích đáp án (hiện sau khi kiểm tra)
            </label>
            <textarea
              className="toeic-p7-editor__textarea toeic-p7-editor__textarea--large"
              rows={6}
              placeholder="Giải thích chi tiết: Đáp án đúng, dịch 4 đáp án, và giải thích tại sao chọn đáp án đó..."
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
          className="toeic-p7-json-modal__backdrop"
          onMouseDown={(e) => {
            if (e.target.classList.contains("toeic-p7-json-modal__backdrop")) {
              setShowImportJSON(false);
            }
          }}
        >
          <div
            className="toeic-p7-json-modal"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="toeic-p7-json-modal__header">
              <h3>📝 Import JSON - TOEIC Part 7</h3>
              <button
                type="button"
                className="toeic-p7-json-modal__close"
                onClick={() => setShowImportJSON(false)}
              >
                ×
              </button>
            </div>

            <div className="toeic-p7-json-modal__content">
              <p className="toeic-p7-json-modal__hint">
                Paste JSON của <strong>một câu hỏi</strong> hoặc{" "}
                <strong>array câu hỏi</strong>. Mỗi câu hỏi nên có:
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
  "explanation": "Đáp án đúng: D\\n\\nThông cáo báo chí thông báo gì? => tìm đáp án chứa thông tin về nội dung thông báo của thông cáo báo chí.\\n\\nA. Sự ra mắt của một dòng sản phẩm mới\\nB. Việc di dời trụ sở chính của công ty\\nC. Thu nhập tăng lên của một công ty bất động sản\\nD. Sự khởi đầu của một mối quan hệ đối tác kinh doanh lâu dài. => câu đầu tiên có đề cập..."
}`;
                return (
                  <div style={{ marginBottom: 8, display: "flex", gap: 8 }}>
                    <button
                      type="button"
                      className="toeic-p7-json-modal__btn"
                      onClick={() => {
                        setJsonInput(sampleJson);
                        setJsonError(null);
                      }}
                    >
                      📥 Dán format mẫu
                    </button>
                    <button
                      type="button"
                      className="toeic-p7-json-modal__btn"
                      onClick={handlePasteJSONFromClipboard}
                    >
                      📋 Paste từ Clipboard
                    </button>
                  </div>
                );
              })()}

              {jsonError && (
                <div className="toeic-p7-json-modal__error">{jsonError}</div>
              )}

              <textarea
                className="toeic-p7-json-modal__textarea"
                placeholder="Paste JSON ở đây..."
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value);
                  setJsonError(null);
                }}
              />
            </div>

            <div className="toeic-p7-json-modal__footer">
              <button
                type="button"
                className="toeic-p7-json-modal__btn"
                onClick={() => setShowImportJSON(false)}
              >
                Hủy
              </button>
              <button
                type="button"
                className="toeic-p7-json-modal__btn toeic-p7-json-modal__btn--primary"
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


// ToeicPart1Editor.jsx - Editor cho dạng bài TOEIC Part 1 (Picture Description)
// - Chỉ tập trung vào phần nghe: 1 audio, 1 ảnh, 4 đáp án A/B/C/D (không có text)
// - Hỗ trợ:
//    + Tạo nhiều câu hỏi trong 1 modal (tabs Câu 1, Câu 2, ...)
//    + Tạo thủ công: upload/URL audio + ảnh, chọn đáp án đúng, nhập transcript & giải thích
//    + Tạo nhanh bằng JSON
//    + Preview giống giao diện học viên: audio + ảnh + 4 đáp án + nút [Kiểm tra đáp án] / [Xóa hết]

import { useCallback, useEffect, useRef, useState } from "react";
import "./ToeicPart1Editor.css";

const CHOICE_LETTERS = ["A", "B", "C", "D"];

function createEmptyQuestion() {
  const id = `toeic_p1_q_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  return {
    id,
    // Không cần order, vì sẽ tự động tính từ idx + 1 khi hiển thị và save
    audioUrl: "",
    imageUrl: "",
    correctChoice: "A",
    // Transcript tiếng Anh cho từng đáp án
    transcript: {
      A: "",
      B: "",
      C: "",
      D: "",
    },
    // Giải thích tiếng Việt + dịch nghĩa từng đáp án
    explanation: {
      A: "",
      B: "",
      C: "",
      D: "",
      note: "",
    },
  };
}

export default function ToeicPart1Editor({ data, onChange }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showImportJSON, setShowImportJSON] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState(null);

  // Preview state cho current question
  const [showTranscript, setShowTranscript] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const [previewSelectedChoice, setPreviewSelectedChoice] = useState(null);

  const audioInputRefs = useRef({});
  const imageInputRefs = useRef({});
  const isInitialMount = useRef(true);
  const hasLoadedInitialData = useRef(false);
  const prevDataRef = useRef(null);

  // ------- Helpers: map state <-> lesson_data -------

  const mapStateToLessonData = useCallback((qs) => {
    return {
      type: "toeic_part_1",
      questions: qs.map((q, idx) => ({
        question_id: q.id,
        question_number: idx + 1, // Luôn tính từ vị trí trong mảng
        image_file: q.imageUrl || "",
        audio_file: q.audioUrl || "",
        correct_choice: q.correctChoice || "A",
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
      id: q.question_id || `toeic_p1_q_${idx}_${Date.now()}`,
      // Không cần set order, vì sẽ tự động tính từ idx + 1 khi hiển thị và save
      audioUrl: q.audio_file || "",
      imageUrl: q.image_file || "",
      correctChoice: q.correct_choice || "A",
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
  }, []);

  // ------- Load initial data khi edit (giống ListeningEditor) -------

  useEffect(() => {
    // QUAN TRỌNG: Reset flag chỉ khi data reference thay đổi VÀ đã load rồi
    // Điều này xảy ra khi edit lesson khác (component không unmount nhưng data prop thay đổi)
    const dataReferenceChanged = prevDataRef.current !== data;
    
    // Chỉ reset flag khi:
    // 1. Data reference thay đổi (có thể là lesson khác)
    // 2. VÀ đã load rồi (không phải lần đầu mount)
    // 3. VÀ có questions trong data mới (không phải empty)
    if (
      dataReferenceChanged &&
      hasLoadedInitialData.current &&
      data?.questions &&
      Array.isArray(data.questions) &&
      data.questions.length > 0
    ) {
      // Kiểm tra xem có phải lesson khác không (so sánh question_id đầu tiên)
      const prevFirstQuestionId = prevDataRef.current?.questions?.[0]?.question_id;
      const currentFirstQuestionId = data.questions[0]?.question_id;
      
      // Nếu question_id đầu tiên khác, đó là lesson khác → reset flag
      if (prevFirstQuestionId !== currentFirstQuestionId) {
        console.log("📌 ToeicPart1Editor - Different lesson detected, resetting load flag");
        hasLoadedInitialData.current = false;
      }
    }
    
    // Lưu reference mới
    if (dataReferenceChanged) {
      prevDataRef.current = data;
    }

    // Chỉ load một lần khi có data và chưa load
    if (!hasLoadedInitialData.current) {
      if (
        data &&
        data.questions &&
        Array.isArray(data.questions) &&
        data.questions.length > 0
      ) {
        // Có data với questions - load data
        console.log(
          "📌 ToeicPart1Editor - Loading initial data with questions:",
          data
        );
        const initialQuestions = mapLessonDataToState(data);
        console.log(
          "📌 ToeicPart1Editor - Mapped questions:",
          initialQuestions
        );
        setQuestions(initialQuestions);
        setCurrentIndex(0);
        setHasChecked(false);
        setShowTranscript(false);
        setShowExplanation(false);
        setPreviewSelectedChoice(null);
        hasLoadedInitialData.current = true;
        isInitialMount.current = false;
      } else if (
        data &&
        (!data.questions ||
          !Array.isArray(data.questions) ||
          data.questions.length === 0)
      ) {
        // Có data nhưng không có questions hoặc questions rỗng - tạo question mới
        console.log(
          "📌 ToeicPart1Editor - Data exists but no questions, creating new question"
        );
        const initialQuestions = mapLessonDataToState(data); // mapLessonDataToState sẽ tạo question mới nếu rỗng
        setQuestions(initialQuestions);
        setCurrentIndex(0);
        setHasChecked(false);
        setShowTranscript(false);
        setShowExplanation(false);
        setPreviewSelectedChoice(null);
        hasLoadedInitialData.current = true;
        isInitialMount.current = false;
      } else if (!data && questions.length === 0) {
        // Không có data và chưa có questions - tạo question mới
        console.log("📌 ToeicPart1Editor - No data, creating new question");
        setQuestions([createEmptyQuestion()]);
        setCurrentIndex(0);
        setHasChecked(false);
        setShowTranscript(false);
        setShowExplanation(false);
        setPreviewSelectedChoice(null);
        hasLoadedInitialData.current = true;
        isInitialMount.current = false;
      }
    }
    // QUAN TRỌNG: Chỉ depend vào data, không depend vào mapLessonDataToState vì nó là useCallback và không thay đổi
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // ------- Push change lên parent -------

  const pushChange = useCallback(
    (nextQuestions) => {
      if (isInitialMount.current) return; // Không push khi đang mount
      const lessonData = mapStateToLessonData(nextQuestions);
      onChange?.(lessonData);
    },
    [mapStateToLessonData, onChange]
  );

  // Debounce pushChange để tránh gọi liên tục
  useEffect(() => {
    if (isInitialMount.current) return;
    const timer = setTimeout(() => {
      pushChange(questions);
    }, 150);
    return () => clearTimeout(timer);
    // QUAN TRỌNG: Chỉ depend vào questions, không depend vào pushChange vì nó là useCallback
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions]);

  const currentQuestion = questions[currentIndex] || questions[0];

  // Reset preview state khi chuyển câu hỏi
  useEffect(() => {
    setHasChecked(false);
    setShowTranscript(false);
    setShowExplanation(false);
    setPreviewSelectedChoice(null);
  }, [currentIndex]);

  // ------- CRUD Question -------

  const handleAddQuestion = () => {
    setQuestions((prev) => {
      const next = [...prev, createEmptyQuestion()];
      // QUAN TRỌNG: Set currentIndex sau khi có questions mới, dùng prev.length (index của question mới)
      setCurrentIndex(prev.length);
      return next;
    });
  };

  const handleRemoveQuestion = (index) => {
    if (questions.length === 1) {
      alert("Phải có ít nhất 1 câu hỏi.");
      return;
    }
    setQuestions((prev) => {
      return prev.filter((_, idx) => idx !== index);
      // Không cần cập nhật order, vì sẽ tự động tính từ idx + 1 khi hiển thị
    });
    if (currentIndex >= questions.length - 1) {
      setCurrentIndex(Math.max(0, currentIndex - 1));
    }
  };

  const updateCurrentQuestion = (updater) => {
    setQuestions((prev) =>
      prev.map((q, idx) => (idx === currentIndex ? { ...q, ...updater(q) } : q))
    );
  };

  // ------- Handlers: fields -------

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

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh.");
      return;
    }
    const url = URL.createObjectURL(file);
    updateCurrentQuestion(() => ({ imageUrl: url }));
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
    // Import: chỉ cần thêm vào cuối mảng, số thứ tự sẽ tự động tính từ idx + 1 khi hiển thị
    const mapped = arr.map((q, idx) => ({
      id: q.question_id || `toeic_p1_q_${idx}_${Date.now()}`,
      // Không set order, vì sẽ tự động tính từ vị trí trong mảng (idx + 1)
      audioUrl: q.audio_file || "",
      imageUrl: q.image_file || "",
      correctChoice: q.correct_choice || "A",
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

    setQuestions((prev) => [...prev, ...mapped]);
    setCurrentIndex(questions.length); // nhảy tới câu đầu tiên mới
    setShowImportJSON(false);
    setJsonInput("");
    setJsonError(null);
  };

  // ------- Preview logic -------

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
    return <div>Đang tải editor TOEIC Part 1...</div>;
  }

  // ------- Render -------

  return (
    <div className="toeic-p1-editor">
      {/* Header: Tabs + Actions */}
      <div className="toeic-p1-editor__header">
        <div className="toeic-p1-editor__tabs">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              className={`toeic-p1-editor__tab ${
                idx === currentIndex ? "toeic-p1-editor__tab--active" : ""
              }`}
              onClick={() => setCurrentIndex(idx)}
            >
              Câu {idx + 1}
              {questions.length > 1 && (
                <span
                  className="toeic-p1-editor__tab-close"
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
            className="toeic-p1-editor__tab toeic-p1-editor__tab--add"
            onClick={handleAddQuestion}
          >
            + Thêm câu hỏi
          </button>
          <button
            className="toeic-p1-editor__tab toeic-p1-editor__tab--json"
            onClick={() => setShowImportJSON(true)}
          >
            📝 Import JSON
          </button>
        </div>

        <div className="toeic-p1-editor__header-actions">
          <button
            className={`toeic-p1-editor__preview-btn ${
              showPreview ? "toeic-p1-editor__preview-btn--active" : ""
            }`}
            onClick={() => setShowPreview((v) => !v)}
          >
            {showPreview ? "✕ Đóng Preview" : "👁 Preview"}
          </button>
        </div>
      </div>

      {showPreview ? (
        // ---------------- PREVIEW MODE ----------------
        <div className="toeic-p1-preview">
          <div className="toeic-p1-preview__audio-row">
            {currentQuestion.audioUrl ? (
              <audio
                style={{ width: "100%" }}
                controls
                src={currentQuestion.audioUrl}
              />
            ) : (
              <div className="toeic-p1-preview__audio-placeholder">
                Chưa có audio cho câu này
              </div>
            )}
          </div>

          <div className="toeic-p1-preview__body">
            <div className="toeic-p1-preview__image-col">
              {currentQuestion.imageUrl ? (
                <img
                  src={currentQuestion.imageUrl}
                  alt={`Question ${currentQuestion.order}`}
                  className="toeic-p1-preview__image"
                />
              ) : (
                <div className="toeic-p1-preview__image-placeholder">
                  Chưa có ảnh
                </div>
              )}
            </div>
            <div className="toeic-p1-preview__options-col">
              <div className="toeic-p1-preview__options">
                {CHOICE_LETTERS.map((letter) => (
                  <label
                    key={letter}
                    className={`toeic-p1-preview__option ${
                      hasChecked && letter === currentQuestion.correctChoice
                        ? "toeic-p1-preview__option--correct"
                        : ""
                    } ${
                      hasChecked &&
                      previewSelectedChoice &&
                      previewSelectedChoice !== currentQuestion.correctChoice &&
                      letter === previewSelectedChoice
                        ? "toeic-p1-preview__option--wrong"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name={`toeic-p1-prev-q-${currentQuestion.id}`}
                      checked={previewSelectedChoice === letter}
                      onChange={() => setPreviewSelectedChoice(letter)}
                    />
                    <span>{letter}.</span>
                  </label>
                ))}
              </div>

              <div className="toeic-p1-preview__buttons">
                <button
                  type="button"
                  className="toeic-p1-preview__btn toeic-p1-preview__btn--primary"
                  onClick={handleCheckAnswerPreview}
                >
                  Kiểm tra đáp án
                </button>
                <button
                  type="button"
                  className="toeic-p1-preview__btn"
                  onClick={handleClearPreview}
                >
                  Xóa hết
                </button>
              </div>

              {/* Transcript & Explanation chỉ hiện sau khi bấm \"Kiểm tra đáp án\" */}
            </div>
          </div>

          <div className="toeic-p1-preview__footer">
            {hasChecked && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                }}
              >
                <div className="toeic-p1-preview__section">
                  <button
                    type="button"
                    className="toeic-p1-preview__section-toggle"
                    onClick={() => setShowTranscript((v) => !v)}
                  >
                    Transcript {showTranscript ? "▲" : "▼"}
                  </button>
                  {showTranscript && (
                    <div className="toeic-p1-preview__section-body">
                      {CHOICE_LETTERS.map((letter) => (
                        <p key={letter}>
                          <strong>({letter})</strong>{" "}
                          {currentQuestion.transcript?.[letter] || ""}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="toeic-p1-preview__section">
                  <button
                    type="button"
                    className="toeic-p1-preview__section-toggle"
                    onClick={() => setShowExplanation((v) => !v)}
                  >
                    Giải thích đáp án {showExplanation ? "▲" : "▼"}
                  </button>
                  {showExplanation && (
                    <div className="toeic-p1-preview__section-body">
                      <p>
                        Đáp án đúng:{" "}
                        <strong>{currentQuestion.correctChoice}</strong>
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
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // ---------------- EDITOR MODE ----------------
        <div className="toeic-p1-editor__body">
          {/* Audio + Image config */}
          <div className="toeic-p1-editor__row">
            <div className="toeic-p1-editor__column">
              <label className="toeic-p1-editor__label">
                Audio (MP3) <span className="toeic-p1-editor__required">*</span>
              </label>
              <div className="toeic-p1-editor__field-group">
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
                  className="toeic-p1-editor__btn"
                  onClick={() =>
                    audioInputRefs.current[currentQuestion.id]?.click()
                  }
                >
                  📤 Upload audio
                </button>
                <input
                  type="text"
                  className="toeic-p1-editor__input"
                  placeholder="Hoặc dán URL audio..."
                  value={currentQuestion.audioUrl}
                  onChange={(e) =>
                    updateCurrentQuestion(() => ({ audioUrl: e.target.value }))
                  }
                />
              </div>
              {currentQuestion.audioUrl && (
                <div className="toeic-p1-editor__audio-preview">
                  <audio controls src={currentQuestion.audioUrl} />
                </div>
              )}
            </div>

            <div className="toeic-p1-editor__column">
              <label className="toeic-p1-editor__label">
                Ảnh mô tả <span className="toeic-p1-editor__required">*</span>
              </label>
              <div className="toeic-p1-editor__field-group">
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
                  className="toeic-p1-editor__btn"
                  onClick={() =>
                    imageInputRefs.current[currentQuestion.id]?.click()
                  }
                >
                  📤 Upload ảnh
                </button>
                <input
                  type="text"
                  className="toeic-p1-editor__input"
                  placeholder="Hoặc dán URL ảnh..."
                  value={currentQuestion.imageUrl}
                  onChange={(e) =>
                    updateCurrentQuestion(() => ({ imageUrl: e.target.value }))
                  }
                />
              </div>
              {currentQuestion.imageUrl && (
                <div className="toeic-p1-editor__image-preview">
                  <img
                    src={currentQuestion.imageUrl}
                    alt="Preview"
                    className="toeic-p1-editor__image-preview-img"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Correct choice */}
          <div className="toeic-p1-editor__row">
            <div className="toeic-p1-editor__column">
              <label className="toeic-p1-editor__label">
                Đáp án đúng <span className="toeic-p1-editor__required">*</span>
              </label>
              <div className="toeic-p1-editor__choices-row">
                {CHOICE_LETTERS.map((letter) => (
                  <label key={letter} className="toeic-p1-editor__choice-radio">
                    <input
                      type="radio"
                      name={`correct-${currentQuestion.id}`}
                      checked={currentQuestion.correctChoice === letter}
                      onChange={() =>
                        updateCurrentQuestion(() => ({
                          correctChoice: letter,
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
          <div className="toeic-p1-editor__row toeic-p1-editor__row--columns">
            <div className="toeic-p1-editor__column">
              <label className="toeic-p1-editor__label">Transcript (EN)</label>
              {CHOICE_LETTERS.map((letter) => (
                <div key={letter} className="toeic-p1-editor__field-group">
                  <div className="toeic-p1-editor__field-label">({letter})</div>
                  <textarea
                    className="toeic-p1-editor__textarea"
                    rows={2}
                    placeholder={`Nội dung tiếng Anh cho đáp án ${letter}...`}
                    value={currentQuestion.transcript?.[letter] || ""}
                    onChange={(e) =>
                      handleTranscriptChange(letter, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>

            <div className="toeic-p1-editor__column">
              <label className="toeic-p1-editor__label">
                Giải thích đáp án (VI)
              </label>
              {CHOICE_LETTERS.map((letter) => (
                <div key={letter} className="toeic-p1-editor__field-group">
                  <div className="toeic-p1-editor__field-label">({letter})</div>
                  <textarea
                    className="toeic-p1-editor__textarea"
                    rows={2}
                    placeholder={`Dịch nghĩa đáp án ${letter}...`}
                    value={currentQuestion.explanation?.[letter] || ""}
                    onChange={(e) =>
                      handleExplanationChange(letter, e.target.value)
                    }
                  />
                </div>
              ))}
              <div className="toeic-p1-editor__field-group">
                <div className="toeic-p1-editor__field-label">Ghi chú</div>
                <textarea
                  className="toeic-p1-editor__textarea"
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
          className="toeic-p1-json-modal__backdrop"
          onMouseDown={(e) => {
            if (e.target.classList.contains("toeic-p1-json-modal__backdrop")) {
              setShowImportJSON(false);
            }
          }}
        >
          <div
            className="toeic-p1-json-modal"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="toeic-p1-json-modal__header">
              <h3>📝 Import JSON - TOEIC Part 1</h3>
              <button
                type="button"
                className="toeic-p1-json-modal__close"
                onClick={() => setShowImportJSON(false)}
              >
                ×
              </button>
            </div>

            <div className="toeic-p1-json-modal__content">
              <p className="toeic-p1-json-modal__hint">
                Paste JSON của <strong>một câu hỏi</strong> hoặc{" "}
                <strong>array câu hỏi</strong>. Mỗi câu hỏi cần có các trường:
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
  "image_file": "https://study4.com/media/toeic_course_vocabs/media/02_Accounting.jpg.webp",
  "audio_file": "https://study4.com/ai_services/tts3/?q=accountant&lang=en-US&ipa=%2F%C9%99%CB%88ka%CA%8An.t%C9%99nt%2F",
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
                      className="toeic-p1-json-modal__btn"
                      onClick={() => {
                        setJsonInput(sampleJson);
                        setJsonError(null);
                      }}
                    >
                      📥 Dán format mẫu
                    </button>
                    <button
                      type="button"
                      className="toeic-p1-json-modal__btn"
                      onClick={handlePasteJSONFromClipboard}
                    >
                      📋 Paste từ Clipboard
                    </button>
                  </div>
                );
              })()}

              {jsonError && (
                <div className="toeic-p1-json-modal__error">{jsonError}</div>
              )}

              <textarea
                className="toeic-p1-json-modal__textarea"
                placeholder="Paste JSON ở đây..."
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value);
                  setJsonError(null);
                }}
              />
            </div>

            <div className="toeic-p1-json-modal__footer">
              <button
                type="button"
                className="toeic-p1-json-modal__btn"
                onClick={() => setShowImportJSON(false)}
              >
                Hủy
              </button>
              <button
                type="button"
                className="toeic-p1-json-modal__btn toeic-p1-json-modal__btn--primary"
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

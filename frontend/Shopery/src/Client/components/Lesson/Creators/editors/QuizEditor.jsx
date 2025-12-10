// QuizEditor.jsx - Editor cho dạng bài Vocabulary Quiz
// Question (text/image/audio) + Choices (text hoặc image+text), click để chọn đáp án đúng
import React, { useCallback, useEffect, useRef, useState } from "react";
import VocabularyQuiz from "../../Vocabulary/VocabularyQuiz";
import "./QuizEditor.css";

export default function QuizEditor({ data, onChange }) {
  const [questions, setQuestions] = useState([]); // [{ id, questionType, questionText, questionImageUrl, questionAudioUrl, choices: [...], shuffleChoices }]
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showImportJSON, setShowImportJSON] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState(null);
  const fileInputRefs = useRef({});
  const imageInputRefs = useRef({});
  const isInitialMount = useRef(true);
  const hasLoadedInitialData = useRef(false);

  // Load dữ liệu từ props (khi edit)
  useEffect(() => {
    if (
      data?.questions &&
      Array.isArray(data.questions) &&
      data.questions.length > 0 &&
      !hasLoadedInitialData.current
    ) {
      const mapped = data.questions.map((q, idx) => {
        let questionType = "text";
        if (q.image_url) questionType = "image";
        else if (q.audio_url) questionType = "audio";
        return {
          id: q.question_id || `q_${idx}_${Date.now()}`,
          questionType,
          questionText: q.en || "",
          questionImageUrl: q.image_url || "",
          questionAudioUrl: q.audio_url || "",
          choices: (q.choices || []).map((c, cidx) => ({
            id: c.id || `choice_${idx}_${cidx}_${Date.now()}`,
            text: c.text || "",
            imageUrl: c.image_url || "",
            is_correct: !!c.is_correct,
          })),
          shuffleChoices: !!q.shuffle_choices,
        };
      });
      setQuestions(mapped);
      setCurrentQuestionIndex(0);
      hasLoadedInitialData.current = true;
      isInitialMount.current = false;
    }
  }, [data]);

  // Khởi tạo: không load data có sẵn, tạo question mới
  useEffect(() => {
    if (isInitialMount.current && questions.length === 0) {
      setQuestions([
        {
          id: Date.now(),
          questionType: "text", // text, image, audio
          questionText: "",
          questionImageUrl: "",
          questionAudioUrl: "",
          choices: [
            {
              id: `choice_${Date.now()}_0`,
              text: "",
              imageUrl: "",
              is_correct: false,
            },
            {
              id: `choice_${Date.now()}_1`,
              text: "",
              imageUrl: "",
              is_correct: false,
            },
          ],
          shuffleChoices: false,
        },
      ]);
      isInitialMount.current = false;
    }
  }, [questions.length]);

  // Update data và gửi lên parent
  const updateData = useCallback(() => {
    if (isInitialMount.current) return;

    const questionsData = questions.map((q) => {
      // Convert question format
      let questionData = {
        question_id: q.id,
        choices: q.choices.map((choice) => ({
          id: choice.id,
          text: choice.text.trim(),
          image_url: choice.imageUrl || "",
          is_correct: choice.is_correct,
        })),
      };

      // Add question content based on type
      if (q.questionType === "text") {
        questionData.en = q.questionText.trim();
      } else if (q.questionType === "image") {
        questionData.image_url = q.questionImageUrl;
      } else if (q.questionType === "audio") {
        questionData.audio_url = q.questionAudioUrl;
      }

      return questionData;
    });

    onChange({
      type: "vocabulary_quiz",
      questions: questionsData,
      shuffle_choices: questions[0]?.shuffleChoices || false,
    });
  }, [questions, onChange]);

  // Debounce updateData
  useEffect(() => {
    if (isInitialMount.current) return;

    const timer = setTimeout(() => {
      updateData();
    }, 150);

    return () => clearTimeout(timer);
  }, [questions, updateData]);

  const currentQuestion =
    questions[currentQuestionIndex] || questions[0] || null;
  const currentChoices = currentQuestion?.choices || [];

  // Validate question
  const validateQuestion = (q) => {
    const errors = [];

    // Check question content
    if (q.questionType === "text" && !q.questionText.trim()) {
      errors.push("Thiếu nội dung câu hỏi (text)");
    } else if (q.questionType === "image" && !q.questionImageUrl) {
      errors.push("Thiếu hình ảnh câu hỏi");
    } else if (q.questionType === "audio" && !q.questionAudioUrl) {
      errors.push("Thiếu audio câu hỏi");
    }

    // Check choices
    if (currentChoices.length < 2) {
      errors.push("Cần ít nhất 2 đáp án");
    }

    const validChoices = currentChoices.filter(
      (c) => c.text.trim() || c.imageUrl
    );
    if (validChoices.length < 2) {
      errors.push("Cần ít nhất 2 đáp án có nội dung");
    }

    const correctCount = currentChoices.filter((c) => c.is_correct).length;
    if (correctCount !== 1) {
      errors.push("Phải có đúng 1 đáp án đúng");
    }

    return errors;
  };

  // Thêm question mới
  const handleAddQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      questionType: "text",
      questionText: "",
      questionImageUrl: "",
      questionAudioUrl: "",
      choices: [
        {
          id: `choice_${Date.now()}_0`,
          text: "",
          imageUrl: "",
          is_correct: false,
        },
        {
          id: `choice_${Date.now()}_1`,
          text: "",
          imageUrl: "",
          is_correct: false,
        },
      ],
      shuffleChoices: false,
    };
    setQuestions((prev) => [...prev, newQuestion]);
    setCurrentQuestionIndex(questions.length);
  };

  // Import JSON - Paste từ clipboard
  const handlePasteJSON = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJsonInput(text);
      setJsonError(null);
    } catch (err) {
      setJsonError("Không thể đọc clipboard: " + err.message);
    }
  };

  // Thêm câu hỏi từ JSON
  const handleAddQuestionFromJSON = () => {
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

    // Hỗ trợ cả object đơn lẻ và array
    let questionsToAdd = Array.isArray(jsonData) ? jsonData : [jsonData];

    // Validate và thêm từng câu hỏi
    const newQuestions = [];
    for (const q of questionsToAdd) {
      if (!q.choices || !Array.isArray(q.choices)) {
        setJsonError("Câu hỏi thiếu trường 'choices' (array)");
        return;
      }

      // Xác định question type
      let questionType = "text";
      if (q.question_audio_url) questionType = "audio";
      else if (q.question_image_url) questionType = "image";

      // Convert choices
      const choices = q.choices.map((choice, idx) => ({
        id: choice.id || `choice_${Date.now()}_${idx}`,
        text: choice.text || "",
        imageUrl: choice.image_url || "",
        is_correct: choice.is_correct || false,
      }));

      newQuestions.push({
        id: q.question_id || Date.now() + Math.random(),
        questionType: questionType,
        questionText: q.question_text || q.en || "",
        questionImageUrl: q.question_image_url || "",
        questionAudioUrl: q.question_audio_url || q.audio_url || "",
        choices: choices,
        shuffleChoices: q.shuffle_choices || false,
      });
    }

    // Thêm vào danh sách
    setQuestions((prev) => {
      const updated = [...prev, ...newQuestions];
      setCurrentQuestionIndex(updated.length - 1);
      return updated;
    });

    setShowImportJSON(false);
    setJsonInput("");
    setJsonError(null);
  };

  // Xóa question
  const handleRemoveQuestion = (questionIndex) => {
    if (questions.length === 1) {
      alert("Phải có ít nhất 1 bài tập");
      return;
    }
    setQuestions((prev) => prev.filter((_, idx) => idx !== questionIndex));
    if (currentQuestionIndex >= questions.length - 1) {
      setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1));
    }
  };

  // Chuyển question
  const handleSwitchQuestion = (index) => {
    setCurrentQuestionIndex(index);
    setShowPreview(false);
  };

  // Update question type
  const handleQuestionTypeChange = (questionId, type) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              questionType: type,
              questionText: type === "text" ? q.questionText : "",
              questionImageUrl: type === "image" ? q.questionImageUrl : "",
              questionAudioUrl: type === "audio" ? q.questionAudioUrl : "",
            }
          : q
      )
    );
  };

  // Update question text
  const handleQuestionTextChange = (questionId, value) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, questionText: value } : q))
    );
  };

  // Upload question image
  const handleQuestionImageUpload = (questionId, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh");
      return;
    }

    const url = URL.createObjectURL(file);
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, questionImageUrl: url } : q
      )
    );
  };

  // Upload question audio
  const handleQuestionAudioUpload = (questionId, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      alert("Vui lòng chọn file audio");
      return;
    }

    const url = URL.createObjectURL(file);
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, questionAudioUrl: url } : q
      )
    );
  };

  // Thêm choice
  const handleAddChoice = (questionId) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              choices: [
                ...q.choices,
                {
                  id: `choice_${Date.now()}_${q.choices.length}`,
                  text: "",
                  imageUrl: "",
                  is_correct: false,
                },
              ],
            }
          : q
      )
    );
  };

  // Xóa choice
  const handleRemoveChoice = (questionId, choiceId) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              choices: q.choices.filter((c) => c.id !== choiceId),
            }
          : q
      )
    );
  };

  // Update choice text
  const handleChoiceTextChange = (questionId, choiceId, value) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              choices: q.choices.map((c) =>
                c.id === choiceId ? { ...c, text: value } : c
              ),
            }
          : q
      )
    );
  };

  // Upload choice image
  const handleChoiceImageUpload = (questionId, choiceId, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh");
      return;
    }

    const url = URL.createObjectURL(file);
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              choices: q.choices.map((c) =>
                c.id === choiceId ? { ...c, imageUrl: url } : c
              ),
            }
          : q
      )
    );
  };

  // Remove choice image
  const handleRemoveChoiceImage = (questionId, choiceId) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              choices: q.choices.map((c) =>
                c.id === choiceId ? { ...c, imageUrl: "" } : c
              ),
            }
          : q
      )
    );
  };

  // Toggle correct answer
  const handleToggleCorrect = (questionId, choiceId) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              choices: q.choices.map((c) => ({
                ...c,
                is_correct: c.id === choiceId ? !c.is_correct : false, // Chỉ 1 đáp án đúng
              })),
            }
          : q
      )
    );
  };

  // Toggle shuffle
  const handleToggleShuffle = (questionId) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, shuffleChoices: !q.shuffleChoices } : q
      )
    );
  };

  // Toggle preview
  const handleTogglePreview = () => {
    if (!currentQuestion) return;
    const errors = validateQuestion(currentQuestion);
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }
    setShowPreview(!showPreview);
  };

  // Tạo lesson data cho preview
  const getPreviewLessonData = () => {
    if (!currentQuestion) return null;

    let questionData = {
      question_id: currentQuestion.id,
      choices: currentQuestion.choices.map((choice) => ({
        id: choice.id,
        text: choice.text.trim(),
        vi: choice.text.trim(), // VocabularyQuiz.jsx tìm vi hoặc en
        en: choice.text.trim(),
        image_url: choice.imageUrl || "",
        is_correct: choice.is_correct,
      })),
    };

    if (currentQuestion.questionType === "text") {
      questionData.question_text = currentQuestion.questionText.trim();
      questionData.en = currentQuestion.questionText.trim();
    } else if (currentQuestion.questionType === "image") {
      questionData.image_url = currentQuestion.questionImageUrl;
    } else if (currentQuestion.questionType === "audio") {
      questionData.audio_url = currentQuestion.questionAudioUrl;
    }

    return {
      lesson_data: {
        questions: [questionData],
        shuffle_choices: currentQuestion.shuffleChoices || false,
      },
    };
  };

  const errors = currentQuestion ? validateQuestion(currentQuestion) : [];

  return (
    <div className="quiz-editor">
      {/* Header */}
      <div className="qe-header">
        <div className="qe-header-left">
          <h3 className="qe-title">Vocabulary Quiz</h3>
          <div className="qe-questions-tabs">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                className={`qe-tab ${
                  idx === currentQuestionIndex ? "active" : ""
                }`}
                onClick={() => handleSwitchQuestion(idx)}
              >
                Bài tập {idx + 1}
                {idx === currentQuestionIndex && (
                  <span
                    className="qe-tab-remove"
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
            <button className="qe-add-question-btn" onClick={handleAddQuestion}>
              + Thêm bài tập
            </button>
            <button
              className="qe-add-question-btn"
              onClick={() => setShowImportJSON(true)}
              style={{
                marginLeft: "8px",
                backgroundColor: "#17a2b8",
                borderColor: "#17a2b8",
              }}
              title="Thêm bài tập từ JSON"
            >
              📝 Import JSON
            </button>
          </div>
        </div>
        <div className="qe-header-right">
          <button
            className={`qe-preview-btn ${
              errors.length === 0 ? "" : "disabled"
            }`}
            onClick={handleTogglePreview}
            disabled={errors.length > 0}
          >
            {showPreview ? "✕ Đóng Preview" : "👁 Preview"}
          </button>
        </div>
      </div>

      {showPreview ? (
        /* Preview mode */
        <div className="qe-preview-container">
          <div className="qe-preview-header">
            <span>Preview: Bài tập {currentQuestionIndex + 1}</span>
            <button
              className="qe-close-preview"
              onClick={() => setShowPreview(false)}
            >
              ✕
            </button>
          </div>
          <div className="qe-preview-content">
            <VocabularyQuiz lesson={getPreviewLessonData()} />
          </div>
        </div>
      ) : currentQuestion ? (
        /* Editor mode */
        <>
          {/* Errors */}
          {errors.length > 0 && (
            <div className="qe-errors">
              {errors.map((error, idx) => (
                <span key={idx} className="qe-error">
                  ⚠️ {error}
                </span>
              ))}
            </div>
          )}

          {/* Question Section */}
          <div className="qe-question-section">
            <label className="qe-label">
              Câu hỏi <span className="required">*</span>
            </label>

            {/* Question Type Tabs */}
            <div className="qe-question-tabs">
              <button
                className={`qe-question-tab ${
                  currentQuestion.questionType === "text" ? "active" : ""
                }`}
                onClick={() =>
                  handleQuestionTypeChange(currentQuestion.id, "text")
                }
              >
                Text
              </button>
              <button
                className={`qe-question-tab ${
                  currentQuestion.questionType === "image" ? "active" : ""
                }`}
                onClick={() =>
                  handleQuestionTypeChange(currentQuestion.id, "image")
                }
              >
                Image
              </button>
              <button
                className={`qe-question-tab ${
                  currentQuestion.questionType === "audio" ? "active" : ""
                }`}
                onClick={() =>
                  handleQuestionTypeChange(currentQuestion.id, "audio")
                }
              >
                Audio
              </button>
            </div>

            {/* Question Content */}
            <div className="qe-question-content">
              {currentQuestion.questionType === "text" && (
                <input
                  type="text"
                  value={currentQuestion.questionText}
                  onChange={(e) =>
                    handleQuestionTextChange(currentQuestion.id, e.target.value)
                  }
                  className="qe-input"
                  placeholder="Nhập câu hỏi (tiếng Anh hoặc tiếng Việt)"
                />
              )}

              {currentQuestion.questionType === "image" && (
                <div className="qe-image-upload">
                  <input
                    ref={(el) =>
                      (fileInputRefs.current[`question_${currentQuestion.id}`] =
                        el)
                    }
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleQuestionImageUpload(currentQuestion.id, e)
                    }
                    className="qe-file-input"
                  />
                  {!currentQuestion.questionImageUrl ? (
                    <button
                      className="qe-upload-btn"
                      onClick={() =>
                        fileInputRefs.current[
                          `question_${currentQuestion.id}`
                        ]?.click()
                      }
                    >
                      📤 Upload image
                    </button>
                  ) : (
                    <div className="qe-image-preview">
                      <img
                        src={currentQuestion.questionImageUrl}
                        alt="Question"
                      />
                      <button
                        className="qe-image-remove"
                        onClick={() =>
                          setQuestions((prev) =>
                            prev.map((q) =>
                              q.id === currentQuestion.id
                                ? { ...q, questionImageUrl: "" }
                                : q
                            )
                          )
                        }
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              )}

              {currentQuestion.questionType === "audio" && (
                <div className="qe-audio-upload">
                  <input
                    ref={(el) =>
                      (fileInputRefs.current[
                        `question_audio_${currentQuestion.id}`
                      ] = el)
                    }
                    type="file"
                    accept="audio/*"
                    onChange={(e) =>
                      handleQuestionAudioUpload(currentQuestion.id, e)
                    }
                    className="qe-file-input"
                  />
                  {!currentQuestion.questionAudioUrl ? (
                    <button
                      className="qe-upload-btn"
                      onClick={() =>
                        fileInputRefs.current[
                          `question_audio_${currentQuestion.id}`
                        ]?.click()
                      }
                    >
                      📤 Upload audio
                    </button>
                  ) : (
                    <div className="qe-audio-preview">
                      <audio controls>
                        <source
                          src={currentQuestion.questionAudioUrl}
                          type="audio/mpeg"
                        />
                      </audio>
                      <button
                        className="qe-audio-remove"
                        onClick={() =>
                          setQuestions((prev) =>
                            prev.map((q) =>
                              q.id === currentQuestion.id
                                ? { ...q, questionAudioUrl: "" }
                                : q
                            )
                          )
                        }
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Choices Section */}
          <div className="qe-choices-section">
            <div className="qe-choices-header">
              <label className="qe-label">
                Đáp án <span className="required">*</span>
              </label>
              <button
                className="qe-add-choice-btn"
                onClick={() => handleAddChoice(currentQuestion.id)}
              >
                + Thêm đáp án
              </button>
            </div>

            <div className="qe-choices-list">
              {currentChoices.map((choice, index) => (
                <div key={choice.id} className="qe-choice-card">
                  <div className="qe-choice-header">
                    <span className="qe-choice-letter">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <button
                      className={`qe-choice-correct-btn ${
                        choice.is_correct ? "active" : ""
                      }`}
                      onClick={() =>
                        handleToggleCorrect(currentQuestion.id, choice.id)
                      }
                    >
                      {choice.is_correct ? "✅ Đúng" : "⭕ Chọn đúng"}
                    </button>
                    {currentChoices.length > 2 && (
                      <button
                        className="qe-choice-remove"
                        onClick={() =>
                          handleRemoveChoice(currentQuestion.id, choice.id)
                        }
                      >
                        ×
                      </button>
                    )}
                  </div>

                  <div className="qe-choice-content">
                    <input
                      type="text"
                      value={choice.text}
                      onChange={(e) =>
                        handleChoiceTextChange(
                          currentQuestion.id,
                          choice.id,
                          e.target.value
                        )
                      }
                      className="qe-input qe-choice-text"
                      placeholder="Text"
                    />

                    <div className="qe-choice-image">
                      <input
                        ref={(el) => (imageInputRefs.current[choice.id] = el)}
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleChoiceImageUpload(
                            currentQuestion.id,
                            choice.id,
                            e
                          )
                        }
                        className="qe-file-input"
                      />
                      {!choice.imageUrl ? (
                        <button
                          className="qe-upload-btn-small"
                          onClick={() =>
                            imageInputRefs.current[choice.id]?.click()
                          }
                        >
                          📤 Ảnh (tùy chọn)
                        </button>
                      ) : (
                        <div className="qe-choice-image-preview">
                          <img src={choice.imageUrl} alt={choice.text} />
                          <button
                            className="qe-image-remove-small"
                            onClick={() =>
                              handleRemoveChoiceImage(
                                currentQuestion.id,
                                choice.id
                              )
                            }
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advanced Options */}
          <div className="qe-advanced-section">
            <label className="qe-checkbox-label">
              <input
                type="checkbox"
                checked={currentQuestion.shuffleChoices || false}
                onChange={() => handleToggleShuffle(currentQuestion.id)}
                className="qe-checkbox"
              />
              <span>Trộn đáp án (Shuffle choices)</span>
            </label>
          </div>

          {/* Hint */}
          <div className="qe-hint">
            💡 <strong>Lưu ý:</strong> Câu hỏi có thể là text, image hoặc audio.
            Mỗi đáp án có thể có text và/hoặc image. Chỉ có 1 đáp án đúng.
          </div>
        </>
      ) : (
        <div className="qe-empty">
          <p>Đang tải...</p>
        </div>
      )}

      {/* Modal Import JSON */}
      {showImportJSON && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowImportJSON(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "24px",
              width: "90%",
              maxWidth: "700px",
              maxHeight: "85vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h3 style={{ margin: 0 }}>📝 Import JSON - Thêm bài tập</h3>
              <button
                onClick={() => setShowImportJSON(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <p
                style={{
                  margin: "0 0 8px 0",
                  color: "#666",
                  lineHeight: "1.6",
                }}
              >
                Paste JSON của một bài tập hoặc array bài tập. Format: mỗi bài
                tập cần có <strong>choices</strong> (array các lựa chọn), và có
                thể có <strong>question_text</strong> (text),{" "}
                <strong>question_image_url</strong> (image), hoặc{" "}
                <strong>question_audio_url</strong> (audio). Mỗi choice cần có{" "}
                <strong>text</strong>, <strong>image_url</strong> (tùy chọn), và{" "}
                <strong>is_correct</strong> (true/false).
              </p>
              <details style={{ marginTop: "12px" }}>
                <summary
                  style={{
                    cursor: "pointer",
                    color: "#007bff",
                    fontWeight: "500",
                    marginBottom: "8px",
                  }}
                >
                  📋 Xem format mẫu
                </summary>
                <pre
                  style={{
                    backgroundColor: "#f5f5f5",
                    padding: "16px",
                    borderRadius: "4px",
                    fontSize: "13px",
                    overflow: "auto",
                    marginTop: "8px",
                    border: "1px solid #ddd",
                  }}
                >
                  {`// Bài tập với question text
{
  "question_id": "123",
  "question_text": "What does 'happy' mean?",
  "choices": [
    {
      "id": 1,
      "text": "vui mừng",
      "image_url": "https://example.com/happy.jpg",
      "is_correct": true
    },
    {
      "id": 2,
      "text": "buồn bã",
      "image_url": "https://example.com/sad.jpg",
      "is_correct": false
    },
    {
      "id": 3,
      "text": "tức giận",
      "image_url": "",
      "is_correct": false
    },
    {
      "id": 4,
      "text": "sợ hãi",
      "image_url": "",
      "is_correct": false
    }
  ],
  "shuffle_choices": false
}

`}
                </pre>
              </details>
            </div>

            <div style={{ marginBottom: "12px" }}>
              <button
                onClick={handlePasteJSON}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                📋 Paste từ Clipboard
              </button>
            </div>

            {jsonError && (
              <div
                style={{
                  backgroundColor: "#f8d7da",
                  color: "#721c24",
                  padding: "12px",
                  borderRadius: "4px",
                  marginBottom: "12px",
                }}
              >
                {jsonError}
              </div>
            )}

            <textarea
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                setJsonError(null);
              }}
              placeholder="Paste JSON ở đây..."
              style={{
                width: "100%",
                minHeight: "250px",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontFamily: "monospace",
                fontSize: "14px",
                marginBottom: "12px",
                resize: "vertical",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              <button
                onClick={() => {
                  setJsonInput("");
                  setJsonError(null);
                  setShowImportJSON(false);
                }}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Hủy
              </button>
              <button
                onClick={handleAddQuestionFromJSON}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                ✅ Thêm bài tập
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

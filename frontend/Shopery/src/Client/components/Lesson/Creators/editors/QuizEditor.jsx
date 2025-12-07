// QuizEditor.jsx - Editor cho dạng bài Vocabulary Quiz
// Question (text/image/audio) + Choices (text hoặc image+text), click để chọn đáp án đúng
import React, { useState, useRef, useEffect, useCallback } from "react";
import VocabularyQuiz from "../../Vocabulary/VocabularyQuiz";
import "./QuizEditor.css";

export default function QuizEditor({ data, onChange }) {
  const [questions, setQuestions] = useState([]); // [{ id, questionType, questionText, questionImageUrl, questionAudioUrl, choices: [...], shuffleChoices }]
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRefs = useRef({});
  const imageInputRefs = useRef({});
  const isInitialMount = useRef(true);

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
            { id: `choice_${Date.now()}_0`, text: "", imageUrl: "", is_correct: false },
            { id: `choice_${Date.now()}_1`, text: "", imageUrl: "", is_correct: false },
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

  const currentQuestion = questions[currentQuestionIndex] || questions[0] || null;
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

    const validChoices = currentChoices.filter((c) => c.text.trim() || c.imageUrl);
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
        { id: `choice_${Date.now()}_0`, text: "", imageUrl: "", is_correct: false },
        { id: `choice_${Date.now()}_1`, text: "", imageUrl: "", is_correct: false },
      ],
      shuffleChoices: false,
    };
    setQuestions((prev) => [...prev, newQuestion]);
    setCurrentQuestionIndex(questions.length);
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
      prev.map((q) =>
        q.id === questionId ? { ...q, questionText: value } : q
      )
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
        image_url: choice.imageUrl || "",
        is_correct: choice.is_correct,
      })),
    };

    if (currentQuestion.questionType === "text") {
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
                className={`qe-tab ${idx === currentQuestionIndex ? "active" : ""}`}
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
          </div>
        </div>
        <div className="qe-header-right">
          <button
            className={`qe-preview-btn ${errors.length === 0 ? "" : "disabled"}`}
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
                      (fileInputRefs.current[`question_${currentQuestion.id}`] = el)
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
                        fileInputRefs.current[`question_${currentQuestion.id}`]?.click()
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
                      (fileInputRefs.current[`question_audio_${currentQuestion.id}`] = el)
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
                        fileInputRefs.current[`question_audio_${currentQuestion.id}`]?.click()
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
                        ref={(el) =>
                          (imageInputRefs.current[choice.id] = el)
                        }
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
                          onClick={() => imageInputRefs.current[choice.id]?.click()}
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
            💡 <strong>Lưu ý:</strong> Câu hỏi có thể là text, image hoặc audio. Mỗi đáp án có thể có text và/hoặc image. Chỉ có 1 đáp án đúng.
          </div>
        </>
      ) : (
        <div className="qe-empty">
          <p>Đang tải...</p>
        </div>
      )}
    </div>
  );
}


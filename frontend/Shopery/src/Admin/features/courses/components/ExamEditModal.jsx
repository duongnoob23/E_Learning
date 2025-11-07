import React, { useEffect, useState } from "react";
import {
  useAdminAddQuestionsToPart,
  useAdminDeleteQuestion,
  useAdminUpdateQuestion,
  useAdminUpdateTest,
} from "../hooks/useExamAdminMutations";
import { useAdminTestDetail } from "../hooks/useExamAdminQueries";
import "./ExamEditModal.scss";

export default function ExamEditModal({
  open,
  onClose,
  testId,
  onSaveSuccess,
}) {
  const [selectedPartIndex, setSelectedPartIndex] = useState(0);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [editingData, setEditingData] = useState(null); // Local copy để edit
  const [hasChanges, setHasChanges] = useState(false);

  const {
    data: testDetailRes,
    isLoading,
    refetch,
  } = useAdminTestDetail(testId, open && !!testId);

  const updateTest = useAdminUpdateTest();
  const updateQuestion = useAdminUpdateQuestion();
  const deleteQuestion = useAdminDeleteQuestion();
  const addQuestions = useAdminAddQuestionsToPart();

  // Load data vào local state khi có data
  useEffect(() => {
    if (testDetailRes?.DT) {
      setEditingData(testDetailRes.DT);
      setSelectedPartIndex(0);
      setSelectedQuestionIndex(0);
      setHasChanges(false);
    }
  }, [testDetailRes, open]);

//   useEffect(() => {
//     if (open && testData) {
//       setSelectedPartIndex(0);
//       setSelectedQuestionIndex(0);
//     }
//   }, [open, editingData]);

  if (!open) return null;

  const testData = editingData || testDetailRes?.DT || null;
  const parts = testData?.parts || [];
  const currentPart = parts[selectedPartIndex] || null;
  const questions = currentPart?.questions || [];
  const currentQuestion = questions[selectedQuestionIndex] || null;

  const totalQuestions = questions.length;
  const questionNumber = selectedQuestionIndex + 1;

  // Navigate functions
  function handlePrevQuestion() {
    if (selectedQuestionIndex > 0) {
      setSelectedQuestionIndex(selectedQuestionIndex - 1);
    } else if (selectedPartIndex > 0) {
      const prevPart = parts[selectedPartIndex - 1];
      setSelectedPartIndex(selectedPartIndex - 1);
      setSelectedQuestionIndex(prevPart?.questions?.length - 1 || 0);
    }
  }

  function handleNextQuestion() {
    if (selectedQuestionIndex < totalQuestions - 1) {
      setSelectedQuestionIndex(selectedQuestionIndex + 1);
    } else if (selectedPartIndex < parts.length - 1) {
      setSelectedPartIndex(selectedPartIndex + 1);
      setSelectedQuestionIndex(0);
    }
  }

  // Update test info
  function updateTestInfo(field, value) {
    setEditingData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  }

  // Update question
  function updateQuestionField(field, value) {
    setEditingData((prev) => {
      const newParts = [...prev.parts];
      const part = newParts[selectedPartIndex];
      const newQuestions = [...part.questions];
      newQuestions[selectedQuestionIndex] = {
        ...newQuestions[selectedQuestionIndex],
        [field]: value,
      };
      newParts[selectedPartIndex] = { ...part, questions: newQuestions };
      return { ...prev, parts: newParts };
    });
    setHasChanges(true);
  }

  // Update choice
  function updateChoice(choiceIndex, field, value) {
    setEditingData((prev) => {
      const newParts = [...prev.parts];
      const part = newParts[selectedPartIndex];
      const newQuestions = [...part.questions];
      const question = newQuestions[selectedQuestionIndex];
      const newChoices = [...question.choices];
      newChoices[choiceIndex] = { ...newChoices[choiceIndex], [field]: value };
      newQuestions[selectedQuestionIndex] = {
        ...question,
        choices: newChoices,
      };
      newParts[selectedPartIndex] = { ...part, questions: newQuestions };
      return { ...prev, parts: newParts };
    });
    setHasChanges(true);
  }

  // Delete question
  async function handleDeleteQuestion() {
    if (!currentQuestion?.question_id) return;
    if (!window.confirm("Bạn có chắc muốn xóa câu hỏi này?")) return;

    try {
      await deleteQuestion.mutateAsync(currentQuestion.question_id);
      // Remove from local state
      setEditingData((prev) => {
        const newParts = [...prev.parts];
        const part = newParts[selectedPartIndex];
        const newQuestions = part.questions.filter(
          (_, idx) => idx !== selectedQuestionIndex
        );
        newParts[selectedPartIndex] = { ...part, questions: newQuestions };
        const newData = { ...prev, parts: newParts };
        // Adjust index
        if (
          selectedQuestionIndex >= newQuestions.length &&
          selectedQuestionIndex > 0
        ) {
          setSelectedQuestionIndex(selectedQuestionIndex - 1);
        }
        return newData;
      });
      await refetch(); // Refresh data
    } catch (e) {
      console.error(e);
    }
  }

  // Save all changes
  async function handleSaveAll() {
    if (!hasChanges || !testData) return;

    try {
      // 1) Update test info
      await updateTest.mutateAsync({
        testId,
        payload: {
          title: testData.title,
          duration: testData.total_duration || 0,
          description: testData.description || "",
        },
      });

      // 2) Update all questions
      for (const part of parts) {
        for (const q of part.questions || []) {
          if (q.question_id) {
            // Existing question → Update
            await updateQuestion.mutateAsync({
              questionId: q.question_id,
              payload: {
                question_text: q.question_text,
                question_type: q.question_type || "MULTIPLE_CHOICE",
                transcript: q.transcript || undefined,
                explanation: q.explanation || undefined,
                // Note: choices update cần xóa và tạo lại (hoặc API riêng)
              },
            });
          }
        }
      }

      setHasChanges(false);
      await refetch();
      onSaveSuccess?.();
    } catch (e) {
      console.error(e);
    }
  }

  const canPrev = selectedPartIndex > 0 || selectedQuestionIndex > 0;
  const canNext =
    selectedPartIndex < parts.length - 1 ||
    selectedQuestionIndex < totalQuestions - 1;

  return (
    <div
      className="exam-edit-modal__backdrop"
      onMouseDown={(e) => {
        if (e.target.classList.contains("exam-edit-modal__backdrop"))
          onClose?.();
      }}
    >
      <div className="exam-edit-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="exam-edit-modal__header">
          <div>
            <div style={{ fontWeight: 600, fontSize: "18px" }}>
              Edit Exam: {testData?.title || "Loading..."}
            </div>
            <div
              style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}
            >
              {currentPart?.part_name || ""} • Question {questionNumber} /{" "}
              {totalQuestions}
              {hasChanges && (
                <span style={{ color: "#f59e0b", marginLeft: "8px" }}>
                  • Có thay đổi chưa lưu
                </span>
              )}
            </div>
          </div>
          <button className="btn-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="exam-edit-modal__content">
          {isLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "40px",
              }}
            >
              Loading...
            </div>
          ) : !testData ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "40px",
              }}
            >
              No data found
            </div>
          ) : (
            <div className="exam-edit-content">
              {/* Sidebar - Parts list */}
              <div className="exam-edit-sidebar">
                <div className="sidebar-title">Parts</div>
                {parts.map((part, idx) => (
                  <button
                    key={part.part_id || idx}
                    className={`sidebar-part-btn ${
                      idx === selectedPartIndex
                        ? "sidebar-part-btn--active"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedPartIndex(idx);
                      setSelectedQuestionIndex(0);
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>{part.part_name}</div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>
                      {part.questions?.length || 0} questions
                    </div>
                  </button>
                ))}
              </div>

              {/* Main content - Question Editor */}
              <div className="exam-edit-main">
                {currentQuestion ? (
                  <div className="question-editor">
                    {/* Test Info (only show on first question of first part) */}
                    {selectedPartIndex === 0 && selectedQuestionIndex === 0 && (
                      <div className="edit-section">
                        <div className="section-title">Exam Information</div>
                        <div className="field-group">
                          <label>Title</label>
                          <input
                            type="text"
                            value={testData.title || ""}
                            onChange={(e) =>
                              updateTestInfo("title", e.target.value)
                            }
                            className="edit-input"
                          />
                        </div>
                        <div className="field-group">
                          <label>Description</label>
                          <textarea
                            value={testData.description || ""}
                            onChange={(e) =>
                              updateTestInfo("description", e.target.value)
                            }
                            className="edit-textarea"
                            rows={3}
                          />
                        </div>
                        <div className="field-group">
                          <label>Duration (minutes)</label>
                          <input
                            type="number"
                            value={testData.total_duration || 0}
                            onChange={(e) =>
                              updateTestInfo(
                                "total_duration",
                                Number(e.target.value) || 0
                              )
                            }
                            className="edit-input"
                          />
                        </div>
                      </div>
                    )}

                    {/* Question Editor */}
                    <div className="edit-section">
                      <div className="section-title">
                        Question {questionNumber}
                        <button
                          className="btn-delete-small"
                          onClick={handleDeleteQuestion}
                          style={{ marginLeft: "12px" }}
                        >
                          Delete Question
                        </button>
                      </div>

                      <div className="field-group">
                        <label>Question Text *</label>
                        <textarea
                          value={currentQuestion.question_text || ""}
                          onChange={(e) =>
                            updateQuestionField("question_text", e.target.value)
                          }
                          className="edit-textarea"
                          rows={3}
                        />
                      </div>

                      {/* Image - only for Part 1 */}
{currentPart?.part_type === "listening" && currentPart?.part_number === 1 && (
  <div className="field-group">
    <label>Image</label>
    {currentQuestion.image_file ? (
      <div style={{ marginBottom: "8px" }}>
        <img
          src={currentQuestion.image_file}
          alt="Question"
          style={{
            maxWidth: "100%",
            maxHeight: "200px",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          }}
        />
      </div>
    ) : null}
    <input
      type="file"
      accept="image/*"
      className="edit-input"
      onChange={(e) => {
        // Fake: chỉ log, chưa upload
        console.log("Selected image:", e.target.files?.[0]?.name);
        alert("Chức năng upload ảnh đang phát triển");
      }}
      style={{ padding: "6px" }}
    />
    <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
      Chức năng upload sẽ được triển khai sau
    </div>
  </div>
)}

{currentPart?.part_type === "listening" && (
  <div className="field-group">
    <label>Audio File</label>
    {currentQuestion.audio_file ? (
      <div style={{ marginBottom: "8px" }}>
        <audio controls style={{ width: "100%" }}>
          <source src={currentQuestion.audio_file} type="audio/mpeg" />
        </audio>
      </div>
    ) : null}
    <input
      type="file"
      accept="audio/*"
      className="edit-input"
      onChange={(e) => {
        console.log("Selected audio:", e.target.files?.[0]?.name);
        alert("Chức năng upload audio đang phát triển");
      }}
      style={{ padding: "6px" }}
    />
    <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
      Chức năng upload sẽ được triển khai sau
    </div>
  </div>
)}

                      {/* Transcript */}
                      <div className="field-group">
                        <label>Transcript / Passage</label>
                        <textarea
                          value={currentQuestion.transcript || ""}
                          onChange={(e) =>
                            updateQuestionField("transcript", e.target.value)
                          }
                          className="edit-textarea"
                          rows={4}
                        />
                      </div>

                      {/* Choices */}
                      <div className="field-group">
                        <label>Choices</label>
                        {(currentQuestion.choices || []).map((choice, cIdx) => (
                          <div key={cIdx} className="choice-edit-row">
                            <input
                              type="text"
                              placeholder={`Option ${
                                choice.choice_label ||
                                String.fromCharCode(65 + cIdx)
                              }`}
                              value={choice.choice_text || ""}
                              onChange={(e) =>
                                updateChoice(
                                  cIdx,
                                  "choice_text",
                                  e.target.value
                                )
                              }
                              className="edit-input choice-input"
                            />
                            <label className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={choice.is_correct || false}
                                onChange={(e) =>
                                  updateChoice(
                                    cIdx,
                                    "is_correct",
                                    e.target.checked
                                  )
                                }
                              />
                              Correct
                            </label>
                          </div>
                        ))}
                      </div>

                      {/* Explanation */}
                      <div className="field-group">
                        <label>Explanation</label>
                        <textarea
                          value={currentQuestion.explanation || ""}
                          onChange={(e) =>
                            updateQuestionField("explanation", e.target.value)
                          }
                          className="edit-textarea"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: "40px", textAlign: "center" }}>
                    No questions in this part
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer - Navigation + Save */}
        <div className="exam-edit-modal__footer">
          <button
            className="btn btn-secondary"
            onClick={handlePrevQuestion}
            disabled={!canPrev}
          >
            ← Previous
          </button>
          <button
  className="btn btn-secondary"
  onClick={handleNextQuestion}
  disabled={!canNext}
  style={{ marginLeft: "8px" }} // ✅ THÊM
>
  Next →
</button>
          <div style={{ fontSize: "14px", color: "#6b7280" }}>
            {questionNumber} / {totalQuestions} ({currentPart?.part_name || ""})
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn btn-secondary"
              onClick={() => {
                if (
                  hasChanges &&
                  !window.confirm("Có thay đổi chưa lưu. Đóng?")
                )
                  return;
                onClose?.();
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSaveAll}
              disabled={!hasChanges}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useAdminTestDetail } from "../hooks/useExamAdminQueries";
import "./ExamPreviewModal.scss";

export default function ExamPreviewModal({ open, onClose, testId }) {
  const [selectedPartIndex, setSelectedPartIndex] = useState(0);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);

  const { data: testDetailRes, isLoading } = useAdminTestDetail(
    testId,
    open && !!testId
  );
  const testData = testDetailRes?.DT || null;

  useEffect(() => {
    if (open && testData) {
      setSelectedPartIndex(0);
      setSelectedQuestionIndex(0);
    }
  }, [open, testData]);

  if (!open) return null;

  const parts = testData?.parts || [];
  const currentPart = parts[selectedPartIndex] || null;
  const questions = currentPart?.questions || [];
  const currentQuestion = questions[selectedQuestionIndex] || null;

  const totalQuestions = questions.length;
  const questionNumber = selectedQuestionIndex + 1;

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

  const canPrev = selectedPartIndex > 0 || selectedQuestionIndex > 0;
  const canNext =
    selectedPartIndex < parts.length - 1 ||
    selectedQuestionIndex < totalQuestions - 1;

  return (
    <div
      className="exam-preview-modal__backdrop"
      onMouseDown={(e) => {
        if (e.target.classList.contains("exam-preview-modal__backdrop"))
          onClose?.();
      }}
    >
      <div
        className="exam-preview-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="exam-preview-modal__header">
          <div>
            <div style={{ fontWeight: 600, fontSize: "18px" }}>
              {testData?.title || "Preview Exam"}
            </div>
            <div
              style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}
            >
              {currentPart?.part_name || ""} • Question {questionNumber} /{" "}
              {totalQuestions}
            </div>
          </div>
          <button className="btn-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="exam-preview-modal__content">
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
            <div className="exam-preview-content">
              {/* Sidebar - Parts list */}
              <div className="exam-preview-sidebar">
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

              {/* Main content - Question */}
              <div className="exam-preview-main">
                {currentQuestion ? (
                  <>
                    {/* Question text */}
                    <div className="preview-question-text">
                      <div className="question-label">
                        Question {questionNumber}
                      </div>
                      <div className="question-content">
                        {currentQuestion.question_text || "(No question text)"}
                      </div>
                    </div>

                    {/* Media: Image */}
                    {currentQuestion.image_file && (
                      <div className="preview-media">
                        <img
                          src={currentQuestion.image_file}
                          alt="Question image"
                          style={{ maxWidth: "100%", borderRadius: "8px" }}
                        />
                      </div>
                    )}

                    {/* Media: Audio */}
                    {currentQuestion.audio_file && (
                      <div className="preview-media">
                        <audio controls style={{ width: "100%" }}>
                          <source
                            src={currentQuestion.audio_file}
                            type="audio/mpeg"
                          />
                        </audio>
                      </div>
                    )}

                    {/* Passage/Transcript */}
                    {(currentQuestion.transcript ||
                      currentQuestion.question_text?.length > 200) && (
                      <div className="preview-passage">
                        <div className="passage-label">
                          Passage / Transcript
                        </div>
                        <div className="passage-content">
                          {currentQuestion.transcript ||
                            currentQuestion.question_text}
                        </div>
                      </div>
                    )}

                    {/* Choices */}
                    <div className="preview-choices">
                      <div className="choices-label">Options</div>
                      {(currentQuestion.choices || []).map((choice, cIdx) => (
                        <div
                          key={choice.choice_id || cIdx}
                          className={`choice-item ${
                            choice.is_correct ? "choice-item--correct" : ""
                          }`}
                        >
                          <div className="choice-label">
                            {choice.choice_label ||
                              String.fromCharCode(65 + cIdx)}
                          </div>
                          <div className="choice-text">
                            {choice.choice_text}
                          </div>
                          {choice.is_correct && (
                            <div className="choice-badge">Correct</div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Explanation */}
                    {currentQuestion.explanation && (
                      <div className="preview-explanation">
                        <div className="explanation-label">Explanation</div>
                        <div className="explanation-content">
                          {currentQuestion.explanation}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ padding: "40px", textAlign: "center" }}>
                    No questions in this part
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer - Navigation */}
        <div className="exam-preview-modal__footer">
          <button
            className="btn btn-secondary"
            onClick={handlePrevQuestion}
            disabled={!canPrev}
          >
            ← Previous
          </button>
          <div style={{ fontSize: "14px", color: "#6b7280" }}>
            {questionNumber} / {totalQuestions} ({currentPart?.part_name || ""})
          </div>
          <button
            className="btn btn-primary"
            onClick={handleNextQuestion}
            disabled={!canNext}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

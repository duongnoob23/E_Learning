// QuestionDetailModal.jsx - Modal hiển thị chi tiết câu hỏi
import React, { useState } from "react";
import "../AssessmentCSS/QuestionDetailModal.css";

export default function QuestionDetailModal({ 
  open, 
  onClose, 
  questionData 
}) {
  const [showTranscript, setShowTranscript] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  if (!open || !questionData) return null;

  const { question, selected_choice, is_correct } = questionData;
  if (!question) return null;

  // Tìm đáp án đúng
  const correctChoice = question.choices?.find((c) => c.is_correct) || null;

  const getStatus = () => {
    if (is_correct === true) return "correct";
    if (is_correct === false) return "wrong";
    return "skipped";
  };

  const status = getStatus();

  return (
    <div
      className="question-detail-modal__backdrop"
      onClick={(e) => {
        if (e.target.classList.contains("question-detail-modal__backdrop")) {
          onClose();
        }
      }}
    >
      <div
        className="question-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="question-detail-modal__header">
          <div>
            <div className="question-detail-modal__title">
              Đáp án chi tiết #{question.question_number}
            </div>
            <div className="question-detail-modal__subtitle">
              {question.part?.part_name || 
               (question.part?.part_number ? `Part ${question.part.part_number}` : `Part ${question.part_id || 'N/A'}`)}
            </div>
          </div>
          <button className="question-detail-modal__close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Content */}
        <div className="question-detail-modal__content">
          {/* Question Text - sát với image/audio */}
          {question.question_text && (
            <div className="question-detail-section">
              <div className="question-detail-section__content">
                {question.question_text}
              </div>
            </div>
          )}

          {/* Image - sát với question text */}
          {question.image_file && (
            <div className="question-detail-section">
              <img
                src={question.image_file}
                alt="Question"
                className="question-detail-image"
              />
            </div>
          )}

          {/* Audio - sát với image */}
          {question.audio_file && (
            <div className="question-detail-section">
              <audio controls className="question-detail-audio">
                <source src={question.audio_file} type="audio/mpeg" />
                <source src={question.audio_file} type="audio/wav" />
                Trình duyệt không hỗ trợ audio.
              </audio>
            </div>
          )}

          {/* Transcript */}
          {question.transcript && (
            <div className="question-detail-section">
              <button
                className="question-detail-toggle"
                onClick={() => setShowTranscript(!showTranscript)}
              >
                {showTranscript ? "Ẩn" : "Hiện"} Transcript
              </button>
              {showTranscript && (
                <div className="question-detail-section__content question-detail-transcript">
                  {question.transcript}
                </div>
              )}
            </div>
          )}

          {/* Choices - compact */}
          {question.choices && question.choices.length > 0 && (
            <div className="question-detail-section">
              <div className="question-detail-choices">
                {question.choices.map((choice, index) => {
                  const isSelected = selected_choice?.choice_id === choice.choice_id;
                  const isCorrect = choice.is_correct;
                  
                  let choiceClass = "question-detail-choice";
                  if (isCorrect) {
                    choiceClass += " question-detail-choice--correct";
                  }
                  if (isSelected && !isCorrect) {
                    choiceClass += " question-detail-choice--wrong";
                  }
                  if (isSelected && isCorrect) {
                    choiceClass += " question-detail-choice--selected-correct";
                  }

                  return (
                    <div key={choice.choice_id || index} className={choiceClass}>
                      <div className="question-detail-choice__header">
                        <span className="question-detail-choice__label">
                          {choice.choice_letter || String.fromCharCode(65 + index)}.
                        </span>
                        {isCorrect && (
                          <span className="question-detail-choice__badge">
                            Đáp án đúng
                          </span>
                        )}
                        {isSelected && (
                          <span className="question-detail-choice__badge question-detail-choice__badge--selected">
                            Bạn đã chọn
                          </span>
                        )}
                      </div>
                      <div className="question-detail-choice__text">
                        {choice.choice_text}
                      </div>
                      {/* ✅ THÊM: Dịch từng đáp án */}
                      {choice.choice_translation && (
                        <div className="question-detail-choice__translation">
                          {choice.choice_translation}
                        </div>
                      )}
                      {choice.choice_explanation && (
                        <div className="question-detail-choice__explanation">
                          {choice.choice_explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Explanation */}
          {question.explanation && (
            <div className="question-detail-section">
              <button
                className="question-detail-toggle"
                onClick={() => setShowExplanation(!showExplanation)}
              >
                {showExplanation ? "Ẩn" : "Hiện"} Giải thích chi tiết
              </button>
              {showExplanation && (
                <div className="question-detail-section__content question-detail-explanation">
                  {question.explanation}
                </div>
              )}
            </div>
          )}

          {/* Grammar Notes */}
          {question.grammar_notes && (
            <div className="question-detail-section">
              <div className="question-detail-section__title">Ghi chú ngữ pháp</div>
              <div className="question-detail-section__content">
                {question.grammar_notes}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="question-detail-modal__footer">
          <button
            className="question-detail-modal__btn question-detail-modal__btn--primary"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}


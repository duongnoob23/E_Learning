// QuestionDetailModal.jsx - Modal hiển thị chi tiết câu hỏi cho Admin
import React, { useState } from "react";
import { HiXMark } from "react-icons/hi2";
import "./QuestionDetailModal.scss";

export default function QuestionDetailModal({ 
  open, 
  onClose, 
  questionData 
}) {
  const [showTranscript, setShowTranscript] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  if (!open || !questionData) return null;

  const { question, selected_choice, is_correct, selected_choice_id } = questionData;
  if (!question) return null;

  // Tìm đáp án đúng
  const correctChoice = question.choices?.find((c) => c.is_correct) || null;
  const selectedChoice = selected_choice || 
                         (question.choices?.find(c => c.choice_id === selected_choice_id)) || 
                         null;

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
              Đáp án chi tiết #{question.question_number || question.question_id}
            </div>
            <div className="question-detail-modal__subtitle">
              {question.part?.part_name || 
               (question.part?.part_number ? `Part ${question.part.part_number}` : `Part ${question.part_id || 'N/A'}`)}
            </div>
          </div>
          <button className="question-detail-modal__close" onClick={onClose}>
            <HiXMark />
          </button>
        </div>

        {/* Content */}
        <div className="question-detail-modal__content">
          {/* Question Text - Hiển thị cho tất cả các part nếu có */}
          {(question.question_text || question.question_content) && (
            <div className="question-detail-section">
              <div className="question-detail-section__title">Câu hỏi</div>
              <div className="question-detail-section__content question-detail-question-text">
                {question.question_text || question.question_content}
              </div>
            </div>
          )}

          {/* Image - Hiển thị cho Part 1, Part 3, Part 4, Part 7 nếu có */}
          {(question.image_file || question.image_url || question.image) && (
            <div className="question-detail-section">
              <img
                src={question.image_file || question.image_url || question.image}
                alt="Question"
                className="question-detail-image"
              />
            </div>
          )}

          {/* Video - Nếu có video thì hiển thị video */}
          {(question.video_file || question.video_url || question.video) && (
            <div className="question-detail-section">
              <video controls className="question-detail-video" style={{ width: '100%', maxHeight: '400px' }}>
                <source src={question.video_file || question.video_url || question.video} type="video/mp4" />
                Trình duyệt không hỗ trợ video.
              </video>
            </div>
          )}

          {/* Audio - Hiển thị cho Part 1, 2, 3, 4 nếu có */}
          {(question.audio_file || question.audio_url || question.audio) && (
            <div className="question-detail-section">
              <audio controls className="question-detail-audio">
                <source src={question.audio_file || question.audio_url || question.audio} type="audio/mpeg" />
                <source src={question.audio_file || question.audio_url || question.audio} type="audio/wav" />
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

          {/* Choices */}
          {question.choices && question.choices.length > 0 && (
            <div className="question-detail-section">
              <div className="question-detail-choices">
                {question.choices.map((choice, index) => {
                  const isSelected = selectedChoice?.choice_id === choice.choice_id;
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
                          <span className={`question-detail-choice__badge ${isCorrect ? 'question-detail-choice__badge--selected-correct' : 'question-detail-choice__badge--selected'}`}>
                            Bạn đã chọn
                          </span>
                        )}
                      </div>
                      <div className="question-detail-choice__text">
                        {choice.choice_text}
                      </div>
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


import React, { useState, useEffect } from "react";
import { HiXMark } from "react-icons/hi2";
import { usersAdminApi } from "../api/usersAdminApi";
import QuestionDetailModal from "./QuestionDetailModal";
import "./ExamResultModal.scss";

export default function ExamResultModal({ userId, examSessionId, onClose }) {
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      if (!userId || !examSessionId) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await usersAdminApi.getUserExamResult(userId, examSessionId);
        
        if (response.EC === "0") {
          setResultData(response.DT);
        } else {
          setError(response.EM || "Không thể tải kết quả bài thi");
        }
      } catch (err) {
        console.error("Error fetching exam result:", err);
        setError("Có lỗi xảy ra khi tải kết quả bài thi");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [userId, examSessionId]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleQuestionClick = (answerData) => {
    setSelectedQuestion(answerData);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedQuestion(null);
  };

  // Group questions by part
  const groupQuestionsByPart = (answers) => {
    if (!Array.isArray(answers)) return {};
    const grouped = {};
    answers.forEach((answer) => {
      const partNumber = answer.question?.part?.part_number || 
                        answer.question?.part_id || 
                        answer.part_id || 
                        1;
      if (!grouped[partNumber]) {
        grouped[partNumber] = [];
      }
      grouped[partNumber].push(answer);
    });
    return grouped;
  };

  const getStatus = (answer) => {
    if (answer.is_correct === true) return "correct";
    if (answer.is_correct === false) return "wrong";
    return "skipped";
  };

  const getCorrectChoice = (question) => {
    if (!question?.choices) return null;
    return question.choices.find((c) => c.is_correct) || null;
  };

  const getSelectedChoice = (answer) => {
    return answer.selected_choice || 
           (answer.question?.choices?.find(c => c.choice_id === answer.selected_choice_id)) || 
           null;
  };

  if (loading) {
    return (
      <div className="exam-result-modal__backdrop" onClick={onClose}>
        <div className="exam-result-modal__wrapper" onClick={(e) => e.stopPropagation()}>
          <div className="exam-result-modal__loading">Đang tải kết quả...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="exam-result-modal__backdrop" onClick={onClose}>
        <div className="exam-result-modal__wrapper" onClick={(e) => e.stopPropagation()}>
          <div className="exam-result-modal__header">
            <h2>Kết quả bài thi</h2>
            <button className="exam-result-modal__close" onClick={onClose}>
              <HiXMark />
            </button>
          </div>
          <div className="exam-result-modal__error">{error}</div>
        </div>
      </div>
    );
  }

  if (!resultData) {
    return null;
  }

  const { session, part_statistics, detailed_answers } = resultData;
  const test = session?.test || session?.Test || {};
  const totalQuestions = (session?.correct_answers || 0) + (session?.wrong_answers || 0) + (session?.skipped_answers || 0);
  const questionsByPart = groupQuestionsByPart(detailed_answers || []);

  return (
    <>
      <div className="exam-result-modal__backdrop" onClick={onClose}>
        <div className="exam-result-modal__wrapper" onClick={(e) => e.stopPropagation()}>
          <div className="exam-result-modal__header">
            <h2>Kết quả bài thi: {test.title || test.test_title || "Unknown"}</h2>
            <button className="exam-result-modal__close" onClick={onClose}>
              <HiXMark />
            </button>
          </div>

          <div className="exam-result-modal__content">
            {/* Thông tin tổng quan */}
            <div className="exam-result-modal__overview">
              <div className="exam-result-modal__overview-item">
                <span className="exam-result-modal__label">Điểm số:</span>
                <span className="exam-result-modal__value">{session?.total_score || 0}</span>
              </div>
              <div className="exam-result-modal__overview-item">
                <span className="exam-result-modal__label">Đúng:</span>
                <span className="exam-result-modal__value exam-result-modal__value--success">
                  {session?.correct_answers || 0}
                </span>
              </div>
              <div className="exam-result-modal__overview-item">
                <span className="exam-result-modal__label">Sai:</span>
                <span className="exam-result-modal__value exam-result-modal__value--error">
                  {session?.wrong_answers || 0}
                </span>
              </div>
              <div className="exam-result-modal__overview-item">
                <span className="exam-result-modal__label">Bỏ qua:</span>
                <span className="exam-result-modal__value">{session?.skipped_answers || 0}</span>
              </div>
              <div className="exam-result-modal__overview-item">
                <span className="exam-result-modal__label">Thời gian:</span>
                <span className="exam-result-modal__value">{formatDuration(session?.duration_seconds)}</span>
              </div>
              <div className="exam-result-modal__overview-item">
                <span className="exam-result-modal__label">Ngày làm:</span>
                <span className="exam-result-modal__value">{formatDate(session?.start_time)}</span>
              </div>
            </div>

            {/* Thống kê theo Part */}
            {part_statistics && Array.isArray(part_statistics) && part_statistics.length > 0 && (
              <div className="exam-result-modal__section">
                <h3 className="exam-result-modal__section-title">Thống kê theo phần</h3>
                <div className="exam-result-modal__part-stats">
                  {part_statistics.map((part) => {
                    const partName = part.part?.part_name || part.part_name || `Part ${part.part_id || part.part_number || 'N/A'}`;
                    const accuracyRate = part.accuracy_rate || 0;
                    const correctAnswers = part.correct_answers || 0;
                    const totalQuestions = part.total_questions || 0;
                    
                    return (
                      <div key={part.part_stat_id || part.part_id} className="exam-result-modal__part-stat-card">
                        <div className="exam-result-modal__part-name">{partName}</div>
                        <div className="exam-result-modal__part-details">
                          <span>Tỷ lệ đúng: {typeof accuracyRate === 'number' ? accuracyRate.toFixed(1) : '0.0'}%</span>
                          <span>Đúng: {correctAnswers}/{totalQuestions}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Danh sách câu hỏi - Compact format */}
            {detailed_answers && Array.isArray(detailed_answers) && detailed_answers.length > 0 && (
              <div className="exam-result-modal__section">
                <h3 className="exam-result-modal__section-title">Danh sách câu hỏi</h3>
                {Object.entries(questionsByPart)
                  .sort(([a], [b]) => Number(a) - Number(b))
                  .map(([partNumber, partAnswers]) => (
                    <div key={partNumber} className="exam-result-modal__question-list-part">
                      <h4 className="exam-result-modal__question-list-part-title">
                        Part {partNumber}
                        {partAnswers[0]?.question?.part?.part_name && (
                          <span className="exam-result-modal__question-list-part-subtitle">
                            {" - " + partAnswers[0].question.part.part_name}
                          </span>
                        )}
                      </h4>
                      <div className="exam-result-modal__question-list-items">
                        {partAnswers.map((answer) => {
                          const status = getStatus(answer);
                          const questionNumber = answer.question?.question_number || answer.question_id;
                          const correctChoice = getCorrectChoice(answer.question);
                          const selectedChoice = getSelectedChoice(answer);
                          const correctLetter = correctChoice?.choice_letter || '';
                          const selectedLetter = selectedChoice?.choice_letter || '';
                          const isWrong = status === 'wrong';

                          return (
                            <div
                              key={answer.user_answer_id || answer.question_id}
                              className={`exam-result-modal__question-list-item exam-result-modal__question-list-item--${status}`}
                            >
                              <span className="exam-result-modal__question-list-item__number">
                                {questionNumber}
                              </span>
                              <span className="exam-result-modal__question-list-item__correct">
                                {correctLetter}
                              </span>
                              <span className="exam-result-modal__question-list-item__separator">:</span>
                              <span className={`exam-result-modal__question-list-item__selected ${isWrong ? 'exam-result-modal__question-list-item__selected--wrong' : ''}`}>
                                {selectedLetter || '-'}
                              </span>
                              <span 
                                className="exam-result-modal__question-list-item__detail-link"
                                onClick={() => handleQuestionClick(answer)}
                              >
                                [Chi tiết]
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="exam-result-modal__actions">
            <button className="exam-result-modal__btn" onClick={onClose}>
              Đóng
            </button>
          </div>
        </div>
      </div>

      {/* Question Detail Modal */}
      {isDetailModalOpen && selectedQuestion && (
        <QuestionDetailModal
          open={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          questionData={selectedQuestion}
        />
      )}
    </>
  );
}

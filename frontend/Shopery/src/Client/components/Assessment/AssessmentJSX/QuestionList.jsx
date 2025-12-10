// QuestionList.jsx - Hiển thị danh sách tất cả câu hỏi với status
import React from "react";
import "../AssessmentCSS/QuestionList.css";

export default function QuestionList({ 
  questions = [], 
  onQuestionClick 
}) {
  if (!questions || questions.length === 0) {
    return (
      <div className="question-list-empty">
        <p>Không có câu hỏi nào</p>
      </div>
    );
  }

  // Group questions by part
  const questionsByPart = {};
  questions.forEach((item) => {
    // ✅ Dùng part_number từ part object hoặc fallback về part_id
    const partNumber = item.question?.part?.part_number || item.question?.part_id || 1;
    if (!questionsByPart[partNumber]) {
      questionsByPart[partNumber] = [];
    }
    questionsByPart[partNumber].push(item);
  });

  const getStatus = (item) => {
    if (item.is_correct === true) return "correct";
    if (item.is_correct === false) return "wrong";
    return "skipped";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "correct":
        return <span className="status-icon status-icon--correct">✓</span>;
      case "wrong":
        return <span className="status-icon status-icon--wrong">✗</span>;
      case "skipped":
        return <span className="status-icon status-icon--skipped">?</span>;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "correct":
        return "Đúng";
      case "wrong":
        return "Sai";
      case "skipped":
        return "Chưa làm";
      default:
        return "Chưa làm";
    }
  };

  return (
    <div className="question-list-container">
      <h2 className="question-list-title">Danh sách câu hỏi</h2>
      
      {Object.entries(questionsByPart)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([partNumber, partQuestions]) => (
        <div key={partNumber} className="question-list-part">
          <h3 className="question-list-part-title">
            Part {partNumber}
            {partQuestions[0]?.question?.part?.part_name && (
              <span className="question-list-part-subtitle">
                {" - " + partQuestions[0].question.part.part_name}
              </span>
            )}
          </h3>
          <div className="question-list-items">
            {partQuestions.map((item) => {
              const status = getStatus(item);
              const questionNumber = item.question?.question_number || item.question_id;
              
              // Tìm đáp án đúng
              const correctChoice = item.question?.choices?.find((c) => c.is_correct);
              const correctLetter = correctChoice?.choice_letter || '';
              const selectedLetter = item.selected_choice?.choice_letter || '';
              const isWrong = status === 'wrong';
              
              return (
                <div
                  key={item.question_id}
                  className={`question-list-item question-list-item--${status}`}
                >
                  <span className="question-list-item__number">{questionNumber}</span>
                  <span className="question-list-item__correct">
                    {correctLetter}
                  </span>
                  <span className="question-list-item__separator">:</span>
                  <span className={`question-list-item__selected ${isWrong ? 'question-list-item__selected--wrong' : ''}`}>
                    {selectedLetter || '-'}
                  </span>
                  <span 
                    className="question-list-item__detail-link"
                    onClick={() => onQuestionClick(item)}
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
  );
}


// Exam Progress Component - Hiển thị tiến trình làm bài
import React from "react";
import "./ExamProgress.css";

const ExamProgress = ({ 
  currentQuestion = 1, 
  totalQuestions = 100, 
  timeLeft = 3600, 
  totalTime = 7200, // 2 hours default
  answeredQuestions = 0,
  isPaused = false,
  onPauseResume = () => {},
  onExit = () => {}
}) => {
  const progressPercentage = (answeredQuestions / totalQuestions) * 100;
  const timePercentage = ((totalTime - timeLeft) / totalTime) * 100;

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = (timeLeft) => {
    if (timeLeft < 300) return "#EF4444"; // Red when less than 5 minutes
    if (timeLeft < 900) return "#F59E0B"; // Orange when less than 15 minutes
    return "#10B981"; // Green
  };

  return (
    <div className="exam-progress">
      <div className="exam-progress__container">
        {/* Header Info */}
        <div className="progress-header">
          <div className="progress-info">
            <div className="question-info">
              <span className="question-current">{currentQuestion}</span>
              <span className="question-separator">/</span>
              <span className="question-total">{totalQuestions}</span>
            </div>
            <div className="progress-label">Questions</div>
          </div>

          <div className="progress-info">
            <div className="time-info" style={{ color: getTimeColor(timeLeft) }}>
              {formatTime(timeLeft)}
            </div>
            <div className="progress-label">Time Left</div>
          </div>

          <div className="progress-info">
            <div className="answered-info">
              {answeredQuestions}/{totalQuestions}
            </div>
            <div className="progress-label">Answered</div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="progress-bars">
          <div className="progress-bar-container">
            <div className="progress-bar-label">Question Progress</div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="progress-percentage">{Math.round(progressPercentage)}%</div>
          </div>

          <div className="progress-bar-container">
            <div className="progress-bar-label">Time Progress</div>
            <div className="progress-bar">
              <div 
                className="progress-fill time-progress"
                style={{ 
                  width: `${timePercentage}%`,
                  backgroundColor: getTimeColor(timeLeft)
                }}
              ></div>
            </div>
            <div className="progress-percentage">{Math.round(timePercentage)}%</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="progress-actions">
          <button 
            className={`action-btn ${isPaused ? 'resume-btn' : 'pause-btn'}`}
            onClick={onPauseResume}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              {isPaused ? (
                <path d="M8 5v14l11-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              ) : (
                <>
                  <rect x="6" y="4" width="4" height="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="14" y="4" width="4" height="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </>
              )}
            </svg>
            {isPaused ? 'Resume' : 'Pause'}
          </button>

          <button 
            className="action-btn exit-btn"
            onClick={onExit}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m7 14l5-5-5-5m-5 5h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Exit
          </button>
        </div>

      </div>
    </div>
  );
};

export default ExamProgress;

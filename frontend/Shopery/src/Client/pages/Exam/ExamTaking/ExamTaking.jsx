// Exam Taking Page - Giao diện làm bài thi
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ExamProgress from "../../../components/Exam/ExamProgress/ExamProgress";
import "./ExamTaking.css";

const ExamTaking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null); // null means not initialized yet
  const [isPaused, setIsPaused] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const timerRef = useRef(null);

  // Mock data
  useEffect(() => {
    const mockExam = {
      id: parseInt(id),
      title: "TOEIC Practice Test 001",
      type: "toeic",
      duration: 120, // 2 hours in minutes
      sections: [
        {
          id: 1,
          name: "Listening",
          duration: 45,
          questions: [
            {
              id: 1,
              type: "mcq",
              text: "You will hear: (Woman) The meeting is at 2 pm in Room 5. (Man) Got it, thanks. Question: Where is the meeting?",
              media_url: "https://www.ets.org/toeic/sample-audio/meeting.mp3",
              choices: [
                { id: 1, text: "In Room 5", is_correct: true },
                { id: 2, text: "At the cafeteria", is_correct: false },
                { id: 3, text: "Conference room", is_correct: false },
                { id: 4, text: "Online", is_correct: false }
              ]
            },
            {
              id: 2,
              type: "fill_blank",
              text: "You will hear: (Man) Can you send the report by Friday? (Woman) I'll try, but Thursday is better. Question: When does the woman prefer to send the report?",
              choices: [
                { id: 1, text: "Friday", is_correct: false },
                { id: 2, text: "Thursday", is_correct: true },
                { id: 3, text: "Wednesday", is_correct: false },
                { id: 4, text: "Monday", is_correct: false }
              ]
            },
            {
              id: 3,
              type: "fill_blank",
              text: "The conference starts at ________.",
              choices: null
            }
          ]
        },
        {
          id: 2,
          name: "Reading",
          duration: 75,
          questions: [
            {
              id: 4,
              type: "mcq",
              text: "The manager will ______ the meeting tomorrow.",
              choices: [
                { id: 1, text: "conduct", is_correct: true },
                { id: 2, text: "conducted", is_correct: false },
                { id: 3, text: "conducting", is_correct: false },
                { id: 4, text: "conducts", is_correct: false }
              ]
            },
            {
              id: 5,
              type: "fill_blank",
              text: "Please _______ the attached document before the meeting.",
              choices: [
                { id: 1, text: "Review", is_correct: true },
                { id: 2, text: "Reviewed", is_correct: false },
                { id: 3, text: "Reviewing", is_correct: false },
                { id: 4, text: "Reviews", is_correct: false }
              ]
            }
          ]
        }
      ]
    };

    setExam(mockExam);
    setTimeLeft(mockExam.duration * 60); // Convert to seconds
  }, [id]);

  // Timer effect
  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0 && !isPaused) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSubmitExam();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, isPaused]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentQuestion = () => {
    if (!exam || !exam.sections[currentSection]) return null;
    return exam.sections[currentSection].questions[currentQuestion];
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    const currentSectionQuestions = exam.sections[currentSection].questions;
    if (currentQuestion < currentSectionQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentSection < exam.sections.length - 1) {
      setCurrentSection(currentSection + 1);
      setCurrentQuestion(0);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setCurrentQuestion(exam.sections[currentSection - 1].questions.length - 1);
    }
  };

  const handleSectionChange = (sectionIndex) => {
    setCurrentSection(sectionIndex);
    setCurrentQuestion(0);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleSubmitExam = () => {
    setShowConfirmSubmit(true);
  };

  const confirmSubmit = () => {
    // Calculate score and navigate to results
    navigate(`/exam/${id}/result`);
  };

  const getTotalQuestions = () => {
    return exam.sections.reduce((total, section) => total + section.questions.length, 0);
  };

  const getAnsweredQuestions = () => {
    return Object.keys(answers).length;
  };

  const getQuestionNumber = () => {
    let questionNumber = 0;
    for (let i = 0; i < currentSection; i++) {
      questionNumber += exam.sections[i].questions.length;
    }
    return questionNumber + currentQuestion + 1;
  };

  if (!exam) {
    return (
      <div className="exam-taking-loading">
        <div className="loading-spinner"></div>
        <p>Loading exam...</p>
      </div>
    );
  }

  const currentQuestionData = getCurrentQuestion();

  return (
    <div className="exam-taking">
      {/* Header - Study4 Style */}
      <div className="exam-taking__header">
        <div className="exam-taking__info">
          <div className="exam-breadcrumb">
            <span>Practice Tests</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{exam.title}</span>
          </div>
          <h1 className="exam-title">{exam.title}</h1>
          <div className="exam-meta">
            <div className="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{formatTime(timeLeft)} remaining</span>
            </div>
            <div className="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{exam.sections[currentSection].name}</span>
            </div>
            <div className="meta-item">
              <span className="question-counter">
                {getQuestionNumber()}/{getTotalQuestions()}
              </span>
            </div>
          </div>

        </div>
        
        <div className="exam-taking__actions">
          <button 
            className={`action-btn ${isPaused ? 'resume-btn' : 'pause-btn'}`}
            onClick={handlePauseResume}
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
            onClick={() => navigate('/exam')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m7 14l5-5-5-5m-5 5h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Exit
          </button>
        </div>
      </div>

      <div className="exam-taking__content">
        {/* Sidebar */}
        <div className="exam-taking__sidebar">
          {/* Action Buttons */}
          <div className="sidebar-actions">
            <button 
              className={`action-btn ${isPaused ? 'resume-btn' : 'pause-btn'}`}
              onClick={handlePauseResume}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                {isPaused ? (
                  <path d="M8 5v14l11-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                ) : (
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                )}
              </svg>
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button 
              className="action-btn exit-btn"
              onClick={() => navigate('/exam')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Exit
            </button>
          </div>

          <div className="sections-nav">
            <h3>Sections</h3>
            {exam.sections.map((section, index) => (
              <button
                key={section.id}
                className={`section-btn ${index === currentSection ? 'active' : ''}`}
                onClick={() => handleSectionChange(index)}
              >
                {section.name}
                <span className="section-questions">
                  {section.questions.length} questions
                </span>
              </button>
            ))}
          </div>

          <div className="question-nav">
            <h3>Questions</h3>
            <div className="question-grid">
              {exam.sections[currentSection].questions.map((question, index) => (
                <button
                  key={question.id}
                  className={`question-btn ${
                    index === currentQuestion ? 'current' : ''
                  } ${
                    answers[question.id] ? 'answered' : ''
                  }`}
                  onClick={() => setCurrentQuestion(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="exam-taking__main">
          {currentQuestionData && (
            <div className="question-container">
              <div className="question-header">
                <span className="question-type">
                  {currentQuestionData.type.toUpperCase()}
                </span>
                <span className="question-number">
                  Question {getQuestionNumber()}
                </span>
              </div>

              <div className="question-content">
                <p className="question-text">{currentQuestionData.text}</p>
                
                {currentQuestionData.media_url && (
                  <div className="question-media">
                    <audio controls>
                      <source src={currentQuestionData.media_url} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}

                {currentQuestionData.type === 'mcq' && currentQuestionData.choices && (
                  <div className="question-choices">
                    {currentQuestionData.choices.map((choice) => (
                      <label key={choice.id} className="choice-item">
                        <input
                          type="radio"
                          name={`question_${currentQuestionData.id}`}
                          value={choice.id}
                          checked={answers[currentQuestionData.id] === choice.id}
                          onChange={() => handleAnswerChange(currentQuestionData.id, choice.id)}
                        />
                        <span className="choice-text">{choice.text}</span>
                      </label>
                    ))}
                  </div>
                )}

                {currentQuestionData.type === 'fill_blank' && currentQuestionData.choices && (
                  <div className="question-choices">
                    {currentQuestionData.choices.map((choice) => (
                      <label key={choice.id} className="choice-item">
                        <input
                          type="radio"
                          name={`question_${currentQuestionData.id}`}
                          value={choice.id}
                          checked={answers[currentQuestionData.id] === choice.id}
                          onChange={() => handleAnswerChange(currentQuestionData.id, choice.id)}
                        />
                        <span className="choice-text">{choice.text}</span>
                      </label>
                    ))}
                  </div>
                )}

                {currentQuestionData.type === 'fill_blank' && !currentQuestionData.choices && (
                  <div className="question-input">
                    <input
                      type="text"
                      placeholder="Enter your answer..."
                      value={answers[currentQuestionData.id] || ''}
                      onChange={(e) => handleAnswerChange(currentQuestionData.id, e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="question-actions">
                <button 
                  className="btn-secondary"
                  onClick={handlePrevQuestion}
                  disabled={currentSection === 0 && currentQuestion === 0}
                >
                  Previous
                </button>
                <button 
                  className="btn-primary"
                  onClick={handleNextQuestion}
                  disabled={currentSection === exam.sections.length - 1 && 
                           currentQuestion === exam.sections[currentSection].questions.length - 1}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="exam-taking__footer">
        <button 
          className="btn-submit"
          onClick={handleSubmitExam}
        >
          Submit Exam
        </button>
      </div>

      {/* Confirm Submit Modal */}
      {showConfirmSubmit && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Submit Exam?</h2>
            <p>Are you sure you want to submit your exam? You have answered {getAnsweredQuestions()} out of {getTotalQuestions()} questions.</p>
            <div className="modal-actions">
              <button 
                className="btn-secondary"
                onClick={() => setShowConfirmSubmit(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={confirmSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamTaking;

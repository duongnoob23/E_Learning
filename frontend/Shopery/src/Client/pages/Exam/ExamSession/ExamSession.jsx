import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  useSessionQuestions,
  useSaveAnswer,
  useSubmitSession,
  useSaveProgress
} from '../../../hooks/Exam/useExamQueries';
import './ExamSession.css';

const ExamSession = () => {
  const { testId, userTestId } = useParams();
  const navigate = useNavigate();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Read sectionIds from query string
  const searchParams = new URLSearchParams(window.location.search);
  const sectionIdsParam = searchParams.get('sectionIds');
  const sectionIds = sectionIdsParam ? sectionIdsParam.split(',').map((id) => parseInt(id)) : null;

  // API calls (pass sectionIds to only fetch selected sections' questions)
  const { data: sessionData, isLoading, error } = useSessionQuestions(userTestId, sectionIds);
  const saveAnswerMutation = useSaveAnswer();
  const submitSessionMutation = useSubmitSession();
  const saveProgressMutation = useSaveProgress();

  const questions = sessionData?.DT?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  // Timer effect
  useEffect(() => {
    if (sessionData?.DT?.remaining_time && sessionData.DT.remaining_time > 0) {
      setRemainingTime(sessionData.DT.remaining_time);
    }
  }, [sessionData]);

  useEffect(() => {
    let timer;
    if (remainingTime !== null && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime(prevTime => {
          if (prevTime <= 1) {
            handleSubmitExam(true); // Auto-submit when time runs out
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [remainingTime]);

  // Auto-save progress every 30 seconds
  useEffect(() => {
    let autoSaveInterval;
    if (remainingTime !== null) {
      autoSaveInterval = setInterval(() => {
        handleSaveProgress();
      }, 30000); // Save every 30 seconds
    }
    return () => clearInterval(autoSaveInterval);
  }, [remainingTime]);

  // Initialize answers from existing data
  useEffect(() => {
    if (questions.length > 0) {
      const initialAnswers = {};
      questions.forEach(question => {
        if (question.user_answer) {
          initialAnswers[question.question_id] = {
            answer_text: question.user_answer.answer_text,
            choice_id: question.user_answer.choice_id,
            is_draft: question.user_answer.is_draft
          };
        }
      });
      setAnswers(initialAnswers);
    }
  }, [questions]);

  const formatTime = (seconds) => {
    if (seconds === null) return 'N/A';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = async (questionId, answerData) => {
    const newAnswers = {
      ...answers,
      [questionId]: {
        ...answers[questionId],
        ...answerData,
        is_draft: true
      }
    };
    setAnswers(newAnswers);

    // Save answer to backend
    try {
      await saveAnswerMutation.mutateAsync({
        userTestId,
        questionId,
        answerData: {
          ...answerData,
          is_draft: true
        }
      });
    } catch (error) {
      console.error('Error saving answer:', error);
    }
  };

  const handleSaveProgress = async () => {
    try {
      await saveProgressMutation.mutateAsync({
        userTestId,
        remainingTime,
        currentQuestionId: currentQuestion?.question_id
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleSubmitExam = async (isAutoSubmit = false) => {
    if (isSubmitting) return;
    
    if (!isAutoSubmit && !window.confirm('Bạn có chắc chắn muốn nộp bài?')) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Mark all answers as final
      for (const questionId in answers) {
        if (answers[questionId] && answers[questionId].is_draft) {
          await saveAnswerMutation.mutateAsync({
            userTestId,
            questionId,
            answerData: {
              ...answers[questionId],
              is_draft: false
            }
          });
        }
      }

      // Submit session
      const result = await submitSessionMutation.mutateAsync(userTestId);
      
      if (result.EC === '0') {
        // Navigate to result page
        navigate(`/exam/${testId}/result/${userTestId}`);
      }
    } catch (error) {
      console.error('Error submitting exam:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Removed abandon exam feature per request

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleGoToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  if (isLoading) {
    return (
      <div className="exam-session-container loading">
        <div className="loading-spinner"></div>
        <p>Đang tải câu hỏi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="exam-session-container error">
        <h3>Lỗi</h3>
        <p>Không thể tải câu hỏi: {error.message}</p>
        <button onClick={() => navigate(`/exam/${testId}`)} className="back-button">
          Quay lại
        </button>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="exam-session-container empty">
        <h3>Không có câu hỏi</h3>
        <p>Không tìm thấy câu hỏi nào cho bài thi này.</p>
        <button onClick={() => navigate(`/exam/${testId}`)} className="back-button">
          Quay lại
        </button>
      </div>
    );
  }

  const currentAnswer = answers[currentQuestion.question_id] || {};

  return (
    <div className="exam-session-container">
      {/* Header */}
      <div className="exam-session-header">
        <button onClick={() => navigate(`/exam/${testId}`)} className="back-button">
          ← Quay lại
        </button>
        <h1>Làm bài thi</h1>
        <div className="timer">
          Thời gian còn lại: <strong>{formatTime(remainingTime)}</strong>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          ></div>
        </div>
        <div className="progress-text">
          Câu {currentQuestionIndex + 1} / {totalQuestions}
        </div>
      </div>

      {/* Question Navigation */}
      <div className="question-navigation">
        <button 
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
          className="nav-button prev"
        >
          ← Câu trước
        </button>
        
        <div className="question-grid">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => handleGoToQuestion(index)}
              className={`question-number ${index === currentQuestionIndex ? 'active' : ''} ${
                answers[questions[index].question_id] ? 'answered' : ''
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <button 
          onClick={handleNextQuestion}
          disabled={currentQuestionIndex === totalQuestions - 1}
          className="nav-button next"
        >
          Câu sau →
        </button>
      </div>

      {/* Question Content */}
      <div className="question-content">
        <div className="question-header">
          <h3>Câu {currentQuestionIndex + 1}</h3>
          <span className="question-type">{currentQuestion.question_type.toUpperCase()}</span>
        </div>

        <div className="question-text">
          {currentQuestion.question_text}
        </div>

        {currentQuestion.media_url && (
          <div className="question-media">
            <audio controls>
              <source src={currentQuestion.media_url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {/* Answer Options */}
        <div className="answer-options">
          {currentQuestion.question_type === 'mcq' && (
            <div className="mcq-options">
              {currentQuestion.choices.map((choice) => (
                <label key={choice.choice_id} className="choice-option">
                  <input
                    type="radio"
                    name={`question_${currentQuestion.question_id}`}
                    value={choice.choice_id}
                    checked={currentAnswer.choice_id === choice.choice_id}
                    onChange={() => handleAnswerChange(currentQuestion.question_id, {
                      choice_id: choice.choice_id
                    })}
                  />
                  <span className="choice-text">{choice.choice_text}</span>
                </label>
              ))}
            </div>
          )}

          {['fill_blank', 'short_answer', 'writing'].includes(currentQuestion.question_type) && (
            <div className="text-answer">
              <textarea
                value={currentAnswer.answer_text || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.question_id, {
                  answer_text: e.target.value
                })}
                placeholder="Nhập câu trả lời của bạn..."
                rows={currentQuestion.question_type === 'writing' ? 10 : 4}
              />
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button 
          onClick={handleSaveProgress}
          className="btn btn-secondary"
          disabled={saveProgressMutation.isLoading}
        >
          {saveProgressMutation.isLoading ? 'Đang lưu...' : 'Lưu tiến độ'}
        </button>

        <button 
          onClick={() => handleSubmitExam(false)}
          className="btn btn-primary"
          disabled={submitSessionMutation.isLoading || isSubmitting}
        >
          {submitSessionMutation.isLoading || isSubmitting ? 'Đang nộp...' : 'Nộp bài'}
        </button>
      </div>
    </div>
  );
};

export default ExamSession;


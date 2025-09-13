// Exam Result Page - Hiển thị kết quả thi
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./ExamResult.css";

const ExamResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock result data
    const mockResult = {
      examId: parseInt(id),
      examTitle: "TOEIC Practice Test 001",
      examType: "toeic",
      totalScore: 750,
      maxScore: 990,
      bandScore: null, // For IELTS
      percentage: 75.8,
      timeSpent: 115, // minutes
      totalTime: 120,
      completedAt: "2024-01-15T14:30:00Z",
      sections: [
        {
          name: "Listening",
          score: 380,
          maxScore: 495,
          percentage: 76.8,
          correctAnswers: 76,
          totalQuestions: 100,
          timeSpent: 45
        },
        {
          name: "Reading",
          score: 370,
          maxScore: 495,
          percentage: 74.7,
          correctAnswers: 74,
          totalQuestions: 100,
          timeSpent: 70
        }
      ],
      detailedResults: [
        {
          section: "Listening",
          parts: [
            { name: "Part 1: Photos", correct: 5, total: 6, percentage: 83.3 },
            { name: "Part 2: Question-Response", correct: 20, total: 25, percentage: 80.0 },
            { name: "Part 3: Conversations", correct: 31, total: 39, percentage: 79.5 },
            { name: "Part 4: Talks", correct: 20, total: 30, percentage: 66.7 }
          ]
        },
        {
          section: "Reading",
          parts: [
            { name: "Part 5: Incomplete Sentences", correct: 24, total: 30, percentage: 80.0 },
            { name: "Part 6: Text Completion", correct: 12, total: 16, percentage: 75.0 },
            { name: "Part 7: Reading Comprehension", correct: 38, total: 54, percentage: 70.4 }
          ]
        }
      ],
      strengths: [
        "Strong performance in Listening Part 1 (Photos)",
        "Good understanding of grammar in Reading Part 5",
        "Consistent accuracy across all sections"
      ],
      weaknesses: [
        "Need improvement in Listening Part 4 (Talks)",
        "Reading comprehension could be faster",
        "Focus on vocabulary building"
      ],
      recommendations: [
        "Practice listening to longer talks and lectures",
        "Read more academic texts to improve comprehension speed",
        "Review grammar rules for incomplete sentences",
        "Take more practice tests to build confidence"
      ],
      isPassed: true,
      previousAttempts: [
        { date: "2024-01-10", score: 680, percentage: 68.7 },
        { date: "2024-01-05", score: 620, percentage: 62.6 }
      ]
    };

    setResult(mockResult);
    setLoading(false);
  }, [id]);

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return "#10B981";
    if (percentage >= 60) return "#F59E0B";
    return "#EF4444";
  };

  const getScoreLabel = (percentage) => {
    if (percentage >= 90) return "Excellent";
    if (percentage >= 80) return "Good";
    if (percentage >= 70) return "Satisfactory";
    if (percentage >= 60) return "Needs Improvement";
    return "Poor";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <div className="exam-result-loading">
        <div className="loading-spinner"></div>
        <p>Calculating your results...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="exam-result-error">
        <h2>Result not found</h2>
        <p>Unable to load your exam results.</p>
        <Link to="/exam" className="btn-primary">Back to Exams</Link>
      </div>
    );
  }

  return (
    <div className="exam-result">
      <div className="exam-result__container">
        {/* Header - Study4 Style */}
        <div className="exam-result__header">
          <div className="result-breadcrumb">
            <Link to="/exam" className="breadcrumb-link">Practice Tests</Link>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{result.examTitle}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Results</span>
          </div>
          
          <div className="result-title">
            <h1>Exam Results</h1>
            <p className="exam-name">{result.examTitle}</p>
            <p className="completion-date">Completed on {formatDate(result.completedAt)}</p>
          </div>
          
          <div className="result-actions">
            <Link to="/exam" className="btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5m7-7l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to Tests
            </Link>
            <Link to={`/exam/${id}`} className="btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 12a9 9 0 0118 0 9 9 0 01-18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8v8m-4-4h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Retake Test
            </Link>
          </div>
        </div>

        {/* Overall Score */}
        <div className="exam-result__overview">
          <div className="score-card">
            <div className="score-main">
              <div className="score-value" style={{ color: getScoreColor(result.percentage) }}>
                {result.totalScore}
              </div>
              <div className="score-max">/ {result.maxScore}</div>
            </div>
            <div className="score-details">
              <div className="score-percentage" style={{ color: getScoreColor(result.percentage) }}>
                {result.percentage}%
              </div>
              <div className="score-label">{getScoreLabel(result.percentage)}</div>
            </div>
            <div className="score-status">
              {result.isPassed ? (
                <div className="status-passed">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Passed
                </div>
              ) : (
                <div className="status-failed">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Failed
                </div>
              )}
            </div>
          </div>

          <div className="time-info">
            <div className="time-item">
              <span className="time-label">Time Spent:</span>
              <span className="time-value">{formatTime(result.timeSpent)}</span>
            </div>
            <div className="time-item">
              <span className="time-label">Total Time:</span>
              <span className="time-value">{formatTime(result.totalTime)}</span>
            </div>
            <div className="time-item">
              <span className="time-label">Efficiency:</span>
              <span className="time-value">
                {Math.round((result.timeSpent / result.totalTime) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Section Scores */}
        <div className="exam-result__sections">
          <h2>Section Breakdown</h2>
          <div className="sections-grid">
            {result.sections.map((section, index) => (
              <div key={index} className="section-card">
                <div className="section-header">
                  <h3>{section.name}</h3>
                  <div className="section-score" style={{ color: getScoreColor(section.percentage) }}>
                    {section.score}/{section.maxScore}
                  </div>
                </div>
                <div className="section-details">
                  <div className="detail-item">
                    <span>Correct Answers:</span>
                    <span>{section.correctAnswers}/{section.totalQuestions}</span>
                  </div>
                  <div className="detail-item">
                    <span>Percentage:</span>
                    <span style={{ color: getScoreColor(section.percentage) }}>
                      {section.percentage}%
                    </span>
                  </div>
                  <div className="detail-item">
                    <span>Time Spent:</span>
                    <span>{formatTime(section.timeSpent)}</span>
                  </div>
                </div>
                <div className="section-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${section.percentage}%`,
                        backgroundColor: getScoreColor(section.percentage)
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Results */}
        <div className="exam-result__detailed">
          <h2>Detailed Performance</h2>
          {result.detailedResults.map((section, sectionIndex) => (
            <div key={sectionIndex} className="detailed-section">
              <h3>{section.section}</h3>
              <div className="parts-grid">
                {section.parts.map((part, partIndex) => (
                  <div key={partIndex} className="part-card">
                    <div className="part-header">
                      <span className="part-name">{part.name}</span>
                      <span 
                        className="part-percentage"
                        style={{ color: getScoreColor(part.percentage) }}
                      >
                        {part.percentage}%
                      </span>
                    </div>
                    <div className="part-stats">
                      <span>{part.correct}/{part.total} correct</span>
                    </div>
                    <div className="part-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ 
                            width: `${part.percentage}%`,
                            backgroundColor: getScoreColor(part.percentage)
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Analysis */}
        <div className="exam-result__analysis">
          <div className="analysis-grid">
            <div className="analysis-card strengths">
              <h3>Strengths</h3>
              <ul>
                {result.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
            
            <div className="analysis-card weaknesses">
              <h3>Areas for Improvement</h3>
              <ul>
                {result.weaknesses.map((weakness, index) => (
                  <li key={index}>{weakness}</li>
                ))}
              </ul>
            </div>
            
            <div className="analysis-card recommendations">
              <h3>Recommendations</h3>
              <ul>
                {result.recommendations.map((recommendation, index) => (
                  <li key={index}>{recommendation}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Previous Attempts */}
        {result.previousAttempts.length > 0 && (
          <div className="exam-result__history">
            <h2>Previous Attempts</h2>
            <div className="history-chart">
              {result.previousAttempts.map((attempt, index) => (
                <div key={index} className="history-item">
                  <div className="history-date">{formatDate(attempt.date)}</div>
                  <div className="history-score">
                    <span className="score">{attempt.score}</span>
                    <span className="percentage">({attempt.percentage}%)</span>
                  </div>
                  <div className="history-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${attempt.percentage}%`,
                          backgroundColor: getScoreColor(attempt.percentage)
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamResult;

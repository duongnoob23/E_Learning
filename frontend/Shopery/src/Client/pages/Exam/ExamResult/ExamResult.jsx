// Exam Result Page - Hiển thị kết quả thi
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSessionResult } from "../../../hooks/Exam/useExamQueries";
import "./ExamResult.css";

const ExamResult = () => {
  const { id, userTestId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const { data: apiResult, isLoading } = useSessionResult(userTestId);

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
      return;
    }
    if (apiResult && apiResult.EC === '0') {
      const dt = apiResult.DT || {};
      const total = dt.total_questions || 0;
      const correct = dt.correct_answers || 0;
      setResult({
        examId: parseInt(id),
        examTitle: dt.test_title || 'Kết quả bài thi',
        percentage: total > 0 ? Math.round((correct / total) * 1000) / 10 : 0,
        totalScore: correct,
        maxScore: total,
        completedAt: dt.finished_at || new Date().toISOString(),
        detailedAnswers: dt.answers || []
      });
      setLoading(false);
    } else {
      setResult(null);
      setLoading(false);
    }
  }, [apiResult, isLoading, id]);

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
            {/* Simple pass/fail can be added later if business rules exist */}
          </div>
          {/* Time info not available in current schema; omit for now */}
        </div>
        {/* Minimal result view per current data: correct/total and percentage */}
      </div>
    </div>
  );
};

export default ExamResult;

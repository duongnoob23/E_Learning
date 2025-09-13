// Exam Stats Page - Thống kê tổng quan
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ExamStats.css";

const ExamStats = () => {
  const [stats, setStats] = useState(null);
  const [recentTests, setRecentTests] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // 5 items per page for recent tests

  useEffect(() => {
    // Mock data cho thống kê
    const mockStats = {
      totalTests: 12,
      completedTests: 8,
      averageScore: 78.5,
      totalTimeSpent: 1440, // minutes
      currentStreak: 5,
      bestScore: 95,
      improvement: 12.3,
      sections: {
        listening: { average: 82, total: 4 },
        reading: { average: 75, total: 4 },
        writing: { average: 70, total: 2 },
        speaking: { average: 68, total: 2 }
      },
      testTypes: {
        toeic: { count: 6, average: 80 },
        ielts: { count: 4, average: 7.2 },
        toefl: { count: 2, average: 85 }
      }
    };

    const mockRecentTests = [
      {
        id: 1,
        title: "TOEIC Practice Test 001",
        type: "toeic",
        score: 750,
        maxScore: 990,
        completedAt: "2024-01-15T14:30:00Z",
        duration: 115,
        status: "completed"
      },
      {
        id: 2,
        title: "IELTS Academic Practice Test 001",
        type: "ielts",
        score: 7.5,
        maxScore: 9,
        completedAt: "2024-01-12T10:15:00Z",
        duration: 160,
        status: "completed"
      },
      {
        id: 3,
        title: "TOEIC Practice Test 002",
        type: "toeic",
        score: null,
        maxScore: 990,
        completedAt: null,
        duration: 0,
        status: "in_progress"
      }
    ];

    const mockPerformanceData = [
      { date: "2024-01-01", score: 65, testType: "toeic" },
      { date: "2024-01-05", score: 70, testType: "toeic" },
      { date: "2024-01-08", score: 7.0, testType: "ielts" },
      { date: "2024-01-12", score: 7.5, testType: "ielts" },
      { date: "2024-01-15", score: 75, testType: "toeic" }
    ];

    setStats(mockStats);
    setRecentTests(mockRecentTests);
    setPerformanceData(mockPerformanceData);
    setLoading(false);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getScoreColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "#10B981";
    if (percentage >= 60) return "#F59E0B";
    return "#EF4444";
  };

  // Pagination logic for recent tests
  const totalPages = Math.ceil(recentTests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTests = recentTests.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="exam-stats-loading">
        <div className="loading-spinner"></div>
        <p>Loading statistics...</p>
      </div>
    );
  }

  return (
    <div className="exam-stats">
      <div className="exam-stats__container">
        {/* Header */}
        <div className="exam-stats__header">
          <h1>Exam Statistics</h1>
          <p>Track your progress and performance</p>
        </div>

        {/* Overview Cards */}
        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-content">
              <h3>Total Tests</h3>
              <div className="stat-value">{stats.totalTests}</div>
              <div className="stat-subtitle">Available tests</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-content">
              <h3>Completed</h3>
              <div className="stat-value">{stats.completedTests}</div>
              <div className="stat-subtitle">Tests finished</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-content">
              <h3>Average Score</h3>
              <div className="stat-value">{stats.averageScore}%</div>
              <div className="stat-subtitle">+{stats.improvement}% from last month</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-content">
              <h3>Time Spent</h3>
              <div className="stat-value">{formatTime(stats.totalTimeSpent)}</div>
              <div className="stat-subtitle">Total study time</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-content">
              <h3>Current Streak</h3>
              <div className="stat-value">{stats.currentStreak}</div>
              <div className="stat-subtitle">Days in a row</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="stat-content">
              <h3>Best Score</h3>
              <div className="stat-value">{stats.bestScore}%</div>
              <div className="stat-subtitle">Personal best</div>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="performance-section">
          <h2>Performance Trend</h2>
          <div className="performance-chart">
            <div className="chart-container">
              <div className="chart-bars">
                {performanceData.map((data, index) => (
                  <div key={index} className="chart-bar">
                    <div 
                      className="bar-fill"
                      style={{ 
                        height: `${(data.score / 100) * 100}%`,
                        backgroundColor: getScoreColor(data.score, 100)
                      }}
                    ></div>
                    <div className="bar-label">{formatDate(data.date)}</div>
                    <div className="bar-value">{data.score}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section Performance */}
        <div className="section-performance">
          <h2>Section Performance</h2>
          <div className="sections-grid">
            {Object.entries(stats.sections).map(([section, data]) => (
              <div key={section} className="section-card">
                <div className="section-header">
                  <h3>{section.charAt(0).toUpperCase() + section.slice(1)}</h3>
                  <div className="section-score">{data.average}%</div>
                </div>
                <div className="section-details">
                  <div className="detail-item">
                    <span>Tests taken:</span>
                    <span>{data.total}</span>
                  </div>
                  <div className="section-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${data.average}%`,
                          backgroundColor: getScoreColor(data.average, 100)
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Test Type Performance */}
        <div className="test-type-performance">
          <h2>Test Type Performance</h2>
          <div className="test-types-grid">
            {Object.entries(stats.testTypes).map(([type, data]) => (
              <div key={type} className="test-type-card">
                <div className="type-header">
                  <h3>{type.toUpperCase()}</h3>
                  <div className="type-count">{data.count} tests</div>
                </div>
                <div className="type-score">
                  <span className="score-value">{data.average}</span>
                  <span className="score-label">Average</span>
                </div>
                <div className="type-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${(data.average / 100) * 100}%`,
                        backgroundColor: getScoreColor(data.average, 100)
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tests */}
        <div className="recent-tests">
          <div className="recent-tests__header">
            <h2>Recent Tests</h2>
            <Link to="/exam" className="view-all-btn">View All</Link>
          </div>
          <div className="recent-tests__list">
            {currentTests.map((test) => (
              <div key={test.id} className="recent-test-item">
                <div className="test-info">
                  <h4>{test.title}</h4>
                  <div className="test-meta">
                    <span className="test-type">{test.type.toUpperCase()}</span>
                    <span className="test-date">
                      {test.completedAt ? formatDate(test.completedAt) : 'In Progress'}
                    </span>
                  </div>
                </div>
                <div className="test-score">
                  {test.score ? (
                    <div className="score-display">
                      <span 
                        className="score-value"
                        style={{ color: getScoreColor(test.score, test.maxScore) }}
                      >
                        {test.score}
                      </span>
                      <span className="score-max">/{test.maxScore}</span>
                    </div>
                  ) : (
                    <div className="in-progress">
                      <div className="progress-dot"></div>
                      <span>In Progress</span>
                    </div>
                  )}
                </div>
                <div className="test-actions">
                  {test.status === 'completed' ? (
                    <Link to={`/exam/${test.id}/result`} className="btn-view-result">
                      View Result
                    </Link>
                  ) : (
                    <Link to={`/exam/${test.id}/take`} className="btn-continue">
                      Continue
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination for Recent Tests */}
          {totalPages > 1 && (
            <div className="pagination">
              <div className="pagination__info">
                Showing {startIndex + 1}-{Math.min(endIndex, recentTests.length)} of {recentTests.length} tests
              </div>
              <div className="pagination__controls">
                <button
                  className="pagination__btn pagination__btn--prev"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Previous
                </button>
                
                <div className="pagination__numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`pagination__number ${currentPage === page ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  className="pagination__btn pagination__btn--next"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamStats;

// Exam List Page - Study4 Style with integrated stats
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ExamStats from "../ExamStats/ExamStats";
import "./ExamList.css";

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [availableTags, setAvailableTags] = useState([]);
  const [activeTab, setActiveTab] = useState("tests"); // "tests" or "stats"
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // 6 items per page

  // Fake data cho các bài thi
  useEffect(() => {
    const mockExams = [
      {
        id: 1,
        title: "TOEIC Practice Test 001",
        type: "toeic",
        duration: 120,
        sections: ["Listening", "Reading"],
        difficulty: "Intermediate",
        questions: 200,
        description: "Complete TOEIC practice test with listening and reading sections",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        tags: ["TOEIC", "Practice", "Vocabulary", "Grammar"],
        isCompleted: false,
        bestScore: null,
        attempts: 0,
      },
      {
        id: 2,
        title: "IELTS Academic Practice Test 001",
        type: "ielts",
        duration: 165,
        sections: ["Listening", "Reading", "Writing", "Speaking"],
        difficulty: "Advanced",
        questions: 80,
        description: "Full IELTS Academic test covering all four skills",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        tags: ["IELTS", "Academic", "Grammar", "Writing"],
        isCompleted: true,
        bestScore: 7.5,
        attempts: 3,
      },
      {
        id: 3,
        title: "TOEFL iBT Practice Test 001",
        type: "toefl",
        duration: 180,
        sections: ["Reading", "Listening", "Speaking", "Writing"],
        difficulty: "Advanced",
        questions: 120,
        description: "Complete TOEFL iBT practice test for university admission",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        tags: ["TOEFL", "iBT", "University", "Speaking"],
        isCompleted: false,
        bestScore: null,
        attempts: 0,
      },
      {
        id: 4,
        title: "TOEIC Practice Test 002",
        type: "toeic",
        duration: 120,
        sections: ["Listening", "Reading"],
        difficulty: "Beginner",
        questions: 200,
        description: "Beginner-friendly TOEIC practice test",
        image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        tags: ["TOEIC", "Beginner", "Practice", "Listening"],
        isCompleted: true,
        bestScore: 650,
        attempts: 1,
      },
    ];

    setExams(mockExams);
    setFilteredExams(mockExams);
    
    // Extract unique tags
    const allTags = [...new Set(mockExams.flatMap(exam => exam.tags))];
    setAvailableTags(allTags);
  }, []);

  // Filter exams based on type, tag and search term
  useEffect(() => {
    let filtered = exams;

    if (selectedType !== "all") {
      filtered = filtered.filter(exam => exam.type === selectedType);
    }

    if (selectedTag !== "all") {
      filtered = filtered.filter(exam => exam.tags.includes(selectedTag));
    }

    if (searchTerm) {
      filtered = filtered.filter(exam =>
        exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredExams(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [exams, selectedType, selectedTag, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExams = filteredExams.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "toeic": return "#ffffff";
      case "ielts": return "#059669";
      case "toefl": return "#DC2626";
      default: return "#6B7280";
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner": return "#10B981";
      case "Intermediate": return "#F59E0B";
      case "Advanced": return "#EF4444";
      default: return "#6B7280";
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="exam-list">
      <div className="exam-list__container">
        {/* Header */}
        <div className="exam-list__header">
          <h1 className="exam-list__title">Practice Tests</h1>
          <p className="exam-list__subtitle">
            Master English with AI-powered practice tests and personalized learning
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="exam-list__tabs">
          <button 
            className={`tab-btn ${activeTab === "tests" ? "active" : ""}`}
            onClick={() => setActiveTab("tests")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Practice Tests
          </button>
          <button 
            className={`tab-btn ${activeTab === "stats" ? "active" : ""}`}
            onClick={() => setActiveTab("stats")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 3v18h18M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            My Statistics
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === "stats" ? (
          <ExamStats />
        ) : (
          <>

        {/* Filters */}
        <div className="exam-list__filters">
          <div className="exam-list__search">
            <div className="search-input">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="exam-list__filters-row">
            <div className="exam-list__type-filter">
              <button
                className={`filter-btn ${selectedType === "all" ? "active" : ""}`}
                onClick={() => setSelectedType("all")}
              >
                All Tests
              </button>
              <button
                className={`filter-btn ${selectedType === "toeic" ? "active" : ""}`}
                onClick={() => setSelectedType("toeic")}
              >
                TOEIC
              </button>
              <button
                className={`filter-btn ${selectedType === "ielts" ? "active" : ""}`}
                onClick={() => setSelectedType("ielts")}
              >
                IELTS
              </button>
              <button
                className={`filter-btn ${selectedType === "toefl" ? "active" : ""}`}
                onClick={() => setSelectedType("toefl")}
              >
                TOEFL
              </button>
            </div>

            <div className="exam-list__tag-filter">
              <button
                className={`filter-btn ${selectedTag === "all" ? "active" : ""}`}
                onClick={() => setSelectedTag("all")}
              >
                All Tags
              </button>
              {availableTags.map(tag => (
                <button
                  key={tag}
                  className={`filter-btn ${selectedTag === tag ? "active" : ""}`}
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Exam Grid */}
        <div className="exam-list__grid">
          {currentExams.map((exam) => (
            <div key={exam.id} className="exam-card">
              <div className="exam-card__image">
                <img src={exam.image} alt={exam.title} />
                <div className="exam-card__type" style={{ backgroundColor: getTypeColor(exam.type) }}>
                  {exam.type.toUpperCase()}
                </div>
                {exam.isCompleted && (
                  <div className="exam-card__completed">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>

              <div className="exam-card__content">
                <h3 className="exam-card__title">{exam.title}</h3>
                <p className="exam-card__description">{exam.description}</p>

                <div className="exam-card__info">
                  <div className="info-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{formatDuration(exam.duration)}</span>
                  </div>
                  <div className="info-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{exam.questions} questions</span>
                  </div>
                  <div className="info-item">
                    <span 
                      className="difficulty-badge"
                      style={{ backgroundColor: getDifficultyColor(exam.difficulty) }}
                    >
                      {exam.difficulty}
                    </span>
                  </div>
                </div>

                <div className="exam-card__sections">
                  {exam.sections.map((section, index) => (
                    <span key={index} className="section-tag">
                      {section}
                    </span>
                  ))}
                </div>

                {exam.isCompleted && exam.bestScore && (
                  <div className="exam-card__score">
                    <span className="score-label">Best Score:</span>
                    <span className="score-value">{exam.bestScore}</span>
                    <span className="attempts">({exam.attempts} attempts)</span>
                  </div>
                )}

                <div className="exam-card__actions">
                  <Link 
                    to={`/exam/${exam.id}`} 
                    className="exam-card__btn exam-card__btn--primary"
                  >
                    {exam.isCompleted ? "Retake Test" : "Start Test"}
                  </Link>
                  <Link 
                    to={`/exam/${exam.id}/detail`} 
                    className="exam-card__btn exam-card__btn--secondary"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {currentExams.length === 0 && (
          <div className="exam-list__empty">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3>No tests found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <div className="pagination__info">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredExams.length)} of {filteredExams.length} tests
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
          </>
        )}
      </div>
    </div>
  );
};

export default ExamList;

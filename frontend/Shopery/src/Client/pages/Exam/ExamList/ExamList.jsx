// Exam List Page - Study4 Style with integrated stats
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ExamStats from "../ExamStats/ExamStats";
import { useTests, useTags } from "../../../hooks/Exam/useExamQueries";
import "./ExamList.css";

const ExamList = () => {
  const [selectedType, setSelectedType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("tests"); // "tests" or "stats"
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // 6 items per page

  // API calls
  const { data: testsData, isLoading: testsLoading, error: testsError } = useTests({
    page: currentPage,
    limit: itemsPerPage,
    test_type: selectedType !== "all" ? selectedType : undefined,
    search: searchTerm || undefined
  });

  const { data: tagsData, isLoading: tagsLoading } = useTags();

  // Extract data from API responses
  const exams = testsData?.DT?.tests || [];
  const availableTags = tagsData?.DT || [];
  const totalPages = testsData?.DT?.totalPages || 1;

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedType, searchTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
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
          </div>
        </div>

        {/* Loading State */}
        {testsLoading && (
          <div className="exam-list__loading">
            <div className="loading-spinner"></div>
            <p>Đang tải danh sách bài kiểm tra...</p>
          </div>
        )}

        {/* Error State */}
        {testsError && (
          <div className="exam-list__error">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3>Có lỗi xảy ra</h3>
            <p>Không thể tải danh sách bài kiểm tra. Vui lòng thử lại sau.</p>
          </div>
        )}

        {/* Exam Grid */}
        {!testsLoading && !testsError && (
          <div className="exam-list__grid">
            {exams.map((exam) => (
              <div key={exam.test_id} className="exam-card">
                <div className="exam-card__content">
                  <div className="exam-card__header">
                    <h3 className="exam-card__title">{exam.title}</h3>
                    <div className="exam-card__type" style={{ backgroundColor: getTypeColor(exam.test_type) }}>
                      {exam.test_type?.toUpperCase()}
                    </div>
                  </div>
                  <p className="exam-card__description">
                    Bài kiểm tra {exam.test_type} với thời lượng {exam.duration} phút
                  </p>

                  <div className="exam-card__info">
                    <div className="info-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>{formatDuration(exam.duration)}</span>
                    </div>
                    <div className="info-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 12h10l-2-12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>{exam.test_type}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {exam.tags && exam.tags.length > 0 && (
                    <div className="exam-card__sections">
                      {exam.tags.map((tag, index) => (
                        <span key={index} className="section-tag">
                          {tag.tag_name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="exam-card__actions">
                    <Link 
                      to={`/exam/${exam.test_id}/detail`} 
                      className="exam-card__btn exam-card__btn--secondary"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!testsLoading && !testsError && exams.length === 0 && (
          <div className="exam-list__empty">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3>Không tìm thấy bài kiểm tra</h3>
            <p>Thử điều chỉnh tiêu chí tìm kiếm hoặc bộ lọc của bạn</p>
          </div>
        )}

        {/* Pagination */}
        {!testsLoading && !testsError && totalPages > 1 && (
          <div className="pagination">
            <div className="pagination__info">
              Hiển thị {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, testsData?.DT?.total || 0)} trong {testsData?.DT?.total || 0} bài kiểm tra
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

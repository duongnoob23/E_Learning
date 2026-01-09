import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mapCourseData } from "../../../utils/dataMapper";
import { useCourses } from "../../services/Course/courseQueries";
import "./Course.css";

function Course() {
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");

  const navigate = useNavigate();

  const filters = useMemo(() => {
    const itemsPerPage = view === "grid" ? 6 : 4;

    const apiFilters = {
      page: currentPage,
      limit: itemsPerPage,
      sort_by: sortBy,
    };

    if (search.trim()) {
      apiFilters.title = search.trim();
    }

    return apiFilters;
  }, [search, currentPage, sortBy, view]);

  const {
    data: coursesData,
    isLoading: coursesLoading,
    error: coursesError,
    refetch: refetchCourses,
  } = useCourses(filters);

  const courses = useMemo(() => {
    if (!coursesData?.DT?.courses) return [];
    return coursesData.DT.courses.map(mapCourseData);
  }, [coursesData]);

  const pagination = useMemo(() => {
    return (
      coursesData?.DT?.pagination || {
        current_page: 1,
        total_pages: 1,
        total_items: 0,
        items_per_page: 12,
      }
    );
  }, [coursesData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== "") {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, view]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  if (coursesLoading) {
    return (
      <div className="course-container">
        <div className="course-page">
          <div className="course-header">
            <h2>Toàn bộ khóa học</h2>
            <div className="course-search">
              <input
                type="text"
                placeholder="Search course name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled
              />
              <i className="fa fa-search icon-search"></i>
            </div>
            <div className="course-view-toggle">
              <button
                className={view === "list" ? "active" : ""}
                onClick={() => setView("list")}
                aria-label="List view"
              >
                <i className="fa fa-list"></i>
              </button>
              <button
                className={view === "grid" ? "active" : ""}
                onClick={() => setView("grid")}
                aria-label="Grid view"
              >
                <i className="fa fa-th-large"></i>
              </button>
            </div>
          </div>
          <div className="course-main">
            <section className={`course-list ${view}`}>
              <div className="loading-courses">
                <div className="loading-spinner">
                  <i className="fa fa-spinner fa-spin"></i>
                </div>
                <p>Đang tải khóa học...</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  if (coursesError) {
    return (
      <div className="course-container">
        <div className="course-page">
          <div className="course-header">
            <h2>Toàn bộ khóa học</h2>
            <div className="course-search">
              <input
                type="text"
                placeholder="Search course name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <i className="fa fa-search icon-search"></i>
            </div>
            <div className="course-view-toggle">
              <button
                className={view === "list" ? "active" : ""}
                onClick={() => setView("list")}
                aria-label="List view"
              >
                <i className="fa fa-list"></i>
              </button>
              <button
                className={view === "grid" ? "active" : ""}
                onClick={() => setView("grid")}
                aria-label="Grid view"
              >
                <i className="fa fa-th-large"></i>
              </button>
            </div>
          </div>
          <div className="course-main">
            <section className={`course-list ${view}`}>
              <div className="error-courses">
                <div className="error-icon">
                  <i className="fa fa-exclamation-circle"></i>
                </div>
                <h3>Có lỗi xảy ra khi tải khóa học</h3>
                <p>
                  Vui lòng thử lại sau hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp
                  tục.
                </p>
                <button onClick={() => refetchCourses()} className="btn-retry">
                  <i className="fa fa-refresh"></i> Thử lại
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="course-container">
      <div className="course-header-section">
        <div className="course-header-wrapper">
          <div className="course-header-title-row">
            <h1 className="course-header-title">All Courses</h1>
            <div className="course-header-badge">
              <span>{pagination.total_items || 0} Courses</span>
            </div>
          </div>

          <div className="course-header-controls">
            <div className="course-view-toggle">
              <button
                className={view === "grid" ? "active" : ""}
                onClick={() => setView("grid")}
                aria-label="Grid view"
              >
                <i className="fa fa-th-large"></i>
                Grid
              </button>
              <button
                className={view === "list" ? "active" : ""}
                onClick={() => setView("list")}
                aria-label="List view"
              >
                <i className="fa fa-list"></i>
                List
              </button>
            </div>
            {/* <div className="course-results-info">
              Showing{" "}
              {courses.length > 0
                ? (currentPage - 1) * pagination.items_per_page + 1
                : 0}
              –
              {Math.min(
                currentPage * pagination.items_per_page,
                pagination.total_items
              )}{" "}
              of {pagination.total_items} results
            </div> */}
            <div className="course-sort-wrapper">
              <label htmlFor="sort-select" className="sort-label">
                Sort by:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="sort-select"
              >
                <option value="newest">Newest</option>
                <option value="popular">Popularity</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="course-page">
        <div className="course-main course-main--no-filter">
          <div className="course-search-bar">
            <input
              type="text"
              placeholder="Search Courses"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="course-search-input"
            />
            <i className="fa fa-search course-search-icon"></i>
          </div>

          <section className={`course-list ${view}`}>
            {courses.length === 0 && !coursesLoading && (
              <div className="no-course">
                <div className="no-course-icon">
                  <i className="fa fa-search"></i>
                </div>
                <h3>Không tìm thấy khóa học phù hợp</h3>
                <p>Hãy thử thay đổi từ khóa tìm kiếm</p>
              </div>
            )}

            {courses.map((course) => (
              <div className="course-card" key={course.id}>
                <div className="course-card-img">
                  <img
                    src={
                      course.image ||
                      "https://via.placeholder.com/400x225/9b87f5/ffffff?text=Course+Image"
                    }
                    alt={course.title}
                    className="course-card-thumbnail"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x225/9b87f5/ffffff?text=Course+Image";
                    }}
                  />
                  <div className="course-card-badges">
                    <div className="course-badge">
                      <i className="fa fa-book"></i>
                      <span>{course.lessons || 12} Class</span>
                    </div>
                    <div className="course-badge">
                      <i className="fa fa-video-camera"></i>
                      <span>
                        {course.lessons ? course.lessons * 2 : 25} Videos
                      </span>
                    </div>
                    <div className="course-badge">
                      <i className="fa fa-users"></i>
                      <span>{course.students || 50} Enroll Students</span>
                    </div>
                  </div>
                  {course.discount > 0 && (
                    <div className="course-card-discount-badge">
                      -{course.discount}% Off
                    </div>
                  )}
                  <button className="course-card-bookmark">
                    <i className="fa fa-bookmark-o"></i>
                  </button>
                </div>
                <div className="course-card-content">
                  {course.reviews > 0 && (
                    <div className="course-card-rating">
                      <span className="stars">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className="fa fa-star"
                            style={{
                              color:
                                i < Math.round(course.rating)
                                  ? "#FBBF24"
                                  : "#E5E7EB",
                            }}
                          ></i>
                        ))}
                      </span>
                      <span className="reviews">
                        ({course.reviews.toLocaleString()} Reviews)
                      </span>
                    </div>
                  )}
                  {course.reviews === 0 && (
                    <div className="course-card-rating">
                      <span className="reviews">(0 Reviews)</span>
                    </div>
                  )}
                  <h3 className="course-card-title">{course.title}</h3>
                  <div className="course-card-stats">
                    <span className="course-stat-item">
                      <i className="fa fa-book"></i>
                      {course.lessons || 12} Lessons
                    </span>
                    <span className="course-stat-item">
                      <i className="fa fa-users"></i>
                      {course.students || 50} Students
                    </span>
                  </div>
                  <div className="course-card-desc">{course.desc}</div>
                  <div className="course-card-footer">
                    <div className="course-card-price">
                      {course.isFree ? (
                        <>
                          <span className="price">Free</span>
                          {course.oldPrice > 0 && (
                            <span className="old-price">
                              ${course.oldPrice.toFixed(2)}
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          <span className="price">
                            {course.price.toFixed(2)} đ
                          </span>
                          {course.oldPrice > course.price && (
                            <span className="old-price">
                              {course.oldPrice.toFixed(2)} đ
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => navigate(`/course/${course.id}`)}
                      className="btn-course-action"
                    >
                      Learn More <i className="fa fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>

        {pagination.total_pages > 1 && (
          <div className="course-pagination">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <i className="fa fa-chevron-left"></i> Trước
            </button>

            <div className="pagination-numbers">
              {Array.from(
                { length: Math.min(5, pagination.total_pages) },
                (_, i) => {
                  let pageNumber;
                  if (pagination.total_pages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= pagination.total_pages - 2) {
                    pageNumber = pagination.total_pages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNumber}
                      className={pageNumber === currentPage ? "active" : ""}
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  );
                }
              )}
            </div>

            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.total_pages}
            >
              Sau <i className="fa fa-chevron-right"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Course;

// frontend/Shopery/src/Client/pages/Course/Course.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mapCourseData } from "../../../utils/dataMapper";
import {
  useCategories,
  useCourses,
  useInstructors,
  useLevels,
} from "../../services/Course/courseQueries";
import "./Course.css";

// Màu xanh chủ đạo
const PRIMARY_COLOR = "#1ec28b";

const reviewOptions = [5, 4, 3, 2, 1];

function Course() {
  // State filter
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedInstructors, setSelectedInstructors] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [selectedReview, setSelectedReview] = useState([]);
  const [showReview, setShowReview] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");

  const navigate = useNavigate();

  // Build filters object for API
  const filters = useMemo(() => {
    const apiFilters = {
      page: currentPage,
      limit: 12,
      sort_by: sortBy,
    };

    // Search
    if (search.trim()) {
      apiFilters.title = search.trim();
    }

    // Categories
    if (selectedCategories.length > 0) {
      apiFilters.category = selectedCategories.join(",");
    }

    // Instructors
    if (selectedInstructors.length > 0) {
      apiFilters.instructor = selectedInstructors.join(",");
    }

    // Levels
    if (selectedLevels.length > 0) {
      apiFilters.level = selectedLevels.join(",");
    }

    // Price
    if (selectedPrice === "free") {
      apiFilters.price_type = "free";
    } else if (selectedPrice === "paid") {
      apiFilters.price_type = "paid";
    }

    // Rating
    if (selectedReview.length > 0) {
      apiFilters.rating = Math.min(...selectedReview);
    }

    return apiFilters;
  }, [
    search,
    selectedCategories,
    selectedInstructors,
    selectedLevels,
    selectedPrice,
    selectedReview,
    currentPage,
    sortBy,
  ]);

  // Gọi các API trực tiếp
  const {
    data: coursesData,
    isLoading: coursesLoading,
    error: coursesError,
    refetch: refetchCourses,
    isFetching: coursesFetching,
  } = useCourses(filters);

  const { data: categoriesData, isLoading: categoriesLoading } =
    useCategories();

  const { data: instructorsData, isLoading: instructorsLoading } =
    useInstructors();

  const { data: levelsData, isLoading: levelsLoading } = useLevels();

  // Map dữ liệu từ API
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

  // Map filter options từ API
  const filterOptions = useMemo(() => {
    const categories = categoriesData?.DT?.categories || [];
    const instructors = instructorsData?.DT?.instructors || [];
    const levels = levelsData?.DT?.levels || [];

    return {
      categories: categories.map((cat) => ({ name: cat.name, count: 0 })),
      instructors: instructors.map((inst) => ({ name: inst.name, count: 0 })),
      levels: levels.map((level) => ({ name: level.name, count: 0 })),
    };
  }, [categoriesData, instructorsData, levelsData]);

  // Debug logs
  useEffect(() => {
    console.log("=== COURSE DEBUG ===");
    console.log("Filters:", filters);
    console.log("Courses Loading:", coursesLoading);
    console.log("Courses Fetching:", coursesFetching);
    console.log("Courses Error:", coursesError);
    console.log("Courses Data:", coursesData);
    console.log("Courses:", courses);
    console.log("Categories Data:", categoriesData);
    console.log("Instructors Data:", instructorsData);
    console.log("Levels Data:", levelsData);
    console.log("===================");
  }, [
    filters,
    coursesLoading,
    coursesFetching,
    coursesError,
    coursesData,
    courses,
    categoriesData,
    instructorsData,
    levelsData,
  ]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== "") {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedCategories,
    selectedInstructors,
    selectedLevels,
    selectedPrice,
    selectedReview,
    sortBy,
  ]);

  // Xử lý chọn filter
  const handleCheckbox = (value, arr, setArr) => {
    setArr((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleReview = (star) => {
    setSelectedReview((prev) =>
      prev.includes(star) ? prev.filter((v) => v !== star) : [...prev, star]
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const clearAllFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setSelectedInstructors([]);
    setSelectedLevels([]);
    setSelectedPrice("all");
    setSelectedReview([]);
    setCurrentPage(1);
    setSortBy("newest");
  };

  // Loading state
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
            <aside className="course-filter">
              <div className="filter-group">
                <h4>Thể loại</h4>
                <div className="loading-skeleton">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="skeleton-item"></div>
                  ))}
                </div>
              </div>
              <div className="filter-group">
                <h4>Instructor</h4>
                <div className="loading-skeleton">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="skeleton-item"></div>
                  ))}
                </div>
              </div>
              <div className="filter-group filter-group-price">
                <h4>Giá</h4>
                <div className="loading-skeleton">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="skeleton-item"></div>
                  ))}
                </div>
              </div>
            </aside>
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

  // Error state
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
            <aside className="course-filter">
              <div className="filter-group">
                <h4>Thể loại</h4>
                <div className="error-message">
                  <i className="fa fa-exclamation-triangle"></i>
                  <p>Không thể tải dữ liệu filter</p>
                </div>
              </div>
            </aside>
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

        {/* Sort and Filter Controls */}
        <div className="course-controls">
          <div className="course-sort">
            <label htmlFor="sort-select">Sắp xếp theo:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Mới nhất</option>
              <option value="popular">Phổ biến</option>
              <option value="price_asc">Giá tăng dần</option>
              <option value="price_desc">Giá giảm dần</option>
              <option value="rating">Đánh giá cao</option>
            </select>
          </div>
          <div className="course-results">
            <span>
              Hiển thị {courses.length} trong {pagination.total_items} khóa học
            </span>
            {coursesFetching && (
              <span className="loading-indicator">
                <i className="fa fa-spinner fa-spin"></i> Đang tải...
              </span>
            )}
          </div>
          <button onClick={clearAllFilters} className="btn-clear-filters">
            <i className="fa fa-times"></i> Xóa bộ lọc
          </button>
        </div>

        <div className="course-main">
          <aside className="course-filter">
            <div className="filter-group">
              <h4>Thể loại</h4>
              {filterOptions.categories.length === 0 ? (
                <div className="no-options">Không có dữ liệu</div>
              ) : (
                filterOptions.categories.map((c) => (
                  <label key={c.name} className="custom-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(c.name)}
                      onChange={() =>
                        handleCheckbox(
                          c.name,
                          selectedCategories,
                          setSelectedCategories
                        )
                      }
                    />
                    <span className="checkmark"></span>
                    {c.name}
                    <span className="filter-count">{c.count}</span>
                  </label>
                ))
              )}
            </div>

            <div className="filter-group">
              <h4>Instructor</h4>
              {filterOptions.instructors.length === 0 ? (
                <div className="no-options">Không có dữ liệu</div>
              ) : (
                filterOptions.instructors.map((i) => (
                  <label key={i.name} className="custom-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedInstructors.includes(i.name)}
                      onChange={() =>
                        handleCheckbox(
                          i.name,
                          selectedInstructors,
                          setSelectedInstructors
                        )
                      }
                    />
                    <span className="checkmark"></span>
                    {i.name}
                    <span className="filter-count">{i.count}</span>
                  </label>
                ))
              )}
            </div>

            <div className="filter-group filter-group-price">
              <h4>Giá</h4>
              <label className="custom-radio">
                <input
                  type="radio"
                  name="price"
                  checked={selectedPrice === "all"}
                  onChange={() => setSelectedPrice("all")}
                />
                <span className="radiomark"></span>
                Tất cả
                <span className="filter-count">
                  {pagination.total_items || 0}
                </span>
              </label>
              <label className="custom-radio">
                <input
                  type="radio"
                  name="price"
                  checked={selectedPrice === "free"}
                  onChange={() => setSelectedPrice("free")}
                />
                <span className="radiomark"></span>
                Miễn phí
                <span className="filter-count">
                  {courses.filter((c) => c.isFree).length}
                </span>
              </label>
              <label className="custom-radio">
                <input
                  type="radio"
                  name="price"
                  checked={selectedPrice === "paid"}
                  onChange={() => setSelectedPrice("paid")}
                />
                <span className="radiomark"></span>
                Trả phí
                <span className="filter-count">
                  {courses.filter((c) => !c.isFree).length}
                </span>
              </label>
              <button
                className="btn-review"
                onClick={() => setShowReview((v) => !v)}
              >
                Xem Thêm <i className="fa fa-angle-double-right"></i>
              </button>
            </div>

            {showReview && (
              <div className="filter-group">
                <h4>Review</h4>
                {reviewOptions.map((star) => (
                  <label
                    key={star}
                    className={`custom-checkbox star-checkbox ${
                      selectedReview.includes(star) ? "checked" : ""
                    }`}
                    onClick={() => handleReview(star)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedReview.includes(star)}
                      readOnly
                    />
                    <span className="checkmark"></span>
                    {[...Array(star)].map((_, i) => (
                      <i
                        key={i}
                        className="fa fa-star"
                        style={{ color: PRIMARY_COLOR, marginRight: 2 }}
                      ></i>
                    ))}
                    <span className="filter-count">
                      {
                        courses.filter((c) => Math.round(c.rating) === star)
                          .length
                      }
                    </span>
                  </label>
                ))}
              </div>
            )}

            <div className="filter-group">
              <h4>Level</h4>
              {filterOptions.levels.length === 0 ? (
                <div className="no-options">Không có dữ liệu</div>
              ) : (
                filterOptions.levels.map((l) => (
                  <label key={l.name} className="custom-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedLevels.includes(l.name)}
                      onChange={() =>
                        handleCheckbox(
                          l.name,
                          selectedLevels,
                          setSelectedLevels
                        )
                      }
                    />
                    <span className="checkmark"></span>
                    {l.name}
                    <span className="filter-count">{l.count}</span>
                  </label>
                ))
              )}
            </div>
          </aside>

          <section className={`course-list ${view}`}>
            {courses.length === 0 && !coursesLoading && (
              <div className="no-course">
                <div className="no-course-icon">
                  <i className="fa fa-search"></i>
                </div>
                <h3>Không tìm thấy khóa học phù hợp</h3>
                <p>Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                <button onClick={clearAllFilters} className="btn-clear-filters">
                  <i className="fa fa-refresh"></i> Xóa bộ lọc
                </button>
              </div>
            )}

            {courses.map((course) => (
              <div className="course-card" key={course.id}>
                <div className="course-card-img">
                  <img src={course.image} alt={course.title} />
                  <div className="course-card-tags">
                    {course.bestSeller && (
                      <span className="tag best-seller">Best Seller</span>
                    )}
                    {course.discount > 0 && (
                      <span className="tag discount">
                        {course.discount}% OFF
                      </span>
                    )}
                    {course.isFree && <span className="tag free">Free</span>}
                  </div>
                </div>
                <div className="course-card-content">
                  <div className="course-card-meta">
                    <span className="course-card-instructor">
                      <i className="fa fa-user"></i> {course.instructor}
                    </span>
                    <span className="course-card-duration">
                      <i className="fa fa-clock"></i> {course.duration}
                    </span>
                    <span className="course-card-students">
                      <i className="fa fa-users"></i> {course.students} HV
                    </span>
                  </div>
                  <h3>{course.title}</h3>
                  <div className="course-card-desc">{course.desc}</div>
                  <div className="course-card-rating">
                    <span className="stars">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className="fa fa-star"
                          style={{
                            color:
                              i < Math.round(course.rating)
                                ? "#ffd60a"
                                : "#e4e5e9",
                          }}
                        ></i>
                      ))}
                    </span>
                    <span className="reviews">
                      ({course.reviews.toLocaleString()})
                    </span>
                  </div>
                  <div className="course-card-price">
                    {course.isFree ? (
                      <>
                        <span className="old-price">
                          ${course.oldPrice.toFixed(2)}
                        </span>
                        <span
                          className="price"
                          style={{ color: PRIMARY_COLOR }}
                        >
                          Free
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="price">
                          ${course.price.toFixed(2)}
                        </span>
                        {course.oldPrice > course.price && (
                          <span className="old-price">
                            ${course.oldPrice.toFixed(2)}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => navigate(`/course/${course.id}`)}
                    className="btn-view-more"
                  >
                    View More <i className="fa fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            ))}
          </section>
        </div>

        {/* Pagination */}
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

        {/* Course Stats */}
        <div className="course-stats">
          <div className="stat-item">
            <i className="fa fa-book"></i>
            <span>Tổng khóa học: {pagination.total_items}</span>
          </div>
          <div className="stat-item">
            <i className="fa fa-users"></i>
            <span>Đang hiển thị: {courses.length}</span>
          </div>
          <div className="stat-item">
            <i className="fa fa-clock"></i>
            <span>
              Trang: {currentPage}/{pagination.total_pages}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Course;

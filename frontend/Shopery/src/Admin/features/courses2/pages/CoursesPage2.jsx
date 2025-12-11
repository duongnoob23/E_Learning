import React, { useMemo, useState } from "react";
import { HiXMark } from "react-icons/hi2";
import CourseLessonsModal from "../components/CourseLessonsModal";
import CoursePreviewModal from "../components/CoursePreviewModal";
import EditCourseModal from "../components/EditCourseModal";
import { useAdminRemoveCourse } from "../hooks/useCoursesAdminMutations";
import { useClientCourses } from "../hooks/useCoursesAdminQueries";
import "./CoursesPage2.scss";
import CreateCoursePage from "./CreateCoursePage";

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// Helper để format status
function formatStatus(status) {
  const statusMap = {
    published: "Published",
    draft: "Draft",
    pending_review: "Pending Review",
    archived: "Archived",
  };
  return statusMap[status] || status;
}

export default function CoursesPage2() {
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdOn");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [previewCourseId, setPreviewCourseId] = useState(null);
  const [lessonsCourseId, setLessonsCourseId] = useState(null);
  const [editCourseId, setEditCourseId] = useState(null);

  const rowsPerPage = 10;
  const {
    data: coursesData,
    isLoading,
    error,
    refetch,
  } = useClientCourses({
    page: currentPage,
    limit: rowsPerPage,
    title: search || undefined,
    sort_by:
      sortBy === "createdOn"
        ? "newest"
        : sortBy === "enrollments"
        ? "popular"
        : "newest",
  });

  const deleteCourseMutation = useAdminRemoveCourse();

  // Xử lý dữ liệu từ API client
  // Client API có thể trả về format khác, cần xử lý
  const courses =
    coursesData?.DT?.courses || coursesData?.DT || coursesData?.data || [];
  const pagination = coursesData?.DT?.pagination ||
    coursesData?.pagination || {
      current_page: currentPage,
      total_pages: 1,
      total_items: courses.length,
      items_per_page: rowsPerPage,
    };

  // Fetch tất cả courses để tính KPI chính xác (không pagination)
  const { data: allCoursesData } = useClientCourses(
    {
      limit: 1000, // Lấy tất cả để đếm
    },
    !isLoading && courses.length > 0 // Chỉ fetch khi đã có data từ page đầu
  );

  const allCourses =
    allCoursesData?.DT?.courses ||
    allCoursesData?.DT ||
    allCoursesData?.data ||
    [];

  // Tính toán KPIs từ tất cả courses
  const kpis = useMemo(() => {
    // Dùng allCourses để đếm chính xác
    const coursesForKPI = allCourses.length > 0 ? allCourses : courses;
    const totalCourses =
      allCourses.length > 0
        ? allCourses.length
        : pagination.total_items || courses.length;

    const published = coursesForKPI.filter(
      (c) => c.status === "published" || c.status === "Published"
    ).length;
    const draft = coursesForKPI.filter(
      (c) => c.status === "draft" || c.status === "Draft"
    ).length;
    const enrollments = coursesForKPI.reduce(
      (sum, c) => sum + (c.total_students || c.enrollments || 0),
      0
    );

    return {
      totalCourses,
      published,
      draft,
      enrollments,
    };
  }, [allCourses, courses, pagination]);

  // Filter và sort courses (client-side cho search và status)
  const filteredAndSortedCourses = useMemo(() => {
    let filtered = [...courses];

    // Search filter
    if (search.trim()) {
      filtered = filtered.filter((course) =>
        course.title?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      const statusMap = {
        Published: "published",
        Draft: "draft",
        "Pending Review": "pending_review",
      };
      const filterStatus =
        statusMap[statusFilter] || statusFilter.toLowerCase();
      filtered = filtered.filter((course) => course.status === filterStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal;
      if (sortBy === "createdOn") {
        aVal = new Date(a.created_at || 0).getTime();
        bVal = new Date(b.created_at || 0).getTime();
      } else if (sortBy === "enrollments") {
        aVal = a.total_students || 0;
        bVal = b.total_students || 0;
      } else if (sortBy === "rating") {
        aVal = a.rating || 0;
        bVal = b.rating || 0;
      } else {
        aVal = a.title || "";
        bVal = b.title || "";
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [courses, search, statusFilter, sortBy, sortOrder]);

  // Pagination - sử dụng từ API
  const totalPages = pagination.total_pages || 1;
  const paginatedCourses = filteredAndSortedCourses;

  // Select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(paginatedCourses.map((c) => c.course_id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (courseId) => {
    setSelectedRows((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setShowSortMenu(false);
  };

  const handleDelete = (courseId) => {
    if (window.confirm("Bạn có chắc muốn xóa khóa học này?")) {
      deleteCourseMutation.mutate(courseId, {
        onSuccess: () => {
          refetch();
          setShowActionMenu(null);
        },
      });
    } else {
      setShowActionMenu(null);
    }
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return;
    if (
      window.confirm(
        `Bạn có chắc muốn xóa ${selectedRows.length} khóa học đã chọn?`
      )
    ) {
      // Xóa từng khóa học một
      selectedRows.forEach((courseId) => {
        deleteCourseMutation.mutate(courseId);
      });
      setSelectedRows([]);
      refetch();
    }
  };

  return (
    <div className="course-page2-root">
      {/* Header */}
      <div className="course-page2__header-row">
        <div className="course-page2__title">My Courses</div>
        <button
          className="course-page2__btn course-page2__btn--primary"
          onClick={() => setOpenModal(true)}
        >
          Add New Course
        </button>
      </div>

      {/* KPI Cards */}
      <div className="course-page2__stats-row">
        <div className="course-page2__stat-card">
          <div
            className="course-page2__stat-icon"
            style={{ background: "#E6EEFF" }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <rect width="18" height="12" x="3" y="6" rx="2" fill="#14B8A6" />
            </svg>
          </div>
          <div className="course-page2__stat-data">
            <div className="course-page2__stat-title">Total Courses</div>
            <div className="course-page2__stat-value">{kpis.totalCourses}</div>
            <div className="course-page2__stat-link">
              View details{" "}
              <span className="course-page2__stat-link-arrow">{">"}</span>
            </div>
          </div>
        </div>

        <div className="course-page2__stat-card">
          <div
            className="course-page2__stat-icon"
            style={{ background: "#E6EEFF" }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                fill="#14B8A6"
              />
            </svg>
          </div>
          <div className="course-page2__stat-data">
            <div className="course-page2__stat-title">Published Courses</div>
            <div className="course-page2__stat-value">{kpis.published}</div>
            <div className="course-page2__stat-link">
              View details{" "}
              <span className="course-page2__stat-link-arrow">{">"}</span>
            </div>
          </div>
        </div>

        <div className="course-page2__stat-card">
          <div
            className="course-page2__stat-icon"
            style={{ background: "#E6EEFF" }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <rect width="18" height="18" x="3" y="3" rx="2" fill="#A78BFA" />
            </svg>
          </div>
          <div className="course-page2__stat-data">
            <div className="course-page2__stat-title">Draft Courses</div>
            <div className="course-page2__stat-value">{kpis.draft}</div>
            <div className="course-page2__stat-link">
              View details{" "}
              <span className="course-page2__stat-link-arrow">{">"}</span>
            </div>
          </div>
        </div>

        <div className="course-page2__stat-card">
          <div
            className="course-page2__stat-icon"
            style={{ background: "#E6EEFF" }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="8" fill="#2DD4BF" />
            </svg>
          </div>
          <div className="course-page2__stat-data">
            <div className="course-page2__stat-title">Total Enrollments</div>
            <div className="course-page2__stat-value">
              {kpis.enrollments.toLocaleString()}
            </div>
            <div className="course-page2__stat-link">
              View details{" "}
              <span className="course-page2__stat-link-arrow">{">"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Wrapper */}
      <div className="course-page2__table-wrapper">
        <div className="course-page2__table-header-row">
          <div className="course-page2__table-title">Courses Table</div>
          <div className="course-page2__table-tools">
            <div className="course-page2__table-search">
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <span className="course-page2__search-icon">
                <svg width="16" height="16" fill="none" viewBox="0 0 20 20">
                  <circle
                    cx="9"
                    cy="9"
                    r="7.5"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                  />
                  <path
                    d="m16 16-3-3"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </div>

            <div className="course-page2__table-filter-wrapper">
              <button
                className="course-page2__table-tool-btn"
                onClick={() => {
                  setShowFilterMenu(!showFilterMenu);
                  setShowSortMenu(false);
                }}
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 20 20">
                  <path
                    d="M3 4h14M3 8h14M3 12h8M3 16h6"
                    stroke="#9CA3AF"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>{" "}
                Filter
              </button>
              {showFilterMenu && (
                <div className="course-page2__filter-dropdown">
                  <label className="course-page2__filter-option">
                    <input
                      type="radio"
                      name="status"
                      checked={statusFilter === "all"}
                      onChange={() => {
                        setStatusFilter("all");
                        setShowFilterMenu(false);
                        setCurrentPage(1);
                      }}
                    />
                    All
                  </label>
                  <label className="course-page2__filter-option">
                    <input
                      type="radio"
                      name="status"
                      checked={statusFilter === "Published"}
                      onChange={() => {
                        setStatusFilter("Published");
                        setShowFilterMenu(false);
                        setCurrentPage(1);
                      }}
                    />
                    Published
                  </label>
                  <label className="course-page2__filter-option">
                    <input
                      type="radio"
                      name="status"
                      checked={statusFilter === "Draft"}
                      onChange={() => {
                        setStatusFilter("Draft");
                        setShowFilterMenu(false);
                        setCurrentPage(1);
                      }}
                    />
                    Draft
                  </label>
                  <label className="course-page2__filter-option">
                    <input
                      type="radio"
                      name="status"
                      checked={statusFilter === "Pending Review"}
                      onChange={() => {
                        setStatusFilter("Pending Review");
                        setShowFilterMenu(false);
                        setCurrentPage(1);
                      }}
                    />
                    Pending Review
                  </label>
                </div>
              )}
            </div>

            <div className="course-page2__table-sort-wrapper">
              <button
                className="course-page2__table-tool-btn"
                onClick={() => {
                  setShowSortMenu(!showSortMenu);
                  setShowFilterMenu(false);
                }}
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 20 20">
                  <path
                    d="M6 8l4 4 4-4"
                    stroke="#9CA3AF"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>{" "}
                Sort by
              </button>
              {showSortMenu && (
                <div className="course-page2__sort-dropdown">
                  <button
                    className="course-page2__sort-option"
                    onClick={() => handleSort("createdOn")}
                  >
                    Created On
                    {sortBy === "createdOn" && (
                      <span>{sortOrder === "asc" ? " ↑" : " ↓"}</span>
                    )}
                  </button>
                  <button
                    className="course-page2__sort-option"
                    onClick={() => handleSort("enrollments")}
                  >
                    Enrollments
                    {sortBy === "enrollments" && (
                      <span>{sortOrder === "asc" ? " ↑" : " ↓"}</span>
                    )}
                  </button>
                  <button
                    className="course-page2__sort-option"
                    onClick={() => handleSort("rating")}
                  >
                    Rating
                    {sortBy === "rating" && (
                      <span>{sortOrder === "asc" ? " ↑" : " ↓"}</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedRows.length > 0 && (
          <div className="course-page2__bulk-actions-bar">
            <span>{selectedRows.length} selected</span>
            <button
              className="course-page2__btn course-page2__btn--danger"
              onClick={handleBulkDelete}
            >
              Delete Selected
            </button>
          </div>
        )}

        <div className="course-page2__table-scroll">
          <table className="course-page2__table">
            <thead>
              <tr>
                <th style={{ width: "4%", textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={
                      paginatedCourses.length > 0 &&
                      selectedRows.length === paginatedCourses.length
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th style={{ width: "4%", textAlign: "center" }}>No</th>
                <th style={{ width: "30%", textAlign: "left" }}>
                  Course Title
                </th>
                <th style={{ width: "12%", textAlign: "center" }}>Status</th>
                <th style={{ width: "12%", textAlign: "right" }}>
                  Enrollments
                </th>
                <th style={{ width: "12%", textAlign: "center" }}>Rating</th>
                <th style={{ width: "14%", textAlign: "center" }}>
                  Created On
                </th>
                <th style={{ width: "12%", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: 20 }}>
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: 20 }}>
                    Có lỗi xảy ra khi tải dữ liệu
                  </td>
                </tr>
              ) : paginatedCourses.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: 20 }}>
                    No courses found
                  </td>
                </tr>
              ) : (
                paginatedCourses.map((course, idx) => (
                  <tr key={course.course_id}>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(course.course_id)}
                        onChange={() => handleRowSelect(course.course_id)}
                      />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {(currentPage - 1) * rowsPerPage + idx + 1}
                    </td>
                    <td
                      style={{
                        textAlign: "left",
                        fontWeight: 600,
                        color: "#111827",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        console.log("View course:", course.course_id)
                      }
                    >
                      {course.title || "N/A"}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span
                        className={`course-page2__status-badge course-page2__status-badge--${(
                          course.status || ""
                        ).toLowerCase()}`}
                      >
                        {formatStatus(course.status)}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {(course.total_students || 0).toLocaleString()}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <div className="course-page2__rating-display">
                        <span className="course-page2__rating-star">
                          <svg
                            width="14"
                            height="14"
                            fill="#FBBF24"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        </span>
                        <span className="course-page2__rating-value">
                          {/* {course.rating ? `${course.rating.toFixed(1)}` : "0.0"} / 5.0 */}
                          {course.rating}
                        </span>
                      </div>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span className="course-page2__created-date">
                        {formatDate(course.created_at)}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div className="course-page2__action-menu-wrapper">
                        <button
                          className="course-page2__action-menu-btn"
                          onClick={() =>
                            setShowActionMenu(
                              showActionMenu === course.course_id
                                ? null
                                : course.course_id
                            )
                          }
                          aria-label="Actions"
                        >
                          <svg
                            width="18"
                            height="18"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle cx="12" cy="5" r="2" fill="#6b7280" />
                            <circle cx="12" cy="12" r="2" fill="#6b7280" />
                            <circle cx="12" cy="19" r="2" fill="#6b7280" />
                          </svg>
                        </button>
                        {showActionMenu === course.course_id && (
                          <div className="course-page2__action-menu-dropdown">
                            <button
                              className="course-page2__action-menu-item"
                              onClick={() => {
                                setPreviewCourseId(course.course_id);
                                setShowActionMenu(null);
                              }}
                            >
                              Preview
                            </button>
                            <button
                              className="course-page2__action-menu-item"
                              onClick={() => {
                                setLessonsCourseId(course.course_id);
                                setShowActionMenu(null);
                              }}
                            >
                              View Lessons
                            </button>
                            <button
                              className="course-page2__action-menu-item"
                              onClick={() => {
                                setEditCourseId(course.course_id);
                                setShowActionMenu(null);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="course-page2__action-menu-item"
                              onClick={() => {
                                console.log(
                                  "Publish/Unpublish:",
                                  course.course_id
                                );
                                setShowActionMenu(null);
                              }}
                            >
                              {course.status === "published"
                                ? "Unpublish"
                                : "Publish"}
                            </button>
                            <button
                              className="course-page2__action-menu-item"
                              onClick={() => {
                                console.log("Duplicate:", course.course_id);
                                setShowActionMenu(null);
                              }}
                            >
                              Duplicate
                            </button>
                            <button
                              className="course-page2__action-menu-item course-page2__action-menu-item--danger"
                              onClick={() => handleDelete(course.course_id)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="course-page2__table-pagination">
            <button
              className="course-page2__pagination-btn"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <div className="course-page2__pagination-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`course-page2__pagination-number ${
                      page === currentPage
                        ? "course-page2__pagination-number--active"
                        : ""
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
            <button
              className="course-page2__pagination-btn"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Create Course Modal */}
      {openModal && (
        <div
          className="course-modal2__backdrop"
          onClick={() => setOpenModal(false)}
        >
          <div
            className="course-modal2__wrapper"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="course-modal2__header">
              <div style={{ fontWeight: 600, fontSize: "18px" }}>
                Create New Course
              </div>
              <button
                className="course-modal2__btn-close"
                onClick={() => setOpenModal(false)}
              >
                <HiXMark />
              </button>
            </div>
            <div className="course-modal2__content-wrapper">
              <CreateCoursePage
                onClose={() => setOpenModal(false)}
                onSave={(data) => {
                  console.log("Save course:", data);
                  setOpenModal(false);
                  refetch();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Course Preview Modal */}
      <CoursePreviewModal
        open={!!previewCourseId}
        onClose={() => setPreviewCourseId(null)}
        courseId={previewCourseId}
      />

      {/* Course Lessons Modal */}
      <CourseLessonsModal
        open={!!lessonsCourseId}
        onClose={() => setLessonsCourseId(null)}
        courseId={lessonsCourseId}
      />

      {/* Edit Course Modal */}
      <EditCourseModal
        open={!!editCourseId}
        onClose={() => setEditCourseId(null)}
        courseId={editCourseId}
        onSuccess={() => {
          refetch();
          setEditCourseId(null);
        }}
      />
    </div>
  );
}

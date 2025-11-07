import React, { useMemo, useState } from "react";
import AddCourseModal from "../components/AddCourseModal";
import "./CoursesPage2.scss";

// Mock data
const mockKPIs = {
  totalCourses: 12,
  published: 8,
  draft: 3,
  enrollments: 1245,
};

const mockCourses = [
  {
    id: 1,
    title: "Mockup Design with Photoshop",
    status: "Published",
    enrollments: 916,
    rating: 4.8,
    createdOn: "2026-07-15",
  },
  {
    id: 2,
    title: "Graphic Design with Canva",
    status: "Published",
    enrollments: 374,
    rating: 4.8,
    createdOn: "2024-11-22",
  },
  {
    id: 3,
    title: "3D Furniture Design with Blender",
    status: "Published",
    enrollments: 248,
    rating: 4.8,
    createdOn: "2027-02-09",
  },
  {
    id: 4,
    title: "Digital Drawing with MediBang",
    status: "Published",
    enrollments: 582,
    rating: 4.8,
    createdOn: "2028-01-05",
  },
  {
    id: 5,
    title: "Mastering Pencil Sketch for Drawing",
    status: "Published",
    enrollments: 753,
    rating: 4.8,
    createdOn: "2023-03-30",
  },
  {
    id: 6,
    title: "Mastering UX Writing for Beginner",
    status: "Published",
    enrollments: 631,
    rating: 4.8,
    createdOn: "2025-09-12",
  },
  {
    id: 7,
    title: "UI Design for Mobile Apps",
    status: "Published",
    enrollments: 485,
    rating: 4.8,
    createdOn: "2026-10-18",
  },
  {
    id: 8,
    title: "Video Editing with Capcut",
    status: "Published",
    enrollments: 207,
    rating: 4.8,
    createdOn: "2023-12-01",
  },
  {
    id: 9,
    title: "Motion Graphic for Beginner with AE",
    status: "Published",
    enrollments: 839,
    rating: 4.8,
    createdOn: "2025-05-04",
  },
];

function formatDate(dateString) {
  const date = new Date(dateString);
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

  const rowsPerPage = 10;

  // Filter và sort courses
  const filteredAndSortedCourses = useMemo(() => {
    let filtered = [...mockCourses];

    // Search filter
    if (search.trim()) {
      filtered = filtered.filter((course) =>
        course.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((course) => course.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal;
      if (sortBy === "createdOn") {
        aVal = new Date(a.createdOn).getTime();
        bVal = new Date(b.createdOn).getTime();
      } else if (sortBy === "enrollments") {
        aVal = a.enrollments;
        bVal = b.enrollments;
      } else if (sortBy === "rating") {
        aVal = a.rating;
        bVal = b.rating;
      } else {
        aVal = a.title;
        bVal = b.title;
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [search, statusFilter, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedCourses.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedCourses = filteredAndSortedCourses.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  // Select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(paginatedCourses.map((c) => c.id));
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
      console.log("Delete course:", courseId);
      // TODO: Call API
    }
    setShowActionMenu(null);
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return;
    if (
      window.confirm(
        `Bạn có chắc muốn xóa ${selectedRows.length} khóa học đã chọn?`
      )
    ) {
      console.log("Bulk delete:", selectedRows);
      // TODO: Call API
      setSelectedRows([]);
    }
  };

  return (
    <div className="course-page2-root">
      {/* Breadcrumb */}
      <div className="course-page2__breadcrumb">
        <span>
          Management / <b>Courses</b>
        </span>
      </div>

      {/* Header */}
      <div className="course-page2__header-row">
        <div className="course-page2__title">My Courses</div>
        <button className="course-page2__btn course-page2__btn--primary" onClick={() => setOpenModal(true)}>
          Add New Course
        </button>
      </div>

      {/* KPI Cards */}
      <div className="course-page2__stats-row">
        <div className="course-page2__stat-card">
          <div className="course-page2__stat-icon" style={{ background: "#E6EEFF" }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <rect width="18" height="12" x="3" y="6" rx="2" fill="#14B8A6" />
            </svg>
          </div>
          <div className="course-page2__stat-data">
            <div className="course-page2__stat-title">Total Courses</div>
            <div className="course-page2__stat-value">{mockKPIs.totalCourses}</div>
            <div className="course-page2__stat-link">
              View details <span className="course-page2__stat-link-arrow">{">"}</span>
            </div>
          </div>
        </div>

        <div className="course-page2__stat-card">
          <div className="course-page2__stat-icon" style={{ background: "#E6EEFF" }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                fill="#14B8A6"
              />
            </svg>
          </div>
          <div className="course-page2__stat-data">
            <div className="course-page2__stat-title">Published Courses</div>
            <div className="course-page2__stat-value">{mockKPIs.published}</div>
            <div className="course-page2__stat-link">
              View details <span className="course-page2__stat-link-arrow">{">"}</span>
            </div>
          </div>
        </div>

        <div className="course-page2__stat-card">
          <div className="course-page2__stat-icon" style={{ background: "#E6EEFF" }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <rect width="18" height="18" x="3" y="3" rx="2" fill="#A78BFA" />
            </svg>
          </div>
          <div className="course-page2__stat-data">
            <div className="course-page2__stat-title">Draft Courses</div>
            <div className="course-page2__stat-value">{mockKPIs.draft}</div>
            <div className="course-page2__stat-link">
              View details <span className="course-page2__stat-link-arrow">{">"}</span>
            </div>
          </div>
        </div>

        <div className="course-page2__stat-card">
          <div className="course-page2__stat-icon" style={{ background: "#E6EEFF" }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="8" fill="#2DD4BF" />
            </svg>
          </div>
          <div className="course-page2__stat-data">
            <div className="course-page2__stat-title">Total Enrollments</div>
            <div className="course-page2__stat-value">
              {mockKPIs.enrollments.toLocaleString()}
            </div>
            <div className="course-page2__stat-link">
              View details <span className="course-page2__stat-link-arrow">{">"}</span>
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
            <button className="course-page2__btn course-page2__btn--danger" onClick={handleBulkDelete}>
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
              {paginatedCourses.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: 20 }}>
                    No courses found
                  </td>
                </tr>
              ) : (
                paginatedCourses.map((course, idx) => (
                  <tr key={course.id}>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(course.id)}
                        onChange={() => handleRowSelect(course.id)}
                      />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {startIndex + idx + 1}
                    </td>
                    <td
                      style={{
                        textAlign: "left",
                        fontWeight: 600,
                        color: "#111827",
                        cursor: "pointer",
                      }}
                      onClick={() => console.log("View course:", course.id)}
                    >
                      {course.title}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span
                        className={`course-page2__status-badge course-page2__status-badge--${course.status.toLowerCase()}`}
                      >
                        {course.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {course.enrollments.toLocaleString()}
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
                          {course.rating} / 5.0
                        </span>
                      </div>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span className="course-page2__created-date">
                        {formatDate(course.createdOn)}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div className="course-page2__action-menu-wrapper">
                        <button
                          className="course-page2__action-menu-btn"
                          onClick={() =>
                            setShowActionMenu(
                              showActionMenu === course.id ? null : course.id
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
                        {showActionMenu === course.id && (
                          <div className="course-page2__action-menu-dropdown">
                            <button
                              className="course-page2__action-menu-item"
                              onClick={() => {
                                console.log("Edit:", course.id);
                                setShowActionMenu(null);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="course-page2__action-menu-item"
                              onClick={() => {
                                console.log("Publish/Unpublish:", course.id);
                                setShowActionMenu(null);
                              }}
                            >
                              {course.status === "Published"
                                ? "Unpublish"
                                : "Publish"}
                            </button>
                            <button
                              className="course-page2__action-menu-item"
                              onClick={() => {
                                console.log("Duplicate:", course.id);
                                setShowActionMenu(null);
                              }}
                            >
                              Duplicate
                            </button>
                            <button
                              className="course-page2__action-menu-item course-page2__action-menu-item--danger"
                              onClick={() => handleDelete(course.id)}
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
                      page === currentPage ? "course-page2__pagination-number--active" : ""
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

      {/* Add Course Modal */}
      <AddCourseModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={(data) => {
          console.log("Save course:", data);
          setOpenModal(false);
          // TODO: Call API
        }}
      />
    </div>
  );
}

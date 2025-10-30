import React from "react";
import "./CoursesPage.scss";

const stats = [
  {
    title: "Total Courses",
    value: "12",
    icon: (
      <div className="stat-icon" style={{ background: "#E6EEFF" }}>
        <svg width="20" height="20" fill="none">
          <rect width="18" height="12" x="1" y="4" rx="2" fill="#2A5BD7" />
        </svg>
      </div>
    ),
  },
  {
    title: "Published Courses",
    value: "8",
    icon: (
      <div className="stat-icon" style={{ background: "#E6EEFF" }}>
        <svg width="20" height="20" fill="none">
          <rect width="18" height="12" x="1" y="4" rx="2" fill="#29C6F6" />
        </svg>
      </div>
    ),
  },
  {
    title: "Draft Courses",
    value: "3",
    icon: (
      <div className="stat-icon" style={{ background: "#E6EEFF" }}>
        <svg width="20" height="20" fill="none">
          <rect width="18" height="12" x="1" y="4" rx="2" fill="#A78BFA" />
        </svg>
      </div>
    ),
  },
  {
    title: "Total Enrollments",
    value: "1,245",
    icon: (
      <div className="stat-icon" style={{ background: "#E6EEFF" }}>
        <svg width="20" height="20" fill="none">
          <circle cx="10" cy="10" r="8" fill="#2DD4BF" />
        </svg>
      </div>
    ),
  },
];

const courses = [
  {
    title: "Mockup Design with Photoshop",
    status: "Published",
    enrolled: 916,
    rating: 4.8,
    created: "Jul 15, 2026",
  },
  {
    title: "Graphic Design with Canva",
    status: "Published",
    enrolled: 374,
    rating: 4.8,
    created: "Nov 22, 2024",
  },
  {
    title: "3D Furniture Design with Blender",
    status: "Published",
    enrolled: 248,
    rating: 4.8,
    created: "Feb 9, 2027",
  },
  {
    title: "Digital Drawing with MediBang",
    status: "Published",
    enrolled: 582,
    rating: 4.8,
    created: "Jan 5, 2028",
  },
  {
    title: "Mastering Pencil Sketch for Drawing",
    status: "Published",
    enrolled: 753,
    rating: 4.8,
    created: "Mar 30, 2023",
  },
  {
    title: "Mastering UX Writing for Beginner",
    status: "Published",
    enrolled: 631,
    rating: 4.8,
    created: "Sep 12, 2025",
  },
  {
    title: "UI Design for Mobile Apps",
    status: "Published",
    enrolled: 485,
    rating: 4.8,
    created: "Oct 18, 2026",
  },
  {
    title: "Video Editing with Capcut",
    status: "Published",
    enrolled: 207,
    rating: 4.8,
    created: "Dec 1, 2023",
  },
  {
    title: "Motion Graphic for Beginner with AE",
    status: "Published",
    enrolled: 839,
    rating: 4.8,
    created: "May 4, 2025",
  },
];

function RatingStar() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
      <path
        d="M10 2l2.36 5.99h6.14l-4.95 3.74 1.9 6.02L10 13.75l-5.46 3.99 1.9-6.02-4.95-3.74h6.14L10 2z"
        fill="#FBBF24"
      />
    </svg>
  );
}

export default function CoursesPage() {
  return (
    <div className="courses-page-root">
      {/* Breadcrumb */}
      <div className="courses-breadcrumb">
        <span>
          Management / <b>Courses</b>
        </span>
      </div>

      {/* Header + Button */}
      <div className="courses-header-row">
        <div className="courses-title">My Courses</div>
        <button className="btn-add-course">Add New Course</button>
      </div>

      {/* Stats Row */}
      <div className="courses-stats-row">
        {stats.map((stat, i) => (
          <div className="course-stat-card" key={i}>
            {stat.icon}
            <div className="stat-data">
              <div className="stat-title">{stat.title}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-link">
                View details <span className="stat-link-arrow">{">"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Courses Table */}
      <div className="courses-table-wrapper">
        <div className="table-header-row">
          <div className="table-title">Courses Table</div>
          <div className="table-tools">
            <div className="table-search">
              <input type="text" placeholder="Search" />
              <span className="search-icon">
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
            <button className="table-tool-btn">
              <svg width="16" height="16" fill="none" viewBox="0 0 20 20">
                <path
                  d="M4 10h12M4 6h12M4 14h8"
                  stroke="#9CA3AF"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>{" "}
              Filter
            </button>
            <button className="table-tool-btn">
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
          </div>
        </div>
        <table className="courses-table">
          <thead>
            <tr>
              <th style={{ width: 48, textAlign: "center" }}>
                <input type="checkbox" />
              </th>
              <th style={{ width: 30, textAlign: "center" }}>No</th>
              <th style={{ textAlign: "left" }}>Course Title</th>
              <th style={{ width: 105, textAlign: "center" }}>Status</th>
              <th style={{ width: 110, textAlign: "center" }}>Enrollments</th>
              <th style={{ width: 120, textAlign: "center" }}>Rating</th>
              <th style={{ width: 140, textAlign: "center" }}>Created On</th>
              <th style={{ width: 42, textAlign: "right" }}></th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c, i) => (
              <tr key={i}>
                <td style={{ textAlign: "center" }}>
                  <input type="checkbox" />
                </td>
                <td style={{ textAlign: "center" }}>{i + 1}</td>
                <td
                  style={{
                    textAlign: "left",
                    fontWeight: 600,
                    color: "#111827",
                  }}
                >
                  {c.title}
                </td>
                <td style={{ textAlign: "center" }}>
                  <span className="status-badge">{c.status}</span>
                </td>
                <td style={{ textAlign: "center" }}>{c.enrolled}</td>
                <td style={{ textAlign: "center" }}>
                  <span className="rating-star">
                    <RatingStar />
                  </span>
                  <span className="rating-value">4.8 / 5.0</span>
                </td>
                <td style={{ textAlign: "center" }}>
                  <span className="created-date">{c.created}</span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <span className="icon-ellipsis">
                    <svg width="16" height="16" fill="none" viewBox="0 0 20 20">
                      <circle cx="10" cy="4" r="1.3" fill="#9CA3AF" />
                      <circle cx="10" cy="10" r="1.3" fill="#9CA3AF" />
                      <circle cx="10" cy="16" r="1.3" fill="#9CA3AF" />
                    </svg>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

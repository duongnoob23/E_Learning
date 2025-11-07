import React, { useState } from "react";
import CourseBuilderTab from "../components/CreateCourse/CourseBuilderTab";
import CourseInfoTab from "../components/CreateCourse/CourseInfoTab";
import CourseIntroVideoTab from "../components/CreateCourse/CourseIntroVideoTab";
import "./CreateCoursePage.scss";

export default function CreateCoursePage() {
  const [activeTab, setActiveTab] = useState(0); // 0: Course Info, 1: Intro Video, 2: Builder
  const [formData, setFormData] = useState({
    // Course Info
    title: "",
    slug: "",
    about: "",
    priceType: "paid", // "paid" | "free"
    regularPrice: "",
    discountedPrice: "",
    category: null,
    thumbnail: null,
    // Intro Video
    videoSource: "",
    videoUrl: "",
    // Builder
    modules: [],
  });

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const handleUpdateFormData = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  const handlePreview = () => {
    console.log("Preview course:", formData);
    // TODO: Open preview modal
  };

  const handleCreateCourse = () => {
    console.log("Create course:", formData);
    // TODO: Call API to create course
  };

  const tabs = [
    { id: 0, name: "Course Info", icon: "📝" },
    { id: 1, name: "Course Intro Video", icon: "🎥" },
    { id: 2, name: "Course Builder", icon: "📚" },
    { id: 3, name: "Additional Information", icon: "ℹ️" },
  ];

  return (
    <div className="course-create-page">
      <div className="course-create-page__container">
        {/* Left Side - Accordion Menu + Content */}
        <div className="course-create-page__left">
          {/* Accordion Menu */}
          <div className="course-create-page__accordion">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`course-create-page__accordion-item ${
                  activeTab === tab.id
                    ? "course-create-page__accordion-item--active"
                    : ""
                }`}
                onClick={() => handleTabClick(tab.id)}
              >
                <div className="course-create-page__accordion-header">
                  <span className="course-create-page__accordion-title">
                    {tab.name}
                  </span>
                  <span className="course-create-page__accordion-icon">
                    {activeTab === tab.id ? "−" : "+"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Tab Content */}
          <div className="course-create-page__content">
            {activeTab === 0 && (
              <CourseInfoTab
                data={formData}
                onChange={(data) =>
                  setFormData((prev) => ({ ...prev, ...data }))
                }
              />
            )}
            {activeTab === 1 && (
              <CourseIntroVideoTab
                data={formData}
                onChange={(data) =>
                  setFormData((prev) => ({ ...prev, ...data }))
                }
              />
            )}
            {activeTab === 2 && (
              <CourseBuilderTab
                modules={formData.modules || []}
                onChange={(modules) =>
                  setFormData((prev) => ({ ...prev, modules }))
                }
              />
            )}
            {activeTab === 3 && (
              <div className="course-create-page__tab-placeholder">
                <p>Additional Information tab - Coming soon</p>
              </div>
            )}
          </div>

          {/* Bottom Action Buttons */}
          <div className="course-create-page__actions">
            <button
              className="course-create-page__btn course-create-page__btn--preview"
              onClick={handlePreview}
            >
              Preview
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                style={{ marginLeft: "8px" }}
              >
                <path
                  d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>
            <button
              className="course-create-page__btn course-create-page__btn--create"
              onClick={handleCreateCourse}
            >
              Create Course
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                style={{ marginLeft: "8px" }}
              >
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Side - Tips Panel */}
        <div className="course-create-page__right">
          <div className="course-create-page__tips-panel">
            <h3 className="course-create-page__tips-title">
              Course Upload Tips
            </h3>
            <ul className="course-create-page__tips-list">
              <li className="course-create-page__tips-item">
                <span className="course-create-page__tips-check">✓</span>
                Set the Course Price option or make it free.
              </li>
              <li className="course-create-page__tips-item">
                <span className="course-create-page__tips-check">✓</span>
                Standard size for the course thumbnail is 700x430.
              </li>
              <li className="course-create-page__tips-item">
                <span className="course-create-page__tips-check">✓</span>
                Video section controls the course overview video.
              </li>
              <li className="course-create-page__tips-item">
                <span className="course-create-page__tips-check">✓</span>
                Course Builder is where you create & organize content.
              </li>
              <li className="course-create-page__tips-item">
                <span className="course-create-page__tips-check">✓</span>
                Add Topics inside Course Builder for lessons, quizzes, and
                assignments.
              </li>
              <li className="course-create-page__tips-item">
                <span className="course-create-page__tips-check">✓</span>
                Prerequisites define courses required before this course.
              </li>
              <li className="course-create-page__tips-item">
                <span className="course-create-page__tips-check">✓</span>
                Additional Data shows on the course single page.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

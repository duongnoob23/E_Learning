import React, { useState } from "react";
import AdditionalInformationTab from "../components/CreateCourse/AdditionalInformationTab";
import CourseBuilderTab from "../components/CreateCourse/CourseBuilderTab";
import CourseInfoTab from "../components/CreateCourse/CourseInfoTab";
import CourseIntroVideoTab from "../components/CreateCourse/CourseIntroVideoTab";
import "./CreateCoursePage.scss";

const initialFormData = {
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
  // Additional Information
  startDate: "",
  language: "English",
  requirements: "",
  requirementsPerLine: false,
  description: "",
  descriptionPerLine: false,
  durationHour: "",
  durationMinute: "",
  tags: "",
  targetedAudience: "",
};

export default function CreateCoursePage({ onClose, onSave }) {
  const [activeTab, setActiveTab] = useState(0); // 0: Course Info, 1: Intro Video, 2: Builder, 3: Additional Info
  const [formData, setFormData] = useState(initialFormData);
  const [validationErrors, setValidationErrors] = useState({});

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const handleReset = () => {
    if (window.confirm("Bạn có chắc muốn xóa toàn bộ thông tin đã nhập?")) {
      setFormData(initialFormData);
      setValidationErrors({});
      setActiveTab(0);
    }
  };

  const validateForm = () => {
    const errors = {};

    // Course Info validation
    if (!formData.title.trim()) {
      errors.title = "Course title is required";
    }
    if (!formData.slug.trim()) {
      errors.slug = "Course slug is required";
    }
    if (!formData.about.trim()) {
      errors.about = "About course is required";
    }
    if (formData.priceType === "paid") {
      if (!formData.regularPrice || parseFloat(formData.regularPrice) <= 0) {
        errors.regularPrice = "Regular price is required";
      }
    }
    // if (!formData.category) {
    //   errors.category = "Category is required";
    // }
    if (!formData.thumbnail) {
      errors.thumbnail = "Thumbnail is required";
    }

    // Intro Video validation
    if (!formData.videoSource) {
      errors.videoSource = "Video source is required";
    }
    if (!formData.videoUrl.trim()) {
      errors.videoUrl = "Video URL is required";
    }

    // Builder validation
    if (!formData.modules || formData.modules.length === 0) {
      errors.modules = "At least one module is required";
    } else {
      formData.modules.forEach((module, moduleIndex) => {
        if (!module.lessons || module.lessons.length === 0) {
          errors[`module_${moduleIndex}`] =
            "Module must have at least one lesson";
        } else {
          module.lessons.forEach((lesson, lessonIndex) => {
            if (!lesson.title || !lesson.title.trim()) {
              errors[`lesson_${moduleIndex}_${lessonIndex}_title`] =
                "Lesson title is required";
            }
            if (!lesson.videoSource) {
              errors[`lesson_${moduleIndex}_${lessonIndex}_videoSource`] =
                "Video source is required";
            }
            if (!lesson.videoUrl || !lesson.videoUrl.trim()) {
              errors[`lesson_${moduleIndex}_${lessonIndex}_videoUrl`] =
                "Video URL is required";
            }
          });
        }
      });
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePreview = () => {
    if (!validateForm()) {
      alert("Vui lòng điền đầy đủ thông tin trước khi preview");
      return;
    }
    console.log("Preview course:", formData);
    // TODO: Open preview modal
  };

  const handleCreateCourse = () => {
    if (!validateForm()) {
      alert(
        "Vui lòng điền đầy đủ thông tin và đảm bảo tất cả modules có ít nhất 1 lesson"
      );
      return;
    }
    console.log("Create course:", formData);
    if (onSave) {
      onSave(formData);
    }
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
              <React.Fragment key={tab.id}>
                <div
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
                {/* Tab Content - Show directly below active tab */}
                {activeTab === tab.id && (
                  <div className="course-create-page__content">
                    {activeTab === 0 && (
                      <CourseInfoTab
                        data={formData}
                        onChange={(data) =>
                          setFormData((prev) => ({ ...prev, ...data }))
                        }
                        errors={validationErrors}
                      />
                    )}
                    {activeTab === 1 && (
                      <CourseIntroVideoTab
                        data={formData}
                        onChange={(data) =>
                          setFormData((prev) => ({ ...prev, ...data }))
                        }
                        errors={validationErrors}
                      />
                    )}
                    {activeTab === 2 && (
                      <CourseBuilderTab
                        modules={formData.modules || []}
                        onChange={(modules) =>
                          setFormData((prev) => ({ ...prev, modules }))
                        }
                        errors={validationErrors}
                      />
                    )}
                    {activeTab === 3 && (
                      <AdditionalInformationTab
                        data={formData}
                        onChange={(data) =>
                          setFormData((prev) => ({ ...prev, ...data }))
                        }
                        errors={validationErrors}
                      />
                    )}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Bottom Action Buttons */}
          <div className="course-create-page__actions">
            <button
              className="course-create-page__btn course-create-page__btn--reset"
              onClick={handleReset}
              type="button"
            >
              Reset All
              <svg
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                style={{ marginLeft: "8px" }}
              >
                <path
                  d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M21 3v5h-5M3 21a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 16M21 21v-5h-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              className="course-create-page__btn course-create-page__btn--preview"
              onClick={handlePreview}
              type="button"
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
              type="button"
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

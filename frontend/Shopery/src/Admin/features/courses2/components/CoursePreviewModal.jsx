import React, { useEffect, useState } from "react";
import { HiXMark } from "react-icons/hi2";
import { renderLessonComponent } from "../../../../Client/components/Lesson/LessonComponentMapper";
import {
  useAdminCourseDetail,
  useAdminCourseStructure,
} from "../hooks/useCoursesAdminQueries";
import "./CoursePreviewModal.scss";

const convertYoutubeUrlToEmbed = (url) => {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    let videoId = "";
    let listId = urlObj.searchParams.get("list");

    // 1. Dạng chuẩn watch?v=
    if (urlObj.searchParams.get("v")) {
      videoId = urlObj.searchParams.get("v");
    }
    // 2. Dạng youtu.be/VIDEO_ID
    else if (urlObj.hostname === "youtu.be") {
      videoId = urlObj.pathname.replace("/", "");
    }
    // 3. Dạng embed/VIDEO_ID
    else if (urlObj.pathname.startsWith("/embed/")) {
      videoId = urlObj.pathname.split("/embed/")[1];
    }
    // 4. Dạng shorts/VIDEO_ID
    else if (urlObj.pathname.startsWith("/shorts/")) {
      videoId = urlObj.pathname.split("/shorts/")[1];
    }
    // 5. Live stream
    else if (urlObj.pathname.startsWith("/live/")) {
      videoId = urlObj.pathname.split("/live/")[1];
    }

    if (!videoId) return null;

    let embedUrl = `https://www.youtube.com/embed/${videoId}`;
    if (listId) {
      embedUrl += `?list=${listId}`;
    }
    return embedUrl;
  } catch (error) {
    return null;
  }
};

export default function CoursePreviewModal({ open, onClose, courseId }) {
  const [activeTab, setActiveTab] = useState("about");
  const [openModuleIdx, setOpenModuleIdx] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const {
    data: courseDetailRes,
    isLoading,
    error,
  } = useAdminCourseDetail(courseId, open && !!courseId);

  // Fetch structure riêng cho tab curriculum (modules + lessons)
  const { data: courseStructureRes } = useAdminCourseStructure(
    courseId,
    open && !!courseId && activeTab === "curriculum"
  );

  // Client API trả về format: { DT: { course: {...} } }
  const course = courseDetailRes?.DT?.course || courseDetailRes?.DT || null;

  // Lấy modules từ structure API nếu có, nếu không thì từ course object
  const courseStructure = courseStructureRes?.DT || null;
  const modules = courseStructure?.modules || course?.modules || [];

  // Merge course data với modules từ structure
  const courseWithModules = course ? { ...course, modules } : null;

  const normalizeLessonType = (lesson) => {
    if (!lesson) return null;
    const t =
      lesson.lesson_data?.type ||
      lesson.lesson_type ||
      lesson.lesson_data?.lesson_type;
    if (t === "video_lesson") return "video";
    return t;
  };

  // Chọn lesson đầu tiên khi dữ liệu modules thay đổi
  useEffect(() => {
    if (modules && modules.length > 0) {
      const firstLesson = modules[0]?.lessons?.[0] || null;
      setSelectedLesson(firstLesson);
      setOpenModuleIdx(0);
    }
  }, [modules]);

  if (!open) return null;

  return (
    <div
      className="admin-course-preview-modal__backdrop"
      onMouseDown={(e) => {
        if (e.target.classList.contains("admin-course-preview-modal__backdrop"))
          onClose?.();
      }}
    >
      <div
        className="admin-course-preview-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="admin-course-preview-modal__header">
          <div>
            <div style={{ fontWeight: 600, fontSize: "18px" }}>
              {course?.title || "Course Preview"}
            </div>
            <div
              style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}
            >
              {course?.category?.name || ""} • {course?.total_lessons || 0} bài
              học
            </div>
          </div>
          <button className="admin-btn-close" onClick={onClose}>
            <HiXMark />
          </button>
        </div>

        <div className="admin-course-preview-modal__content">
          {isLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "40px",
              }}
            >
              Loading...
            </div>
          ) : error ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "40px",
                color: "#ef4444",
              }}
            >
              Error: {error.message || "Failed to load course"}
            </div>
          ) : !course ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "40px",
              }}
            >
              No data found
            </div>
          ) : (
            <div className="admin-course-preview-content">
              {/* Header Section */}
              <div className="admin-course-preview-header">
                <div className="admin-course-preview-header__left">
                  <span className="admin-course-preview-badge">
                    {course.category?.name || "Uncategorized"}
                  </span>
                  <h1 className="admin-course-preview-title">{course.title}</h1>
                  <p className="admin-course-preview-desc">
                    {course.short_description || course.description || ""}
                  </p>
                  <div className="admin-course-preview-meta">
                    <span>⭐ {course.rating || "N/A"}</span>
                    <span>📚 {course.total_lessons || 0} bài học</span>
                    <span>⏱ {course.total_duration || "N/A"}</span>
                    {course.total_students && (
                      <span>👥 {course.total_students} học viên</span>
                    )}
                  </div>
                  {course.instructor && (
                    <div className="admin-course-preview-instructor">
                      <span>Giảng viên: {course.instructor.name}</span>
                    </div>
                  )}
                </div>
                <div className="admin-course-preview-header__right">
                  {selectedLesson ? (
                    <div className="admin-course-preview-lesson-render">
                      {renderLessonComponent({
                        ...selectedLesson,
                        lesson_type: normalizeLessonType(selectedLesson),
                      })}
                    </div>
                  ) : course.video_preview ? (
                    <div className="admin-course-preview-video">
                      <iframe
                        width="100%"
                        height="100%"
                        src={convertYoutubeUrlToEmbed(course.video_preview)}
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Course Preview Video"
                      />
                    </div>
                  ) : course.image ? (
                    <div className="admin-course-preview-image">
                      <img src={course.image} alt={course.title} />
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Tabs */}
              <div className="admin-course-preview-tabs">
                <button
                  className={`admin-course-preview-tab ${
                    activeTab === "about"
                      ? "admin-course-preview-tab--active"
                      : ""
                  }`}
                  onClick={() => setActiveTab("about")}
                >
                  Giới thiệu
                </button>
                <button
                  className={`admin-course-preview-tab ${
                    activeTab === "curriculum"
                      ? "admin-course-preview-tab--active"
                      : ""
                  }`}
                  onClick={() => setActiveTab("curriculum")}
                >
                  Nội dung
                </button>
              </div>

              {/* Tab Content */}
              <div className="admin-course-preview-tab-content">
                {activeTab === "about" && (
                  <div className="admin-course-preview-about">
                    <h2>Giới thiệu khóa học</h2>
                    <p>{course.details?.about || course.description || ""}</p>

                    {course.details?.learning_outcomes && (
                      <div className="admin-course-preview-learn">
                        <h3>Bạn sẽ học được gì</h3>
                        <ul>
                          {course.details.learning_outcomes.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="admin-course-preview-skills-req">
                      {course.details?.skills && (
                        <div className="admin-course-preview-skills">
                          <h3>Kỹ năng đạt được</h3>
                          <div className="admin-course-preview-skills-list">
                            {course.details.skills.map((s, i) => (
                              <span
                                key={i}
                                className="admin-course-preview-skill-tag"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {course.details?.requirements && (
                        <div className="admin-course-preview-requirements">
                          <h3>Yêu cầu</h3>
                          <ul>
                            {course.details.requirements.map((r, i) => (
                              <li key={i}>{r}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "curriculum" && (
                  <div className="admin-course-preview-curriculum">
                    <h2>Nội dung khóa học</h2>
                    {modules && modules.length > 0 ? (
                      <div className="admin-curriculum-accordion">
                        {modules.map((module, idx) => (
                          <div
                            key={module.module_id}
                            className={`admin-curriculum-accordion__item ${
                              openModuleIdx === idx
                                ? "admin-curriculum-accordion__item--open"
                                : ""
                            }`}
                          >
                            <div
                              className="admin-curriculum-accordion__title"
                              onClick={() =>
                                setOpenModuleIdx(
                                  openModuleIdx === idx ? null : idx
                                )
                              }
                            >
                              {module.title || module.name}
                              <span className="admin-curriculum-accordion__meta">
                                {module.lessons?.length || 0} bài
                              </span>
                              <span className="admin-curriculum-accordion__arrow">
                                {openModuleIdx === idx ? "▲" : "▼"}
                              </span>
                            </div>
                            {openModuleIdx === idx &&
                              module.lessons &&
                              module.lessons.length > 0 && (
                                <div className="admin-curriculum-accordion__content">
                                  {module.lessons.map((lesson) => {
                                    const isActive =
                                      selectedLesson &&
                                      selectedLesson.lesson_id ===
                                        lesson.lesson_id;
                                    const displayLessonType =
                                      normalizeLessonType(lesson);
                                    return (
                                      <div
                                        key={lesson.lesson_id}
                                        className={`admin-curriculum-accordion__lesson ${
                                          isActive
                                            ? "admin-curriculum-accordion__lesson--active"
                                            : ""
                                        }`}
                                        onClick={() =>
                                          setSelectedLesson(lesson)
                                        }
                                      >
                                        <span className="admin-curriculum-accordion__lesson-icon">
                                          🎯
                                        </span>
                                        <div className="admin-curriculum-accordion__lesson-body">
                                          <div className="admin-curriculum-accordion__lesson-title">
                                            {lesson.title}
                                          </div>
                                          <div className="admin-curriculum-accordion__lesson-meta">
                                            <span className="lesson-badge">
                                              {displayLessonType}
                                            </span>
                                            {lesson.video_duration && (
                                              <span className="admin-curriculum-accordion__lesson-time">
                                                {lesson.video_duration}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>Khóa học chưa có nội dung.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

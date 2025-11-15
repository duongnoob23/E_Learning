import React, { useState, useMemo } from "react";
import { useAdminCourseStructure } from "../hooks/useCoursesAdminQueries";
import "./CourseLessonsModal.scss";

const convertYoutubeUrlToEmbed = (url) => {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    let videoId = "";
    let listId = urlObj.searchParams.get("list");

    if (urlObj.searchParams.get("v")) {
      videoId = urlObj.searchParams.get("v");
    } else if (urlObj.hostname === "youtu.be") {
      videoId = urlObj.pathname.replace("/", "");
    } else if (urlObj.pathname.startsWith("/embed/")) {
      videoId = urlObj.pathname.split("/embed/")[1];
    } else if (urlObj.pathname.startsWith("/shorts/")) {
      videoId = urlObj.pathname.split("/shorts/")[1];
    } else if (urlObj.pathname.startsWith("/live/")) {
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

export default function CourseLessonsModal({ open, onClose, courseId }) {
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(null);

  const { data: courseStructureRes, isLoading, error } = useAdminCourseStructure(
    courseId,
    open && !!courseId
  );
  // Client API trả về format: { DT: { course: {...}, modules: [...] } }
  const courseStructure = courseStructureRes?.DT || null;
  const course = courseStructure?.course || {};
  const modules = courseStructure?.modules || [];

  // Set first module and lesson as active when data loads
  React.useEffect(() => {
    if (open && modules.length > 0 && !activeModuleId) {
      const firstModule = modules[0];
      setActiveModuleId(firstModule.module_id);
      if (firstModule.lessons && firstModule.lessons.length > 0) {
        setActiveLessonId(firstModule.lessons[0].lesson_id);
      }
    }
  }, [open, modules, activeModuleId]);

  const activeModule = useMemo(
    () => modules.find((m) => m.module_id === activeModuleId) || modules[0],
    [modules, activeModuleId]
  );

  const activeLesson = useMemo(() => {
    if (!activeModule) return null;
    return (
      activeModule.lessons?.find((l) => l.lesson_id === activeLessonId) ||
      activeModule.lessons?.[0]
    );
  }, [activeModule, activeLessonId]);

  const handleToggleModule = (moduleId) => {
    setActiveModuleId((prev) => (prev === moduleId ? null : moduleId));
  };

  const handleSelectLesson = (moduleId, lesson) => {
    setActiveModuleId(moduleId);
    setActiveLessonId(lesson.lesson_id);
  };

  if (!open) return null;

  return (
    <div
      className="admin-course-lessons-modal__backdrop"
      onMouseDown={(e) => {
        if (e.target.classList.contains("admin-course-lessons-modal__backdrop"))
          onClose?.();
      }}
    >
      <div
        className="admin-course-lessons-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="admin-course-lessons-modal__header">
          <div>
            <div style={{ fontWeight: 600, fontSize: "18px" }}>
              {course?.title || "Course Lessons"}
            </div>
            <div
              style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}
            >
              {modules.length} modules • {course?.total_lessons || 0} lessons
            </div>
          </div>
          <button className="admin-btn-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="admin-course-lessons-modal__content">
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
              Error: {error.message || "Failed to load course structure"}
            </div>
          ) : !courseStructure || modules.length === 0 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "40px",
              }}
            >
              No lessons found
            </div>
          ) : (
            <div className="admin-course-lessons-layout">
              {/* Left Side - Video Player */}
              <div className="admin-course-lessons-layout__left">
                <div className="admin-course-lessons-video-panel">
                  <div className="admin-course-lessons-video-wrapper">
                    {activeLesson ? (
                      <div className="admin-course-lessons-video-frame">
                        <iframe
                          src={convertYoutubeUrlToEmbed(activeLesson.video_url)}
                          title={activeLesson.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="admin-course-lessons-video-placeholder">
                        Chọn bài học để xem
                      </div>
                    )}
                  </div>
                </div>

                {/* Lesson Info */}
                <header className="admin-course-lessons-course-header">
                  <h2 className="admin-course-lessons-lesson-title">
                    {activeLesson?.title || "Chưa chọn bài học"}
                  </h2>
                  {activeLesson?.content && (
                    <div className="admin-course-lessons-lesson-content">
                      {activeLesson.content
                        .split("\n")
                        .map((line, idx) => (
                          <p key={idx}>{line}</p>
                        ))}
                    </div>
                  )}
                  {activeLesson?.description && (
                    <div className="admin-course-lessons-lesson-content">
                      <p>{activeLesson.description}</p>
                    </div>
                  )}
                </header>
              </div>

              {/* Right Side - Sidebar */}
              <aside className="admin-course-lessons-layout__right">
                {modules.map((module) => {
                  const isOpen = activeModuleId === module.module_id;
                  return (
                    <div
                      className={`admin-course-lessons-chapter ${
                        isOpen ? "admin-course-lessons-chapter--open" : ""
                      }`}
                      key={module.module_id}
                    >
                      {/* Module Title */}
                      <button
                        type="button"
                        className="admin-course-lessons-chapter-header"
                        onClick={() => handleToggleModule(module.module_id)}
                      >
                        <div className="admin-course-lessons-chapter-header-text">
                          <h3 className="admin-course-lessons-chapter-title">
                            {module.title || module.name}
                          </h3>
                          <span className="admin-course-lessons-chapter-meta">
                            {module.lessons?.length || 0} Bài học
                          </span>
                        </div>
                        <svg
                          className="admin-course-lessons-chapter-arrow"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M7 10l5 5 5-5z" />
                        </svg>
                      </button>

                      {/* Lesson list */}
                      {isOpen && module.lessons && module.lessons.length > 0 && (
                        <div className="admin-course-lessons-lesson-list">
                          {module.lessons.map((lesson) => {
                            const isActiveLesson =
                              activeLessonId === lesson.lesson_id;
                            return (
                              <button
                                key={lesson.lesson_id}
                                type="button"
                                className={`admin-course-lessons-lesson-item ${
                                  isActiveLesson
                                    ? "admin-course-lessons-lesson-item--active"
                                    : ""
                                }`}
                                onClick={() =>
                                  handleSelectLesson(module.module_id, lesson)
                                }
                              >
                                <span className="admin-course-lessons-lesson-state">
                                  {isActiveLesson ? (
                                    <svg
                                      className="admin-course-lessons-lesson-status-icon admin-lesson-active-icon"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M8 5v14l11-7z" />
                                    </svg>
                                  ) : (
                                    <svg
                                      className="admin-course-lessons-lesson-status-icon"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle cx="12" cy="12" r="4" />
                                    </svg>
                                  )}
                                </span>

                                <span className="admin-course-lessons-lesson-name">
                                  {lesson.title}
                                </span>

                                <span className="admin-course-lessons-lesson-duration">
                                  {lesson.lesson_type === "quiz"
                                    ? "Quiz"
                                    : lesson.lesson_type === "assignment"
                                    ? "Bài tập"
                                    : lesson.duration || "Video"}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </aside>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


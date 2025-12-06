import React, { useCallback, useMemo, useState } from "react";
import "./Lesson.css";
import { useParams } from "react-router-dom";
import { useCourseStructure } from "../../services/Course/courseQueries";
import { renderLessonComponent } from "../../components/Lesson/LessonComponentMapper";
// import throttle from "lodash.throttle";
// import ReactPlayer from "react-player";
// ------------------------------- //
// 🎓 Component Lesson
// ------------------------------- //
const Lesson = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useCourseStructure(id);

  const course = data?.DT?.course || {};
  const modules = data?.DT?.modules || [];

  // ----- State -----
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(null);

  // ----- Derived State -----
  const activeModule = useMemo(
    () => modules.find((m) => m.module_id === activeModuleId) || modules[0],
    [modules, activeModuleId]
  );
  const convertYoutubeUrlToEmbed = (url) => {
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
  
      // Nếu không tìm được ID
      if (!videoId) return null;
  
      // Build embed URL
      let embedUrl = `https://www.youtube.com/embed/${videoId}`;
  
      if (listId) {
        embedUrl += `?list=${listId}`;
      }
  
      return embedUrl;
    } catch (error) {
      return null;
    }
  };
  
  const activeLesson = useMemo(() => {
    if (!activeModule) return null;
    return (
      activeModule.lessons.find((l) => l.lesson_id === activeLessonId) ||
      activeModule.lessons[0]
    );
  }, [activeModule, activeLessonId]);

  // ----- Handlers -----
  const handleToggleModule = useCallback((moduleId) => {
    setActiveModuleId((prev) => (prev === moduleId ? null : moduleId));
  }, []);

  const handleSelectLesson = useCallback((moduleId, lesson) => {
    setActiveModuleId(moduleId);
    setActiveLessonId(lesson.lesson_id);
  }, []);

  const getLessonModifier = (lessonId) => {
    if (lessonId === activeLessonId) return "lesson-page__lesson-item--playing";
    return "lesson-page__lesson-item--available";
  };
  console.log("Active lesson:", activeLesson);
  // ----- Rendering -----
  if (isLoading) return <div className="loading">Đang tải khóa học...</div>;
  if (error) return <div className="error">Không thể tải dữ liệu khóa học.</div>;
  if (!modules.length)
    return <div className="empty">Khóa học chưa có bài học nào.</div>;

  return (
    <div className="lesson-page">
      <div className="lesson-page__container">
        <section className="lesson-page__layout">
          {/* ================= LEFT SIDE ================= */}
          <div className="lesson-page__layout-left">
            {/* Lesson Content - Render động theo lesson_type */}
            {activeLesson ? (
              <div className="lesson-page__lesson-content-wrapper">
                <header className="lesson-page__course-header">
                  <h2 className="lesson-page__lesson-title">
                    {activeLesson.title}
                  </h2>
                  {activeLesson.description && (
                    <p className="lesson-page__lesson-description">
                      {activeLesson.description}
                    </p>
                  )}
                </header>

                {/* Render component dựa trên lesson_type */}
                <div className="lesson-page__lesson-component">
                  {renderLessonComponent(activeLesson)}
                </div>
              </div>
            ) : (
              <div className="lesson-page__video-placeholder">
                Chọn bài học để bắt đầu
              </div>
            )}
          </div>

          {/* ================= RIGHT SIDE (SIDEBAR) ================= */}
          <aside className="lesson-page__layout-right">
            {modules.map((module) => {
              const isOpen = activeModuleId === module.module_id;
              return (
                <div
                  className={`lesson-page__chapter ${
                    isOpen ? "lesson-page__chapter--open" : ""
                  }`}
                  key={module.module_id}
                >
                  {/* Module Title */}
                  <button
                    type="button"
                    className="lesson-page__chapter-header"
                    onClick={() => handleToggleModule(module.module_id)}
                  >
                    <div className="lesson-page__chapter-header-text">
                      <h3 className="lesson-page__chapter-title">
                        {module.title}
                      </h3>
                      <span className="lesson-page__chapter-meta">
                        {module.lessons.length} Bài học
                      </span>
                    </div>
                    <svg
                      className="lesson-page__chapter-arrow"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M7 10l5 5 5-5z" />
                    </svg>
                  </button>

                  {/* Lesson list */}
                  {isOpen && (
                    <div className="lesson-page__lesson-list">
                      {module.lessons.map((lesson) => {
                        const isActiveLesson = activeLessonId === lesson.lesson_id;
                        const statusClass = getLessonModifier(lesson.lesson_id);
                        return (
                          <button
                            key={lesson.lesson_id}
                            type="button"
                            className={`lesson-page__lesson-item ${statusClass} ${
                              isActiveLesson ? "lesson-page__lesson-item--active" : ""
                            }`}
                            onClick={() => handleSelectLesson(module.module_id, lesson)}
                          >
                            {/* ICON — bài đang phát */}
                            <span className="lesson-page__lesson-state">
                              {isActiveLesson ? (
                                <svg
                                  className="lesson-page__lesson-status-icon lesson-active-icon"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              ) : (
                                <svg
                                  className="lesson-page__lesson-status-icon"
                                  viewBox="0 0 24 24"
                                >
                                  <circle cx="12" cy="12" r="4" />
                                </svg>
                              )}
                            </span>
                        
                            {/* TITLE */}
                            <span className="lesson-page__lesson-name">{lesson.title}</span>
                        
                        
                            {/* TYPE - Hiển thị tên loại bài tập */}
                            <span className="lesson-page__lesson-duration">
                              {lesson.lesson_type === "quiz"
                                ? "Quiz"
                                : lesson.lesson_type === "assignment"
                                ? "Bài tập"
                                : lesson.lesson_type === "vocabulary_list"
                                ? "Danh sách từ"
                                : lesson.lesson_type === "vocabulary_matching"
                                ? "Tìm cặp"
                                : lesson.lesson_type === "vocabulary_translation"
                                ? "Dịch nghĩa"
                                : lesson.lesson_type === "vocabulary_quiz"
                                ? "Trắc nghiệm"
                                : lesson.lesson_type === "vocabulary_listening"
                                ? "Nghe từ"
                                : lesson.lesson_type === "vocabulary_image_choice"
                                ? "Chọn ảnh"
                                : lesson.lesson_type === "vocabulary_sentence_completion"
                                ? "Hoàn thiện câu"
                                : lesson.lesson_type === "grammar_theory"
                                ? "Lý thuyết"
                                : lesson.video_url
                                ? "Video"
                                : "Bài học"}
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
        </section>
      </div>
    </div>
  );
};

export default Lesson;

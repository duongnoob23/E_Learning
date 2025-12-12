import React, { useMemo, useState } from "react"; // Dùng React và hooks quản lý trạng thái
import { HiXMark } from "react-icons/hi2"; // React Icons
import { renderLessonComponent } from "../../../../Client/components/Lesson/LessonComponentMapper"; // Dùng renderer bên client cho 9 loại lesson
import VideoLesson from "../../../../Client/components/Lesson/Video/VideoLesson"; // Component hiển thị video lesson
import { useAdminCourseStructure } from "../hooks/useCoursesAdminQueries"; // Hook lấy cấu trúc khóa học
import "./CourseLessonsModal.scss"; // Style
import EditLessonModal from "./EditLessonModal"; // Modal chỉnh sửa lesson

const lessonTypeLabel = (lesson) => {
  if (!lesson) return "Bài học"; // Mặc định
  const type = lesson.lesson_type; // Đọc loại bài
  switch (type) {
    case "quiz":
      return "Quiz"; // Trắc nghiệm
    case "assignment":
      return "Bài tập";
    case "vocabulary_list":
      return "Danh sách từ";
    case "vocabulary_matching":
      return "Tìm cặp";
    case "vocabulary_translation":
      return "Dịch nghĩa";
    case "vocabulary_quiz":
      return "Trắc nghiệm";
    case "vocabulary_listening":
      return "Nghe từ";
    case "vocabulary_image_choice":
      return "Chọn ảnh";
    case "vocabulary_sentence_completion":
      return "Hoàn thiện câu";
    case "grammar_theory":
      return "Lý thuyết";
    case "video":
    default:
      return "Video";
  }
};

const LessonContent = ({ lesson }) => {
  if (!lesson) {
    return (
      <div className="admin-course-lessons-video-placeholder">
        Chọn bài học để xem
      </div>
    );
  }

  // Với video lesson, sử dụng VideoLesson component để hỗ trợ cả YouTube và Google Cloud Storage
  if (lesson.lesson_type === "video") {
    // Đảm bảo lesson có đầy đủ dữ liệu cho VideoLesson component
    const lessonForVideo = {
      ...lesson,
      lesson_data: lesson.lesson_data || {
        video_url: lesson.video_url || "",
        video_type:
          lesson.lesson_data?.video_type ||
          (lesson.video_url?.includes("youtube.com") ||
          lesson.video_url?.includes("youtu.be")
            ? "youtube"
            : "direct"),
      },
    };

    return (
      <div className="admin-course-lessons-video-wrapper">
        <VideoLesson lesson={lessonForVideo} />
      </div>
    );
  }

  // Các lesson type khác sử dụng renderLessonComponent
  return (
    <div className="admin-course-lessons-dynamic-wrapper">
      {renderLessonComponent(lesson)}
    </div>
  );
};

export default function CourseLessonsModal({ open, onClose, courseId }) {
  const [activeModuleId, setActiveModuleId] = useState(null); // Module đang mở
  const [activeLessonId, setActiveLessonId] = useState(null); // Lesson đang chọn
  const [editingLesson, setEditingLesson] = useState(null); // Lesson đang chỉnh sửa

  const {
    data: courseStructureRes,
    isLoading,
    error,
  } = useAdminCourseStructure(courseId, open && !!courseId); // Lấy cấu trúc khóa học
  const courseStructure = courseStructureRes?.DT || null; // Dữ liệu khóa học
  const course = courseStructure?.course || {}; // Thông tin khóa
  const modules = courseStructure?.modules || []; // Danh sách module

  React.useEffect(() => {
    if (open && modules.length > 0 && !activeModuleId) {
      const firstModule = modules[0]; // Chọn module đầu
      setActiveModuleId(firstModule.module_id); // Đặt module active
      if (firstModule.lessons && firstModule.lessons.length > 0) {
        setActiveLessonId(firstModule.lessons[0].lesson_id); // Đặt lesson active
      }
    }
  }, [open, modules, activeModuleId]); // Phụ thuộc trạng thái mở và dữ liệu

  const activeModule = useMemo(
    () => modules.find((m) => m.module_id === activeModuleId) || modules[0],
    [modules, activeModuleId]
  );

  const activeLesson = useMemo(() => {
    if (!activeModule) return null;
    const lesson =
      activeModule.lessons?.find((l) => l.lesson_id === activeLessonId) ||
      activeModule.lessons?.[0];

    if (!lesson) return null;

    // QUAN TRỌNG: Parse lesson_data nếu là string JSON
    let parsedLessonData = lesson.lesson_data;
    if (parsedLessonData && typeof parsedLessonData === "string") {
      try {
        parsedLessonData = JSON.parse(parsedLessonData);
      } catch (e) {
        console.error("Error parsing lesson_data:", e);
        parsedLessonData = null;
      }
    }

    // Debug: Log lesson_data để kiểm tra (chỉ log một lần khi lesson thay đổi)
    // Đã comment để tránh log liên tục, uncomment nếu cần debug
    // if (lesson.lesson_type !== "video") {
    //   console.log("CourseLessonsModal - Lesson data:", {
    //     lesson_type: lesson.lesson_type,
    //     lesson_id: lesson.lesson_id,
    //     title: lesson.title,
    //     raw_lesson_data: lesson.lesson_data,
    //     parsed_lesson_data: parsedLessonData,
    //     has_questions: parsedLessonData?.questions?.length > 0,
    //     has_pairs: parsedLessonData?.pairs?.length > 0,
    //   });
    // }

    // Trả về lesson với lesson_data đã được parse
    return {
      ...lesson,
      lesson_data: parsedLessonData,
    };
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
            <HiXMark />
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
              {/* 错误态 */}
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
              No lessons found{/* 无数据态 */}
            </div>
          ) : (
            <div className="admin-course-lessons-layout">
              {/* Left Side - Render theo lesson_type */}
              <div className="admin-course-lessons-layout__left">
                <div className="admin-course-lessons-video-panel">
                  <div className="admin-course-lessons-video-wrapper">
                    <LessonContent lesson={activeLesson} />
                  </div>
                </div>

                {/* Lesson Info */}
                {/* <header className="admin-course-lessons-course-header">
                  <h2 className="admin-course-lessons-lesson-title">
                    {activeLesson?.title || "Chưa chọn bài học"}
                  </h2>
                  <div className="admin-course-lessons-lesson-meta">
                    <span className="admin-course-lessons-lesson-badge">
                      {lessonTypeLabel(activeLesson)}
                    </span>
                  </div>
                  {activeLesson?.content && (
                    <div className="admin-course-lessons-lesson-content">
                      {activeLesson.content.split("\n").map((line, idx) => (
                        <p key={idx}>{line}</p>
                      ))}
                    </div>
                  )}
                  {activeLesson?.description && (
                    <div className="admin-course-lessons-lesson-content">
                      <p>{activeLesson.description}</p>
                    </div>
                  )}
                </header> */}
              </div>

              {/* Right Side - Sidebar */}
              <aside className="admin-course-lessons-layout__right">
                {modules.map((module) => {
                  const isOpen = activeModuleId === module.module_id; // 是否展开
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
                      {isOpen &&
                        module.lessons &&
                        module.lessons.length > 0 && (
                          <div className="admin-course-lessons-lesson-list">
                            {module.lessons.map((lesson) => {
                              const isActiveLesson =
                                activeLessonId === lesson.lesson_id; // 当前选中
                              return (
                                <div
                                  key={lesson.lesson_id}
                                  className={`admin-course-lessons-lesson-item-wrapper ${
                                    isActiveLesson
                                      ? "admin-course-lessons-lesson-item-wrapper--active"
                                      : ""
                                  }`}
                                >
                                  <button
                                    type="button"
                                    className={`admin-course-lessons-lesson-item ${
                                      isActiveLesson
                                        ? "admin-course-lessons-lesson-item--active"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      handleSelectLesson(
                                        module.module_id,
                                        lesson
                                      )
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
                                      {lessonTypeLabel(lesson)}
                                    </span>
                                  </button>
                                  <button
                                    type="button"
                                    className="admin-course-lessons-lesson-edit-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingLesson(lesson);
                                    }}
                                    title="Edit lesson"
                                  >
                                    <svg
                                      width="16"
                                      height="16"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                      />
                                    </svg>
                                  </button>
                                </div>
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

      {/* Edit Lesson Modal */}
      <EditLessonModal
        open={!!editingLesson}
        onClose={() => setEditingLesson(null)}
        lesson={editingLesson}
        courseId={courseId}
        onSuccess={() => {
          setEditingLesson(null); // 关闭编辑态
          // Refetch course structure to update the lesson list
          // The query will automatically refetch when the mutation succeeds
        }}
      />
    </div>
  );
}

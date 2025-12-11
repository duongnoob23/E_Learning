import React, { useMemo, useState } from "react"; // 引入React及hooks，管理状态和缓存
import { HiXMark } from "react-icons/hi2"; // React Icons
import { renderLessonComponent } from "../../../../Client/components/Lesson/LessonComponentMapper"; // 引入客户端已验证的lesson渲染器，复用9种类型UI
import { useAdminCourseStructure } from "../hooks/useCoursesAdminQueries"; // 引入获取课程结构的自定义hook
import "./CourseLessonsModal.scss"; // 引入样式
import EditLessonModal from "./EditLessonModal"; // 引入编辑lesson弹窗

const convertYoutubeUrlToEmbed = (url) => {
  if (!url) return null; // 无URL则返回空
  try {
    const urlObj = new URL(url); // 解析URL
    let videoId = ""; // 视频ID
    let listId = urlObj.searchParams.get("list"); // 播放列表ID

    if (urlObj.searchParams.get("v")) {
      videoId = urlObj.searchParams.get("v"); // 标准watch参数
    } else if (urlObj.hostname === "youtu.be") {
      videoId = urlObj.pathname.replace("/", ""); // 短链形式
    } else if (urlObj.pathname.startsWith("/embed/")) {
      videoId = urlObj.pathname.split("/embed/")[1]; // embed形式
    } else if (urlObj.pathname.startsWith("/shorts/")) {
      videoId = urlObj.pathname.split("/shorts/")[1]; // shorts形式
    } else if (urlObj.pathname.startsWith("/live/")) {
      videoId = urlObj.pathname.split("/live/")[1]; // live形式
    }

    if (!videoId) return null; // 未识别到ID

    let embedUrl = `https://www.youtube.com/embed/${videoId}`; // 基础embed
    if (listId) {
      embedUrl += `?list=${listId}`; // 附加播放列表
    }
    return embedUrl; // 返回embed链接
  } catch (error) {
    return null; // 解析失败则返回空
  }
};

const lessonTypeLabel = (lesson) => {
  if (!lesson) return "Bài học"; // 空时默认
  const type = lesson.lesson_type; // 读取lesson类型
  switch (type) {
    case "quiz":
      return "Quiz"; // 小测验
    case "assignment":
      return "Bài tập"; // 作业
    case "vocabulary_list":
      return "Danh sách từ"; // 词汇列表
    case "vocabulary_matching":
      return "Tìm cặp"; // 匹配
    case "vocabulary_translation":
      return "Dịch nghĩa"; // 翻译
    case "vocabulary_quiz":
      return "Trắc nghiệm"; // 词汇选择
    case "vocabulary_listening":
      return "Nghe từ"; // 听力
    case "vocabulary_image_choice":
      return "Chọn ảnh"; // 图选
    case "vocabulary_sentence_completion":
      return "Hoàn thiện câu"; // 句子补全
    case "grammar_theory":
      return "Lý thuyết"; // 语法
    case "video":
    default:
      return "Video"; // 默认视频
  }
};

const LessonContent = ({ lesson }) => {
  if (!lesson) {
    return (
      <div className="admin-course-lessons-video-placeholder">
        Chọn bài học để xem{/* 选择课程占位 */}
      </div>
    );
  }

  if (lesson.lesson_type === "video") {
    const embed = convertYoutubeUrlToEmbed(lesson.video_url); // 转换视频URL
    return embed ? (
      <div className="admin-course-lessons-video-frame">
        <iframe
          src={embed}
          title={lesson.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    ) : (
      <div className="admin-course-lessons-video-placeholder">
        Video không hợp lệ{/* 视频无效占位 */}
      </div>
    );
  }

  return (
    <div className="admin-course-lessons-dynamic-wrapper">
      {renderLessonComponent(lesson)}
    </div>
  );
};

export default function CourseLessonsModal({ open, onClose, courseId }) {
  const [activeModuleId, setActiveModuleId] = useState(null); // 当前展开的module
  const [activeLessonId, setActiveLessonId] = useState(null); // 当前选中的lesson
  const [editingLesson, setEditingLesson] = useState(null); // 正在编辑的lesson

  const {
    data: courseStructureRes,
    isLoading,
    error,
  } = useAdminCourseStructure(courseId, open && !!courseId); // 请求课程结构
  const courseStructure = courseStructureRes?.DT || null; // 解析数据DT
  const course = courseStructure?.course || {}; // 课程信息
  const modules = courseStructure?.modules || []; // 模块列表

  React.useEffect(() => {
    if (open && modules.length > 0 && !activeModuleId) {
      const firstModule = modules[0]; // 默认取第一个模块
      setActiveModuleId(firstModule.module_id); // 设置激活模块
      if (firstModule.lessons && firstModule.lessons.length > 0) {
        setActiveLessonId(firstModule.lessons[0].lesson_id); // 设置激活lesson
      }
    }
  }, [open, modules, activeModuleId]); // 依赖打开状态和数据

  const activeModule = useMemo(
    () => modules.find((m) => m.module_id === activeModuleId) || modules[0],
    [modules, activeModuleId]
  ); // 计算当前模块

  const activeLesson = useMemo(() => {
    if (!activeModule) return null; // 无模块返回空
    return (
      activeModule.lessons?.find((l) => l.lesson_id === activeLessonId) ||
      activeModule.lessons?.[0]
    ); // 找到激活lesson或第一个
  }, [activeModule, activeLessonId]);

  const handleToggleModule = (moduleId) => {
    setActiveModuleId((prev) => (prev === moduleId ? null : moduleId)); // 切换展开/收起
  };

  const handleSelectLesson = (moduleId, lesson) => {
    setActiveModuleId(moduleId); // 切换模块
    setActiveLessonId(lesson.lesson_id); // 设定选中lesson
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
              {/* 标题 */}
            </div>
            <div
              style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}
            >
              {modules.length} modules • {course?.total_lessons || 0} lessons
              {/* 统计 */}
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
              Loading...{/* 加载态 */}
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
                <header className="admin-course-lessons-course-header">
                  <h2 className="admin-course-lessons-lesson-title">
                    {activeLesson?.title || "Chưa chọn bài học"}
                    {/* 标题 */}
                  </h2>
                  <div className="admin-course-lessons-lesson-meta">
                    <span className="admin-course-lessons-lesson-badge">
                      {lessonTypeLabel(activeLesson)}
                      {/* 类型徽标 */}
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
                </header>
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

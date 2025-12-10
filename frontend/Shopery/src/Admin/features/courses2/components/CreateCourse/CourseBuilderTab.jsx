import React, { useState } from "react";
import "./CourseBuilderTab.scss";
import LessonStudioModal from "./LessonStudioModal";
import LessonTypeSelectionModal from "./LessonTypeSelectionModal";

// Mapping lesson types to icons
const LESSON_TYPE_ICONS = {
  video: "🎥",
  vocabulary_list: "📝",
  vocabulary_matching: "🔗",
  vocabulary_translation: "🔄",
  vocabulary_quiz: "❓",
  vocabulary_listening: "👂",
  vocabulary_image_choice: "🖼️",
  vocabulary_sentence_completion: "✏️",
  grammar_theory: "📚",
};

const LESSON_TYPE_NAMES = {
  video: "Video",
  vocabulary_list: "Vocabulary List",
  vocabulary_matching: "Matching",
  vocabulary_translation: "Translation",
  vocabulary_quiz: "Quiz",
  vocabulary_listening: "Listening",
  vocabulary_image_choice: "Image Choice",
  vocabulary_sentence_completion: "Sentence",
  grammar_theory: "Grammar",
};

export default function CourseBuilderTab({
  modules = [],
  onChange,
  errors = {},
  modulesRef,
}) {
  const [editingModule, setEditingModule] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [showLessonTypeModal, setShowLessonTypeModal] = useState(false);
  const [showLessonStudioModal, setShowLessonStudioModal] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [selectedLessonType, setSelectedLessonType] = useState(null);

  const handleAddModule = () => {
    const newModule = {
      id: Date.now(),
      title: `Module ${modules.length + 1}`,
      name: `Module ${modules.length + 1}`, // Keep for backward compatibility
      lessons: [],
    };
    onChange([...modules, newModule]);
  };

  const handleEditModule = (moduleId, newTitle) => {
    onChange(
      modules.map((m) =>
        m.id === moduleId ? { ...m, title: newTitle, name: newTitle } : m
      )
    );
    setEditingModule(null);
  };

  const handleDeleteModule = (moduleId) => {
    if (
      window.confirm(
        "Are you sure? This will delete all lessons in this module."
      )
    ) {
      onChange(modules.filter((m) => m.id !== moduleId));
    }
  };

  const handleAddLesson = (moduleId) => {
    setSelectedModuleId(moduleId);
    setEditingLesson(null);
    setSelectedLessonType(null);
    setShowLessonTypeModal(true);
  };

  const handleSelectLessonType = (lessonType) => {
    console.log("handleSelectLessonType called with:", lessonType);
    // Set selectedLessonType trước
    setSelectedLessonType(lessonType);
    // Đóng modal chọn loại
    setShowLessonTypeModal(false);
    // Mở modal studio - dùng setTimeout để đảm bảo state được set
    setTimeout(() => {
      setShowLessonStudioModal(true);
      console.log("Opening LessonStudioModal for:", lessonType);
    }, 50);
  };

  const handleEditLesson = (moduleId, lesson) => {
    console.log("handleEditLesson called with lesson:", lesson);
    setSelectedModuleId(moduleId);
    setEditingLesson(lesson);

    const lessonType = lesson.lessonType || lesson.lesson_type || "video";
    setSelectedLessonType(lessonType);

    // Tất cả lesson types đều dùng LessonStudioModal
    setShowLessonStudioModal(true);
  };

  const handleSaveLesson = (lessonData) => {
    console.log("handleSaveLesson called with:", lessonData);

    const updatedModules = modules.map((module) => {
      if (module.id === selectedModuleId) {
        if (editingLesson) {
          // Update existing lesson
          return {
            ...module,
            lessons: module.lessons.map((l) => {
              if (l.id === editingLesson.id) {
                const updatedLesson = {
                  ...l,
                  ...lessonData,
                  // Đảm bảo có lessonType
                  lessonType: lessonData.lessonType || l.lessonType || "video",
                  // Đảm bảo lesson_data được lưu
                  lesson_data: lessonData.lesson_data || l.lesson_data || null,
                };
                console.log("Updating lesson:", updatedLesson);
                return updatedLesson;
              }
              return l;
            }),
          };
        } else {
          // Add new lesson
          const newLesson = {
            id: Date.now(),
            ...lessonData,
            // Đảm bảo có lessonType
            lessonType: lessonData.lessonType || selectedLessonType || "video",
            // Đảm bảo lesson_data được lưu
            lesson_data: lessonData.lesson_data || null,
          };
          console.log("Adding new lesson:", newLesson);

          return {
            ...module,
            lessons: [...module.lessons, newLesson],
          };
        }
      }
      return module;
    });

    console.log("Updated modules:", updatedModules);
    onChange(updatedModules);
    setShowLessonStudioModal(false);
    setEditingLesson(null);
    setSelectedModuleId(null);
    setSelectedLessonType(null);
  };

  const handleDeleteLesson = (moduleId, lessonId) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      onChange(
        modules.map((module) =>
          module.id === moduleId
            ? {
                ...module,
                lessons: module.lessons.filter((l) => l.id !== lessonId),
              }
            : module
        )
      );
    }
  };

  return (
    <div className="course-builder-tab" ref={modulesRef}>
      <h2 className="course-builder-tab__title">
        Course Builder <span style={{ color: "#ef4444" }}>*</span>
      </h2>

      {/* Error message for modules */}
      {errors.modules && (
        <div
          className="course-builder-tab__error"
          style={{
            color: "red",
            marginBottom: "16px",
            padding: "8px",
            backgroundColor: "#fee",
            borderRadius: "4px",
          }}
        >
          {errors.modules?.message ||
            (typeof errors.modules === "string"
              ? errors.modules
              : "At least one module is required")}
        </div>
      )}

      {/* Modules List */}
      <div className="course-builder-tab__modules">
        {modules.map((module, moduleIndex) => {
          // ✅ Lấy error message đúng cách (chỉ string, không phải object)
          const moduleTitleError = errors[`module_${moduleIndex}_title`];
          const moduleError = errors[`module_${moduleIndex}`];
          const moduleTitleErrorMsg =
            moduleTitleError?.message ||
            (typeof moduleTitleError === "string" ? moduleTitleError : null);
          const moduleErrorMsg =
            moduleError?.message ||
            (typeof moduleError === "string" ? moduleError : null);

          return (
            <div key={module.id} className="course-builder-tab__module">
              <div className="course-builder-tab__module-header">
                {editingModule === module.id ? (
                  <input
                    type="text"
                    className={`course-builder-tab__module-name-input ${
                      moduleTitleErrorMsg
                        ? "course-builder-tab__module-name-input--error"
                        : ""
                    }`}
                    value={module.title || module.name}
                    onChange={(e) =>
                      onChange(
                        modules.map((m) =>
                          m.id === module.id
                            ? {
                                ...m,
                                title: e.target.value,
                                name: e.target.value,
                              }
                            : m
                        )
                      )
                    }
                    onBlur={() =>
                      handleEditModule(module.id, module.title || module.name)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleEditModule(
                          module.id,
                          module.title || module.name
                        );
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <>
                    <h3 className="course-builder-tab__module-title">
                      {module.title || module.name}
                    </h3>
                    {/* Error for module title */}
                    {moduleTitleErrorMsg && (
                      <div
                        className="course-builder-tab__error"
                        style={{
                          color: "red",
                          fontSize: "12px",
                          marginTop: "4px",
                        }}
                      >
                        {moduleTitleErrorMsg}
                      </div>
                    )}
                    {/* Error for module lessons */}
                    {moduleErrorMsg && (
                      <div
                        className="course-builder-tab__error"
                        style={{
                          color: "red",
                          fontSize: "12px",
                          marginTop: "4px",
                        }}
                      >
                        {moduleErrorMsg}
                      </div>
                    )}
                    <div className="course-builder-tab__module-actions">
                      <button
                        className="course-builder-tab__module-btn"
                        onClick={() => setEditingModule(module.id)}
                        title="Edit module name"
                      >
                        ✏️
                      </button>
                      <button
                        className="course-builder-tab__module-btn course-builder-tab__module-btn--delete"
                        onClick={() => handleDeleteModule(module.id)}
                        title="Delete module"
                      >
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Lessons List */}
              <div className="course-builder-tab__lessons">
                {module.lessons.map((lesson, lessonIndex) => {
                  // ✅ Lấy error message đúng cách (chỉ string, không phải object)
                  const lessonTitleError =
                    errors[`lesson_${moduleIndex}_${lessonIndex}_title`];
                  const lessonVideoUrlError =
                    errors[`lesson_${moduleIndex}_${lessonIndex}_videoUrl`];
                  const lessonTitleErrorMsg =
                    lessonTitleError?.message ||
                    (typeof lessonTitleError === "string"
                      ? lessonTitleError
                      : null);
                  const lessonVideoUrlErrorMsg =
                    lessonVideoUrlError?.message ||
                    (typeof lessonVideoUrlError === "string"
                      ? lessonVideoUrlError
                      : null);

                  return (
                    <div key={lesson.id} className="course-builder-tab__lesson">
                      <div className="course-builder-tab__lesson-drag">⋮⋮</div>
                      <div className="course-builder-tab__lesson-content">
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <h4
                            className={`course-builder-tab__lesson-title ${
                              lessonTitleErrorMsg
                                ? "course-builder-tab__lesson-title--error"
                                : ""
                            }`}
                          >
                            {lesson.title || "Untitled Lesson"}
                          </h4>
                          {lesson.lessonType || lesson.lesson_type ? (
                            <span
                              style={{
                                fontSize: "11px",
                                padding: "2px 8px",
                                backgroundColor: "#e0f2fe",
                                color: "#0369a1",
                                borderRadius: "12px",
                                fontWeight: "500",
                              }}
                            >
                              {LESSON_TYPE_ICONS[
                                lesson.lessonType || lesson.lesson_type
                              ] || "📄"}{" "}
                              {LESSON_TYPE_NAMES[
                                lesson.lessonType || lesson.lesson_type
                              ] || "Lesson"}
                            </span>
                          ) : (
                            <span
                              style={{
                                fontSize: "11px",
                                padding: "2px 8px",
                                backgroundColor: "#e0f2fe",
                                color: "#0369a1",
                                borderRadius: "12px",
                                fontWeight: "500",
                              }}
                            >
                              🎥 Video
                            </span>
                          )}
                        </div>
                        {lessonTitleErrorMsg && (
                          <div
                            className="course-builder-tab__error"
                            style={{
                              color: "red",
                              fontSize: "12px",
                              marginTop: "4px",
                            }}
                          >
                            {lessonTitleErrorMsg}
                          </div>
                        )}
                        {lessonVideoUrlErrorMsg && (
                          <div
                            className="course-builder-tab__error"
                            style={{
                              color: "red",
                              fontSize: "12px",
                              marginTop: "4px",
                            }}
                          >
                            {lessonVideoUrlErrorMsg}
                          </div>
                        )}
                        {lesson.description && (
                          <p className="course-builder-tab__lesson-desc">
                            {lesson.description}
                          </p>
                        )}
                        <div className="course-builder-tab__lesson-meta">
                          {lesson.lessonType === "video" ||
                          !lesson.lessonType ? (
                            <span className="course-builder-tab__lesson-source">
                              {lesson.videoSource}
                            </span>
                          ) : (
                            <span className="course-builder-tab__lesson-source">
                              {lesson.lesson_data
                                ? `${
                                    Object.keys(lesson.lesson_data).length > 0
                                      ? "Đã có nội dung"
                                      : "Chưa có nội dung"
                                  }`
                                : "Chưa có nội dung"}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="course-builder-tab__lesson-actions">
                        <button
                          className="course-builder-tab__lesson-btn"
                          onClick={() => handleEditLesson(module.id, lesson)}
                          title="Edit lesson"
                        >
                          ✏️
                        </button>
                        <button
                          className="course-builder-tab__lesson-btn course-builder-tab__lesson-btn--delete"
                          onClick={() =>
                            handleDeleteLesson(module.id, lesson.id)
                          }
                          title="Delete lesson"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                })}
                <button
                  className="course-builder-tab__add-lesson-btn"
                  onClick={() => handleAddLesson(module.id)}
                >
                  + Add New Lesson
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Module Button */}
      <button
        className="course-builder-tab__add-module-btn"
        onClick={handleAddModule}
      >
        + Add New Topic
      </button>

      {/* Validation Errors - Đã xử lý ở trên, không cần render lại */}

      {/* Lesson Type Selection Modal */}
      {showLessonTypeModal && (
        <LessonTypeSelectionModal
          open={showLessonTypeModal}
          onClose={() => {
            setShowLessonTypeModal(false);
            // Không reset selectedLessonType ở đây vì nó cần cho LessonStudioModal
            // setSelectedModuleId(null);
            // setSelectedLessonType(null);
          }}
          onSelect={handleSelectLessonType}
        />
      )}

      {/* Lesson Studio Modal (cho tất cả lesson types) */}
      {showLessonStudioModal && selectedLessonType && (
        <LessonStudioModal
          key={`${selectedLessonType}-${editingLesson?.id || "new"}`}
          open={showLessonStudioModal}
          onClose={() => {
            setShowLessonStudioModal(false);
            setEditingLesson(null);
            setSelectedModuleId(null);
            setSelectedLessonType(null);
          }}
          lessonType={selectedLessonType}
          initialData={
            editingLesson
              ? {
                  title: editingLesson.title || "",
                  lesson_data: editingLesson.lesson_data || null,
                  description: editingLesson.description || "",
                  content: editingLesson.content || "",
                  videoUrl: editingLesson.videoUrl || "",
                  videoSource: editingLesson.videoSource || "",
                  isFree: editingLesson.isFree || false,
                }
              : null
          }
          onSave={handleSaveLesson}
        />
      )}
    </div>
  );
}

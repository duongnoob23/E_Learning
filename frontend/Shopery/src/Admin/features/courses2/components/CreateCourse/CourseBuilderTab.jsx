import React, { useState } from "react";
import "./CourseBuilderTab.scss";
import LessonFormModal from "./LessonFormModal";

export default function CourseBuilderTab({
  modules = [],
  onChange,
  errors = {},
  modulesRef,
}) {
  const [editingModule, setEditingModule] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState(null);

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
    setShowLessonModal(true);
  };

  const handleEditLesson = (moduleId, lesson) => {
    setSelectedModuleId(moduleId);
    setEditingLesson(lesson);
    setShowLessonModal(true);
  };

  const handleSaveLesson = (lessonData) => {
    const updatedModules = modules.map((module) => {
      if (module.id === selectedModuleId) {
        if (editingLesson) {
          // Update existing lesson
          return {
            ...module,
            lessons: module.lessons.map((l) =>
              l.id === editingLesson.id ? { ...l, ...lessonData } : l
            ),
          };
        } else {
          // Add new lesson
          return {
            ...module,
            lessons: [...module.lessons, { id: Date.now(), ...lessonData }],
          };
        }
      }
      return module;
    });
    onChange(updatedModules);
    setShowLessonModal(false);
    setEditingLesson(null);
    setSelectedModuleId(null);
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
                        <h4
                          className={`course-builder-tab__lesson-title ${
                            lessonTitleErrorMsg
                              ? "course-builder-tab__lesson-title--error"
                              : ""
                          }`}
                        >
                          {lesson.title || "Untitled Lesson"}
                        </h4>
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
                          <span className="course-builder-tab__lesson-source">
                            {lesson.videoSource}
                          </span>
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

      {/* Lesson Form Modal */}
      {showLessonModal && (
        <LessonFormModal
          open={showLessonModal}
          onClose={() => {
            setShowLessonModal(false);
            setEditingLesson(null);
            setSelectedModuleId(null);
          }}
          lesson={editingLesson}
          onSave={handleSaveLesson}
        />
      )}
    </div>
  );
}

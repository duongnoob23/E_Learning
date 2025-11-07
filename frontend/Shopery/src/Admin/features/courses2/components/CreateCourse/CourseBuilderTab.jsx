import React, { useState } from "react";
import LessonFormModal from "./LessonFormModal";
import "./CourseBuilderTab.scss";

export default function CourseBuilderTab({ modules = [], onChange, errors = {} }) {
  const [editingModule, setEditingModule] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState(null);

  const handleAddModule = () => {
    const newModule = {
      id: Date.now(),
      name: `Module ${modules.length + 1}`,
      lessons: [],
    };
    onChange([...modules, newModule]);
  };

  const handleEditModule = (moduleId, newName) => {
    onChange(
      modules.map((m) => (m.id === moduleId ? { ...m, name: newName } : m))
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
            lessons: [
              ...module.lessons,
              { id: Date.now(), ...lessonData },
            ],
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
    <div className="course-builder-tab">
      <h2 className="course-builder-tab__title">Course Builder</h2>

      {/* Modules List */}
      <div className="course-builder-tab__modules">
        {modules.map((module) => (
          <div key={module.id} className="course-builder-tab__module">
            <div className="course-builder-tab__module-header">
              {editingModule === module.id ? (
                <input
                  type="text"
                  className="course-builder-tab__module-name-input"
                  value={module.name}
                  onChange={(e) =>
                    onChange(
                      modules.map((m) =>
                        m.id === module.id ? { ...m, name: e.target.value } : m
                      )
                    )
                  }
                  onBlur={() => handleEditModule(module.id, module.name)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleEditModule(module.id, module.name);
                    }
                  }}
                  autoFocus
                />
              ) : (
                <>
                  <h3 className="course-builder-tab__module-title">
                    {module.name}
                  </h3>
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
              {module.lessons.map((lesson) => (
                <div key={lesson.id} className="course-builder-tab__lesson">
                  <div className="course-builder-tab__lesson-drag">⋮⋮</div>
                  <div className="course-builder-tab__lesson-content">
                    <h4 className="course-builder-tab__lesson-title">
                      {lesson.title}
                    </h4>
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
                      onClick={() => handleDeleteLesson(module.id, lesson.id)}
                      title="Delete lesson"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
              <button
                className="course-builder-tab__add-lesson-btn"
                onClick={() => handleAddLesson(module.id)}
              >
                + Add New Lesson
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Module Button */}
      <button
        className="course-builder-tab__add-module-btn"
        onClick={handleAddModule}
      >
        + Add New Topic
      </button>

      {/* Validation Errors */}
      {errors.modules && (
        <div className="course-builder-tab__error">{errors.modules}</div>
      )}
      {modules.map((module, moduleIndex) => {
        const moduleError = errors[`module_${moduleIndex}`];
        if (moduleError) {
          return (
            <div key={`error-${module.id}`} className="course-builder-tab__error">
              {module.name}: {moduleError}
            </div>
          );
        }
        return null;
      })}

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


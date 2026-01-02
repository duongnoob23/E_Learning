import React, { useState } from "react";
// React Icons
import {
  HiArrowPath,
  HiBookOpen,
  HiDocumentText,
  HiLink,
  HiPencil,
  HiPhoto,
  HiQuestionMarkCircle,
  HiSpeakerWave,
  HiVideoCamera,
} from "react-icons/hi2";
import "./CourseBuilderTab.scss";
import LessonStudioModal from "./LessonStudioModal";
import LessonTypeSelectionModal from "./LessonTypeSelectionModal";

// Mapping lesson types to icons
const LESSON_TYPE_ICONS = {
  video: HiVideoCamera,
  vocabulary_list: HiDocumentText,
  vocabulary_matching: HiLink,
  vocabulary_translation: HiArrowPath,
  vocabulary_quiz: HiQuestionMarkCircle,
  vocabulary_listening: HiSpeakerWave,
  vocabulary_image_choice: HiPhoto,
  vocabulary_sentence_completion: HiPencil,
  grammar_theory: HiBookOpen,
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
    console.log(
      "Raw lesson_data:",
      lesson.lesson_data,
      "Type:",
      typeof lesson.lesson_data
    );
    setSelectedModuleId(moduleId);

    // QUAN TRỌNG: Parse lesson_data nếu là string JSON
    let parsedLessonData = lesson.lesson_data;
    if (parsedLessonData && typeof parsedLessonData === "string") {
      try {
        parsedLessonData = JSON.parse(parsedLessonData);
        console.log("Parsed lesson_data:", parsedLessonData);
      } catch (e) {
        console.error("Error parsing lesson_data:", e);
        parsedLessonData = null;
      }
    }

    // Nếu lesson_data là null/undefined, giữ nguyên (không convert thành {})
    if (parsedLessonData === undefined) {
      parsedLessonData = null;
    }

    const lessonWithParsedData = {
      ...lesson,
      lesson_data: parsedLessonData,
    };

    console.log("Final lesson for edit:", lessonWithParsedData);
    setEditingLesson(lessonWithParsedData);

    const lessonType = lesson.lessonType || lesson.lesson_type || "video";
    setSelectedLessonType(lessonType);

    // Tất cả lesson types đều dùng LessonStudioModal
    setShowLessonStudioModal(true);
  };

  const handleSaveLesson = (lessonData) => {
    console.log("handleSaveLesson called with:", lessonData);
    console.log("editingLesson:", editingLesson);
    console.log("selectedModuleId:", selectedModuleId);

    const updatedModules = modules.map((module) => {
      if (module.id === selectedModuleId) {
        if (editingLesson) {
          // Update existing lesson - QUAN TRỌNG: Match bằng cả id và lesson_id
          return {
            ...module,
            lessons: module.lessons.map((l) => {
              const isMatch =
                l.id === editingLesson.id ||
                l.lesson_id === editingLesson.id ||
                l.id === editingLesson.lesson_id ||
                l.lesson_id === editingLesson.lesson_id;

              if (isMatch) {
                const updatedLesson = {
                  ...l,
                  title: lessonData.title || l.title || "",
                  description: lessonData.description || l.description || "",
                  // QUAN TRỌNG: Giữ nguyên lessonType và lesson_data từ lessonData
                  lessonType:
                    lessonData.lessonType ||
                    l.lessonType ||
                    selectedLessonType ||
                    "video",
                  lesson_type:
                    lessonData.lessonType ||
                    lessonData.lesson_type ||
                    l.lesson_type ||
                    l.lessonType ||
                    selectedLessonType ||
                    "video",
                  // QUAN TRỌNG: lesson_data phải lấy từ lessonData.lesson_data hoặc lessonData (nếu lessonData có type)
                  lesson_data: (() => {
                    let finalLessonData = null;
                    if (lessonData.lesson_data !== undefined) {
                      finalLessonData = lessonData.lesson_data;
                    } else if (lessonData.type) {
                      finalLessonData = lessonData;
                    } else {
                      finalLessonData = l.lesson_data || null;
                    }
                    console.log(
                      "CourseBuilderTab - Final lesson_data for update:",
                      {
                        has_lesson_data: !!finalLessonData,
                        lesson_data: finalLessonData,
                        lessonData_has_type: !!lessonData.type,
                        lessonData_has_lesson_data:
                          lessonData.lesson_data !== undefined,
                      }
                    );
                    return finalLessonData;
                  })(),
                  isFree:
                    lessonData.isFree !== undefined
                      ? lessonData.isFree
                      : l.isFree || false,
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
            title: lessonData.title || "",
            description: lessonData.description || "",
            // QUAN TRỌNG: Đảm bảo lessonType và lesson_data được lưu
            lessonType: lessonData.lessonType || selectedLessonType || "video",
            lesson_type:
              lessonData.lessonType ||
              lessonData.lesson_type ||
              selectedLessonType ||
              "video",
            lesson_data: (() => {
              let finalLessonData = null;
              if (lessonData.lesson_data !== undefined) {
                finalLessonData = lessonData.lesson_data;
              } else if (lessonData.type) {
                finalLessonData = lessonData;
              } else {
                finalLessonData = null;
              }
              console.log(
                "CourseBuilderTab - Final lesson_data for new lesson:",
                {
                  has_lesson_data: !!finalLessonData,
                  lesson_data: finalLessonData,
                  lessonData_has_type: !!lessonData.type,
                  lessonData_has_lesson_data:
                    lessonData.lesson_data !== undefined,
                }
              );
              return finalLessonData;
            })(),
            isFree: lessonData.isFree || false,
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
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              {React.createElement(
                                LESSON_TYPE_ICONS[
                                  lesson.lessonType || lesson.lesson_type
                                ] || HiDocumentText,
                                { style: { width: "14px", height: "14px" } }
                              )}
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
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <HiVideoCamera
                                style={{ width: "14px", height: "14px" }}
                              />
                              Video
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
                  lessonType:
                    editingLesson.lessonType ||
                    editingLesson.lesson_type ||
                    "video", // QUAN TRỌNG: Truyền lessonType
                  lesson_data: editingLesson.lesson_data || null, // QUAN TRỌNG: Truyền lesson_data
                  description: editingLesson.description || "",
                  content: editingLesson.content || "",
                  videoUrl:
                    editingLesson.videoUrl ||
                    editingLesson.lesson_data?.video_url ||
                    "",
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

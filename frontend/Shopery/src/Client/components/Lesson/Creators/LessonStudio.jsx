// LessonStudio.jsx - Hệ thống tạo lesson thông minh với Visual Editor + Preview
import React, { useState, useEffect } from "react";
import { renderLessonComponent } from "../LessonComponentMapper";
import TemplateLibrary from "./TemplateLibrary";
import VisualEditor from "./VisualEditor";
import QuickActions from "./QuickActions";
import "./LessonStudio.css";

export default function LessonStudio({ lessonType, initialData, onSave }) {
  const [lessonData, setLessonData] = useState(initialData || getDefaultData(lessonType));
  const [viewMode, setViewMode] = useState("split"); // "editor", "preview", "split"
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);

  // Update preview khi data thay đổi
  useEffect(() => {
    // Auto-save hoặc trigger preview update
  }, [lessonData]);

  const handleDataChange = (newData) => {
    setLessonData(newData);
  };

  const handleUseTemplate = (template) => {
    setLessonData(template.data);
    setSelectedTemplate(template);
    setShowTemplates(false);
  };

  const handleQuickAction = (action, params) => {
    // Xử lý quick actions: add question, duplicate, etc.
    switch (action) {
      case "add_question":
        handleAddQuestion();
        break;
      case "duplicate_question":
        handleDuplicateQuestion(params.index);
        break;
      case "import_json":
        handleImportJSON();
        break;
      case "export_json":
        handleExportJSON();
        break;
      default:
        break;
    }
  };

  const handleAddQuestion = () => {
    const newQuestion = getDefaultQuestion(lessonType);
    setLessonData({
      ...lessonData,
      questions: [...(lessonData.questions || []), newQuestion],
    });
  };

  const handleDuplicateQuestion = (index) => {
    const questions = [...(lessonData.questions || [])];
    const duplicated = JSON.parse(JSON.stringify(questions[index]));
    duplicated.question_id = Date.now();
    questions.splice(index + 1, 0, duplicated);
    setLessonData({ ...lessonData, questions });
  };

  const handleImportJSON = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          setLessonData(imported);
        } catch (error) {
          alert("Lỗi đọc file JSON: " + error.message);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(lessonData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lesson_${lessonType}_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Render preview lesson
  const previewLesson = {
    lesson_id: 0,
    title: "Preview",
    description: "Xem trước lesson",
    lesson_type: lessonType,
    lesson_data: lessonData,
  };

  return (
    <div className="lesson-studio">
      {/* Toolbar */}
      <div className="lesson-studio-toolbar">
        <div className="lesson-studio-toolbar-left">
          <button
            className="lesson-studio-btn lesson-studio-btn-primary"
            onClick={() => setShowTemplates(!showTemplates)}
          >
            📚 Templates
          </button>
          <QuickActions
            lessonType={lessonType}
            onAction={handleQuickAction}
            questionsCount={lessonData.questions?.length || 0}
          />
        </div>

        <div className="lesson-studio-toolbar-center">
          <div className="lesson-studio-view-mode">
            <button
              className={`lesson-studio-view-btn ${
                viewMode === "editor" ? "active" : ""
              }`}
              onClick={() => setViewMode("editor")}
              title="Chỉ Editor"
            >
              ✏️ Editor
            </button>
            <button
              className={`lesson-studio-view-btn ${
                viewMode === "split" ? "active" : ""
              }`}
              onClick={() => setViewMode("split")}
              title="Chia đôi"
            >
              ⚡ Split
            </button>
            <button
              className={`lesson-studio-view-btn ${
                viewMode === "preview" ? "active" : ""
              }`}
              onClick={() => setViewMode("preview")}
              title="Chỉ Preview"
            >
              👁️ Preview
            </button>
          </div>
        </div>

        <div className="lesson-studio-toolbar-right">
          <button
            className="lesson-studio-btn"
            onClick={handleImportJSON}
            title="Import JSON"
          >
            📥 Import
          </button>
          <button
            className="lesson-studio-btn"
            onClick={handleExportJSON}
            title="Export JSON"
          >
            📤 Export
          </button>
          <button
            className="lesson-studio-btn lesson-studio-btn-save"
            onClick={() => onSave?.(lessonData)}
          >
            💾 Lưu
          </button>
        </div>
      </div>

      {/* Template Library */}
      {showTemplates && (
        <TemplateLibrary
          lessonType={lessonType}
          onSelect={handleUseTemplate}
          onClose={() => setShowTemplates(false)}
        />
      )}

      {/* Main Content */}
      <div className="lesson-studio-content">
        {(viewMode === "editor" || viewMode === "split") && (
          <div
            className={`lesson-studio-editor ${
              viewMode === "split" ? "split-view" : "full-view"
            }`}
          >
            <VisualEditor
              lessonType={lessonType}
              data={lessonData}
              onChange={handleDataChange}
            />
          </div>
        )}

        {(viewMode === "preview" || viewMode === "split") && (
          <div
            className={`lesson-studio-preview ${
              viewMode === "split" ? "split-view" : "full-view"
            }`}
          >
            <div className="lesson-studio-preview-header">
              <h3>Preview</h3>
              <span className="lesson-studio-preview-badge">
                {lessonData.questions?.length || 0} câu hỏi
              </span>
            </div>
            <div className="lesson-studio-preview-content">
              {renderLessonComponent(previewLesson)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper functions
function getDefaultData(lessonType) {
  const defaults = {
    vocabulary_list: {
      type: "vocabulary_list",
      display_mode: "flashcard",
      words: [],
    },
    vocabulary_matching: {
      type: "vocabulary_matching",
      questions: [],
    },
    vocabulary_translation: {
      type: "vocabulary_translation",
      questions: [],
    },
    vocabulary_quiz: {
      type: "vocabulary_quiz",
      questions: [],
    },
    vocabulary_listening: {
      type: "vocabulary_listening",
      questions: [],
    },
    vocabulary_image_choice: {
      type: "vocabulary_image_choice",
      questions: [],
    },
    vocabulary_sentence_completion: {
      type: "vocabulary_sentence_completion",
      questions: [],
    },
  };
  return defaults[lessonType] || {};
}

function getDefaultQuestion(lessonType) {
  const defaults = {
    vocabulary_matching: {
      question_id: Date.now(),
      pairs: [],
      grid_size: { rows: 4, cols: 4 },
    },
    vocabulary_translation: {
      question_id: Date.now(),
      vi_text: "",
      image_url: "",
      correct_answer: "",
    },
    vocabulary_quiz: {
      question_id: Date.now(),
      question_type: "text",
      question_text: "",
      choices: [],
    },
    vocabulary_listening: {
      question_id: Date.now(),
      audio_url: "",
      grid: { rows: 3, cols: 3, cells: [] },
      play_count: 3,
    },
    vocabulary_image_choice: {
      question_id: Date.now(),
      question_type: "text",
      question_text: "",
      images: [],
    },
    vocabulary_sentence_completion: {
      question_id: Date.now(),
      vi_text: "",
      sentence_template: "",
      shuffled_words: [],
      blanks: [],
    },
  };
  return defaults[lessonType] || { question_id: Date.now() };
}


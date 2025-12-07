// LessonStudio.jsx - Hệ thống tạo lesson (chỉ Editor, không có Preview)
import React, { useState } from "react";
import TemplateLibrary from "./TemplateLibrary";
import VisualEditor from "./VisualEditor";
import ImportGuide from "./ImportGuide";
import JSONEditor from "./JSONEditor";
import "./LessonStudio.css";

export default function LessonStudio({ lessonType, initialData, onSave }) {
  const [lessonData, setLessonData] = useState(initialData || getDefaultData(lessonType));
  const [showTemplates, setShowTemplates] = useState(false);
  const [showImportGuide, setShowImportGuide] = useState(false);
  const [showJSONEditor, setShowJSONEditor] = useState(false);

  const handleDataChange = (newData) => {
    setLessonData(newData);
  };

  const handleUseTemplate = (template) => {
    setLessonData(template.data);
    setShowTemplates(false);
  };

  const handleImportJSON = () => {
    setShowJSONEditor(true);
  };

  const handleImportFromFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          handleImportData(imported);
        } catch (error) {
          alert("Lỗi đọc file JSON: " + error.message);
          setShowImportGuide(true);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleImportData = (imported) => {
    // Validate imported data
    if (validateImportedData(imported, lessonType)) {
      setLessonData(imported);
      alert("Import thành công!");
    } else {
      alert("File JSON không đúng format. Vui lòng xem hướng dẫn.");
      setShowImportGuide(true);
    }
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
        </div>

        <div className="lesson-studio-toolbar-right">
          <div className="lesson-studio-import-group">
            <button
              className="lesson-studio-btn"
              onClick={handleImportJSON}
              title="Nhập/Paste JSON"
            >
              📝 Nhập JSON
            </button>
            <button
              className="lesson-studio-btn"
              onClick={handleImportFromFile}
              title="Import từ file"
            >
              📥 Import File
            </button>
            <button
              className="lesson-studio-info-btn"
              onClick={() => setShowImportGuide(!showImportGuide)}
              title="Hướng dẫn format JSON"
            >
              ℹ️
            </button>
          </div>
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

      {/* JSON Editor */}
      {showJSONEditor && (
        <JSONEditor
          lessonType={lessonType}
          currentData={lessonData}
          onImport={handleImportData}
          onClose={() => setShowJSONEditor(false)}
        />
      )}

      {/* Import Guide */}
      {showImportGuide && (
        <ImportGuide
          lessonType={lessonType}
          onClose={() => setShowImportGuide(false)}
        />
      )}

      {/* Template Library */}
      {showTemplates && (
        <TemplateLibrary
          lessonType={lessonType}
          onSelect={handleUseTemplate}
          onClose={() => setShowTemplates(false)}
        />
      )}

      {/* Editor Content */}
      <div className="lesson-studio-content">
        <div className="lesson-studio-editor">
          <VisualEditor
            lessonType={lessonType}
            data={lessonData}
            onChange={handleDataChange}
          />
        </div>
      </div>
    </div>
  );
}

// Validate imported data
function validateImportedData(data, lessonType) {
  if (!data || !data.type || data.type !== lessonType) {
    return false;
  }

  switch (lessonType) {
    case "vocabulary_matching":
      if (!data.questions || !Array.isArray(data.questions)) return false;
      return data.questions.every((q) => {
        if (!q.pairs || !q.grid_size) return false;
        const maxPairs = (q.grid_size.rows * q.grid_size.cols) / 2;
        return q.pairs.length <= maxPairs;
      });

    case "vocabulary_translation":
      if (!data.questions || !Array.isArray(data.questions)) return false;
      return data.questions.every(
        (q) => q.vi_text && q.correct_answer
      );

    case "vocabulary_sentence_completion":
      if (!data.questions || !Array.isArray(data.questions)) return false;
      return data.questions.every(
        (q) =>
          q.vi_text &&
          q.sentence_template &&
          q.shuffled_words &&
          q.blanks
      );

    default:
      return true;
  }
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

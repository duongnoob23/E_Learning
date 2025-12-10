// JSONEditor.jsx - Component để nhập/paste JSON trực tiếp
import React, { useState } from "react";
import "./JSONEditor.css";

export default function JSONEditor({ lessonType, currentData, onImport, onClose }) {
  const [jsonText, setJsonText] = useState(JSON.stringify(currentData, null, 2));
  const [error, setError] = useState(null);

  const handlePaste = () => {
    navigator.clipboard.readText().then((text) => {
      setJsonText(text);
      setError(null);
    });
  };

  const handleValidate = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setError(null);
      return parsed;
    } catch (e) {
      setError("Lỗi JSON: " + e.message);
      return null;
    }
  };

  const handleImport = () => {
    const parsed = handleValidate();
    if (parsed) {
      onImport(parsed);
      onClose();
    }
  };

  const handleFormat = () => {
    const parsed = handleValidate();
    if (parsed) {
      setJsonText(JSON.stringify(parsed, null, 2));
      setError(null);
    }
  };

  return (
    <div className="json-editor-overlay" onClick={onClose}>
      <div className="json-editor" onClick={(e) => e.stopPropagation()}>
        <div className="json-editor-header">
          <h3>📝 Nhập JSON</h3>
          <button className="json-editor-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="json-editor-content">
          <div className="json-editor-actions">
            <button className="json-editor-btn" onClick={handlePaste}>
              📋 Paste từ Clipboard
            </button>
            <button className="json-editor-btn" onClick={handleFormat}>
              ✨ Format JSON
            </button>
          </div>
          {error && <div className="json-editor-error">{error}</div>}
          <textarea
            className="json-editor-textarea"
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value);
              setError(null);
            }}
            placeholder="Paste hoặc nhập JSON ở đây..."
            spellCheck={false}
          />
        </div>
        <div className="json-editor-footer">
          <button className="json-editor-btn json-editor-btn-cancel" onClick={onClose}>
            Hủy
          </button>
          <button className="json-editor-btn json-editor-btn-import" onClick={handleImport}>
            Import
          </button>
        </div>
      </div>
    </div>
  );
}


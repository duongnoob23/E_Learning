// JSONEditor.jsx - Component để nhập/paste JSON trực tiếp
import React, { useState } from "react";
import { HiDocumentText, HiXMark, HiClipboardDocument, HiSparkles } from "react-icons/hi2";
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
          <h3>
            <HiDocumentText style={{ marginRight: "8px", width: "20px", height: "20px", display: "inline-block", verticalAlign: "middle" }} />
            Nhập JSON
          </h3>
          <button className="json-editor-close" onClick={onClose}>
            <HiXMark />
          </button>
        </div>
        <div className="json-editor-content">
          <div className="json-editor-actions">
            <button className="json-editor-btn" onClick={handlePaste}>
              <HiClipboardDocument style={{ marginRight: "6px", width: "16px", height: "16px" }} />
              Paste từ Clipboard
            </button>
            <button className="json-editor-btn" onClick={handleFormat}>
              <HiSparkles style={{ marginRight: "6px", width: "16px", height: "16px" }} />
              Format JSON
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


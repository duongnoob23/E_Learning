// InlineEditor.jsx - Component cho phép edit trực tiếp trên UI
import React, { useState, useRef, useEffect } from "react";
import "./InlineEditor.css";

export default function InlineEditor({
  type = "text",
  value = "",
  onChange,
  placeholder = "",
  label = null,
  className = "",
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (type === "text" || type === "url") {
        inputRef.current.select();
      }
    }
  }, [isEditing, type]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editValue !== value) {
      onChange(editValue);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && type !== "textarea") {
      handleBlur();
    } else if (e.key === "Escape") {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  const handleChange = (e) => {
    setEditValue(e.target.value);
  };

  if (isEditing) {
    return (
      <div className={`inline-editor inline-editor--editing ${className}`}>
        {label && <label className="inline-editor-label">{label}</label>}
        {type === "textarea" ? (
          <textarea
            ref={inputRef}
            value={editValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="inline-editor-input"
          />
        ) : (
          <input
            ref={inputRef}
            type={type}
            value={editValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="inline-editor-input"
          />
        )}
      </div>
    );
  }

  return (
    <div className={`inline-editor ${className}`}>
      {label && <label className="inline-editor-label">{label}</label>}
      <div
        className={`inline-editor-display ${
          !value ? "inline-editor-display--empty" : ""
        }`}
        onClick={handleClick}
        title="Click để chỉnh sửa"
      >
        {value || (
          <span className="inline-editor-placeholder">{placeholder}</span>
        )}
      </div>
    </div>
  );
}


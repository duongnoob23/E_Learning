// QuickActions.jsx - Quick actions toolbar
import React, { useState } from "react";
import "./QuickActions.css";

export default function QuickActions({
  lessonType,
  onAction,
  questionsCount = 0,
}) {
  const [showMenu, setShowMenu] = useState(false);

  const actions = [
    {
      id: "add_question",
      label: "Thêm câu hỏi",
      icon: "➕",
      action: () => onAction("add_question"),
    },
    {
      id: "duplicate_last",
      label: "Nhân đôi câu cuối",
      icon: "📋",
      action: () => onAction("duplicate_question", { index: questionsCount - 1 }),
      disabled: questionsCount === 0,
    },
    {
      id: "import_json",
      label: "Import JSON",
      icon: "📥",
      action: () => onAction("import_json"),
    },
    {
      id: "export_json",
      label: "Export JSON",
      icon: "📤",
      action: () => onAction("export_json"),
    },
  ];

  return (
    <div className="quick-actions">
      <button
        className="quick-actions-toggle"
        onClick={() => setShowMenu(!showMenu)}
        title="Quick Actions"
      >
        ⚡ Quick Actions
      </button>
      {showMenu && (
        <div className="quick-actions-menu">
          {actions.map((action) => (
            <button
              key={action.id}
              className={`quick-actions-item ${
                action.disabled ? "disabled" : ""
              }`}
              onClick={() => {
                if (!action.disabled) {
                  action.action();
                  setShowMenu(false);
                }
              }}
              disabled={action.disabled}
            >
              <span className="quick-actions-icon">{action.icon}</span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


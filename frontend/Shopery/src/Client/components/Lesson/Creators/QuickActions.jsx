// QuickActions.jsx - Quick actions toolbar
import React, { useState } from "react";
import {
  HiPlus,
  HiClipboardDocument,
  HiArrowDownTray,
  HiArrowUpTray,
  HiBolt,
} from "react-icons/hi2";
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
      icon: HiPlus,
      action: () => onAction("add_question"),
    },
    {
      id: "duplicate_last",
      label: "Nhân đôi câu cuối",
      icon: HiClipboardDocument,
      action: () => onAction("duplicate_question", { index: questionsCount - 1 }),
      disabled: questionsCount === 0,
    },
    {
      id: "import_json",
      label: "Import JSON",
      icon: HiArrowDownTray,
      action: () => onAction("import_json"),
    },
    {
      id: "export_json",
      label: "Export JSON",
      icon: HiArrowUpTray,
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
        <HiBolt style={{ marginRight: "6px", width: "16px", height: "16px" }} />
        Quick Actions
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
              <span className="quick-actions-icon">
                {React.createElement(action.icon, { style: { width: "18px", height: "18px" } })}
              </span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


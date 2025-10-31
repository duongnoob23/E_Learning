// src/Admin/features/courses/components/ExamBuilderModal.jsx
import React, { useState } from "react";
import "./ExamBuilderModal.scss";
import ExamInfoTab, { validateExamInfo } from "./ExamInfoTab";
import { TOEIC_PARTS } from "./partConfig";
import PartsTab, { isModeSatisfied } from "./PartsTab";
import QuestionsTab from "./QuestionsTab";

const emptyInfo = {
  title: "",
  code: "",
  description: "",
  difficulty: "Medium",
  duration: 60,
  noTimeLimit: false,
  visibility: "Private",
};
const initParts = () => TOEIC_PARTS.map((p) => ({ ...p, questions: [] }));

export default function ExamBuilderModal({ open, onClose, onSubmit }) {
  // Hooks luôn ở đầu, không return trước
  const [tab, setTab] = useState(0); // 0 info, 1 parts, 2 questions
  const [info, setInfo] = useState(emptyInfo);
  const [parts, setParts] = useState(initParts);
  const [mode, setMode] = useState("all"); // all | reading | listening
  const [activePartIndex, setActivePartIndex] = useState(0);

  console.log("PARTS", JSON.stringify(parts, null, 2));

  const activePart = parts[activePartIndex];
  const canGoParts = validateExamInfo(info).ok;
  const canSubmit = isModeSatisfied(mode, parts);

  if (!open) return null;

  function goto(next) {
    if (next === 1 && !canGoParts)
      return alert("Vui lòng hoàn thành Exam Info.");
    if (next < 0 || next > 2) return;
    setTab(next);
  }
  function openPart(idx) {
    if (!canGoParts) return alert("Vui lòng hoàn thành Exam Info.");
    setActivePartIndex(idx);
    setTab(2);
  }
  function updateActivePart(updated) {
    setParts((prev) =>
      prev.map((p, i) => (i === activePartIndex ? updated : p))
    );
  }
  function resetAll() {
    setTab(0);
    setInfo(emptyInfo);
    setParts(initParts());
    setMode("all");
    setActivePartIndex(0);
  }

  return (
    <div
      className="exam-modal__backdrop"
      onMouseDown={(e) => {
        if (e.target.classList.contains("exam-modal__backdrop")) onClose?.();
      }}
    >
      <div className="exam-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="exam-modal__header">
          <div style={{ fontWeight: 600 }}>Add New Exam</div>
          <button
            className="btn"
            onClick={() => {
              if (window.confirm("Đóng và hủy thay đổi?")) onClose?.();
            }}
          >
            ×
          </button>
        </div>

        <div className="exam-modal__tabs">
          <div
            className={`exam-tab ${tab === 0 ? "exam-tab--active" : ""}`}
            onClick={() => goto(0)}
          >
            Exam Info
          </div>
          <div
            className={`exam-tab ${tab === 1 ? "exam-tab--active" : ""}`}
            onClick={() => goto(1)}
          >
            Parts
          </div>
          <div
            className={`exam-tab ${tab === 2 ? "exam-tab--active" : ""}`}
            onClick={() => goto(2)}
          >
            Questions
          </div>
        </div>

        <div className="exam-modal__content">
          <div
            className="exam-modal__slider"
            style={{ transform: `translateX(-${tab * (100 / 3)}%)` }}
          >
            <div className="exam-pane">
              <ExamInfoTab value={info} onChange={setInfo} />
            </div>
            <div className="exam-pane">
              <PartsTab
                parts={parts}
                mode={mode}
                onModeChange={setMode}
                onOpenPart={openPart}
              />
            </div>
            <div className="exam-pane" key={activePart?.key}>
              <QuestionsTab part={activePart} onChangePart={updateActivePart} />
            </div>
          </div>
        </div>

        <div className="exam-modal__footer">
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn"
              onClick={() => goto(tab - 1)}
              disabled={tab === 0}
            >
              Back
            </button>
            <button
              className="btn"
              onClick={() => goto(tab + 1)}
              disabled={tab === 2}
            >
              Next
            </button>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" onClick={resetAll}>
              Reset
            </button>
            <button
              className="btn btn--primary"
              disabled={!canSubmit}
              onClick={() => onSubmit?.({ info, parts })}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

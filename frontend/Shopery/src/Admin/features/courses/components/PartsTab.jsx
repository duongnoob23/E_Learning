// src/Admin/features/courses/components/PartsTab.jsx
import React from "react";
import { LISTENING_PART_KEYS, READING_PART_KEYS } from "./partConfig";

export default function PartsTab({ parts, mode, onModeChange, onOpenPart }) {
  return (
    <div>
      <div className="field">
        <label>Chế độ tạo đề</label>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <label>
            <input
              type="radio"
              name="mode"
              checked={mode === "all"}
              onChange={() => onModeChange("all")}
            />{" "}
            All 7 Parts
          </label>
          <label>
            <input
              type="radio"
              name="mode"
              checked={mode === "reading"}
              onChange={() => onModeChange("reading")}
            />{" "}
            Reading only (P5–P7)
          </label>
          <label>
            <input
              type="radio"
              name="mode"
              checked={mode === "listening"}
              onChange={() => onModeChange("listening")}
            />{" "}
            Listening only (P1–P4)
          </label>
        </div>
      </div>

      <div className="parts-grid">
        {parts.map((p, idx) => {
          const count = p.questions.length;
          const ready = count >= p.expectedMax;
          return (
            <div key={p.key} className="part-card">
              <h4>{p.title}</h4>
              <div className="desc">{p.type.toUpperCase()}</div>
              <div className="badge">
                {count} / {p.expectedMax}{" "}
                {ready ? <span className="good"> (OK)</span> : ""}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="btn btn--primary"
                  onClick={() => onOpenPart(idx)}
                >
                  Edit Questions
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 10, color: "#9ca3af", fontSize: 12 }}>
        Submit chỉ bật khi {mode === "all" && "cả 7 Part"}
        {mode === "reading" && "3 Part Reading (P5–P7)"}
        {mode === "listening" && "4 Part Listening (P1–P4)"} đủ số câu.
      </div>
    </div>
  );
}

export function isModeSatisfied(mode, parts) {
  const byKey = Object.fromEntries(parts.map((p) => [p.key, p]));
  const need =
    mode === "all"
      ? parts.map((p) => p.key)
      : mode === "reading"
      ? READING_PART_KEYS
      : LISTENING_PART_KEYS;
  return need.every((k) => byKey[k].questions.length >= byKey[k].expectedMax);
}

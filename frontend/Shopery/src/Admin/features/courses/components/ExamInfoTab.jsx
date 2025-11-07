// src/Admin/features/courses/components/ExamInfoTab.jsx
import React, { useEffect } from "react";

export default function ExamInfoTab({ value, onChange }) {
  useEffect(() => {
    if (value.title && !value.code)
      onChange({ ...value, code: slugify(value.title).slice(0, 60) });
    // eslint-disable-next-line
  }, [value.title]);

  function set(field, v) {
    onChange({ ...value, [field]: v });
  }
  const v = validateExamInfo(value);

  return (
    <div>
      <div className="field">
        <label>Exam Title *</label>
        <input
          value={value.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Toeic Mock Test 01"
        />
        {!v.ok && <div className="bad">{v.message}</div>}
      </div>
      <div className="field">
        <label>Exam Code / Slug</label>
        <input
          value={value.code}
          onChange={(e) => set("code", slugify(e.target.value))}
          placeholder="toeic-mock-test-01"
        />
      </div>
      <div className="field">
        <label>Description</label>
        <textarea
          rows={3}
          value={value.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>
      <div className="field">
        <label>Difficulty</label>
        <select
          value={value.difficulty}
          onChange={(e) => set("difficulty", e.target.value)}
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </div>
      <div className="field">
        <label>Duration (minutes)</label>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="number"
            min={1}
            disabled={value.noTimeLimit}
            value={value.noTimeLimit ? "" : value.duration}
            onChange={(e) => set("duration", Number(e.target.value) || 0)}
          />
          <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input
              type="checkbox"
              checked={value.noTimeLimit}
              onChange={(e) => set("noTimeLimit", e.target.checked)}
            />
            No time limit
          </label>
        </div>
      </div>
      <div className="field">
        <label>Visibility</label>
        <select
          value={value.visibility}
          onChange={(e) => set("visibility", e.target.value)}
        >
          <option>Private</option>
          <option>Public</option>
        </select>
      </div>
    </div>
  );
}

export function validateExamInfo(info) {
  if (!info.title || info.title.trim().length < 3)
    return { ok: false, message: "Tiêu đề tối thiểu 3 ký tự" };
  if (!info.noTimeLimit && (!info.duration || info.duration <= 0))
    return { ok: false, message: "Duration phải > 0" };
  return { ok: true };
}

function slugify(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

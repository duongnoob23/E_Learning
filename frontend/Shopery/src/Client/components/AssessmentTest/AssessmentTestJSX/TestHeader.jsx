import React from "react";

export default function TestHeader({ title, onExit }) {
  return (
    <div className="toeic-header">
      <div className="toeic-header__title">{title}</div>
      <div className="toeic-header__actions">
        <button className="toeic-header__exit" onClick={onExit}>
          Thoát
        </button>
      </div>
    </div>
  );
}

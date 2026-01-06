import React from "react";
import "./PartList.scss";

/**
 * Part List Component
 * Displays list of created parts
 */
export default function PartList({ parts, onEdit, onDelete, examType }) {
  // Get part type display name
  const getPartTypeName = (partType) => {
    const names = {
      LISTENING: "Listening",
      READING: "Reading",
      SPEAKING: "Speaking",
      WRITING: "Writing",
    };
    return names[partType] || partType;
  };

  return (
    <div className="part-list">
      <h4 className="part-list__title">Parts ({parts.length})</h4>
      <div className="part-list__items">
        {parts.map((part, index) => (
          <div key={part.id} className="part-list__item">
            <div className="part-list__item-header">
              <div className="part-list__item-info">
                <h5 className="part-list__item-name">
                  Part {part.part_number}: {part.part_name}
                </h5>
                <p className="part-list__item-meta">
                  Type: {getPartTypeName(part.part_type)} | 
                  Duration: {part.duration_minutes} min | 
                  Questions: {part.questions?.length || 0}
                </p>
              </div>
              <div className="part-list__item-actions">
                <button
                  className="part-list__edit-btn"
                  onClick={() => onEdit(part.id)}
                >
                  Edit
                </button>
                <button
                  className="part-list__delete-btn"
                  onClick={() => onDelete(part.id)}
                >
                  Delete
                </button>
              </div>
            </div>
            {part.description && (
              <p className="part-list__item-description">{part.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

import React from "react";
import "./PartList.scss";

/**
 * Component hiển thị danh sách các Part đã tạo
 */
export default function PartList({ parts, onEdit, onDelete, examType }) {
  // Lấy tên loại Part
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
      <h4 className="part-list__title">Danh sách Part ({parts.length})</h4>
      <div className="part-list__items">
        {parts.map((part, index) => (
          <div key={part.id} className="part-list__item">
            <div className="part-list__item-header">
              <div className="part-list__item-info">
                <h5 className="part-list__item-name">
                  Part {part.part_number}: {part.part_name}
                </h5>
                <p className="part-list__item-meta">
                  Loại: {getPartTypeName(part.part_type)} | 
                  Thời gian: {part.duration_minutes} phút | 
                  Số câu hỏi: {part.questions?.length || 0}
                </p>
              </div>
              <div className="part-list__item-actions">
                <button
                  className="part-list__edit-btn"
                  onClick={() => onEdit(part.id)}
                >
                  Sửa
                </button>
                <button
                  className="part-list__delete-btn"
                  onClick={() => onDelete(part.id)}
                >
                  Xóa
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


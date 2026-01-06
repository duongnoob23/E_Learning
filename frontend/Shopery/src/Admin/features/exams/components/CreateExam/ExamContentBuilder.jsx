import React, { useState } from "react";
import "./ExamContentBuilder.scss";
import PartEditor from "./PartEditor";
import PartList from "./PartList";

/**
 * Component quản lý việc tạo nội dung bài thi
 * Hiển thị danh sách Part và cho phép thêm/sửa/xóa Part
 */
export default function ExamContentBuilder({
  examType,
  parts = [],
  onChange,
  examInfo,
}) {
  const [editingPart, setEditingPart] = useState(null);
  const [showPartEditor, setShowPartEditor] = useState(false);

  // Xử lý thêm Part mới
  const handleAddPart = () => {
    setEditingPart(null);
    setShowPartEditor(true);
  };

  // Xử lý sửa Part
  const handleEditPart = (partId) => {
    const part = parts.find((p) => p.id === partId);
    setEditingPart(part);
    setShowPartEditor(true);
  };

  // Xử lý xóa Part
  const handleDeletePart = (partId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa Part này? Tất cả câu hỏi trong Part sẽ bị xóa.")) {
      const newParts = parts.filter((p) => p.id !== partId);
      onChange(newParts);
    }
  };

  // Xử lý lưu Part
  const handleSavePart = (partData) => {
    let newParts;
    if (editingPart) {
      // Cập nhật Part đã có
      newParts = parts.map((p) =>
        p.id === editingPart.id ? { ...p, ...partData } : p
      );
    } else {
      // Thêm Part mới
      const newPart = {
        id: Date.now(),
        ...partData,
        questions: [],
      };
      newParts = [...parts, newPart];
    }
    onChange(newParts);
    setShowPartEditor(false);
    setEditingPart(null);
  };

  // Xử lý hủy chỉnh sửa Part
  const handleCancelPart = () => {
    setShowPartEditor(false);
    setEditingPart(null);
  };

  // Xác định part_type dựa trên examType
  const getPartType = () => {
    if (examType === "LISTENING_READING") {
      // Có thể chọn LISTENING hoặc READING
      return null; // Sẽ chọn trong PartEditor
    } else if (examType === "SPEAKING") {
      return "SPEAKING";
    } else if (examType === "WRITING") {
      return "WRITING";
    }
    return null;
  };

  return (
    <div className="exam-content-builder">
      <div className="exam-content-builder__header">
        <h3 className="exam-content-builder__title">Tạo nội dung bài thi</h3>
        <p className="exam-content-builder__description">
          Thêm các Part và tạo câu hỏi cho từng Part. Loại bài thi: {examType}
        </p>
        <button
          className="exam-content-builder__add-btn"
          onClick={handleAddPart}
        >
          + Thêm Part
        </button>
      </div>

      {/* Danh sách Parts */}
      {parts.length > 0 ? (
        <PartList
          parts={parts}
          onEdit={handleEditPart}
          onDelete={handleDeletePart}
          examType={examType}
        />
      ) : (
        <div className="exam-content-builder__empty">
          <p>Chưa có Part nào. Hãy thêm Part đầu tiên để bắt đầu.</p>
        </div>
      )}

      {/* Part Editor Modal */}
      {showPartEditor && (
        <PartEditor
          open={showPartEditor}
          part={editingPart}
          examType={examType}
          defaultPartType={getPartType()}
          onSave={handleSavePart}
          onCancel={handleCancelPart}
        />
      )}
    </div>
  );
}


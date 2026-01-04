import React, { useState } from "react";
import "./ExamBuilderTab.scss";
import ExamTypeSelectionModal from "./ExamTypeSelectionModal";
import ExamContentBuilder from "./ExamContentBuilder";

/**
 * Component chính để tạo bài thi
 * Quản lý các tab: Thông tin bài thi, Chọn loại bài thi, Tạo nội dung
 */
export default function ExamBuilderTab({
  examInfo = {},
  onChange,
  errors = {},
  refs = {},
}) {
  const [activeTab, setActiveTab] = useState("info"); // info, type, content
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [selectedExamType, setSelectedExamType] = useState(null);
  const [parts, setParts] = useState([]);

  // Xử lý thay đổi thông tin bài thi
  const handleExamInfoChange = (newInfo) => {
    onChange({ ...examInfo, ...newInfo });
  };

  // Xử lý chọn loại bài thi
  const handleSelectExamType = (examType) => {
    setSelectedExamType(examType);
    onChange({ ...examInfo, exam_type_selected: examType });
    // Tự động chuyển sang tab content sau khi chọn
    setTimeout(() => {
      setActiveTab("content");
    }, 300);
  };

  // Xử lý thay đổi parts
  const handlePartsChange = (newParts) => {
    setParts(newParts);
    onChange({ ...examInfo, parts: newParts });
  };

  // Validation để chuyển tab
  const canGoToTypeTab = () => {
    return examInfo.title && examInfo.title.trim().length >= 3;
  };

  const canGoToContentTab = () => {
    return selectedExamType !== null;
  };

  return (
    <div className="exam-builder-tab">
      {/* Tab Navigation */}
      <div className="exam-builder-tab__tabs">
        <button
          className={`exam-builder-tab__tab ${
            activeTab === "info" ? "exam-builder-tab__tab--active" : ""
          }`}
          onClick={() => setActiveTab("info")}
        >
          Thông tin bài thi
        </button>
        <button
          className={`exam-builder-tab__tab ${
            activeTab === "type" ? "exam-builder-tab__tab--active" : ""
          }`}
          onClick={() => {
            if (canGoToTypeTab()) {
              setShowTypeModal(true);
            } else {
              alert("Vui lòng nhập đầy đủ thông tin bài thi trước");
            }
          }}
          disabled={!canGoToTypeTab()}
        >
          Chọn loại bài thi
          {selectedExamType && (
            <span className="exam-builder-tab__tab-badge">Đã chọn</span>
          )}
        </button>
        <button
          className={`exam-builder-tab__tab ${
            activeTab === "content" ? "exam-builder-tab__tab--active" : ""
          }`}
          onClick={() => {
            if (canGoToContentTab()) {
              setActiveTab("content");
            } else {
              alert("Vui lòng chọn loại bài thi trước");
            }
          }}
          disabled={!canGoToContentTab()}
        >
          Tạo nội dung
          {parts.length > 0 && (
            <span className="exam-builder-tab__tab-badge">{parts.length} Part</span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="exam-builder-tab__content">
        {activeTab === "info" && (
          <div className="exam-builder-tab__info-section">
            <p className="exam-builder-tab__section-description">
              Nhập thông tin cơ bản về bài thi. Tất cả các trường có dấu * là bắt buộc.
            </p>
            <div className="exam-builder-tab__form">
              {/* Exam Info Form sẽ được render từ parent component */}
              <div className="exam-builder-tab__info-preview">
                <h3>Thông tin đã nhập:</h3>
                <ul>
                  <li>Tiêu đề: {examInfo.title || "Chưa nhập"}</li>
                  <li>Loại bài thi: {examInfo.exam_type || "Chưa chọn"}</li>
                  <li>Thời gian: {examInfo.total_duration || 0} phút</li>
                  <li>Mức độ khó: {examInfo.difficulty_level || "Chưa chọn"}</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === "type" && (
          <div className="exam-builder-tab__type-section">
            <p className="exam-builder-tab__section-description">
              Chọn loại bài thi bạn muốn tạo. Mỗi loại có cách tạo nội dung khác nhau.
            </p>
            {selectedExamType ? (
              <div className="exam-builder-tab__selected-type">
                <h3>Đã chọn: {selectedExamType}</h3>
                <button
                  className="exam-builder-tab__change-type-btn"
                  onClick={() => setShowTypeModal(true)}
                >
                  Thay đổi
                </button>
              </div>
            ) : (
              <button
                className="exam-builder-tab__select-type-btn"
                onClick={() => setShowTypeModal(true)}
              >
                Chọn loại bài thi
              </button>
            )}
          </div>
        )}

        {activeTab === "content" && (
          <div className="exam-builder-tab__content-section">
            {selectedExamType ? (
              <ExamContentBuilder
                examType={selectedExamType}
                parts={parts}
                onChange={handlePartsChange}
                examInfo={examInfo}
              />
            ) : (
              <div className="exam-builder-tab__no-type-selected">
                <p>Vui lòng chọn loại bài thi trước khi tạo nội dung.</p>
                <button onClick={() => setShowTypeModal(true)}>
                  Chọn loại bài thi
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Exam Type Selection Modal */}
      <ExamTypeSelectionModal
        open={showTypeModal}
        onClose={() => setShowTypeModal(false)}
        onSelect={handleSelectExamType}
        selectedType={selectedExamType}
      />
    </div>
  );
}


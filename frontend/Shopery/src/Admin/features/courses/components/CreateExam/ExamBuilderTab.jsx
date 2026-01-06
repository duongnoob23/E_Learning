import React, { useState, useCallback, useEffect } from "react";
import "./ExamBuilderTab.scss";
import ExamInfoTab from "./ExamInfoTab";
import ExamTypeSelectionModal from "./ExamTypeSelectionModal";
import ExamContentBuilder from "./ExamContentBuilder";

/**
 * Main Exam Builder Tab Component
 * Manages step-by-step flow: Info → Type Selection → Content Creation
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
  const [previousExamType, setPreviousExamType] = useState(null);
  const [hasUnsavedParts, setHasUnsavedParts] = useState(false);

  // Sync parts from examInfo
  useEffect(() => {
    if (examInfo.parts) {
      setParts(examInfo.parts);
    }
  }, [examInfo.parts]);

  // Sync selectedExamType from examInfo
  useEffect(() => {
    if (examInfo.exam_type_selected) {
      setSelectedExamType(examInfo.exam_type_selected);
    }
  }, [examInfo.exam_type_selected]);

  // Handle exam info changes
  const handleExamInfoChange = useCallback((newInfo) => {
    onChange({ ...examInfo, ...newInfo });
  }, [examInfo, onChange]);

  // Handle exam type selection
  const handleSelectExamType = useCallback((examType) => {
    // Check if switching from different type with unsaved data
    if (previousExamType && previousExamType !== examType && (hasUnsavedParts || parts.length > 0)) {
      if (!window.confirm("Switching exam type will remove current unsaved data. Continue?")) {
        return;
      }
      // Clear parts when switching type
      setParts([]);
      setHasUnsavedParts(false);
    }

    setSelectedExamType(examType);
    setPreviousExamType(examType);
    onChange({ ...examInfo, exam_type_selected: examType, parts: [] });
    setShowTypeModal(false);
    
    // Auto navigate to content tab after selection
    setTimeout(() => {
      setActiveTab("content");
    }, 300);
  }, [examInfo, onChange, previousExamType, hasUnsavedParts, parts.length]);

  // Handle parts changes
  const handlePartsChange = useCallback((newParts) => {
    setParts(newParts);
    setHasUnsavedParts(true);
    onChange({ ...examInfo, parts: newParts });
  }, [examInfo, onChange]);

  // Validation functions
  const validateBasicInfo = useCallback(() => {
    return (
      examInfo.title &&
      examInfo.title.trim().length >= 3 &&
      examInfo.description &&
      examInfo.description.trim().length > 0 &&
      examInfo.exam_type &&
      examInfo.difficulty_level
    );
  }, [examInfo]);

  const canGoToTypeTab = validateBasicInfo();
  const canGoToContentTab = selectedExamType !== null;

  // Handle tab navigation
  const handleTabClick = useCallback((tab) => {
    if (tab === "type") {
      if (!canGoToTypeTab) {
        alert("Please complete all required fields in Exam Information first.");
        return;
      }
      setShowTypeModal(true);
    } else if (tab === "content") {
      if (!canGoToContentTab) {
        alert("Please select an exam type first.");
        return;
      }
      setActiveTab("content");
    } else {
      setActiveTab(tab);
    }
  }, [canGoToTypeTab, canGoToContentTab]);

  return (
    <div className="exam-builder-tab">
      {/* Tab Navigation */}
      <div className="exam-builder-tab__tabs">
        <button
          className={`exam-builder-tab__tab ${
            activeTab === "info" ? "exam-builder-tab__tab--active" : ""
          }`}
          onClick={() => handleTabClick("info")}
        >
          Exam Information
        </button>
        <button
          className={`exam-builder-tab__tab ${
            activeTab === "type" ? "exam-builder-tab__tab--active" : ""
          }`}
          onClick={() => handleTabClick("type")}
          disabled={!canGoToTypeTab}
        >
          Select Exam Type
          {selectedExamType && (
            <span className="exam-builder-tab__tab-badge">Selected</span>
          )}
        </button>
        <button
          className={`exam-builder-tab__tab ${
            activeTab === "content" ? "exam-builder-tab__tab--active" : ""
          }`}
          onClick={() => handleTabClick("content")}
          disabled={!canGoToContentTab}
        >
          Create Content
          {parts.length > 0 && (
            <span className="exam-builder-tab__tab-badge">{parts.length} Part{parts.length !== 1 ? 's' : ''}</span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="exam-builder-tab__content">
        {activeTab === "info" && (
          <div className="exam-builder-tab__info-section">
            <p className="exam-builder-tab__section-description">
              Enter basic information about the exam. All fields marked with * are required.
            </p>
            <div className="exam-builder-tab__form">
              <ExamInfoTab
                data={examInfo}
                onChange={handleExamInfoChange}
                errors={errors}
                refs={refs}
              />
            </div>
          </div>
        )}

        {activeTab === "type" && (
          <div className="exam-builder-tab__type-section">
            <p className="exam-builder-tab__section-description">
              Select the type of exam you want to create. Each type has different content creation methods.
            </p>
            {selectedExamType ? (
              <div className="exam-builder-tab__selected-type">
                <h3>Selected: {selectedExamType.replace('_', ' & ')}</h3>
                <button
                  className="exam-builder-tab__change-type-btn"
                  onClick={() => setShowTypeModal(true)}
                >
                  Change Type
                </button>
              </div>
            ) : (
              <button
                className="exam-builder-tab__select-type-btn"
                onClick={() => setShowTypeModal(true)}
              >
                Select Exam Type
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
                <p>Please select an exam type before creating content.</p>
                <button onClick={() => setShowTypeModal(true)}>
                  Select Exam Type
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

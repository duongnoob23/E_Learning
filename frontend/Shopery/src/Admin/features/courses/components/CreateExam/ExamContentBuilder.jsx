import React, { useState, useCallback } from "react";
import "./ExamContentBuilder.scss";
import PartEditor from "./PartEditor";
import PartList from "./PartList";

/**
 * Exam Content Builder Component
 * Manages Parts creation and editing
 * Auto-generates Parts for Listening/Reading (max 7)
 */
export default function ExamContentBuilder({
  examType,
  parts = [],
  onChange,
  examInfo,
}) {
  const [editingPart, setEditingPart] = useState(null);
  const [showPartEditor, setShowPartEditor] = useState(false);

  // Part configurations for Listening/Reading
  const LISTENING_READING_PARTS = [
    { number: 1, name: "Part 1: Picture Description", type: "LISTENING" },
    { number: 2, name: "Part 2: Question-Response", type: "LISTENING" },
    { number: 3, name: "Part 3: Conversations", type: "LISTENING" },
    { number: 4, name: "Part 4: Short Talks", type: "LISTENING" },
    { number: 5, name: "Part 5: Incomplete Sentences", type: "READING" },
    { number: 6, name: "Part 6: Text Completion", type: "READING" },
    { number: 7, name: "Part 7: Reading Comprehension", type: "READING" },
  ];

  // Get next available part number
  const getNextPartNumber = useCallback(() => {
    if (examType === "LISTENING_READING") {
      // Find the highest part number and add 1, but max is 7
      if (parts.length === 0) return 1;
      const existingNumbers = parts.map(p => p.part_number).sort((a, b) => a - b);
      // Find first missing number from 1-7
      for (let i = 1; i <= 7; i++) {
        if (!existingNumbers.includes(i)) {
          return i;
        }
      }
      // If all 1-7 are taken, return 7
      return 7;
    }
    // For Speaking/Writing, just increment
    return parts.length + 1;
  }, [parts, examType]);

  // Check if can add more parts
  const canAddPart = useCallback(() => {
    if (examType === "LISTENING_READING") {
      return parts.length < 7;
    }
    return true; // No limit for Speaking/Writing
  }, [parts.length, examType]);

  // Auto-generate part data for Listening/Reading
  const generatePartData = useCallback((partNumber) => {
    if (examType === "LISTENING_READING") {
      const partConfig = LISTENING_READING_PARTS.find(p => p.number === partNumber);
      if (partConfig) {
        return {
          part_number: partConfig.number,
          part_name: partConfig.name,
          part_type: partConfig.type,
          duration_minutes: 0,
          description: "",
          display_template: null,
        };
      }
    }
    // For Speaking/Writing, generate default
    return {
      part_number: partNumber,
      part_name: examType === "SPEAKING" 
        ? `Speaking Part ${partNumber}`
        : `Writing Part ${partNumber}`,
      part_type: examType,
      duration_minutes: 0,
      description: "",
      display_template: null,
    };
  }, [examType]);

  // Handle add part
  const handleAddPart = useCallback(() => {
    if (!canAddPart()) {
      alert("Maximum 7 parts allowed for Listening & Reading exams.");
      return;
    }

    const nextNumber = getNextPartNumber();
    
    // Check if part number already exists (should not happen, but safety check)
    if (parts.some(p => p.part_number === nextNumber)) {
      alert(`Part ${nextNumber} already exists.`);
      return;
    }

    const newPartData = generatePartData(nextNumber);
    const newPart = {
      id: Date.now(),
      ...newPartData,
      questions: [],
    };

    // Directly save the part with auto-generated data
    // No need to open editor for Listening/Reading parts
    if (examType === "LISTENING_READING") {
      onChange([...parts, newPart]);
    } else {
      // For Speaking/Writing, open editor for customization
      setEditingPart(null);
      setShowPartEditor(true);
      setTimeout(() => {
        setEditingPart(newPart);
      }, 100);
    }
  }, [canAddPart, getNextPartNumber, generatePartData, parts, examType, onChange]);

  // Handle edit part
  const handleEditPart = useCallback((partId) => {
    const part = parts.find((p) => p.id === partId);
    if (part) {
      setEditingPart(part);
      setShowPartEditor(true);
    }
  }, [parts]);

  // Handle delete part
  const handleDeletePart = useCallback((partId) => {
    if (window.confirm("Are you sure? This will delete all questions in this part.")) {
      const newParts = parts.filter((p) => p.id !== partId);
      onChange(newParts);
    }
  }, [parts, onChange]);

  // Handle save part
  const handleSavePart = useCallback((partData) => {
    let newParts;
    if (editingPart) {
      // Update existing part
      newParts = parts.map((p) =>
        p.id === editingPart.id ? { ...p, ...partData } : p
      );
    } else {
      // Add new part
      const newPart = {
        id: Date.now(),
        ...partData,
        questions: partData.questions || [],
      };
      newParts = [...parts, newPart];
    }
    onChange(newParts);
    setShowPartEditor(false);
    setEditingPart(null);
  }, [editingPart, parts, onChange]);

  // Handle cancel part editing
  const handleCancelPart = useCallback(() => {
    setShowPartEditor(false);
    setEditingPart(null);
  }, []);

  // Get default part type
  const getPartType = useCallback(() => {
    if (examType === "LISTENING_READING") {
      return null; // Will be selected in PartEditor
    } else if (examType === "SPEAKING") {
      return "SPEAKING";
    } else if (examType === "WRITING") {
      return "WRITING";
    }
    return null;
  }, [examType]);

  return (
    <div className="exam-content-builder">
      <div className="exam-content-builder__header">
        <h3 className="exam-content-builder__title">Create Exam Content</h3>
        <p className="exam-content-builder__description">
          Add parts and create questions for each part. Exam type: {examType.replace('_', ' & ')}
          {examType === "LISTENING_READING" && ` (Maximum 7 parts)`}
        </p>
        <button
          className="exam-content-builder__add-btn"
          onClick={handleAddPart}
          disabled={!canAddPart()}
        >
          + Add Part
        </button>
      </div>

      {/* Parts List */}
      {parts.length > 0 ? (
        <PartList
          parts={parts}
          onEdit={handleEditPart}
          onDelete={handleDeletePart}
          examType={examType}
        />
      ) : (
        <div className="exam-content-builder__empty">
          <p>No parts yet. Add your first part to get started.</p>
        </div>
      )}

      {/* Part Editor Modal */}
      {showPartEditor && (
        <PartEditor
          open={showPartEditor}
          part={editingPart}
          examType={examType}
          defaultPartType={getPartType()}
          existingParts={parts}
          onSave={handleSavePart}
          onCancel={handleCancelPart}
        />
      )}
    </div>
  );
}

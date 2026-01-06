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

  // Part configurations for Speaking
  const SPEAKING_PARTS = [
    { number: 1, name: "Part 1: Read a text aloud" },
    { number: 2, name: "Part 2: Describe a picture" },
    { number: 3, name: "Part 3: Respond to questions" },
    { number: 4, name: "Part 4: Respond to questions using information provided" },
    { number: 5, name: "Part 5: Propose a solution" },
  ];

  // Part configurations for Writing
  const WRITING_PARTS = [
    { number: 1, name: "Part 1: Write a sentence based on a picture" },
    { number: 2, name: "Part 2: Write an essay" },
    { number: 3, name: "Part 3: Write an essay based on a reading passage" },
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
    } else if (examType === "SPEAKING") {
      // For Speaking, find first missing number from 1-5
      if (parts.length === 0) return 1;
      const existingNumbers = parts.map(p => p.part_number).sort((a, b) => a - b);
      for (let i = 1; i <= 5; i++) {
        if (!existingNumbers.includes(i)) {
          return i;
        }
      }
      // If all 1-5 are taken, return 5
      return 5;
    } else if (examType === "WRITING") {
      // For Writing, find first missing number from 1-3
      if (parts.length === 0) return 1;
      const existingNumbers = parts.map(p => p.part_number).sort((a, b) => a - b);
      for (let i = 1; i <= 3; i++) {
        if (!existingNumbers.includes(i)) {
          return i;
        }
      }
      // If all 1-3 are taken, return 3
      return 3;
    }
    return parts.length + 1;
  }, [parts, examType]);

  // Check if can add more parts
  const canAddPart = useCallback(() => {
    if (examType === "LISTENING_READING") {
      return parts.length < 7;
    } else if (examType === "SPEAKING") {
      return parts.length < 5;
    } else if (examType === "WRITING") {
      return parts.length < 3;
    }
    return true;
  }, [parts.length, examType]);

  // Auto-generate part data for Listening/Reading/Speaking
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
    } else if (examType === "SPEAKING") {
      const partConfig = SPEAKING_PARTS.find(p => p.number === partNumber);
      if (partConfig) {
        return {
          part_number: partConfig.number,
          part_name: partConfig.name,
          part_type: "SPEAKING",
          duration_minutes: 0,
          description: "",
          display_template: null,
        };
      }
    } else if (examType === "WRITING") {
      const partConfig = WRITING_PARTS.find(p => p.number === partNumber);
      if (partConfig) {
        return {
          part_number: partConfig.number,
          part_name: partConfig.name,
          part_type: "WRITING",
          duration_minutes: 0,
          description: "",
          display_template: null,
        };
      }
    }
    // Fallback
    return {
      part_number: partNumber,
      part_name: `${examType} Part ${partNumber}`,
      part_type: examType,
      duration_minutes: 0,
      description: "",
      display_template: null,
    };
  }, [examType]);

  // Handle add part
  const handleAddPart = useCallback(() => {
    if (!canAddPart()) {
      if (examType === "LISTENING_READING") {
        alert("Maximum 7 parts allowed for Listening & Reading exams.");
      } else if (examType === "SPEAKING") {
        alert("Maximum 5 parts allowed for Speaking exams.");
      } else if (examType === "WRITING") {
        alert("Maximum 3 parts allowed for Writing exams.");
      }
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
    // Auto-add for Listening/Reading, Speaking, and Writing
    if (examType === "LISTENING_READING" || examType === "SPEAKING" || examType === "WRITING") {
      onChange([...parts, newPart]);
    } else {
      // For other types, open editor for customization
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
          {examType === "SPEAKING" && ` (Maximum 5 parts)`}
          {examType === "WRITING" && ` (Maximum 3 parts)`}
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

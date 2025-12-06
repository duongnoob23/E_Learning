// VisualEditor.jsx - Editor thông minh với inline editing và visual feedback
import React, { useState } from "react";
import InlineEditor from "./InlineEditor";
import "./VisualEditor.css";

export default function VisualEditor({ lessonType, data, onChange }) {
  const [editingItem, setEditingItem] = useState(null);
  const [editingField, setEditingField] = useState(null);

  const handleInlineEdit = (path, value) => {
    // Update nested data structure
    const newData = updateNestedData(data, path, value);
    onChange(newData);
  };

  const handleAddItem = (type, parentPath = null) => {
    const newItem = getDefaultItem(lessonType, type);
    const newData = addItemToData(data, parentPath, newItem);
    onChange(newData);
  };

  const handleRemoveItem = (path) => {
    const newData = removeItemFromData(data, path);
    onChange(newData);
  };

  const handleDuplicateItem = (path) => {
    const item = getItemFromPath(data, path);
    const duplicated = JSON.parse(JSON.stringify(item));
    duplicated.question_id = Date.now();
    const newData = addItemToData(data, getParentPath(path), duplicated);
    onChange(newData);
  };

  // Render editor dựa trên lesson type
  const renderEditor = () => {
    switch (lessonType) {
      case "vocabulary_list":
        return (
          <VocabularyListEditor
            data={data}
            onEdit={handleInlineEdit}
            onAdd={handleAddItem}
            onRemove={handleRemoveItem}
          />
        );
      case "vocabulary_matching":
        return (
          <VocabularyMatchingEditor
            data={data}
            onEdit={handleInlineEdit}
            onAdd={handleAddItem}
            onRemove={handleRemoveItem}
            onDuplicate={handleDuplicateItem}
          />
        );
      case "vocabulary_translation":
        return (
          <VocabularyTranslationEditor
            data={data}
            onEdit={handleInlineEdit}
            onAdd={handleAddItem}
            onRemove={handleRemoveItem}
            onDuplicate={handleDuplicateItem}
          />
        );
      case "vocabulary_quiz":
        return (
          <VocabularyQuizEditor
            data={data}
            onEdit={handleInlineEdit}
            onAdd={handleAddItem}
            onRemove={handleRemoveItem}
            onDuplicate={handleDuplicateItem}
          />
        );
      case "vocabulary_listening":
        return (
          <VocabularyListeningEditor
            data={data}
            onEdit={handleInlineEdit}
            onAdd={handleAddItem}
            onRemove={handleRemoveItem}
            onDuplicate={handleDuplicateItem}
          />
        );
      case "vocabulary_image_choice":
        return (
          <VocabularyImageChoiceEditor
            data={data}
            onEdit={handleInlineEdit}
            onAdd={handleAddItem}
            onRemove={handleRemoveItem}
            onDuplicate={handleDuplicateItem}
          />
        );
      case "vocabulary_sentence_completion":
        return (
          <VocabularySentenceCompletionEditor
            data={data}
            onEdit={handleInlineEdit}
            onAdd={handleAddItem}
            onRemove={handleRemoveItem}
            onDuplicate={handleDuplicateItem}
          />
        );
      default:
        return <div>Chưa hỗ trợ editor cho loại này</div>;
    }
  };

  return (
    <div className="visual-editor">
      <div className="visual-editor-header">
        <h3>Visual Editor</h3>
        <button
          className="visual-editor-add-btn"
          onClick={() => handleAddItem("question")}
        >
          + Thêm câu hỏi
        </button>
      </div>
      <div className="visual-editor-content">{renderEditor()}</div>
    </div>
  );
}

// Vocabulary Matching Editor
function VocabularyMatchingEditor({
  data,
  onEdit,
  onAdd,
  onRemove,
  onDuplicate,
}) {
  const questions = data.questions || [];

  return (
    <div className="visual-editor-questions">
      {questions.length === 0 ? (
        <div className="visual-editor-empty">
          <p>Chưa có câu hỏi nào. Nhấn "Thêm câu hỏi" để bắt đầu.</p>
        </div>
      ) : (
        questions.map((question, qIndex) => (
          <div key={question.question_id} className="visual-editor-question-card">
            <div className="visual-editor-question-header">
              <span className="visual-editor-question-number">
                Câu {qIndex + 1}
              </span>
              <div className="visual-editor-question-actions">
                <button
                  className="visual-editor-action-btn"
                  onClick={() => onDuplicate(`questions.${qIndex}`)}
                  title="Nhân đôi"
                >
                  📋
                </button>
                <button
                  className="visual-editor-action-btn visual-editor-action-btn-danger"
                  onClick={() => onRemove(`questions.${qIndex}`)}
                  title="Xóa"
                >
                  🗑️
                </button>
              </div>
            </div>

            {/* Grid Size */}
            <div className="visual-editor-field-group">
              <label>Kích thước lưới:</label>
              <div className="visual-editor-inline-fields">
                <InlineEditor
                  type="number"
                  value={question.grid_size?.rows || 4}
                  onChange={(value) =>
                    onEdit(`questions.${qIndex}.grid_size.rows`, value)
                  }
                  placeholder="Rows"
                />
                <span>×</span>
                <InlineEditor
                  type="number"
                  value={question.grid_size?.cols || 4}
                  onChange={(value) =>
                    onEdit(`questions.${qIndex}.grid_size.cols`, value)
                  }
                  placeholder="Cols"
                />
              </div>
            </div>

            {/* Pairs */}
            <div className="visual-editor-field-group">
              <div className="visual-editor-field-group-header">
                <label>Các cặp từ:</label>
                <button
                  className="visual-editor-add-btn-small"
                  onClick={() => onAdd("pair", `questions.${qIndex}`)}
                >
                  + Thêm cặp
                </button>
              </div>

              {(question.pairs || []).map((pair, pIndex) => (
                <div
                  key={pair.pair_id}
                  className="visual-editor-item-card"
                >
                  <div className="visual-editor-item-header">
                    <span>Cặp {pIndex + 1}</span>
                    <button
                      className="visual-editor-action-btn-small"
                      onClick={() =>
                        onRemove(`questions.${qIndex}.pairs.${pIndex}`)
                      }
                    >
                      ×
                    </button>
                  </div>
                  <div className="visual-editor-item-fields">
                    <InlineEditor
                      type="text"
                      value={pair.left_text || ""}
                      onChange={(value) =>
                        onEdit(
                          `questions.${qIndex}.pairs.${pIndex}.left_text`,
                          value
                        )
                      }
                      placeholder="Tiếng Việt (trái)"
                    />
                    <InlineEditor
                      type="url"
                      value={pair.left_image_url || ""}
                      onChange={(value) =>
                        onEdit(
                          `questions.${qIndex}.pairs.${pIndex}.left_image_url`,
                          value
                        )
                      }
                      placeholder="URL ảnh (trái)"
                    />
                    <InlineEditor
                      type="text"
                      value={pair.right_text || ""}
                      onChange={(value) =>
                        onEdit(
                          `questions.${qIndex}.pairs.${pIndex}.right_text`,
                          value
                        )
                      }
                      placeholder="Tiếng Anh (phải)"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// Vocabulary Translation Editor
function VocabularyTranslationEditor({
  data,
  onEdit,
  onAdd,
  onRemove,
  onDuplicate,
}) {
  const questions = data.questions || [];

  return (
    <div className="visual-editor-questions">
      {questions.length === 0 ? (
        <div className="visual-editor-empty">
          <p>Chưa có câu hỏi nào. Nhấn "Thêm câu hỏi" để bắt đầu.</p>
        </div>
      ) : (
        questions.map((question, qIndex) => (
          <div key={question.question_id} className="visual-editor-question-card">
            <div className="visual-editor-question-header">
              <span className="visual-editor-question-number">
                Câu {qIndex + 1}
              </span>
              <div className="visual-editor-question-actions">
                <button
                  className="visual-editor-action-btn"
                  onClick={() => onDuplicate(`questions.${qIndex}`)}
                  title="Nhân đôi"
                >
                  📋
                </button>
                <button
                  className="visual-editor-action-btn visual-editor-action-btn-danger"
                  onClick={() => onRemove(`questions.${qIndex}`)}
                  title="Xóa"
                >
                  🗑️
                </button>
              </div>
            </div>

            <div className="visual-editor-item-fields">
              <InlineEditor
                type="text"
                value={question.vi_text || ""}
                onChange={(value) =>
                  onEdit(`questions.${qIndex}.vi_text`, value)
                }
                placeholder="Câu tiếng Việt"
                label="Câu tiếng Việt *"
              />
              <InlineEditor
                type="url"
                value={question.image_url || ""}
                onChange={(value) =>
                  onEdit(`questions.${qIndex}.image_url`, value)
                }
                placeholder="URL ảnh"
                label="URL ảnh"
              />
              <InlineEditor
                type="text"
                value={question.correct_answer || ""}
                onChange={(value) =>
                  onEdit(`questions.${qIndex}.correct_answer`, value)
                }
                placeholder="Đáp án đúng (Tiếng Anh)"
                label="Đáp án đúng *"
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// Placeholder cho các editor khác (sẽ implement tương tự)
function VocabularyListEditor({ data, onEdit, onAdd, onRemove }) {
  return <div>Vocabulary List Editor (Coming soon)</div>;
}

function VocabularyQuizEditor({ data, onEdit, onAdd, onRemove, onDuplicate }) {
  return <div>Vocabulary Quiz Editor (Coming soon)</div>;
}

function VocabularyListeningEditor({
  data,
  onEdit,
  onAdd,
  onRemove,
  onDuplicate,
}) {
  return <div>Vocabulary Listening Editor (Coming soon)</div>;
}

function VocabularyImageChoiceEditor({
  data,
  onEdit,
  onAdd,
  onRemove,
  onDuplicate,
}) {
  return <div>Vocabulary Image Choice Editor (Coming soon)</div>;
}

function VocabularySentenceCompletionEditor({
  data,
  onEdit,
  onAdd,
  onRemove,
  onDuplicate,
}) {
  return <div>Vocabulary Sentence Completion Editor (Coming soon)</div>;
}

// Helper functions
function updateNestedData(data, path, value) {
  const keys = path.split(".");
  const newData = JSON.parse(JSON.stringify(data));
  let current = newData;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const index = parseInt(key);
    if (!isNaN(index)) {
      current = current[index];
    } else {
      if (!current[key]) current[key] = {};
      current = current[key];
    }
  }
  const lastKey = keys[keys.length - 1];
  const lastIndex = parseInt(lastKey);
  if (!isNaN(lastIndex)) {
    current[lastIndex] = value;
  } else {
    current[lastKey] = value;
  }
  return newData;
}

function addItemToData(data, parentPath, newItem) {
  const newData = JSON.parse(JSON.stringify(data));
  if (!parentPath) {
    // Add to root questions array
    if (!newData.questions) newData.questions = [];
    newData.questions.push(newItem);
  } else {
    const keys = parentPath.split(".");
    let current = newData;
    for (const key of keys) {
      const index = parseInt(key);
      if (!isNaN(index)) {
        current = current[index];
      } else {
        current = current[key];
      }
    }
    if (Array.isArray(current)) {
      current.push(newItem);
    } else if (current.pairs) {
      if (!current.pairs) current.pairs = [];
      current.pairs.push(newItem);
    }
  }
  return newData;
}

function removeItemFromData(data, path) {
  const newData = JSON.parse(JSON.stringify(data));
  const keys = path.split(".");
  let current = newData;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const index = parseInt(key);
    if (!isNaN(index)) {
      current = current[index];
    } else {
      current = current[key];
    }
  }
  const lastKey = keys[keys.length - 1];
  const lastIndex = parseInt(lastKey);
  if (!isNaN(lastIndex)) {
    current.splice(lastIndex, 1);
  } else {
    delete current[lastKey];
  }
  return newData;
}

function getItemFromPath(data, path) {
  const keys = path.split(".");
  let current = data;
  for (const key of keys) {
    const index = parseInt(key);
    if (!isNaN(index)) {
      current = current[index];
    } else {
      current = current[key];
    }
  }
  return current;
}

function getParentPath(path) {
  const keys = path.split(".");
  keys.pop();
  return keys.join(".");
}

function getDefaultItem(lessonType, type) {
  if (type === "question") {
    return getDefaultQuestion(lessonType);
  }
  if (type === "pair") {
    return {
      pair_id: Date.now(),
      left_text: "",
      left_image_url: "",
      right_text: "",
    };
  }
  return {};
}

function getDefaultQuestion(lessonType) {
  const defaults = {
    vocabulary_matching: {
      question_id: Date.now(),
      pairs: [],
      grid_size: { rows: 4, cols: 4 },
    },
    vocabulary_translation: {
      question_id: Date.now(),
      vi_text: "",
      image_url: "",
      correct_answer: "",
    },
  };
  return defaults[lessonType] || { question_id: Date.now() };
}


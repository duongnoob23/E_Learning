// VisualEditor.jsx - Editor thông minh với inline editing và visual feedback
import React, { useState } from "react";
import ImageChoiceEditor from "./editors/ImageChoiceEditor";
import ListeningEditor from "./editors/ListeningEditor";
import MatchingEditor from "./editors/MatchingEditor";
import QuizEditor from "./editors/QuizEditor";
import SentenceCompletionEditor from "./editors/SentenceCompletionEditor";
import TranslationEditor from "./editors/TranslationEditor";
import InlineEditor from "./InlineEditor";
import "./VisualEditor.css";

export default function VisualEditor({ lessonType, data, onChange }) {
  const [editingItem, setEditingItem] = useState(null);
  const [editingField, setEditingField] = useState(null);

  const handleInlineEdit = (path, value) => {
    // Validate trước khi update
    if (path.includes("grid_size")) {
      const questionIndex = parseInt(path.split(".")[1]);
      const question = data.questions?.[questionIndex];
      if (question) {
        const newGridSize = { ...question.grid_size };
        if (path.includes("rows")) {
          newGridSize.rows = parseInt(value) || 4;
        } else if (path.includes("cols")) {
          newGridSize.cols = parseInt(value) || 4;
        }

        // Validate grid size
        const totalCells = newGridSize.rows * newGridSize.cols;
        if (totalCells % 2 !== 0) {
          alert("Grid size phải là số chẵn (rows × cols phải chia hết cho 2)");
          return;
        }

        const maxPairs = totalCells / 2;
        const currentPairs = question.pairs?.length || 0;
        if (currentPairs > maxPairs) {
          alert(
            `Grid size mới chỉ cho phép tối đa ${maxPairs} cặp. Hiện tại có ${currentPairs} cặp. Vui lòng xóa bớt cặp trước.`
          );
          return;
        }
      }
    }

    // Update nested data structure
    const newData = updateNestedData(data, path, value);
    onChange(newData);
  };

  const handleAddItem = (type, parentPath = null) => {
    // Validate trước khi thêm
    if (type === "question") {
      if (!validateAddQuestion(data, lessonType)) {
        return;
      }
    } else if (type === "pair" && parentPath) {
      const questionIndex = parseInt(parentPath.split(".")[1]);
      const question = data.questions?.[questionIndex];
      if (question && !validateAddPair(question)) {
        alert(
          `Số cặp tối đa là ${
            (question.grid_size.rows * question.grid_size.cols) / 2
          }. Vui lòng tăng grid size trước.`
        );
        return;
      }
    } else if (
      type === "word" &&
      parentPath &&
      parentPath.includes("questions")
    ) {
      // Nếu thêm word vào question (sentence completion), cần tạo id mới
      const questionIndex = parseInt(parentPath.split(".")[1]);
      const question = data.questions?.[questionIndex];
      const maxId = Math.max(
        ...(question.shuffled_words || []).map((w) => w.id || 0),
        0
      );
      const newItem = {
        id: maxId + 1,
        text: "",
      };
      const newData = addItemToData(data, parentPath, newItem);
      onChange(newData);
      return;
    } else if (
      type === "blank" &&
      parentPath &&
      parentPath.includes("questions")
    ) {
      // Nếu thêm blank vào question (sentence completion)
      const questionIndex = parseInt(parentPath.split(".")[1]);
      const question = data.questions?.[questionIndex];
      const blankCount = (question.blanks || []).length;
      const newItem = {
        id: `blank${blankCount + 1}`,
        correct_word_id: question.shuffled_words?.[0]?.id || null,
      };
      const newData = addItemToData(data, parentPath, newItem);
      onChange(newData);
      return;
    }

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
        return <MatchingEditor data={data} onChange={onChange} />;
      case "vocabulary_translation":
        return <TranslationEditor data={data} onChange={onChange} />;
      case "vocabulary_quiz":
        return <QuizEditor data={data} onChange={onChange} />;
      case "vocabulary_listening":
        return <ListeningEditor data={data} onChange={onChange} />;
      case "vocabulary_image_choice":
        return <ImageChoiceEditor data={data} onChange={onChange} />;
      case "vocabulary_sentence_completion":
        return <SentenceCompletionEditor data={data} onChange={onChange} />;
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
          <div
            key={question.question_id}
            className="visual-editor-question-card"
          >
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
              <label>
                Kích thước lưới:{" "}
                <span className="visual-editor-hint">
                  (Tối đa:{" "}
                  {((question.grid_size?.rows || 4) *
                    (question.grid_size?.cols || 4)) /
                    2}{" "}
                  cặp)
                </span>
              </label>
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
              {(question.pairs || []).length > 0 && (
                <div className="visual-editor-validation">
                  Đã có: {(question.pairs || []).length} /{" "}
                  {((question.grid_size?.rows || 4) *
                    (question.grid_size?.cols || 4)) /
                    2}{" "}
                  cặp
                </div>
              )}
            </div>

            {/* Pairs */}
            <div className="visual-editor-field-group">
              <div className="visual-editor-field-group-header">
                <label>Các cặp từ:</label>
                <button
                  className="visual-editor-add-btn-small"
                  onClick={() => onAdd("pair", `questions.${qIndex}`)}
                  disabled={
                    (question.pairs || []).length >=
                    ((question.grid_size?.rows || 4) *
                      (question.grid_size?.cols || 4)) /
                      2
                  }
                >
                  + Thêm cặp
                </button>
              </div>

              {(question.pairs || []).map((pair, pIndex) => (
                <div key={pair.pair_id} className="visual-editor-item-card">
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
          <div
            key={question.question_id}
            className="visual-editor-question-card"
          >
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

// Vocabulary List Editor
function VocabularyListEditor({ data, onEdit, onAdd, onRemove }) {
  const words = data.words || [];

  return (
    <div className="visual-editor-questions">
      <div className="visual-editor-field-group">
        <label>Display Mode:</label>
        <select
          value={data.display_mode || "flashcard"}
          onChange={(e) => onEdit("display_mode", e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #d1d5db",
          }}
        >
          <option value="flashcard">Flashcard</option>
          <option value="list">List</option>
        </select>
      </div>

      <div className="visual-editor-field-group">
        <div className="visual-editor-field-group-header">
          <label>Danh sách từ:</label>
          <button
            className="visual-editor-add-btn-small"
            onClick={() => onAdd("word", null)}
          >
            + Thêm từ
          </button>
        </div>

        {words.map((word, wIndex) => (
          <div key={word.word_id} className="visual-editor-item-card">
            <div className="visual-editor-item-header">
              <span>Từ {wIndex + 1}</span>
              <button
                className="visual-editor-action-btn-small"
                onClick={() => onRemove(`words.${wIndex}`)}
              >
                ×
              </button>
            </div>
            <div className="visual-editor-item-fields">
              <InlineEditor
                type="text"
                value={word.en || ""}
                onChange={(value) => onEdit(`words.${wIndex}.en`, value)}
                placeholder="English"
                label="English *"
              />
              <InlineEditor
                type="text"
                value={word.vi || ""}
                onChange={(value) => onEdit(`words.${wIndex}.vi`, value)}
                placeholder="Vietnamese"
                label="Vietnamese *"
              />
              <InlineEditor
                type="url"
                value={word.image_url || ""}
                onChange={(value) => onEdit(`words.${wIndex}.image_url`, value)}
                placeholder="Image URL"
                label="Image URL"
              />
              <InlineEditor
                type="url"
                value={word.audio_url || ""}
                onChange={(value) => onEdit(`words.${wIndex}.audio_url`, value)}
                placeholder="Audio URL"
                label="Audio URL"
              />
              <InlineEditor
                type="text"
                value={word.example || ""}
                onChange={(value) => onEdit(`words.${wIndex}.example`, value)}
                placeholder="Example sentence"
                label="Example"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Vocabulary Quiz Editor
function VocabularyQuizEditor({ data, onEdit, onAdd, onRemove, onDuplicate }) {
  const questions = data.questions || [];

  return (
    <div className="visual-editor-questions">
      {questions.length === 0 ? (
        <div className="visual-editor-empty">
          <p>Chưa có câu hỏi nào. Nhấn "Thêm câu hỏi" để bắt đầu.</p>
        </div>
      ) : (
        questions.map((question, qIndex) => (
          <div
            key={question.question_id}
            className="visual-editor-question-card"
          >
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

            <div className="visual-editor-field-group">
              <label>Loại câu hỏi:</label>
              <select
                value={question.question_type || "text"}
                onChange={(e) =>
                  onEdit(`questions.${qIndex}.question_type`, e.target.value)
                }
                style={{
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                }}
              >
                <option value="text">Text</option>
                <option value="image">Image</option>
                <option value="audio">Audio</option>
              </select>
            </div>

            {question.question_type === "text" && (
              <InlineEditor
                type="text"
                value={question.question_text || ""}
                onChange={(value) =>
                  onEdit(`questions.${qIndex}.question_text`, value)
                }
                placeholder="Câu hỏi"
                label="Câu hỏi *"
              />
            )}

            {question.question_type === "image" && (
              <InlineEditor
                type="url"
                value={question.question_image_url || ""}
                onChange={(value) =>
                  onEdit(`questions.${qIndex}.question_image_url`, value)
                }
                placeholder="Image URL"
                label="Image URL *"
              />
            )}

            {question.question_type === "audio" && (
              <InlineEditor
                type="url"
                value={question.question_audio_url || ""}
                onChange={(value) =>
                  onEdit(`questions.${qIndex}.question_audio_url`, value)
                }
                placeholder="Audio URL"
                label="Audio URL *"
              />
            )}

            <div className="visual-editor-field-group">
              <div className="visual-editor-field-group-header">
                <label>Các lựa chọn:</label>
                <button
                  className="visual-editor-add-btn-small"
                  onClick={() => onAdd("choice", `questions.${qIndex}`)}
                >
                  + Thêm lựa chọn
                </button>
              </div>

              {(question.choices || []).map((choice, cIndex) => (
                <div key={choice.choice_id} className="visual-editor-item-card">
                  <div className="visual-editor-item-header">
                    <span>Lựa chọn {cIndex + 1}</span>
                    <button
                      className="visual-editor-action-btn-small"
                      onClick={() =>
                        onRemove(`questions.${qIndex}.choices.${cIndex}`)
                      }
                    >
                      ×
                    </button>
                  </div>
                  <div className="visual-editor-item-fields">
                    <InlineEditor
                      type="text"
                      value={choice.text || ""}
                      onChange={(value) =>
                        onEdit(
                          `questions.${qIndex}.choices.${cIndex}.text`,
                          value
                        )
                      }
                      placeholder="Text"
                      label="Text *"
                    />
                    <InlineEditor
                      type="url"
                      value={choice.image_url || ""}
                      onChange={(value) =>
                        onEdit(
                          `questions.${qIndex}.choices.${cIndex}.image_url`,
                          value
                        )
                      }
                      placeholder="Image URL"
                      label="Image URL"
                    />
                    <div className="visual-editor-checkbox">
                      <label>
                        <input
                          type="checkbox"
                          checked={choice.is_correct || false}
                          onChange={(e) =>
                            onEdit(
                              `questions.${qIndex}.choices.${cIndex}.is_correct`,
                              e.target.checked
                            )
                          }
                        />
                        <span>Đáp án đúng</span>
                      </label>
                    </div>
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

// Vocabulary Listening Editor
function VocabularyListeningEditor({
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
          <div
            key={question.question_id}
            className="visual-editor-question-card"
          >
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

            <InlineEditor
              type="url"
              value={question.audio_url || ""}
              onChange={(value) =>
                onEdit(`questions.${qIndex}.audio_url`, value)
              }
              placeholder="Audio URL"
              label="Audio URL *"
            />

            <div className="visual-editor-field-group">
              <label>Grid Size:</label>
              <div className="visual-editor-inline-fields">
                <InlineEditor
                  type="number"
                  value={question.grid?.rows || 3}
                  onChange={(value) =>
                    onEdit(`questions.${qIndex}.grid.rows`, value)
                  }
                  placeholder="Rows"
                />
                <span>×</span>
                <InlineEditor
                  type="number"
                  value={question.grid?.cols || 3}
                  onChange={(value) =>
                    onEdit(`questions.${qIndex}.grid.cols`, value)
                  }
                  placeholder="Cols"
                />
              </div>
            </div>

            <div className="visual-editor-field-group">
              <div className="visual-editor-field-group-header">
                <label>Các cells:</label>
                <button
                  className="visual-editor-add-btn-small"
                  onClick={() => onAdd("cell", `questions.${qIndex}`)}
                >
                  + Thêm cell
                </button>
              </div>

              {(question.grid?.cells || []).map((cell, cIndex) => (
                <div key={cell.cell_id} className="visual-editor-item-card">
                  <div className="visual-editor-item-header">
                    <span>Cell {cIndex + 1}</span>
                    <button
                      className="visual-editor-action-btn-small"
                      onClick={() =>
                        onRemove(`questions.${qIndex}.grid.cells.${cIndex}`)
                      }
                    >
                      ×
                    </button>
                  </div>
                  <div className="visual-editor-item-fields">
                    <InlineEditor
                      type="text"
                      value={cell.vi_text || ""}
                      onChange={(value) =>
                        onEdit(
                          `questions.${qIndex}.grid.cells.${cIndex}.vi_text`,
                          value
                        )
                      }
                      placeholder="Vietnamese text"
                      label="Vietnamese Text *"
                    />
                    <InlineEditor
                      type="url"
                      value={cell.image_url || ""}
                      onChange={(value) =>
                        onEdit(
                          `questions.${qIndex}.grid.cells.${cIndex}.image_url`,
                          value
                        )
                      }
                      placeholder="Image URL"
                      label="Image URL"
                    />
                    <div className="visual-editor-checkbox">
                      <label>
                        <input
                          type="checkbox"
                          checked={cell.is_correct || false}
                          onChange={(e) =>
                            onEdit(
                              `questions.${qIndex}.grid.cells.${cIndex}.is_correct`,
                              e.target.checked
                            )
                          }
                        />
                        <span>Đáp án đúng</span>
                      </label>
                    </div>
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

// Vocabulary Image Choice Editor
function VocabularyImageChoiceEditor({
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
          <div
            key={question.question_id}
            className="visual-editor-question-card"
          >
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

            <div className="visual-editor-field-group">
              <label>Loại câu hỏi:</label>
              <select
                value={question.question_type || "text"}
                onChange={(e) =>
                  onEdit(`questions.${qIndex}.question_type`, e.target.value)
                }
                style={{
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                }}
              >
                <option value="text">Text</option>
                <option value="audio">Audio</option>
              </select>
            </div>

            {question.question_type === "text" && (
              <InlineEditor
                type="text"
                value={question.question_text || ""}
                onChange={(value) =>
                  onEdit(`questions.${qIndex}.question_text`, value)
                }
                placeholder="Câu hỏi"
                label="Câu hỏi *"
              />
            )}

            {question.question_type === "audio" && (
              <InlineEditor
                type="url"
                value={question.question_audio_url || ""}
                onChange={(value) =>
                  onEdit(`questions.${qIndex}.question_audio_url`, value)
                }
                placeholder="Audio URL"
                label="Audio URL *"
              />
            )}

            <div className="visual-editor-field-group">
              <div className="visual-editor-field-group-header">
                <label>Danh sách ảnh:</label>
                <button
                  className="visual-editor-add-btn-small"
                  onClick={() => onAdd("image", `questions.${qIndex}`)}
                >
                  + Thêm ảnh
                </button>
              </div>

              {(question.images || []).map((image, imgIndex) => (
                <div key={image.image_id} className="visual-editor-item-card">
                  <div className="visual-editor-item-header">
                    <span>Ảnh {imgIndex + 1}</span>
                    <button
                      className="visual-editor-action-btn-small"
                      onClick={() =>
                        onRemove(`questions.${qIndex}.images.${imgIndex}`)
                      }
                    >
                      ×
                    </button>
                  </div>
                  <div className="visual-editor-item-fields">
                    <InlineEditor
                      type="url"
                      value={image.image_url || ""}
                      onChange={(value) =>
                        onEdit(
                          `questions.${qIndex}.images.${imgIndex}.image_url`,
                          value
                        )
                      }
                      placeholder="Image URL"
                      label="Image URL *"
                    />
                    <div className="visual-editor-checkbox">
                      <label>
                        <input
                          type="checkbox"
                          checked={image.is_correct || false}
                          onChange={(e) =>
                            onEdit(
                              `questions.${qIndex}.images.${imgIndex}.is_correct`,
                              e.target.checked
                            )
                          }
                        />
                        <span>Đáp án đúng</span>
                      </label>
                    </div>
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

// Helper functions
function updateNestedData(data, path, value) {
  const keys = path.split(".");
  const newData = JSON.parse(JSON.stringify(data));
  let current = newData;

  // Navigate to parent
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const index = parseInt(key);
    if (!isNaN(index)) {
      current = current[index];
    } else {
      if (!current[key]) {
        // Tạo object hoặc array tùy vào key tiếp theo
        const nextKey = keys[i + 1];
        const nextIndex = parseInt(nextKey);
        current[key] = !isNaN(nextIndex) ? [] : {};
      }
      current = current[key];
    }
  }

  // Set value
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
    // Add to root questions array hoặc words array
    if (data.type === "vocabulary_list") {
      if (!newData.words) newData.words = [];
      newData.words.push(newItem);
    } else {
      if (!newData.questions) newData.questions = [];
      newData.questions.push(newItem);
    }
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
    } else if (current && typeof current === "object") {
      // Xác định array cần thêm vào dựa trên type của newItem
      if (newItem.pair_id !== undefined) {
        if (!current.pairs) current.pairs = [];
        current.pairs.push(newItem);
      } else if (newItem.choice_id !== undefined) {
        if (!current.choices) current.choices = [];
        current.choices.push(newItem);
      } else if (newItem.cell_id !== undefined) {
        if (!current.grid) current.grid = { rows: 3, cols: 3, cells: [] };
        if (!current.grid.cells) current.grid.cells = [];
        current.grid.cells.push(newItem);
      } else if (newItem.image_id !== undefined) {
        if (!current.images) current.images = [];
        current.images.push(newItem);
      } else if (newItem.id && newItem.id.startsWith("blank")) {
        if (!current.blanks) current.blanks = [];
        current.blanks.push(newItem);
      } else if (newItem.id && !newItem.id.startsWith("blank")) {
        // shuffled_words
        if (!current.shuffled_words) current.shuffled_words = [];
        current.shuffled_words.push(newItem);
      } else if (newItem.word_id !== undefined) {
        if (!current.words) current.words = [];
        current.words.push(newItem);
      }
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
  if (type === "word") {
    return {
      word_id: Date.now(),
      en: "",
      vi: "",
      image_url: "",
      audio_url: "",
      example: "",
    };
  }
  if (type === "choice") {
    return {
      choice_id: Date.now(),
      text: "",
      image_url: "",
      is_correct: false,
    };
  }
  if (type === "cell") {
    return {
      cell_id: Date.now(),
      vi_text: "",
      image_url: "",
      is_correct: false,
      position: { row: 0, col: 0 },
    };
  }
  if (type === "image") {
    return {
      image_id: Date.now(),
      image_url: "",
      is_correct: false,
    };
  }
  if (type === "blank") {
    return {
      id: `blank${Date.now()}`,
      correct_word_id: null,
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
    vocabulary_quiz: {
      question_id: Date.now(),
      question_type: "text",
      question_text: "",
      question_image_url: "",
      question_audio_url: "",
      choices: [],
    },
    vocabulary_listening: {
      question_id: Date.now(),
      audio_url: "",
      grid: { rows: 3, cols: 3, cells: [] },
      play_count: 3,
    },
    vocabulary_image_choice: {
      question_id: Date.now(),
      question_type: "text",
      question_text: "",
      question_audio_url: "",
      images: [],
    },
    vocabulary_sentence_completion: {
      question_id: Date.now(),
      vi_text: "",
      sentence_template: "",
      shuffled_words: [],
      blanks: [],
    },
  };
  return defaults[lessonType] || { question_id: Date.now() };
}

// Validation functions
function validateAddQuestion(data, lessonType) {
  // Có thể thêm validation chung ở đây
  return true;
}

function validateAddPair(question) {
  if (!question.grid_size) return false;
  const maxPairs = (question.grid_size.rows * question.grid_size.cols) / 2;
  const currentPairs = question.pairs?.length || 0;
  return currentPairs < maxPairs;
}

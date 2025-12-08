// SentenceCompletionEditor.jsx - Editor theo flow mới: bôi đen → tạo blank
import React, { useEffect, useRef, useState } from "react";
import "./SentenceCompletionEditor.css";

export default function SentenceCompletionEditor({ data, onChange }) {
  const genId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const [questions, setQuestions] = useState([]);
  const [activeQuestionId, setActiveQuestionId] = useState(null);
  const [selectedText, setSelectedText] = useState(null); // { start, end, text }
  const [isBlankMode, setIsBlankMode] = useState(false);
  const [newWordInput, setNewWordInput] = useState("");

  const textareaRef = useRef(null);
  const isInternalUpdate = useRef(false);

  // Load data từ props
  useEffect(() => {
    if (isInternalUpdate.current) {
      // Bỏ qua khi chính editor gọi onChange để tránh reset activeIndex
      isInternalUpdate.current = false;
      return;
    }

    if (data?.questions?.length) {
      const seen = new Set();
      const qs = data.questions.map((q) => {
        let qid = q.question_id || genId();
        if (seen.has(qid)) qid = genId();
        seen.add(qid);

        if (!q.sentence_template) {
          return {
            vi_text: q.vi_text || "",
            sentence_text: "",
            blanks: [],
            word_bank: [],
            question_id: qid,
          };
        }
        // parse template to text/blanks
        const parts = q.sentence_template.split(/(\{[^}]+\})/);
        let fullText = "";
        const newBlanks = [];
        parts.forEach((part) => {
          const m = part.match(/\{([^}]+)\}/);
          if (m) {
            const blankId = m[1];
            const blank = q.blanks?.find((b) => b.id === blankId);
            const word = q.shuffled_words?.find(
              (w) => w.id === blank?.correct_word_id
            );
            if (word) {
              newBlanks.push({
                id: blankId,
                answer: word.text,
                start: fullText.length,
                end: fullText.length + word.text.length,
              });
              fullText += word.text;
            }
          } else {
            fullText += part;
          }
        });
        const answerWords = newBlanks.map((b) => b.answer);
        const allWords = q.shuffled_words?.map((w) => w.text) || [];
        const wordBankWords = allWords.filter((w) => !answerWords.includes(w));
        return {
          vi_text: q.vi_text || "",
          sentence_text: fullText,
          blanks: newBlanks,
          word_bank: wordBankWords,
          question_id: qid,
        };
      });
      setQuestions(qs);
      // giữ tab theo question_id; nếu không tồn tại thì chọn câu đầu tiên
      if (
        !activeQuestionId ||
        !qs.some((q) => q.question_id === activeQuestionId)
      ) {
        setActiveQuestionId(qs[0]?.question_id || null);
      }
    } else {
      // init one empty question
      const firstId = genId();
      setQuestions([
        {
          vi_text: "",
          sentence_text: "",
          blanks: [],
          word_bank: [],
          question_id: firstId,
        },
      ]);
      setActiveQuestionId(firstId);
    }
  }, [data]);

  // Derived fields for active question
  const activeIndex = questions.findIndex(
    (q) => q.question_id === activeQuestionId
  );
  const resolvedIndex = activeIndex >= 0 ? activeIndex : 0;
  const activeQ = questions[resolvedIndex] || {};
  const sentenceText = activeQ.sentence_text || "";
  const blanks = activeQ.blanks || [];
  const wordBank = activeQ.word_bank || [];
  const currentViText = activeQ.vi_text || "";

  // Handle text selection
  const handleTextSelection = () => {
    if (!isBlankMode) return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = sentenceText.substring(start, end);

    if (selected.trim()) {
      setSelectedText({ start, end, text: selected });
    } else {
      setSelectedText(null);
    }
  };

  // Tạo blank từ text đã chọn
  const handleCreateBlank = () => {
    if (!selectedText) return;

    const { start, end, text } = selectedText;
    const blankId = `blank${Date.now()}`;

    // Kiểm tra xem có overlap với blank khác không
    const hasOverlap = blanks.some(
      (blank) =>
        (start >= blank.start && start < blank.end) ||
        (end > blank.start && end <= blank.end) ||
        (start <= blank.start && end >= blank.end)
    );

    if (hasOverlap) {
      alert("Vị trí này đã có blank. Vui lòng chọn vị trí khác.");
      return;
    }

    const newBlank = {
      id: blankId,
      answer: text.trim(),
      start,
      end,
    };

    updateActiveQuestion((q) => {
      const newBlanks = [...q.blanks, newBlank].sort(
        (a, b) => a.start - b.start
      );
      const newWordBank = q.word_bank.includes(text.trim())
        ? q.word_bank
        : [...q.word_bank, text.trim()];
      return { ...q, blanks: newBlanks, word_bank: newWordBank };
    });
    setSelectedText(null);
  };

  // Xóa blank
  const handleRemoveBlank = (blankId) => {
    updateActiveQuestion((q) => ({
      ...q,
      blanks: q.blanks.filter((b) => b.id !== blankId),
    }));
  };

  // Sửa đáp án blank
  const handleEditBlankAnswer = (blankId, newAnswer) => {
    const trimmed = newAnswer.trim();
    updateActiveQuestion((q) => {
      const newBlanks = q.blanks.map((b) =>
        b.id === blankId ? { ...b, answer: trimmed } : b
      );
      const needAdd =
        trimmed &&
        !q.word_bank.includes(trimmed) &&
        !q.blanks.some((b) => b.answer === trimmed);
      const newWordBank = needAdd ? [...q.word_bank, trimmed] : q.word_bank;
      return { ...q, blanks: newBlanks, word_bank: newWordBank };
    });
  };

  // Thêm từ vào word bank
  const handleAddWord = () => {
    const word = newWordInput.trim();
    if (!word) return;

    updateActiveQuestion((q) => {
      if (q.word_bank.includes(word)) return q;
      return { ...q, word_bank: [...q.word_bank, word] };
    });
    setNewWordInput("");
  };

  // Xóa từ khỏi word bank
  const handleRemoveWord = (word) => {
    // Không cho xóa nếu từ đó là đáp án của blank
    const isAnswer = (activeQ.blanks || []).some((b) => b.answer === word);
    if (isAnswer) {
      alert("Không thể xóa từ này vì nó là đáp án của một blank.");
      return;
    }

    updateActiveQuestion((q) => ({
      ...q,
      word_bank: q.word_bank.filter((w) => w !== word),
    }));
  };

  // Render sentence với blanks để preview
  const renderSentenceWithBlanks = () => {
    if (!sentenceText) return [];
    const parts = [];
    let lastIndex = 0;
    const sortedBlanks = [...blanks].sort((a, b) => a.start - b.start);
    sortedBlanks.forEach((blank) => {
      if (blank.start > lastIndex) {
        parts.push({
          type: "text",
          content: sentenceText.substring(lastIndex, blank.start),
        });
      }
      parts.push({
        type: "blank",
        id: blank.id,
        answer: blank.answer,
      });
      lastIndex = blank.end;
    });
    if (lastIndex < sentenceText.length) {
      parts.push({
        type: "text",
        content: sentenceText.substring(lastIndex),
      });
    }
    if (parts.length === 0) {
      parts.push({
        type: "text",
        content: sentenceText,
      });
    }
    return parts;
  };

  // Update data và gửi lên parent
  const updateData = (qs) => {
    isInternalUpdate.current = true;
    onChange({
      type: "vocabulary_sentence_completion",
      questions: qs.map((q) => {
        // build template
        let template = q.sentence_text || "";
        const sortedBlanks = [...q.blanks].sort((a, b) => b.start - a.start);
        sortedBlanks.forEach((blank) => {
          const before = template.substring(0, blank.start);
          const after = template.substring(blank.end);
          template = before + `{${blank.id}}` + after;
        });
        const allWords = [
          ...q.blanks.map((b) => b.answer),
          ...q.word_bank,
        ].filter((word, idx, self) => self.indexOf(word) === idx);
        const shuffledWords = allWords.map((word, idx) => ({
          id: idx + 1,
          text: word,
        }));
        const blanksData = q.blanks.map((blank) => {
          const wordId = shuffledWords.find((w) => w.text === blank.answer)?.id;
          return { id: blank.id, correct_word_id: wordId || 1 };
        });
        return {
          question_id: q.question_id || genId(),
          vi_text: q.vi_text || "",
          sentence_template: template,
          shuffled_words: shuffledWords,
          blanks: blanksData,
        };
      }),
    });
  };

  const updateActiveQuestion = (updater) => {
    setQuestions((prev) => {
      const idx = prev.findIndex((q) => q.question_id === activeQuestionId);
      if (idx === -1) return prev;
      const next = [...prev];
      next[idx] = updater(prev[idx]);
      updateData(next);
      return next;
    });
  };

  const handleViTextChange = (e) => {
    const viText = e.target.value;
    updateActiveQuestion((q) => ({ ...q, vi_text: viText }));
  };

  // Handle sentence text change
  const handleSentenceChange = (e) => {
    const newText = e.target.value;
    updateActiveQuestion((q) => {
      const adjustedBlanks = q.blanks.filter((b) => b.end <= newText.length);
      return { ...q, sentence_text: newText, blanks: adjustedBlanks };
    });
  };

  // Add new question
  const handleAddQuestion = () => {
    setQuestions((prev) => {
      const newId = genId();
      const next = [
        ...prev,
        {
          vi_text: "",
          sentence_text: "",
          blanks: [],
          word_bank: [],
          question_id: newId,
        },
      ];
      updateData(next);
      setActiveQuestionId(newId);
      return next;
    });
  };

  // Remove question
  const handleRemoveQuestion = (idx) => {
    setQuestions((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      updateData(next);
      if (!next.length) {
        const firstId = genId();
        const fallback = [
          {
            vi_text: "",
            sentence_text: "",
            blanks: [],
            word_bank: [],
            question_id: firstId,
          },
        ];
        updateData(fallback);
        setActiveQuestionId(firstId);
        return fallback;
      }

      if (prev[idx]?.question_id === activeQuestionId) {
        const nextIdx = Math.min(idx, next.length - 1);
        setActiveQuestionId(next[nextIdx].question_id);
      }

      return next.length ? next : prev;
    });
  };
  const sentenceParts = renderSentenceWithBlanks();

  return (
    <div className="sentence-completion-editor">
      {/* Tabs câu hỏi */}
      <div className="sce-question-tabs">
        <div className="sce-question-list">
          {questions.map((q, idx) => (
            <button
              key={q.question_id || idx}
              className={`sce-question-tab ${
                q.question_id === activeQuestionId ? "active" : ""
              }`}
              onClick={() => {
                setActiveQuestionId(q.question_id);
                setSelectedText(null);
                setIsBlankMode(false);
              }}
            >
              Câu {idx + 1}
            </button>
          ))}
          <button className="sce-add-question" onClick={handleAddQuestion}>
            + Thêm câu
          </button>
        </div>
        {questions.length > 1 && (
          <button
            className="sce-remove-question"
            onClick={() => handleRemoveQuestion(activeIndex)}
            title="Xóa câu hiện tại"
          >
            🗑 Xóa câu này
          </button>
        )}
      </div>

      {/* Câu tiếng Việt */}
      <div className="sce-step">
        <label className="sce-label">Câu tiếng Việt *</label>
        <input
          type="text"
          key={`vi-${activeIndex}`}
          value={currentViText}
          onChange={handleViTextChange}
          className="sce-input"
          placeholder="Ví dụ: Tôi đang học tiếng Anh mỗi ngày"
        />
      </div>

      {/* STEP 1: Nhập câu gốc */}
      <div className="sce-step">
        <label className="sce-label">Câu hoàn chỉnh (Tiếng Anh) *</label>
        <textarea
          ref={textareaRef}
          className="sce-textarea"
          key={`en-${activeIndex}`}
          value={sentenceText}
          onChange={handleSentenceChange}
          onSelect={handleTextSelection}
          placeholder="Nhập câu hoàn chỉnh, ví dụ: I am learning English every day"
          rows={4}
        />
        <p className="sce-hint">
          💡 Nhập câu hoàn chỉnh trước. Sau đó bật chế độ "Tạo chỗ trống" để tạo
          blanks.
        </p>
      </div>

      {/* STEP 2: Tạo blank */}
      {sentenceText && (
        <div className="sce-step">
          <div className="sce-step-header">
            <label className="sce-label">Tạo chỗ trống</label>
            <button
              className={`sce-btn ${
                isBlankMode ? "sce-btn-active" : "sce-btn-primary"
              }`}
              onClick={() => {
                setIsBlankMode(!isBlankMode);
                setSelectedText(null);
              }}
            >
              {isBlankMode ? "✖️ Tắt chế độ Blank" : "➕ Bật chế độ Blank"}
            </button>
          </div>

          {isBlankMode && (
            <div className="sce-blank-mode-hint">
              <p>
                💡 <strong>Hướng dẫn:</strong> Bôi đen từ/cụm từ trong câu trên,
                sau đó click nút "Tạo Blank" bên dưới
              </p>
              {selectedText && (
                <div className="sce-selected-text">
                  <strong>Đã chọn:</strong> "{selectedText.text}"
                  <button
                    className="sce-btn sce-btn-small sce-btn-success"
                    onClick={handleCreateBlank}
                  >
                    ✅ Tạo Blank
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Hiển thị câu với blanks */}
          {sentenceParts && sentenceParts.length > 0 && (
            <div className="sce-sentence-preview">
              <label className="sce-label">Xem trước câu với blanks:</label>
              <div className="sce-sentence-display">
                {sentenceParts.map((part, index) => {
                  if (part.type === "text") {
                    return <span key={index}>{part.content}</span>;
                  } else {
                    return (
                      <span key={index} className="sce-blank-display">
                        [____]
                      </span>
                    );
                  }
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 3: Bảng quản lý Blank */}
      {blanks.length > 0 && (
        <div className="sce-step">
          <label className="sce-label">Quản lý Blanks</label>
          <table className="sce-blanks-table">
            <thead>
              <tr>
                <th>Blank</th>
                <th>Đáp án đúng</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {blanks
                .sort((a, b) => a.start - b.start)
                .map((blank, index) => (
                  <tr key={blank.id}>
                    <td>Blank {index + 1}</td>
                    <td>
                      <input
                        type="text"
                        value={blank.answer}
                        onChange={(e) =>
                          handleEditBlankAnswer(blank.id, e.target.value)
                        }
                        className="sce-input"
                        placeholder="Đáp án"
                      />
                    </td>
                    <td>
                      <button
                        className="sce-btn sce-btn-danger sce-btn-small"
                        onClick={() => handleRemoveBlank(blank.id)}
                      >
                        🗑️ Xóa
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* STEP 4: Word Bank */}
      <div className="sce-step">
        <label className="sce-label">Danh sách từ kéo thả (Word Bank)</label>
        <p className="sce-hint">
          💡 Các đáp án đúng sẽ tự động được thêm vào word bank. Bạn chỉ cần
          thêm các từ nhiễu.
        </p>
        <div className="sce-word-bank-input">
          <input
            type="text"
            value={newWordInput}
            onChange={(e) => setNewWordInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddWord();
              }
            }}
            placeholder="Nhập từ và nhấn Enter để thêm"
            className="sce-input"
          />
          <button className="sce-btn sce-btn-primary" onClick={handleAddWord}>
            ➕ Thêm
          </button>
        </div>

        {wordBank.length > 0 && (
          <div className="sce-word-bank-tags">
            {wordBank.map((word, index) => {
              const isAnswer = blanks.some((b) => b.answer === word);
              return (
                <span
                  key={index}
                  className={`sce-word-tag ${isAnswer ? "is-answer" : ""}`}
                >
                  {word}
                  {!isAnswer && (
                    <button
                      className="sce-tag-remove"
                      onClick={() => handleRemoveWord(word)}
                    >
                      ×
                    </button>
                  )}
                </span>
              );
            })}
          </div>
        )}

        {blanks.length > 0 && (
          <div className="sce-word-bank-hint">
            <small>
              💡 Các từ có viền xanh là đáp án của blanks (không thể xóa)
            </small>
          </div>
        )}
      </div>

      {/* STEP 5: Preview nhanh (UI học viên) */}
      {sentenceParts && sentenceParts.length > 0 && wordBank.length > 0 && (
        <div className="sce-step">
          <label className="sce-label">Preview (UI học viên sẽ thấy)</label>
          <div className="sce-preview-box">
            <div className="sce-preview-sentence">
              {sentenceParts.map((part, index) => {
                if (part.type === "text") {
                  return <span key={index}>{part.content}</span>;
                } else {
                  return (
                    <span key={index} className="sce-preview-blank">
                      [____]
                    </span>
                  );
                }
              })}
            </div>
            <div className="sce-preview-words">
              {wordBank.map((word, index) => (
                <span key={index} className="sce-preview-word">
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 6: Cấu hình hành vi */}
      <div className="sce-step">
        <label className="sce-label">Cấu hình</label>
        <div className="sce-config">
          <label className="sce-checkbox">
            <input type="checkbox" defaultChecked />
            <span>Cho phép kéo thả</span>
          </label>
          <label className="sce-checkbox">
            <input type="checkbox" defaultChecked />
            <span>Hiện nút "Kiểm tra"</span>
          </label>
          <label className="sce-checkbox">
            <input type="checkbox" defaultChecked />
            <span>Hiện nút "Đáp án"</span>
          </label>
          <label className="sce-checkbox">
            <input type="checkbox" defaultChecked />
            <span>Tự sang câu khác khi đúng</span>
          </label>
        </div>
      </div>
    </div>
  );
}

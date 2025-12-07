// SentenceCompletionEditor.jsx - Editor theo flow mới: bôi đen → tạo blank
import React, { useState, useRef, useEffect } from "react";
import "./SentenceCompletionEditor.css";

export default function SentenceCompletionEditor({ data, onChange }) {
  const [sentenceText, setSentenceText] = useState("");
  const [blanks, setBlanks] = useState([]); // [{ id, answer, start, end }]
  const [wordBank, setWordBank] = useState([]); // ["word1", "word2", ...]
  const [newWordInput, setNewWordInput] = useState("");
  const [selectedText, setSelectedText] = useState(null); // { start, end, text }
  const [isBlankMode, setIsBlankMode] = useState(false);
  const textareaRef = useRef(null);

  // Load data từ props
  useEffect(() => {
    // Không khởi tạo lại nếu đã có data hợp lệ
    if (!data || !data.questions || data.questions.length === 0) {
      // Chỉ set state rỗng, không gọi onChange để tránh vòng lặp
      setSentenceText("");
      setBlanks([]);
      setWordBank([]);
      return;
    }

    const question = data.questions[0];
    
    // Nếu có sentence_template, parse nó
    if (question.sentence_template && question.sentence_template.trim() !== "") {
      // Parse sentence_template để lấy text và blanks
      const template = question.sentence_template;
      const parts = template.split(/(\{[^}]+\})/);
      let fullText = "";
      const newBlanks = [];

      parts.forEach((part) => {
        if (part.match(/\{([^}]+)\}/)) {
          const blankId = part.match(/\{([^}]+)\}/)[1];
          const blank = question.blanks?.find((b) => b.id === blankId);
          const word = question.shuffled_words?.find(
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

      setSentenceText(fullText);
      setBlanks(newBlanks);
      
      // Word bank = tất cả words trừ answers (để tránh duplicate)
      const answerWords = newBlanks.map((b) => b.answer);
      const allWords = question.shuffled_words?.map((w) => w.text) || [];
      const wordBankWords = allWords.filter((w) => !answerWords.includes(w));
      setWordBank(wordBankWords);
    } else {
      // Nếu chưa có sentence_template, khởi tạo rỗng
      setSentenceText("");
      setBlanks([]);
      setWordBank([]);
    }
  }, [data]);

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

    const newBlanks = [...blanks, newBlank].sort((a, b) => a.start - b.start);
    setBlanks(newBlanks);
    setSelectedText(null);

    // Auto thêm answer vào word bank nếu chưa có
    if (!wordBank.includes(text.trim())) {
      setWordBank([...wordBank, text.trim()]);
      updateData(sentenceText, newBlanks, [...wordBank, text.trim()]);
    } else {
      updateData(sentenceText, newBlanks, wordBank);
    }
  };

  // Xóa blank
  const handleRemoveBlank = (blankId) => {
    const blank = blanks.find((b) => b.id === blankId);
    if (!blank) return;

    const newBlanks = blanks.filter((b) => b.id !== blankId);
    setBlanks(newBlanks);
    
    // Không xóa answer khỏi word bank (giữ lại để có thể dùng lại)
    updateData(sentenceText, newBlanks, wordBank);
  };

  // Sửa đáp án blank
  const handleEditBlankAnswer = (blankId, newAnswer) => {
    const newBlanks = blanks.map((b) =>
      b.id === blankId ? { ...b, answer: newAnswer } : b
    );
    setBlanks(newBlanks);
    
    // Auto thêm answer mới vào word bank nếu chưa có
    if (!wordBank.includes(newAnswer.trim()) && newAnswer.trim()) {
      setWordBank([...wordBank, newAnswer.trim()]);
      updateData(sentenceText, newBlanks, [...wordBank, newAnswer.trim()]);
    } else {
      updateData(sentenceText, newBlanks, wordBank);
    }
  };

  // Thêm từ vào word bank
  const handleAddWord = () => {
    const word = newWordInput.trim();
    if (!word) return;

    if (!wordBank.includes(word)) {
      const newWordBank = [...wordBank, word];
      setWordBank(newWordBank);
      updateData(sentenceText, blanks, newWordBank);
    }
    setNewWordInput("");
  };

  // Xóa từ khỏi word bank
  const handleRemoveWord = (word) => {
    // Không cho xóa nếu từ đó là đáp án của blank
    const isAnswer = blanks.some((b) => b.answer === word);
    if (isAnswer) {
      alert("Không thể xóa từ này vì nó là đáp án của một blank.");
      return;
    }

    const newWordBank = wordBank.filter((w) => w !== word);
    setWordBank(newWordBank);
    updateData(sentenceText, blanks, newWordBank);
  };

  // Render sentence với blanks để preview
  const renderSentenceWithBlanks = () => {
    if (!sentenceText) return [];

    const parts = [];
    let lastIndex = 0;

    // Sort blanks by start position
    const sortedBlanks = [...blanks].sort((a, b) => a.start - b.start);

    sortedBlanks.forEach((blank) => {
      // Text trước blank
      if (blank.start > lastIndex) {
        parts.push({
          type: "text",
          content: sentenceText.substring(lastIndex, blank.start),
        });
      }

      // Blank
      parts.push({
        type: "blank",
        id: blank.id,
        answer: blank.answer,
      });

      lastIndex = blank.end;
    });

    // Text sau blank cuối
    if (lastIndex < sentenceText.length) {
      parts.push({
        type: "text",
        content: sentenceText.substring(lastIndex),
      });
    }

    // Nếu không có blank nào, trả về toàn bộ text
    if (parts.length === 0) {
      parts.push({
        type: "text",
        content: sentenceText,
      });
    }

    return parts;
  };

  // Update data và gửi lên parent
  const updateData = (text, blanksList, words) => {
    // Tạo sentence_template
    let template = text;
    const sortedBlanks = [...blanksList].sort((a, b) => b.start - a.start);

    // Thay thế từ cuối lên đầu để không bị lệch index
    sortedBlanks.forEach((blank) => {
      const before = template.substring(0, blank.start);
      const after = template.substring(blank.end);
      template = before + `{${blank.id}}` + after;
    });

    // Tạo shuffled_words (gộp answers và word bank, loại bỏ duplicate)
    const allWords = [
      ...blanksList.map((b) => b.answer),
      ...words,
    ].filter((word, index, self) => self.indexOf(word) === index);

    const shuffledWords = allWords.map((word, index) => ({
      id: index + 1,
      text: word,
    }));

    // Tạo blanks với correct_word_id
    const blanksData = blanksList.map((blank) => {
      const wordId = shuffledWords.find((w) => w.text === blank.answer)?.id;
      return {
        id: blank.id,
        correct_word_id: wordId || 1,
      };
    });

    // Giữ lại vi_text từ data hiện tại
    const currentViText = data?.questions?.[0]?.vi_text || "";
    const currentQuestionId = data?.questions?.[0]?.question_id || Date.now();

    const questionData = {
      question_id: currentQuestionId,
      vi_text: currentViText,
      sentence_template: template,
      shuffled_words: shuffledWords,
      blanks: blanksData,
    };

    onChange({
      type: "vocabulary_sentence_completion",
      questions: [questionData],
    });
  };

  // Handle sentence text change
  const handleSentenceChange = (e) => {
    const newText = e.target.value;
    setSentenceText(newText);
    
    // Khi text thay đổi, cần điều chỉnh blank positions
    // Nếu text bị xóa/cắt ngắn, có thể cần xóa blanks nằm ngoài text
    const adjustedBlanks = blanks.filter((blank) => blank.end <= newText.length);
    
    // Nếu có blanks bị mất, cập nhật lại
    if (adjustedBlanks.length !== blanks.length) {
      setBlanks(adjustedBlanks);
      updateData(newText, adjustedBlanks, wordBank);
    } else {
      updateData(newText, blanks, wordBank);
    }
  };
  
  // Thêm input cho câu tiếng Việt
  const handleViTextChange = (e) => {
    const viText = e.target.value;
    
    // Đảm bảo có question để update
    const currentQuestionId = data?.questions?.[0]?.question_id || Date.now();
    const currentTemplate = data?.questions?.[0]?.sentence_template || "";
    const currentShuffledWords = data?.questions?.[0]?.shuffled_words || [];
    const currentBlanks = data?.questions?.[0]?.blanks || [];
    
    const questionData = {
      question_id: currentQuestionId,
      vi_text: viText,
      sentence_template: currentTemplate,
      shuffled_words: currentShuffledWords,
      blanks: currentBlanks,
    };
    
    onChange({
      type: "vocabulary_sentence_completion",
      questions: [questionData],
    });
  };

  const sentenceParts = renderSentenceWithBlanks();
  const currentViText = data?.questions?.[0]?.vi_text || "";

  return (
    <div className="sentence-completion-editor">
      {/* Câu tiếng Việt */}
      <div className="sce-step">
        <label className="sce-label">Câu tiếng Việt *</label>
        <input
          type="text"
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
          value={sentenceText}
          onChange={handleSentenceChange}
          onSelect={handleTextSelection}
          placeholder="Nhập câu hoàn chỉnh, ví dụ: I am learning English every day"
          rows={4}
        />
        <p className="sce-hint">
          💡 Nhập câu hoàn chỉnh trước. Sau đó bật chế độ "Tạo chỗ trống" để tạo blanks.
        </p>
      </div>

      {/* STEP 2: Tạo blank */}
      {sentenceText && (
        <div className="sce-step">
          <div className="sce-step-header">
            <label className="sce-label">Tạo chỗ trống</label>
            <button
              className={`sce-btn ${isBlankMode ? "sce-btn-active" : "sce-btn-primary"}`}
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
          💡 Các đáp án đúng sẽ tự động được thêm vào word bank. Bạn chỉ cần thêm các từ nhiễu.
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

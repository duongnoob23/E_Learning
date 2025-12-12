// SentenceCompletionEditor.jsx - Editor theo flow mới: bôi đen → tạo blank
// Editor này cho phép tạo bài tập "Hoàn thiện câu" bằng cách:
// 1. Nhập câu tiếng Anh đầy đủ
// 2. Bôi đen từ/cụm từ → tạo blank
// 3. Quản lý word bank (từ để kéo thả)
import React, { useEffect, useRef, useState } from "react";
import "./SentenceCompletionEditor.css";

export default function SentenceCompletionEditor({ data, onChange }) {
  // Hàm tạo ID unique cho câu hỏi và blank
  const genId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  // State quản lý danh sách câu hỏi (mỗi câu hỏi có thể có nhiều blank)
  const [questions, setQuestions] = useState([]);

  // State lưu ID của câu hỏi đang được chỉnh sửa
  const [activeQuestionId, setActiveQuestionId] = useState(null);

  // State lưu thông tin text đã bôi đen: { start: vị trí bắt đầu, end: vị trí kết thúc, text: nội dung }
  const [selectedText, setSelectedText] = useState(null);

  // State bật/tắt chế độ tạo blank (khi bật, user có thể bôi đen text để tạo blank)
  const [isBlankMode, setIsBlankMode] = useState(false);

  // State lưu input khi thêm từ mới vào word bank
  const [newWordInput, setNewWordInput] = useState("");

  // State hiển thị modal import JSON
  const [showImportJSON, setShowImportJSON] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState(null);

  // Ref đến textarea để lấy vị trí cursor (selectionStart, selectionEnd)
  const textareaRef = useRef(null);

  // Flag để tránh vòng lặp update: khi editor tự gọi onChange, không reload lại từ props
  const isInternalUpdate = useRef(false);

  // Load dữ liệu từ props khi component mount hoặc data thay đổi
  // Chuyển đổi từ format database (có sentence_template) sang format nội bộ (có sentence_text + blanks với start/end)
  useEffect(() => {
    // Nếu đang update nội bộ (editor tự gọi onChange), bỏ qua để tránh reset activeIndex
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    // Nếu có dữ liệu từ parent
    if (data?.questions?.length) {
      const seen = new Set(); // Set để tránh trùng question_id
      const qs = data.questions.map((q) => {
        // Tạo hoặc lấy question_id, đảm bảo không trùng
        let qid = q.question_id || genId();
        if (seen.has(qid)) qid = genId();
        seen.add(qid);

        // Nếu không có sentence_template → tạo câu hỏi rỗng
        if (!q.sentence_template) {
          return {
            vi_text: q.vi_text || "",
            sentence_text: "", // Câu đầy đủ (format nội bộ)
            blanks: [], // Mảng các blank
            word_bank: [], // Từ nhiễu (không phải đáp án)
            question_id: qid,
          };
        }

        // Parse sentence_template: "I am {blank1} happy {blank2}"
        // Kết quả: ["I am ", "{blank1}", " happy ", "{blank2}"]
        const parts = q.sentence_template.split(/(\{[^}]+\})/);
        let fullText = ""; // Câu đầy đủ: "I am happy"
        const newBlanks = [];

        parts.forEach((part) => {
          const m = part.match(/\{([^}]+)\}/); // Tìm {blank1}
          if (m) {
            // Đây là blank
            const blankId = m[1]; // "blank1"
            const blank = q.blanks?.find((b) => b.id === blankId);
            // Tìm word tương ứng với correct_word_id
            const word = q.shuffled_words?.find(
              (w) => w.id === blank?.correct_word_id
            );
            if (word) {
              // Thêm blank vào mảng với vị trí start/end
              newBlanks.push({
                id: blankId,
                answer: word.text, // "happy"
                start: fullText.length, // Vị trí bắt đầu trong câu
                end: fullText.length + word.text.length, // Vị trí kết thúc
              });
              fullText += word.text; // Thêm từ vào câu đầy đủ
            }
          } else {
            // Đây là text thường
            fullText += part;
          }
        });

        // Tách word bank: từ không phải đáp án
        const answerWords = newBlanks.map((b) => b.answer);
        const allWords = q.shuffled_words?.map((w) => w.text) || [];
        const wordBankWords = allWords.filter((w) => !answerWords.includes(w));

        return {
          vi_text: q.vi_text || "",
          sentence_text: fullText, // "I am happy"
          blanks: newBlanks, // [{ id: "blank1", answer: "happy", start: 5, end: 9 }]
          word_bank: wordBankWords, // ["sad", "rainy"]
          question_id: qid,
        };
      });
      setQuestions(qs);

      // Giữ tab theo question_id; nếu không tồn tại thì chọn câu đầu tiên
      if (
        !activeQuestionId ||
        !qs.some((q) => q.question_id === activeQuestionId)
      ) {
        setActiveQuestionId(qs[0]?.question_id || null);
      }
    } else {
      // Khởi tạo một câu hỏi rỗng nếu không có dữ liệu
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

  // Lấy thông tin câu hỏi đang active
  const activeIndex = questions.findIndex(
    (q) => q.question_id === activeQuestionId
  );
  const resolvedIndex = activeIndex >= 0 ? activeIndex : 0;
  const activeQ = questions[resolvedIndex] || {};
  const sentenceText = activeQ.sentence_text || ""; // Câu đầy đủ
  const blanks = activeQ.blanks || []; // Mảng các blank
  const wordBank = activeQ.word_bank || []; // Từ nhiễu
  const currentViText = activeQ.vi_text || ""; // Câu tiếng Việt

  // Xử lý khi user bôi đen text trong textarea
  // Hàm này được gọi khi user chọn text (onSelect event)
  const handleTextSelection = () => {
    // Chỉ hoạt động khi bật Blank Mode
    if (!isBlankMode) {
      setSelectedText(null); // Reset nếu không ở blank mode
      return;
    }

    const textarea = textareaRef.current;
    if (!textarea) return;

    // Lấy vị trí bắt đầu và kết thúc của text đã chọn
    const start = textarea.selectionStart; // Vị trí cursor bắt đầu
    const end = textarea.selectionEnd; // Vị trí cursor kết thúc

    // Kiểm tra xem có text được chọn không (start !== end)
    if (start === end) {
      setSelectedText(null); // Không có text được chọn
      return;
    }

    const selected = sentenceText.substring(start, end); // Text đã chọn

    // Lưu thông tin text đã chọn để hiển thị và tạo blank
    if (selected.trim()) {
      setSelectedText({ start, end, text: selected });
      // Ví dụ: { start: 5, end: 9, text: "happy" }
    } else {
      setSelectedText(null);
    }
  };

  // Tạo blank từ text đã bôi đen
  // Hàm này được gọi khi user click nút "Tạo Blank"
  const handleCreateBlank = () => {
    if (!selectedText) return;

    const { start, end, text } = selectedText;
    const blankId = `blank${Date.now()}`; // Tạo ID unique cho blank

    // Kiểm tra xem có overlap với blank khác không
    // Không cho tạo blank trùng với blank đã có
    const hasOverlap = blanks.some(
      (blank) =>
        (start >= blank.start && start < blank.end) || // Bắt đầu trong blank cũ
        (end > blank.start && end <= blank.end) || // Kết thúc trong blank cũ
        (start <= blank.start && end >= blank.end) // Bao trùm blank cũ
    );

    if (hasOverlap) {
      alert("Vị trí này đã có blank. Vui lòng chọn vị trí khác.");
      return;
    }

    // Tạo blank mới với thông tin: id, answer (đáp án), start, end (vị trí)
    const newBlank = {
      id: blankId,
      answer: text.trim(), // Đáp án đúng
      start, // Vị trí bắt đầu trong câu
      end, // Vị trí kết thúc trong câu
    };

    // Cập nhật câu hỏi hiện tại
    updateActiveQuestion((q) => {
      // Thêm blank mới và sắp xếp theo vị trí start
      const newBlanks = [...q.blanks, newBlank].sort(
        (a, b) => a.start - b.start
      );

      // Tự động thêm từ vào word bank nếu chưa có
      const newWordBank = q.word_bank.includes(text.trim())
        ? q.word_bank
        : [...q.word_bank, text.trim()];

      return { ...q, blanks: newBlanks, word_bank: newWordBank };
    });

    // Reset selection sau khi tạo blank nhưng giữ nguyên isBlankMode
    // Để user có thể tiếp tục bôi đen và tạo blank mới
    setSelectedText(null);

    // Đảm bảo textarea vẫn focus để có thể tiếp tục bôi đen
    setTimeout(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.focus();
      }
    }, 100);
  };

  // Xóa một blank cụ thể
  // Hàm này được gọi khi user click nút "Xóa" ở bảng quản lý blank
  const handleRemoveBlank = (blankId) => {
    updateActiveQuestion((q) => ({
      ...q,
      blanks: q.blanks.filter((b) => b.id !== blankId), // Lọc bỏ blank có id trùng
    }));
  };

  // Xóa toàn bộ blank của câu hỏi hiện tại
  // Hàm này được gọi khi user click nút "Xóa toàn bộ blank"
  // Cho phép user chỉnh sửa lại câu khi đã tạo blank
  const handleRemoveAllBlanks = () => {
    if (blanks.length === 0) return;

    updateActiveQuestion((q) => ({
      ...q,
      blanks: [], // Xóa toàn bộ blank
    }));
    setSelectedText(null); // Reset selection
    setIsBlankMode(false); // Tắt blank mode
  };

  // Sửa đáp án của blank
  // Hàm này được gọi khi user thay đổi input trong bảng quản lý blank
  const handleEditBlankAnswer = (blankId, newAnswer) => {
    const trimmed = newAnswer.trim();
    updateActiveQuestion((q) => {
      // Cập nhật answer của blank có id trùng
      const newBlanks = q.blanks.map((b) =>
        b.id === blankId ? { ...b, answer: trimmed } : b
      );

      // Nếu từ mới chưa có trong word bank và không phải đáp án của blank khác
      // Thì tự động thêm vào word bank
      const needAdd =
        trimmed &&
        !q.word_bank.includes(trimmed) &&
        !q.blanks.some((b) => b.answer === trimmed);

      const newWordBank = needAdd ? [...q.word_bank, trimmed] : q.word_bank;

      return { ...q, blanks: newBlanks, word_bank: newWordBank };
    });
  };

  // Thêm từ vào word bank (từ nhiễu)
  // Hàm này được gọi khi user nhập từ và click "Thêm" hoặc nhấn Enter
  const handleAddWord = () => {
    const word = newWordInput.trim();
    if (!word) return;

    updateActiveQuestion((q) => {
      // Nếu từ đã có trong word bank thì bỏ qua
      if (q.word_bank.includes(word)) return q;
      return { ...q, word_bank: [...q.word_bank, word] };
    });
    setNewWordInput(""); // Reset input sau khi thêm
  };

  // Xóa từ khỏi word bank
  // Hàm này được gọi khi user click nút "×" trên tag từ
  const handleRemoveWord = (word) => {
    // Không cho xóa nếu từ đó là đáp án của blank
    // Vì đáp án của blank phải có trong word bank để học viên có thể kéo thả
    const isAnswer = (activeQ.blanks || []).some((b) => b.answer === word);
    if (isAnswer) {
      alert("Không thể xóa từ này vì nó là đáp án của một blank.");
      return;
    }

    updateActiveQuestion((q) => ({
      ...q,
      word_bank: q.word_bank.filter((w) => w !== word), // Lọc bỏ từ
    }));
  };

  // Render câu với blanks để preview
  // Hàm này tách câu thành các phần: text → blank → text → blank → ...
  // Ví dụ: "I am happy today" với blank ở "happy" → ["I am ", blank, " today"]
  const renderSentenceWithBlanks = () => {
    if (!sentenceText) return [];

    const parts = [];
    let lastIndex = 0;
    const sortedBlanks = [...blanks].sort((a, b) => a.start - b.start); // Sắp xếp theo vị trí

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

    // Text sau blank cuối cùng
    if (lastIndex < sentenceText.length) {
      parts.push({
        type: "text",
        content: sentenceText.substring(lastIndex),
      });
    }

    // Nếu không có blank, trả về toàn bộ text
    if (parts.length === 0) {
      parts.push({
        type: "text",
        content: sentenceText,
      });
    }

    return parts;
    // Kết quả: [
    //   { type: "text", content: "I am " },
    //   { type: "blank", id: "blank1", answer: "happy" },
    //   { type: "text", content: " today" }
    // ]
  };

  // Chuyển đổi dữ liệu từ format nội bộ sang format database và gửi lên parent
  // Format nội bộ: sentence_text + blanks (có start/end)
  // Format database: sentence_template + blanks (có correct_word_id)
  const updateData = (qs) => {
    isInternalUpdate.current = true; // Đánh dấu đang update nội bộ

    onChange({
      type: "vocabulary_sentence_completion",
      questions: qs.map((q) => {
        // Bước 1: Build sentence_template từ sentence_text + blanks
        // Ví dụ: "I am happy today" + blank ở "happy" → "I am {blank1} today"
        let template = q.sentence_text || "";
        const sortedBlanks = [...q.blanks].sort((a, b) => b.start - a.start); // Sắp xếp ngược để thay thế từ cuối lên đầu

        sortedBlanks.forEach((blank) => {
          const before = template.substring(0, blank.start);
          const after = template.substring(blank.end);
          template = before + `{${blank.id}}` + after;
        });

        // Bước 2: Tạo shuffled_words (tất cả từ: đáp án + word bank)
        const allWords = [
          ...q.blanks.map((b) => b.answer), // Đáp án của các blank
          ...q.word_bank, // Từ nhiễu
        ].filter((word, idx, self) => self.indexOf(word) === idx); // Loại bỏ trùng

        const shuffledWords = allWords.map((word, idx) => ({
          id: idx + 1, // ID bắt đầu từ 1
          text: word,
        }));

        // Bước 3: Tạo blanks với correct_word_id (tham chiếu đến shuffled_words)
        const blanksData = q.blanks.map((blank) => {
          const wordId = shuffledWords.find((w) => w.text === blank.answer)?.id;
          return { id: blank.id, correct_word_id: wordId || 1 };
        });

        return {
          question_id: q.question_id || genId(),
          vi_text: q.vi_text || "",
          sentence_template: template, // "I am {blank1} today"
          shuffled_words: shuffledWords, // [{ id: 1, text: "happy" }, ...]
          blanks: blanksData, // [{ id: "blank1", correct_word_id: 1 }]
        };
      }),
    });
  };

  // Cập nhật câu hỏi đang active
  // Hàm này nhận một updater function để cập nhật câu hỏi
  const updateActiveQuestion = (updater) => {
    setQuestions((prev) => {
      // Tìm index của câu hỏi đang active
      const idx = prev.findIndex((q) => q.question_id === activeQuestionId);
      if (idx === -1) return prev;

      const next = [...prev];
      // Cập nhật câu hỏi tại index đó bằng updater function
      next[idx] = updater(prev[idx]);

      // Tự động save lên parent
      updateData(next);

      return next;
    });
  };

  // Xử lý thay đổi câu tiếng Việt
  const handleViTextChange = (e) => {
    const viText = e.target.value;
    updateActiveQuestion((q) => ({ ...q, vi_text: viText }));
  };

  // Xử lý thay đổi câu hoàn chỉnh (Tiếng Anh)
  // QUAN TRỌNG: Khi đã có blank, không cho phép thay đổi câu vì sẽ làm lệch vị trí blank
  // Nhưng vẫn cho phép bôi đen để tạo blank mới
  const handleSentenceChange = (e) => {
    // Nếu đang có blank, không cho phép thay đổi text
    if (blanks.length > 0) {
      // Giữ nguyên giá trị cũ, không cho thay đổi
      e.target.value = sentenceText;
      return;
    }

    const newText = e.target.value;
    updateActiveQuestion((q) => {
      // Xóa các blank nằm ngoài độ dài câu mới (nếu có)
      const adjustedBlanks = q.blanks.filter((b) => b.end <= newText.length);
      return { ...q, sentence_text: newText, blanks: adjustedBlanks };
    });
  };

  // Xử lý khi user nhấn phím trong textarea
  // Ngăn chặn việc nhập text khi đã có blank (nhưng vẫn cho phép select)
  const handleKeyDown = (e) => {
    // Nếu đang có blank, chỉ cho phép một số phím đặc biệt (như Arrow keys, Delete khi select)
    if (blanks.length > 0) {
      // Cho phép các phím điều hướng và phím đặc biệt
      const allowedKeys = [
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
        "Tab",
      ];

      // Cho phép Ctrl/Cmd + A (select all), Ctrl/Cmd + C (copy)
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "a" || e.key === "c" || e.key === "x") {
          return; // Cho phép
        }
      }

      // Nếu không phải phím được phép, ngăn chặn
      if (!allowedKeys.includes(e.key)) {
        e.preventDefault();
      }
    }
  };

  // Thêm câu hỏi mới
  // Hàm này được gọi khi user click nút "+ Thêm câu"
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
      updateData(next); // Save lên parent
      setActiveQuestionId(newId); // Chuyển sang câu mới
      // Reset các state liên quan khi chuyển sang câu mới
      setSelectedText(null);
      setIsBlankMode(false);
      return next;
    });
  };

  // Mở modal import JSON
  const handleOpenImportJSON = () => {
    setShowImportJSON(true);
    setJsonInput("");
    setJsonError(null);
  };

  // Paste JSON từ clipboard
  const handlePasteJSON = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJsonInput(text);
      setJsonError(null);
    } catch (err) {
      setJsonError("Không thể đọc clipboard: " + err.message);
    }
  };

  // Validate và parse JSON
  const validateJSON = (jsonText) => {
    try {
      const parsed = JSON.parse(jsonText);
      return { success: true, data: parsed, error: null };
    } catch (e) {
      return { success: false, data: null, error: "Lỗi JSON: " + e.message };
    }
  };

  // Thêm câu hỏi từ JSON
  // Hàm này nhận JSON của một câu hỏi hoặc array câu hỏi và thêm vào danh sách
  const handleAddQuestionFromJSON = () => {
    if (!jsonInput.trim()) {
      setJsonError("Vui lòng nhập JSON");
      return;
    }

    const result = validateJSON(jsonInput);
    if (!result.success) {
      setJsonError(result.error);
      return;
    }

    const jsonData = result.data;
    let questionsToAdd = [];

    // Nếu là array, thêm tất cả
    if (Array.isArray(jsonData)) {
      questionsToAdd = jsonData;
    }
    // Nếu là object đơn lẻ, thêm vào array
    else if (typeof jsonData === "object") {
      questionsToAdd = [jsonData];
    } else {
      setJsonError("JSON phải là object hoặc array");
      return;
    }

    // Validate từng câu hỏi
    const validQuestions = [];
    for (const q of questionsToAdd) {
      // Validate format câu hỏi sentence completion
      if (
        q.vi_text &&
        q.sentence_template &&
        Array.isArray(q.shuffled_words) &&
        Array.isArray(q.blanks)
      ) {
        validQuestions.push(q);
      } else {
        setJsonError(
          "Câu hỏi thiếu các trường bắt buộc: vi_text, sentence_template, shuffled_words, blanks"
        );
        return;
      }
    }

    // Thêm các câu hỏi hợp lệ vào danh sách
    setQuestions((prev) => {
      const newQuestions = [...prev];
      questionsToAdd.forEach((q) => {
        // Tạo question_id mới nếu chưa có hoặc bị trùng
        let newQid = q.question_id || genId();
        while (
          newQuestions.some((existing) => existing.question_id === newQid)
        ) {
          newQid = genId();
        }

        // Parse sentence_template để chuyển sang format nội bộ
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

        // Tách word bank
        const answerWords = newBlanks.map((b) => b.answer);
        const allWords = q.shuffled_words?.map((w) => w.text) || [];
        const wordBankWords = allWords.filter((w) => !answerWords.includes(w));

        // Thêm câu hỏi mới vào danh sách
        newQuestions.push({
          vi_text: q.vi_text || "",
          sentence_text: fullText,
          blanks: newBlanks,
          word_bank: wordBankWords,
          question_id: newQid,
        });
      });

      updateData(newQuestions);
      // Chuyển sang câu hỏi mới được thêm cuối cùng
      if (newQuestions.length > 0) {
        setActiveQuestionId(newQuestions[newQuestions.length - 1].question_id);
      }
      setSelectedText(null);
      setIsBlankMode(false);

      return newQuestions;
    });

    // Đóng modal và reset
    setShowImportJSON(false);
    setJsonInput("");
    setJsonError(null);
  };

  // Xóa câu hỏi
  // Hàm này được gọi khi user click nút "Xóa câu này"
  const handleRemoveQuestion = (idx) => {
    setQuestions((prev) => {
      const next = prev.filter((_, i) => i !== idx); // Lọc bỏ câu hỏi tại index
      updateData(next);

      // Nếu xóa hết, tạo một câu hỏi rỗng
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

      // Nếu xóa câu đang active, chuyển sang câu khác
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
          <button
            className="sce-add-question"
            onClick={handleOpenImportJSON}
            style={{
              marginLeft: "8px",
              backgroundColor: "#17a2b8",
              borderColor: "#17a2b8",
            }}
            title="Thêm câu hỏi từ JSON"
          >
            📝 Import JSON
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

      {/* Modal Import JSON */}
      {showImportJSON && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowImportJSON(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "24px",
              width: "90%",
              maxWidth: "600px",
              maxHeight: "80vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h3 style={{ margin: 0 }}>📝 Import JSON - Thêm câu hỏi</h3>
              <button
                onClick={() => setShowImportJSON(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>

            {/*
              🌟 Nút dán nhanh format mẫu cho vocabulary_sentence_completion.
            */}
            {(() => {
              const sampleSentenceJSON = `{
  "vi_text": "Tôi vui mừng khi gặp bạn",
  "sentence_template": "I am {blank1} to {blank2} you",
  "shuffled_words": [
    { "id": 1, "text": "happy" },
    { "id": 2, "text": "meet" },
    { "id": 3, "text": "see" },
    { "id": 4, "text": "sad" }
  ],
  "blanks": [
    { "id": "blank1", "correct_word_id": 1 },
    { "id": "blank2", "correct_word_id": 2 }
  ]
}`;
              return (
                <div style={{ marginBottom: "12px" }}>
                  <button
                    className="sce-btn sce-btn-success"
                    onClick={() => {
                      setJsonInput(sampleSentenceJSON);
                      setJsonError(null);
                    }}
                    style={{ marginRight: "8px" }}
                  >
                    📥 Dán format mẫu
                  </button>
                </div>
              );
            })()}

            <div style={{ marginBottom: "16px" }}>
              <p
                style={{
                  margin: "0 0 8px 0",
                  color: "#666",
                  lineHeight: "1.6",
                }}
              >
                Paste JSON của một câu hỏi hoặc array câu hỏi. Format: mỗi câu
                hỏi cần có <strong>vi_text</strong> (câu tiếng Việt),{" "}
                <strong>sentence_template</strong> (câu tiếng Anh với{" "}
                {"{blank1}"}, {"{blank2}"}, ...),{" "}
                <strong>shuffled_words</strong> (array các từ), và{" "}
                <strong>blanks</strong> (array các blank với correct_word_id
                tham chiếu đến shuffled_words).
              </p>
              <details style={{ marginTop: "12px" }}>
                <summary
                  style={{
                    cursor: "pointer",
                    color: "#007bff",
                    fontWeight: "500",
                    marginBottom: "8px",
                  }}
                >
                  📋 Xem format mẫu
                </summary>
                <pre
                  style={{
                    backgroundColor: "#f5f5f5",
                    padding: "16px",
                    borderRadius: "4px",
                    fontSize: "13px",
                    overflow: "auto",
                    marginTop: "8px",
                    border: "1px solid #ddd",
                  }}
                >
                  {`{
  "vi_text": "Tôi vui mừng khi gặp bạn",
  "sentence_template": "I am {blank1} to {blank2} you",
  "shuffled_words": [
    { "id": 1, "text": "happy" },
    { "id": 2, "text": "meet" },
    { "id": 3, "text": "see" },
    { "id": 4, "text": "sad" }
  ],
  "blanks": [
    { "id": "blank1", "correct_word_id": 1 },
    { "id": "blank2", "correct_word_id": 2 }
  ]
}`}
                </pre>
              </details>
            </div>

            <div style={{ marginBottom: "12px" }}>
              <button
                className="sce-btn sce-btn-primary"
                onClick={handlePasteJSON}
                style={{ marginRight: "8px" }}
              >
                📋 Paste từ Clipboard
              </button>
            </div>

            {jsonError && (
              <div
                style={{
                  backgroundColor: "#f8d7da",
                  color: "#721c24",
                  padding: "12px",
                  borderRadius: "4px",
                  marginBottom: "12px",
                }}
              >
                {jsonError}
              </div>
            )}

            <textarea
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                setJsonError(null);
              }}
              placeholder="Paste JSON ở đây..."
              style={{
                width: "100%",
                minHeight: "250px",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontFamily: "monospace",
                fontSize: "14px",
                marginBottom: "12px",
                resize: "vertical",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              <button
                className="sce-btn"
                onClick={() => {
                  setShowImportJSON(false);
                  setJsonInput("");
                  setJsonError(null);
                }}
              >
                Hủy
              </button>
              <button
                className="sce-btn sce-btn-primary"
                onClick={handleAddQuestionFromJSON}
              >
                ✅ Thêm câu hỏi
              </button>
            </div>
          </div>
        </div>
      )}

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
          onKeyDown={handleKeyDown}
          placeholder="Nhập câu hoàn chỉnh, ví dụ: I am learning English every day"
          rows={4}
          readOnly={blanks.length > 0} // ReadOnly khi đã có blank (vẫn select được nhưng không type được)
        />
        {/* Hiển thị cảnh báo khi đã có blank */}
        {blanks.length > 0 && (
          <div
            className="sce-warning"
            style={{
              marginTop: "8px",
              padding: "12px",
              backgroundColor: "#fff3cd",
              border: "1px solid #ffc107",
              borderRadius: "4px",
              color: "#856404",
            }}
          >
            <strong>⚠️ Lưu ý:</strong> Bạn đã tạo {blanks.length} blank. Để
            chỉnh sửa câu hoàn chỉnh, vui lòng xóa toàn bộ blank trước bằng nút
            "Xóa toàn bộ blank" ở bảng quản lý bên dưới.
          </div>
        )}
        {blanks.length === 0 && (
          <p className="sce-hint">
            💡 Nhập câu hoàn chỉnh trước. Sau đó bật chế độ "Tạo chỗ trống" để
            tạo blanks.
          </p>
        )}
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <label className="sce-label">Quản lý Blanks</label>
            <button
              className="sce-btn sce-btn-danger"
              onClick={handleRemoveAllBlanks}
              style={{ fontSize: "14px" }}
            >
              🗑️ Xóa toàn bộ blank
            </button>
          </div>
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
      {/* Hiển thị preview khi có blanks (không cần chờ word bank) */}
      {sentenceParts && sentenceParts.length > 0 && blanks.length > 0 && (
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
            {/* Hiển thị word bank nếu có */}
            {wordBank.length > 0 && (
              <div className="sce-preview-words">
                {wordBank.map((word, index) => (
                  <span key={index} className="sce-preview-word">
                    {word}
                  </span>
                ))}
              </div>
            )}
            {/* Hiển thị thông báo nếu chưa có word bank */}
            {wordBank.length === 0 && (
              <div
                className="sce-preview-hint"
                style={{ marginTop: "12px", color: "#666", fontSize: "14px" }}
              >
                💡 Bạn chưa thêm từ vào word bank. Hãy thêm các từ nhiễu để học
                viên có thể kéo thả.
              </div>
            )}
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

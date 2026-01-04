import React, { useState } from "react";
import { HiXMark, HiArrowUpTray, HiDocumentText } from "react-icons/hi2";
import { useBatchImportWords } from "../hooks/useWordsAdminMutations";
import "./WordModals.scss";

const SAMPLE_FORMAT = `word,pronunciation,meaning_vi,meaning_en,part_of_speech,example_sentence
hello,/həˈloʊ/,xin chào,a greeting,interjection,Hello! How are you?
book,/bʊk/,sách,a written work,noun,I love reading books.`;

export default function BatchImportModal({ onClose, onSuccess, topics = [], defaultTopicId = null }) {
  const [topicId, setTopicId] = useState(defaultTopicId ? String(defaultTopicId) : "");
  const [inputText, setInputText] = useState("");
  const [parsedWords, setParsedWords] = useState([]);
  const [parseError, setParseError] = useState("");

  const batchImportMutation = useBatchImportWords();

  const parseCSV = (text) => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) {
      setParseError("Need at least header row and one data row");
      setParsedWords([]);
      return;
    }

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const requiredHeaders = ["word", "meaning_vi"];
    const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));
    if (missingHeaders.length > 0) {
      setParseError(`Missing required columns: ${missingHeaders.join(", ")}`);
      setParsedWords([]);
      return;
    }

    const words = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      if (values.length < headers.length) continue;

      const wordObj = {};
      headers.forEach((header, idx) => {
        wordObj[header] = values[idx] || "";
      });

      if (wordObj.word && wordObj.meaning_vi) {
        words.push(wordObj);
      }
    }

    if (words.length === 0) {
      setParseError("No valid words found");
      setParsedWords([]);
      return;
    }

    setParseError("");
    setParsedWords(words);
  };

  const handleTextChange = (e) => {
    const text = e.target.value;
    setInputText(text);
    if (text.trim()) {
      parseCSV(text);
    } else {
      setParsedWords([]);
      setParseError("");
    }
  };

  const handleImport = () => {
    if (parsedWords.length === 0) return;

    batchImportMutation.mutate(
      { words: parsedWords, topic_id: topicId || null },
      {
        onSuccess: (data) => {
          if (data?.EC === "0" || data?.data?.EC === "0") {
            onSuccess?.();
          }
        },
      }
    );
  };

  return (
    <div className="word-modal-overlay" onClick={onClose}>
      <div className="word-modal word-modal--import" onClick={(e) => e.stopPropagation()}>
        <div className="word-modal__header">
          <h2>Batch Import Words</h2>
          <button className="word-modal__close-btn" onClick={onClose}>
            <HiXMark />
          </button>
        </div>

        <div className="word-modal__form">
          {/* Topic Selection */}
          <div className="word-modal__form-group">
            <label>Assign to Topic (optional)</label>
            <select value={topicId} onChange={(e) => setTopicId(e.target.value)}>
              <option value="">No topic</option>
              {topics.map((topic) => (
                <option key={topic.topic_id} value={topic.topic_id}>{topic.topic_name}</option>
              ))}
            </select>
          </div>

          {/* Sample Format */}
          <div className="import-modal__sample">
            <div className="import-modal__sample-header">
              <HiDocumentText /> Sample CSV Format
            </div>
            <pre className="import-modal__sample-code">{SAMPLE_FORMAT}</pre>
          </div>

          {/* Input Area */}
          <div className="word-modal__form-group">
            <label>Paste CSV Data</label>
            <textarea
              className="import-modal__textarea"
              value={inputText}
              onChange={handleTextChange}
              placeholder="Paste your CSV data here..."
              rows={8}
            />
          </div>

          {/* Parse Result */}
          {parseError && <div className="import-modal__error">{parseError}</div>}
          {parsedWords.length > 0 && (
            <div className="import-modal__preview">
              <span className="import-modal__preview-count">{parsedWords.length} words ready to import</span>
              <div className="import-modal__preview-list">
                {parsedWords.slice(0, 5).map((w, i) => (
                  <div key={i} className="import-modal__preview-item">
                    <strong>{w.word}</strong> - {w.meaning_vi}
                  </div>
                ))}
                {parsedWords.length > 5 && <div className="import-modal__preview-more">...and {parsedWords.length - 5} more</div>}
              </div>
            </div>
          )}

          <div className="word-modal__actions">
            <button type="button" className="word-modal__btn word-modal__btn--secondary" onClick={onClose}>Cancel</button>
            <button
              type="button"
              className="word-modal__btn word-modal__btn--primary"
              onClick={handleImport}
              disabled={parsedWords.length === 0 || batchImportMutation.isPending}
            >
              <HiArrowUpTray />
              {batchImportMutation.isPending ? "Importing..." : `Import ${parsedWords.length} Words`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


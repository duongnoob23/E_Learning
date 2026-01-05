import React, { useState } from "react";
import { HiXMark, HiArrowUpTray, HiDocumentText } from "react-icons/hi2";
import { useBatchImportWords } from "../hooks/useWordsAdminMutations";
import "./WordModals.scss";

const SAMPLE_CSV = `word,pronunciation,meaning_vi,meaning_en,part_of_speech,example_sentence
hello,/həˈloʊ/,xin chào,a greeting,interjection,Hello! How are you?
book,/bʊk/,sách,a written work,noun,I love reading books.`;

const SAMPLE_JSON = `[
  {
    "word": "happy",
    "pronunciation": "/ˈhæpi/",
    "meaning_vi": "vui mừng",
    "meaning_en": "feeling or showing pleasure",
    "part_of_speech": "adjective",
    "example_sentence": "I am very happy today",
    "example_translation": "Hôm nay tôi rất vui",
    "image_url": "https://example.com/happy.jpg",
    "audio_url": "https://example.com/happy.mp3"
  },
  {
    "word": "book",
    "pronunciation": "/bʊk/",
    "meaning_vi": "sách",
    "meaning_en": "a written work",
    "part_of_speech": "noun",
    "example_sentence": "I love reading books",
    "example_translation": "Tôi thích đọc sách"
  }
]`;

export default function BatchImportModal({ onClose, onSuccess, topics = [], defaultTopicId = null }) {
  const [topicId, setTopicId] = useState(defaultTopicId ? String(defaultTopicId) : "");
  const [inputText, setInputText] = useState("");
  const [parsedWords, setParsedWords] = useState([]);
  const [parseError, setParseError] = useState("");
  const [importMode, setImportMode] = useState("csv"); // "csv" or "json"

  const batchImportMutation = useBatchImportWords();

  const parseJSON = (text) => {
    try {
      const parsed = JSON.parse(text);
      const wordsArray = Array.isArray(parsed) ? parsed : [parsed];
      
      const words = wordsArray
        .filter((w) => w.word && w.meaning_vi)
        .map((w) => ({
          word: w.word || "",
          pronunciation: w.pronunciation || "",
          meaning_vi: w.meaning_vi || "",
          meaning_en: w.meaning_en || "",
          part_of_speech: w.part_of_speech || "",
          example_sentence: w.example_sentence || w.example || "",
          example_translation: w.example_translation || "",
          image_url: w.image_url || "",
          audio_url: w.audio_url || "",
        }));
      
      if (words.length === 0) {
        setParseError("No valid words found. Each word must have 'word' and 'meaning_vi' fields.");
        setParsedWords([]);
        return;
      }
      
      setParseError("");
      setParsedWords(words);
    } catch (err) {
      setParseError(`Invalid JSON: ${err.message}`);
      setParsedWords([]);
    }
  };

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
      if (importMode === "json") {
        parseJSON(text);
      } else {
        parseCSV(text);
      }
    } else {
      setParsedWords([]);
      setParseError("");
    }
  };
  
  const handlePasteSample = () => {
    if (importMode === "json") {
      setInputText(SAMPLE_JSON);
      parseJSON(SAMPLE_JSON);
    } else {
      setInputText(SAMPLE_CSV);
      parseCSV(SAMPLE_CSV);
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

          {/* Import Mode Toggle */}
          <div className="import-modal__mode-toggle">
            <button
              type="button"
              className={`import-modal__mode-btn ${importMode === "csv" ? "active" : ""}`}
              onClick={() => {
                setImportMode("csv");
                setInputText("");
                setParsedWords([]);
                setParseError("");
              }}
            >
              CSV Format
            </button>
            <button
              type="button"
              className={`import-modal__mode-btn ${importMode === "json" ? "active" : ""}`}
              onClick={() => {
                setImportMode("json");
                setInputText("");
                setParsedWords([]);
                setParseError("");
              }}
            >
              JSON Format
            </button>
          </div>

          {/* Sample Format */}
          <div className="import-modal__sample">
            <div className="import-modal__sample-header">
              <HiDocumentText /> Sample {importMode.toUpperCase()} Format
              <button
                type="button"
                className="import-modal__paste-sample-btn"
                onClick={handlePasteSample}
              >
                📥 Paste Sample
              </button>
            </div>
            <pre className="import-modal__sample-code">
              {importMode === "json" ? SAMPLE_JSON : SAMPLE_CSV}
            </pre>
          </div>

          {/* Input Area */}
          <div className="word-modal__form-group">
            <label>Paste {importMode.toUpperCase()} Data</label>
            <textarea
              className="import-modal__textarea"
              value={inputText}
              onChange={handleTextChange}
              placeholder={`Paste your ${importMode.toUpperCase()} data here...`}
              rows={12}
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


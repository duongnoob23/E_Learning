import React, { useState, useEffect, useRef } from "react";
import { FiX, FiBook } from "react-icons/fi";
import { searchWords, getWordSuggestions } from "../../services/Dictionary/dictionaryService";
import { useDictionaryContext } from "./DictionaryContext";
import "./Dictionary.css";

const Dictionary = () => {
  const dictionary = useDictionaryContext();
  const { isOpen, closeDictionary } = dictionary;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchContainerRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Search function
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    // Clear previous results immediately
    setSearchResults([]);
    try {
      const results = await searchWords(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching words:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Load suggestions khi nhập (debounce)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        console.log("Loading suggestions for:", searchQuery); // Debug
        const suggs = await getWordSuggestions(searchQuery);
        console.log("Suggestions loaded:", suggs.length, suggs); // Debug
        setSuggestions(suggs);
        // Luôn hiển thị suggestions nếu có, ngay cả khi chỉ có 1 từ
        setShowSuggestions(suggs.length > 0);
        setHighlightedIndex(-1);
        console.log("showSuggestions set to:", suggs.length > 0); // Debug
      } catch (error) {
        console.error("Error loading suggestions:", error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Auto search khi nhập (debounce) - chỉ search khi không có suggestions được chọn
  // Tạm thời tắt auto search để ưu tiên hiển thị suggestions
  useEffect(() => {
    // Không auto search khi đang có suggestions
    if (!searchQuery.trim() || showSuggestions || suggestions.length > 0) {
      return;
    }

    // Chỉ search khi không có suggestions và người dùng không đang gõ
    const timer = setTimeout(() => {
      if (!showSuggestions && suggestions.length === 0) {
        handleSearch();
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [searchQuery, showSuggestions, suggestions.length]);

  // Click outside để đóng suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    if (showSuggestions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSuggestions]);

  // Handle keyboard navigation
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (showSuggestions && highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        // Chọn suggestion được highlight
        handleSelectSuggestion(suggestions[highlightedIndex].word);
      } else {
        handleSearch();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (showSuggestions && suggestions.length > 0) {
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (showSuggestions) {
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }
  };

  // Handle select suggestion
  const handleSelectSuggestion = (word) => {
    setSearchQuery(word);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    // Clear previous results before searching
    setSearchResults([]);
    // Trigger search
    setTimeout(() => {
      handleSearch();
    }, 100);
  };

  if (!isOpen) return null;

  return (
    <div className="dictionary-container">
      {/* Header */}
      <div className="dictionary-header">
        <div className="dictionary-header-title">
          <FiBook className="dictionary-header-icon" />
          <span>Từ điển Anh-Việt</span>
        </div>
        <div className="dictionary-header-actions">
          <button
            className="dictionary-action-btn"
            onClick={closeDictionary}
            title="Đóng"
          >
            <FiX />
          </button>
        </div>
      </div>

      {/* Search input */}
      <div className="dictionary-search-container" ref={searchContainerRef}>
        <input
          type="text"
          className="dictionary-search-input"
          placeholder="Nhập từ cần tra"
          value={searchQuery}
          onChange={(e) => {
            const value = e.target.value;
            setSearchQuery(value);
            // Hiển thị suggestions khi có ít nhất 1 ký tự
            if (value.trim().length > 0) {
              setShowSuggestions(true);
            } else {
              setShowSuggestions(false);
            }
          }}
          onKeyDown={handleKeyPress}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
        />
        <button
          className="dictionary-search-btn"
          onClick={handleSearch}
          disabled={isSearching}
        >
          Tra từ →
        </button>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="dictionary-suggestions" ref={suggestionsRef} style={{ display: 'block' }}>
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion.word_id || index}
                className={`dictionary-suggestion-item ${
                  index === highlightedIndex ? "dictionary-suggestion-item--highlighted" : ""
                }`}
                onClick={() => handleSelectSuggestion(suggestion.word)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <div className="dictionary-suggestion-word">{suggestion.word}</div>
                {suggestion.meaning_vi && (
                  <div className="dictionary-suggestion-meaning">
                    {suggestion.meaning_vi.length > 50
                      ? `${suggestion.meaning_vi.substring(0, 50)}...`
                      : suggestion.meaning_vi}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search results - hiển thị khi đã chọn từ hoặc search */}
      <div className="dictionary-results">
        {/* Hiển thị results khi đã có kết quả search, ẩn suggestions */}
        {searchResults.length > 0 && !showSuggestions ? (
          <div className="dictionary-results-list">
            {searchResults.map((word, index) => (
              <div key={index} className="dictionary-result-item">
                <div className="dictionary-result-header">
                  <h3 className="dictionary-word">{word.word}</h3>
                  {word.pronunciation && (
                    <span className="dictionary-pronunciation">{word.pronunciation}</span>
                  )}
                  {word.part_of_speech && (
                    <span className="dictionary-pos">({word.part_of_speech})</span>
                  )}
                </div>

                {word.meaning_vi && (
                  <div className="dictionary-meaning">
                    <strong>Nghĩa:</strong> {word.meaning_vi}
                  </div>
                )}

                {word.example_en && (
                  <div className="dictionary-example">
                    <strong>Ví dụ:</strong> {word.example_en}
                  </div>
                )}

                {word.example_vi && (
                  <div className="dictionary-example-translation">
                    {word.example_vi}
                  </div>
                )}

                {word.audio_url && (
                  <div className="dictionary-audio">
                    <audio 
                      key={`${word.word_id || word.word}-${word.audio_url}`}
                      controls
                      preload="none"
                    >
                      <source src={word.audio_url} type="audio/mpeg" />
                      Trình duyệt không hỗ trợ audio.
                    </audio>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <>
            {isSearching && (
              <div className="dictionary-loading">
                <div className="dictionary-spinner"></div>
                <span>Đang tìm kiếm...</span>
              </div>
            )}

            {!isSearching && searchQuery.trim() && searchResults.length === 0 && !showSuggestions && (
              <div className="dictionary-no-results">
                <p>Không tìm thấy kết quả nào cho "{searchQuery}"</p>
              </div>
            )}

            {!isSearching && !searchQuery.trim() && (
              <div className="dictionary-placeholder">
                <FiBook className="dictionary-placeholder-icon" />
                <p>Nhập từ cần tra vào ô trên</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dictionary;

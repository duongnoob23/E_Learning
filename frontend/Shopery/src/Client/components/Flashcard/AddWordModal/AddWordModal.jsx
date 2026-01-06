// Client/components/Flashcard/AddWordModal/AddWordModal.jsx - Updated based on admin CreateWordModal
import React, { useState, useEffect, useRef } from "react";
import { HiXMark, HiPhoto, HiMusicalNote, HiXCircle, HiSpeakerWave } from "react-icons/hi2";
import { wordApi } from "../../../api/Word/wordApi";
import { useAddWordToSet } from "../../../services/Word/wordMutations";
import "./AddWordModal.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function AddWordModal({ isOpen, onClose, topicId, existingWords = [] }) {
  const [formData, setFormData] = useState({
    word: "",
    pronunciation: "",
    meaning_vi: "",
    part_of_speech: "",
    example_en: "",
    example_vi: "",
    image_url: "",
    audio_url: "",
    notes: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSearching, setIsSearching] = useState(false);
  const [foundWord, setFoundWord] = useState(null);
  const searchTimeoutRef = useRef(null);
  const imageInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const audioPlayerRef = useRef(null);

  const addWordMutation = useAddWordToSet();

  const partOfSpeechOptions = [
    { value: "", label: "Select..." },
    { value: "noun", label: "Noun" },
    { value: "verb", label: "Verb" },
    { value: "adjective", label: "Adjective" },
    { value: "adverb", label: "Adverb" },
    { value: "preposition", label: "Preposition" },
    { value: "conjunction", label: "Conjunction" },
    { value: "pronoun", label: "Pronoun" },
    { value: "interjection", label: "Interjection" },
  ];

  // Tìm từ trong hệ thống khi user nhập
  const searchWord = async (wordName) => {
    if (!wordName || wordName.trim().length < 2) {
      setFoundWord(null);
      return;
    }

    setIsSearching(true);
    try {
      const result = await wordApi.findWordByName(wordName.trim());
      if (result.EC === "0" && result.DT) {
        const word = result.DT;
        setFoundWord(word);
        
        // Auto-fill nếu các trường đang trống
        setFormData((prev) => ({
          ...prev,
          pronunciation: prev.pronunciation || word.pronunciation || "",
          meaning_vi: prev.meaning_vi || word.meaning_vi || "",
          example_en: prev.example_en || word.example_en || "",
          example_vi: prev.example_vi || word.example_vi || "",
          part_of_speech: prev.part_of_speech || word.part_of_speech || "",
          image_url: prev.image_url || word.image_url || "",
          audio_url: prev.audio_url || word.audio_url || "",
        }));
        
        if (word.image_url) {
          setImagePreview(word.image_url.startsWith('http') ? word.image_url : `${API_BASE_URL}${word.image_url}`);
        }
        if (word.audio_url) {
          setAudioPreview(word.audio_url.startsWith('http') ? word.audio_url : `${API_BASE_URL}${word.audio_url}`);
        }
      } else {
        setFoundWord(null);
      }
    } catch (error) {
      console.error("Error searching word:", error);
      setFoundWord(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }

    // Tìm từ khi nhập vào trường word
    if (name === "word") {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      searchTimeoutRef.current = setTimeout(() => {
        searchWord(value);
      }, 500);
    }

    // Update image preview khi paste URL
    if (name === "image_url") {
      if (value && (value.startsWith("http://") || value.startsWith("https://"))) {
        setImagePreview(value);
      } else if (!value) {
        setImagePreview(null);
      }
    }

    // Update audio preview khi paste URL
    if (name === "audio_url") {
      if (value && (value.startsWith("http://") || value.startsWith("https://"))) {
        setAudioPreview(value);
      } else if (!value) {
        setAudioPreview(null);
      }
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image_url: "" }));
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const removeAudio = () => {
    setFormData((prev) => ({ ...prev, audio_url: "" }));
    setAudioPreview(null);
    if (audioInputRef.current) audioInputRef.current.value = "";
  };

  const playAudio = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.play();
    }
  };

  // Reset form khi modal đóng
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        word: "",
        pronunciation: "",
        meaning_vi: "",
        part_of_speech: "",
        example_en: "",
        example_vi: "",
        image_url: "",
        audio_url: "",
        notes: "",
      });
      setImagePreview(null);
      setAudioPreview(null);
      setFoundWord(null);
      setErrors({});
      setIsSearching(false);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.word.trim()) {
      newErrors.word = "Word is required";
    } else {
      const wordLower = formData.word.trim().toLowerCase();
      const isDuplicate = existingWords.some(
        (word) => word.word && word.word.toLowerCase() === wordLower
      );
      if (isDuplicate) {
        newErrors.word = "This word already exists in the list";
      }
    }

    if (!formData.meaning_vi.trim()) {
      newErrors.meaning_vi = "Meaning (Vietnamese) is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    addWordMutation.mutate(
      {
        word: formData.word.trim(),
        meaning_vi: formData.meaning_vi.trim(),
        topic_id: topicId,
        example_en: formData.example_en.trim() || null,
        example_vi: formData.example_vi.trim() || null,
        partOfSpeech: formData.part_of_speech || null,
        pronunciation: formData.pronunciation.trim() || null,
        imageUrl: formData.image_url.trim() || null,
        audioUrl: formData.audio_url.trim() || null,
        notes: formData.notes.trim() || null,
      },
      {
        onSuccess: (data) => {
          if (data?.EC === "0") {
            onClose();
          }
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="add-word-modal-overlay" onClick={onClose}>
      <div className="add-word-modal" onClick={(e) => e.stopPropagation()}>
        <div className="add-word-modal__header">
          <h2>Add New Word</h2>
          <button className="add-word-modal__close-btn" onClick={onClose}>
            <HiXMark />
          </button>
        </div>

        <form className="add-word-modal__form" onSubmit={handleSubmit}>
          <div className="add-word-modal__form-row">
            <div className="add-word-modal__form-group">
              <label>Word *</label>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  name="word"
                  value={formData.word}
                  onChange={handleChange}
                  placeholder="Enter word"
                  className={errors.word ? "add-word-modal__input--error" : ""}
                  required
                />
                {isSearching && (
                  <span
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "12px",
                      color: "#64748b",
                    }}
                  >
                    Searching...
                  </span>
                )}
              </div>
              {foundWord && (
                <div
                  style={{
                    marginTop: "4px",
                    padding: "8px 12px",
                    backgroundColor: "#dbeafe",
                    border: "1px solid #3b82f6",
                    borderRadius: "6px",
                    fontSize: "13px",
                    color: "#1e40af",
                  }}
                >
                  ✓ Found word in system. Auto-filled information.
                </div>
              )}
              {errors.word && (
                <div className="add-word-modal__error">{errors.word}</div>
              )}
            </div>
            <div className="add-word-modal__form-group">
              <label>Pronunciation</label>
              <input
                type="text"
                name="pronunciation"
                value={formData.pronunciation}
                onChange={handleChange}
                placeholder="/prəˌnʌnsiˈeɪʃn/"
              />
            </div>
          </div>

          <div className="add-word-modal__form-row">
            <div className="add-word-modal__form-group">
              <label>Meaning (Vietnamese) *</label>
              <input
                type="text"
                name="meaning_vi"
                value={formData.meaning_vi}
                onChange={handleChange}
                placeholder="Nghĩa tiếng Việt"
                className={errors.meaning_vi ? "add-word-modal__input--error" : ""}
                required
              />
              {errors.meaning_vi && (
                <div className="add-word-modal__error">{errors.meaning_vi}</div>
              )}
            </div>
            <div className="add-word-modal__form-group">
              <label>Part of Speech</label>
              <select
                name="part_of_speech"
                value={formData.part_of_speech}
                onChange={handleChange}
              >
                {partOfSpeechOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="add-word-modal__form-group">
            <label>Example Sentence (English)</label>
            <textarea
              name="example_en"
              value={formData.example_en}
              onChange={handleChange}
              placeholder="Example sentence in English"
              rows={2}
            />
          </div>

          <div className="add-word-modal__form-group">
            <label>Example Translation (Vietnamese)</label>
            <textarea
              name="example_vi"
              value={formData.example_vi}
              onChange={handleChange}
              placeholder="Dịch câu ví dụ"
              rows={2}
            />
          </div>

          {/* Upload Section */}
          <div className="add-word-modal__upload-section">
            {/* Image Upload */}
            <div className="add-word-modal__upload-group">
              <label>Image (Paste URL)</label>
              <div className="add-word-modal__upload-box">
                {imagePreview ? (
                  <div className="add-word-modal__preview add-word-modal__preview--image">
                    <img src={imagePreview} alt="Preview" />
                    <button
                      type="button"
                      className="add-word-modal__preview-remove"
                      onClick={removeImage}
                    >
                      <HiXCircle />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="add-word-modal__upload-placeholder">
                      <HiPhoto className="add-word-modal__upload-icon" />
                      <span>Paste image URL</span>
                    </div>
                    <div className="add-word-modal__url-input-wrapper">
                      <input
                        type="text"
                        className="add-word-modal__url-input"
                        placeholder="Paste image URL here..."
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Audio Upload */}
            <div className="add-word-modal__upload-group">
              <label>Audio (Paste URL)</label>
              <div className="add-word-modal__upload-box">
                {audioPreview ? (
                  <div className="add-word-modal__preview add-word-modal__preview--audio">
                    <audio ref={audioPlayerRef} src={audioPreview} />
                    <button
                      type="button"
                      className="add-word-modal__audio-play"
                      onClick={playAudio}
                    >
                      <HiSpeakerWave />
                      <span>Play Audio</span>
                    </button>
                    <button
                      type="button"
                      className="add-word-modal__preview-remove"
                      onClick={removeAudio}
                    >
                      <HiXCircle />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="add-word-modal__upload-placeholder">
                      <HiMusicalNote className="add-word-modal__upload-icon" />
                      <span>Paste audio URL</span>
                    </div>
                    <div className="add-word-modal__url-input-wrapper">
                      <input
                        type="text"
                        className="add-word-modal__url-input"
                        placeholder="Paste audio URL here..."
                        name="audio_url"
                        value={formData.audio_url}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="add-word-modal__form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes about the word..."
              rows={2}
            />
          </div>

          <div className="add-word-modal__actions">
            <button
              type="button"
              className="add-word-modal__btn add-word-modal__btn--secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="add-word-modal__btn add-word-modal__btn--primary"
              disabled={addWordMutation.isPending}
            >
              {addWordMutation.isPending ? "Adding..." : "Add Word"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

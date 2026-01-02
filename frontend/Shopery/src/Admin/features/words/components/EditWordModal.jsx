import React, { useState, useEffect, useRef } from "react";
import { HiXMark, HiPhoto, HiMusicalNote, HiXCircle, HiSpeakerWave } from "react-icons/hi2";
import { useAdminWordDetail } from "../hooks/useWordsAdminQueries";
import { useUpdateWord } from "../hooks/useWordsAdminMutations";
import { wordsAdminApi } from "../api/wordsAdminApi";
import "./WordModals.scss";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function EditWordModal({ wordId, onClose, onSuccess, topics = [] }) {
  const [formData, setFormData] = useState({
    word: "",
    pronunciation: "",
    meaning_vi: "",
    meaning_en: "",
    part_of_speech: "",
    example_sentence: "",
    example_translation: "",
    audio_url: "",
    image_url: "",
    topic_id: "",
    notes: "",
    is_active: true,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const imageInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const audioPlayerRef = useRef(null);

  const { data: wordData, isLoading } = useAdminWordDetail(wordId);
  const updateWordMutation = useUpdateWord();

  useEffect(() => {
    if (wordData?.DT) {
      const word = wordData.DT;
      setFormData({
        word: word.word || "",
        pronunciation: word.pronunciation || "",
        meaning_vi: word.meaning_vi || "",
        meaning_en: word.meaning_en || "",
        part_of_speech: word.part_of_speech || "",
        example_sentence: word.example_en || word.example_sentence || "",
        example_translation: word.example_vi || word.example_translation || "",
        audio_url: word.audio_url || "",
        image_url: word.image_url || "",
        topic_id: word.topic_id || "",
        notes: word.notes || "",
        is_active: word.is_active ?? true,
      });
      // Set previews if URLs exist
      if (word.image_url) {
        setImagePreview(word.image_url.startsWith("http") ? word.image_url : `${API_BASE_URL}${word.image_url}`);
      }
      if (word.audio_url) {
        setAudioPreview(word.audio_url.startsWith("http") ? word.audio_url : `${API_BASE_URL}${word.audio_url}`);
      }
    }
  }, [wordData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Upload image handler
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh");
      return;
    }

    setUploadingImage(true);
    try {
      const response = await wordsAdminApi.uploadWordImage(file);
      if (response.EC === "0" && response.DT?.image_url) {
        const fullUrl = `${API_BASE_URL}${response.DT.image_url}`;
        setFormData((prev) => ({ ...prev, image_url: response.DT.image_url }));
        setImagePreview(fullUrl);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Lỗi khi upload ảnh");
    } finally {
      setUploadingImage(false);
    }
  };

  // Upload audio handler
  const handleAudioUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      alert("Vui lòng chọn file audio");
      return;
    }

    setUploadingAudio(true);
    try {
      const response = await wordsAdminApi.uploadWordAudio(file);
      if (response.EC === "0" && response.DT?.audio_url) {
        const fullUrl = `${API_BASE_URL}${response.DT.audio_url}`;
        setFormData((prev) => ({ ...prev, audio_url: response.DT.audio_url }));
        setAudioPreview(fullUrl);
      }
    } catch (error) {
      console.error("Error uploading audio:", error);
      alert("Lỗi khi upload audio");
    } finally {
      setUploadingAudio(false);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.word.trim() || !formData.meaning_vi.trim()) {
      return;
    }
    updateWordMutation.mutate(
      { wordId, payload: formData },
      {
        onSuccess: (data) => {
          if (data?.EC === "0" || data?.data?.EC === "0") {
            onSuccess?.();
          }
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="word-modal-overlay">
        <div className="word-modal">
          <div className="word-modal__loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="word-modal-overlay" onClick={onClose}>
      <div className="word-modal" onClick={(e) => e.stopPropagation()}>
        <div className="word-modal__header">
          <h2>Edit Word</h2>
          <button className="word-modal__close-btn" onClick={onClose}>
            <HiXMark />
          </button>
        </div>

        <form className="word-modal__form" onSubmit={handleSubmit}>
          <div className="word-modal__form-row">
            <div className="word-modal__form-group">
              <label>Word *</label>
              <input type="text" name="word" value={formData.word} onChange={handleChange} placeholder="Enter word" required />
            </div>
            <div className="word-modal__form-group">
              <label>Pronunciation</label>
              <input type="text" name="pronunciation" value={formData.pronunciation} onChange={handleChange} placeholder="/prəˌnʌnsiˈeɪʃn/" />
            </div>
          </div>

          <div className="word-modal__form-row">
            <div className="word-modal__form-group">
              <label>Meaning (Vietnamese) *</label>
              <input type="text" name="meaning_vi" value={formData.meaning_vi} onChange={handleChange} placeholder="Nghĩa tiếng Việt" required />
            </div>
            <div className="word-modal__form-group">
              <label>Meaning (English)</label>
              <input type="text" name="meaning_en" value={formData.meaning_en} onChange={handleChange} placeholder="English meaning" />
            </div>
          </div>

          <div className="word-modal__form-row">
            <div className="word-modal__form-group">
              <label>Part of Speech</label>
              <select name="part_of_speech" value={formData.part_of_speech} onChange={handleChange}>
                <option value="">Select...</option>
                <option value="noun">Noun</option>
                <option value="verb">Verb</option>
                <option value="adjective">Adjective</option>
                <option value="adverb">Adverb</option>
                <option value="preposition">Preposition</option>
                <option value="conjunction">Conjunction</option>
                <option value="pronoun">Pronoun</option>
                <option value="interjection">Interjection</option>
              </select>
            </div>
            <div className="word-modal__form-group">
              <label>Topic</label>
              <select name="topic_id" value={formData.topic_id} onChange={handleChange}>
                <option value="">Select topic...</option>
                {topics.map((topic) => (
                  <option key={topic.topic_id} value={topic.topic_id}>{topic.topic_name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="word-modal__form-group">
            <label>Example Sentence</label>
            <textarea name="example_sentence" value={formData.example_sentence} onChange={handleChange} placeholder="Example sentence in English" rows={2} />
          </div>

          <div className="word-modal__form-group">
            <label>Example Translation</label>
            <textarea name="example_translation" value={formData.example_translation} onChange={handleChange} placeholder="Dịch câu ví dụ" rows={2} />
          </div>

          {/* Upload Section */}
          <div className="word-modal__upload-section">
            {/* Image Upload */}
            <div className="word-modal__upload-group">
              <label>Hình ảnh minh họa</label>
              <div className="word-modal__upload-box">
                {imagePreview ? (
                  <div className="word-modal__preview word-modal__preview--image">
                    <img src={imagePreview} alt="Preview" />
                    <button type="button" className="word-modal__preview-remove" onClick={removeImage}>
                      <HiXCircle />
                    </button>
                  </div>
                ) : (
                  <div className="word-modal__upload-placeholder" onClick={() => imageInputRef.current?.click()}>
                    {uploadingImage ? (
                      <span className="word-modal__upload-loading">Đang tải...</span>
                    ) : (
                      <>
                        <HiPhoto className="word-modal__upload-icon" />
                        <span>Nhấn để chọn ảnh</span>
                        <span className="word-modal__upload-hint">JPG, PNG, GIF (Max 5MB)</span>
                      </>
                    )}
                  </div>
                )}
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
              </div>
            </div>

            {/* Audio Upload */}
            <div className="word-modal__upload-group">
              <label>File phát âm</label>
              <div className="word-modal__upload-box">
                {audioPreview ? (
                  <div className="word-modal__preview word-modal__preview--audio">
                    <audio ref={audioPlayerRef} src={audioPreview} />
                    <button type="button" className="word-modal__audio-play" onClick={playAudio}>
                      <HiSpeakerWave />
                      <span>Phát âm thanh</span>
                    </button>
                    <button type="button" className="word-modal__preview-remove" onClick={removeAudio}>
                      <HiXCircle />
                    </button>
                  </div>
                ) : (
                  <div className="word-modal__upload-placeholder" onClick={() => audioInputRef.current?.click()}>
                    {uploadingAudio ? (
                      <span className="word-modal__upload-loading">Đang tải...</span>
                    ) : (
                      <>
                        <HiMusicalNote className="word-modal__upload-icon" />
                        <span>Nhấn để chọn audio</span>
                        <span className="word-modal__upload-hint">MP3, WAV, OGG (Max 10MB)</span>
                      </>
                    )}
                  </div>
                )}
                <input
                  ref={audioInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioUpload}
                  style={{ display: "none" }}
                />
              </div>
            </div>
          </div>

          <div className="word-modal__form-group">
            <label>Ghi chú</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Ghi chú thêm về từ..." rows={2} />
          </div>

          <div className="word-modal__form-group word-modal__form-group--checkbox">
            <label>
              <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} />
              Kích hoạt từ vựng
            </label>
          </div>

          <div className="word-modal__actions">
            <button type="button" className="word-modal__btn word-modal__btn--secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="word-modal__btn word-modal__btn--primary" disabled={updateWordMutation.isPending}>
              {updateWordMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


// Client/components/Flashcard/FlashcardDetail/FlashcardDetail.jsx (cập nhật)
import React, { useState } from "react";
import {
  useAddWordToSet,
  useMarkLearned,
} from "../../../services/Word/wordMutations";
import { useWordsBySet } from "../../../services/Word/wordQueries";
import AddWordModal from "../AddWordModal/AddWordModal";
import WordListDisplay from "../WordListDisplay/WordListDisplay";
import "./FlashcardDetail.css";

const FlashcardDetail = ({
  topic,
  onBack,
  onPractice,
  onStudy,
  topicType = "system",
}) => {
  const [showAddWordModal, setShowAddWordModal] = useState(false);

  // Fetch words từ API
  const { data: wordsData, isLoading: isLoadingWords } = useWordsBySet(
    topic?.id,
    !!topic?.id
  );

  // Mutations
  const markLearnedMutation = useMarkLearned();
  const addWordMutation = useAddWordToSet();

  // Transform words từ API
  const words =
    wordsData?.EC === "0" && wordsData?.DT && Array.isArray(wordsData.DT)
      ? wordsData.DT
      : [];

  // Load voices cho Web Speech API
  React.useEffect(() => {
    // Load voices khi component mount
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
      };
      
      // Một số browser cần event để load voices
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
      loadVoices();
    }
  }, []);

  // Hàm phát âm từ bằng Web Speech API
  const speakWord = (word, lang = 'en-US') => {
    if ('speechSynthesis' in window) {
      // Dừng bất kỳ phát âm nào đang chạy
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = lang;
      utterance.rate = 0.9; // Tốc độ phát âm (0.1 - 10)
      utterance.pitch = 1; // Cao độ (0 - 2)
      utterance.volume = 1; // Âm lượng (0 - 1)
      
      // Chọn giọng nói (ưu tiên giọng Anh)
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(voice => 
        voice.lang.startsWith('en') && (voice.name.includes('Female') || voice.name.includes('female'))
      ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
      
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAddWord = async (wordData) => {
    try {
      await addWordMutation.mutateAsync({
        ...wordData,
        topic_id: topic.id,
        meaning_vi: wordData.definition,
        example_en: wordData.exampleEn,
        example_vi: wordData.exampleVi,
        partOfSpeech: wordData.type,
        imageUrl: wordData.image ? URL.createObjectURL(wordData.image) : null,
      });
      
      // Tự động phát âm từ vừa thêm
      if (wordData.word && wordData.word.trim()) {
        // Đợi một chút để đảm bảo modal đã đóng
        setTimeout(() => {
          speakWord(wordData.word.trim(), 'en-US');
        }, 300);
      }
      
      setShowAddWordModal(false);
    } catch (error) {
      console.error("Error adding word:", error);
    }
  };

  const handleMarkLearned = async (word) => {
    try {
      await markLearnedMutation.mutateAsync({
        word_id: word.word_id || word.user_word_id,
        topic_id: topic.id,
      });
    } catch (error) {
      console.error("Error marking learned:", error);
    }
  };

  return (
    <div className="flashcard-detail">
      {/* Header */}
      <div className="detail-header">
        <button className="back-btn" onClick={onBack}>
          ← Quay lại
        </button>
        <h1 className="detail-title">{topic.title}</h1>
        {topicType === "user_created" && (
          <button
            className="add-word-btn"
            onClick={() => setShowAddWordModal(true)}
          >
            Thêm từ
          </button>
        )}
      </div>

      {/* Word Count */}
      <div className="word-count-info">
        {isLoadingWords ? "Đang tải..." : `List có ${words.length} từ`}
      </div>

      {/* Loading State */}
      {isLoadingWords && (
        <div className="loading-state">
          <p>Đang tải từ vựng...</p>
        </div>
      )}

      {/* Word List Display */}
      {!isLoadingWords && (
        <WordListDisplay words={words} topicType={topicType} topicId={topic?.id} />
      )}

      {/* Empty State */}
      {!isLoadingWords && words.length === 0 && (
        <div className="empty-state">
          <p>Không có từ vựng nào trong set này.</p>
          {topicType === "user_created" && (
            <button
              className="add-word-btn-empty"
              onClick={() => setShowAddWordModal(true)}
            >
              Thêm từ đầu tiên
            </button>
          )}
        </div>
      )}

      {/* Add Word Modal */}
      <AddWordModal
        isOpen={showAddWordModal}
        onClose={() => setShowAddWordModal(false)}
        onSubmit={handleAddWord}
        topicId={topic?.id}
        existingWords={words}
      />
    </div>
  );
};

export default FlashcardDetail;

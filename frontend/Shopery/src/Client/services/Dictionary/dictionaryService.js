/**
 * Dictionary Service
 * Service để search từ vựng từ database qua API
 */
import { wordApi } from "../../api/Word/wordApi";

/**
 * Search từ vựng Anh-Việt từ database
 * @param {string} query - Từ khóa tìm kiếm
 * @returns {Promise<Array>} Mảng kết quả tìm kiếm
 */
export const searchWords = async (query) => {
  if (!query || !query.trim()) {
    return [];
  }

  try {
    const searchQuery = query.trim();
    
    // Gọi API để tìm từ vựng
    const response = await wordApi.findWordByName(searchQuery);
    
    // Xử lý response từ API
    if (response?.EC === "0" && response?.DT) {
      const words = Array.isArray(response.DT) ? response.DT : [response.DT];
      
      // Map dữ liệu từ API sang format component
      const results = words.map((word) => ({
        word_id: word.word_id,
        word: word.word,
        pronunciation: word.pronunciation,
        meaning_vi: word.meaning_vi,
        part_of_speech: word.part_of_speech,
        example_en: word.example_en,
        example_vi: word.example_vi,
        image_url: word.image_url,
        audio_url: word.audio_url,
      }));

      // Sắp xếp: kết quả khớp chính xác lên đầu
      results.sort((a, b) => {
        const aWord = (a.word || "").toLowerCase();
        const bWord = (b.word || "").toLowerCase();
        const searchLower = searchQuery.toLowerCase();
        const aExact = aWord === searchLower;
        const bExact = bWord === searchLower;
        
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        if (aWord.startsWith(searchLower) && !bWord.startsWith(searchLower)) return -1;
        if (!aWord.startsWith(searchLower) && bWord.startsWith(searchLower)) return 1;
        return aWord.localeCompare(bWord);
      });

      return results.slice(0, 20); // Giới hạn 20 kết quả
    }
    
    return [];
  } catch (error) {
    console.error("Error searching words:", error);
    return [];
  }
};

/**
 * Get word suggestions (autocomplete) - các từ bắt đầu bằng query
 * @param {string} query - Từ khóa tìm kiếm
 * @returns {Promise<Array>} Mảng các từ gợi ý
 */
export const getWordSuggestions = async (query) => {
  if (!query || !query.trim()) {
    return [];
  }

  try {
    const searchQuery = query.trim();
    const searchLower = searchQuery.toLowerCase();
    
    // Sử dụng getWordsByTopic với q parameter để tìm các từ chứa query
    // Không truyền topicId để lấy từ tất cả topics
    const response = await wordApi.getWordsByTopic({
      q: searchQuery,
      limit: 50, // Lấy nhiều hơn để filter
    });
    
    // Xử lý response từ API
    console.log("API Response for suggestions:", response); // Debug
    if (response?.EC === "0" && response?.DT?.words) {
      const words = Array.isArray(response.DT.words) ? response.DT.words : [];
      console.log("Words from API:", words.length, words.slice(0, 5)); // Debug
      
      // Lọc các từ bắt đầu bằng query (không tính chính từ đó)
      const suggestions = words
        .filter((word) => {
          const wordLower = (word.word || "").toLowerCase();
          // Chỉ lấy các từ bắt đầu bằng query và không phải chính từ đó
          const matches = wordLower.startsWith(searchLower) && wordLower !== searchLower;
          if (matches) {
            console.log("Matched word:", word.word); // Debug
          }
          return matches;
        })
        .map((word) => ({
          word_id: word.word_id,
          word: word.word,
          pronunciation: word.pronunciation,
          part_of_speech: word.part_of_speech,
          meaning_vi: word.meaning_vi,
        }))
        .sort((a, b) => {
          const aWord = (a.word || "").toLowerCase();
          const bWord = (b.word || "").toLowerCase();
          // Ưu tiên các từ ngắn hơn và gần với query hơn
          if (aWord.length !== bWord.length) {
            return aWord.length - bWord.length;
          }
          return aWord.localeCompare(bWord);
        })
        .slice(0, 10); // Giới hạn 10 gợi ý

      console.log("Final suggestions:", suggestions); // Debug
      return suggestions;
    }
    
    console.log("No suggestions - response format:", response); // Debug
    
    return [];
  } catch (error) {
    console.error("Error getting word suggestions:", error);
    return [];
  }
};

/**
 * Get word by exact match từ database
 * @param {string} word - Từ cần tìm
 * @returns {Promise<Object|null>} Từ vựng tìm được hoặc null
 */
export const getWordByExactMatch = async (word) => {
  if (!word || !word.trim()) {
    return null;
  }

  try {
    const response = await wordApi.findWordByName(word.trim());
    
    if (response?.EC === "0" && response?.DT) {
      const words = Array.isArray(response.DT) ? response.DT : [response.DT];
      const wordLower = word.trim().toLowerCase();
      
      // Tìm từ khớp chính xác
      const exactMatch = words.find(
        (w) => (w.word || "").toLowerCase() === wordLower
      );
      
      if (exactMatch) {
        return {
          word_id: exactMatch.word_id,
          word: exactMatch.word,
          pronunciation: exactMatch.pronunciation,
          meaning_vi: exactMatch.meaning_vi,
          part_of_speech: exactMatch.part_of_speech,
          example_en: exactMatch.example_en,
          example_vi: exactMatch.example_vi,
          image_url: exactMatch.image_url,
          audio_url: exactMatch.audio_url,
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error getting word by exact match:", error);
    return null;
  }
};

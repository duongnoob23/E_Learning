const { Op } = require("sequelize");
const Word = require("../../models").Word;
const sequelize = require("../../config/database");

/**
 * Dictionary Service - Nâng cấp
 * Tra từ điển từ database với đầy đủ tính năng
 */

/**
 * Parse multiple meanings từ meaning_vi
 * Format: "1. nghĩa 1; 2. nghĩa 2; 3. nghĩa 3" hoặc "nghĩa 1, nghĩa 2, nghĩa 3"
 */
const parseMeanings = (meaningText) => {
  if (!meaningText) return [];

  // Thử parse theo format số: "1. nghĩa; 2. nghĩa"
  const numberedPattern = /(\d+)\.\s*([^;]+)/g;
  const numberedMatches = [...meaningText.matchAll(numberedPattern)];
  
  if (numberedMatches.length > 0) {
    return numberedMatches.map((match) => match[2].trim());
  }

  // Thử parse theo dấu phẩy hoặc chấm phẩy
  const separators = /[;，,]/;
  if (separators.test(meaningText)) {
    return meaningText.split(separators).map((m) => m.trim()).filter((m) => m);
  }

  // Trả về nghĩa duy nhất
  return [meaningText.trim()];
};

/**
 * Tra từ Anh-Việt (English to Vietnamese) - Nâng cấp
 * Trả về danh sách các từ liên quan (search-as-you-type)
 */
exports.searchEnVi = async (word) => {
  try {
    if (!word || word.trim() === "") {
      return {
        EM: "Vui lòng nhập từ cần tra",
        EC: "1",
        DT: {
          words: [],
        },
      };
    }

    const searchWord = word.trim().toLowerCase();

    // Tìm tất cả các từ bắt đầu bằng searchWord (limit 20)
    const wordEntries = await Word.findAll({
      where: {
        word: {
          [Op.like]: `${searchWord}%`,
        },
        is_active: 1,
      },
      limit: 20,
      order: [
        // Ưu tiên từ chính xác trước (sử dụng raw SQL)
        [sequelize.literal(`CASE WHEN LOWER(word) = LOWER('${searchWord.replace(/'/g, "''")}') THEN 0 ELSE 1 END`), "ASC"],
        ["word", "ASC"],
      ],
    });

    if (!wordEntries || wordEntries.length === 0) {
      return {
        EM: "Không tìm thấy từ trong từ điển",
        EC: "2",
        DT: {
          words: [],
        },
      };
    }

    // Format danh sách các từ
    const wordsList = wordEntries.map((wordEntry) => {
      const meaningsList = parseMeanings(wordEntry.meaning_vi);
      const firstMeaning = meaningsList[0] || wordEntry.meaning_vi;

      return {
        word: wordEntry.word,
        phonetic: wordEntry.pronunciation || "",
        partOfSpeech: wordEntry.part_of_speech || "",
        meaning: firstMeaning,
        fullMeaning: wordEntry.meaning_vi, // Giữ nguyên để hiển thị chi tiết
        audio: wordEntry.audio_url || null,
        image: wordEntry.image_url || null,
        definitionEn: wordEntry.definition_en || null,
        exampleEn: wordEntry.example_en || null,
        exampleVi: wordEntry.example_vi || null,
        allMeanings: meaningsList, // Tất cả các nghĩa
      };
    });

    return {
      EM: "Tra từ thành công",
      EC: "0",
      DT: {
        words: wordsList,
        count: wordsList.length,
      },
    };
  } catch (error) {
    console.error("Dictionary Database Error:", error.message);
    return {
      EM: "Có lỗi xảy ra khi tra từ",
      EC: "-1",
      DT: {
        words: [],
      },
    };
  }
};

/**
 * Tra từ Việt-Anh (Vietnamese to English) - Nâng cấp
 * Tìm trong meaning_vi với kết quả nhiều từ và suggestions
 */
exports.searchViEn = async (word) => {
  try {
    if (!word || word.trim() === "") {
      return {
        EM: "Vui lòng nhập từ cần tra",
        EC: "1",
        DT: null,
      };
    }

    const searchWord = word.trim();

    // Tìm trong meaning_vi (nghĩa tiếng Việt) để tìm từ tiếng Anh tương ứng
    const wordEntries = await Word.searchInMeaning(searchWord);

    if (!wordEntries || wordEntries.length === 0) {
      return {
        EM: "Không tìm thấy từ trong từ điển",
        EC: "2",
        DT: null,
      };
    }

    // Lấy từ đầu tiên làm kết quả chính
    const wordEntry = wordEntries[0];
    const meaningsList = parseMeanings(wordEntry.meaning_vi);

    // Format data với đầy đủ thông tin
    const formattedData = {
      word: wordEntry.word,
      phonetic: wordEntry.pronunciation || "",
      meanings: [
        {
          partOfSpeech: wordEntry.part_of_speech || "",
          definitions: meaningsList.map((meaning) => ({
            definition: meaning,
            example: wordEntry.example_en || "",
            exampleVi: wordEntry.example_vi || "",
          })),
        },
      ],
      audio: wordEntry.audio_url || null,
      image: wordEntry.image_url || null,
      definitionEn: wordEntry.definition_en || null,
    };

    // Nếu có nhiều kết quả, trả về suggestions
    if (wordEntries.length > 1) {
      formattedData.suggestions = wordEntries.slice(1, 6).map((w) => ({
        word: w.word,
        meaning: w.meaning_vi.substring(0, 100) + "...",
      }));
    }

    return {
      EM: "Tra từ thành công",
      EC: "0",
      DT: formattedData,
    };
  } catch (error) {
    console.error("Dictionary Vi-En Error:", error.message);
    return {
      EM: "Có lỗi xảy ra khi tra từ",
      EC: "-1",
      DT: null,
    };
  }
};

/**
 * Tìm từ liên quan (Related words)
 * Tìm các từ cùng part_of_speech hoặc cùng topic
 */
exports.findRelatedWords = async (word) => {
  try {
    const wordEntry = await Word.findExactWord(word.toLowerCase());
    if (!wordEntry) {
      return {
        EM: "Không tìm thấy từ",
        EC: "2",
        DT: null,
      };
    }

    // Tìm từ cùng part_of_speech
    const relatedWords = await Word.findAll({
      where: {
        part_of_speech: wordEntry.part_of_speech,
        word_id: {
          [Op.ne]: wordEntry.word_id,
        },
        is_active: 1,
      },
      limit: 5,
      order: [["word", "ASC"]],
    });

    return {
      EM: "Tìm từ liên quan thành công",
      EC: "0",
      DT: {
        related: relatedWords.map((w) => ({
          word: w.word,
          meaning: w.meaning_vi.substring(0, 80) + "...",
        })),
      },
    };
  } catch (error) {
    console.error("Related Words Error:", error.message);
    return {
      EM: "Có lỗi xảy ra",
      EC: "-1",
      DT: null,
    };
  }
};

/**
 * Lấy chi tiết 1 từ (khi click vào từ trong list)
 */
exports.getWordDetail = async (word) => {
  try {
    if (!word || word.trim() === "") {
      return {
        EM: "Vui lòng nhập từ cần tra",
        EC: "1",
        DT: null,
      };
    }

    const searchWord = word.trim().toLowerCase();

    // Tìm từ chính xác
    const wordEntry = await Word.findExactWord(searchWord);

    if (!wordEntry) {
      return {
        EM: "Không tìm thấy từ trong từ điển",
        EC: "2",
        DT: null,
      };
    }

    // Parse multiple meanings
    const meaningsList = parseMeanings(wordEntry.meaning_vi);

    // Format data chi tiết đầy đủ
    const formattedData = {
      word: wordEntry.word,
      phonetic: wordEntry.pronunciation || "",
      meanings: [
        {
          partOfSpeech: wordEntry.part_of_speech || "",
          definitions: meaningsList.map((meaning) => ({
            definition: meaning,
            example: wordEntry.example_en || "",
            exampleVi: wordEntry.example_vi || "",
          })),
        },
      ],
      audio: wordEntry.audio_url || null,
      image: wordEntry.image_url || null,
      definitionEn: wordEntry.definition_en || null,
      source: wordEntry.raw_source_url || null,
      allMeanings: meaningsList,
    };

    return {
      EM: "Tra từ thành công",
      EC: "0",
      DT: formattedData,
    };
  } catch (error) {
    console.error("Get Word Detail Error:", error.message);
    return {
      EM: "Có lỗi xảy ra khi tra từ",
      EC: "-1",
      DT: null,
    };
  }
};

/**
 * Main search function - route đến đúng service dựa trên type
 */
exports.searchDictionary = async (word, type = "en-vi", exact = false) => {
  // Nếu exact = true, trả về chi tiết 1 từ
  if (exact) {
    return await exports.getWordDetail(word);
  }

  switch (type) {
    case "en-vi":
      return await exports.searchEnVi(word);
    case "vi-en":
      return await exports.searchViEn(word);
    default:
      return {
        EM: "Loại tra từ không hợp lệ. Chỉ hỗ trợ 'en-vi' hoặc 'vi-en'",
        EC: "1",
        DT: null,
      };
  }
};


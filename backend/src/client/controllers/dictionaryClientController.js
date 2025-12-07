const dictionaryClientService = require("../services/dictionaryClientService");

/**
 * Dictionary Controller
 * Xử lý các request tra từ điển
 */

// [GET] /dictionary/search - Tra từ điển
exports.searchDictionary = async (req, res, next) => {
  try {
    const { word, type = "en-vi", exact = false } = req.query;

    if (!word || word.trim() === "") {
      return res.json({
        EM: "Vui lòng nhập từ cần tra",
        EC: "1",
        DT: null,
      });
    }

    const isExact = exact === "true" || exact === true;

    const result = await dictionaryClientService.searchDictionary(
      word.trim(),
      type,
      isExact
    );

    return res.json(result);
  } catch (error) {
    console.error("Dictionary Controller Error:", error);
    next(error);
  }
};


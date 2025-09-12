const Topic = require("../../models").Topic;
const UserWord = require("../../models").UserWord;
const Word = require("../../models").Word;
const { Op } = require("sequelize");

// Lấy danh sách từ vựng theo topic + tìm kiếm
exports.getWordsByTopic = async (filters) => {
  try {
    const { topicId, page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;

    const whereConditions = {};
    if (topicId) {
      whereConditions.topic_id = topicId;
    }

    const { count, rows } = await Word.findAndCountAll({
      where: whereConditions,
      limit: limit,
      offset: offset,
    }); 

    return {
      EM: "Truy vấn thành công",
      EC: "0",
      DT: {
        words: rows,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(count / limit),
          total_items: count,
          items_per_page: limit,
        },
      },
    };
  } catch (error) {
    console.error("Lỗi trong getWordsByTopic service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình truy vấn",
      EC: "-2",
      DT: null,
    };
  }
};

// Lấy danh sách từ vựng cá nhân theo topic + tìm kiếm
exports.getWordsbyUser = async (filters) => {
  try {
    const { userId, topicId, page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;

    const whereConditions = {};
    if (userId) {
      whereConditions.user_id = userId;
    }
    if (topicId) {
      whereConditions.topic_id = topicId;
    }

    const { count, rows } = await UserWord.findAndCountByFilters({
      where: whereConditions,
      limit: limit,
      offset: offset,
    });

    return {
      EM: "Truy vấn thành công",
      EC: "0",
      DT: {
        words: rows,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(count / limit),
          total_items: count,
          items_per_page: limit,
        },
      },
    };
  } catch (error) {
    console.error("Lỗi trong getWordsbyUser service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình truy vấn",
      EC: "-2",
      DT: null,
    };
  }
};

// Tao du tu vung moi ca nhan
exports.postWordToUser = async (data) => {
  try {
    const result = await UserWord.createWord(data);
    return {
      EM: "Thêm từ thành công",
      EC: "0",
      DT: result,
    };
  } catch (error) {
    console.error("Lỗi trong postWordToUser service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình thêm từ",
      EC: "-2",
      DT: null,
    };
  }
};

// Sửa từ vựng cá nhân
exports.patchWordToUser = async (data) => {
  try {
    const result = await UserWord.updateWord(data.user_word_id, data);
    return {
      EM: "Cập nhật từ thành công",
      EC: "0",
      DT: result,
    };
  } catch (error) {
    console.error("Lỗi trong patchWordToUser service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình cập nhật từ",
      EC: "-2",
      DT: null,
    };
  }
};

// Xóa từ vựng cá nhân
exports.deleteWordToUser = async (userWordId) => {
  try {
    const result = await UserWord.updateWord(userWordId, { is_active: false });
    return {
      EM: "Xóa từ thành công",
      EC: "0",
      DT: result,
    };
  } catch (error) {
    console.error("Lỗi trong deleteWordToUser service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình xóa từ",
      EC: "-2",
      DT: null,
    };
  }
};

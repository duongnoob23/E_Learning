const Topic = require("../../models").Topic;

const Word = require("../../models").Word;
// Lấy danh sách chủ đề
exports.getTopic = async () => {
  try {
    const topics = await Topic.getAll();

    return {
      EM: "Truy vấn thành công",
      EC: "0", // success
      DT: topics
    };
  } catch (error) {
    console.error("Lỗi trong getTopic service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình truy vấn",
      EC: "-2", // lỗi hệ thống
      DT: null
    };
  }
};

// Lấy danh sách từ vựng theo chủ đề
exports.getWordByTopic = async (topic_id) => {
  try {
    const words = await Word.findByTopic(topic_id);

    if (!words || words.length === 0) {
      return {
        EM: "Không tìm thấy từ vựng cho chủ đề này",
        EC: "2", // lỗi nghiệp vụ
        DT: []
      };
    }

    return {
      EM: "Truy vấn thành công",
      EC: "0", // success
      DT: words
    };
  } catch (error) {
    console.error("Lỗi trong getWordByTopic service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình truy vấn",
      EC: "-2", // lỗi hệ thống
      DT: null
    };
  }
};

// Lấy danh sách từ vựng
exports.getWord = async () => {
  try {
    const words = await Word.getAll();

    if (!words || words.length === 0) {
      return {
        EM: "Không tìm thấy từ vựng",
        EC: "2", // lỗi nghiệp vụ
        DT: []
      };
    }

    return {
      EM: "Truy vấn thành công",
      EC: "0", // success
      DT: words
    };
  } catch (error) {
    console.error("Lỗi trong getWord service:", error);
    return {
      EM: "Có lỗi xảy ra trong quá trình truy vấn",
      EC: "-2", // lỗi hệ thống
      DT: null
    };
  }
};
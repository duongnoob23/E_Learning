const Topic = require("../../models").Topic;

const Word = require("../../models").Word;
// Lấy danh sách chủ đề
exports.getTopic = async () => {
    const topics = await Topic.getAll();
    return {code: "success", message: "Truy vấn thành công", data:topics};
};

// Lấy danh sách từ vựng theo chủ đề
exports.getWordByTopic = async (topic_id) => {
    const words = await Word.findByTopic(topic_id);
    return {code: "success", message: "Truy vấn thành công", data:words};
};

// Lấy danh sách từ vựng
exports.getWord = async () => {
    const words = await Word.getAll();
    return {code: "success", message: "Truy vấn thành công", data: words};
};
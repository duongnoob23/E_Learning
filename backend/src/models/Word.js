const { Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Word = sequelize.define(
    "Word",
    {
      word_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      topic_id: { 
        type: DataTypes.BIGINT.UNSIGNED, 
        allowNull: false 
      },
      word: { 
        type: DataTypes.STRING(255), 
        allowNull: false 
      },
      part_of_speech: { 
        type: DataTypes.STRING(50), 
        allowNull: true 
      },
      pronunciation: { 
        type: DataTypes.STRING(255), 
        allowNull: true 
      },
      meaning_vi: { 
        type: DataTypes.TEXT, 
        allowNull: false 
      },
      definition_en: { 
        type: DataTypes.TEXT, 
        allowNull: true 
      },
      example_en: { 
        type: DataTypes.TEXT, 
        allowNull: true 
      },
      example_vi: { 
        type: DataTypes.TEXT, 
        allowNull: true 
      },
      image_url: { 
        type: DataTypes.STRING(255), 
        allowNull: true 
      },
      audio_url: { 
        type: DataTypes.STRING(500), 
        allowNull: true 
      },
      raw_source_url: { 
        type: DataTypes.STRING(500), 
        allowNull: true 
      },
      word_type: {
        type: DataTypes.ENUM("system", "user_created"),
        allowNull: false,
        defaultValue: "system",
      },
      is_active: {
        type: DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 1,
      },
      created_at: { 
        type: DataTypes.DATE, 
        allowNull: true,
        defaultValue: DataTypes.NOW 
      },
      updated_at: { 
        type: DataTypes.DATE, 
        allowNull: true,
        defaultValue: DataTypes.NOW 
      },
    },
    { 
      tableName: "words", 
      timestamps: true,
      underscored: true,
    }
  );

  // Hàm tiện ích
  Word.findById = async (word_id) => Word.findOne({ where: { word_id } });
  Word.findByTopic = async (topic_id) => Word.findAll({ where: { topic_id } });
  Word.createWord = async (data) => Word.create(data);
  Word.updateWord = async (word_id, data) => Word.update(data, { where: { word_id } });
  Word.deleteWord = async (word_id) => Word.destroy({ where: { word_id } });
  Word.getAll = async () => Word.findAll();
  Word.countWords = async () => Word.count();
  Word.findByWord = async (word) => Word.findOne({ where: { word } });
  
  // Tìm kiếm từ (case-insensitive, partial match)
  Word.searchWord = async (searchTerm) => {
    return Word.findAll({
      where: {
        word: {
          [Op.like]: `%${searchTerm}%`,
        },
        is_active: 1,
      },
      limit: 20,
      order: [["word", "ASC"]],
    });
  };

  // Tìm từ chính xác (case-insensitive)
  Word.findExactWord = async (word) => {
    return Word.findOne({
      where: {
        word: {
          [Op.like]: word,
        },
        is_active: 1,
      },
    });
  };

  // Tìm trong nghĩa tiếng Việt
  Word.searchInMeaning = async (searchTerm) => {
    return Word.findAll({
      where: {
        meaning_vi: {
          [Op.like]: `%${searchTerm}%`,
        },
        is_active: 1,
      },
      limit: 10,
      order: [["word", "ASC"]],
    });
  };

  return Word;
};

// module.exports = (sequelize, DataTypes) => {
//   const Word = sequelize.define("Word", {
//     word_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//     topic_id: { type: DataTypes.INTEGER },
//     word: { type: DataTypes.STRING },
//     part_of_speech: { type: DataTypes.STRING(50) },
//     pronunciation: { type: DataTypes.STRING },
//     meaning_vi: { type: DataTypes.TEXT },
//     example_en: { type: DataTypes.TEXT },
//     example_vi: { type: DataTypes.TEXT },
//     image_url: { type: DataTypes.STRING }
//   }, {
//     tableName: "words",
//     timestamps: false
//   });

//   // Hàm tiện ích
//   Word.findById = async (word_id) => Word.findOne({where : { word_id }});
//   Word.findByTopic = async (topic_id) => Word.findAll({where : { topic_id }});
//   Word.createWord = async (data) => Word.create(data);
//   Word.updateWord = async (word_id, data) => Word.update(data, {where : { word_id }});
//   Word.deleteWord = async (word_id) => Word.destroy({where : { word_id }});
//   Word.getAll = async () => Word.findAll();
//   Word.countWords = async () => Word.count();
//   Word.findByWord = async (word) => Word.findOne({where : { word }});
//   Word.searchWord = async (word) => Word.findAll({where : { word: { [Op.like]: `%${word}%` } }});

//   return Word;
// };

module.exports = (sequelize, DataTypes) => {
  const Word = sequelize.define("Word", {
    word_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    topic_id: { type: DataTypes.INTEGER },
    word: { type: DataTypes.STRING },
    part_of_speech: { type: DataTypes.STRING(50) },
    pronunciation: { type: DataTypes.STRING },
    meaning_vi: { type: DataTypes.TEXT },
    example_en: { type: DataTypes.TEXT },
    example_vi: { type: DataTypes.TEXT },
    image_url: { type: DataTypes.STRING }
  }, {
    tableName: "words",
    timestamps: false
  });

  // Hàm tiện ích
  Word.findById = async (word_id) => Word.findOne({where : { word_id }});
  Word.findByTopic = async (topic_id) => Word.findAll({where : { topic_id }});
  Word.createWord = async (data) => Word.create(data);
  Word.updateWord = async (word_id, data) => Word.update(data, {where : { word_id }});
  Word.deleteWord = async (word_id) => Word.destroy({where : { word_id }});
  Word.getAll = async () => Word.findAll();
  Word.countWords = async () => Word.count();
  Word.findByWord = async (word) => Word.findOne({where : { word }});
  Word.searchWord = async (word) => Word.findAll({where : { word: { [Op.like]: `%${word}%` } }});

  return Word;
};
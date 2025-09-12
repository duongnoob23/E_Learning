module.exports = (sequelize, DataTypes) => {
  const Word = sequelize.define("Word", {
    word_id: { 
      type: DataTypes.BIGINT.UNSIGNED, 
      primaryKey: true,
      autoIncrement: true
    },
    topic_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    word: { type: DataTypes.STRING(255), allowNull: false },
    part_of_speech: { type: DataTypes.STRING(50) },
    pronunciation: { type: DataTypes.STRING(255) },
    meaning_vi: { type: DataTypes.TEXT },
    example_en: { type: DataTypes.TEXT },
    example_vi: { type: DataTypes.TEXT },
    image_url: { type: DataTypes.STRING(255) },
    notes: { type: DataTypes.TEXT },
    word_type: {
      type: DataTypes.ENUM('system', 'user_created'),
      defaultValue: 'system'
    },
    created_by: { type: DataTypes.BIGINT.UNSIGNED },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    tableName: "words",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
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

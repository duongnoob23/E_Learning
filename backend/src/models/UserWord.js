module.exports = (sequelize, DataTypes) => {
  const UserWord = sequelize.define("UserWord", {
    user_word_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    topic_id: { type: DataTypes.INTEGER },
    word: { type: DataTypes.STRING },
    part_of_speech: { type: DataTypes.STRING(50) },
    pronunciation: { type: DataTypes.STRING },
    meaning_vi: { type: DataTypes.TEXT },
    example_en: { type: DataTypes.TEXT },
    example_vi: { type: DataTypes.TEXT },
    image_url: { type: DataTypes.STRING },
    from_system_word_id: { type: DataTypes.INTEGER }
  }, {
    tableName: "user_words",
    timestamps: false
  });
  return UserWord;
};
module.exports = (sequelize, DataTypes) => {
  const UserWord = sequelize.define("UserWord", {
    user_word_id: { 
      type: DataTypes.BIGINT.UNSIGNED, 
      primaryKey: true,
      autoIncrement: true
    },
    user_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    topic_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    word: { type: DataTypes.STRING(255), allowNull: false },
    part_of_speech: { type: DataTypes.STRING(50) },
    pronunciation: { type: DataTypes.STRING(255) },
    meaning_vi: { type: DataTypes.TEXT },
    example_en: { type: DataTypes.TEXT },
    example_vi: { type: DataTypes.TEXT },
    image_url: { type: DataTypes.STRING(255) },
    notes: { type: DataTypes.TEXT },
    from_system_word_id: { type: DataTypes.BIGINT.UNSIGNED },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    tableName: "user_words",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return UserWord;
};

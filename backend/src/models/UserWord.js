module.exports = (sequelize, DataTypes) => {
  const UserWord = sequelize.define(
    "UserWord",
    {
      user_word_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: { type: DataTypes.BIGINT, allowNull: false },
      topic_id: { type: DataTypes.BIGINT, allowNull: false },
      word: { type: DataTypes.STRING(255), allowNull: false },
      part_of_speech: { type: DataTypes.STRING(50), allowNull: true },
      pronunciation: { type: DataTypes.STRING(255), allowNull: true },
      meaning_vi: { type: DataTypes.TEXT, allowNull: false },
      example_en: { type: DataTypes.TEXT, allowNull: true },
      example_vi: { type: DataTypes.TEXT, allowNull: true },
      image_url: { type: DataTypes.STRING(255), allowNull: true },
      notes: { type: DataTypes.TEXT, allowNull: true },
      from_system_word_id: { type: DataTypes.BIGINT, allowNull: true },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: { type: DataTypes.DATE },
      updated_at: { type: DataTypes.DATE },
    },
    { tableName: "user_words", timestamps: false }
  );

  // Các hàm helper riêng, KHÔNG override hàm Sequelize gốc
  UserWord.findByUser = async (user_id) =>
    UserWord.findAll({ where: { user_id } });

  UserWord.createWord = async (data) => UserWord.create(data);

  // ✅ Đổi tên, không dùng findAndCountAll
  UserWord.findAndCountByFilters = async (filters) => {
    return UserWord.findAndCountAll(filters);
  };

  UserWord.updateWord = async (user_word_id, data) =>
    UserWord.update(data, { where: { user_word_id } });

  UserWord.deleteWord = async (user_word_id) =>
    UserWord.destroy({ where: { user_word_id } });

  return UserWord;
};

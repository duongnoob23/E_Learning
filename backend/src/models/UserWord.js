module.exports = (sequelize, DataTypes) => {
<<<<<<< HEAD
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
=======
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
  return UserWord;
};

// module.exports = (sequelize, DataTypes) => {
//   const UserWord = sequelize.define("UserWord", {
//     user_word_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//     topic_id: { type: DataTypes.INTEGER },
//     word: { type: DataTypes.STRING },
//     part_of_speech: { type: DataTypes.STRING(50) },
//     pronunciation: { type: DataTypes.STRING },
//     meaning_vi: { type: DataTypes.TEXT },
//     example_en: { type: DataTypes.TEXT },
//     example_vi: { type: DataTypes.TEXT },
//     image_url: { type: DataTypes.STRING },
//     from_system_word_id: { type: DataTypes.INTEGER }
//   }, {
//     tableName: "user_words",
//     timestamps: false
//   });
//   return UserWord;
// };
>>>>>>> main

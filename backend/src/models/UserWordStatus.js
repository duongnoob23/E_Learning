module.exports = (sequelize, DataTypes) => {
  const UserWordStatus = sequelize.define(
    "UserWordStatus",
    {
      status_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: { type: DataTypes.BIGINT, allowNull: false },
      topic_id: { type: DataTypes.BIGINT, allowNull: false },
      word_id: { type: DataTypes.BIGINT, allowNull: true },
      user_word_id: { type: DataTypes.BIGINT, allowNull: true },
      is_learned: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      marked_at: { type: DataTypes.DATE, allowNull: true },
      created_at: { type: DataTypes.DATE },
      updated_at: { type: DataTypes.DATE },
    },
    { tableName: "user_word_status", timestamps: false }
  );
  return UserWordStatus;
};

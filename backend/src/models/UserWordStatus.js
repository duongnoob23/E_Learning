module.exports = (sequelize, DataTypes) => {
  const UserWordStatus = sequelize.define("UserWordStatus", {
    status_id: { 
      type: DataTypes.BIGINT.UNSIGNED, 
      primaryKey: true,
      autoIncrement: true
    },
    user_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    topic_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    word_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    user_word_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    is_learned: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    marked_at: { type: DataTypes.DATE, allowNull: true }
  }, {
    tableName: "user_word_status",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return UserWordStatus;
};
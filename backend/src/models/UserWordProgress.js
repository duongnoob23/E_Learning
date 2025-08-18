module.exports = (sequelize, DataTypes) => {
  const UserWordProgress = sequelize.define("UserWordProgress", {
    user_id: { type: DataTypes.INTEGER, primaryKey: true },
    word_id: { type: DataTypes.INTEGER, primaryKey: true },
    user_word_id: { type: DataTypes.INTEGER, primaryKey: true },
    is_learned: { type: DataTypes.BOOLEAN, defaultValue: false },
    learned_at: { type: DataTypes.DATE }
  }, {
    tableName: "user_word_progress",
    timestamps: false
  });
  return UserWordProgress;
};
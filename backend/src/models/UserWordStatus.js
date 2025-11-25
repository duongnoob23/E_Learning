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
      review_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      intervall: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      ease_factor: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 2.5,
      },
      last_reviewed: { type: DataTypes.DATE, allowNull: true },
      next_review: { type: DataTypes.DATE, allowNull: true },
      created_at: { type: DataTypes.DATE },
      updated_at: { type: DataTypes.DATE },
    },
    { tableName: "user_word_status", timestamps: false }
  );

  UserWordStatus.deleteWord = async (user_word_id) => UserWordStatus.destroy({ where: { user_word_id } });  

  UserWordStatus.markLearned = async (userId, word_id, topic_id) => UserWordStatus.update(
    { is_learned: true, marked_at: new Date() },
    { where: { user_id: userId, word_id: word_id, topic_id: topic_id } }
  );
  UserWordStatus.unmarkLearned = async (userId, word_id, topic_id) => UserWordStatus.update(
    { is_learned: false, marked_at: null },
    { where: { user_id: userId, word_id: word_id, topic_id: topic_id } }
  );
  return UserWordStatus;
};

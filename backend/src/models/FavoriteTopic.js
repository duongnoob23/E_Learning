module.exports = (sequelize, DataTypes) => {
  const FavoriteTopic = sequelize.define("FavoriteTopic", {
    user_id: { type: DataTypes.INTEGER, primaryKey: true },
    topic_id: { type: DataTypes.INTEGER, primaryKey: true },
    added_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: "favorite_topics",
    timestamps: true,
    createdAt: 'added_at',
    updatedAt: false
  });
  return FavoriteTopic;
};
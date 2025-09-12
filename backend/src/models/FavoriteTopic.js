module.exports = (sequelize, DataTypes) => {
<<<<<<< HEAD
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
=======
  const FavoriteTopic = sequelize.define(
    "FavoriteTopic",
    {
      favorite_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: { type: DataTypes.BIGINT, allowNull: false },
      topic_id: { type: DataTypes.BIGINT, allowNull: false },
      added_at: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "favorite_topics", timestamps: false }
  );
>>>>>>> main
  return FavoriteTopic;
};

// module.exports = (sequelize, DataTypes) => {
//   const FavoriteTopic = sequelize.define("FavoriteTopic", {
//     user_id: { type: DataTypes.INTEGER, primaryKey: true },
//     topic_id: { type: DataTypes.INTEGER, primaryKey: true },
//     added_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
//   }, {
//     tableName: "favorite_topics",
//     timestamps: false
//   });
//   return FavoriteTopic;
// };

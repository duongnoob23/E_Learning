module.exports = (sequelize, DataTypes) => {
  const Exercise = sequelize.define("Exercise", {
    exercise_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    topic_id: { type: DataTypes.INTEGER },
    exercise_type_id: { type: DataTypes.INTEGER },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: "exercises",
    timestamps: false
  });
  return Exercise;
};
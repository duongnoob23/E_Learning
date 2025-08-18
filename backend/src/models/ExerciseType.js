module.exports = (sequelize, DataTypes) => {
  const ExerciseType = sequelize.define("ExerciseType", {
    exercise_type_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT }
  }, {
    tableName: "exercise_types",
    timestamps: false
  });
  return ExerciseType;
};
module.exports = (sequelize, DataTypes) => {
  const ExerciseResult = sequelize.define("ExerciseResult", {
    result_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER },
    question_id: { type: DataTypes.INTEGER },
    user_answer: { type: DataTypes.TEXT },
    is_correct: { type: DataTypes.BOOLEAN },
    answered_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: "exercise_results",
    timestamps: false
  });
  return ExerciseResult;
};
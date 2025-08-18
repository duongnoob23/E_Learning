module.exports = (sequelize, DataTypes) => {
  const ExerciseQuestion = sequelize.define("ExerciseQuestion", {
    question_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    exercise_id: { type: DataTypes.INTEGER },
    question_text: { type: DataTypes.TEXT },
    correct_answer: { type: DataTypes.TEXT },
    options: { type: DataTypes.JSON },
    related_word_id: { type: DataTypes.INTEGER }
  }, {
    tableName: "exercise_questions",
    timestamps: false
  });
  return ExerciseQuestion;
};
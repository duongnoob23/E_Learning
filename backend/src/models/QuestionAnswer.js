module.exports = (sequelize, DataTypes) => {
  const QuestionAnswer = sequelize.define('QuestionAnswer', {
    answer_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    question_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'questions',
        key: 'question_id'
      }
    },
    correct_answer: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    explanation: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'question_answers',
    timestamps: false,
    indexes: [
      {
        fields: ['question_id']
      }
    ]
  });

  // Utility methods
  QuestionAnswer.findByQuestion = async (questionId) => {
    return QuestionAnswer.findOne({
      where: { question_id: questionId }
    });
  };

  QuestionAnswer.findByQuestions = async (questionIds) => {
    return QuestionAnswer.findAll({
      where: { question_id: questionIds }
    });
  };

  QuestionAnswer.createAnswer = async (data) => {
    return QuestionAnswer.create(data);
  };

  QuestionAnswer.updateAnswer = async (answerId, data) => {
    return QuestionAnswer.update(data, { where: { answer_id: answerId } });
  };

  QuestionAnswer.deleteAnswer = async (answerId) => {
    return QuestionAnswer.destroy({ where: { answer_id: answerId } });
  };

  return QuestionAnswer;
};

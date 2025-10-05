module.exports = (sequelize, DataTypes) => {
  const QuestionChoice = sequelize.define('QuestionChoice', {
    choice_id: {
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
    choice_text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    is_correct: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    tableName: 'question_choices',
    timestamps: false,
    indexes: [
      {
        fields: ['question_id']
      },
      {
        fields: ['question_id', 'is_correct']
      }
    ]
  });

  // Utility methods
  QuestionChoice.findByQuestion = async (questionId) => {
    return QuestionChoice.findAll({
      where: { question_id: questionId }
    });
  };

  QuestionChoice.findByQuestions = async (questionIds) => {
    return QuestionChoice.findAll({
      where: { question_id: questionIds },
      order: [['question_id', 'ASC']]
    });
  };

  QuestionChoice.findCorrectByQuestion = async (questionId) => {
    return QuestionChoice.findOne({
      where: { 
        question_id: questionId,
        is_correct: true 
      }
    });
  };

  QuestionChoice.createChoice = async (data) => {
    return QuestionChoice.create(data);
  };

  QuestionChoice.updateChoice = async (choiceId, data) => {
    return QuestionChoice.update(data, { where: { choice_id: choiceId } });
  };

  QuestionChoice.deleteChoice = async (choiceId) => {
    return QuestionChoice.destroy({ where: { choice_id: choiceId } });
  };

  return QuestionChoice;
};

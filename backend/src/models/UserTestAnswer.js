module.exports = (sequelize, DataTypes) => {
  const UserTestAnswer = sequelize.define('UserTestAnswer', {
    answer_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    user_test_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user_tests',
        key: 'user_test_id'
      }
    },
    question_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'questions',
        key: 'question_id'
      }
    },
    answer_text: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    choice_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'question_choices',
        key: 'choice_id'
      }
    },
    is_correct: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    is_draft: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    answered_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'user_test_answers',
    timestamps: false,
    indexes: [
      {
        fields: ['user_test_id']
      },
      {
        fields: ['question_id']
      },
      {
        fields: ['user_test_id', 'question_id'],
        unique: true
      },
      {
        fields: ['is_draft']
      }
    ]
  });

  // Utility methods
  UserTestAnswer.findByUserTest = async (userTestId) => {
    return UserTestAnswer.findAll({
      where: { user_test_id: userTestId },
      order: [['answered_at', 'ASC']]
    });
  };

  UserTestAnswer.findByUserTestAndQuestion = async (userTestId, questionId) => {
    return UserTestAnswer.findOne({
      where: { 
        user_test_id: userTestId,
        question_id: questionId 
      }
    });
  };

  UserTestAnswer.findDraftsByUserTest = async (userTestId) => {
    return UserTestAnswer.findAll({
      where: { 
        user_test_id: userTestId,
        is_draft: true 
      }
    });
  };

  UserTestAnswer.findFinalAnswersByUserTest = async (userTestId) => {
    return UserTestAnswer.findAll({
      where: { 
        user_test_id: userTestId,
        is_draft: false 
      }
    });
  };

  UserTestAnswer.createAnswer = async (data) => {
    return UserTestAnswer.create(data);
  };

  UserTestAnswer.updateAnswer = async (answerId, data) => {
    return UserTestAnswer.update(data, { where: { answer_id: answerId } });
  };

  UserTestAnswer.deleteAnswer = async (answerId) => {
    return UserTestAnswer.destroy({ where: { answer_id: answerId } });
  };

  UserTestAnswer.markAsFinal = async (answerId) => {
    return UserTestAnswer.update(
      { is_draft: false },
      { where: { answer_id: answerId } }
    );
  };

  UserTestAnswer.markAllAsFinal = async (userTestId) => {
    return UserTestAnswer.update(
      { is_draft: false },
      { where: { user_test_id: userTestId } }
    );
  };

  return UserTestAnswer;
};

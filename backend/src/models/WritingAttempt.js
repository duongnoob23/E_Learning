module.exports = (sequelize, DataTypes) => {
  const WritingAttempt = sequelize.define('WritingAttempt', {
    writing_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    answer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user_test_answers',
        key: 'answer_id'
      }
    },
    essay_text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    ai_score: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: true,
      comment: 'Điểm AI (VD: 7.5)'
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Phản hồi từ AI'
    },
    word_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Số từ trong bài viết'
    },
    grammar_score: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: true,
      comment: 'Điểm ngữ pháp'
    },
    vocabulary_score: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: true,
      comment: 'Điểm từ vựng'
    },
    coherence_score: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: true,
      comment: 'Điểm tính mạch lạc'
    },
    task_achievement_score: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: true,
      comment: 'Điểm hoàn thành nhiệm vụ'
    }
  }, {
    tableName: 'writing_attempts',
    timestamps: false,
    indexes: [
      {
        fields: ['answer_id']
      },
      {
        fields: ['ai_score']
      }
    ]
  });

  // Utility methods
  WritingAttempt.findByAnswer = async (answerId) => {
    return WritingAttempt.findOne({
      where: { answer_id: answerId }
    });
  };

  WritingAttempt.findByUserTest = async (userTestId) => {
    return WritingAttempt.findAll({
      include: [{
        model: sequelize.models.UserTestAnswer,
        where: { user_test_id: userTestId },
        attributes: []
      }]
    });
  };

  WritingAttempt.createAttempt = async (data) => {
    return WritingAttempt.create(data);
  };

  WritingAttempt.updateAttempt = async (writingId, data) => {
    return WritingAttempt.update(data, { where: { writing_id: writingId } });
  };

  WritingAttempt.deleteAttempt = async (writingId) => {
    return WritingAttempt.destroy({ where: { writing_id: writingId } });
  };

  return WritingAttempt;
};

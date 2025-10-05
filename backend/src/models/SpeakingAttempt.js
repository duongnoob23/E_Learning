module.exports = (sequelize, DataTypes) => {
  const SpeakingAttempt = sequelize.define('SpeakingAttempt', {
    speaking_id: {
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
    audio_url: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: 'Đường dẫn đến file âm thanh'
    },
    transcript: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Bản chép lời nói từ AI'
    },
    ai_score: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: true,
      comment: 'Điểm AI (VD: 7.0)'
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Phản hồi từ AI'
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Thời lượng audio (giây)'
    },
    fluency_score: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: true,
      comment: 'Điểm độ trôi chảy'
    },
    pronunciation_score: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: true,
      comment: 'Điểm phát âm'
    },
    vocabulary_score: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: true,
      comment: 'Điểm từ vựng'
    },
    grammar_score: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: true,
      comment: 'Điểm ngữ pháp'
    }
  }, {
    tableName: 'speaking_attempts',
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
  SpeakingAttempt.findByAnswer = async (answerId) => {
    return SpeakingAttempt.findOne({
      where: { answer_id: answerId }
    });
  };

  SpeakingAttempt.findByUserTest = async (userTestId) => {
    return SpeakingAttempt.findAll({
      include: [{
        model: sequelize.models.UserTestAnswer,
        where: { user_test_id: userTestId },
        attributes: []
      }]
    });
  };

  SpeakingAttempt.createAttempt = async (data) => {
    return SpeakingAttempt.create(data);
  };

  SpeakingAttempt.updateAttempt = async (speakingId, data) => {
    return SpeakingAttempt.update(data, { where: { speaking_id: speakingId } });
  };

  SpeakingAttempt.deleteAttempt = async (speakingId) => {
    return SpeakingAttempt.destroy({ where: { speaking_id: speakingId } });
  };

  return SpeakingAttempt;
};

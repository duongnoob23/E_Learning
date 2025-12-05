module.exports = (sequelize, DataTypes) => {
  const PronunciationAssessment = sequelize.define(
    "PronunciationAssessment",
    {
      assessment_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: { model: "User", key: "user_id" },
      },
      word_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: { model: "Word", key: "word_id" },
      },
      user_word_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: { model: "UserWord", key: "user_word_id" },
      },
      score: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: { min: 0, max: 100 },
        comment: "Điểm phát âm (0-100)",
      },
      pronunciation_score: {
        type: DataTypes.FLOAT,
        allowNull: true,
        comment: "Điểm phát âm chi tiết",
      },
      fluency_score: {
        type: DataTypes.FLOAT,
        allowNull: true,
        comment: "Điểm độ trôi chảy",
      },
      feedback: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "Chi tiết feedback từ MultiPA",
      },
      audio_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "URL file audio đã ghi",
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "pronunciation_assessment",
      timestamps: false,
    }
  );

  return PronunciationAssessment;
};


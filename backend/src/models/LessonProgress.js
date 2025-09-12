module.exports = (sequelize, DataTypes) => {
  const LessonProgress = sequelize.define(
    "LessonProgress",
    {
      lesson_progress_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: { type: DataTypes.BIGINT, allowNull: false },
      lesson_id: { type: DataTypes.BIGINT, allowNull: false },
      course_id: { type: DataTypes.BIGINT, allowNull: false },
      status: {
        type: DataTypes.ENUM("not_started", "in_progress", "completed"),
        allowNull: false,
        defaultValue: "not_started",
      },
      watched_duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      total_duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      completion_percent: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
      },
      started_at: { type: DataTypes.DATE, allowNull: true },
      completed_at: { type: DataTypes.DATE, allowNull: true },
      last_accessed_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      created_at: { type: DataTypes.DATE },
      updated_at: { type: DataTypes.DATE },
    },
    { tableName: "lesson_progress", timestamps: false }
  );
  return LessonProgress;
};

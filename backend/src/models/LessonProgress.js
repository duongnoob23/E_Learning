module.exports = (sequelize, DataTypes) => {
  const LessonProgress = sequelize.define("LessonProgress", {
    lesson_progress_id: { 
      type: DataTypes.BIGINT.UNSIGNED, 
      primaryKey: true,
      autoIncrement: true
    },
    user_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    lesson_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    course_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    status: { 
      type: DataTypes.ENUM('not_started', 'in_progress', 'completed'), 
      defaultValue: 'not_started' 
    },
    watched_duration: { type: DataTypes.INTEGER, defaultValue: 0 },
    total_duration: { type: DataTypes.INTEGER, defaultValue: 0 },
    completion_percent: { type: DataTypes.DECIMAL(5,2), defaultValue: 0 },
    started_at: { type: DataTypes.DATE, allowNull: true },
    completed_at: { type: DataTypes.DATE, allowNull: true },
    last_accessed_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: "lesson_progress",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return LessonProgress;
};

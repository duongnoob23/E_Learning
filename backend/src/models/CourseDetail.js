module.exports = (sequelize, DataTypes) => {
  const CourseDetail = sequelize.define("CourseDetail", {
    course_detail_id: { 
      type: DataTypes.BIGINT.UNSIGNED, 
      primaryKey: true,
      autoIncrement: true
    },
    course_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    about_content: { type: DataTypes.TEXT, allowNull: true },
    learning_outcomes: { type: DataTypes.JSON, allowNull: true },
    skills_covered: { type: DataTypes.JSON, allowNull: true },
    requirements: { type: DataTypes.JSON, allowNull: true },
    achievements: { type: DataTypes.JSON, allowNull: true },
    certificate_info: { type: DataTypes.TEXT, allowNull: true },
    last_updated: { type: DataTypes.DATEONLY, allowNull: true },
    language: { type: DataTypes.STRING(50), defaultValue: 'Vietnamese' },
    target_audience: { type: DataTypes.TEXT, allowNull: true }
  }, {
    tableName: "course_details",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return CourseDetail;
};

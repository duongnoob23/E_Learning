module.exports = (sequelize, DataTypes) => {
  const CourseTag = sequelize.define(
    "CourseTag",
    {
      tag_id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(50), allowNull: false },
      color: { type: DataTypes.STRING(7), allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "course_tags", timestamps: false }
  );
  return CourseTag;
};

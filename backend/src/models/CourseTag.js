module.exports = (sequelize, DataTypes) => {
  const CourseTag = sequelize.define("CourseTag", {
    tag_id: { 
      type: DataTypes.BIGINT.UNSIGNED, 
      primaryKey: true,
      autoIncrement: true
    },
    name: { type: DataTypes.STRING(50), allowNull: false },
    color: { type: DataTypes.STRING(7), allowNull: true }
  }, {
    tableName: "course_tags",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });
  return CourseTag;
};

module.exports = (sequelize, DataTypes) => {
  const CourseDiscussion = sequelize.define("CourseDiscussion", {
    discussion_id: { 
      type: DataTypes.BIGINT.UNSIGNED, 
      primaryKey: true,
      autoIncrement: true
    },
    course_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    user_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    parent_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    title: { type: DataTypes.STRING(200), allowNull: true },
    content: { type: DataTypes.TEXT, allowNull: false },
    likes_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    replies_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    status: { 
      type: DataTypes.ENUM('active', 'hidden', 'deleted'), 
      defaultValue: 'active' 
    }
  }, {
    tableName: "course_discussions",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return CourseDiscussion;
};

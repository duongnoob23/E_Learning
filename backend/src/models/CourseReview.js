module.exports = (sequelize, DataTypes) => {
  const CourseReview = sequelize.define("CourseReview", {
    review_id: { 
      type: DataTypes.BIGINT.UNSIGNED, 
      primaryKey: true,
      autoIncrement: true
    },
    user_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    course_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    rating: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING(200), allowNull: true },
    content: { type: DataTypes.TEXT, allowNull: true },
    is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    status: { 
      type: DataTypes.ENUM('pending', 'approved', 'rejected'), 
      defaultValue: 'pending' 
    }
  }, {
    tableName: "course_reviews",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return CourseReview;
};

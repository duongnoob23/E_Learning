module.exports = (sequelize, DataTypes) => {
  const CourseWishlist = sequelize.define("CourseWishlist", {
    wishlist_id: { 
      type: DataTypes.BIGINT.UNSIGNED, 
      primaryKey: true,
      autoIncrement: true
    },
    user_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    course_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false }
  }, {
    tableName: "course_wishlist",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });
  return CourseWishlist;
};

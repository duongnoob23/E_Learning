module.exports = (sequelize, DataTypes) => {
  const CourseCoupon = sequelize.define("CourseCoupon", {
    course_coupon_id: { 
      type: DataTypes.BIGINT.UNSIGNED, 
      primaryKey: true,
      autoIncrement: true
    },
    course_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    coupon_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false }
  }, {
    tableName: "course_coupons",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });
  return CourseCoupon;
};

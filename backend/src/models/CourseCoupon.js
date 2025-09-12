module.exports = (sequelize, DataTypes) => {
  const CourseCoupon = sequelize.define(
    "CourseCoupon",
    {
      course_coupon_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      course_id: { type: DataTypes.BIGINT, allowNull: false },
      coupon_id: { type: DataTypes.BIGINT, allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "course_coupons", timestamps: false }
  );
  return CourseCoupon;
};

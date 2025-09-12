module.exports = (sequelize, DataTypes) => {
<<<<<<< HEAD
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
=======
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
>>>>>>> main
  return CourseCoupon;
};

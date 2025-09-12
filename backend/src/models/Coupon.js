module.exports = (sequelize, DataTypes) => {
  const Coupon = sequelize.define("Coupon", {
    coupon_id: { 
      type: DataTypes.BIGINT.UNSIGNED, 
      primaryKey: true,
      autoIncrement: true
    },
    code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    discount_type: { 
      type: DataTypes.ENUM('percentage', 'fixed_amount'), 
      allowNull: false 
    },
    discount_value: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    minimum_amount: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
    max_uses: { type: DataTypes.INTEGER, allowNull: true },
    used_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    max_uses_per_user: { type: DataTypes.INTEGER, defaultValue: 1 },
    valid_from: { type: DataTypes.DATE, allowNull: false },
    valid_until: { type: DataTypes.DATE, allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    applicable_courses: { type: DataTypes.JSON, allowNull: true },
    applicable_categories: { type: DataTypes.JSON, allowNull: true }
  }, {
    tableName: "coupons",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Coupon;
};

module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define(
    "OrderItem",
    {
      item_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      order_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      course_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      course_title: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      course_image: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      course_slug: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      instructor_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      original_price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      sale_price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      final_price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "order_items",
      timestamps: false,
    }
  );

  // Static methods
  OrderItem.findByOrderId = async (order_id) => {
    return OrderItem.findAll({ where: { order_id } });
  };

  return OrderItem;
};


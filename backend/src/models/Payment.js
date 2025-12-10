module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define(
    "Payment",
    {
      payment_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      order_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      payment_method: {
        type: DataTypes.ENUM("vnpay", "momo", "zalopay", "bank_transfer", "cod", "free"),
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: "VND",
      },
      transaction_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      transaction_ref: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      bank_code: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      bank_trans_no: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      card_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      payment_status: {
        type: DataTypes.ENUM("pending", "processing", "completed", "failed", "cancelled", "refunded"),
        allowNull: false,
        defaultValue: "pending",
      },
      response_code: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      response_message: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      payment_data: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      refund_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
      },
      refund_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      refunded_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      paid_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "payments",
      timestamps: false,
    }
  );

  // Static methods
  Payment.findByOrderId = async (order_id) => {
    return Payment.findAll({ where: { order_id } });
  };

  Payment.findByTransactionId = async (transaction_id) => {
    return Payment.findOne({ where: { transaction_id } });
  };

  Payment.findByTransactionRef = async (transaction_ref) => {
    return Payment.findOne({ where: { transaction_ref } });
  };

  return Payment;
};


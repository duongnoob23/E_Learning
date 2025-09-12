module.exports = (sequelize, DataTypes) => {
  const PasswordResetToken = sequelize.define(
    "PasswordResetToken",
    {
      reset_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: { type: DataTypes.BIGINT, allowNull: false },
      reset_token: { type: DataTypes.STRING(255), allowNull: false },
      is_used: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      expires_at: { type: DataTypes.DATE, allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "password_reset_tokens", timestamps: false }
  );
  return PasswordResetToken;
};

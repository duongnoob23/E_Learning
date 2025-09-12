module.exports = (sequelize, DataTypes) => {
  const OtpCode = sequelize.define(
    "OtpCode",
    {
      otp_id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      user_id: { type: DataTypes.BIGINT, allowNull: true },
      email: { type: DataTypes.STRING(100), allowNull: true },
      phone_number: { type: DataTypes.STRING(20), allowNull: true },
      otp_code: { type: DataTypes.STRING(6), allowNull: false },
      otp_type: {
        type: DataTypes.ENUM(
          "email_verification",
          "password_reset",
          "login_2fa",
          "phone_verification"
        ),
        allowNull: false,
      },
      is_used: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      attempts: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      expires_at: { type: DataTypes.DATE, allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "otp_codes", timestamps: false }
  );
  return OtpCode;
};

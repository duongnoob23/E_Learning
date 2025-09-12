const { Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const EmailVerification = sequelize.define(
    "EmailVerification",
    {
      verification_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: { type: DataTypes.BIGINT, allowNull: false },
      email: { type: DataTypes.STRING(100), allowNull: false },
      verification_token: { type: DataTypes.STRING(255), allowNull: false },
      is_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      verified_at: { type: DataTypes.DATE, allowNull: true },
      expires_at: { type: DataTypes.DATE, allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "email_verifications", timestamps: false }
  );
  EmailVerification.createVerification = async (data) =>
    EmailVerification.create(data);
  EmailVerification.findValidVerification = async (email, verification_token) =>
    EmailVerification.findOne({
      where: {
        email,
        verification_token,
        is_verified: false,
        expires_at: { [Op.gt]: new Date() },
      },
    });
  EmailVerification.markAsVerified = async (verification_id) =>
    EmailVerification.update(
      { is_verified: true, verified_at: new Date() },
      { where: { verification_id } }
    );

  return EmailVerification;
};

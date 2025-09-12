module.exports = (sequelize, DataTypes) => {
<<<<<<< HEAD
  const PasswordResetToken = sequelize.define("PasswordResetToken", {
    reset_id: { 
      type: DataTypes.BIGINT.UNSIGNED, 
      primaryKey: true,
      autoIncrement: true
    },
    user_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    reset_token: { type: DataTypes.STRING(255), allowNull: false },
    is_used: { type: DataTypes.BOOLEAN, defaultValue: false },
    expires_at: { type: DataTypes.DATE, allowNull: false }
  }, {
    tableName: "password_reset_tokens",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });
=======
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
>>>>>>> main
  return PasswordResetToken;
};

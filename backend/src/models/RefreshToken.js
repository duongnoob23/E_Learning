module.exports = (sequelize, DataTypes) => {
<<<<<<< HEAD
  const RefreshToken = sequelize.define("RefreshToken", {
    token_id: { 
      type: DataTypes.BIGINT.UNSIGNED, 
      primaryKey: true,
      autoIncrement: true
    },
    user_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    token_hash: { type: DataTypes.STRING(255), allowNull: false },
    device_info: { type: DataTypes.TEXT, allowNull: true },
    ip_address: { type: DataTypes.STRING(45), allowNull: true },
    user_agent: { type: DataTypes.TEXT, allowNull: true },
    is_revoked: { type: DataTypes.BOOLEAN, defaultValue: false },
    expires_at: { type: DataTypes.DATE, allowNull: false }
  }, {
    tableName: "refresh_tokens",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });
=======
  const RefreshToken = sequelize.define(
    "RefreshToken",
    {
      token_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: { type: DataTypes.BIGINT, allowNull: false },
      token_hash: { type: DataTypes.STRING(255), allowNull: false },
      device_info: { type: DataTypes.TEXT, allowNull: true },
      ip_address: { type: DataTypes.STRING(45), allowNull: true },
      user_agent: { type: DataTypes.TEXT, allowNull: true },
      is_revoked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      expires_at: { type: DataTypes.DATE, allowNull: false },
      created_at: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "refresh_tokens", timestamps: false }
  );
>>>>>>> main
  return RefreshToken;
};

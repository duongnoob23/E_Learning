module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    user_id: { 
      type: DataTypes.BIGINT.UNSIGNED, 
      primaryKey: true,
      autoIncrement: true
    },
    username: { type: DataTypes.STRING(50), unique: true, allowNull: false },
    password_hash: { type: DataTypes.STRING(255), allowNull: false },
    email: { type: DataTypes.STRING(100), unique: true, allowNull: false },
    full_name: { type: DataTypes.STRING(100) },
    phone_number: { type: DataTypes.STRING(20) },
    avatar_url: { type: DataTypes.STRING(255) },
    status: { type: DataTypes.STRING(20), defaultValue: 'active' },
    email_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    phone_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    last_login: { type: DataTypes.DATE },
    failed_login_attempts: { type: DataTypes.INTEGER, defaultValue: 0 },
    locked_until: { type: DataTypes.DATE }
  }, {
    tableName: "users",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return User;
};

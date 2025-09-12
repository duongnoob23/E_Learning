module.exports = (sequelize, DataTypes) => {
  const LoginHistory = sequelize.define(
    "LoginHistory",
    {
      login_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: { type: DataTypes.BIGINT, allowNull: false },
      login_time: { type: DataTypes.DATE, allowNull: true },
      ip_address: { type: DataTypes.STRING(45), allowNull: true },
      user_agent: { type: DataTypes.TEXT, allowNull: true },
      login_status: {
        type: DataTypes.ENUM("success", "failed", "blocked", "2fa_required"),
        allowNull: false,
      },
      failure_reason: { type: DataTypes.STRING(255), allowNull: true },
      session_duration: { type: DataTypes.INTEGER, allowNull: true },
    },
    { tableName: "login_history", timestamps: false }
  );
  return LoginHistory;
};

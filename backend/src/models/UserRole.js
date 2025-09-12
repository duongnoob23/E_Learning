module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define(
    "UserRole",
    {
      user_id: { type: DataTypes.BIGINT, primaryKey: true },
      role_id: { type: DataTypes.BIGINT, primaryKey: true },
      assigned_at: { type: DataTypes.DATE, allowNull: true },
      assigned_by: { type: DataTypes.BIGINT, allowNull: true },
      is_active: { type: DataTypes.BOOLEAN, allowNull: true },
    },
    { tableName: "user_roles", timestamps: false }
  );
  return UserRole;
};

// module.exports = (sequelize, DataTypes) => {
//   const UserRole = sequelize.define("UserRole", {
//     user_id: { type: DataTypes.INTEGER, primaryKey: true },
//     role_id: { type: DataTypes.INTEGER, primaryKey: true },
//     assigned_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
//   }, {
//     tableName: "user_roles",
//     timestamps: false
//   });
//   return UserRole;
// };

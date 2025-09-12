module.exports = (sequelize, DataTypes) => {
  const RolePermission = sequelize.define(
    "RolePermission",
    {
      role_id: { type: DataTypes.BIGINT, primaryKey: true },
      permission_id: { type: DataTypes.BIGINT, primaryKey: true },
      granted_at: { type: DataTypes.DATE, allowNull: true },
      granted_by: { type: DataTypes.BIGINT, allowNull: true },
    },
    { tableName: "role_permissions", timestamps: false }
  );
  return RolePermission;
};

// module.exports = (sequelize, DataTypes) => {
//   const RolePermission = sequelize.define("RolePermission", {
//     role_id: { type: DataTypes.INTEGER, primaryKey: true },
//     permission_id: { type: DataTypes.INTEGER, primaryKey: true }
//   }, {
//     tableName: "role_permissions",
//     timestamps: false
//   });
//   return RolePermission;
// };

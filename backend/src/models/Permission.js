module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define(
    "Permission",
    {
      permission_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      permission_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      description: { type: DataTypes.TEXT, allowNull: true },
      resource: { type: DataTypes.STRING(50), allowNull: true },
      action: { type: DataTypes.STRING(20), allowNull: true },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "permissions", timestamps: false }
  );
  return Permission;
};

// module.exports = (sequelize, DataTypes) => {
//   const Permission = sequelize.define("Permission", {
//     permission_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//     permission_name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
//     description: { type: DataTypes.TEXT }
//   }, {
//     tableName: "permissions",
//     timestamps: false
//   });
//   return Permission;
// };

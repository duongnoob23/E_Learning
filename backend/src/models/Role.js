module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role",
    {
      role_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      role_name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "roles", timestamps: false }
  );
  return Role;
};

// module.exports = (sequelize, DataTypes) => {
//   const Role = sequelize.define("Role", {
//     role_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//     role_name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
//     description: { type: DataTypes.TEXT }
//   }, {
//     tableName: "roles",
//     timestamps: false
//   });
//   return Role;
// };

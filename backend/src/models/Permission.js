module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define("Permission", {
    permission_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    permission_name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    description: { type: DataTypes.TEXT }
  }, {
    tableName: "permissions",
    timestamps: false
  });
  return Permission;
};
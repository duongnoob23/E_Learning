module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define("Role", {
    role_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    role_name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    description: { type: DataTypes.TEXT }
  }, {
    tableName: "roles",
    timestamps: false
  });
  return Role;
};
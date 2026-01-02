const { Op } = require("sequelize");
const { Role } = require("./Role");
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      user_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      password_hash: { type: DataTypes.STRING(255), allowNull: false },
      email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      full_name: { type: DataTypes.STRING(100), allowNull: true },
      phone_number: { type: DataTypes.STRING(20), allowNull: true },
      avatar_url: { type: DataTypes.STRING(255), allowNull: true },
      status: { type: DataTypes.STRING(20), allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: true },
      updated_at: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "users", timestamps: false }
  );
  // Note: findAndCountAll is a built-in Sequelize method, no need to override
  User.findbyId = async (user_id) => User.findOne({ where: { user_id }, attributes: { exclude: ["password_hash"] } });
  User.findByEmail = async (email) => User.findOne({ where: { email }, include: [
    {
      model: Role,
      as: "roles",
      through: { attributes: [] },
      attributes: ["role_name"],
    },
  ] });
  User.findByUsername = async (username) =>
    User.findOne({ where: { username } });
  User.createUser = async (data) => User.create(data);
  User.updateUser = async (user_id, data) =>
    User.update(data, { where: { user_id } });
  User.deleteUser = async (user_id) => User.destroy({ where: { user_id } });
  User.getAll = async () => User.findAll();
  User.countUsers = async () => User.count();
  return User;
};

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    password_hash: { type: DataTypes.STRING(255), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    full_name: { type: DataTypes.STRING(100) },
    phone_number: { type: DataTypes.STRING(20) },
    avatar_url: { type: DataTypes.STRING(255) },
    status: { type: DataTypes.STRING(20) },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: "users",
    timestamps: false
  });

  User.findById = async (user_id) => User.findOne({ where: { user_id } });
  User.findByEmail = async (email) => User.findOne({ where: { email } });
  User.findByUsername = async (username) => User.findOne({ where: { username } });
  User.createUser = async (data) => User.create(data);
  User.updateUser = async (user_id, data) => User.update(data, { where: { user_id } });
  User.deleteUser = async (user_id) => User.destroy({ where: { user_id } });
  User.getAll = async () => User.findAll();
  User.countUsers = async () => User.count();

  return User;
};
module.exports = (sequelize, DataTypes) => {
<<<<<<< HEAD
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
=======
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
      email_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      phone_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      last_login: { type: DataTypes.DATE, allowNull: true },
      failed_login_attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      locked_until: { type: DataTypes.DATE, allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: true },
      updated_at: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "users", timestamps: false }
  );
  return User;
};

// module.exports = (sequelize, DataTypes) => {
//   const User = sequelize.define("User", {
//     user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//     username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
//     password_hash: { type: DataTypes.STRING(255), allowNull: false },
//     email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
//     full_name: { type: DataTypes.STRING(100) },
//     phone_number: { type: DataTypes.STRING(20) },
//     avatar_url: { type: DataTypes.STRING(255) },
//     status: { type: DataTypes.STRING(20) },
//     created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
//     updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
//   }, {
//     tableName: "users",
//     timestamps: false
//   });

//   User.findById = async (user_id) => User.findOne({ where: { user_id } });
//   User.findByEmail = async (email) => User.findOne({ where: { email } });
//   User.findByUsername = async (username) => User.findOne({ where: { username } });
//   User.createUser = async (data) => User.create(data);
//   User.updateUser = async (user_id, data) => User.update(data, { where: { user_id } });
//   User.deleteUser = async (user_id) => User.destroy({ where: { user_id } });
//   User.getAll = async () => User.findAll();
//   User.countUsers = async () => User.count();

//   return User;
// };
>>>>>>> main

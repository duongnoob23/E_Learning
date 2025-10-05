module.exports = (sequelize, DataTypes) => {
  const UserTest = sequelize.define('UserTest', {
    user_test_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    test_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tests',
        key: 'test_id'
      }
    },
    session_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    started_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    finished_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    score: {
      type: DataTypes.DECIMAL(5, 2), // Score with 2 decimal places
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('not_started', 'in_progress', 'completed', 'abandoned'),
      allowNull: false,
      defaultValue: 'not_started'
    },
    remaining_time: {
      type: DataTypes.INTEGER, // Remaining time in seconds
      allowNull: true
    },
    is_submitted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    last_saved_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'user_tests',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'test_id']
      }
    ],
  });

  // Utility methods
  UserTest.findById = async (user_test_id) => UserTest.findByPk(user_test_id);
  UserTest.findByUserAndTest = async (user_id, test_id) => UserTest.findOne({ 
    where: { user_id, test_id } 
  });
  UserTest.findByUserId = async (user_id) => UserTest.findAll({ 
    where: { user_id },
    order: [['started_at', 'DESC']]
  });
  UserTest.findByTestId = async (test_id) => UserTest.findAll({ 
    where: { test_id },
    order: [['started_at', 'DESC']]
  });
  UserTest.createUserTest = async (data) => UserTest.create(data);
  UserTest.updateUserTest = async (user_test_id, data) => UserTest.update(data, { where: { user_test_id } });
  UserTest.deleteUserTest = async (user_test_id) => UserTest.destroy({ where: { user_test_id } });

  return UserTest;
};

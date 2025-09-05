const Sequelize = require("sequelize");
const sequelize = require("../config/database");
const EmailOtp = require("./EmailOtp")(sequelize, Sequelize.DataTypes);
const User = require("./User")(sequelize, Sequelize.DataTypes);
const Role = require("./Role")(sequelize, Sequelize.DataTypes);
const UserRole = require("./UserRole")(sequelize, Sequelize.DataTypes);
const Permission = require("./Permission")(sequelize, Sequelize.DataTypes);
const RolePermission = require("./RolePermission")(sequelize, Sequelize.DataTypes);
const Topic = require("./Topic")(sequelize, Sequelize.DataTypes);
const Word = require("./Word")(sequelize, Sequelize.DataTypes);
const UserWord = require("./UserWord")(sequelize, Sequelize.DataTypes);
const UserWordProgress = require("./UserWordProgress")(sequelize, Sequelize.DataTypes);
const FavoriteTopic = require("./FavoriteTopic")(sequelize, Sequelize.DataTypes);
const ExerciseType = require("./ExerciseType")(sequelize, Sequelize.DataTypes);
const Exercise = require("./Exercise")(sequelize, Sequelize.DataTypes);
const ExerciseQuestion = require("./ExerciseQuestion")(sequelize, Sequelize.DataTypes);
const ExerciseResult = require("./ExerciseResult")(sequelize, Sequelize.DataTypes);

// Thiết lập quan hệ
User.belongsToMany(Role, { through: UserRole, foreignKey: "user_id" });
Role.belongsToMany(User, { through: UserRole, foreignKey: "role_id" });

Role.belongsToMany(Permission, { through: RolePermission, foreignKey: "role_id" });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: "permission_id" });

Topic.belongsTo(User, { foreignKey: "created_by" });
User.hasMany(Topic, { foreignKey: "created_by" });

Word.belongsTo(Topic, { foreignKey: "topic_id" });
Topic.hasMany(Word, { foreignKey: "topic_id" });

UserWord.belongsTo(Topic, { foreignKey: "topic_id" });
Topic.hasMany(UserWord, { foreignKey: "topic_id" });

UserWord.belongsTo(Word, { foreignKey: "from_system_word_id" });
Word.hasMany(UserWord, { foreignKey: "from_system_word_id" });

UserWordProgress.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(UserWordProgress, { foreignKey: "user_id" });

UserWordProgress.belongsTo(Word, { foreignKey: "word_id" });
Word.hasMany(UserWordProgress, { foreignKey: "word_id" });

UserWordProgress.belongsTo(UserWord, { foreignKey: "user_word_id" });
UserWord.hasMany(UserWordProgress, { foreignKey: "user_word_id" });

FavoriteTopic.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(FavoriteTopic, { foreignKey: "user_id" });

FavoriteTopic.belongsTo(Topic, { foreignKey: "topic_id" });
Topic.hasMany(FavoriteTopic, { foreignKey: "topic_id" });

Exercise.belongsTo(Topic, { foreignKey: "topic_id" });
Topic.hasMany(Exercise, { foreignKey: "topic_id" });

Exercise.belongsTo(ExerciseType, { foreignKey: "exercise_type_id" });
ExerciseType.hasMany(Exercise, { foreignKey: "exercise_type_id" });

ExerciseQuestion.belongsTo(Exercise, { foreignKey: "exercise_id" });
Exercise.hasMany(ExerciseQuestion, { foreignKey: "exercise_id" });

ExerciseQuestion.belongsTo(Word, { foreignKey: "related_word_id" });
Word.hasMany(ExerciseQuestion, { foreignKey: "related_word_id" });

ExerciseResult.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(ExerciseResult, { foreignKey: "user_id" });

ExerciseResult.belongsTo(ExerciseQuestion, { foreignKey: "question_id" });
ExerciseQuestion.hasMany(ExerciseResult, { foreignKey: "question_id" });

module.exports = {
  sequelize,
  User,
  Role,
  UserRole,
  Permission,
  RolePermission,
  Topic,
  Word,
  UserWord,
  UserWordProgress,
  FavoriteTopic,
  ExerciseType,
  Exercise,
  ExerciseQuestion,
  ExerciseResult,
  EmailOtp
};
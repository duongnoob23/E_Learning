const Sequelize = require("sequelize");
const sequelize = require("../config/database");

// User & Authentication models
const User = require("./User")(sequelize, Sequelize.DataTypes);
const Role = require("./Role")(sequelize, Sequelize.DataTypes);
const UserRole = require("./UserRole")(sequelize, Sequelize.DataTypes);
const Permission = require("./Permission")(sequelize, Sequelize.DataTypes);
const RolePermission = require("./RolePermission")(sequelize, Sequelize.DataTypes);
const EmailVerification = require("./EmailVerification")(sequelize, Sequelize.DataTypes);
const OtpCode = require("./OtpCode")(sequelize, Sequelize.DataTypes);
const RefreshToken = require("./RefreshToken")(sequelize, Sequelize.DataTypes);
const LoginHistory = require("./LoginHistory")(sequelize, Sequelize.DataTypes);
const PasswordResetToken = require("./PasswordResetToken")(sequelize, Sequelize.DataTypes);

// Vocabulary models
const Topic = require("./Topic")(sequelize, Sequelize.DataTypes);
const Word = require("./Word")(sequelize, Sequelize.DataTypes);
const UserWord = require("./UserWord")(sequelize, Sequelize.DataTypes);
const UserWordStatus = require("./UserWordStatus")(sequelize, Sequelize.DataTypes);
const FavoriteTopic = require("./FavoriteTopic")(sequelize, Sequelize.DataTypes);
const BatchImport = require("./BatchImport")(sequelize, Sequelize.DataTypes);
const ImportDetail = require("./ImportDetail")(sequelize, Sequelize.DataTypes);
const StudyMode = require("./StudyMode")(sequelize, Sequelize.DataTypes);

// Course models
const Category = require("./Category")(sequelize, Sequelize.DataTypes);
const Level = require("./Level")(sequelize, Sequelize.DataTypes);
const Instructor = require("./Instructor")(sequelize, Sequelize.DataTypes);
const Course = require("./Course")(sequelize, Sequelize.DataTypes);
const CourseDetail = require("./CourseDetail")(sequelize, Sequelize.DataTypes);
const Module = require("./Module")(sequelize, Sequelize.DataTypes);
const Lesson = require("./Lesson")(sequelize, Sequelize.DataTypes);
const CourseEnrollment = require("./CourseEnrollment")(sequelize, Sequelize.DataTypes);
const LessonProgress = require("./LessonProgress")(sequelize, Sequelize.DataTypes);
const CourseReview = require("./CourseReview")(sequelize, Sequelize.DataTypes);
const CourseDiscussion = require("./CourseDiscussion")(sequelize, Sequelize.DataTypes);
const CourseWishlist = require("./CourseWishlist")(sequelize, Sequelize.DataTypes);
const Coupon = require("./Coupon")(sequelize, Sequelize.DataTypes);
const CourseCoupon = require("./CourseCoupon")(sequelize, Sequelize.DataTypes);
const CourseCertificate = require("./CourseCertificate")(sequelize, Sequelize.DataTypes);
const CourseTag = require("./CourseTag")(sequelize, Sequelize.DataTypes);
const CourseTagRelation = require("./CourseTagRelation")(sequelize, Sequelize.DataTypes);

// Thiết lập quan hệ
// User & Authentication relationships
User.belongsToMany(Role, { through: UserRole, foreignKey: "user_id" });
Role.belongsToMany(User, { through: UserRole, foreignKey: "role_id" });

Role.belongsToMany(Permission, { through: RolePermission, foreignKey: "role_id" });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: "permission_id" });

OtpCode.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(OtpCode, { foreignKey: "user_id" });

RefreshToken.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(RefreshToken, { foreignKey: "user_id" });

LoginHistory.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(LoginHistory, { foreignKey: "user_id" });

PasswordResetToken.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(PasswordResetToken, { foreignKey: "user_id" });

EmailVerification.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(EmailVerification, { foreignKey: "user_id" });

// Vocabulary relationships
Topic.belongsTo(User, { foreignKey: "created_by" });
User.hasMany(Topic, { foreignKey: "created_by" });

Word.belongsTo(Topic, { foreignKey: "topic_id" });
Topic.hasMany(Word, { foreignKey: "topic_id" });

Word.belongsTo(User, { foreignKey: "created_by" });
User.hasMany(Word, { foreignKey: "created_by" });

UserWord.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(UserWord, { foreignKey: "user_id" });

UserWord.belongsTo(Topic, { foreignKey: "topic_id" });
Topic.hasMany(UserWord, { foreignKey: "topic_id" });

UserWord.belongsTo(Word, { foreignKey: "from_system_word_id" });
Word.hasMany(UserWord, { foreignKey: "from_system_word_id" });

UserWordStatus.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(UserWordStatus, { foreignKey: "user_id" });

UserWordStatus.belongsTo(Topic, { foreignKey: "topic_id" });
Topic.hasMany(UserWordStatus, { foreignKey: "topic_id" });

UserWordStatus.belongsTo(Word, { foreignKey: "word_id" });
Word.hasMany(UserWordStatus, { foreignKey: "word_id" });

UserWordStatus.belongsTo(UserWord, { foreignKey: "user_word_id" });
UserWord.hasMany(UserWordStatus, { foreignKey: "user_word_id" });

FavoriteTopic.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(FavoriteTopic, { foreignKey: "user_id" });

FavoriteTopic.belongsTo(Topic, { foreignKey: "topic_id" });
Topic.hasMany(FavoriteTopic, { foreignKey: "topic_id" });

BatchImport.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(BatchImport, { foreignKey: "user_id" });

BatchImport.belongsTo(Topic, { foreignKey: "topic_id" });
Topic.hasMany(BatchImport, { foreignKey: "topic_id" });

ImportDetail.belongsTo(BatchImport, { foreignKey: "import_id" });
BatchImport.hasMany(ImportDetail, { foreignKey: "import_id" });

ImportDetail.belongsTo(UserWord, { foreignKey: "created_word_id" });
UserWord.hasMany(ImportDetail, { foreignKey: "created_word_id" });

// Course relationships
Instructor.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Instructor, { foreignKey: "user_id" });

Course.belongsTo(Category, { foreignKey: "category_id" });
Category.hasMany(Course, { foreignKey: "category_id" });

Course.belongsTo(Level, { foreignKey: "level_id" });
Level.hasMany(Course, { foreignKey: "level_id" });

Course.belongsTo(Instructor, { foreignKey: "instructor_id" });
Instructor.hasMany(Course, { foreignKey: "instructor_id" });

CourseDetail.belongsTo(Course, { foreignKey: "course_id" });
Course.hasOne(CourseDetail, { foreignKey: "course_id" });

Module.belongsTo(Course, { foreignKey: "course_id" });
Course.hasMany(Module, { foreignKey: "course_id" });

Lesson.belongsTo(Module, { foreignKey: "module_id" });
Module.hasMany(Lesson, { foreignKey: "module_id" });

Lesson.belongsTo(Course, { foreignKey: "course_id" });
Course.hasMany(Lesson, { foreignKey: "course_id" });

CourseEnrollment.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(CourseEnrollment, { foreignKey: "user_id" });

CourseEnrollment.belongsTo(Course, { foreignKey: "course_id" });
Course.hasMany(CourseEnrollment, { foreignKey: "course_id" });

CourseEnrollment.belongsTo(Lesson, { foreignKey: "last_accessed_lesson_id" });
Lesson.hasMany(CourseEnrollment, { foreignKey: "last_accessed_lesson_id" });

LessonProgress.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(LessonProgress, { foreignKey: "user_id" });

LessonProgress.belongsTo(Lesson, { foreignKey: "lesson_id" });
Lesson.hasMany(LessonProgress, { foreignKey: "lesson_id" });

LessonProgress.belongsTo(Course, { foreignKey: "course_id" });
Course.hasMany(LessonProgress, { foreignKey: "course_id" });

CourseReview.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(CourseReview, { foreignKey: "user_id" });

CourseReview.belongsTo(Course, { foreignKey: "course_id" });
Course.hasMany(CourseReview, { foreignKey: "course_id" });

CourseDiscussion.belongsTo(Course, { foreignKey: "course_id" });
Course.hasMany(CourseDiscussion, { foreignKey: "course_id" });

CourseDiscussion.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(CourseDiscussion, { foreignKey: "user_id" });

CourseDiscussion.belongsTo(CourseDiscussion, { foreignKey: "parent_id", as: "Parent" });
CourseDiscussion.hasMany(CourseDiscussion, { foreignKey: "parent_id", as: "Replies" });

CourseWishlist.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(CourseWishlist, { foreignKey: "user_id" });

CourseWishlist.belongsTo(Course, { foreignKey: "course_id" });
Course.hasMany(CourseWishlist, { foreignKey: "course_id" });

CourseCoupon.belongsTo(Course, { foreignKey: "course_id" });
Course.hasMany(CourseCoupon, { foreignKey: "course_id" });

CourseCoupon.belongsTo(Coupon, { foreignKey: "coupon_id" });
Coupon.hasMany(CourseCoupon, { foreignKey: "coupon_id" });

CourseCertificate.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(CourseCertificate, { foreignKey: "user_id" });

CourseCertificate.belongsTo(Course, { foreignKey: "course_id" });
Course.hasMany(CourseCertificate, { foreignKey: "course_id" });

CourseCertificate.belongsTo(CourseEnrollment, { foreignKey: "enrollment_id" });
CourseEnrollment.hasMany(CourseCertificate, { foreignKey: "enrollment_id" });

CourseTagRelation.belongsTo(Course, { foreignKey: "course_id" });
Course.hasMany(CourseTagRelation, { foreignKey: "course_id" });

CourseTagRelation.belongsTo(CourseTag, { foreignKey: "tag_id" });
CourseTag.hasMany(CourseTagRelation, { foreignKey: "tag_id" });

module.exports = {
  sequelize,
  // User & Authentication models
  User,
  Role,
  UserRole,
  Permission,
  RolePermission,
  EmailVerification,
  OtpCode,
  RefreshToken,
  LoginHistory,
  PasswordResetToken,
  // Vocabulary models
  Topic,
  Word,
  UserWord,
  UserWordStatus,
  FavoriteTopic,
  BatchImport,
  ImportDetail,
  StudyMode,
  // Course models
  Category,
  Level,
  Instructor,
  Course,
  CourseDetail,
  Module,
  Lesson,
  CourseEnrollment,
  LessonProgress,
  CourseReview,
  CourseDiscussion,
  CourseWishlist,
  Coupon,
  CourseCoupon,
  CourseCertificate,
  CourseTag,
  CourseTagRelation
};

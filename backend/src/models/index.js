const sequelize = require("../config/database");
const DataTypes = require("sequelize").DataTypes;

// Import models
const User = require("./User")(sequelize, DataTypes);
const Role = require("./Role")(sequelize, DataTypes);
const Permission = require("./Permission")(sequelize, DataTypes);
const UserRole = require("./UserRole")(sequelize, DataTypes);
const RolePermission = require("./RolePermission")(sequelize, DataTypes);
const OtpCode = require("./OtpCode")(sequelize, DataTypes);
const RefreshToken = require("./RefreshToken")(sequelize, DataTypes);
const EmailVerification = require("./EmailVerification")(sequelize, DataTypes);
const LoginHistory = require("./LoginHistory")(sequelize, DataTypes);
const PasswordResetToken = require("./PasswordResetToken")(
  sequelize,
  DataTypes
);

const Topic = require("./Topic")(sequelize, DataTypes);
const Word = require("./Word")(sequelize, DataTypes);
const UserWord = require("./UserWord")(sequelize, DataTypes);
const UserWordStatus = require("./UserWordStatus")(sequelize, DataTypes);
const FavoriteTopic = require("./FavoriteTopic")(sequelize, DataTypes);
const BatchImport = require("./BatchImport")(sequelize, DataTypes);
const ImportDetail = require("./ImportDetail")(sequelize, DataTypes);
const StudyMode = require("./StudyMode")(sequelize, DataTypes);

const Category = require("./Category")(sequelize, DataTypes);
const Level = require("./Level")(sequelize, DataTypes);
const Instructor = require("./Instructor")(sequelize, DataTypes);
const Course = require("./Course")(sequelize, DataTypes);
const CourseDetail = require("./CourseDetail")(sequelize, DataTypes);
const Module = require("./Module")(sequelize, DataTypes);
const Lesson = require("./Lesson")(sequelize, DataTypes);
const CourseEnrollment = require("./CourseEnrollment")(sequelize, DataTypes);
const LessonProgress = require("./LessonProgress")(sequelize, DataTypes);
const CourseReview = require("./CourseReview")(sequelize, DataTypes);
const CourseDiscussion = require("./CourseDiscussion")(sequelize, DataTypes);
const CourseWishlist = require("./CourseWishlist")(sequelize, DataTypes);
const Coupon = require("./Coupon")(sequelize, DataTypes);
const CourseCoupon = require("./CourseCoupon")(sequelize, DataTypes);
const CourseCertificate = require("./CourseCertificate")(sequelize, DataTypes);
const CourseTag = require("./CourseTag")(sequelize, DataTypes);
const CourseTagRelation = require("./CourseTagRelation")(sequelize, DataTypes);

// Exam models
const Test = require("./Test")(sequelize, DataTypes);
const Tag = require("./Tag")(sequelize, DataTypes);
const TestTag = require("./TestTag")(sequelize, DataTypes);
const TestSection = require("./TestSection")(sequelize, DataTypes);
const UserTest = require("./UserTest")(sequelize, DataTypes);

// Question models
const Question = require("./Question")(sequelize, DataTypes);
const QuestionAnswer = require("./QuestionAnswer")(sequelize, DataTypes);
const QuestionChoice = require("./QuestionChoice")(sequelize, DataTypes);
const UserTestAnswer = require("./UserTestAnswer")(sequelize, DataTypes);
const WritingAttempt = require("./WritingAttempt")(sequelize, DataTypes);
const SpeakingAttempt = require("./SpeakingAttempt")(sequelize, DataTypes);

// Associations

// Accounts
UserRole.belongsTo(User, { foreignKey: "user_id" });
UserRole.belongsTo(Role, { foreignKey: "role_id" });
RolePermission.belongsTo(Role, { foreignKey: "role_id" });
RolePermission.belongsTo(Permission, { foreignKey: "permission_id" });

OtpCode.belongsTo(User, { foreignKey: "user_id" });
RefreshToken.belongsTo(User, { foreignKey: "user_id" });
EmailVerification.belongsTo(User, { foreignKey: "user_id" });
LoginHistory.belongsTo(User, { foreignKey: "user_id" });
PasswordResetToken.belongsTo(User, { foreignKey: "user_id" });

// Vocabulary
Topic.belongsTo(User, { as: "creator", foreignKey: "created_by" });
Word.belongsTo(Topic, { foreignKey: "topic_id" });
Word.belongsTo(User, { as: "wordCreator", foreignKey: "created_by" });

UserWord.belongsTo(User, { foreignKey: "user_id" });
UserWord.belongsTo(Topic, { foreignKey: "topic_id" });
UserWord.belongsTo(Word, {
  as: "fromSystem",
  foreignKey: "from_system_word_id",
});

UserWordStatus.belongsTo(User, { foreignKey: "user_id" });
UserWordStatus.belongsTo(Topic, { foreignKey: "topic_id" });
UserWordStatus.belongsTo(Word, { foreignKey: "word_id" });
UserWordStatus.belongsTo(UserWord, { foreignKey: "user_word_id" });

FavoriteTopic.belongsTo(User, { foreignKey: "user_id" });
FavoriteTopic.belongsTo(Topic, { foreignKey: "topic_id" });

BatchImport.belongsTo(User, { foreignKey: "user_id" });
BatchImport.belongsTo(Topic, { foreignKey: "topic_id" });
ImportDetail.belongsTo(BatchImport, { foreignKey: "import_id" });
ImportDetail.belongsTo(UserWord, { foreignKey: "created_word_id" });

// Course
Course.belongsTo(Category, { foreignKey: "category_id" });
Course.belongsTo(Level, { foreignKey: "level_id" });
Course.belongsTo(Instructor, { foreignKey: "instructor_id" });

CourseDetail.belongsTo(Course, { foreignKey: "course_id" });

Module.belongsTo(Course, { foreignKey: "course_id" });
Lesson.belongsTo(Module, { foreignKey: "module_id" });
Lesson.belongsTo(Course, { foreignKey: "course_id" });

CourseEnrollment.belongsTo(User, { foreignKey: "user_id" });
CourseEnrollment.belongsTo(Course, { foreignKey: "course_id" });
CourseEnrollment.belongsTo(Lesson, {
  as: "lastLesson",
  foreignKey: "last_accessed_lesson_id",
});

LessonProgress.belongsTo(User, { foreignKey: "user_id" });
LessonProgress.belongsTo(Lesson, { foreignKey: "lesson_id" });
LessonProgress.belongsTo(Course, { foreignKey: "course_id" });

CourseReview.belongsTo(User, { foreignKey: "user_id" });
CourseReview.belongsTo(Course, { foreignKey: "course_id" });

CourseDiscussion.belongsTo(Course, { foreignKey: "course_id" });
CourseDiscussion.belongsTo(User, { foreignKey: "user_id" });
CourseDiscussion.belongsTo(CourseDiscussion, {
  as: "parent",
  foreignKey: "parent_id",
});

CourseWishlist.belongsTo(User, { foreignKey: "user_id" });
CourseWishlist.belongsTo(Course, { foreignKey: "course_id" });

CourseCoupon.belongsTo(Course, { foreignKey: "course_id" });
CourseCoupon.belongsTo(Coupon, { foreignKey: "coupon_id" });

CourseCertificate.belongsTo(User, { foreignKey: "user_id" });
CourseCertificate.belongsTo(Course, { foreignKey: "course_id" });
CourseCertificate.belongsTo(CourseEnrollment, { foreignKey: "enrollment_id" });

CourseTagRelation.belongsTo(Course, { foreignKey: "course_id" });
CourseTagRelation.belongsTo(CourseTag, { foreignKey: "tag_id" });

Instructor.belongsTo(User, { foreignKey: "user_id" });

// Exam associations
Test.belongsTo(Course, { foreignKey: "course_id" });
Test.belongsToMany(Tag, {
  through: TestTag,
  foreignKey: "test_id",
  otherKey: "tag_id",
  as: "tags",
});
Tag.belongsToMany(Test, {
  through: TestTag,
  foreignKey: "tag_id",
  otherKey: "test_id",
  as: "tests",
});

// Test Section associations
TestSection.belongsTo(Test, { foreignKey: "test_id", as: "test" });
Test.hasMany(TestSection, { foreignKey: "test_id", as: "sections" });

// User Test associations
UserTest.belongsTo(User, { foreignKey: "user_id", as: "user" });
UserTest.belongsTo(Test, { foreignKey: "test_id", as: "test" });
User.hasMany(UserTest, { foreignKey: "user_id", as: "userTests" });
Test.hasMany(UserTest, { foreignKey: "test_id", as: "userTests" });

// Question associations
Question.belongsTo(TestSection, { foreignKey: "section_id", as: "section" });
TestSection.hasMany(Question, { foreignKey: "section_id", as: "questions" });

// Question Answer associations
QuestionAnswer.belongsTo(Question, { foreignKey: "question_id", as: "question" });
Question.hasOne(QuestionAnswer, { foreignKey: "question_id", as: "answer" });

// Question Choice associations
QuestionChoice.belongsTo(Question, { foreignKey: "question_id", as: "question" });
Question.hasMany(QuestionChoice, { foreignKey: "question_id", as: "choices" });

// User Test Answer associations
UserTestAnswer.belongsTo(UserTest, { foreignKey: "user_test_id", as: "userTest" });
UserTestAnswer.belongsTo(Question, { foreignKey: "question_id", as: "question" });
UserTestAnswer.belongsTo(QuestionChoice, { foreignKey: "choice_id", as: "choice" });
UserTest.hasMany(UserTestAnswer, { foreignKey: "user_test_id", as: "answers" });
Question.hasMany(UserTestAnswer, { foreignKey: "question_id", as: "userAnswers" });

// Writing Attempt associations
WritingAttempt.belongsTo(UserTestAnswer, { foreignKey: "answer_id", as: "answer" });
UserTestAnswer.hasOne(WritingAttempt, { foreignKey: "answer_id", as: "writingAttempt" });

// Speaking Attempt associations
SpeakingAttempt.belongsTo(UserTestAnswer, { foreignKey: "answer_id", as: "answer" });
UserTestAnswer.hasOne(SpeakingAttempt, { foreignKey: "answer_id", as: "speakingAttempt" });

// Export
module.exports = {
  sequelize,
  // User & Authentication models
  User,
  Role,
  Permission,
  UserRole,
  RolePermission,
  OtpCode,
  RefreshToken,
  EmailVerification,
  LoginHistory,
  PasswordResetToken,
  Topic,
  Word,
  UserWord,
  UserWordStatus,
  FavoriteTopic,
  BatchImport,
  ImportDetail,
  StudyMode,
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
  CourseTagRelation,
  // Exam models
  Test,
  Tag,
  TestTag,
  TestSection,
  UserTest,
  // Question models
  Question,
  QuestionAnswer,
  QuestionChoice,
  UserTestAnswer,
  WritingAttempt,
  SpeakingAttempt,
};

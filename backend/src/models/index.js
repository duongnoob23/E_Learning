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
const PronunciationAssessment = require("./PronunciationAssessment")(sequelize, DataTypes);
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
const Test = require("./exam/Test")(sequelize, DataTypes);
const Part = require("./exam/Part")(sequelize, DataTypes);
const Question = require("./exam/Questions")(sequelize, DataTypes);
const SpeakingResponse = require("./exam/SpeakingResponse")(sequelize, DataTypes);
const WritingResponse = require("./exam/WritingResponse")(sequelize, DataTypes);
const Choice = require("./exam/Choice")(sequelize, DataTypes);
const ExamSession = require("./exam/ExamSession")(sequelize, DataTypes);
const UserAnswer = require("./exam/UserAnswers")(sequelize, DataTypes);
const UserExamStatistics = require("./exam/UserStatistics")(sequelize, DataTypes);
const PartStatistics = require("./exam/PartStatistics")(sequelize, DataTypes);
const ExamCategory = require("./exam/TestCategory")(sequelize, DataTypes);
const TestCategoryRelation = require("./exam/TestCategoryRelation")(sequelize, DataTypes);
const ExamTag = require("./exam/Tag")(sequelize, DataTypes);
const QuestionTag = require("./exam/QuestionTag")(sequelize, DataTypes);
const TestDiscussion = require("./exam/Discussion")(sequelize, DataTypes);
const TestComment = require("./exam/Comment")(sequelize, DataTypes);


// Associations


// Exam Associations

// Test -> User (created_by)
Test.belongsTo(User, { as: "creator", foreignKey: "created_by" });

// Test -> Parts
Test.hasMany(Part, { as: "parts", foreignKey: "test_id" });
Part.belongsTo(Test, { as: "test", foreignKey: "test_id" });

// Part -> Questions
Part.hasMany(Question, { as: "questions", foreignKey: "part_id" });
Question.belongsTo(Part, { as: "part", foreignKey: "part_id" });

// Question -> Choices
Question.hasMany(Choice, { as: "choices", foreignKey: "question_id" });
Choice.belongsTo(Question, { as: "question", foreignKey: "question_id" });

// ExamSession -> User and Test
ExamSession.belongsTo(User, { as: "user", foreignKey: "user_id" });
ExamSession.belongsTo(Test, { as: "test", foreignKey: "test_id" });

// ExamSession -> UserAnswers
ExamSession.hasMany(UserAnswer, { as: "user_answers", foreignKey: "exam_session_id" });
UserAnswer.belongsTo(ExamSession, { as: "session", foreignKey: "exam_session_id" });

// UserAnswer -> Question and Choice
UserAnswer.belongsTo(Question, { as: "question", foreignKey: "question_id" });
UserAnswer.belongsTo(Choice, { as: "selected_choice", foreignKey: "selected_choice_id" });

// Statistics
UserExamStatistics.belongsTo(User, { as: "user", foreignKey: "user_id" });
PartStatistics.belongsTo(User, { as: "user", foreignKey: "user_id" });
PartStatistics.belongsTo(Part, { as: "part", foreignKey: "part_id" });

// Categories and Tags
TestCategoryRelation.belongsTo(Test, { as: "test", foreignKey: "test_id" });
TestCategoryRelation.belongsTo(ExamCategory, { as: "category", foreignKey: "exam_category_id" });

QuestionTag.belongsTo(Question, { as: "question", foreignKey: "question_id" });
QuestionTag.belongsTo(ExamTag, { as: "examTag", foreignKey: "exam_tag_id" });

// Reverse associations for tags
Question.hasMany(QuestionTag, { as: "questionTags", foreignKey: "question_id" });
ExamTag.hasMany(QuestionTag, { as: "questionTags", foreignKey: "exam_tag_id" });

// Discussions and Comments
TestDiscussion.belongsTo(Test, { as: "test", foreignKey: "test_id" });
TestDiscussion.belongsTo(User, { as: "user", foreignKey: "user_id" });
TestDiscussion.hasMany(TestComment, { as: "comments", foreignKey: "test_discussion_id" });

TestComment.belongsTo(TestDiscussion, { as: "discussion", foreignKey: "test_discussion_id" });
TestComment.belongsTo(User, { as: "user", foreignKey: "user_id" });
TestComment.belongsTo(TestComment, { as: "parent", foreignKey: "parent_comment_id" });
TestComment.hasMany(TestComment, { as: "replies", foreignKey: "parent_comment_id" });

// Accounts
User.belongsToMany(Role, { through: UserRole, as: "roles", foreignKey: "user_id" });
Role.belongsToMany(User, { through: UserRole, as: "users", foreignKey: "role_id" });
Role.belongsToMany(Permission, { through: RolePermission, as: "permissions", foreignKey: "role_id" });
Permission.belongsToMany(Role, { through: RolePermission, as: "roles", foreignKey: "permission_id" });

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
UserWordStatus.belongsTo(Word, { as: "words", foreignKey: "word_id" });
UserWordStatus.belongsTo(UserWord, { as: "user_words", foreignKey: "user_word_id" });

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


Course.hasOne(CourseDetail, {
  foreignKey: "course_id",
  as: "detail"
});
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

// Export
const db = {
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
  PronunciationAssessment,
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
  Part,
  Question,
  Choice,
  ExamSession,
  UserAnswer,
  SpeakingResponse,
  WritingResponse,
  UserExamStatistics,
  PartStatistics,
  ExamCategory,
  TestCategoryRelation,
  ExamTag,
  QuestionTag,
  TestDiscussion,
  TestComment,
};
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
module.exports = db;

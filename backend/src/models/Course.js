module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define(
    "Course",
    {
      course_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      title: { type: DataTypes.STRING(200), allowNull: false },
      slug: { type: DataTypes.STRING(200), allowNull: false, unique: true },
      short_description: { type: DataTypes.TEXT, allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      category_id: { type: DataTypes.BIGINT, allowNull: true },
      level_id: { type: DataTypes.BIGINT, allowNull: true },
      instructor_id: { type: DataTypes.BIGINT, allowNull: true },
      image: { type: DataTypes.STRING(255), allowNull: true },
      video_preview: { type: DataTypes.STRING(255), allowNull: true },
      video_duration: { type: DataTypes.STRING(20), allowNull: true },
      video_progress: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0,
      },
      total_lessons: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      total_duration: { type: DataTypes.STRING(50), allowNull: true },
      total_students: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      rating: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0,
      },
      rating_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      old_price: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
      discount_percent: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      is_free: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_best_seller: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_featured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      status: {
        type: DataTypes.ENUM("draft", "published", "archived","pending_review","rejected"),
        allowNull: false,
        defaultValue: "draft",
      },
      published_at: { type: DataTypes.DATE, allowNull: true },
      meta_title: { type: DataTypes.STRING(200), allowNull: true },
      meta_description: { type: DataTypes.TEXT, allowNull: true },
      created_at: { type: DataTypes.DATE },
      updated_at: { type: DataTypes.DATE },
    },
    { tableName: "courses", timestamps: false }
  );
  Course.findByCategory = async (category_id) => {
    return Course.findAll({ where: { category_id } });
  };
  Course.findByTitle = async (title) => {
    return Course.findAll({ where: { title } });
  };
  Course.findbyId = async (course_id) => {
    return Course.findOne({ where: { course_id } });
  };
  Course.findAllWithFilters = async (filters) => {
    return Course.findAndCountAll(filters);
  };  
  Course.getFilterOptions = async () => {
    return Course.findAndCountAll(filters);
  };
  Course.associate = (models) => {
    // Một khóa học có nhiều module
    Course.hasMany(models.Module, {
      foreignKey: "course_id",
      as: "modules",
    });
  
    // Một khóa học có nhiều bài học
    Course.hasMany(models.Lesson, {
      foreignKey: "course_id",
      as: "lessons",
    });
  
    // Một khóa học có thể có nhiều đánh giá
    Course.hasMany(models.CourseReview, {
      foreignKey: "course_id",
      as: "reviews",
    });
  
    // Một khóa học thuộc về một giảng viên
    Course.belongsTo(models.Instructor, {
      foreignKey: "instructor_id",
      as: "instructor",
    });
  
    // Một khóa học thuộc về một danh mục
    Course.belongsTo(models.Category, {
      foreignKey: "category_id",
      as: "category",
    });
  };
  
  return Course;
};

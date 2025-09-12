module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define("Course", {
    course_id: { 
      type: DataTypes.BIGINT.UNSIGNED, 
      primaryKey: true,
      autoIncrement: true
    },
    title: { type: DataTypes.STRING(200), allowNull: false },
    slug: { type: DataTypes.STRING(200), allowNull: false, unique: true },
    short_description: { type: DataTypes.TEXT, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    category_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    level_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    instructor_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    image: { type: DataTypes.STRING(255), allowNull: true },
    video_preview: { type: DataTypes.STRING(255), allowNull: true },
    video_duration: { type: DataTypes.STRING(20), allowNull: true },
    video_progress: { type: DataTypes.DECIMAL(3,2), defaultValue: 0 },
    total_lessons: { type: DataTypes.INTEGER, defaultValue: 0 },
    total_duration: { type: DataTypes.STRING(50), allowNull: true },
    total_students: { type: DataTypes.INTEGER, defaultValue: 0 },
    rating: { type: DataTypes.DECIMAL(3,2), defaultValue: 0 },
    rating_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    price: { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 0 },
    old_price: { type: DataTypes.DECIMAL(10,2), allowNull: true },
    discount_percent: { type: DataTypes.INTEGER, defaultValue: 0 },
    is_free: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_best_seller: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_featured: { type: DataTypes.BOOLEAN, defaultValue: false },
    status: { 
      type: DataTypes.ENUM('draft', 'published', 'archived'), 
      defaultValue: 'draft' 
    },
    published_at: { type: DataTypes.DATE, allowNull: true },
    meta_title: { type: DataTypes.STRING(200), allowNull: true },
    meta_description: { type: DataTypes.TEXT, allowNull: true }
  }, {
    tableName: "courses",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Course;
};

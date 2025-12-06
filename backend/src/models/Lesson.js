module.exports = (sequelize, DataTypes) => {
  const Lesson = sequelize.define(
    "Lesson",
    {
      lesson_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      module_id: { type: DataTypes.BIGINT, allowNull: false },
      course_id: { type: DataTypes.BIGINT, allowNull: false },
      title: { type: DataTypes.STRING(200), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      content: { type: DataTypes.TEXT, allowNull: true },
      video_url: { type: DataTypes.STRING(255), allowNull: true },
      video_duration: { type: DataTypes.STRING(20), allowNull: true },
      file_attachment: { type: DataTypes.STRING(255), allowNull: true },
      sort_order: { type: DataTypes.INTEGER, allowNull: false },
      lesson_type: {
        type: DataTypes.ENUM("video", "document", "quiz", "assignment", "live"),
        allowNull: false,
        defaultValue: "video",
      },
      is_free: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      view_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: { type: DataTypes.DATE },
      updated_at: { type: DataTypes.DATE },
    },
    { tableName: "lessons", timestamps: false }
  );

  Lesson.findById = async (lesson_id) => {
    return Lesson.findOne({ where: { lesson_id } });
  };

  // Add associations
  Lesson.associate = function (models) {
    Lesson.belongsTo(models.Module, {
      foreignKey: "module_id",
      as: "module",
    });
    Lesson.belongsTo(models.Course, {
      foreignKey: "course_id",
      as: "course",
    });
  };
  return Lesson;
};

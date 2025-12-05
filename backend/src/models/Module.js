module.exports = (sequelize, DataTypes) => {
  const Module = sequelize.define(
    "Module",
    {
      module_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      course_id: { type: DataTypes.BIGINT, allowNull: false },
      title: { type: DataTypes.STRING(200), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      sort_order: { type: DataTypes.INTEGER, allowNull: false },
      total_lectures: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      total_duration: { type: DataTypes.STRING(50), allowNull: true },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: { type: DataTypes.DATE },
      updated_at: { type: DataTypes.DATE },
    },
    { tableName: "modules", timestamps: false }
  );
  Module.associate = (models) => {
    Module.belongsTo(models.Course, {
      foreignKey: "course_id",
      as: "course",
    });
    Module.hasMany(models.Lesson, {
      foreignKey: "module_id",
      as: "lessons",
    });
  };
  
  return Module;
};

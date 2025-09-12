module.exports = (sequelize, DataTypes) => {
  const StudyMode = sequelize.define("StudyMode", {
    mode_id: { 
      type: DataTypes.BIGINT.UNSIGNED, 
      primaryKey: true,
      autoIncrement: true
    },
    mode_name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    tableName: "study_modes",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });
  return StudyMode;
};

module.exports = (sequelize, DataTypes) => {
  const StudyMode = sequelize.define(
    "StudyMode",
    {
      mode_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      mode_name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "study_modes", timestamps: false }
  );
  return StudyMode;
};

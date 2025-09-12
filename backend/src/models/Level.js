module.exports = (sequelize, DataTypes) => {
  const Level = sequelize.define(
    "Level",
    {
      level_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      name: { type: DataTypes.STRING(50), allowNull: false },
      slug: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      color: { type: DataTypes.STRING(7), allowNull: true },
      sort_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "levels", timestamps: false }
  );
  return Level;
};

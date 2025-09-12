module.exports = (sequelize, DataTypes) => {
  const Level = sequelize.define("Level", {
    level_id: { 
      type: DataTypes.BIGINT.UNSIGNED, 
      primaryKey: true,
      autoIncrement: true
    },
    name: { type: DataTypes.STRING(50), allowNull: false },
    slug: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    color: { type: DataTypes.STRING(7), allowNull: true },
    sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    tableName: "levels",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });
  return Level;
};

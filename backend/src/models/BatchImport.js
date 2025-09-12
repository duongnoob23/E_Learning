module.exports = (sequelize, DataTypes) => {
  const BatchImport = sequelize.define(
    "BatchImport",
    {
      import_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: { type: DataTypes.BIGINT, allowNull: false },
      topic_id: { type: DataTypes.BIGINT, allowNull: false },
      import_name: { type: DataTypes.STRING(255), allowNull: true },
      total_words: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      success_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      error_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      import_status: {
        type: DataTypes.ENUM("pending", "processing", "completed", "failed"),
        allowNull: false,
        defaultValue: "pending",
      },
      error_log: { type: DataTypes.TEXT, allowNull: true },
      started_at: { type: DataTypes.DATE, allowNull: true },
      completed_at: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "batch_imports", timestamps: false }
  );
  return BatchImport;
};

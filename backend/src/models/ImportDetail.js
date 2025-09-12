module.exports = (sequelize, DataTypes) => {
  const ImportDetail = sequelize.define(
    "ImportDetail",
    {
      detail_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      import_id: { type: DataTypes.BIGINT, allowNull: false },
      row_num: { type: DataTypes.INTEGER, allowNull: true },
      word: { type: DataTypes.STRING(255), allowNull: true },
      meaning_vi: { type: DataTypes.TEXT, allowNull: true },
      part_of_speech: { type: DataTypes.STRING(50), allowNull: true },
      pronunciation: { type: DataTypes.STRING(255), allowNull: true },
      example_en: { type: DataTypes.TEXT, allowNull: true },
      example_vi: { type: DataTypes.TEXT, allowNull: true },
      notes: { type: DataTypes.TEXT, allowNull: true },
      import_status: {
        type: DataTypes.ENUM("pending", "success", "error"),
        allowNull: false,
        defaultValue: "pending",
      },
      error_message: { type: DataTypes.TEXT, allowNull: true },
      created_word_id: { type: DataTypes.BIGINT, allowNull: true },
    },
    { tableName: "import_details", timestamps: false }
  );
  return ImportDetail;
};

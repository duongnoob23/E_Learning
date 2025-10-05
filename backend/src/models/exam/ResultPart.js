// models/ResultPart.js
const { Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const ResultPart = sequelize.define(
    "ResultPart",
    {
      result_part_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      result_id: { type: DataTypes.BIGINT, allowNull: false },
      part_id: { type: DataTypes.BIGINT, allowNull: false },
      total_questions: { type: DataTypes.INTEGER, allowNull: false },
      correct_answers: { type: DataTypes.INTEGER, allowNull: false },
      score: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      tableName: "result_parts",
      timestamps: true,
    }
  );

  // ✅ Repository methods
  ResultPart.findById = async (id) => ResultPart.findOne({ where: { result_part_id: id } });
  ResultPart.getAll = async () => ResultPart.findAll();
  ResultPart.createResultPart = async (data) => ResultPart.create(data);
  ResultPart.updateResultPart = async (id, data) =>
  ResultPart.update(data, { where: { result_part_id: id } });

  return ResultPart;
};

const { Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const Part = sequelize.define(
        "Part",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            test_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            part_number: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            part_name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            part_type: {
                type: DataTypes.STRING(20),
                allowNull: false,
                comment: 'LISTENING, READING'
            },
            question_count: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            duration_minutes: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            display_template: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
        },
        {
            tableName: "parts",
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );

    Part.findById = async (id) =>
        Part.findOne({ where: { id } });

    Part.findByTestId = async (test_id) =>
        Part.findAll({ where: { test_id } });

    Part.findWithQuestions = async (id) =>
        Part.findOne({
            where: { id },
            include: [
                {
                    model: sequelize.models.Question,
                    as: "questions",
                    include: [
                        {
                            model: sequelize.models.Choice,
                            as: "choices"
                        }
                    ]
                }
            ]
        });

    Part.findByTestIdAndParts = async (test_id, partNumbers) => {
        return Part.findAll({
            where: {
                test_id,
                part_number: {
                    [Op.in]: partNumbers,
                },
            },
        });
    };

    Part.findAll = async () => Part.findAll();

    Part.createPart = async (data) => Part.create(data);

    Part.updatePart = async (id, data) =>
        Part.update(data, { where: { id } });

    Part.deletePart = async (id) =>
        Part.destroy({ where: { id } });

    return Part;
}


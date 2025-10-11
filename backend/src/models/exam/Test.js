const ResultPart = require("./ResultPart");
const { Result, Part, Passage, Question } = require("../index");

module.exports = (sequelize, DataTypes) => {
    const Test = sequelize.define(
        "Test",
        {
            test_id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            test_name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            description: { type: DataTypes.TEXT, allowNull: true },
            created_at: { type: DataTypes.DATE, allowNull: true },
        },
        {
            tableName: "tests",
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: false,
        }
    );

    Test.findById = async (test_id) => 
        Test.findOne({ where: { test_id } });

    Test.findwithRP = async (test_id) => 
        Test.findOne({
            where: { test_id },
            include : [
                {
                    model: Result,
                    as: "results",
                    include: [
                        {
                            model: ResultPart,
                            as: "result_parts",
                        },
                    ],
                },
                {
                    model: Part,
                    as: "parts",
                },
            ],
        });

    Test.findwithAll = async (test_id) => 
        Test.findOne({
            where: { test_id },
            include: [
                {
                    model: Part,
                    as: "parts",
                    include: [
                        {
                            model: Passage,
                            as: "passages",
                            include: [
                                {
                                    model: Question,
                                    as: "questions"
                                }
                            ]
                        },
                    ]
                }
            ],
        });

    Test.findForAll = async () => Test.findAll();

    Test.createTest = async (data) => Test.create(data);

    Test.updateTest = async (test_id, data) => 
        Test.update(data, { where : { test_id } });

    return Test;
}

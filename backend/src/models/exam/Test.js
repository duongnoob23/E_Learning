const ResultPart = require("./ResultPart");

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
        { tableName: "tests", timestamps: true}
    );
    Test.findById = async (test_id) => Test.findOne({where: { test_id }});
    Test.findwithRP = async (test_id ) => Test.finOne({
        where: { id: test_id },
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
    Test.findwithAll = async (test_id ) => Test.finOne({
        where: { id: test_id },
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
    })
    Test.findAll = async () => Test.findAll();
    Test.createTest = async (data) => Test.create(data);
    Test.updateTest = async (test_id, data) => Test.upadte(data, {where : {test_id}});
    return Test;
} 

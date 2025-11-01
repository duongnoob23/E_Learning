module.exports = (sequelize, DataTypes) => {
    const Test = sequelize.define(
        "Test",
        {
            test_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },
            title: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            exam_type: {
                type: DataTypes.ENUM('TOEIC', 'IELTS', 'HSK', 'THPT'),
                defaultValue: 'TOEIC',
                allowNull: false,
            },
            total_duration: {
                type: DataTypes.INTEGER,
                allowNull: false,
                comment: 'minutes'
            },
            total_questions: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            total_parts: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            difficulty_level: {
                type: DataTypes.ENUM('EASY', 'MEDIUM', 'HARD'),
                allowNull: false,
            },
            created_by: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: true,
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
            tableName: "tests",
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );

    Test.findById = async (test_id) =>
        Test.findOne({ where: { test_id } });

    Test.findWithParts = async (test_id) =>
        Test.findOne({
            where: { test_id },
            include: [
                {
                    model: sequelize.models.Part,
                    as: "parts",
                },
            ],
        });

    Test.findWithAll = async (test_id) =>
        Test.findOne({
            where: { test_id },
            include: [
                {
                    model: sequelize.models.Part,
                    as: "parts",
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
                        },
                    ]
                }
            ],
        });

    Test.createTest = async (data) => Test.create(data);

    Test.updateTest = async (test_id, data) =>
        Test.update(data, { where: { test_id } });

    Test.deleteTest = async (test_id) =>
        Test.destroy({ where: { test_id } });

    return Test;
}

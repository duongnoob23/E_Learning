module.exports = (sequelize, DataTypes) => {
    const Test = sequelize.define(
        "Test",
        {
            id: {
                type: DataTypes.INTEGER,
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
                type: DataTypes.STRING(50),
                allowNull: false,
                comment: 'TOEIC, IELTS, HSK, THPT'
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
                type: DataTypes.STRING(20),
                allowNull: false,
                comment: 'EASY, MEDIUM, HARD'
            },
            created_by: {
                type: DataTypes.INTEGER,
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

    Test.findById = async (id) =>
        Test.findOne({ where: { id } });

    Test.findWithParts = async (id) =>
        Test.findOne({
            where: { id },
            include: [
                {
                    model: sequelize.models.Part,
                    as: "parts",
                },
            ],
        });

    Test.findWithAll = async (id) =>
        Test.findOne({
            where: { id },
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

    Test.findAll = async () => Test.findAll();

    Test.createTest = async (data) => Test.create(data);

    Test.updateTest = async (id, data) =>
        Test.update(data, { where: { id } });

    Test.deleteTest = async (id) =>
        Test.destroy({ where: { id } });

    return Test;
}

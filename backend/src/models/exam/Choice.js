module.exports = (sequelize, DataTypes) => {
    const Choice = sequelize.define(
        "Choice",
        {
            choice_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },
            question_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
            },
            choice_letter: {
                type: DataTypes.ENUM('A', 'B', 'C', 'D'),
                allowNull: false,
            },
            choice_text: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            choice_translation: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            choice_explanation: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            is_correct: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
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
            tableName: "choices",
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );

    Choice.findById = async (choice_id) =>
        Choice.findOne({ where: { choice_id } });

    Choice.findByQuestionId = async (question_id) =>
        Choice.findAll({ where: { question_id } });

    Choice.findCorrectByQuestionId = async (question_id) =>
        Choice.findOne({
            where: {
                question_id,
                is_correct: true
            }
        });

    Choice.findAll = async () => Choice.findAll();

    Choice.createChoice = async (data) => Choice.create(data);

    Choice.updateChoice = async (choice_id, data) =>
        Choice.update(data, { where: { choice_id } });

    Choice.deleteChoice = async (choice_id) =>
        Choice.destroy({ where: { choice_id } });

    return Choice;
};

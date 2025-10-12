module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define(
        "Question",
        {
            question_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },
            part_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
            },
            question_number: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            question_text: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            question_type: {
                type: DataTypes.ENUM('MULTIPLE_CHOICE', 'FILL_BLANK', 'READING_COMPREHENSION'),
                allowNull: false,
            },
            audio_file: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            image_file: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            transcript: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            explanation: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            grammar_notes: {
                type: DataTypes.TEXT,
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
            tableName: "questions",
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );

    Question.findById = async (question_id) =>
        Question.findOne({ where: { question_id } });

    Question.findByPartId = async (part_id) =>
        Question.findAll({ where: { part_id } });

    Question.findWithChoices = async (question_id) =>
        Question.findOne({
            where: { question_id },
            include: [
                {
                    model: sequelize.models.Choice,
                    as: "choices"
                }
            ]
        });

    Question.findByPartIdWithChoices = async (part_id) =>
        Question.findAll({
            where: { part_id },
            include: [
                {
                    model: sequelize.models.Choice,
                    as: "choices"
                }
            ]
        });

    Question.findAll = async () => Question.findAll();

    Question.createQuestion = async (data) => Question.create(data);

    Question.updateQuestion = async (question_id, data) =>
        Question.update(data, { where: { question_id } });

    Question.deleteQuestion = async (question_id) =>
        Question.destroy({ where: { question_id } });

    Question.findByPartIdWithChoices = async (part_id) =>
        Question.findAll({
            where: { part_id },
            include: [
                {
                    model: sequelize.models.Choice,
                    as: "choices"
                }
            ]
        });

    Question.findWithChoices = async (question_id) =>
        Question.findOne({
            where: { question_id },
            include: [
                {
                    model: sequelize.models.Choice,
                    as: "choices"
                }
            ]
        });

    return Question;
};

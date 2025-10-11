module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define(
        "Question",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            part_id: {
                type: DataTypes.INTEGER,
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
                type: DataTypes.STRING(30),
                allowNull: false,
                comment: 'MULTIPLE_CHOICE, FILL_BLANK, READING_COMPREHENSION'
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

    Question.findById = async (id) =>
        Question.findOne({ where: { id } });

    Question.findByPartId = async (part_id) =>
        Question.findAll({ where: { part_id } });

    Question.findWithChoices = async (id) =>
        Question.findOne({
            where: { id },
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

    Question.updateQuestion = async (id, data) =>
        Question.update(data, { where: { id } });

    Question.deleteQuestion = async (id) =>
        Question.destroy({ where: { id } });

    return Question;
};

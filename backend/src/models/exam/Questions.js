module.exports = (sequelize, DataTypes) => { 
    const Questions = sequelize.define(
        "Questions",
        {
            question_id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            part_id: {  
                type: DataTypes.BIGINT,
                allowNull: false
            },
            passage_id: { type: DataTypes.BIGINT, allowNull: true },
            question_text: { type: DataTypes.TEXT, allowNull: false },
            question_text_vi: { type: DataTypes.TEXT, allowNull: true },
            options: { type: DataTypes.JSON, allowNull: true },
            options_vi: { type: DataTypes.JSON, allowNull: true },
            correct_answer: { type: DataTypes.STRING(5), allowNull: false },
            explanation_vi: { type: DataTypes.TEXT, allowNull: true },
        },
        { tableName: "questions", timestamps: true }
    );

    // Static methods
    Questions.findById = async (question_id) => Questions.findOne({ where: { question_id } });
    Questions.findAllQuestions = async () => Questions.findAll();
    Questions.findByPart = async (part_id) => Questions.findAll({ where: { part_id } });
    Questions.createQuestions = async (data) => Questions.create(data);
    Questions.updateQuestions = async (question_id, data) =>
    Questions.update(data, { where: { question_id } });

    return Questions;
};

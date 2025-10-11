module.exports = (sequelize, DataTypes) => {
    const Choice = sequelize.define(
        "Choice",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            question_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            choice_letter: {
                type: DataTypes.STRING(1),
                allowNull: false,
                comment: 'A, B, C, D'
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

    Choice.findById = async (id) => 
        Choice.findOne({ where: { id } });

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

    Choice.updateChoice = async (id, data) => 
        Choice.update(data, { where: { id } });

    Choice.deleteChoice = async (id) => 
        Choice.destroy({ where: { id } });

    return Choice;
};

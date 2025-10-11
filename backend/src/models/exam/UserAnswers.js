module.exports = (sequelize, DataTypes) => {
    const UserAnswer = sequelize.define(
        "UserAnswer",
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            session_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            question_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            selected_choice_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            answer_time: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            is_correct: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
        },
        {
            tableName: "user_answers",
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: false,
        }
    );

    UserAnswer.findById = async (id) =>
        UserAnswer.findOne({ where: { id } });

    UserAnswer.findBySessionId = async (session_id) =>
        UserAnswer.findAll({ where: { session_id } });

    UserAnswer.findByQuestionId = async (question_id) =>
        UserAnswer.findAll({ where: { question_id } });

    UserAnswer.findBySessionAndQuestion = async (session_id, question_id) =>
        UserAnswer.findOne({ where: { session_id, question_id } });

    UserAnswer.findAll = async () => UserAnswer.findAll();

    UserAnswer.createAnswer = async (data) => UserAnswer.create(data);

    UserAnswer.updateAnswer = async (id, data) =>
        UserAnswer.update(data, { where: { id } });

    UserAnswer.deleteAnswer = async (id) =>
        UserAnswer.destroy({ where: { id } });

    return UserAnswer;
}

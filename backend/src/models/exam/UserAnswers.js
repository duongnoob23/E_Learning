module.exports = (sequelize, DataTypes) => {
    const UserAnswer = sequelize.define(
        "UserAnswer",
        {
            user_answer_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },
            exam_session_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
            },
            question_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
            },
            selected_choice_id: {
                type: DataTypes.BIGINT.UNSIGNED,
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

    UserAnswer.findById = async (user_answer_id) =>
        UserAnswer.findOne({ where: { user_answer_id } });

    UserAnswer.findBySessionId = async (exam_session_id) =>
        UserAnswer.findAll({ where: { exam_session_id } });

    UserAnswer.findByQuestionId = async (question_id) =>
        UserAnswer.findAll({ where: { question_id } });

    UserAnswer.findBySessionAndQuestion = async (exam_session_id, question_id) =>
        UserAnswer.findOne({ where: { exam_session_id, question_id } });

    UserAnswer.findAll = async () => UserAnswer.findAll();

    UserAnswer.createAnswer = async (data) => UserAnswer.create(data);

    UserAnswer.updateAnswer = async (user_answer_id, data) =>
        UserAnswer.update(data, { where: { user_answer_id } });

    UserAnswer.deleteAnswer = async (user_answer_id) =>
        UserAnswer.destroy({ where: { user_answer_id } });

    UserAnswer.createAnswer = async (data) => UserAnswer.create(data);

    UserAnswer.findBySessionId = async (exam_session_id) =>
        UserAnswer.findAll({ where: { exam_session_id } });

    UserAnswer.findWrongAnswers = async (exam_session_id) =>
        UserAnswer.findAll({
            where: {
                exam_session_id,
                is_correct: false
            }
        });

    return UserAnswer;
}

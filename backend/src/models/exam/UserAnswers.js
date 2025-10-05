module.exports = (sequence, DataTypes) => { 
    const UserAnswers = sequence.define(
        "UserAnswers",
        {
            answer_id:{
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: { type: DataTypes.BIGINT, allowNull: false },
            question_id: { type: DataTypes.BIGINT, allowNull: false },
            user_answer: { type: DataTypes.STRING(5), allowNull: true },
            is_correct: { type: DataTypes.BOOLEAN, allowNull: true },
            answered_at: { type: DataTypes.DATE, allowNull: true },
        },
        {tableName : "user_answers", timestamps: true}
    );
    
    UserAnswers.findById = async (answer_id) => UserAnswers.findOne({where: { answer_id }});
    UserAnswers.findAll = async () => UserAnswers.findAll();
    UserAnswers.create = async (data) => UserAnswers.create(data);
    UserAnswers.updateUserAnswers = async (answer_id, data) => UserAnswers.upadte(data, {where : {answer_id}});
    return UserAnswers;

}

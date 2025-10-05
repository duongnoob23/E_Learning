module.exports = (sequence, DataTypes) => { 
    const Results = sequence.define(
        "Results",
        {
            result_id:{
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: { type: DataTypes.BIGINT, allowNull: false },
            test_id: { type: DataTypes.BIGINT, allowNull: false },
            total_questions: { type: DataTypes.INTEGER, allowNull: false },
            correct_answers: { type: DataTypes.INTEGER, allowNull: false },
            score: { type: DataTypes.INTEGER, allowNull: false },
        },
        {tableName : "results", timestamps: true}
    );

    Results.findById = async (result_id) => Results.findOne({where: { result_id }});
    Results.findAll = async () => Results.findAll();
    Results.findByUserIdTestId = async () => Results.findAll({where: { user_id, test_id }});
    Results.createResults = async (data) => Results.create(data);
    Results.updateResults = async (result_id, data) => Results.upadte(data, {where : {result_id}});
    return Results;

}

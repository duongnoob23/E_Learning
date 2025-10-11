module.exports = (sequelize, DataTypes) => {
    const ExamSession = sequelize.define(
        "ExamSession",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            test_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            session_type: {
                type: DataTypes.STRING(20),
                allowNull: false,
                comment: 'FULL_TEST, PRACTICE, REVIEW'
            },
            start_time: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            end_time: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            duration_seconds: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            total_score: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            correct_answers: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            wrong_answers: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            skipped_answers: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            status: {
                type: DataTypes.STRING(20),
                allowNull: false,
                defaultValue: 'IN_PROGRESS',
                comment: 'IN_PROGRESS, COMPLETED, ABANDONED'
            },
            selected_parts: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            time_limit_minutes: {
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
            tableName: "exam_sessions",
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );

    ExamSession.findById = async (id) => 
        ExamSession.findOne({ where: { id } });

    ExamSession.findByUserId = async (user_id) => 
        ExamSession.findAll({ where: { user_id } });

    ExamSession.findByUserIdAndTestId = async (user_id, test_id) => 
        ExamSession.findAll({ where: { user_id, test_id } });

    ExamSession.findActiveSession = async (user_id, test_id) => 
        ExamSession.findOne({ 
            where: { 
                user_id, 
                test_id, 
                status: 'IN_PROGRESS' 
            } 
        });

    ExamSession.findWithAnswers = async (id) => 
        ExamSession.findOne({
            where: { id },
            include: [
                {
                    model: sequelize.models.UserAnswer,
                    as: "user_answers"
                }
            ]
        });

    ExamSession.findAll = async () => ExamSession.findAll();

    ExamSession.createSession = async (data) => ExamSession.create(data);

    ExamSession.updateSession = async (id, data) => 
        ExamSession.update(data, { where: { id } });

    ExamSession.deleteSession = async (id) => 
        ExamSession.destroy({ where: { id } });

    return ExamSession;
};

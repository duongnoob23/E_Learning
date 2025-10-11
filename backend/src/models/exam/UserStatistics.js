module.exports = (sequelize, DataTypes) => {
    const UserStatistics = sequelize.define(
        "UserStatistics",
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
            total_tests_taken: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            total_questions_answered: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            total_correct_answers: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            average_score: {
                type: DataTypes.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 0.00,
            },
            best_score: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            total_study_time_seconds: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
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
            tableName: "user_statistics",
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );

    UserStatistics.findById = async (id) => 
        UserStatistics.findOne({ where: { id } });

    UserStatistics.findByUserId = async (user_id) => 
        UserStatistics.findOne({ where: { user_id } });

    UserStatistics.findAll = async () => UserStatistics.findAll();

    UserStatistics.createStatistics = async (data) => UserStatistics.create(data);

    UserStatistics.updateStatistics = async (user_id, data) => 
        UserStatistics.update(data, { where: { user_id } });

    UserStatistics.incrementTestsTaken = async (user_id) => {
        const stats = await UserStatistics.findByUserId(user_id);
        if (stats) {
            return UserStatistics.updateStatistics(user_id, {
                total_tests_taken: stats.total_tests_taken + 1
            });
        }
        return UserStatistics.createStatistics({
            user_id,
            total_tests_taken: 1
        });
    };

    UserStatistics.updateScores = async (user_id, score, questionsAnswered, correctAnswers) => {
        const stats = await UserStatistics.findByUserId(user_id);
        if (stats) {
            const newTotalQuestions = stats.total_questions_answered + questionsAnswered;
            const newTotalCorrect = stats.total_correct_answers + correctAnswers;
            const newAverageScore = ((stats.average_score * stats.total_tests_taken) + score) / (stats.total_tests_taken + 1);
            const newBestScore = Math.max(stats.best_score, score);

            return UserStatistics.updateStatistics(user_id, {
                total_questions_answered: newTotalQuestions,
                total_correct_answers: newTotalCorrect,
                average_score: newAverageScore,
                best_score: newBestScore
            });
        }
        return UserStatistics.createStatistics({
            user_id,
            total_questions_answered: questionsAnswered,
            total_correct_answers: correctAnswers,
            average_score: score,
            best_score: score
        });
    };

    return UserStatistics;
};

module.exports = (sequelize, DataTypes) => {
    const PartStatistics = sequelize.define(
        "PartStatistics",
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
            part_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            total_attempts: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            total_questions: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            correct_answers: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            accuracy_rate: {
                type: DataTypes.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 0.00,
            },
            last_attempt: {
                type: DataTypes.DATE,
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
            tableName: "part_statistics",
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );

    PartStatistics.findById = async (id) => 
        PartStatistics.findOne({ where: { id } });

    PartStatistics.findByUserId = async (user_id) => 
        PartStatistics.findAll({ where: { user_id } });

    PartStatistics.findByUserIdAndPartId = async (user_id, part_id) => 
        PartStatistics.findOne({ where: { user_id, part_id } });

    PartStatistics.findAll = async () => PartStatistics.findAll();

    PartStatistics.createStatistics = async (data) => PartStatistics.create(data);

    PartStatistics.updateStatistics = async (user_id, part_id, data) => 
        PartStatistics.update(data, { where: { user_id, part_id } });

    PartStatistics.updatePartPerformance = async (user_id, part_id, questionsAnswered, correctAnswers) => {
        const stats = await PartStatistics.findByUserIdAndPartId(user_id, part_id);
        
        if (stats) {
            const newTotalQuestions = stats.total_questions + questionsAnswered;
            const newCorrectAnswers = stats.correct_answers + correctAnswers;
            const newAccuracyRate = (newCorrectAnswers / newTotalQuestions) * 100;

            return PartStatistics.updateStatistics(user_id, part_id, {
                total_attempts: stats.total_attempts + 1,
                total_questions: newTotalQuestions,
                correct_answers: newCorrectAnswers,
                accuracy_rate: newAccuracyRate,
                last_attempt: new Date()
            });
        } else {
            const accuracyRate = (correctAnswers / questionsAnswered) * 100;
            return PartStatistics.createStatistics({
                user_id,
                part_id,
                total_attempts: 1,
                total_questions: questionsAnswered,
                correct_answers: correctAnswers,
                accuracy_rate: accuracyRate,
                last_attempt: new Date()
            });
        }
    };

    return PartStatistics;
};

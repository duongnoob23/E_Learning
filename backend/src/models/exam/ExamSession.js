module.exports = (sequelize, DataTypes) => {
    const ExamSession = sequelize.define(
        "ExamSession",
        {
            exam_session_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
            },
            test_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
            },
            session_type: {
                type: DataTypes.ENUM('FULL_TEST', 'PRACTICE', 'REVIEW'),
                allowNull: false,
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
                type: DataTypes.ENUM('IN_PROGRESS', 'COMPLETED', 'ABANDONED'),
                allowNull: false,
                defaultValue: 'IN_PROGRESS',
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

    ExamSession.findById = async (exam_session_id) =>
        ExamSession.findOne({ where: { exam_session_id } });

    ExamSession.findByTestId = async (test_id) =>
        ExamSession.findAll({
            where: { test_id },
            include: [
                {
                    model: sequelize.models.User,
                    as: "user",
                    attributes: ['user_id', 'username', 'email']
                }
            ]
        });
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

    ExamSession.findWithAnswers = async (exam_session_id) =>
        ExamSession.findOne({
            where: { exam_session_id },
            include: [
                {
                    model: sequelize.models.UserAnswer,
                    as: "user_answers"
                }
            ],
            include :[
                {    
                    model : sequelize.models.PartStatistics,
                    as : "part_statistics"
                }
            ]
        });

    ExamSession.createSession = async (data) => ExamSession.create(data);

    
    ExamSession.updateSession = async (exam_session_id, data) =>
        ExamSession.update(data, { where: { exam_session_id } });

    ExamSession.deleteSession = async (exam_session_id) =>
        ExamSession.destroy({ where: { exam_session_id } });

    ExamSession.findActiveSession = async (user_id, test_id) =>
        ExamSession.findOne({
            where: {
                user_id,
                test_id,
                status: 'IN_PROGRESS'
            }
        });

    ExamSession.createSession = async (data) => ExamSession.create(data);

    ExamSession.updateSession = async (exam_session_id, data) =>
        ExamSession.update(data, { where: { exam_session_id } });

    ExamSession.findWithAnswers = async (exam_session_id) =>
        ExamSession.findOne({
            where: { exam_session_id },
            include: [
                {
                    model: sequelize.models.UserAnswer,
                    as: "user_answers"
                }
            ]
        });

    ExamSession.findRecentSessions = async (user_id, limit = 10) =>
        ExamSession.findAll({
            where: { user_id },
            limit,
            order: [['created_at', 'DESC']],
            include: [
                {
                    model: sequelize.models.Test,
                    as: "test",
                    attributes: ['test_id', 'title', 'exam_type']
                }
            ]
        });

    /**
     * Tìm tất cả active sessions (IN_PROGRESS) của user trong 24h gần nhất
     * @param {number} user_id - ID của user
     * @returns {Array} Danh sách active sessions
     */
    ExamSession.findAllActiveSessions = async (user_id) => {
        const { Op } = require('sequelize');
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        return ExamSession.findAll({
            where: {
                user_id,
                status: 'IN_PROGRESS',
                start_time: {
                    [Op.gte]: twentyFourHoursAgo
                }
            },
            order: [['start_time', 'DESC']],
            include: [
                {
                    model: sequelize.models.Test,
                    as: "test",
                    attributes: ['test_id', 'title', 'exam_type', 'total_duration']
                }
            ]
        });
    };

    /**
     * Tìm active session của user cho một test cụ thể
     * Trả về session đầu tiên tìm thấy (IN_PROGRESS và chưa có end_time)
     */
    ExamSession.findActiveSessionForTest = async (user_id, test_id) => {
        const { Op } = require('sequelize');
        return ExamSession.findOne({
            where: {
                user_id,
                test_id,
                status: 'IN_PROGRESS',
                end_time: null // Đảm bảo session chưa kết thúc
            },
            include: [
                {
                    model: sequelize.models.Test,
                    as: "test",
                    attributes: ['test_id', 'title', 'exam_type', 'total_duration']
                }
            ]
        });
    };

    return ExamSession;
};

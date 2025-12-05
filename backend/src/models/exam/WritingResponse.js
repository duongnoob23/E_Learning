module.exports = (sequelize, DataTypes) => {
    const WritingResponse = sequelize.define(
        "WritingResponse",
        {
            response_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },
            session_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                comment: 'Exam session ID'
            },
            question_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                comment: 'Writing question ID'
            },
            user_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                comment: 'User who answered'
            },
            written_text: {
                type: DataTypes.TEXT,
                allowNull: false,
                comment: 'User written response'
            },
            word_count: {
                type: DataTypes.INTEGER,
                allowNull: true,
                comment: 'Number of words'
            },
            processing_status: {
                type: DataTypes.ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'),
                allowNull: false,
                defaultValue: 'PENDING',
            },
            score: {
                type: DataTypes.FLOAT,
                allowNull: true,
                comment: 'Overall writing score (0-100)'
            },
            grammar_score: {
                type: DataTypes.FLOAT,
                allowNull: true,
                comment: 'Grammar score (0-100)'
            },
            coherence_score: {
                type: DataTypes.FLOAT,
                allowNull: true,
                comment: 'Coherence/Organization score (0-100)'
            },
            vocabulary_score: {
                type: DataTypes.FLOAT,
                allowNull: true,
                comment: 'Vocabulary score (0-100)'
            },
            task_completion_score: {
                type: DataTypes.FLOAT,
                allowNull: true,
                comment: 'Task completion score (0-100)'
            },
            spelling_score: {
                type: DataTypes.FLOAT,
                allowNull: true,
                comment: 'Spelling score (0-100)'
            },
            feedback: {
                type: DataTypes.TEXT,
                allowNull: true,
                comment: 'AI-generated feedback'
            },
            detailed_feedback: {
                type: DataTypes.JSON,
                allowNull: true,
                comment: 'Detailed feedback for each criterion'
            },
            error_message: {
                type: DataTypes.TEXT,
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
            tableName: "writing_responses",
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );

    WritingResponse.findById = async (response_id) =>
        WritingResponse.findOne({ where: { response_id } });

    WritingResponse.findBySessionId = async (session_id) =>
        WritingResponse.findAll({ where: { session_id } });

    WritingResponse.createResponse = async (data) => 
        WritingResponse.create(data);

    WritingResponse.updateResponse = async (response_id, data) =>
        WritingResponse.update(data, { where: { response_id } });

    return WritingResponse;
};
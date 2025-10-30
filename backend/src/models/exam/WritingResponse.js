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
            },
            coherence_score: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            vocabulary_score: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            feedback: {
                type: DataTypes.TEXT,
                allowNull: true,
                comment: 'AI-generated feedback'
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
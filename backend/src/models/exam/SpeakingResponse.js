module.exports = (sequelize, DataTypes) => {
    const SpeakingResponse = sequelize.define(
        "SpeakingResponse",
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
                comment: 'Speaking question ID'
            },
            user_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                comment: 'User who answered'
            },
            audio_file_path: {
                type: DataTypes.STRING(500),
                allowNull: false,
                comment: 'Path to uploaded audio file'
            },
            transcription: {
                type: DataTypes.TEXT,
                allowNull: true,
                comment: 'Whisper transcription result'
            },
            confidence_score: {
                type: DataTypes.FLOAT,
                allowNull: true,
                comment: 'Whisper confidence score (0-1)'
            },
            duration_seconds: {
                type: DataTypes.FLOAT,
                allowNull: true,
                comment: 'Audio duration in seconds'
            },
            language_detected: {
                type: DataTypes.STRING(10),
                allowNull: true,
                comment: 'Detected language code (en, vi, etc.)'
            },
            processing_status: {
                type: DataTypes.ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'),
                allowNull: false,
                defaultValue: 'PENDING',
                comment: 'Transcription processing status'
            },
            error_message: {
                type: DataTypes.TEXT,
                allowNull: true,
                comment: 'Error message if processing failed'
            },
            score: {
                type: DataTypes.FLOAT,
                allowNull: true,
                comment: 'Overall speaking score (0-100)'
            },
            pronunciation_score: {
                type: DataTypes.FLOAT,
                allowNull: true,
                comment: 'Pronunciation score (0-100)'
            },
            fluency_score: {
                type: DataTypes.FLOAT,
                allowNull: true,
                comment: 'Fluency score (0-100) - from MultiPA'
            },
            prosody_score: {
                type: DataTypes.FLOAT,
                allowNull: true,
                comment: 'Prosody score (0-100) - from MultiPA'
            },
            grammar_score: {
                type: DataTypes.FLOAT,
                allowNull: true,
                comment: 'Grammar score (0-100)'
            },
            vocabulary_score: {
                type: DataTypes.FLOAT,
                allowNull: true,
                comment: 'Vocabulary score (0-100)'
            },
            coherence_score: {
                type: DataTypes.FLOAT,
                allowNull: true,
                comment: 'Coherence/Organization score (0-100)'
            },
            transcript: {
                type: DataTypes.TEXT,
                allowNull: true,
                comment: 'MultiPA transcription result'
            },
            feedback: {
                type: DataTypes.TEXT,
                allowNull: true,
                comment: 'AI-generated feedback on pronunciation, grammar, fluency, etc.'
            },
            detailed_feedback: {
                type: DataTypes.JSON,
                allowNull: true,
                comment: 'Detailed feedback for each criterion'
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
            tableName: "speaking_responses",
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );

    // Static methods
    SpeakingResponse.findById = async (response_id) =>
        SpeakingResponse.findOne({ where: { response_id } });

    SpeakingResponse.findBySessionId = async (session_id) =>
        SpeakingResponse.findAll({ where: { session_id } });

    SpeakingResponse.findByQuestionId = async (question_id) =>
        SpeakingResponse.findAll({ where: { question_id } });

    SpeakingResponse.findByUserId = async (user_id) =>
        SpeakingResponse.findAll({ where: { user_id } });

    SpeakingResponse.createResponse = async (data) => 
        SpeakingResponse.create(data);

    SpeakingResponse.updateResponse = async (response_id, data) =>
        SpeakingResponse.update(data, { where: { response_id } });

    SpeakingResponse.updateTranscription = async (response_id, transcriptionData) =>
        SpeakingResponse.update(transcriptionData, { where: { response_id } });

    return SpeakingResponse;
};

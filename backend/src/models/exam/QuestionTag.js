module.exports = (sequelize, DataTypes) => {
    const QuestionTag = sequelize.define(
        "QuestionTag",
        {
            question_tag_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },
            question_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
            },
            exam_tag_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
        },
        {
            tableName: "question_tags",
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: false,
        }
    );

    QuestionTag.findById = async (question_tag_id) =>
        QuestionTag.findOne({ where: { question_tag_id } });

    QuestionTag.findByQuestionId = async (question_id) =>
        QuestionTag.findAll({ where: { question_id } });

    QuestionTag.findByTagId = async (exam_tag_id) =>
        QuestionTag.findAll({ where: { exam_tag_id } });

    QuestionTag.findByQuestionAndTag = async (question_id, exam_tag_id) =>
        QuestionTag.findOne({ where: { question_id, exam_tag_id } });

    QuestionTag.findAll = async () => QuestionTag.findAll();

    QuestionTag.createRelation = async (data) => QuestionTag.create(data);

    QuestionTag.deleteRelation = async (question_id, exam_tag_id) =>
        QuestionTag.destroy({ where: { question_id, exam_tag_id } });

    QuestionTag.deleteByQuestionId = async (question_id) =>
        QuestionTag.destroy({ where: { question_id } });

    return QuestionTag;
};

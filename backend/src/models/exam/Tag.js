module.exports = (sequelize, DataTypes) => {
    const ExamTag = sequelize.define(
        "ExamTag",
        {
            exam_tag_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            description: {
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
            tableName: "exam_tags",
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );

    ExamTag.findById = async (exam_tag_id) =>
        ExamTag.findOne({ where: { exam_tag_id } });

    ExamTag.findByName = async (name) =>
        ExamTag.findOne({ where: { name } });

    ExamTag.createTag = async (data) => ExamTag.create(data);

    ExamTag.updateTag = async (exam_tag_id, data) =>
        ExamTag.update(data, { where: { exam_tag_id } });

    ExamTag.deleteTag = async (exam_tag_id) =>
        ExamTag.destroy({ where: { exam_tag_id } });

    return ExamTag;
};

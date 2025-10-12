module.exports = (sequelize, DataTypes) => {
    const ExamCategory = sequelize.define(
        "ExamCategory",
        {
            exam_category_id: {
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
            icon: {
                type: DataTypes.STRING(100),
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
            tableName: "exam_categories",
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );

    ExamCategory.findById = async (exam_category_id) =>
        ExamCategory.findOne({ where: { exam_category_id } });

    ExamCategory.findByName = async (name) =>
        ExamCategory.findOne({ where: { name } });

    ExamCategory.createCategory = async (data) => ExamCategory.create(data);

    ExamCategory.updateCategory = async (exam_category_id, data) =>
        ExamCategory.update(data, { where: { exam_category_id } });

    ExamCategory.deleteCategory = async (exam_category_id) =>
        ExamCategory.destroy({ where: { exam_category_id } });

    return ExamCategory;
};

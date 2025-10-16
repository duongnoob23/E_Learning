module.exports = (sequelize, DataTypes) => {
    const TestCategoryRelation = sequelize.define(
        "TestCategoryRelation",
        {
            test_category_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },
            test_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
            },
            exam_category_id: {
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
            tableName: "test_categories",
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: false,
        }
    );

    TestCategoryRelation.findById = async (test_category_id) =>
        TestCategoryRelation.findOne({ where: { test_category_id } });

    TestCategoryRelation.findByTestId = async (test_id) =>
        TestCategoryRelation.findAll({ where: { test_id } });

    TestCategoryRelation.findByCategoryId = async (exam_category_id) =>
        TestCategoryRelation.findAll({ where: { exam_category_id } });

    TestCategoryRelation.findByTestAndCategory = async (test_id, exam_category_id) =>
        TestCategoryRelation.findOne({ where: { test_id, exam_category_id } });

    TestCategoryRelation.createRelation = async (data) => TestCategoryRelation.create(data);

    TestCategoryRelation.deleteRelation = async (test_id, exam_category_id) =>
        TestCategoryRelation.destroy({ where: { test_id, exam_category_id } });

    TestCategoryRelation.deleteByTestId = async (test_id) =>
        TestCategoryRelation.destroy({ where: { test_id } });

    return TestCategoryRelation;
};

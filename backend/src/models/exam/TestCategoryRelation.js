module.exports = (sequelize, DataTypes) => {
    const TestCategoryRelation = sequelize.define(
        "TestCategoryRelation",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            test_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            category_id: {
                type: DataTypes.INTEGER,
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

    TestCategoryRelation.findById = async (id) => 
        TestCategoryRelation.findOne({ where: { id } });

    TestCategoryRelation.findByTestId = async (test_id) => 
        TestCategoryRelation.findAll({ where: { test_id } });

    TestCategoryRelation.findByCategoryId = async (category_id) => 
        TestCategoryRelation.findAll({ where: { category_id } });

    TestCategoryRelation.findByTestAndCategory = async (test_id, category_id) => 
        TestCategoryRelation.findOne({ where: { test_id, category_id } });

    TestCategoryRelation.findAll = async () => TestCategoryRelation.findAll();

    TestCategoryRelation.createRelation = async (data) => TestCategoryRelation.create(data);

    TestCategoryRelation.deleteRelation = async (test_id, category_id) => 
        TestCategoryRelation.destroy({ where: { test_id, category_id } });

    TestCategoryRelation.deleteByTestId = async (test_id) => 
        TestCategoryRelation.destroy({ where: { test_id } });

    return TestCategoryRelation;
};

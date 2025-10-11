module.exports = (sequelize, DataTypes) => {
    const TestCategory = sequelize.define(
        "TestCategory",
        {
            id: {
                type: DataTypes.INTEGER,
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
            tableName: "categories",
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );

    TestCategory.findById = async (id) => 
        TestCategory.findOne({ where: { id } });

    TestCategory.findByName = async (name) => 
        TestCategory.findOne({ where: { name } });

    TestCategory.findAll = async () => TestCategory.findAll();

    TestCategory.createCategory = async (data) => TestCategory.create(data);

    TestCategory.updateCategory = async (id, data) => 
        TestCategory.update(data, { where: { id } });

    TestCategory.deleteCategory = async (id) => 
        TestCategory.destroy({ where: { id } });

    return TestCategory;
};

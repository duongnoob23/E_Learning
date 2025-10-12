module.exports = (sequelize, DataTypes) => {
    const TestDiscussion = sequelize.define(
        "TestDiscussion",
        {
            test_discussion_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },
            test_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
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
            tableName: "test_discussions",
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );

    TestDiscussion.findById = async (test_discussion_id) =>
        TestDiscussion.findOne({ where: { test_discussion_id } });

    TestDiscussion.findByTestId = async (test_id) =>
        TestDiscussion.findAll({ where: { test_id } });

    TestDiscussion.findByUserId = async (user_id) =>
        TestDiscussion.findAll({ where: { user_id } });

    TestDiscussion.findWithComments = async (test_discussion_id) =>
        TestDiscussion.findOne({
            where: { test_discussion_id },
            include: [
                {
                    model: sequelize.models.TestComment,
                    as: "comments"
                }
            ]
        });

    TestDiscussion.findAll = async () => TestDiscussion.findAll();

    TestDiscussion.createDiscussion = async (data) => TestDiscussion.create(data);

    TestDiscussion.updateDiscussion = async (test_discussion_id, data) =>
        TestDiscussion.update(data, { where: { test_discussion_id } });

    TestDiscussion.deleteDiscussion = async (test_discussion_id) =>
        TestDiscussion.destroy({ where: { test_discussion_id } });

    return TestDiscussion;
};

module.exports = (sequelize, DataTypes) => {
    const TestComment = sequelize.define(
        "TestComment",
        {
            test_comment_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },
            test_discussion_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            parent_comment_id: {
                type: DataTypes.BIGINT.UNSIGNED,
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
            tableName: "test_comments",
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );

    TestComment.findById = async (test_comment_id) =>
        TestComment.findOne({ where: { test_comment_id } });

    TestComment.findByDiscussionId = async (test_discussion_id) =>
        TestComment.findAll({ where: { test_discussion_id } });

    TestComment.findByUserId = async (user_id) =>
        TestComment.findAll({ where: { user_id } });

    TestComment.findByParentId = async (parent_comment_id) =>
        TestComment.findAll({ where: { parent_comment_id } });

    TestComment.findWithReplies = async (test_comment_id) =>
        TestComment.findOne({
            where: { test_comment_id },
            include: [
                {
                    model: TestComment,
                    as: "replies",
                    where: { parent_comment_id: test_comment_id },
                    required: false
                }
            ]
        });

    TestComment.createComment = async (data) => TestComment.create(data);

    TestComment.updateComment = async (test_comment_id, data) =>
        TestComment.update(data, { where: { test_comment_id } });

    TestComment.deleteComment = async (test_comment_id) =>
        TestComment.destroy({ where: { test_comment_id } });

    return TestComment;
};

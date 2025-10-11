module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define(
        "Comment",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            discussion_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            parent_comment_id: {
                type: DataTypes.INTEGER,
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
            tableName: "comments",
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );

    Comment.findById = async (id) => 
        Comment.findOne({ where: { id } });

    Comment.findByDiscussionId = async (discussion_id) => 
        Comment.findAll({ where: { discussion_id } });

    Comment.findByUserId = async (user_id) => 
        Comment.findAll({ where: { user_id } });

    Comment.findByParentId = async (parent_comment_id) => 
        Comment.findAll({ where: { parent_comment_id } });

    Comment.findWithReplies = async (id) => 
        Comment.findOne({
            where: { id },
            include: [
                {
                    model: Comment,
                    as: "replies",
                    where: { parent_comment_id: id },
                    required: false
                }
            ]
        });

    Comment.findAll = async () => Comment.findAll();

    Comment.createComment = async (data) => Comment.create(data);

    Comment.updateComment = async (id, data) => 
        Comment.update(data, { where: { id } });

    Comment.deleteComment = async (id) => 
        Comment.destroy({ where: { id } });

    return Comment;
};

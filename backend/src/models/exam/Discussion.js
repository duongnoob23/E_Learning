module.exports = (sequelize, DataTypes) => {
    const Discussion = sequelize.define(
        "Discussion",
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
            user_id: {
                type: DataTypes.INTEGER,
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
            tableName: "discussions",
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );

    Discussion.findById = async (id) => 
        Discussion.findOne({ where: { id } });

    Discussion.findByTestId = async (test_id) => 
        Discussion.findAll({ where: { test_id } });

    Discussion.findByUserId = async (user_id) => 
        Discussion.findAll({ where: { user_id } });

    Discussion.findWithComments = async (id) => 
        Discussion.findOne({
            where: { id },
            include: [
                {
                    model: sequelize.models.Comment,
                    as: "comments"
                }
            ]
        });

    Discussion.findAll = async () => Discussion.findAll();

    Discussion.createDiscussion = async (data) => Discussion.create(data);

    Discussion.updateDiscussion = async (id, data) => 
        Discussion.update(data, { where: { id } });

    Discussion.deleteDiscussion = async (id) => 
        Discussion.destroy({ where: { id } });

    return Discussion;
};

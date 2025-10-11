module.exports = (sequelize, DataTypes) => {
    const Tag = sequelize.define(
        "Tag",
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
            tableName: "tags",
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );

    Tag.findById = async (id) => 
        Tag.findOne({ where: { id } });

    Tag.findByName = async (name) => 
        Tag.findOne({ where: { name } });

    Tag.findAll = async () => Tag.findAll();

    Tag.createTag = async (data) => Tag.create(data);

    Tag.updateTag = async (id, data) => 
        Tag.update(data, { where: { id } });

    Tag.deleteTag = async (id) => 
        Tag.destroy({ where: { id } });

    return Tag;
};

module.exports = (sequelize, DataTypes) => {
	const Tag = sequelize.define(
		"Tag",
		{
			tag_id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			tag_name: {
				type: DataTypes.STRING(100),
				allowNull: false,
				unique: true,
			},
		},
		{
			tableName: "tags",
			timestamps: false,
			indexes: [
				{
					unique: true,
					fields: ["tag_name"],
				},
			],
		}
	);

	return Tag;
};



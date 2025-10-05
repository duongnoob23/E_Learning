module.exports = (sequelize, DataTypes) => {
	const TestTag = sequelize.define(
		"TestTag",
		{
			test_id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				allowNull: false,
				references: {
					model: "tests",
					key: "test_id",
				},
			},
			tag_id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				allowNull: false,
				references: {
					model: "tags",
					key: "tag_id",
				},
			},
		},
		{
			tableName: "test_tags",
			timestamps: false,
			indexes: [{ fields: ["test_id"] }, { fields: ["tag_id"] }],
		}
	);

	return TestTag;
};



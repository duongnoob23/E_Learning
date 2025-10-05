module.exports = (sequelize, DataTypes) => {
	const Test = sequelize.define(
		"Test",
		{
			test_id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			title: {
				type: DataTypes.STRING(255),
				allowNull: false,
			},
			test_type: {
				type: DataTypes.ENUM("IELTS", "TOEIC", "TOEFL", "custom"),
				allowNull: false,
				defaultValue: "custom",
			},
			course_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: "courses",
					key: "course_id",
				},
			},
			duration: {
				type: DataTypes.INTEGER,
				allowNull: false,
				comment: "Duration in minutes",
			},
			created_at: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
		},
		{
			tableName: "tests",
			timestamps: false,
			indexes: [
				{ fields: ["test_type"] },
				{ fields: ["course_id"] },
				{ fields: ["created_at"] },
			],
		}
	);

	return Test;
};



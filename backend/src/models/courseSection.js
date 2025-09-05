module.exports = (sequelize, DataTypes) => {
    const CourseSection = sequelize.define("CourseSection", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        course_id: DataTypes.INTEGER,
        title: DataTypes.STRING,
        description: DataTypes.TEXT,
        order_index: DataTypes.INTEGER,
        is_free: DataTypes.BOOLEAN,
        created_at: DataTypes.DATE
    }, {
        tableName: "course_sections",
        timestamps: false
    });

    return CourseSection;
};

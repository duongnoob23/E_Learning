module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define("Course", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        title: DataTypes.STRING,
        description: DataTypes.TEXT,
        detailed_description: DataTypes.TEXT,
        course_type: DataTypes.STRING,
        pricing_type: DataTypes.STRING,
        price: DataTypes.DECIMAL(10, 2),
        original_price: DataTypes.DECIMAL(10, 2),
        discount_price: DataTypes.DECIMAL(10, 2),
        instructor_id: DataTypes.INTEGER,
        category_id: DataTypes.INTEGER,
        level: DataTypes.STRING,
        duration_hours: DataTypes.INTEGER,
        total_lessons: DataTypes.INTEGER,
        total_exercises: DataTypes.INTEGER,
        max_students: DataTypes.INTEGER,
        current_students: DataTypes.INTEGER,
        status: DataTypes.STRING,
        featured: DataTypes.BOOLEAN,
        certificate_included: DataTypes.BOOLEAN,
        lifetime_access: DataTypes.BOOLEAN,
        requirements: DataTypes.TEXT,
        what_you_learn: DataTypes.TEXT,
        target_audience: DataTypes.TEXT,
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE
    }, {
        tableName: "courses",
        timestamps: false
    });

    Course.findAll = async () => Course.findAll();
    Course.findbyId = async (id) => Course.findOne({ where: { id } });
    Course.findByTitle = async (title) => Course.findOne({ where: { title } });

    return Course;
};

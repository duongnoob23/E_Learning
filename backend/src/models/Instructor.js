module.exports = (sequelize, DataTypes) => {
<<<<<<< HEAD
  const Instructor = sequelize.define("Instructor", {
    instructor_id: { 
      type: DataTypes.BIGINT.UNSIGNED, 
      primaryKey: true,
      autoIncrement: true
    },
    user_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    avatar: { type: DataTypes.STRING(255), allowNull: true },
    bio: { type: DataTypes.TEXT, allowNull: true },
    experience_years: { type: DataTypes.INTEGER, allowNull: true },
    specializations: { type: DataTypes.TEXT, allowNull: true },
    education: { type: DataTypes.TEXT, allowNull: true },
    achievements: { type: DataTypes.TEXT, allowNull: true },
    social_links: { type: DataTypes.JSON, allowNull: true },
    is_featured: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    tableName: "instructors",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
=======
  const Instructor = sequelize.define(
    "Instructor",
    {
      instructor_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: { type: DataTypes.BIGINT, allowNull: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
      avatar: { type: DataTypes.STRING(255), allowNull: true },
      bio: { type: DataTypes.TEXT, allowNull: true },
      experience_years: { type: DataTypes.INTEGER, allowNull: true },
      specializations: { type: DataTypes.TEXT, allowNull: true },
      education: { type: DataTypes.TEXT, allowNull: true },
      achievements: { type: DataTypes.TEXT, allowNull: true },
      social_links: { type: DataTypes.JSON, allowNull: true },
      is_featured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: { type: DataTypes.DATE, allowNull: true },
      updated_at: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "instructors", timestamps: false }
  );
>>>>>>> main
  return Instructor;
};

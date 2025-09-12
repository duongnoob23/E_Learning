module.exports = (sequelize, DataTypes) => {
  const CourseCertificate = sequelize.define(
    "CourseCertificate",
    {
      certificate_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: { type: DataTypes.BIGINT, allowNull: false },
      course_id: { type: DataTypes.BIGINT, allowNull: false },
      enrollment_id: { type: DataTypes.BIGINT, allowNull: false },
      certificate_number: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
      },
      issued_date: { type: DataTypes.DATE, allowNull: true },
      certificate_url: { type: DataTypes.STRING(255), allowNull: true },
      certificate_template: { type: DataTypes.STRING(100), allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "course_certificates", timestamps: false }
  );
  return CourseCertificate;
};

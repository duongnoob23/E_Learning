module.exports = (sequelize, DataTypes) => {
<<<<<<< HEAD
  const CourseEnrollment = sequelize.define("CourseEnrollment", {
    enrollment_id: { 
      type: DataTypes.BIGINT.UNSIGNED, 
      primaryKey: true,
      autoIncrement: true
    },
    user_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    course_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    status: { 
      type: DataTypes.ENUM('active', 'completed', 'cancelled', 'expired'), 
      defaultValue: 'active' 
    },
    enrolled_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    completed_at: { type: DataTypes.DATE, allowNull: true },
    expires_at: { type: DataTypes.DATE, allowNull: true },
    progress_percent: { type: DataTypes.DECIMAL(5,2), defaultValue: 0 },
    last_accessed_lesson_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    last_accessed_at: { type: DataTypes.DATE, allowNull: true },
    payment_amount: { type: DataTypes.DECIMAL(10,2), allowNull: true },
    payment_method: { type: DataTypes.STRING(50), allowNull: true },
    payment_status: { 
      type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'), 
      defaultValue: 'pending' 
    },
    transaction_id: { type: DataTypes.STRING(100), allowNull: true }
  }, {
    tableName: "course_enrollments",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
=======
  const CourseEnrollment = sequelize.define(
    "CourseEnrollment",
    {
      enrollment_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: { type: DataTypes.BIGINT, allowNull: false },
      course_id: { type: DataTypes.BIGINT, allowNull: false },
      status: {
        type: DataTypes.ENUM("active", "completed", "cancelled", "expired"),
        allowNull: false,
        defaultValue: "active",
      },
      enrolled_at: { type: DataTypes.DATE, allowNull: true },
      completed_at: { type: DataTypes.DATE, allowNull: true },
      expires_at: { type: DataTypes.DATE, allowNull: true },
      progress_percent: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
      },
      last_accessed_lesson_id: { type: DataTypes.BIGINT, allowNull: true },
      last_accessed_at: { type: DataTypes.DATE, allowNull: true },
      payment_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
      payment_method: { type: DataTypes.STRING(50), allowNull: true },
      payment_status: {
        type: DataTypes.ENUM("pending", "paid", "failed", "refunded"),
        allowNull: false,
        defaultValue: "pending",
      },
      transaction_id: { type: DataTypes.STRING(100), allowNull: true },
      created_at: { type: DataTypes.DATE },
      updated_at: { type: DataTypes.DATE },
    },
    { tableName: "course_enrollments", timestamps: false }
  );
>>>>>>> main
  return CourseEnrollment;
};

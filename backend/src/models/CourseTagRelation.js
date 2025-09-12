module.exports = (sequelize, DataTypes) => {
  const CourseTagRelation = sequelize.define("CourseTagRelation", {
    course_tag_relation_id: { 
      type: DataTypes.BIGINT.UNSIGNED, 
      primaryKey: true,
      autoIncrement: true
    },
    course_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    tag_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false }
  }, {
    tableName: "course_tag_relations",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });
  return CourseTagRelation;
};

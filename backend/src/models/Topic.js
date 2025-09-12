module.exports = (sequelize, DataTypes) => {
  const Topic = sequelize.define("Topic", {
    topic_id: { 
      type: DataTypes.BIGINT.UNSIGNED, 
      primaryKey: true,
      autoIncrement: true
    },
    topic_name: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT },
    image_url: { type: DataTypes.STRING(255) },
    logo_url: { type: DataTypes.STRING(255) },
    topic_type: { 
      type: DataTypes.ENUM('system', 'user_created'), 
      defaultValue: 'user_created' 
    },
    created_by: { type: DataTypes.BIGINT.UNSIGNED },
    is_public: { type: DataTypes.BOOLEAN, defaultValue: true },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    word_count: { type: DataTypes.INTEGER, defaultValue: 0 }
  }, {
    tableName: "topics",
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Topic;
};  

module.exports = (sequelize, DataTypes) => {
  const Topic = sequelize.define(
    "Topic",
    {
      topic_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      topic_name: { type: DataTypes.STRING(255), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      image_url: { type: DataTypes.STRING(255), allowNull: true },
      logo_url: { type: DataTypes.STRING(255), allowNull: true },
      topic_type: {
        type: DataTypes.ENUM("system", "user_created"),
        allowNull: false,
      },
      created_by: { type: DataTypes.BIGINT, allowNull: true },
      is_public: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      word_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: { type: DataTypes.DATE, allowNull: true },
      updated_at: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "topics", timestamps: false }
  );
  return Topic;
};

// module.exports = (sequelize, DataTypes) => {
//   const Topic = sequelize.define("Topic", {
//     topic_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//     topic_name: { type: DataTypes.STRING, allowNull: true },
//     description: { type: DataTypes.TEXT },
//     image_url: { type: DataTypes.STRING },
//     created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
//     created_by: { type: DataTypes.INTEGER },
//     is_completed: { type: DataTypes.BOOLEAN, defaultValue: false }
//   }, {
//     tableName: "topics",
//     timestamps: false
//   });

//   // Hàm tiện ích
//   Topic.findById = async (topic_id) => Topic.findOne({ where: { topic_id } });
//   Topic.findByName = async (topic_name) => Topic.findOne({ where: { topic_name } });
//   Topic.createTopic = async (data) => Topic.create(data);
//   Topic.updateTopic = async (topic_id, data) => Topic.update(data, { where: { topic_id } });
//   Topic.deleteTopic = async (topic_id) => Topic.destroy({ where: { topic_id } });
//   Topic.getAll = async () => Topic.findAll();
//   Topic.countTopics = async () => Topic.count();
//   Topic.findByCreator = async (created_by) => Topic.findAll({ where: { created_by } });

//   return Topic;
// };

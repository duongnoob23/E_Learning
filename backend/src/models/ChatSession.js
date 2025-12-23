module.exports = (sequelize, DataTypes) => {
  const ChatSession = sequelize.define(
    "ChatSession",
    {
      session_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: true, // null nếu là guest
      },
      session_token: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
      status: {
        type: DataTypes.ENUM("active", "closed", "waiting"),
        allowNull: false,
        defaultValue: "active",
      },
      agent_id: {
        type: DataTypes.BIGINT,
        allowNull: true, // ID của admin/agent đang xử lý (nếu có)
      },
      context: {
        type: DataTypes.JSON,
        allowNull: true, // Lưu context: course_id, page_url, etc.
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "chat_sessions",
      timestamps: true,
      underscored: true,
    }
  );

  ChatSession.findById = async (session_id) =>
    ChatSession.findOne({ where: { session_id } });

  ChatSession.findByToken = async (token) =>
    ChatSession.findOne({ where: { session_token: token } });

  ChatSession.findByUserId = async (user_id) =>
    ChatSession.findAll({
      where: { user_id },
      order: [["created_at", "DESC"]],
    });

  ChatSession.createSession = async (data) => ChatSession.create(data);

  ChatSession.updateSession = async (session_id, data) =>
    ChatSession.update(data, { where: { session_id } });

  ChatSession.associate = function (models) {
    ChatSession.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
    ChatSession.hasMany(models.ChatMessage, {
      foreignKey: "session_id",
      as: "messages",
    });
  };

  return ChatSession;
};
























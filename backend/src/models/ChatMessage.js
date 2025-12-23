module.exports = (sequelize, DataTypes) => {
  const ChatMessage = sequelize.define(
    "ChatMessage",
    {
      message_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      session_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      sender_type: {
        type: DataTypes.ENUM("user", "bot", "agent"),
        allowNull: false,
        defaultValue: "user",
      },
      sender_id: {
        type: DataTypes.BIGINT,
        allowNull: true, // user_id nếu sender_type = "user" hoặc "agent"
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      message_type: {
        type: DataTypes.ENUM("text", "image", "file", "quick_reply", "card"),
        allowNull: false,
        defaultValue: "text",
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true, // Lưu thêm: buttons, attachments, etc.
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "chat_messages",
      timestamps: true,
      underscored: true,
      updatedAt: false, // Chỉ có created_at
    }
  );

  ChatMessage.findById = async (message_id) =>
    ChatMessage.findOne({ where: { message_id } });

  ChatMessage.findBySession = async (session_id, limit = 50) =>
    ChatMessage.findAll({
      where: { session_id },
      order: [["created_at", "ASC"]],
      limit,
    });

  ChatMessage.createMessage = async (data) => ChatMessage.create(data);

  ChatMessage.markAsRead = async (session_id, sender_type = "user") =>
    ChatMessage.update(
      { is_read: true },
      {
        where: {
          session_id,
          sender_type: { [require("sequelize").Op.ne]: sender_type },
        },
      }
    );

  ChatMessage.associate = function (models) {
    ChatMessage.belongsTo(models.ChatSession, {
      foreignKey: "session_id",
      as: "session",
    });
    ChatMessage.belongsTo(models.User, {
      foreignKey: "sender_id",
      as: "sender",
    });
  };

  return ChatMessage;
};
























import { useState, useEffect, useRef } from "react";
import { useChatbotSession, useChatbotMessages, useChatbotSocket } from "../../services/Chatbot/useChatbot";
import "./ChatbotWidget.css";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [sessionToken, setSessionToken] = useState(() => {
    // Lấy token từ localStorage hoặc tạo mới
    let token = localStorage.getItem("chatbot_session_token");
    if (!token) {
      token = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("chatbot_session_token", token);
    }
    return token;
  });

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Lấy hoặc tạo session
  const { data: session, isLoading: sessionLoading } = useChatbotSession(sessionToken);

  // Lấy lịch sử tin nhắn
  const { data: messages = [], isLoading: messagesLoading } = useChatbotMessages(
    session?.session_id,
    !!session?.session_id
  );

  // Socket.IO cho real-time
  const { sendMessage, sendQuickReply } = useChatbotSocket(
    session?.session_id,
    open && !!session?.session_id
  );

  // Auto scroll to bottom khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input khi mở widget
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !session?.session_id) return;

    // Gửi qua Socket.IO
    sendMessage(inputValue.trim(), {
      page_url: window.location.href,
    });

    setInputValue("");
  };

  const handleQuickReply = (payload) => {
    if (!session?.session_id) return;
    sendQuickReply(payload);
  };

  const renderMessage = (message) => {
    const isUser = message.sender_type === "user";
    const isBot = message.sender_type === "bot";

    return (
      <div
        key={message.message_id}
        className={`chatbot-message ${isUser ? "chatbot-message--user" : "chatbot-message--bot"}`}
      >
        <div className="chatbot-message-content">
          {message.content.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}

          {/* Quick replies */}
          {isBot && message.metadata?.quick_replies && (
            <div className="chatbot-quick-replies">
              {message.metadata.quick_replies.map((reply, i) => (
                <button
                  key={i}
                  className="chatbot-quick-reply-btn"
                  onClick={() => handleQuickReply(reply.payload)}
                >
                  {reply.title}
                </button>
              ))}
            </div>
          )}

          {/* Buttons */}
          {isBot && message.metadata?.buttons && (
            <div className="chatbot-buttons">
              {message.metadata.buttons.map((btn, i) => (
                <a
                  key={i}
                  href={btn.url}
                  className="chatbot-button"
                  target={btn.url.startsWith("http") ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                >
                  {btn.title}
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="chatbot-message-time">
          {new Date(message.created_at).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className="chatbot-floating-btn"
        onClick={() => setOpen(true)}
        title="Mở chat tư vấn"
        aria-label="Mở chat tư vấn"
      >
        💬
        {!sessionLoading && session && (
          <span className="chatbot-badge">1</span>
        )}
      </button>

      {/* Chat Widget */}
      <div className={`chatbot-widget ${open ? "chatbot-widget--open" : ""}`}>
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <h3 className="chatbot-title">💬 Tư vấn trực tuyến</h3>
            <p className="chatbot-subtitle">Chúng tôi sẵn sàng hỗ trợ bạn!</p>
          </div>
          <button
            className="chatbot-close-btn"
            onClick={() => setOpen(false)}
            aria-label="Đóng chat"
          >
            ✕
          </button>
        </div>

        <div className="chatbot-body">
          {messagesLoading ? (
            <div className="chatbot-loading">Đang tải tin nhắn...</div>
          ) : messages.length === 0 ? (
            <div className="chatbot-empty">
              <p>👋 Xin chào! Tôi có thể giúp gì cho bạn?</p>
            </div>
          ) : (
            <div className="chatbot-messages">
              {messages.map(renderMessage)}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <form className="chatbot-input-form" onSubmit={handleSendMessage}>
          <input
            ref={inputRef}
            type="text"
            className="chatbot-input"
            placeholder="Nhập tin nhắn của bạn..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={!session?.session_id}
          />
          <button
            type="submit"
            className="chatbot-send-btn"
            disabled={!inputValue.trim() || !session?.session_id}
          >
            ➤
          </button>
        </form>
      </div>
    </>
  );
}
























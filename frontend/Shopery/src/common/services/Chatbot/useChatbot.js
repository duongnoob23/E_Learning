import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../lib/queryKeys";
import { chatbotApi } from "./chatbot.service";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

/**
 * Hook để quản lý chatbot session
 */
export const useChatbotSession = (session_token = null) => {
  return useQuery({
    queryKey: queryKeys.chatbot.session(session_token),
    queryFn: () => chatbotApi.getOrCreateSession(session_token),
    staleTime: 1000 * 60 * 5, // 5 phút
    gcTime: 1000 * 60 * 30, // 30 phút
  });
};

/**
 * Hook để lấy lịch sử tin nhắn
 */
export const useChatbotMessages = (session_id, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.chatbot.messages(session_id),
    queryFn: () => chatbotApi.getMessages(session_id),
    enabled: enabled && !!session_id,
    staleTime: 1000 * 30, // 30 giây
  });
};

/**
 * Hook để gửi tin nhắn
 */
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ session_id, content, context }) =>
      chatbotApi.sendMessage(session_id, content, context),
    onSuccess: (data, variables) => {
      // Invalidate messages để refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.chatbot.messages(variables.session_id),
      });
    },
  });
};

/**
 * Hook để xử lý quick reply
 */
export const useQuickReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ session_id, payload }) =>
      chatbotApi.handleQuickReply(session_id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.chatbot.messages(variables.session_id),
      });
    },
  });
};

/**
 * Hook để sử dụng Socket.IO cho real-time chat
 */
export const useChatbotSocket = (session_id, enabled = true) => {
  const socketRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled || !session_id) return;

    // Kết nối Socket.IO
    const token = localStorage.getItem("token");
    socketRef.current = io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
      auth: {
        token: token || undefined,
      },
    });

    const socket = socketRef.current;

    // Join session room
    socket.emit("join_chat_session", session_id);

    // Lắng nghe lịch sử tin nhắn
    socket.on("chat_history", (data) => {
      queryClient.setQueryData(queryKeys.chatbot.messages(session_id), data.messages);
    });

    // Lắng nghe tin nhắn mới
    socket.on("new_message", (data) => {
      queryClient.setQueryData(queryKeys.chatbot.messages(session_id), (old) => {
        const newMessages = [...(old || [])];
        if (data.user_message) newMessages.push(data.user_message);
        if (data.bot_message) newMessages.push(data.bot_message);
        return newMessages;
      });
    });

    // Lắng nghe lỗi
    socket.on("chat_error", (data) => {
      console.error("Chatbot error:", data.message);
    });

    // Lắng nghe typing indicator
    socket.on("user_typing", (data) => {
      // Có thể emit event để UI hiển thị "đang gõ..."
    });

    return () => {
      socket.emit("leave_chat_session", session_id);
      socket.disconnect();
    };
  }, [session_id, enabled, queryClient]);

  return {
    socket: socketRef.current,
    sendMessage: (content, context) => {
      if (socketRef.current) {
        socketRef.current.emit("send_message", {
          session_id,
          content,
          context,
        });
      }
    },
    sendQuickReply: (payload) => {
      if (socketRef.current) {
        socketRef.current.emit("quick_reply", {
          session_id,
          payload,
        });
      }
    },
    sendTyping: (is_typing) => {
      if (socketRef.current) {
        socketRef.current.emit("typing", {
          session_id,
          is_typing,
        });
      }
    },
  };
};
























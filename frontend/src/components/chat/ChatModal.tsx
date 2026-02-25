"use client";

import React, { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CHAT, GET_CHAT_HISTORY } from "@/graphql/queries";
import { SEND_MESSAGE, MARK_CHAT_AS_READ } from "@/graphql/mutations";
import { FiX, FiSend } from "react-icons/fi";
import toast from "react-hot-toast";
import { useChatSocket } from "@/hooks/useChatSocket";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitorId: string;
  offeringId: string;
  vendorName: string;
  offeringName: string;
}

const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  visitorId,
  offeringId,
  vendorName,
  offeringName,
}) => {
  const [message, setMessage] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // WebSocket for real-time messages
  const { connected, sendMessage: sendSocketMessage, joinChat, leaveChat, onNewMessage } = 
    useChatSocket(visitorId, 'visitor');

  // GraphQL mutation to mark as read directly (no WebSocket needed)
  const [markChatAsRead] = useMutation(MARK_CHAT_AS_READ);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setChatId(null);
      setMessages([]);
      if (chatId) leaveChat(chatId);
    }
  }, [isOpen]);

  // Get or create chat
  const { data: chatData, loading: chatLoading } = useQuery(GET_CHAT, {
    variables: { visitorId, offeringId },
    skip: !isOpen,
    fetchPolicy: "network-only", // Always fetch fresh, never use cache
    onCompleted: (data) => {
      if (data?.getChat?.chatId) {
        setChatId(data.getChat.chatId);
        setMessages(data.getChat.messages || []);
        joinChat(data.getChat.chatId);
      }
    },
  });

  // Get chat history
  const {
    loading: historyLoading,
    refetch: refetchHistory,
  } = useQuery(GET_CHAT_HISTORY, {
    variables: { chatId: chatId || "" },
    skip: !chatId,
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      if (data?.getChatHistory?.messages) {
        setMessages(data.getChatHistory.messages);
      }
    },
  });

  // Mark as read via GraphQL whenever chatId becomes available while modal is open
  // chatId starts as null and gets set after GET_CHAT completes, so watch chatId directly
  useEffect(() => {
    if (!chatId || !isOpen) return;
    console.log('ChatModal: chatId is ready, marking as read. chatId:', chatId, 'visitorId:', visitorId);
    markChatAsRead({
      variables: { chatId, userId: visitorId, userType: 'visitor' }
    }).then((res) => {
      console.log('ChatModal: markChatAsRead success, result:', res.data);
    }).catch((err) => {
      console.error('ChatModal: markChatAsRead error:', err.message);
    });
  }, [chatId]); // Only chatId as dep - fires once when chatId is set

  // Listen for new messages via WebSocket
  useEffect(() => {
    if (!chatId || !connected) return;

    const unsubscribe = onNewMessage?.((data: any) => {
      if (data.chatId === chatId) {
        setMessages(data.chat.messages || []);
        // Mark as read immediately when new message arrives while modal is open
        if (isOpen) {
          markChatAsRead({
            variables: { chatId, userId: visitorId, userType: 'visitor' }
          }).catch(console.error);
        }
      }
    });

    return () => { unsubscribe?.(); };
  }, [chatId, connected, isOpen, onNewMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !chatId) return;

    const messageContent = message.trim();
    setMessage(""); // Clear input immediately

    try {
      // Send via WebSocket for real-time update
      if (connected) {
        await sendSocketMessage({
          chatId,
          content: messageContent,
          senderId: visitorId,
          senderType: 'visitor',
        });
      } else {
        // Fallback to HTTP if WebSocket not connected
        toast.error("Connection lost. Please refresh the page.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
      setMessage(messageContent); // Restore message on error
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-orange text-white p-4 rounded-t-lg flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">{vendorName}</h2>
            <p className="text-sm opacity-90">{offeringName}</p>
            {connected && (
              <p className="text-xs opacity-75 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Connected
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <FiX className="text-2xl" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {chatLoading || historyLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <p className="text-lg font-semibold mb-2">Start a conversation</p>
                <p className="text-sm">Send a message to {vendorName}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg: any, index: number) => {
                const isVisitor = msg.senderType === "visitor" || msg.senderId === visitorId;
                return (
                  <div
                    key={msg.id || index}
                    className={`flex ${isVisitor ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        isVisitor
                          ? "bg-orange text-white"
                          : "bg-white text-gray-800 border border-gray-200"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isVisitor ? "text-white/80" : "text-gray-500"
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent"
              disabled={!connected || !chatId}
            />
            <button
              onClick={handleSendMessage}
              disabled={!connected || !message.trim() || !chatId}
              className="bg-orange text-white px-6 py-2 rounded-lg hover:bg-orange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FiSend />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;

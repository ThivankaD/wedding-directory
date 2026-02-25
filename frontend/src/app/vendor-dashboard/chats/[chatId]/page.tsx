"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { GET_VENDOR_CHAT, GET_CHAT_VISITOR_DETAILS } from "@/graphql/queries";
import { MARK_CHAT_AS_READ } from "@/graphql/mutations";
import MessageList from "../../../../components/chat/MessageList";
import MessageInput from "../../../../components/chat/MessageInput";
import ChatHeader from "../../../../components/chat/chatHeader";
import { IoArrowBack } from "react-icons/io5";
import Link from "next/link";
import { useVendorAuth } from "@/contexts/VendorAuthContext";
import { useChatSocket } from "@/hooks/useChatSocket";

export default function ChatPage() {
  const { chatId } = useParams();
  const chatIdStr = chatId as string;
  const { vendor } = useVendorAuth();
  const [messages, setMessages] = useState<any[]>([]);

  const { connected, joinChat, onNewMessage } = useChatSocket(vendor?.id, 'vendor');
  const [markChatAsRead] = useMutation(MARK_CHAT_AS_READ);

  const {
    data: chatData,
    loading: chatLoading,
    error: chatError,
  } = useQuery(GET_VENDOR_CHAT, {
    variables: { chatId: chatIdStr },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (data?.getChatHistory?.messages) {
        setMessages(data.getChatHistory.messages);
      }
    }
  });

  // Join chat room once socket is connected
  useEffect(() => {
    if (chatIdStr && connected) {
      joinChat(chatIdStr);
    }
  }, [chatIdStr, connected]);

  const { data: visitorData, loading: visitorLoading } = useQuery(
    GET_CHAT_VISITOR_DETAILS,
    {
      variables: { id: chatData?.getChatHistory?.visitorId },
      skip: !chatData?.getChatHistory?.visitorId,
    }
  );

  // Mark as read as soon as chatId and vendor.id are both available
  useEffect(() => {
    if (!chatIdStr || !vendor?.id) return;
    console.log('ChatPage: marking as read for vendor', vendor.id, 'chatId', chatIdStr);
    markChatAsRead({
      variables: { chatId: chatIdStr, userId: vendor.id, userType: 'vendor' }
    }).then(() => console.log('ChatPage: marked as read successfully'))
      .catch((err) => console.error('ChatPage: markChatAsRead error:', err.message));
  }, [chatIdStr, vendor?.id]);

  // Listen for real-time messages and mark as read when they arrive
  useEffect(() => {
    if (!chatIdStr || !connected) return;

    const unsubscribe = onNewMessage?.((data: any) => {
      if (data.chatId === chatIdStr) {
        setMessages(data.chat.messages || []);
        if (vendor?.id) {
          markChatAsRead({
            variables: { chatId: chatIdStr, userId: vendor.id, userType: 'vendor' }
          }).catch(console.error);
        }
      }
    });

    return () => { unsubscribe?.(); };
  }, [chatIdStr, connected, onNewMessage, vendor?.id]);

  if (chatLoading || visitorLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
      </div>
    );

  if (chatError)
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg">
        Error loading chat: {chatError.message}
      </div>
    );

  const visitor = visitorData?.findVisitorById;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-white px-6 py-4 shadow-sm">
        <Link
          href="/vendor-dashboard/chats"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-accent transition-colors mb-2"
        >
          <IoArrowBack className="text-lg" />
          <span className="font-body">Back to Conversations</span>
        </Link>
      </div>
      {visitor && <ChatHeader visitor={visitor} />}
      <MessageList messages={messages} />
      <MessageInput chatId={chatIdStr} onMessageSent={setMessages} />
    </div>
  );
}

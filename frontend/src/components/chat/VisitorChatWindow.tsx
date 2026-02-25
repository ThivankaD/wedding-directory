import { useQuery, useMutation } from "@apollo/client";
import { GET_CHAT_HISTORY } from "@/graphql/queries";
import { SEND_MESSAGE, MARK_CHAT_AS_READ } from "@/graphql/mutations";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/VisitorAuthContext";
import { IoSend } from "react-icons/io5";
import { FaStore, FaUserCircle } from "react-icons/fa";
import { useChatSocket } from "@/hooks/useChatSocket";

interface Message {
  content: string;
  senderId: string;
  senderType: string;
  timestamp: string;
}

interface VisitorChatWindowProps {
  chatId: string;
}

const VisitorChatWindow = ({ chatId }: VisitorChatWindowProps) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { visitor } = useAuth();

  const { connected, sendMessage: sendSocketMessage, joinChat, onNewMessage } =
    useChatSocket(visitor?.id, 'visitor');

  const [markChatAsRead] = useMutation(MARK_CHAT_AS_READ);

  const { data, loading } = useQuery(GET_CHAT_HISTORY, {
    variables: { chatId },
    skip: !chatId,
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      if (data?.getChatHistory?.messages) {
        setMessages(data.getChatHistory.messages);
      }
    }
  });

  // Join chat room via WebSocket when connected
  useEffect(() => {
    if (chatId && connected) {
      joinChat(chatId);
    }
  }, [chatId, connected]);

  // Mark as read as soon as we have chatId and visitorId
  useEffect(() => {
    if (!chatId || !visitor?.id) return;
    markChatAsRead({
      variables: { chatId, userId: visitor.id, userType: 'visitor' }
    }).catch(console.error);
  }, [chatId, visitor?.id]);

  // Listen for real-time messages via WebSocket
  useEffect(() => {
    if (!chatId || !connected) return;

    const unsubscribe = onNewMessage?.((data: any) => {
      if (data.chatId === chatId) {
        // Server always sends the authoritative full message list - use it directly
        setMessages(data.chat.messages || []);
        // User is actively viewing this chat, mark as read immediately
        if (visitor?.id) {
          markChatAsRead({
            variables: { chatId, userId: visitor.id, userType: 'visitor' }
          }).catch(console.error);
        }
      }
    });

    return () => { unsubscribe?.(); };
  }, [chatId, connected, onNewMessage, visitor?.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !visitor?.id) return;

    const optimisticMsg: Message = {
      content: message,
      senderId: visitor.id,
      senderType: 'visitor',
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    setMessage("");

    try {
      await sendSocketMessage({
        chatId,
        content: optimisticMsg.content,
        senderId: visitor.id,
        senderType: 'visitor',
      });
    } catch (error) {
      console.error("Error sending message:", error);
      // Rollback optimistic message on failure
      setMessages((prev) => prev.filter((m) => m !== optimisticMsg));
    }
  };

  if (loading && messages.length === 0) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

   return (
     <div className="flex flex-col h-[600px]">
       <div className="flex-1 overflow-y-auto p-6 space-y-4">
         {messages.map((message: Message, index: number) => (
           <div
             key={index}
             className={`flex items-end gap-2 ${
               message.senderType === "visitor"
                 ? "flex-row-reverse"
                 : "flex-row"
             }`}
           >
             <div className="w-8 h-8 flex items-center justify-center bg-accent/10 rounded-full">
               {message.senderType === "visitor" ? (
                 <FaUserCircle className="text-lg text-accent" />
               ) : (
                 <FaStore className="text-lg text-accent" />
               )}
             </div>
             <div
               className={`max-w-[70%] ${
                 message.senderType === "visitor" ? "items-end" : "items-start"
               }`}
             >
               <div
                 className={`px-4 py-3 rounded-2xl ${
                   message.senderType === "visitor"
                     ? "bg-accent text-white rounded-br-none"
                     : "bg-gray-100 text-gray-900 rounded-bl-none"
                 }`}
               >
                 <p className="leading-relaxed font-body">{message.content}</p>
                 <span
                   className={`text-[10px] mt-1 block font-body group-hover:opacity-100 transition-opacity ${
                     message.senderType === "visitor"
                       ? "text-white/70"
                       : "text-gray-500"
                   }`}
                 >
                   {formatDistanceToNow(new Date(message.timestamp), {
                     addSuffix: true,
                   })}
                 </span>
               </div>
             </div>
           </div>
         ))}
         <div ref={messagesEndRef} />
       </div>

       <div className="border-t p-4 bg-white font-body">
         <form onSubmit={handleSendMessage} className="flex gap-2">
           <input
             type="text"
             value={message}
             onChange={(e) => setMessage(e.target.value)}
             placeholder="Type your message..."
             className="flex-1 font-body px-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
           />
           <button
             type="submit"
             disabled={!message.trim()}
             className="p-2 rounded-full bg-accent text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/90 transition-colors"
           >
             <IoSend className="text-lg" size={23} />
           </button>
         </form>
       </div>
     </div>
   );
};

export default VisitorChatWindow;
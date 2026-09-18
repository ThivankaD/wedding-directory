"use client";

import { useParams } from "next/navigation";
import VisitorChatList from "@/components/chat/VisitorChatList";
import Breadcrumbs from "@/components/Breadcrumbs";
import { FiMessageSquare } from "react-icons/fi";

const ChatPage = () => {
  const { visitorId } = useParams() as { visitorId: string };

  return (
    <div className="w-full space-y-6">
      {/* Hero Card */}
      <div className="bg-white rounded-3xl border-2 border-orange/20 shadow-sm p-6 sm:p-8">
        <div className="space-y-3">
          <Breadcrumbs
            items={[
              { label: "Dashboard", href: "/visitor-dashboard" },
              { label: "Chats", href: `/visitor-dashboard/chats/${visitorId}` },
            ]}
          />
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-orange/10 flex items-center justify-center text-orange shrink-0">
              <FiMessageSquare size={24} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-title text-gray-900">
                My Conversations
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-body">
                Connect directly with wedding vendors in real-time, get quotes, and manage bookings.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Conversations Card */}
      <div className="bg-white rounded-3xl border-2 border-orange/20 shadow-sm overflow-hidden">
        <VisitorChatList visitorId={visitorId} />
      </div>
    </div>
  );
};

export default ChatPage;

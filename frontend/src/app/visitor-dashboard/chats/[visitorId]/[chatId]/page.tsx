"use client";

import { useParams } from "next/navigation";
import VisitorChatWindow from "@/components/chat/VisitorChatWindow";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

const ChatDetailPage = () => {
  const { chatId, visitorId } = useParams() as {
    chatId: string;
    visitorId: string;
  };

  return (
    <div className="w-full space-y-4">
      {/* Back to Conversations Button */}
      <div className="flex items-center justify-between">
        <Link
          href={`/visitor-dashboard/chats/${visitorId}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-darkSurface text-gray-700 dark:text-zinc-300 hover:text-orange dark:hover:text-orange hover:border-orange/40 text-sm font-semibold rounded-2xl border-2 border-orange/15 dark:border-zinc-800 shadow-xs transition-all"
        >
          <FiArrowLeft className="text-base text-orange" />
          <span>Back to Conversations</span>
        </Link>
      </div>

      {/* Themed Chat Container */}
      <div className="bg-white dark:bg-darkSurface rounded-3xl border-2 border-orange/20 dark:border-zinc-800 shadow-sm overflow-hidden">
        <VisitorChatWindow chatId={chatId} />
      </div>
    </div>
  );
};

export default ChatDetailPage;

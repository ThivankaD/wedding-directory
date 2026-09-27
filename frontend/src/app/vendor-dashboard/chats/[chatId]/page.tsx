"use client";

import { useParams } from "next/navigation";
import VendorChatWindow from "@/components/chat/VendorChatWindow";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function ChatDetailPage() {
  const { chatId } = useParams() as { chatId: string };

  return (
    <div className="w-full space-y-4">
      {/* Back to Conversations Button */}
      <div className="flex items-center justify-between">
        <Link
          href="/vendor-dashboard/chats"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-darkSurface hover:bg-gray-50 dark:hover:bg-darkElevated text-gray-700 dark:text-zinc-300 hover:text-orange dark:hover:text-orange text-sm font-medium rounded-xl border border-gray-200 dark:border-zinc-700 shadow-xs transition-all"
        >
          <FiArrowLeft className="text-base text-orange" />
          <span>Back to Conversations</span>
        </Link>
      </div>

      {/* Themed Chat Container */}
      <div className="bg-white dark:bg-darkSurface rounded-3xl border-2 border-orange/20 dark:border-zinc-800 shadow-sm overflow-hidden">
        <VendorChatWindow chatId={chatId} />
      </div>
    </div>
  );
}

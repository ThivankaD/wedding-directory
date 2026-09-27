"use client";

import { useQuery } from "@apollo/client";
import { GET_VENDOR_MESSAGES } from "@/graphql/queries";
import ChatList from "@/components/chat/VendorChatList";
import { useVendorAuth } from "@/contexts/VendorAuthContext";
import { ChatListSkeleton } from "@/components/ui/shimmer";
import Link from "next/link";
import VendorPageHeader from "@/components/vendor-dashboard/VendorPageHeader";
import { FiPackage } from "react-icons/fi";

export default function ChatsPage() {
  const { vendor } = useVendorAuth();

  const { loading, error, data } = useQuery(GET_VENDOR_MESSAGES, {
    variables: { vendorId: vendor?.id },
    skip: !vendor?.id,
    pollInterval: 5000,
  });

  const chats = data?.getVendorChats || [];

  return (
    <div className="w-full">
      {/* Page Header */}
      <VendorPageHeader
        title="My Conversations"
        subtitle="Reply to couples inquiring about your wedding services, send quotes, and discuss bookings in real-time."
        badge={
          chats.length > 0 ? (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange/10 text-orange border border-orange/20">
              {chats.length} {chats.length === 1 ? "Inquiry" : "Inquiries"}
            </span>
          ) : null
        }
        actions={
          <Link
            href="/vendor-dashboard/services"
            className="inline-flex items-center gap-2 bg-white dark:bg-darkSurface hover:bg-gray-50 dark:hover:bg-darkElevated text-gray-700 dark:text-zinc-300 font-medium px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 transition-all text-sm shadow-xs self-start sm:self-auto shrink-0"
          >
            <FiPackage size={15} className="text-orange" />
            <span>My Services</span>
          </Link>
        }
        className="mb-8"
      />

      {/* Loading & Error States or Conversations List */}
      {loading ? (
        <ChatListSkeleton count={5} />
      ) : error ? (
        <div className="p-6 text-red-700 dark:text-red-300 rounded-3xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 font-body">
          <p className="font-semibold text-sm">Error loading conversations</p>
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error.message}</p>
        </div>
      ) : (
        <ChatList chats={data?.getVendorChats || []} />
      )}
    </div>
  );
}

'use client';

import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { GET_OFFERING_DETAILS, GET_VISITOR_CHATS } from "@/graphql/queries";
import { MARK_CHAT_AS_READ } from "@/graphql/mutations";
import { IoLocationSharp } from "react-icons/io5";
import { FiMessageSquare, FiSearch, FiChevronRight, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { useAuth } from "@/contexts/VisitorAuthContext";
import LoaderHelix from "@/components/shared/Loaders/LoaderHelix";

interface Message {
  content: string;
  senderId?: string;
  senderType?: string;
  timestamp: string;
}

interface Chat {
  chatId: string;
  offeringId: string;
  vendorId: string;
  messages: Message[];
}

interface VisitorChatListProps {
  visitorId: string;
}

const ChatItem = ({
  chat,
  visitorId,
  searchQuery,
}: {
  chat: Chat;
  visitorId: string;
  searchQuery: string;
}) => {
  const { visitor } = useAuth();
  const [markChatAsRead] = useMutation(MARK_CHAT_AS_READ);

  const { data: offeringData } = useQuery(GET_OFFERING_DETAILS, {
    variables: { id: chat.offeringId },
    skip: !chat.offeringId,
  });

  const lastMessage = chat.messages[chat.messages.length - 1];
  const offering = offeringData?.findOfferingById;
  const vendor = offering?.vendor;

  const isPaymentNote =
    lastMessage?.content?.includes("Payment Note") ||
    lastMessage?.content?.startsWith("📦");

  const previewText = isPaymentNote
    ? "📦 Advance Booking Payment Confirmed"
    : lastMessage?.content || "No messages yet";

  // Search filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    const matchesName = (offering?.name || "").toLowerCase().includes(q);
    const matchesVendor = (vendor?.busname || "").toLowerCase().includes(q);
    const matchesMessage = (lastMessage?.content || "").toLowerCase().includes(q);
    if (!matchesName && !matchesVendor && !matchesMessage) {
      return null;
    }
  }

  return (
    <Link
      href={`/visitor-dashboard/chats/${visitorId}/${chat.chatId}`}
      className="flex items-center px-5 sm:px-6 py-4 sm:py-4.5 border-l-4 border-transparent hover:border-orange hover:bg-orange/[0.02] transition-all group border-b border-orange/10 last:border-b-0 gap-3.5 sm:gap-4"
      onClick={() => {
        if (visitor?.id) {
          markChatAsRead({
            variables: { chatId: chat.chatId, userId: visitor.id, userType: "visitor" },
          }).catch(console.error);
        }
      }}
    >
      {/* Avatar */}
      <div className="w-12 h-12 flex items-center justify-center bg-orange/10 text-orange font-bold font-title text-base rounded-2xl shrink-0 group-hover:scale-105 transition-transform shadow-xs border border-orange/20">
        {offering?.name ? offering.name[0].toUpperCase() : <FiShoppingBag size={20} />}
      </div>

      {/* Info Column */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        {/* Row 1: Title and Category */}
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-bold text-gray-900 font-title text-sm sm:text-base truncate group-hover:text-orange transition-colors">
            {offering?.name || "Wedding Service"}
          </h3>
          {offering?.category && (
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-orange/10 text-orange border border-orange/20 shrink-0">
              {offering.category}
            </span>
          )}
        </div>

        {/* Row 2: Vendor & Location */}
        <div className="flex items-center font-body gap-1.5 text-xs text-gray-500 mt-1">
          <IoLocationSharp className="text-orange shrink-0" size={13} />
          <span className="truncate">
            {vendor?.busname || "Vendor"}
            {vendor?.city ? ` • ${vendor.city}` : ""}
          </span>
        </div>

        {/* Row 3: Last message preview */}
        <p
          className={`text-xs mt-1 truncate font-body ${
            isPaymentNote ? "text-amber-800 font-semibold" : "text-gray-600"
          }`}
        >
          {previewText}
        </p>
      </div>

      {/* Right Meta Column: Timestamp & Action Arrow neatly aligned together */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0 ml-2 sm:ml-4 self-center">
        {lastMessage && (
          <span className="text-[11px] sm:text-xs text-gray-400 font-body whitespace-nowrap">
            {formatDistanceToNow(new Date(lastMessage.timestamp), {
              addSuffix: true,
            })}
          </span>
        )}
        <div className="w-8 h-8 rounded-xl bg-orange/5 text-orange/60 group-hover:bg-orange group-hover:text-white flex items-center justify-center transition-all shrink-0">
          <FiChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

const VisitorChatList = ({ visitorId }: VisitorChatListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, loading } = useQuery(GET_VISITOR_CHATS, {
    variables: { visitorId },
    skip: !visitorId,
  });

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center gap-3">
        <LoaderHelix />
        <p className="text-xs font-semibold text-gray-500 font-body">Loading conversations...</p>
      </div>
    );
  }

  const chats: Chat[] = data?.getVisitorChats || [];

  if (chats.length === 0) {
    return (
      <div className="p-12 sm:p-16 text-center space-y-4 font-body">
        <div className="w-16 h-16 rounded-full bg-orange/10 flex items-center justify-center text-orange mx-auto">
          <FiMessageSquare size={28} />
        </div>
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-bold font-title text-gray-800">
            No Conversations Yet
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
            When you contact wedding vendors or book their packages, your direct conversations and quotes will appear here.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 bg-orange hover:bg-orange/90 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs transition-all"
          >
            <span>Browse Wedding Services</span>
            <FiArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Search Header */}
      <div className="p-4 sm:p-5 border-b-2 border-orange/10 bg-white">
        <div className="relative w-full">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search conversations by vendor or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-12 py-2.5 sm:py-3 text-xs sm:text-sm bg-orange/[0.02] border-2 border-orange/15 focus:border-orange rounded-2xl focus:outline-none focus:bg-white text-gray-800 placeholder-gray-400 transition-all font-body"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-orange px-2 py-1 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Conversations List */}
      <div className="divide-y divide-orange/10">
        {chats.map((chat: Chat) => (
          <ChatItem
            key={chat.chatId}
            chat={chat}
            visitorId={visitorId}
            searchQuery={searchQuery}
          />
        ))}
      </div>
    </div>
  );
};

export default VisitorChatList;

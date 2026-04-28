"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_CHAT_VISITOR_DETAILS,
  GET_OFFERING_DETAILS,
} from "@/graphql/queries";
import { MARK_CHAT_AS_READ } from "@/graphql/mutations";
import { FaUserCircle } from "react-icons/fa";
import { FaInbox } from "react-icons/fa6";
import { FiChevronDown, FiChevronUp, FiMessageSquare } from "react-icons/fi";
import { useVendorAuth } from "@/contexts/VendorAuthContext";
import { useState } from "react";

interface Message {
  content: string;
  timestamp: string;
}

interface Chat {
  chatId: string;
  visitorId: string;
  offeringId: string;
  messages: Message[];
}

interface ChatListProps {
  chats: Chat[];
}

// Single chat row inside an offering group
const ChatRow = ({ chat }: { chat: Chat }) => {
  const { vendor } = useVendorAuth();
  const [markChatAsRead] = useMutation(MARK_CHAT_AS_READ);

  const { data: visitorData } = useQuery(GET_CHAT_VISITOR_DETAILS, {
    variables: { id: chat.visitorId },
  });

  const previewMessage = chat.messages[chat.messages.length - 1];

  const visitor = visitorData?.findVisitorById;

  if (!visitor) {
    return (
      <div className="animate-pulse flex items-center px-4 py-3 ml-4">
        <div className="w-9 h-9 bg-gray-200 rounded-full mr-3"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          <div className="h-2 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/vendor-dashboard/chats/${chat.chatId}`}
      className="flex items-center px-4 py-3 ml-4 border-l-2 border-gray-100 hover:bg-gray-50 hover:border-accent transition-all"
      onClick={() => {
        if (vendor?.id) {
          markChatAsRead({
            variables: { chatId: chat.chatId, userId: vendor.id, userType: "vendor" },
          }).catch(console.error);
        }
      }}
    >
      <div className="w-9 h-9 flex items-center justify-center bg-accent/10 rounded-full mr-3 flex-shrink-0">
        <FaUserCircle className="text-accent" size={28} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-gray-900 font-body text-sm truncate">
            {visitor.visitor_fname} & {visitor.partner_fname}
          </span>
          {previewMessage && (
            <span className="text-xs text-gray-400 font-body flex-shrink-0">
              {formatDistanceToNow(new Date(previewMessage.timestamp), { addSuffix: true })}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-0.5 truncate font-body">
          {previewMessage?.content || "No messages yet"}
        </p>
        <p className="text-xs text-gray-400 mt-0.5 font-body">{visitor.email}</p>
      </div>
    </Link>
  );
};

// Collapsible group for one offering
const OfferingGroup = ({ offeringId, chats }: { offeringId: string; chats: Chat[] }) => {
  const [open, setOpen] = useState(true);

  const { data: offeringData } = useQuery(GET_OFFERING_DETAILS, {
    variables: { id: offeringId },
  });

  const offeringName = offeringData?.findOfferingById?.name || "Loading...";

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <FiMessageSquare className="text-accent text-sm" />
          </div>
          <div className="text-left">
            <span className="font-semibold text-gray-800 font-body">{offeringName}</span>
            <span className="ml-2 px-2 py-0.5 text-xs bg-accent/10 text-accent rounded-full font-body">
              {chats.length} conversation{chats.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        {open ? (
          <FiChevronUp className="text-gray-400 text-lg flex-shrink-0" />
        ) : (
          <FiChevronDown className="text-gray-400 text-lg flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="divide-y divide-gray-50 bg-white">
          {chats.map((chat) => (
            <ChatRow key={chat.chatId} chat={chat} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function ChatList({ chats }: ChatListProps) {
  if (chats.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <FaInbox className="mx-auto text-4xl text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">No conversations yet</p>
        <p className="text-sm text-gray-400">Your messages with couples will appear here</p>
      </div>
    );
  }

  // Group remaining chats by offeringId
  const grouped = chats.reduce<Record<string, Chat[]>>((acc, chat) => {
    if (!acc[chat.offeringId]) acc[chat.offeringId] = [];
    acc[chat.offeringId].push(chat);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {/* Regular offering groups */}
      {Object.entries(grouped).map(([offeringId, groupChats]) => (
        <OfferingGroup key={offeringId} offeringId={offeringId} chats={groupChats} />
      ))}
    </div>
  );
}



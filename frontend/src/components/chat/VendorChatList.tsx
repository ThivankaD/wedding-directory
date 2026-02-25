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
import { FiChevronDown, FiChevronUp, FiMessageSquare, FiPackage } from "react-icons/fi";
import { useVendorAuth } from "@/contexts/VendorAuthContext";
import { useState } from "react";

const PAYMENT_NOTE_PREFIX = "📦 Payment Note";

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

// Single chat row inside an offering group (skips payment-note-only messages in preview)
const ChatRow = ({ chat }: { chat: Chat }) => {
  const { vendor } = useVendorAuth();
  const [markChatAsRead] = useMutation(MARK_CHAT_AS_READ);

  const { data: visitorData } = useQuery(GET_CHAT_VISITOR_DETAILS, {
    variables: { id: chat.visitorId },
  });

  // Show last non-payment-note message as preview
  const previewMessage = [...chat.messages]
    .reverse()
    .find((m) => !m.content.startsWith(PAYMENT_NOTE_PREFIX)) ?? chat.messages[chat.messages.length - 1];

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

// Row inside the Payment Notes group
const PaymentNoteRow = ({
  chat,
  message,
}: {
  chat: Chat;
  message: Message;
}) => {
  const { vendor } = useVendorAuth();
  const [markChatAsRead] = useMutation(MARK_CHAT_AS_READ);

  const { data: visitorData } = useQuery(GET_CHAT_VISITOR_DETAILS, {
    variables: { id: chat.visitorId },
  });

  const visitor = visitorData?.findVisitorById;

  // Parse header line and body from the note
  const lines = message.content.split("\n").filter(Boolean);
  const header = lines[0] ?? "";
  const body = lines.slice(1).join(" ").trim();

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
      className="flex items-start px-4 py-3 ml-4 border-l-2 border-orange/30 hover:bg-orange/5 hover:border-orange transition-all"
      onClick={() => {
        if (vendor?.id) {
          markChatAsRead({
            variables: { chatId: chat.chatId, userId: vendor.id, userType: "vendor" },
          }).catch(console.error);
        }
      }}
    >
      <div className="w-9 h-9 flex items-center justify-center bg-orange/10 rounded-full mr-3 flex-shrink-0 mt-0.5">
        <FaUserCircle className="text-orange" size={28} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-gray-900 font-body text-sm truncate">
            {visitor.visitor_fname} & {visitor.partner_fname}
          </span>
          <span className="text-xs text-gray-400 font-body flex-shrink-0">
            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
          </span>
        </div>
        {/* Header line styled as a badge */}
        <p className="text-xs font-semibold text-orange mt-0.5 truncate">{header}</p>
        {body && (
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 font-body">{body}</p>
        )}
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

// Dedicated collapsible Payment Notes group
const PaymentNotesGroup = ({
  notes,
}: {
  notes: { chat: Chat; message: Message }[];
}) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="border border-orange/30 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-5 py-4 bg-orange/5 hover:bg-orange/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange/10 flex items-center justify-center">
            <FiPackage className="text-orange text-sm" />
          </div>
          <div className="text-left">
            <span className="font-semibold text-gray-800 font-body">Reservation Notes</span>
            <span className="ml-2 px-2 py-0.5 text-xs bg-orange/10 text-orange rounded-full font-body">
              {notes.length} note{notes.length !== 1 ? "s" : ""}
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
        <div className="divide-y divide-orange/10 bg-white">
          {notes.map(({ chat, message }, idx) => (
            <PaymentNoteRow key={`${chat.chatId}-${idx}`} chat={chat} message={message} />
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

  // Collect all payment note messages across all chats
  const paymentNotes: { chat: Chat; message: Message }[] = [];
  chats.forEach((chat) => {
    chat.messages.forEach((msg) => {
      if (msg.content.startsWith(PAYMENT_NOTE_PREFIX)) {
        paymentNotes.push({ chat, message: msg });
      }
    });
  });
  // Sort by newest first
  paymentNotes.sort(
    (a, b) => new Date(b.message.timestamp).getTime() - new Date(a.message.timestamp).getTime()
  );

  // Group remaining chats by offeringId
  const grouped = chats.reduce<Record<string, Chat[]>>((acc, chat) => {
    if (!acc[chat.offeringId]) acc[chat.offeringId] = [];
    acc[chat.offeringId].push(chat);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {/* Payment Notes group — shown first if any exist */}
      {paymentNotes.length > 0 && (
        <PaymentNotesGroup notes={paymentNotes} />
      )}

      {/* Regular offering groups */}
      {Object.entries(grouped).map(([offeringId, groupChats]) => (
        <OfferingGroup key={offeringId} offeringId={offeringId} chats={groupChats} />
      ))}
    </div>
  );
}



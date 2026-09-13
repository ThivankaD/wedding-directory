"use client";
import Link from "next/link";
import { Fragment, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { IoIosNotificationsOutline } from "react-icons/io";
import { BiMessageRounded } from "react-icons/bi";
import { FiCalendar } from "react-icons/fi";
import Image from "next/image";
import { useAuth } from "@/contexts/VisitorAuthContext";
import SearchBar from "../SearchBar";
import { useQuery } from "@apollo/client";
import { GET_VISITOR_BY_ID, GET_VISITOR_APPROVAL_REQUESTS } from "@/graphql/queries";
import { useChatSocket } from "@/hooks/useChatSocket";
import toast from "react-hot-toast";

const VisitorHeader = () => {
  const router = useRouter();
  const { visitor, logout } = useAuth();
  const [profilePic, setProfilePic] = useState<string>("/images/visitorPlaceholder.png"); // Default placeholder
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationMenuRef = useRef<HTMLDivElement>(null);
  const previousApprovedCountRef = useRef<number | null>(null);

  // WebSocket hook for unread count
  const { unreadCount } = useChatSocket(visitor?.id, "visitor");

  // Fetch visitor data including profile_pic_url on component load
  useQuery(GET_VISITOR_BY_ID, {
    variables: { id: visitor?.id },
    skip: !visitor?.id,
    onError: (err) => {
      console.warn("Failed to load visitor profile picture:", err.message);
    },
    onCompleted: (data) => {
      if (data?.findVisitorById?.profile_pic_url) {
        setProfilePic(data.findVisitorById.profile_pic_url);
      }
    },
  });

  // Query visitor approval requests with polling for real-time notifications
  const { data: approvalData } = useQuery(GET_VISITOR_APPROVAL_REQUESTS, {
    variables: { visitorId: visitor?.id },
    skip: !visitor?.id,
    pollInterval: 10000,
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
    onError: (err) => {
      console.warn("Failed to load visitor approval notifications:", err.message);
    },
  });

  const approvalRequests = approvalData?.getVisitorApprovalRequests || [];
  const activeRequests = approvalRequests.filter(
    (r: any) => (r.status === "approved" && !r.isExpired) || r.status === "pending"
  );
  const notificationCount = activeRequests.length;

  const sortedRequests = [...approvalRequests].sort((a: any, b: any) => {
    const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return dateB - dateA;
  });

  // Real-time toast alert when a booking request is approved
  useEffect(() => {
    const approvedRequests = approvalRequests.filter(
      (r: any) => r.status === "approved" && !r.isExpired
    );
    const approvedCount = approvedRequests.length;

    if (
      previousApprovedCountRef.current !== null &&
      approvedCount > previousApprovedCountRef.current
    ) {
      const latest = approvedRequests[0];
      const vendorName =
        latest?.package?.offering?.vendor?.busname ||
        latest?.package?.offering?.name ||
        "The vendor";
      const pkgName = latest?.package?.name || "Package";

      toast.custom(
        (t) => (
          <div
            onClick={() => {
              toast.dismiss(t.id);
              if (latest?.package?.offering?.id) {
                router.push(`/services/${latest.package.offering.id}`);
              }
            }}
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-white shadow-xl rounded-2xl pointer-events-auto flex cursor-pointer hover:bg-orange/5 transition-all p-4 border-l-4 border-emerald-500 border border-gray-100`}
          >
            <div className="flex items-start gap-3 w-full">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <IoIosNotificationsOutline size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-900">
                  Booking Request Approved! 🎉
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  <span className="font-semibold text-gray-800">{vendorName}</span> approved your request for{" "}
                  <span className="font-semibold text-gray-800">{pkgName}</span>. Click to complete booking!
                </p>
              </div>
            </div>
          </div>
        ),
        { duration: 6000 }
      );
    }
    previousApprovedCountRef.current = approvedCount;
  }, [approvalRequests, router]);

  // Handle dropdown toggle
  const handleProfileClick = () => {
    setShowProfileMenu((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
  };

  // Close the dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
      if (
        notificationMenuRef.current &&
        !notificationMenuRef.current.contains(event.target as Node)
      ) {
        setShowNotificationMenu(false);
      }
    };

    if (showProfileMenu || showNotificationMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileMenu, showNotificationMenu]);

  return (
    <Fragment>
      <header className="py-6 xl:py-6 text-black bg-white">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold text-text font-title">
                Say I Do
              </h1>
            </Link>
          </div>

          {/* Search bar */}
          <div className="flex flex-1 justify-center">
            <SearchBar
              showIcon={false}
              placehHolderText="search venues, caterers, etc."
            />
          </div>

          {/* Dashboard, Notifications, and Profile dropdown */}
          <div className="flex items-center justify-end gap-8 text-xl font-title text-text">
            <Link href="/visitor-dashboard">Dashboard</Link>
            <Link href="/vendor-search">Vendors</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/help">Help</Link>

            {/* Chat icon with unread badge */}
            <Link href={`/visitor-dashboard/chats/${visitor?.id}`} className="relative">
              <BiMessageRounded className="w-[33px] h-[33px] cursor-pointer hover:text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>

            {/* Notification bell dropdown */}
            <div className="relative" ref={notificationMenuRef}>
              <button
                type="button"
                onClick={() => setShowNotificationMenu((prev) => !prev)}
                className="relative p-1 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center text-text"
                title={
                  notificationCount > 0
                    ? `${notificationCount} notification${notificationCount === 1 ? "" : "s"}`
                    : "Notifications"
                }
                aria-label="Notifications"
              >
                <IoIosNotificationsOutline className="w-[36px] h-[36px] cursor-pointer hover:text-gray-600" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-sm">
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </span>
                )}
              </button>

              {showNotificationMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white shadow-2xl rounded-2xl py-2 z-50 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-title font-bold text-base text-gray-900">Notifications</span>
                      {notificationCount > 0 && (
                        <span className="bg-orange/10 text-orange text-xs font-bold px-2 py-0.5 rounded-full">
                          {notificationCount} new
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                    {sortedRequests.length === 0 ? (
                      <div className="py-10 px-4 text-center">
                        <IoIosNotificationsOutline className="w-12 h-12 text-gray-300 mx-auto mb-2.5" />
                        <p className="text-sm font-semibold text-gray-700">No new notifications</p>
                        <p className="text-xs text-gray-400 mt-1">You are all caught up!</p>
                      </div>
                    ) : (
                      sortedRequests.map((req: any) => {
                        const vendorName =
                          req.package?.offering?.vendor?.busname ||
                          req.package?.offering?.name ||
                          "Vendor";
                        const pkgName = req.package?.name || "Package";
                        const isApproved = req.status === "approved" && !req.isExpired;
                        const isRejected = req.status === "rejected";
                        const isPending = req.status === "pending";
                        const isExpired = req.status === "approved" && req.isExpired;
                        const offeringId = req.package?.offering?.id;
                        const targetUrl = offeringId ? `/services/${offeringId}` : "/visitor-dashboard";

                        return (
                          <Link
                            key={req.id}
                            href={targetUrl}
                            onClick={() => setShowNotificationMenu(false)}
                            className="block p-3.5 hover:bg-orange/5 transition-colors cursor-pointer text-left"
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5 ${
                                  isApproved
                                    ? "bg-emerald-100 text-emerald-600"
                                    : isRejected
                                    ? "bg-rose-100 text-rose-600"
                                    : isExpired
                                    ? "bg-gray-100 text-gray-500"
                                    : "bg-orange/10 text-orange"
                                }`}
                              >
                                {vendorName.charAt(0).toUpperCase() || "V"}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <p className="text-xs font-bold text-gray-900 truncate">
                                    {vendorName}
                                  </p>
                                  {isApproved && (
                                    <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">
                                      Approved
                                    </span>
                                  )}
                                  {isPending && (
                                    <span className="text-[10px] font-semibold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">
                                      Pending
                                    </span>
                                  )}
                                  {isRejected && (
                                    <span className="text-[10px] font-semibold bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded border border-rose-200">
                                      Declined
                                    </span>
                                  )}
                                  {isExpired && (
                                    <span className="text-[10px] font-semibold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">
                                      Expired
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 mt-0.5">
                                  {isApproved
                                    ? `Approved your request for ${pkgName}!`
                                    : isRejected
                                    ? `Declined booking request for ${pkgName}`
                                    : isExpired
                                    ? `Approval expired for ${pkgName}`
                                    : `Pending approval for ${pkgName}`}
                                </p>
                                {req.vendorMessage && (
                                  <p className="text-[11px] text-gray-500 italic mt-0.5 truncate">
                                    &ldquo;{req.vendorMessage}&rdquo;
                                  </p>
                                )}
                                <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-gray-400 font-medium">
                                  <FiCalendar size={12} className="text-orange" />
                                  <span>{req.bookingDate}</span>
                                  <span className="text-gray-300">•</span>
                                  <span className="text-orange font-semibold">
                                    {isApproved ? "Book now →" : "View service →"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <Image
                src={profilePic} // Display the fetched profile picture URL or placeholder
                alt="profile picture"
                className="w-[50px] h-[50px] rounded-full object-cover cursor-pointer"
                width={50}
                height={50}
                layout="fixed"
                onClick={handleProfileClick}
              />
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
                  <Link href="/visitor-profile">
                    <p className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-title text-lg">
                      Profile
                    </p>
                  </Link>
                  <p
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer font-title text-lg"
                    onClick={handleLogout}
                  >
                    Logout
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </Fragment>
  );
};

export default VisitorHeader;

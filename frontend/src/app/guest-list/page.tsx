"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useAuth } from "@/contexts/VisitorAuthContext";
import { GET_VISITOR_BY_ID, FIND_GUESTLIST_BY_VISITOR } from "@/graphql/queries";
import { DELETE_GUESTLIST } from "@/graphql/mutations";
import AddNewGuest from "@/components/guest-list/addnewguest";
import EditGuest, { Guest } from "@/components/guest-list/editguest";
import VCardImportModal from "@/components/guest-list/VCardImportModal";
import Breadcrumbs from "@/components/Breadcrumbs";
import LoaderHelix from "@/components/shared/Loaders/LoaderHelix";
import toast from "react-hot-toast";
import {
  FiUsers,
  FiUserPlus,
  FiDownload,
  FiUploadCloud,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiPhone,
  FiMail,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiHelpCircle,
  FiUserCheck,
} from "react-icons/fi";

const GuestListPage = () => {
  const { visitor } = useAuth();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isEditPopupVisible, setIsEditPopupVisible] = useState(false);
  const [isVCardModalOpen, setIsVCardModalOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const togglePopup = () => setIsPopupVisible((prev) => !prev);
  const toggleEditPopup = () => setIsEditPopupVisible((prev) => !prev);

  const { loading: visitorLoading, error: visitorError } = useQuery(GET_VISITOR_BY_ID, {
    variables: { id: visitor?.id },
    skip: !visitor?.id,
  });

  const {
    data: gldata,
    loading: guestlistsLoading,
    error: guestlistsError,
    refetch: refetchGuestLists,
  } = useQuery(FIND_GUESTLIST_BY_VISITOR, {
    variables: { id: visitor?.id },
    skip: !visitor?.id,
  });

  const [deleteGuest] = useMutation(DELETE_GUESTLIST, {
    onCompleted: () => {
      toast.success("Guest deleted successfully");
      refetchGuestLists();
    },
    onError: () => {
      toast.error("Failed to delete guest");
    },
  });

  const handleDeleteGuest = (guestId: string, guestName: string) => {
    toast(
      (t) => (
        <div className="space-y-2 p-1">
          <p className="text-sm font-semibold text-gray-800">
            Delete <span className="text-orange">{guestName}</span> from guest list?
          </p>
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 text-xs font-semibold rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                deleteGuest({ variables: { id: guestId } });
                toast.dismiss(t.id);
              }}
              className="px-3 py-1 text-xs font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  const handleEditGuest = (guest: Guest) => {
    setSelectedGuest(guest);
    toggleEditPopup();
  };

  if (visitorLoading || guestlistsLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4">
        <LoaderHelix />
        <p className="text-sm font-semibold text-gray-600 font-body">Loading your guest list...</p>
      </div>
    );
  }

  if (visitorError) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border-2 border-orange/20 max-w-lg mx-auto mt-12">
        <p className="text-red-500 font-semibold mb-2 font-title text-lg">Error loading visitor</p>
        <p className="text-xs text-gray-500 font-body">{visitorError.message}</p>
      </div>
    );
  }

  if (guestlistsError) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border-2 border-orange/20 max-w-lg mx-auto mt-12">
        <p className="text-red-500 font-semibold mb-2 font-title text-lg">Error loading guest list</p>
        <p className="text-xs text-gray-500 font-body">{guestlistsError.message}</p>
      </div>
    );
  }

  const guestlistData = gldata?.findGuestListsByVisitor || [];
  const guestlists: Guest[] = guestlistData.map(
    (
      guest: {
        id: string;
        name: string;
        number: number | string;
        status: string;
        contact: string;
        email: string;
        address?: string;
      },
      index: number
    ) => ({
      no: String(index + 1),
      id: guest.id,
      name: guest.name,
      number: String(guest.number || 1),
      status: guest.status || "Invited",
      contact: guest.contact || "",
      email: guest.email || "",
      address: guest.address || "",
    })
  );

  // Metrics calculations
  const totalEntries = guestlists.length;
  const invitedCount = guestlists.filter((g) => g.status === "Invited").length;
  const attendingCount = guestlists.filter((g) => g.status === "Attending").length;
  const declinedCount = guestlists.filter((g) => g.status === "Declined").length;

  // Total seats / people across attending guests
  const attendingSeats = guestlists
    .filter((g) => g.status === "Attending")
    .reduce((sum, g) => {
      const num = Number(g.number);
      return sum + (isNaN(num) || num <= 0 ? 1 : num);
    }, 0);

  // Total seats expected (Attending + Invited)
  const totalExpectedSeats = guestlists
    .filter((g) => g.status === "Attending" || g.status === "Invited")
    .reduce((sum, g) => {
      const num = Number(g.number);
      return sum + (isNaN(num) || num <= 0 ? 1 : num);
    }, 0);

  // Filtering
  const filteredGuests = guestlists.filter((guest) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === "" ||
      guest.name.toLowerCase().includes(query) ||
      guest.contact.toLowerCase().includes(query) ||
      guest.email.toLowerCase().includes(query) ||
      guest.address.toLowerCase().includes(query);

    const matchesStatus = filterStatus === "" || guest.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const downloadCSV = () => {
    const headers = ["No", "Name", "Party of", "Status", "Contact", "Email", "Address"];
    const rows = guestlists.map((guest: Guest) => [
      guest.no,
      guest.name,
      guest.number,
      guest.status,
      guest.contact,
      guest.email,
      guest.address,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((item: string | number) => `"${item || ""}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `wedding_guest_list_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();

    URL.revokeObjectURL(url);
    toast.success("Guest list exported to CSV!");
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "attending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <FiCheckCircle size={12} className="text-emerald-600" />
            <span>Attending</span>
          </span>
        );
      case "invited":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <FiClock size={12} className="text-blue-600" />
            <span>Invited</span>
          </span>
        );
      case "declined":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <FiXCircle size={12} className="text-rose-600" />
            <span>Declined</span>
          </span>
        );
      case "not invited":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
            <FiHelpCircle size={12} className="text-gray-500" />
            <span>{status || "Not Invited"}</span>
          </span>
        );
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Hero Card */}
      <div className="bg-white rounded-3xl border-2 border-orange/20 shadow-sm p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3">
          <Breadcrumbs
            items={[
              { label: "Dashboard", href: "/visitor-dashboard" },
              { label: "Guest List", href: "/guest-list" },
            ]}
          />
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange/10 flex items-center justify-center text-orange shrink-0">
              <FiUsers size={24} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-title text-gray-900">
                My Guest List
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-body">
                Plan and manage your wedding guests, invitations, party sizes, and RSVPs.
              </p>
            </div>
          </div>
        </div>

        {/* Total Guests Badge Card */}
        <div className="bg-orange/[0.05] border-2 border-orange/15 rounded-2xl p-5 flex items-center gap-6 shrink-0 justify-between lg:justify-end">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider font-body">
              Attending Seats
            </p>
            <p className="text-3xl sm:text-4xl font-black font-title text-orange">
              {attendingSeats}
            </p>
          </div>
          <div className="h-10 w-px bg-orange/20" />
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider font-body">
              Total Expected
            </p>
            <p className="text-3xl sm:text-4xl font-black font-title text-gray-900">
              {totalExpectedSeats}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Metrics Summary Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white rounded-2xl border-2 border-orange/20 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider font-body">
            <FiUsers className="text-orange" size={14} />
            <span>Total Entries</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black font-title text-gray-900 mt-2">
            {totalEntries}
          </p>
        </div>

        <div className="bg-white rounded-2xl border-2 border-orange/20 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider font-body">
            <FiUserCheck className="text-emerald-600" size={14} />
            <span>Attending</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black font-title text-emerald-600 mt-2">
            {attendingCount}
          </p>
        </div>

        <div className="bg-white rounded-2xl border-2 border-orange/20 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider font-body">
            <FiClock className="text-blue-600" size={14} />
            <span>Invited</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black font-title text-blue-600 mt-2">
            {invitedCount}
          </p>
        </div>

        <div className="bg-white rounded-2xl border-2 border-orange/20 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-wider font-body">
            <FiXCircle className="text-rose-600" size={14} />
            <span>Declined</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black font-title text-rose-600 mt-2">
            {declinedCount}
          </p>
        </div>
      </div>

      {/* 3. Main Directory Card */}
      <div className="bg-white rounded-3xl border-2 border-orange/20 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Header & Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-orange/15">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-title text-gray-900">
              Guest Directory
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-body">
              View and filter your guest roster, edit party sizes, or import contacts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Import vCard Button */}
            <button
              onClick={() => setIsVCardModalOpen(true)}
              className="border-2 border-orange/20 hover:border-orange bg-orange/[0.04] text-gray-800 hover:text-orange px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
            >
              <FiUploadCloud size={16} className="text-orange" />
              <span>Import vCard (.vcf)</span>
            </button>

            {/* Download CSV */}
            <button
              onClick={downloadCSV}
              className="border-2 border-orange/20 hover:border-orange bg-white text-gray-700 hover:text-orange px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
            >
              <FiDownload size={16} />
              <span>Export CSV</span>
            </button>

            {/* Add New Guest */}
            <button
              onClick={togglePopup}
              className="bg-orange hover:bg-orange/90 text-white px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all shadow-xs hover:shadow-md"
            >
              <FiUserPlus size={16} />
              <span>Add Guest</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by name, contact, or email..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-orange/[0.02] border-2 border-orange/20 focus:border-orange rounded-xl focus:outline-none focus:ring-1 focus:ring-orange text-gray-800 placeholder-gray-400 transition-all font-body"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider font-body whitespace-nowrap">
              Filter:
            </span>
            <select
              className="border-2 border-orange/20 focus:border-orange rounded-xl px-3.5 py-2 text-xs sm:text-sm bg-white text-gray-800 font-semibold focus:outline-none cursor-pointer"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Attending">Attending</option>
              <option value="Invited">Invited</option>
              <option value="Not Invited">Not Invited</option>
              <option value="Declined">Declined</option>
            </select>
          </div>
        </div>

        {/* 4. Themed Table */}
        {filteredGuests.length === 0 ? (
          <div className="border-2 border-dashed border-orange/20 rounded-3xl p-10 sm:p-14 text-center space-y-4 bg-orange/[0.02]">
            <div className="w-16 h-16 rounded-full bg-orange/10 flex items-center justify-center text-orange mx-auto">
              <FiUsers size={28} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold font-title text-gray-800">
                {guestlists.length === 0 ? "No guests added yet" : "No matching guests found"}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 font-body max-w-sm mx-auto">
                {guestlists.length === 0
                  ? "Start by adding your guests manually or import them in seconds from a .vcf file."
                  : "Try clearing your search query or choosing a different status filter."}
              </p>
            </div>
            {guestlists.length === 0 && (
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setIsVCardModalOpen(true)}
                  className="border-2 border-orange/20 hover:border-orange bg-white text-gray-800 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-2xs"
                >
                  <FiUploadCloud size={15} className="text-orange" />
                  <span>Import vCard (.vcf)</span>
                </button>
                <button
                  onClick={togglePopup}
                  className="bg-orange hover:bg-orange/90 text-white px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <FiUserPlus size={15} />
                  <span>Add First Guest</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="border-2 border-orange/15 rounded-2xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm font-body">
                <thead className="bg-orange/[0.06] text-gray-900 font-bold uppercase tracking-wider text-xs border-b border-orange/15 font-title">
                  <tr>
                    <th className="py-3.5 px-4 w-12 text-center">#</th>
                    <th className="py-3.5 px-4">Guest Name</th>
                    <th className="py-3.5 px-4 text-center">Party of</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4">Contact Info</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange/10 bg-white">
                  {filteredGuests.map((guest, idx) => (
                    <tr
                      key={guest.id}
                      className="hover:bg-orange/[0.02] transition-colors"
                    >
                      {/* # index */}
                      <td className="py-3.5 px-4 text-center text-xs font-semibold text-gray-400">
                        {idx + 1}
                      </td>

                      {/* Name & Address */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange/10 text-orange font-bold font-title flex items-center justify-center shrink-0 text-xs">
                            {guest.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 font-title text-sm">
                              {guest.name}
                            </p>
                            {guest.address && (
                              <p className="text-[11px] text-gray-400 line-clamp-1 max-w-xs">
                                {guest.address}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Party of */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-orange/10 text-orange">
                          <FiUsers size={12} />
                          <span>{guest.number}</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        {getStatusBadge(guest.status)}
                      </td>

                      {/* Contact Info */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          {guest.contact ? (
                            <p className="flex items-center gap-1.5 text-xs text-gray-700">
                              <FiPhone size={12} className="text-orange shrink-0" />
                              <span>{guest.contact}</span>
                            </p>
                          ) : null}
                          {guest.email ? (
                            <p className="flex items-center gap-1.5 text-xs text-gray-500">
                              <FiMail size={12} className="text-orange shrink-0" />
                              <span>{guest.email}</span>
                            </p>
                          ) : null}
                          {!guest.contact && !guest.email && (
                            <span className="text-xs text-gray-400 italic">No contact info</span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleEditGuest(guest)}
                            className="w-8 h-8 rounded-xl bg-orange/[0.08] hover:bg-orange hover:text-white text-orange flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                            title="Edit guest"
                          >
                            <FiEdit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteGuest(guest.id, guest.name)}
                            className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-600 hover:text-white text-red-600 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                            title="Delete guest"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddNewGuest
        isVisible={isPopupVisible}
        onClose={togglePopup}
        onSave={() => refetchGuestLists()}
      />

      {selectedGuest && (
        <EditGuest
          isVisible={isEditPopupVisible}
          onClose={toggleEditPopup}
          guest={selectedGuest}
          onSave={() => refetchGuestLists()}
        />
      )}

      <VCardImportModal
        isOpen={isVCardModalOpen}
        onClose={() => setIsVCardModalOpen(false)}
        visitorId={visitor?.id}
        onImportSuccess={() => refetchGuestLists()}
      />
    </div>
  );
};

export default GuestListPage;

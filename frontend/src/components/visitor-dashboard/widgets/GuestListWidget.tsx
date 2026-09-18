import React from "react";
import { FiUsers } from "react-icons/fi";
import ActionButton from "../common/ActionButton";
import EmptyStateDisplay from "../common/EmptyStateDisplay";

interface GuestListWidgetProps {
  attendingGuests: number;
  declinedGuests: number;
  invitedGuests: number;
  notInvitedGuests: number;
  totalGuests: number;
}

const GuestListWidget: React.FC<GuestListWidgetProps> = ({
  attendingGuests,
  declinedGuests,
  invitedGuests,
  notInvitedGuests,
  totalGuests,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-orange/20 shadow-sm hover:shadow-md hover:border-orange/30 transition-all duration-300 overflow-hidden flex flex-col justify-between h-full">
      {/* Header */}
      <div className="px-5 sm:px-6 py-4 border-b border-orange/15 bg-orange/[0.02] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange/10 text-orange flex items-center justify-center shrink-0 border border-orange/15 shadow-xs">
            <FiUsers className="h-5 w-5" />
          </div>
          <h3 className="font-title text-base sm:text-lg font-bold text-gray-900">
            Guest List
          </h3>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4">
        <div>
          <p className="text-xs sm:text-sm text-gray-500 mb-3.5 font-body">
            Manage your wedding guest list with {totalGuests || 0} total guests across all categories.
          </p>

          {totalGuests > 0 ? (
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {/* Attending guests */}
              <div className="bg-emerald-50/70 rounded-xl p-2.5 text-center border border-emerald-200/80 shadow-xs">
                <p className="font-title font-bold text-emerald-700 text-lg sm:text-xl leading-tight">
                  {attendingGuests || 0}
                </p>
                <p className="text-[11px] font-semibold text-emerald-800 font-body mt-0.5">Attending</p>
              </div>

              {/* Declined guests */}
              <div className="bg-rose-50/70 rounded-xl p-2.5 text-center border border-rose-200/80 shadow-xs">
                <p className="font-title font-bold text-rose-600 text-lg sm:text-xl leading-tight">
                  {declinedGuests || 0}
                </p>
                <p className="text-[11px] font-semibold text-rose-800 font-body mt-0.5">Declined</p>
              </div>

              {/* Invited guests */}
              <div className="bg-orange/5 rounded-xl p-2.5 text-center border border-orange/20 shadow-xs">
                <p className="font-title font-bold text-orange text-lg sm:text-xl leading-tight">
                  {invitedGuests || 0}
                </p>
                <p className="text-[11px] font-semibold text-orange/90 font-body mt-0.5">Invited</p>
              </div>

              {/* Not Invited guests */}
              <div className="bg-gray-50 rounded-xl p-2.5 text-center border border-gray-200/80 shadow-xs">
                <p className="font-title font-bold text-gray-700 text-lg sm:text-xl leading-tight">
                  {notInvitedGuests || 0}
                </p>
                <p className="text-[11px] font-semibold text-gray-600 font-body mt-0.5">Not Invited</p>
              </div>
            </div>
          ) : (
            <EmptyStateDisplay Icon={FiUsers} message="No guests added yet" />
          )}
        </div>

        <div className="pt-3.5 border-t border-orange/10">
          <ActionButton href="/guest-list" label="Manage guest list" />
        </div>
      </div>
    </div>
  );
};

export default GuestListWidget;

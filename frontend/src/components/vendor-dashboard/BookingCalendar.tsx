"use client";

import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_VENDOR_PAYMENTS } from '@/graphql/queries';
import { useVendorAuth } from '@/contexts/VendorAuthContext';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { formatCoupleName } from '@/utils/formatCoupleName';
import { Skeleton } from '@/components/ui/skeleton';

interface Payment {
  id: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
  bookingDate: string | null;
  visitor: {
    id: string;
    visitor_fname: string;
    visitor_lname?: string;
    partner_fname?: string;
    email: string;
    phone?: string;
  };
  package: {
    id: string;
    name: string;
    offering: {
      id: string;
      name: string;
    };
  };
}

const BookingCalendar: React.FC = () => {
  const { vendor } = useVendorAuth();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { data, loading, error } = useQuery(GET_VENDOR_PAYMENTS, {
    variables: { vendorId: vendor?.id },
    skip: !vendor?.id,
  });

  const payments: Payment[] = data?.vendorPayments || [];

  // Filter ONLY completed payments with booking dates (exclude failed/cancelled attempts)
  const bookingsWithDates = payments.filter(
    (p) => p.bookingDate && p.status === "completed"
  );

  // Get bookings for selected date
  const getBookingsForDate = (date: Date) => {
    return bookingsWithDates.filter((p) => {
      const bookingDate = new Date(p.bookingDate!);
      return bookingDate.toDateString() === date.toDateString();
    });
  };

  // Check if a date has bookings
  const hasBooking = (date: Date) => {
    return bookingsWithDates.some((p) => {
      const bookingDate = new Date(p.bookingDate!);
      return bookingDate.toDateString() === date.toDateString();
    });
  };

  // Get booking status for a date (only completed bookings are tracked)
  const getDateStatus = (date: Date) => {
    const dateBookings = getBookingsForDate(date);
    return dateBookings.length > 0 ? "completed" : null;
  };

  // Generate calendar days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const selectedDateBookings = selectedDate ? getBookingsForDate(selectedDate) : [];

  if (loading) {
    return (
      <div className="bg-white dark:bg-darkSurface rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 sm:p-7 flex flex-col h-full space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-gray-100 dark:border-zinc-800">
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-44 rounded-lg" />
            <Skeleton className="h-3.5 w-64 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-28 rounded-xl" />
            <div className="flex gap-1">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <Skeleton className="w-8 h-8 rounded-lg" />
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-7 gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Skeleton key={i} className="h-5 w-full rounded" />
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => (
              <Skeleton key={i} className="h-16 sm:h-20 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-darkSurface rounded-2xl shadow-sm border border-red-100 dark:border-red-900/30 p-8 text-center text-red-500 text-sm">
        Error loading bookings. Please refresh the page.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-darkSurface rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 sm:p-7 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-zinc-800">
        <div>
          <h2 className="font-title text-xl sm:text-2xl font-bold text-gray-900 dark:text-zinc-100">
            Booking Calendar
          </h2>
          <p className="text-gray-400 dark:text-zinc-500 text-xs mt-0.5">
            Monitor client event dates and manage your availability
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Confirmed Bookings
          </span>
        </div>
      </div>

      {/* Calendar Header with Navigation */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={goToPreviousMonth}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-50 dark:bg-darkElevated hover:bg-orange/10 hover:text-orange border border-gray-200 dark:border-zinc-700 hover:border-orange/30 rounded-xl text-xs font-semibold text-gray-700 dark:text-zinc-300 transition-colors cursor-pointer"
          title="Previous Month"
        >
          <FiChevronLeft size={16} />
          <span>Prev</span>
        </button>
        <h3 className="text-base sm:text-lg font-title font-bold text-gray-900 dark:text-zinc-100">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={goToNextMonth}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-50 dark:bg-darkElevated hover:bg-orange/10 hover:text-orange border border-gray-200 dark:border-zinc-700 hover:border-orange/30 rounded-xl text-xs font-semibold text-gray-700 dark:text-zinc-300 transition-colors cursor-pointer"
          title="Next Month"
        >
          <span>Next</span>
          <FiChevronRight size={16} />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1.5 mb-6">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center font-semibold text-gray-400 dark:text-zinc-500 py-1.5 text-xs uppercase tracking-wider"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="aspect-square"></div>;
          }

          const status = getDateStatus(date);
          const isToday = date.toDateString() === new Date().toDateString();
          const isSelected = selectedDate?.toDateString() === date.toDateString();
          const dateBookings = getBookingsForDate(date);

          let cellClass = 'bg-white dark:bg-darkElevated hover:bg-orange/5 dark:hover:bg-darkElevated/80 border-gray-200 dark:border-zinc-700 text-gray-800 dark:text-zinc-200';
          if (status === 'completed') {
            cellClass = 'bg-emerald-50/80 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/80 font-semibold';
          } else if (status === 'pending') {
            cellClass = 'bg-amber-50/80 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800/80 font-semibold';
          } else if (status === 'mixed') {
            cellClass = 'bg-gradient-to-br from-emerald-50 to-amber-50 hover:opacity-95 text-gray-900 border-emerald-300 font-semibold';
          }

          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              className={`aspect-square p-1 border rounded-xl transition-all flex flex-col items-center justify-center cursor-pointer ${cellClass} ${
                isToday ? 'border-orange ring-1 ring-orange/30 font-bold' : ''
              } ${isSelected ? 'ring-2 ring-orange border-orange shadow-sm scale-105' : ''}`}
            >
              <div className="text-xs sm:text-sm">{date.getDate()}</div>
              {hasBooking(date) && (
                <div className="text-[9px] sm:text-[10px] mt-0.5 leading-tight font-medium opacity-90 truncate max-w-full px-0.5">
                  {dateBookings.length} {dateBookings.length > 1 ? 'bkgs' : 'bkg'}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Date Bookings Details */}
      {selectedDate && selectedDateBookings.length > 0 && (
        <div className="border border-gray-100 dark:border-zinc-800 rounded-xl p-4 bg-gray-50/60 dark:bg-darkElevated/40 mb-6 max-h-72 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-title font-bold text-sm text-gray-900 dark:text-zinc-100">
              Bookings for {selectedDate.toLocaleDateString(undefined, { dateStyle: 'medium' })}
            </h4>
            <span className="text-xs text-gray-500 dark:text-zinc-400 font-medium">
              {selectedDateBookings.length} {selectedDateBookings.length === 1 ? 'booking' : 'bookings'}
            </span>
          </div>

          <div className="space-y-2.5">
            {selectedDateBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white dark:bg-darkElevated border border-gray-100 dark:border-zinc-700 rounded-xl p-3 shadow-xs text-xs sm:text-sm"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 dark:text-zinc-100 truncate">
                      {formatCoupleName(booking.visitor, "Couple")}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-zinc-400 truncate mt-0.5">
                      {booking.visitor.email}
                    </div>
                    <div className="mt-2 space-y-1 text-xs text-gray-600 dark:text-zinc-300">
                      <div>
                        <span className="font-medium text-gray-700 dark:text-zinc-300">Service:</span> {booking.package.offering.name}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-zinc-300">Package:</span> {booking.package.name}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-orange/10 text-orange font-semibold text-xs">
                          LKR {booking.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Statistics Section */}
      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-zinc-800">
        <h4 className="font-title text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-3">
          Booking Overview
        </h4>
        <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Confirmed Bookings</div>
            <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-0.5">Active reservations on your calendar</p>
          </div>
          <div className="text-2xl font-bold text-emerald-800 dark:text-emerald-300 font-title leading-none">
            {bookingsWithDates.length}
          </div>
        </div>
      </div>

      {/* Recent Bookings List */}
      {bookingsWithDates.length > 0 && (
        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-zinc-800">
          <h4 className="font-title text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-3">
            Recent Client Bookings
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {bookingsWithDates.slice(0, 5).map((booking) => (
              <div
                key={booking.id}
                className="bg-gray-50/70 dark:bg-darkElevated hover:bg-gray-50 dark:hover:bg-darkElevated/80 border border-gray-100 dark:border-zinc-700 rounded-xl p-2.5 text-xs transition-colors flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900 dark:text-zinc-100 truncate">
                    {formatCoupleName(booking.visitor, "Couple")}
                  </div>
                  <div className="text-gray-500 dark:text-zinc-400 truncate text-[11px] mt-0.5">
                    {booking.package.name} • {new Date(booking.bookingDate!).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="font-semibold text-orange text-xs">
                    LKR {booking.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;

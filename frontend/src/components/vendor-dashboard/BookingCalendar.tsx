"use client";

import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_VENDOR_PAYMENTS } from '@/graphql/queries';
import { useVendorAuth } from '@/contexts/VendorAuthContext';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { formatCoupleName } from '@/utils/formatCoupleName';

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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex items-center justify-center min-h-[360px]">
        <div className="flex flex-col items-center gap-2 text-gray-500 text-sm">
          <div className="w-6 h-6 border-2 border-orange border-t-transparent rounded-full animate-spin"></div>
          <span>Loading bookings...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center text-red-500 text-sm">
        Error loading bookings. Please refresh the page.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-7 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
        <div>
          <h2 className="font-title text-xl sm:text-2xl font-bold text-gray-900">
            Booking Calendar
          </h2>
          <p className="text-gray-400 text-xs mt-0.5">
            Monitor client event dates and manage your availability
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Confirmed Bookings
          </span>
        </div>
      </div>

      {/* Calendar Header with Navigation */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={goToPreviousMonth}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-orange/10 hover:text-orange border border-gray-200 hover:border-orange/30 rounded-xl text-xs font-semibold text-gray-700 transition-colors"
          title="Previous Month"
        >
          <FiChevronLeft size={16} />
          <span>Prev</span>
        </button>
        <h3 className="text-base sm:text-lg font-title font-bold text-gray-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={goToNextMonth}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-orange/10 hover:text-orange border border-gray-200 hover:border-orange/30 rounded-xl text-xs font-semibold text-gray-700 transition-colors"
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
            className="text-center font-semibold text-gray-400 py-1.5 text-xs uppercase tracking-wider"
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

          let cellClass = 'bg-white hover:bg-orange/5 border-gray-200 text-gray-800';
          if (status === 'completed') {
            cellClass = 'bg-emerald-50/80 hover:bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold';
          } else if (status === 'pending') {
            cellClass = 'bg-amber-50/80 hover:bg-amber-100 text-amber-900 border-amber-300 font-semibold';
          } else if (status === 'mixed') {
            cellClass = 'bg-gradient-to-br from-emerald-50 to-amber-50 hover:opacity-95 text-gray-900 border-emerald-300 font-semibold';
          }

          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              className={`aspect-square p-1 border rounded-xl transition-all flex flex-col items-center justify-center ${cellClass} ${
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
        <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/60 mb-6 max-h-72 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-title font-bold text-sm text-gray-900">
              Bookings for {selectedDate.toLocaleDateString(undefined, { dateStyle: 'medium' })}
            </h4>
            <span className="text-xs text-gray-500 font-medium">
              {selectedDateBookings.length} {selectedDateBookings.length === 1 ? 'booking' : 'bookings'}
            </span>
          </div>

          <div className="space-y-2.5">
            {selectedDateBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white border border-gray-100 rounded-xl p-3 shadow-xs text-xs sm:text-sm"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">
                      {formatCoupleName(booking.visitor, "Couple")}
                    </div>
                    <div className="text-xs text-gray-500 truncate mt-0.5">
                      {booking.visitor.email}
                    </div>
                    <div className="mt-2 space-y-1 text-xs text-gray-600">
                      <div>
                        <span className="font-medium text-gray-700">Service:</span> {booking.package.offering.name}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Package:</span> {booking.package.name}
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
      <div className="mt-auto pt-4 border-t border-gray-100">
        <h4 className="font-title text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
          Booking Overview
        </h4>
        <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-emerald-700">Confirmed Bookings</div>
            <p className="text-[11px] text-gray-400 mt-0.5">Active reservations on your calendar</p>
          </div>
          <div className="text-2xl font-bold text-emerald-800 font-title leading-none">
            {bookingsWithDates.length}
          </div>
        </div>
      </div>

      {/* Recent Bookings List */}
      {bookingsWithDates.length > 0 && (
        <div className="mt-5 pt-4 border-t border-gray-100">
          <h4 className="font-title text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            Recent Client Bookings
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {bookingsWithDates.slice(0, 5).map((booking) => (
              <div
                key={booking.id}
                className="bg-gray-50/70 hover:bg-gray-50 border border-gray-100 rounded-xl p-2.5 text-xs transition-colors flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900 truncate">
                    {formatCoupleName(booking.visitor, "Couple")}
                  </div>
                  <div className="text-gray-500 truncate text-[11px] mt-0.5">
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

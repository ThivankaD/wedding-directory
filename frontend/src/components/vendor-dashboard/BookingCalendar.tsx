"use client";

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_VENDOR_PAYMENTS } from '@/graphql/queries';
import { useVendorAuth } from '@/contexts/VendorAuthContext';
import toast from 'react-hot-toast';

interface Payment {
  id: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
  bookingDate: string | null;
  visitor: {
    id: string;
    visitor_fname: string;
    visitor_lname: string;
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

  const { data, loading, error, refetch } = useQuery(GET_VENDOR_PAYMENTS, {
    variables: { vendorId: vendor?.id },
    skip: !vendor?.id,
  });

  const payments: Payment[] = data?.vendorPayments || [];

  // Filter payments with booking dates
  const bookingsWithDates = payments.filter(p => p.bookingDate);

  // Get bookings for selected date
  const getBookingsForDate = (date: Date) => {
    return bookingsWithDates.filter(p => {
      const bookingDate = new Date(p.bookingDate!);
      return bookingDate.toDateString() === date.toDateString();
    });
  };

  // Check if a date has bookings
  const hasBooking = (date: Date) => {
    return bookingsWithDates.some(p => {
      const bookingDate = new Date(p.bookingDate!);
      return bookingDate.toDateString() === date.toDateString();
    });
  };

  // Get booking status for a date (completed, pending, or both)
  const getDateStatus = (date: Date) => {
    const dateBookings = getBookingsForDate(date);
    const hasCompleted = dateBookings.some(b => b.status === 'completed');
    const hasPending = dateBookings.some(b => b.status === 'pending');
    
    if (hasCompleted && hasPending) return 'mixed';
    if (hasCompleted) return 'completed';
    if (hasPending) return 'pending';
    return null;
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

  if (loading) return <div className="bg-white p-6 rounded-lg shadow-lg">Loading bookings...</div>;
  if (error) return <div className="bg-white p-6 rounded-lg shadow-lg text-red-500">Error loading bookings</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg h-full">
      <h2 className="font-title text-[24px] font-bold mb-2">Booking Calendar</h2>
      <hr className="w-full h-px my-3 bg-gray-400 border-0" />

      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-3">
        <button
          onClick={goToPreviousMonth}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
        >
          &lt; Prev
        </button>
        <h3 className="text-lg font-bold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={goToNextMonth}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
        >
          Next &gt;
        </button>
      </div>

      {/* Legend */}
      <div className="flex gap-3 mb-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-200 border border-green-500 rounded"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-200 border border-yellow-500 rounded"></div>
          <span>Pending</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-bold text-gray-600 py-1 text-xs">
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

          let bgColor = 'bg-white hover:bg-gray-50';
          if (status === 'completed') bgColor = 'bg-green-200 hover:bg-green-300 border-green-500';
          if (status === 'pending') bgColor = 'bg-yellow-200 hover:bg-yellow-300 border-yellow-500';
          if (status === 'mixed') bgColor = 'bg-gradient-to-br from-green-200 to-yellow-200 hover:opacity-90';

          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              className={`aspect-square p-1 border rounded ${bgColor} ${
                isToday ? 'border-blue-500 border-2 font-bold' : 'border-gray-300'
              } ${isSelected ? 'ring-2 ring-orange' : ''} transition-all flex flex-col items-center justify-center`}
            >
              <div className="text-sm font-semibold">{date.getDate()}</div>
              {hasBooking(date) && (
                <div className="text-[10px] mt-0.5 leading-tight text-center">
                  {dateBookings.length} {dateBookings.length > 1 ? 'bookings' : 'booking'}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Booking Details */}
      {selectedDate && selectedDateBookings.length > 0 && (
        <div className="border-t pt-3 max-h-64 overflow-y-auto">
          <h3 className="font-bold text-base mb-2">
            {selectedDate.toLocaleDateString()}
          </h3>
          <div className="space-y-3">
            {selectedDateBookings.map((booking) => (
              <div key={booking.id} className="border rounded-lg p-3 bg-gray-50 text-sm">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">
                      {booking.visitor.visitor_fname} {booking.visitor.visitor_lname}
                    </div>
                    <div className="text-xs text-gray-600 truncate">{booking.visitor.email}</div>
                    <div className="mt-1 space-y-0.5">
                      <div className="text-xs"><span className="font-semibold">Service:</span> {booking.package.offering.name}</div>
                      <div className="text-xs"><span className="font-semibold">Package:</span> {booking.package.name}</div>
                      <div className="text-xs"><span className="font-semibold">Amount:</span> LKR {booking.amount.toFixed(2)}</div>
                      <div className="text-xs">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          booking.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => {
                        toast.error('Cancel booking functionality to be implemented');
                      }}
                      className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 whitespace-nowrap"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Section */}
      <div className="mt-4 border-t pt-3">
        <h3 className="font-bold text-base mb-2">Summary</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-green-50 p-2 rounded-lg border border-green-200">
            <div className="text-xl font-bold text-green-700">
              {payments.filter(p => p.status === 'completed').length}
            </div>
            <div className="text-xs text-gray-600">Completed</div>
          </div>
          <div className="bg-yellow-50 p-2 rounded-lg border border-yellow-200">
            <div className="text-xl font-bold text-yellow-700">
              {payments.filter(p => p.status === 'pending').length}
            </div>
            <div className="text-xs text-gray-600">Pending</div>
          </div>
        </div>
      </div>

      {/* User Details Section */}
      {bookingsWithDates.length > 0 && (
        <div className="mt-4 border-t pt-3">
          <h3 className="font-bold text-base mb-2">Recent Bookings</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {bookingsWithDates.slice(0, 5).map((booking) => (
              <div key={booking.id} className="bg-gray-50 p-2 rounded border border-gray-200 text-xs">
                <div className="font-semibold">
                  {booking.visitor.visitor_fname} {booking.visitor.visitor_lname}
                </div>
                <div className="text-gray-600 mt-0.5 space-y-0.5">
                  {booking.visitor.email && (
                    <div className="truncate">📧 {booking.visitor.email}</div>
                  )}
                  {booking.visitor.phone && (
                    <div>📱 {booking.visitor.phone}</div>
                  )}
                  {!booking.visitor.email && !booking.visitor.phone && (
                    <div className="text-gray-400 italic">No contact info</div>
                  )}
                </div>
                <div className="text-gray-500 mt-1">
                  {booking.package.name} - {new Date(booking.bookingDate!).toLocaleDateString()}
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

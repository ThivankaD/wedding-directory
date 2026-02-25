"use client";

import React, { useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer, Event, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useQuery } from '@apollo/client';
import { GET_VISITOR_BOOKINGS } from '@/graphql/queries';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface Booking {
  id: string;
  title: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  location?: string;
  serviceProvider?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  packageName: string;
  offeringName?: string;
  amount: number;
  createdAt: Date;
}

interface CalendarEvent extends Event {
  resource: Booking;
}

interface BookingCalendarProps {
  visitorId: string;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ visitorId }) => {
  const [selectedEvent, setSelectedEvent] = useState<Booking | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>('month');
  
  const { data, loading, error } = useQuery(GET_VISITOR_BOOKINGS, {
    variables: { visitorId },
    skip: !visitorId,
  });

  const events: CalendarEvent[] = useMemo(() => {
    if (!data?.getVisitorBookings) return [];

    return data.getVisitorBookings.map((booking: Booking) => {
      const eventDate = new Date(booking.date);
      
      return {
        id: booking.id,
        title: booking.title,
        start: eventDate,
        end: eventDate,
        resource: booking,
      };
    });
  }, [data]);

  const eventStyleGetter = (event: CalendarEvent) => {
    const status = event.resource.status;
    let backgroundColor = '#ffbe33';

    switch (status) {
      case 'Confirmed':
        backgroundColor = '#10b981'; // Green
        break;
      case 'Pending':
        backgroundColor = '#f59e0b'; // Yellow
        break;
      case 'Cancelled':
        backgroundColor = '#ef4444'; // Red
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event.resource);
  };

  const handleNavigate = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  const handleViewChange = (newView: View) => {
    setCurrentView(newView);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Error loading bookings: {error.message}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-3xl">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Booking Calendar</h2>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span className="text-gray-700">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            <span className="text-gray-700">Pending</span>
          </div>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
          <svg
            className="mx-auto h-10 w-10 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings yet</h3>
          <p className="mt-1 text-xs text-gray-500">Start planning your wedding by booking services.</p>
        </div>
      ) : (
        <div className="calendar-container" style={{ height: '480px' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={handleSelectEvent}
            onNavigate={handleNavigate}
            onView={handleViewChange}
            date={currentDate}
            view={currentView}
            views={['month']}
            popup
            toolbar={true}
          />
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white rounded-lg p-5 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-gray-900">{selectedEvent.title}</h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-2 text-sm">
              {selectedEvent.packageName && (
                <div>
                  <span className="text-gray-600 font-medium">Package:</span>
                  <span className="ml-2 text-gray-900">{selectedEvent.packageName}</span>
                </div>
              )}
              {selectedEvent.offeringName && (
                <div>
                  <span className="text-gray-600 font-medium">Service:</span>
                  <span className="ml-2 text-gray-900">{selectedEvent.offeringName}</span>
                </div>
              )}
              <div>
                <span className="text-gray-600 font-medium">Date:</span>
                <span className="ml-2 text-gray-900">{selectedEvent.date}</span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Time:</span>
                <span className="ml-2 text-gray-900">{selectedEvent.time}</span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Status:</span>
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium inline-block ${
                    selectedEvent.status === 'Confirmed'
                      ? 'bg-green-100 text-green-800'
                      : selectedEvent.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {selectedEvent.status}
                </span>
              </div>
              {selectedEvent.location && (
                <div>
                  <span className="text-gray-600 font-medium">Location:</span>
                  <span className="ml-2 text-gray-900">{selectedEvent.location}</span>
                </div>
              )}
              {selectedEvent.serviceProvider && (
                <div>
                  <span className="text-gray-600 font-medium">Provider:</span>
                  <span className="ml-2 text-gray-900">{selectedEvent.serviceProvider.name}</span>
                </div>
              )}
              <div>
                <span className="text-gray-600 font-medium">Amount:</span>
                <span className="ml-2 text-gray-900 font-semibold">
                  LKR {selectedEvent.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;

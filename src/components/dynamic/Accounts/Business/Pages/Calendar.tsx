"use client";
import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Sidebar from "@/components/dynamic/Accounts/Business/Global/Sidebar";
import Header from "@/components/dynamic/Accounts/Business/Global/Header";
import api from "@/services/auth";

interface UserData {
  id: string;
  first_name: string;
}

interface SubService {
  sub_services_id: {
    name: string;
  };
}

interface Article {
  label: string;
  featured_image: string;
}

interface Appointment {
  user_created: {
    first_name: string;
    last_name: string;
  };
  date_created: string;
  date: string;
  time: string;
  services?: SubService[];
  price: string | number;
  article: Article;
}

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  article: string;
  price: string | number;
  services: string;
  rawAppointment: Appointment;
}

const localizer = momentLocalizer(moment);

const CustomEvent = ({ event }: { event: CalendarEvent }) => {
  return (
    <div className="p-2 h-full w-full cursor-pointer">
      <div className="bg-blue-600 text-white p-2 rounded-md h-full">
        <div className="font-bold mb-1">{event.title}</div>
        <div className="text-sm">
          <div>{event.article}</div>
          <div>Price: {event.price} $</div>
        </div>
      </div>
    </div>
  );
};

// Simple Modal Component
const Modal = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
};

const CalendarComponent = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleUserDataFetched = (data: UserData | null) => {
    setUserData(data);
  };

  const fetchAppointments = async () => {
    try {
      const response = await api.get("/items/appointments", {
        params: {
          fields: [
            "user_created.first_name",
            "user_created.last_name",
            "date_created",
            "time",
            "date",
            "services.sub_services_id.name",
            "price",
            "article.label",
            "article.featured_image",
          ].join(","),
          deep: {
            services: {
              sub_services_id: {
                fields: ["name"],
              },
            },
          },
        },
      });

      const events: CalendarEvent[] = response.data.data.map((appointment: Appointment) => {
        // Parse the date and time correctly
        const [year, month, day] = appointment.date.split('-');
        const [hours, minutes] = appointment.time.split(':');
        
        // Create start date by combining date and time
        const startDate = new Date(
          parseInt(year),
          parseInt(month) - 1, // Month is 0-based in JavaScript
          parseInt(day),
          parseInt(hours),
          parseInt(minutes)
        );
        
        // End date is 1 hour after start
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
        
        return {
          title: `${appointment.user_created.first_name} ${appointment.user_created.last_name}`,
          start: startDate,
          end: endDate,
          article: appointment.article.label,
          price: appointment.price,
          services: appointment.services
            ?.map(service => service.sub_services_id?.name || "Unnamed Service")
            .join(", ") || "No services",
          rawAppointment: appointment,
        };
      });
      
      setAppointments(events);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <div className="">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`p-4 transition-transform ${
          isSidebarOpen ? "sm:ml-64" : "sm:ml-64"
        }`}
      >
        <div className="p-4 mt-20">
          <div className="flex flex-col">
            <div className="-m-1.5 overflow-x-auto">
              <div className="p-1.5 min-w-full inline-block align-middle">
                <div className="overflow-hidden">
                  <Calendar
                    localizer={localizer}
                    events={appointments}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                    components={{
                      event: CustomEvent,
                    }}
                    onSelectEvent={handleEventClick}
                    defaultView="week"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Modal for Appointment Details */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Appointment Details</h2>
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-500">Client</h4>
                <p className="text-lg">{selectedEvent.title}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-500">Service</h4>
                <p className="text-lg">{selectedEvent.article}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-500">Date & Time</h4>
                <p className="text-lg">
                  {moment(selectedEvent.start).format('MMMM D, YYYY')} at{' '}
                  {moment(selectedEvent.start).format('h:mm A')}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-500">Price</h4>
                <p className="text-lg">{selectedEvent.price} $</p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-500">Services</h4>
                <p className="text-lg">{selectedEvent.services}</p>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default CalendarComponent;
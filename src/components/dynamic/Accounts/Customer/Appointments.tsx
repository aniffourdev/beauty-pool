"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/dynamic/Accounts/Customer/Global/Sidebar";
import Header from "@/components/dynamic/Accounts/Customer/Global/Header";
import api from "@/services/auth";
import { Gruppo } from "next/font/google";
import { CiShop, CiShoppingCart } from "react-icons/ci";
import Link from "next/link";
import Appointment from "./Loadings/Appointment";

const gruppo = Gruppo({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: "400",
});

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
  slug: string;
  featured_image: string;
}

interface Appointment {
  id: string;
  user_created: {
    first_name: string;
    last_name: string;
  };
  date_created: string;
  date: string;
  time: string; // Add the time field
  booking_ref: string;
  services?: SubService[]; // Make services optional
  price: string | number;
  article: Article;
}

const CustomerAppointments = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state

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
            "id",
            "user_created.first_name",
            "user_created.last_name",
            "date_created",
            "date",
            "time", // Include the time field
            "services.sub_services_id.name",
            "price",
            "booking_ref",
            "article.label",
            "article.slug",
            "article.featured_image",
          ].join(","),
          // Try setting `deep` to ensure relationships are included
          deep: {
            services: {
              sub_services_id: {
                fields: ["name"], // Explicitly request the `name` field from `sub_services_id`
              },
            },
          },
        },
      });

      console.log("API Response:", response.data.data);
      setAppointments(response.data.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const formatTime = (time: string): string => {
    // Split the time string by the colon and take the first two parts
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  };

  const formatDate = (date: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return now;
  };

  const isUpcoming = (appointment: Appointment) => {
    // Get the appointment date and time
    const [hours, minutes] = appointment.time.split(":").map(Number);
    const appointmentDate = new Date(appointment.date);
    appointmentDate.setHours(hours, minutes, 0, 0);

    // Get current date and time
    const now = new Date();

    // Set both dates to start of their respective days for proper comparison
    const appointmentDay = new Date(appointmentDate).setHours(0, 0, 0, 0);
    const today = new Date(now).setHours(0, 0, 0, 0);

    // If the appointment is today, compare with current time
    if (appointmentDay === today) {
      return appointmentDate > now;
    }

    // If not today, simply compare the dates
    return appointmentDay > today;
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
          <h2 className={`${gruppo.className} text-4xl text-black font-bold mb-5`}>
            Appointments
          </h2>
          {loading ? (
            <Appointment />
          ) : (
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/3 p-4 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Appointments</h2>
                <div className="flex flex-col">
                  <div className="mb-4 border-b border-slate-200 pb-3">
                    <h3 className="text-lg font-semibold mb-1.5">Upcoming</h3>
                    {appointments.length === 0 ? (
                      <p>No upcoming appointments</p>
                    ) : (
                      appointments
                        .filter((appointment) => isUpcoming(appointment))
                        .map((appointment) => (
                          <div
                            key={appointment.id}
                            className="p-4 bg-sky-50 border border-sky-100 rounded-lg mb-2 cursor-pointer"
                            onClick={() => handleAppointmentClick(appointment)}
                          >
                            <div className="flex items-center">
                              <div
                                className="w-12 h-12 bg-gray-200 rounded-full bg-cover bg-center mr-4"
                                style={{
                                  backgroundImage: `url(https://brandlybook.store/assets/${appointment.article.featured_image})`,
                                }}
                              ></div>
                              <div>
                                <h4 className="text-md font-semibold">
                                  {appointment.article.label}
                                </h4>
                                <p className="text-gray-600 text-sm">
                                  {formatDate(appointment.date)} at{" "}
                                  {formatTime(appointment.time)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1.5">Past</h3>
                    {appointments.length === 0 ? (
                      <p>No past appointments</p>
                    ) : (
                      appointments
                        .filter((appointment) => !isUpcoming(appointment))
                        .map((appointment) => (
                          <div
                            key={appointment.id}
                            className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg mb-2 cursor-pointer"
                            onClick={() => handleAppointmentClick(appointment)}
                          >
                            <div className="flex items-center">
                              <div
                                className="w-12 h-12 bg-gray-200 rounded-full bg-cover bg-center mr-4"
                                style={{
                                  backgroundImage: `url(https://brandlybook.store/assets/${appointment.article.featured_image})`,
                                }}
                              ></div>
                              <div>
                                <h4 className="text-md font-semibold">
                                  {appointment.article.label}
                                </h4>
                                <p className="text-gray-600 text-sm">
                                  {formatDate(appointment.date)} at{" "}
                                  {formatTime(appointment.time)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full md:w-2/3 p-4 bg-white rounded-lg shadow-md ml-4">
                {selectedAppointment ? (
                  <div>
                    <h2 className="text-xl font-bold mb-4">
                      {selectedAppointment.article.label}
                    </h2>
                    <img
                      src={`https://brandlybook.store/assets/${selectedAppointment.article.featured_image}`}
                      alt={selectedAppointment.article.label}
                      className="w-full h-64 object-cover mb-4 rounded-lg"
                    />
                    <p className="text-xl text-black font-bold mb-2">
                      {formatDate(selectedAppointment.date)} at{" "}
                      {formatTime(selectedAppointment.time)}
                    </p>
                    <p className="text-sm text-slate-500 font-medium mb-2">
                      Duration: 45 minutes
                    </p>
                    <div className="lg:flex my-3 gap-2">
                      <div className="lg:w-6/12">
                        <button className="bg-white border-2 border-slate-100 hover:bg-slate-50 font-semibold rounded w-full py-5 flex justify-start px-4 items-center gap-3">
                          <div className="flex justify-center items-center h-11 w-11 rounded-full bg-orange-100">
                            <CiShoppingCart className="size-6 text-orange-400" />
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-black">Book again</p>
                            <span className="font-normal text-slate-500 text-sm">
                              Book your next appointment
                            </span>
                          </div>
                        </button>
                      </div>
                      <div className="lg:w-6/12">
                        <Link href={`/a/${selectedAppointment.article.slug}`}>
                          <button className="bg-white border-2 border-slate-100 hover:bg-slate-50 font-semibold rounded w-full py-5 flex justify-start px-4 items-center gap-3">
                            <div className="flex justify-center items-center h-11 w-11 rounded-full bg-orange-100">
                              <CiShop className="size-6 text-orange-400" />
                            </div>
                            <div className="text-left">
                              <p className="font-semibold text-black">
                                Venue details
                              </p>
                              <span className="font-normal text-slate-500 text-sm">
                                {selectedAppointment.article.label}
                              </span>
                            </div>
                          </button>
                        </Link>
                      </div>
                    </div>
                    <p className="text-lg font-semibold mb-2">Venue details</p>
                    <p className="text-lg mb-4">
                      {selectedAppointment.article.label}
                    </p>
                    <p className="text-lg font-semibold mb-2">Overview</p>
                    <div className="flex justify-between mb-2">
                      <p className="text-lg">
                        {selectedAppointment.services
                          ?.map((service) => service.sub_services_id.name)
                          .join(", ")}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-lg font-semibold">Total</p>
                      <p className="text-xl text-emerald-600 font-bold">
                        {selectedAppointment.price} $
                      </p>
                    </div>
                    <div className="mt-5 font-semibold text-slate-800">
                      <span className="text-slate-500 font-semibold text-sm">
                        Referance:
                      </span>
                      <span className="ml-1 text-sm font-bold px-0.5">
                        {selectedAppointment.booking_ref}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p>Select an appointment to view details.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerAppointments;
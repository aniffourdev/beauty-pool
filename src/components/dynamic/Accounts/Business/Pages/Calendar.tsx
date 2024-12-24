"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/dynamic/Accounts/Business/Global/Sidebar";
import Header from "@/components/dynamic/Accounts/Business/Global/Header";
import api from "@/services/auth";
import { Gruppo } from "next/font/google";

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
  featured_image: string;
}

interface Appointment {
  user_created: {
    first_name: string;
    last_name: string;
  };
  date_created: string;
  date: string;
  time: string; // Add the time field
  services?: SubService[]; // Make services optional
  price: string | number;
  article: Article;
}

const CalendarComponent = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

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
            "time", // Include the time field
            "date",
            "services.sub_services_id.name",
            "price",
            "article.label",
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
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                        >
                          Article
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                        >
                          Customer
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                        >
                          Price
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                        >
                          Services
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                        >
                          Details
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                      {appointments.map((appointment, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 flex justify-start items-center gap-2 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-800">
                            <div className="w-9 h-9 bg-gray-200 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(https://maoulaty.shop/assets/${appointment.article.featured_image})` }}></div>
                            {appointment.article.label}
                          </td>
                          <td className="px-6 py-4 font-bold whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                            {formatDate(appointment.date)} <span className="font-medium">at{"" }</span> {formatTime(appointment.time)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                            {appointment.user_created.first_name}{" "}
                            {appointment.user_created.last_name}
                          </td>
                          <td className="px-6 py-4 font-bold whitespace-nowrap text-sm text-emerald-800 dark:text-neutral-200">
                            <span className="px-1.5 rounded py-0.5 bg-emerald-100">
                              {appointment.price} AED
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                            {appointment.services &&
                            appointment.services.length > 0
                              ? appointment.services.map(
                                  (service, serviceIndex) => (
                                    <div key={serviceIndex}>
                                      {/* Ensure that sub_services_id and name are correctly accessed */}
                                      {service.sub_services_id?.name ||
                                        "Unnamed Service"}
                                    </div>
                                  )
                                )
                              : "No Services"}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                            <button
                              type="button"
                              className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-none focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:text-blue-400"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarComponent;

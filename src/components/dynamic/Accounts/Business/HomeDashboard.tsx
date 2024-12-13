"use client";
import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import BookDashboard from "./BookDashboard";
import PaymentsDashboard from "./PaymentsDashboard";
import Sidebar from "@/components/dynamic/Accounts/Business/Global/Sidebar";
import Header from "@/components/dynamic/Accounts/Business/Global/Header";

// Define a type for user data
interface UserData {
  id: string;
  first_name: string;
}

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HomeDashboard = () => {
  const [activePage] = useState("home");
  const [searchTerm, setSearchTerm] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleUserDataFetched = (data: UserData | null) => {
    setUserData(data);
  };

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Total Revenue",
        data: [1200, 1900, 2500, 2700, 3000],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="">
      <Header
        toggleSidebar={toggleSidebar}
        onUserDataFetched={handleUserDataFetched}
      />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`p-4 transition-transform ${
          isSidebarOpen ? "sm:ml-64" : "sm:ml-64"
        }`}
      >
        <div className="p-4 mt-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div className="text-3xl font-semibold">
                Welcome, {userData?.first_name || "Loading..."}
              </div>
            </div>

            {/* Search Bar */}
            <form className="">
              <label
                htmlFor="default-search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
              >
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  id="default-search"
                  className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-violet-500 focus:border-slate-300 !outline-none"
                  placeholder="Search Mockups, Logos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="text-white absolute end-2.5 bottom-2.5 bg-[#f39685] hover:bg-[#f08774] transition-all duration-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="my-14">
              <div className="border-t border-slate-200"></div>
            </div>

            {activePage === "home" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 ">
                <div className="bg-white shadow-xl rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">Total Bookings</h3>
                  <p className="text-3xl font-bold">150</p>
                  <p className="text-sm text-gray-500">Since last month</p>
                </div>

                <div className="bg-white shadow-xl rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">Total Revenue</h3>
                  <p className="text-3xl font-bold">$5,200</p>
                  <p className="text-sm text-gray-500">This month</p>
                </div>

                <div className="bg-white shadow-xl rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    Upcoming Appointments
                  </h3>
                  <p className="text-3xl font-bold">12</p>
                  <p className="text-sm text-gray-500">In the next 7 days</p>
                </div>
              </div>
            )}

            {activePage === "bookings" && (
              <BookDashboard searchTerm={searchTerm} />
            )}
            {activePage === "payments" && <PaymentsDashboard />}
            {/* Analytics (Charts) */}
            <div className="lg:flex gap-10">
              <div className="lg:w-6/12 mb-6">
                <div className="bg-white shadow-xl rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-4">Revenue Trends</h3>
                  <Line data={chartData} />
                </div>
              </div>
              <div className="lg:w-6/12">
                <div className="bg-white shadow-xl rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-4">Revenue Trends</h3>
                  <Line data={chartData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;

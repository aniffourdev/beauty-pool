"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/dynamic/Accounts/Customer/Global/Header";
import Sidebar from "@/components/dynamic/Accounts/Customer/Global/Sidebar";
import { useRouter } from "next/navigation";
import api from "@/services/auth";
import EditModal from "@/components/dynamic/Accounts/Customer/Profile/EditProfile";
import { TbHome } from "react-icons/tb";
import { MdOutlineBusinessCenter } from "react-icons/md";
import HomeAddress from "@/components/dynamic/Accounts/Customer/Profile/HomeAddress";
import WorkAddress from "@/components/dynamic/Accounts/Customer/Profile/WorkAddress";
import { AiOutlineCamera } from "react-icons/ai";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import { Gruppo } from "next/font/google";
import { UserData } from "@/types/UserData"; // Update the path accordingly
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const gruppo = Gruppo({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: "400",
});

const Appointments = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleUserDataFetched = (data: UserData | null) => {
    setUserData(data);
  };

  return (
    <>
      <ToastContainer />
      <div className="">
        <Header toggleSidebar={toggleSidebar} />
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div
          className={`p-4 transition-transform ${
            isSidebarOpen ? "sm:ml-64" : "sm:ml-64"
          }`}
        >
          <div className="p-4 mt-20 max-w-6xl mx-auto">
            <>
              <h1 className={`${gruppo.className} text-3xl font-bold mb-8`}></h1>
              <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl font-semibold mb-6">Appointments</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="md:col-span-1 lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow">
                      <h2 className="text-lg font-medium mb-4">Upcoming</h2>
                      <div className="border border-gray-200 rounded-lg p-6 text-center">
                        <i className="fas fa-calendar-alt text-4xl text-purple-500 mb-4"></i>
                        <p className="text-lg font-medium mb-2">No upcoming appointments</p>
                        <p className="text-gray-500 mb-4">Your upcoming appointments will appear here when you book</p>
                        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg">Search salons</button>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h2 className="text-lg font-medium mb-4">Past</h2>
                      <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-4">
                        <img src="https://placehold.co/80x80" alt="Barbershop interior" className="w-20 h-20 rounded-lg object-cover"/>
                        <div>
                          <p className="text-sm font-medium">Edge Barbershop Trondheim</p>
                          <p className="text-sm text-gray-500">Tue, Dec 10, 2024 at 10:00</p>
                          <p className="text-sm text-gray-500">NOK 770 · 1 item</p>
                          <button className="text-purple-500 text-sm mt-2">Book again</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 lg:col-span-2">
                    <div className="bg-white p-6 rounded-lg shadow">
                      <img src="https://placehold.co/600x300" alt="Barbershop interior" className="w-full h-64 object-cover rounded-lg mb-4"/>
                      <h2 className="text-2xl font-semibold mb-2">Edge Barbershop Trondheim</h2>
                      <span className="inline-block bg-red-100 text-red-500 text-sm px-2 py-1 rounded mb-4">No show</span>
                      <p className="text-lg font-medium mb-2">Tue, Dec 10, 2024 at 10:00</p>
                      <p className="text-gray-500 mb-4">45 minutes duration</p>
                      <div className="flex items-center space-x-4 mb-6">
                        <button className="flex items-center space-x-2 text-purple-500">
                          <i className="fas fa-redo-alt"></i>
                          <span>Book again</span>
                        </button>
                        <button className="flex items-center space-x-2 text-purple-500">
                          <i className="fas fa-map-marker-alt"></i>
                          <span>Venue details</span>
                        </button>
                      </div>
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Overview</h3>
                        <div className="flex justify-between text-sm mb-2">
                          <span>HERREKLIPP (HAIRCUT)</span>
                          <span>NOK 770</span>
                        </div>
                        <p className="text-sm text-gray-500">45 mins with Samuel</p>
                      </div>
                      <div className="flex justify-between text-lg font-medium mb-6">
                        <span>Total</span>
                        <span>NOK 770</span>
                      </div>
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Cancellation policy</h3>
                        <p className="text-sm text-gray-500">Please avoid cancelling within <span className="font-medium">6 hours</span> of your appointment time</p>
                      </div>
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Important info</h3>
                        <p className="text-sm text-gray-500">Vi tar gebyr ved ikke møtt til avtalt time</p>
                      </div>
                      <p className="text-sm text-gray-500">Booking ref: 57279EB4</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          </div>
        </div>
      </div>
    </>
  );
};

export default Appointments;

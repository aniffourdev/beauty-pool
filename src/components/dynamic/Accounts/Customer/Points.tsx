"use client";
import React, { useState } from "react";
import Header from "@/components/dynamic/Accounts/Customer/Global/Header";
import Sidebar from "@/components/dynamic/Accounts/Customer/Global/Sidebar";
import "react-toastify/dist/ReactToastify.css";
import { Gruppo } from "next/font/google";
import { DataUser } from "@/types/UserData"; // Update the path accordingly
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const gruppo = Gruppo({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: "400",
});

const Points = () => {
  const [userData, setUserData] = useState<DataUser | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleUserDataFetched = (data: DataUser | null) => {
    setUserData(data);
  };

  return (
    <>
      <div className="">
        <Header toggleSidebar={toggleSidebar} />
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div
          className={`p-4 transition-transform ${
            isSidebarOpen ? "sm:ml-64" : "sm:ml-64"
          }`}
        >
          <div className="p-4 mt-20 max-w-6xl mx-auto">
            <h1 className={`${gruppo.className} text-3xl font-bold mb-8`}>My Points</h1>


            {/* HNA CALENDAR */}

          </div>
        </div>
      </div>
    </>
  );
};

export default Points;

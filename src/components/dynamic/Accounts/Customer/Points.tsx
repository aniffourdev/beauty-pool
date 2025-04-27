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

  const [activeTab, setActiveTab] = useState<string>("points");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
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
            <h1 className={`${gruppo.className} text-3xl font-bold mb-8`}>
              My Points
            </h1>

            <div className="max-w-screen-md">
              <div className="lg:flex gap-5 mb-8">
                <div className="lg:w-6/12">
                  <div className="bg-slate-200 h-48 rounded w-full"></div>
                </div>
                <div className="lg:w-6/12">
                  <div className="bg-slate-200 h-48 rounded w-full"></div>
                </div>
              </div>
              <div className="flex flex-col items-start w-full">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleTabClick("points")}
                    className={`px-4 py-2 rounded-t-lg ${
                      activeTab === "points"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    } transition-colors duration-300`}
                  >
                    Paying Using Points
                  </button>
                  <button
                    onClick={() => handleTabClick("money")}
                    className={`px-4 py-2 rounded-t-lg ${
                      activeTab === "money"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    } transition-colors duration-300`}
                  >
                    Paying Using Money
                  </button>
                </div>
                <div className="w-full border-t border-gray-300">
                  {activeTab === "points" && (
                    <div className="p-4 bg-white rounded-b-lg shadow-md transition-opacity duration-300">
                      Content for Paying Using Points
                    </div>
                  )}
                  {activeTab === "money" && (
                    <div className="p-4 bg-white rounded-b-lg shadow-md transition-opacity duration-300">
                      Content for Paying Using Money
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Points;

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

const Favourites = () => {
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
                <h1 className={`${gruppo.className} text-3xl font-bold mb-8`}>Favourites</h1>
              </>
          </div>
        </div>
      </div>
    </>
  );
};

export default Favourites;

"use client";
import React, { useState, useEffect } from "react";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { FiUser } from "react-icons/fi";
import { LuSettings } from "react-icons/lu";
import { IoLogOutOutline } from "react-icons/io5";
import Cookies from "js-cookie"; // Assuming cookies are used for login state
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/services/auth";

// UserData interface to structure user information
interface UserData {
  first_name?: string;
}

const Drawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();
  const [, setLoading] = useState(true);

  // Fetch user data to determine if the user is logged in
  useEffect(() => {
    const getMe = async () => {
      try {
        const response = await api.get("/users/me");
        setUserData(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    getMe();
  }, []);

  // Toggle the drawer (dropdown menu)
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  // Handle logout
  const handleLogout = () => {
    // Clear cookies and redirect to home
    Cookies.remove("access_token");
    router.push("/"); // Redirect to homepage or login page
  };

  const truncatedName = userData?.first_name
    ? userData.first_name.slice(0, 5) +
      (userData.first_name.length > 5 ? ".." : "")
    : "Join";

  return (
    <div>
      {/* "Join" button with dynamic text and icon based on user state */}
      <button
        className="flex lg:hidden justify-start items-center border-2 border-[#d2897d5e] rounded-full py-0.5 px-3"
        onClick={toggleDrawer}
      >
        <span className="font-extralight text-[15px] text-black">
          {truncatedName}
        </span>
        {isOpen ? (
          <MdOutlineKeyboardArrowUp className="text-slate-700 size-6" />
        ) : (
          <MdOutlineKeyboardArrowDown className="text-slate-700 size-6" />
        )}
      </button>

      {/* Dropdown menu */}
      <div
        className={`absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg py-1.5 text-gray-900 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {userData ? (
          // If logged in, show profile, settings, and logout options
          <>
            <Link
              href="/profile"
              className="px-4 py-1.5 hover:bg-gray-100 text-sm font-semibold flex justify-start items-center gap-1"
            >
              <FiUser className="size-4 relative -top-[1px]" />
              <span>Profile</span>
            </Link>
            <Link
              href="/settings"
              className="px-4 py-1.5 hover:bg-gray-100 text-sm font-semibold flex justify-start items-center gap-1"
            >
              <LuSettings className="size-4 relative -top-[1px]" />
              <span>Settings</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-1.5 hover:bg-gray-100 text-sm font-semibold flex justify-start items-center gap-1"
            >
              <IoLogOutOutline className="size-[19px] relative -top-[0.5px]" />
              <span>Sign Out</span>
            </button>
          </>
        ) : (
          // If not logged in, show Sign In and Sign Up buttons
          <>
            <Link
              href="/login"
              className="px-4 py-1.5 hover:bg-gray-100 text-sm font-semibold flex justify-start items-center gap-1"
            >
              <span>Sign In</span>
            </Link>
            <Link
              href="/signup"
              className="px-4 py-1.5 hover:bg-gray-100 text-sm font-semibold flex justify-start items-center gap-1"
            >
              <span>Sign Up</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Drawer;

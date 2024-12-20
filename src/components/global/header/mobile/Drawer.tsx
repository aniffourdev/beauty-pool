"use client";
import React, { useState } from "react";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { FiUser } from "react-icons/fi";
import { LuSettings } from "react-icons/lu";
import { IoLogOutOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import api from "@/services/auth";

interface UserData {
  first_name?: string;
  last_name?: string;
  avatar?: string;
}

const Drawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication status and fetch user data if authenticated
  React.useEffect(() => {
    const checkAuthAndFetchUser = async () => {
      const token = Cookies.get("access_token");
      setIsAuthenticated(!!token);

      if (token) {
        try {
          const response = await api.get("/users/me");
          setUserData(response.data.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
          if ((error as any)?.response?.status === 401) {
            handleLogout();
          }
        }
      }
      setIsLoading(false);
    };

    checkAuthAndFetchUser();
  }, []);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    Cookies.remove("access_token");
    Cookies.remove("directus_session_token");
    Cookies.remove("refresh_token");
    setIsAuthenticated(false);
    setUserData(null);
    setIsOpen(false);
    router.push("/");
  };

  const truncatedName = userData?.first_name
    ? userData.first_name.slice(0, 5) +
      (userData.first_name.length > 5 ? ".." : "")
    : "Join";

  if (isLoading) {
    return (
      <div className="flex lg:hidden justify-start items-center border-2 border-[#d2897d5e] rounded-full py-0.5 px-3">
        <span className="animate-pulse font-extralight text-[15px] text-black">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <div className="relative">
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

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg py-1.5 text-gray-900 z-50">
          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                className="px-4 py-1.5 hover:bg-gray-100 text-sm font-semibold flex justify-start items-center gap-1"
                onClick={() => setIsOpen(false)}
              >
                <FiUser className="size-4 relative -top-[1px]" />
                <span>Profile</span>
              </Link>
              <Link
                href="/settings"
                className="px-4 py-1.5 hover:bg-gray-100 text-sm font-semibold flex justify-start items-center gap-1"
                onClick={() => setIsOpen(false)}
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
            <>
              <Link
                href="/login"
                className="px-4 py-1.5 hover:bg-gray-100 text-sm font-semibold flex justify-start items-center gap-1"
                onClick={() => setIsOpen(false)}
              >
                <span>Sign In</span>
              </Link>
              <Link
                href="/signup"
                className="px-4 py-1.5 hover:bg-gray-100 text-sm font-semibold flex justify-start items-center gap-1"
                onClick={() => setIsOpen(false)}
              >
                <span>Sign Up</span>
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Drawer;
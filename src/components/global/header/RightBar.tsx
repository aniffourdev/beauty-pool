"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { HiMiniUserPlus } from "react-icons/hi2";
import { IoLogInSharp, IoLogOutOutline } from "react-icons/io5";
import Cookies from "js-cookie";
import api from "@/services/auth";
import Image from "next/image";
import { FiUser } from "react-icons/fi";
import { LuSettings } from "react-icons/lu";
import { useRouter } from "next/navigation";

interface UserData {
  avatar?: string;
  first_name?: string;
  last_name?: string;
}

const RightBar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [, setLoading] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const router = useRouter();

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

  useEffect(() => {
    // Check if access_token exists in cookies
    const token = Cookies.get("access_token");
    setIsAuthenticated(!!token);
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = () => {
    Cookies.remove("access_token");
    Cookies.remove("directus_session_token");
    Cookies.remove("refresh_token");
    router.push("/");
    setDropdownVisible(false);
  };

  return (
    <>
      {isAuthenticated ? (
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 py-1 px-2 sm:py-1.5 sm:px-3 md:py-2 md:px-4 lg:py-2 lg:px-5 rounded-full bg-gray-900 border-[1px] border-black text-white font-semibold hover:bg-black/80 transition-all"
          >
            {userData ? (
              <>
                {userData.avatar ? (
                  <Image
                    src={`https://maoulaty.shop/assets/${userData.avatar}`}
                    alt={userData.first_name || "User"}
                    width={25}
                    height={25}
                    className="rounded-full"
                  />
                ) : (
                  <div className="bg-purple-100 rounded-full h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-9 lg:w-9 flex items-center justify-center text-purple-600 text-xs font-bold">
                    {userData.first_name?.[0]?.toUpperCase()}
                    {userData.last_name?.[0]?.toUpperCase()}
                  </div>
                )}
                <span className="text-xs sm:text-sm md:text-base lg:text-lg px-1.5">
                  {userData.first_name}{" "}
                  <span className="hidden lg:inline">{userData.last_name}</span>
                </span>
              </>
            ) : (
              "Loading..."
            )}
          </button>

          {/* Dropdown Menu */}
          {dropdownVisible && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg py-1 text-gray-900">
              <Link
                href="/profile"
                className="px-3 py-1 text-xs sm:text-sm md:text-base hover:bg-gray-100 font-semibold flex justify-start items-center gap-1"
              >
                <FiUser className="size-3 relative -top-[1px]" />
                <span>Profile</span>
              </Link>
              <Link
                href="/settings"
                className="px-3 py-1 text-xs sm:text-sm md:text-base hover:bg-gray-100 font-semibold flex justify-start items-center gap-1"
              >
                <LuSettings className="size-3 relative -top-[1px]" />
                <span>Settings</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full px-3 py-1 text-xs sm:text-sm md:text-base hover:bg-gray-100 font-semibold flex justify-start items-center gap-1"
              >
                <IoLogOutOutline className="size-[16px] relative -top-[0.5px]" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5 justify-center items-center pr-5 lg:pr-0">
          {/* Sign Up Button */}
          <Link href="/signup">
            <button className="py-1.5 px-4 text-md rounded-full bg-gray-900 border-[1px] border-black text-white font-semibold hover:bg-black/80 transition-all">
              Sign Up{" "}
              <HiMiniUserPlus className="inline-block size-4.5 relative -top-[1px] ml-1" />
            </button>
          </Link>
          {/* Sign In Button */}
          <Link href="/login">
            <button className="py-1.5 px-4 text-md rounded-full bg-white border-[1px] border-gray-800 border-opacity-30 text-gray-900 font-semibold hover:bg-slate-100 transition-all">
              Sign In{" "}
              <IoLogInSharp className="inline-block size-5 relative -top-[1px] ml-1" />
            </button>
          </Link>
        </div>
      )}
    </>
  );
};

export default RightBar;

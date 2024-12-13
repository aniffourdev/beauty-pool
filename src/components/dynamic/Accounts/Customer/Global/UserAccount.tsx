// UserAccount.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { IoLogOutOutline } from "react-icons/io5";
import Cookies from "js-cookie";
import { FiUser } from "react-icons/fi";
import { LuSettings } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

const UserAccount = () => {
  const { userData, loading } = useUser();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const handleLogout = () => {
    Cookies.remove("access_token");
    Cookies.remove("directus_session_token");
    Cookies.remove("refresh_token");
    router.push("/");
    setDropdownVisible(false);
  };

  const renderUserAvatar = () => {
    if (loading) {
      return <div className="skeleton h-8 w-32 rounded-full"></div>;
    }

    if (userData?.avatar) {
      return (
        <div
          className="bg-purple-100 rounded-full h-7 w-7 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://maoulaty.shop/assets/${userData.avatar})`,
          }}
        ></div>
      );
    }

    return (
      <div className="bg-purple-100 rounded-full h-8 w-8 flex items-center justify-center text-purple-600 text-sm font-bold">
        {userData?.first_name?.[0]?.toUpperCase()}
        {userData?.last_name?.[0]?.toUpperCase()}
      </div>
    );
  };

  return (
    <div className="relative top-0.5">
      <div className="flex justify-center items-center gap-3">
        <div className="relative">
          <div
            onClick={toggleDropdown}
            className="flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {renderUserAvatar()}
            {userData && (
              <span className="font-semibold text-black">
                {userData.first_name} {userData.last_name}
              </span>
            )}
          </div>

          {dropdownVisible && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg py-1.5 text-gray-900">
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
              <div
                onClick={handleLogout}
                className="w-full px-4 py-1.5 hover:bg-gray-100 text-sm font-semibold flex justify-start items-center gap-1 cursor-pointer"
              >
                <IoLogOutOutline className="size-[19px] relative -top-[0.5px]" />
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAccount;

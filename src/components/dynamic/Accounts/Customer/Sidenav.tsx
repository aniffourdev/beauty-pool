"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FiUser } from "react-icons/fi";
import { IoCalendarOutline } from "react-icons/io5";
import { TiHeartOutline } from "react-icons/ti";
import { LuSettings } from "react-icons/lu";
import api from "@/services/auth";

interface UserData {
  first_name: string;
  last_name: string;
}

const sidenavItems = [
  { name: "Profile", icon: <FiUser className="size-5" />, link: "/profile" },
  {
    name: "Appointments",
    icon: <IoCalendarOutline className="size-5" />,
    link: "/appointments",
  },
  {
    name: "Favourites",
    icon: <TiHeartOutline className="size-6" />,
    link: "/favourites",
  },
  {
    name: "Settings",
    icon: <LuSettings className="size-5" />,
    link: "/settings",
  },
];

const Sidenav = () => {
  const [activeItem, setActiveItem] = useState("Profile");
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getMe = async () => {
      try {
        const response = await api.get("/users/me");
        setUserData(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.push("/login");
      }
    };
    getMe();
  }, [router]);

  useEffect(() => {}, []);

  return (
    <div className="w-64 h-screen bg-white border-r-[1px] border-gray-100 shadow-md p-4 pt-6 fixed top-[82px] hidden lg:block">
      <>
        <h1 className="text-xl font-bold mb-6">
          {userData?.first_name} {userData?.last_name}
        </h1>
        <ul>
          {sidenavItems.map((item) => (
            <li key={item.name} className="mb-4">
              <Link
                href={item.link}
                className={`flex items-center gap-1 p-2 rounded-md ${
                  activeItem === item.name ? "bg-violet-200" : ""
                }`}
                onClick={() => setActiveItem(item.name)}
              >
                {item.icon}
                <span className="font-semibold">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </>
    </div>
  );
};

export default Sidenav;

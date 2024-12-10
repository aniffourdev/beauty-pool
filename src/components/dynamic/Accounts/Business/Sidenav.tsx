"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import api from "@/services/auth";
import { LuCalendar, LuSettings, LuUsers } from "react-icons/lu";
import {
  MdOutlineDashboard,
  MdOutlineHomeRepairService,
  MdOutlinePayments,
} from "react-icons/md";
import { BsBoxes } from "react-icons/bs";

interface UserData {
  avatar?: string;
  first_name?: string;
  last_name?: string;
}

const sidenavItems = [
  {
    name: "Dashboard",
    icon: <MdOutlineDashboard className="size-5 text-[#b64077]" />,
    link: "/business",
  },
  {
    name: "Calendar",
    icon: <LuCalendar className="size-5 text-[#b64077]" />,
    link: "/business/calendar",
  },
  {
    name: "Clients",
    icon: <LuUsers className="size-6 text-[#b64077]" />,
    link: "/business/clients",
  },
  {
    name: "Products",
    icon: <BsBoxes className="size-5 text-[#b64077]" />,
    link: "/business/products",
  },
  {
    name: "Services",
    icon: <MdOutlineHomeRepairService className="size-5 text-[#b64077]" />,
    link: "/business/services",
  },
  {
    name: "Payments",
    icon: <MdOutlinePayments className="size-5 text-[#b64077]" />,
    link: "/business/payments",
  },
  {
    name: "Settings",
    icon: <LuSettings className="size-5 text-[#b64077]" />,
    link: "/business/settings",
  },
];

const Sidenav = () => {
  const [activeItem, setActiveItem] = useState("Profile");
  const [, setUserData] = useState<UserData | null>(null);
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
    <div className="w-48 h-screen bg-slate-800 shadow-md p-4 pt-10 fixed top-[60px] hidden lg:block">
      <>
        <ul>
          {sidenavItems.map((item) => (
            <li key={item.name} className="mb-4">
              <Link
                href={item.link}
                className={`flex items-center text-violet-300 gap-1 p-2 rounded-md ${
                  activeItem === item.name ? "bg-slate-900" : ""
                }`}
                onClick={() => setActiveItem(item.name)}
              >
                {item.icon}
                <span className="font-semibold text-slate-100">
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </>
    </div>
  );
};

export default Sidenav;

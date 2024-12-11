"use client";
import React from "react";
import Link from "next/link";
import { LuSettings } from "react-icons/lu";
import { FiUser } from "react-icons/fi";
import { IoCalendarOutline } from "react-icons/io5";
import { TiHeartOutline } from "react-icons/ti";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const sidenavItems = [
  {
    name: "Profile",
    icon: <FiUser className="size-5 text-[#f47c66]" />,
    link: "/profile",
  },
  {
    name: "Appointments",
    icon: <IoCalendarOutline className="size-5 text-[#f47c66]" />,
    link: "/appointments",
  },
  {
    name: "Favorites",
    icon: <TiHeartOutline className="size-6 text-[#f47c66]" />,
    link: "/favorites",
  },
  {
    name: "Setting",
    icon: <LuSettings className="size-5 text-[#f47c66]" />,
    link: "/setting",
  }
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const [activeItem, setActiveItem] = React.useState("Dashboard");

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 ${
        isOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
      }`}
      aria-label="Sidebar"
    >
      <div className="h-full px-3 pb-4 pt-5 overflow-y-auto bg-white">
        <ul className="space-y-2 font-medium">
          {sidenavItems.map((item) => (
            <li key={item.name} className="">
              <Link
                href={item.link}
                className={`flex items-center p-2 font-semibold text-black hover:bg-slate-100 rounded group ${
                  activeItem === item.name ? "text-[#b64077]" : "text-[#b64077]"
                }`}
                onClick={() => setActiveItem(item.name)}
              >
                {item.icon}
                <span className="ms-3">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
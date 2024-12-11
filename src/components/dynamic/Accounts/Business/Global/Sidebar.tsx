"use client";
import React from "react";
import Link from "next/link";
import { LuCalendar, LuSettings, LuUsers } from "react-icons/lu";
import {
  MdOutlineDashboard,
  MdOutlineHomeRepairService,
  MdOutlinePayments,
} from "react-icons/md";
import { BsBoxes } from "react-icons/bs";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
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

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const [activeItem, setActiveItem] = React.useState("Dashboard");

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 ${
        isOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
      }`}
      aria-label="Sidebar"
    >
      <div className="h-full px-3 pb-4 pt-5 overflow-y-auto bg-slate-800">
        <ul className="space-y-2 font-medium">
          {sidenavItems.map((item) => (
            <li key={item.name} className="">
              <Link
                href={item.link}
                className={`flex items-center p-2 font-semibold text-white hover:bg-slate-900 rounded group ${
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

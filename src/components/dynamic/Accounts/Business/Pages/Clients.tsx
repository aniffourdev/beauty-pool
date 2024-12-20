"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/dynamic/Accounts/Business/Global/Sidebar";
import Header from "@/components/dynamic/Accounts/Business/Global/Header";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FiPlus } from "react-icons/fi";
import api from "@/services/auth";
import Image from "next/image";
import Link from "next/link";
import { Gruppo, Inter } from "next/font/google";

const gruppo = Gruppo({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: "400",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: "400",
});

interface UserData {
  id: string;
  first_name: string;
}

interface Article {
  id: string;
  label: string;
  featured_image: string;
  address: string;
  user_created: string;
}

const Clients = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleUserDataFetched = (data: UserData | null) => {
    setUserData(data);
  };

  return (
    <div className="">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`p-4 transition-transform ${
          isSidebarOpen ? "sm:ml-64" : "sm:ml-64"
        }`}
      >
        <div className="p-4 mt-20">
          <h2 className={`${gruppo.className} text-4xl text-black font-bold`}>
            Clients List{" "}
            <span
              className={`${inter.className} font-bold text-black text-3xl`}
            >
              (12)
            </span>
          </h2>
          <div className="mt-10">
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-1/2">
                <input
                  type="text"
                  placeholder="Search by name, email or mobile number"
                  className="w-full px-4 py-2 border rounded-md"
                />
                <i className="fas fa-search absolute top-3 left-3 text-gray-400"></i>
              </div>
            </div>
            {/* <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2">
                    <input type="checkbox" />
                  </th>
                  <th className="py-2">
                    Client name <i className="fas fa-sort"></i>
                  </th>
                  <th className="py-2">Mobile number</th>
                  <th className="py-2">
                    Reviews <i className="fas fa-sort"></i>
                  </th>
                  <th className="py-2">
                    Sales <i className="fas fa-sort"></i>
                  </th>
                  <th className="py-2">
                    Created at <i className="fas fa-sort"></i>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4">
                    <input type="checkbox" />
                  </td>
                  <td className="py-4 flex items-center space-x-2">
                    <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                      J
                    </div>
                    <div>
                      <p className="font-semibold">Jane Doe</p>
                      <p className="text-gray-500">jane@example.com</p>
                    </div>
                  </td>
                  <td className="py-4">-</td>
                  <td className="py-4">-</td>
                  <td className="py-4">-</td>
                  <td className="py-4">27 Nov 2024</td>
                </tr>
                <tr>
                  <td className="py-4">
                    <input type="checkbox" />
                  </td>
                  <td className="py-4 flex items-center space-x-2">
                    <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                      J
                    </div>
                    <div>
                      <p className="font-semibold">John Doe</p>
                      <p className="text-gray-500">john@example.com</p>
                    </div>
                  </td>
                  <td className="py-4">-</td>
                  <td className="py-4">-</td>
                  <td className="py-4">-</td>
                  <td className="py-4">27 Nov 2024</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 text-gray-500">1 of 1</div> */}
            <div className="flex flex-col">
              <div className="-m-1.5 overflow-x-auto">
                <div className="p-1.5 min-w-full inline-block align-middle">
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="py-3 ps-4">
                            <div className="flex items-center h-5">
                              <input
                                id="hs-table-checkbox-all"
                                type="checkbox"
                                className="border-gray-200 rounded text-blue-600 focus:ring-blue-500"
                              />
                              <label
                                htmlFor="hs-table-checkbox-all"
                                className="sr-only"
                              >
                                Checkbox
                              </label>
                            </div>
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-start text-xs font-semibold text-slate-800"
                          >
                            Client name
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-start text-xs font-semibold text-slate-800"
                          >
                            Mobile number
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-start text-xs font-semibold text-slate-800"
                          >
                            Reviews
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-start text-xs font-semibold text-slate-800"
                          >
                            Sales
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-start text-xs font-semibold text-slate-800"
                          >
                            Created at
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-xs font-semibold text-slate-800"
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="py-3 ps-4">
                            <div className="flex items-center h-5">
                              <input
                                id="hs-table-checkbox-1"
                                type="checkbox"
                                className="border-gray-200 rounded text-blue-600 focus:ring-blue-500"
                              />
                              <label
                                htmlFor="hs-table-checkbox-1"
                                className="sr-only"
                              >
                                Checkbox
                              </label>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap flex justify-start items-center gap-1 text-sm font-medium text-gray-800">
                            <div className="mask mask-hexagon h-9 w-9 bg-orange-100 text-orange-500 text-lg flex items-center justify-center">
                              H
                            </div>
                            <span className="whitespace-nowrap text-sm text-gray-800">
                              Hamza Aniffour
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            +212 70719990097
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            16
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            $482
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            27 Nov 2024
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                            <button
                              type="button"
                              className="inline-flex items-center gap-x-2 text-sm font-semibold border border-transparent text-white bg-red-700 hover:bg-red-600 px-2 py-1 rounded hover:text-red-100 focus:outline-none disabled:opacity-50 disabled:pointer-events-none"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clients;

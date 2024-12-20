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

interface Client {
  user_created: {
    first_name: string;
    last_name: string;
    phone: string;
    dialcode: string;
    avatar: string;
    reviews?: number[]; // Make reviews optional
  };
  date_created: string;
  time: string; // Add the time field
  sales: number; // Use 'sales' instead of 'price'
  article: Article;
}

interface AggregatedClient {
  user_created: {
    first_name: string;
    last_name: string;
    phone: string;
    dialcode: string;
    avatar: string;
    reviews?: number[]; // Make reviews optional
  };
  date_created: string;
  time: string;
  sales: number;
  article: Article;
  total_reviews: number;
  total_sales: number;
}

const Clients = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [clients, setClients] = useState<AggregatedClient[]>([]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleUserDataFetched = (data: UserData | null) => {
    setUserData(data);
  };

  const fetchAppointments = async () => {
    try {
      const response = await api.get("/items/clients", {
        params: {
          fields: [
            "user_created.first_name",
            "user_created.last_name",
            "user_created.avatar",
            "user_created.phone",
            "user_created.dialcode",
            "user_created.reviews",
            "date_created",
            "article.label",
            "article.featured_image",
            "sales", // Include sales in the fields
          ].join(","),
        },
      });

      console.log("API Response:", response.data.data);
      const aggregatedClients = aggregateClients(response.data.data);
      setClients(aggregatedClients);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const aggregateClients = (clients: Client[]): AggregatedClient[] => {
    const clientMap: { [key: string]: AggregatedClient } = {};
  
    clients.forEach((client) => {
      const userId = `${client.user_created.first_name}-${client.user_created.last_name}-${client.user_created.phone}`;
      
      // Convert sales to number if it's not already
      const salesAmount = typeof client.sales === 'string' ? parseFloat(client.sales) : Number(client.sales) || 0;
      
      if (!clientMap[userId]) {
        clientMap[userId] = {
          ...client,
          total_reviews: client.user_created.reviews ? client.user_created.reviews.length : 0,
          total_sales: salesAmount,
        };
      } else {
        clientMap[userId].total_reviews += client.user_created.reviews ? client.user_created.reviews.length : 0;
        clientMap[userId].total_sales += salesAmount;
      }
    });
  
    return Object.values(clientMap);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

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
              ({clients.length})
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
                        {clients.map((client, index) => (
                          <tr key={index}>
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
                              <div className="mask mask-hexagon h-9 w-9 bg-orange-100 text-orange-500 text-lg flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(https://maoulaty.shop/assets/${client.user_created.avatar})` }}></div>
                              <span className="whitespace-nowrap text-sm text-gray-800">
                                {client.user_created.first_name}{" "}
                                {client.user_created.last_name}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                              {client.user_created.dialcode}{" "}
                              {client.user_created.phone}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                              {client.total_reviews}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                              ${client.total_sales.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                              {new Date(
                                client.date_created
                              ).toLocaleDateString()}
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
                        ))}
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

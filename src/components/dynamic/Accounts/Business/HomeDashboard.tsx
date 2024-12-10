// "use client";
// import React, { useState } from "react";
// import {
//   FaHome,
//   FaCalendarAlt,
//   FaCreditCard,
//   FaUser,
//   FaBell,
// } from "react-icons/fa";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import BookDashboard from "./BookDashboard"; // Import the BookDashboard component
// import Image from "next/image";
// import Link from "next/link";
// import localFont from "next/font/local";
// import PaymentsDashboard from "./PymentsDashboard";

// // Register chart components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const GDSageBold = localFont({
//   src: "../../../../fonts/GDSage-Bold.ttf",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

// const HomeDashboard = () => {
//   const [activePage, setActivePage] = useState("home");
//   const [searchTerm, setSearchTerm] = useState("");

//   const handleNavigation = (page: string) => {
//     setActivePage(page);
//   };

//   const chartData = {
//     labels: ["Jan", "Feb", "Mar", "Apr", "May"],
//     datasets: [
//       {
//         label: "Total Revenue",
//         data: [1200, 1900, 2500, 2700, 3000],
//         fill: false,
//         borderColor: "rgb(75, 192, 192)",
//         tension: 0.1,
//       },
//     ],
//   };

//   return (
//     <div className="flex min-h-screen bg-red-600">
//       {/* Sidebar */}
//       <div className=" static w-64 bg-gradient-to-b from-red-500 to-red-700 text-white p-5 shadow-lg">
//         <div className="flex justify-center items-center mb-2">
//           <Link href="">
//             <Image src="/assets/logo-1.png" alt="logo" width={120} height={0} />
//           </Link>
//         </div>

//         <div className="my-8">
//           <div className="border-t border-gray-300"></div>
//         </div>

//         <nav className="flex flex-col justify-center items-center">
//           <ul>
//             <li className="mb-4">
//               <a
//                 href="#"
//                 onClick={() => handleNavigation("home")}
//                 className={`flex items-center text-lg ${
//                   activePage === "home"
//                     ? "bg-gray-900 text-white p-2 rounded-lg transition-all duration-200"
//                     : ""
//                 } hover:text-gray-200`}
//               >
//                 <FaHome className="mr-3" /> Home
//               </a>
//             </li>
//             <li className="mb-4">
//               <a
//                 href="#"
//                 onClick={() => handleNavigation("bookings")}
//                 className={`flex items-center text-lg ${
//                   activePage === "bookings"
//                     ? "bg-gray-900 text-white p-2 rounded-lg transition-all duration-200"
//                     : ""
//                 } hover:text-gray-200`}
//               >
//                 <FaCalendarAlt className="mr-3" /> Bookings
//               </a>
//             </li>
//             <li className="mb-4">
//               <a
//                 href="#"
//                 onClick={() => handleNavigation("payments")}
//                 className={`flex items-center text-lg ${
//                   activePage === "payments"
//                     ? "bg-gray-900 text-white p-2 rounded-lg transition-all duration-200"
//                     : ""
//                 } hover:text-gray-200`}
//               >
//                 <FaCreditCard className="mr-3" /> Payments
//               </a>
//             </li>
//             <li className="mb-4">
//               <a
//                 href="#"
//                 className="flex items-center text-lg hover:text-gray-200"
//                 title="View Profile"
//               >
//                 <FaUser className="mr-3" /> Profile
//               </a>
//             </li>
//           </ul>
//         </nav>
//       </div>

//       <div className="flex-1 p-8 bg-white">
//         <div className="flex justify-between items-center mb-8">
//           <div className="text-3xl font-semibold">Welcome, Business Name</div>
//           <div className="flex items-center space-x-4">
//             <FaBell className="text-2xl cursor-pointer" title="Notifications" />
//             <FaUser className="text-2xl cursor-pointer" title="Profile" />
//           </div>
//         </div>

//         {/* Search Bar */}
//         <div className="flex items-center mb-6">
//           <input
//             type="text"
//             placeholder="Search bookings..."
//             className="p-2 border border-gray-300 rounded-lg w-full"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         <div className="my-14">
//           <div className="border-t border-gray-300"></div>
//         </div>

//         {activePage === "home" && (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//             <div className="bg-white shadow-xl rounded-lg p-6">
//               <h3 className="text-xl font-semibold mb-2">Total Bookings</h3>
//               <p className="text-3xl font-bold">150</p>
//               <p className="text-sm text-gray-500">Since last month</p>
//             </div>

//             <div className="bg-white shadow-xl rounded-lg p-6">
//               <h3 className="text-xl font-semibold mb-2">Total Revenue</h3>
//               <p className="text-3xl font-bold">$5,200</p>
//               <p className="text-sm text-gray-500">This month</p>
//             </div>

//             <div className="bg-white shadow-xl rounded-lg p-6">
//               <h3 className="text-xl font-semibold mb-2">
//                 Upcoming Appointments
//               </h3>
//               <p className="text-3xl font-bold">12</p>
//               <p className="text-sm text-gray-500">In the next 7 days</p>
//             </div>
//           </div>
//         )}

//         {activePage === "bookings" && <BookDashboard searchTerm={searchTerm} />}
//         {activePage === "payments" && <PaymentsDashboard />}
//         {/* Analytics (Charts) */}
//         <div className="bg-white shadow-xl rounded-lg p-4 mb-8 max-w-[870px] mx-auto">
//           <h3 className="text-xl font-semibold mb-4">Revenue Trends</h3>
//           <Line data={chartData} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomeDashboard;

"use client";
import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import BookDashboard from "./BookDashboard";
import PaymentsDashboard from "./PaymentsDashboard";
import Sidenav from "./Sidenav";
import Header from "./Header/Header";

// Define a type for user data
interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  // Add other fields as needed from your API response
  profileImage?: string;
  role?: string;
}

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HomeDashboard = () => {
  const [activePage, ] = useState("home");
  const [searchTerm, setSearchTerm] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleUserDataFetched = (data: UserData | null) => {
    setUserData(data);
  };

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Total Revenue",
        data: [1200, 1900, 2500, 2700, 3000],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="">
      <Header onUserDataFetched={handleUserDataFetched} />
      <Sidenav />

      <div className="ml-0 lg:ml-44 p-5 xl:pt-32 xl:pl-14 overflow-auto bg-slate-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="text-3xl font-semibold">
              Welcome, {userData?.first_name || "Loading..."}
            </div>
          </div>

          {/* Search Bar */}
          <form className="">
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-violet-500 focus:border-slate-300 !outline-none"
                placeholder="Search Mockups, Logos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                required
              />
              <button
                type="submit"
                className="text-white absolute end-2.5 bottom-2.5 bg-[#b64077c6] hover:bg-[#b64077] transition-all duration-100 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
              >
                Search
              </button>
            </div>
          </form>

          <div className="my-14">
            <div className="border-t border-slate-200"></div>
          </div>

          {activePage === "home" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 ">
              <div className="bg-white shadow-xl rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">Total Bookings</h3>
                <p className="text-3xl font-bold">150</p>
                <p className="text-sm text-gray-500">Since last month</p>
              </div>

              <div className="bg-white shadow-xl rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">Total Revenue</h3>
                <p className="text-3xl font-bold">$5,200</p>
                <p className="text-sm text-gray-500">This month</p>
              </div>

              <div className="bg-white shadow-xl rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">
                  Upcoming Appointments
                </h3>
                <p className="text-3xl font-bold">12</p>
                <p className="text-sm text-gray-500">In the next 7 days</p>
              </div>
            </div>
          )}

          {activePage === "bookings" && (
            <BookDashboard searchTerm={searchTerm} />
          )}
          {activePage === "payments" && <PaymentsDashboard />}
          {/* Analytics (Charts) */}
          <div className="lg:flex gap-10">
            <div className="lg:w-6/12 mb-6">
              <div className="bg-white shadow-xl rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-4">Revenue Trends</h3>
                <Line data={chartData} />
              </div>
            </div>
            <div className="lg:w-6/12">
              <div className="bg-white shadow-xl rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-4">Revenue Trends</h3>
                <Line data={chartData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;

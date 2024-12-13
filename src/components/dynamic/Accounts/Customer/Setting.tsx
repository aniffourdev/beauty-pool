// "use client";
// import React, { useEffect, useState } from "react";
// import Header from "@/components/dynamic/Accounts/Customer/Global/Header";
// import Sidebar from "@/components/dynamic/Accounts/Customer/Global/Sidebar";
// import { useRouter } from "next/navigation";
// import api from "@/services/auth";
// import { Gruppo } from "next/font/google";
// import Cookies from "js-cookie";
// import axios from "axios";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaUser, FaCalendar, FaEnvelope, FaPhone, FaTrash } from "react-icons/fa";

// const gruppo = Gruppo({
//   subsets: ["latin"],
//   variable: "--font-geist-mono",
//   weight: "400",
// });

// const setting = () => {
//   const router = useRouter();
//   const [userData, setUserData] = useState(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [name, setName] = useState("");
//   const [dob, setDob] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [loading, setLoading] = useState(false);

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   const handleUserDataFetched = (data) => {
//     setUserData(data);
//   };

//   useEffect(() => {
//     const getMe = async () => {
//       try {
//         const response = await api.get("/users/me");
//         setUserData(response.data.data);
//         setName(response.data.data.name);
//         setDob(response.data.data.dob);
//         setEmail(response.data.data.email);
//         setPhone(response.data.data.phone);
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//         router.push("/login");
//       }
//     };

//     const accessToken = Cookies.get("access_token");
//     setIsAuthenticated(!!accessToken);

//     if (isAuthenticated) {
//       getMe();
//     }
//   }, [router, isAuthenticated]);

//   const handleUpdateProfile = async () => {
//     setLoading(true);
//     try {
//       await axios.put("https://your-backend-endpoint.com/users/me", {
//         name,
//         dob,
//       }); // Update the profile
//       alert("Profile updated successfully");
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       alert("Failed to update profile.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateContact = async () => {
//     setLoading(true);
//     try {
//       await axios.put("https://your-backend-endpoint.com/users/contact", {
//         email,
//         phone,
//       }); // Update contact details
//       alert("Contact details updated successfully");
//     } catch (error) {
//       console.error("Error updating contact:", error);
//       alert("Failed to update contact details.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteAccount = async () => {
//     const confirmation = window.confirm(
//       "Are you sure you want to delete your account? This action is irreversible."
//     );
//     if (confirmation) {
//       setLoading(true);
//       try {
//         await axios.delete("https://your-backend-endpoint.com/users/me"); // Delete account
//         alert("Your account has been deleted.");
//         router.push("/login"); // Redirect to login page after deletion
//       } catch (error) {
//         console.error("Error deleting account:", error);
//         alert("Failed to delete account.");
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   return (
//     <>
//       <ToastContainer />
//       <div className="min-h-screen bg-gray-100">
//         <Header
//           toggleSidebar={toggleSidebar}
//           onUserDataFetched={handleUserDataFetched}
//         />
//         <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
//         <div
//           className={`p-4 transition-transform ${
//             isSidebarOpen ? "sm:ml-64" : "sm:ml-16"
//           }`}
//         >
//           <div className="p-4 mt-20 max-w-6xl mx-auto">
//             <h1 className={`${gruppo.className} text-3xl font-bold mb-8 text-center`}>
//               Settings
//             </h1>

//             {/* Profile Information Section */}
//             <div className="bg-white shadow-md rounded-lg p-6 mb-8 max-w-xl mx-auto">
//               <h2 className="text-lg md:text-lg lg:text-xl xl:text-xl font-semibold mb-4 flex items-center">
//                 <FaUser className="mr-2" /> Edit Profile Information
//               </h2>
//               <div className="space-y-4">
//                 <div className="flex flex-col">
//                   <label htmlFor="name" className="font-semibold text-sm mb-2 flex items-center">
//                     <FaUser className="mr-2" /> Full Name
//                   </label>
//                   <input
//                     type="text"
//                     id="name"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     className="p-1 border rounded-md opacity-30 focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>

//                 <div className="flex flex-col">
//                   <label htmlFor="dob" className="font-semibold text-sm mb-2 flex items-center">
//                     <FaCalendar className="mr-2" /> Date of Birth
//                   </label>
//                   <input
//                     type="date"
//                     id="dob"
//                     value={dob}
//                     onChange={(e) => setDob(e.target.value)}
//                     className="p-1 border rounded-md opacity-30 focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>

//                 <button
//                   onClick={handleUpdateProfile}
//                   className="w-2xl px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none"
//                   disabled={loading}
//                 >
//                   {loading ? "Updating..." : "Update Profile"}
//                 </button>
//               </div>
//             </div>

//             {/* Contact Information Section */}
//             <div className="bg-white shadow-md rounded-lg p-6 mb-8 max-w-xl mx-auto">
//               <h2 className="text-lg md:text-lg lg:text-xl xl:text-xl font-semibold mb-4 flex items-center">
//                 <FaEnvelope className="mr-2" /> Edit Contact Details
//               </h2>
//               <div className="space-y-4">
//                 <div className="flex flex-col">
//                   <label htmlFor="email" className="font-semibold text-sm mb-2 flex items-center">
//                     <FaEnvelope className="mr-2" /> Email Address
//                   </label>
//                   <input
//                     type="email"
//                     id="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="p-1 border rounded-md  opacity-30 focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>

//                 <div className="flex flex-col">
//                   <label htmlFor="phone" className="font-semibold text-sm mb-2 flex items-center">
//                     <FaPhone className="mr-2" /> Phone Number
//                   </label>
//                   <input
//                     type="tel"
//                     id="phone"
//                     value={phone}
//                     onChange={(e) => setPhone(e.target.value)}
//                     className="p-1 border rounded-md opacity-30 focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>

//                 <button
//                   onClick={handleUpdateContact}
//                   className="w-2xl px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none"
//                   disabled={loading}
//                 >
//                   {loading ? "Updating..." : "Update Contact Details"}
//                 </button>
//               </div>
//             </div>

//             {/* Account Deletion Section */}
//             <div className="bg-white shadow-md rounded-lg p-6 mb-8 max-w-xl mx-auto">
//               <h2 className="text-lg md:text-lg lg:text-xl xl:text-xl font-semibold mb-4 text-red-600 flex items-center">
//                 <FaTrash className="mr-2" /> Delete Account
//               </h2>
//               <p className="text-sm text-gray-600 mb-4">
//                 Deleting your account is permanent and cannot be undone. All
//                 your data will be erased.
//               </p>
//               <button
//                 onClick={handleDeleteAccount}
//                 className="w-2xl px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-500 focus:outline-none"
//                 disabled={loading}
//               >
//                 {loading ? "Deleting..." : "Delete Account"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default setting;


import React from 'react'

const Setting = () => {
  return (
    <div>Setting</div>
  )
}

export default Setting
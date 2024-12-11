"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/auth";
import Cookies from "js-cookie";
import axios from "axios";
import Sidebar from "@/components/dynamic/Accounts/Business/Global/Sidebar";
import Header from "@/components/dynamic/Accounts/Business/Global/Header";

interface UserData {
  id: string;
  first_name: string;
}

const Settings = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleUserDataFetched = (data: UserData | null) => {
    setUserData(data);
  };

  useEffect(() => {
    const getMe = async () => {
      try {
        const response = await api.get("/users/me");
        setUserData(response.data.data);
        setName(response.data.data.name);
        setDob(response.data.data.dob);
        setEmail(response.data.data.email);
        setPhone(response.data.data.phone);
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.push("/login");
      }
    };

    const accessToken = Cookies.get("access_token");
    setIsAuthenticated(!!accessToken);

    if (isAuthenticated) {
      getMe();
    }
  }, [router, isAuthenticated]);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      await axios.put("https://your-backend-endpoint.com/users/me", {
        name,
        dob,
      }); // Update the profile
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateContact = async () => {
    setLoading(true);
    try {
      await axios.put("https://your-backend-endpoint.com/users/contact", {
        email,
        phone,
      }); // Update contact details
      alert("Contact details updated successfully");
    } catch (error) {
      console.error("Error updating contact:", error);
      alert("Failed to update contact details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete your account? This action is irreversible."
    );
    if (confirmation) {
      setLoading(true);
      try {
        await axios.delete("https://your-backend-endpoint.com/users/me"); // Delete account
        alert("Your account has been deleted.");
        router.push("/login"); // Redirect to login page after deletion
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className="hidden lg:block">
        <Header
          toggleSidebar={toggleSidebar}
          onUserDataFetched={handleUserDataFetched}
        />
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div
          className={`p-4 transition-transform ${
            isSidebarOpen ? "sm:ml-64" : "sm:ml-64"
          }`}
        >
          <div className="p-4 mt-20">
            <h1 className="text-3xl font-bold mb-8">Settings</h1>

            {/* Profile Information Section */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-8 max-w-xl">
              <h2 className="text-2xl font-semibold mb-4">
                Edit Profile Information
              </h2>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label htmlFor="name" className="font-semibold text-sm mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="dob" className="font-semibold text-sm mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dob"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <button
                  onClick={handleUpdateProfile}
                  className="w-auto text-sm p-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-8 max-w-xl">
              <h2 className="text-2xl font-semibold mb-4">
                Edit Contact Details
              </h2>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label htmlFor="email" className="font-semibold text-sm mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="phone" className="font-semibold text-sm mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <button
                  onClick={handleUpdateContact}
                  className="w-auto p-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Contact Details"}
                </button>
              </div>
              {userData && <></>}
            </div>

            {/* Account Deletion Section */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-8 max-w-xl">
              <h2 className="text-2xl font-semibold mb-4 text-red-600">
                Delete Account
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Deleting your account is permanent and cannot be undone. All
                your data will be erased.
              </p>
              <button
                onClick={handleDeleteAccount}
                className="w-auto p-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-500 focus:outline-none"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;

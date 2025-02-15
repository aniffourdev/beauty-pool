"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/dynamic/Accounts/Customer/Global/Sidebar";
import Header from "@/components/dynamic/Accounts/Customer/Global/Header";
import api from "@/services/auth";
import { Gruppo } from "next/font/google";
import Cookies from "js-cookie";
import Skeleton from "react-loading-skeleton";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const gruppo = Gruppo({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: "400",
});

interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  dialcode?: string;
  birthday?: Date | null;
}

interface SubService {
  sub_services_id: {
    name: string;
  };
}

interface Article {
  label: string;
  slug: string;
  featured_image: string;
}

interface Appointment {
  id: string;
  user_created: {
    first_name: string;
    last_name: string;
  };
  date_created: string;
  date: string;
  time: string; // Add the time field
  booking_ref: string;
  services?: SubService[]; // Make services optional
  price: string | number;
  article: Article;
}

const Setting = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [newDialCode, setNewDialCode] = useState("");
  const [newBirthday, setNewBirthday] = useState<Date | null>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleUserDataFetched = (data: UserData | null) => {
    setUserData(data);
    if (data) {
      setNewFirstName(data.first_name);
      setNewLastName(data.last_name);
      setNewEmail(data.email);
      setNewPhoneNumber(data.phone ?? "");
      setNewDialCode(data.dialcode ?? "");
      setNewBirthday(data.birthday ? new Date(data.birthday) : null);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await api.get("/items/appointments", {
        params: {
          fields: [
            "id",
            "user_created.first_name",
            "user_created.last_name",
            "date_created",
            "date",
            "time", // Include the time field
            "services.sub_services_id.name",
            "price",
            "booking_ref",
            "article.label",
            "article.slug",
            "article.featured_image",
          ].join(","),
          // Try setting `deep` to ensure relationships are included
          deep: {
            services: {
              sub_services_id: {
                fields: ["name"], // Explicitly request the `name` field from `sub_services_id`
              },
            },
          },
        },
      });

      console.log("API Response:", response.data.data);
      setAppointments(response.data.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  useEffect(() => {
    fetchAppointments();
    const fetchUserData = async () => {
      try {
        const response = await api.get("/users/me");
        handleUserDataFetched(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const formatTime = (time: string): string => {
    // Split the time string by the colon and take the first two parts
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  };

  const formatDate = (date: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return now;
  };

  const isUpcoming = (appointment: Appointment) => {
    // Get the appointment date and time
    const [hours, minutes] = appointment.time.split(":").map(Number);
    const appointmentDate = new Date(appointment.date);
    appointmentDate.setHours(hours, minutes, 0, 0);

    // Get current date and time
    const now = new Date();

    // Set both dates to start of their respective days for proper comparison
    const appointmentDay = new Date(appointmentDate).setHours(0, 0, 0, 0);
    const today = new Date(now).setHours(0, 0, 0, 0);

    // If the appointment is today, compare with current time
    if (appointmentDay === today) {
      return appointmentDate > now;
    }

    // If not today, simply compare the dates
    return appointmentDay > today;
  };

  const handleUpdateName = async () => {
    if (!userData) return;

    try {
      const response = await api.patch("/users/me", {
        first_name: newFirstName,
        last_name: newLastName,
      });
      console.log("User name updated successfully:", response.data.data);
      handleUserDataFetched(response.data.data);
    } catch (error) {
      console.error("Error updating user name:", error);
    }
  };

  const handleUpdateEmail = async () => {
    if (!userData) return;

    try {
      const response = await api.patch("/users/me", {
        email: newEmail,
      });
      console.log("User email updated successfully:", response.data.data);
      handleUserDataFetched(response.data.data);
    } catch (error) {
      console.error("Error updating user email:", error);
    }
  };

  const handleUpdatePhoneNumber = async () => {
    if (!userData) return;

    try {
      const response = await api.patch("/users/me", {
        phone: newPhoneNumber,
        dialcode: newDialCode,
      });
      console.log("User phone number updated successfully:", response.data.data);
      handleUserDataFetched(response.data.data);
    } catch (error) {
      console.error("Error updating user phone number:", error);
    }
  };

  const handleUpdateBirthday = async () => {
    if (!userData) return;

    try {
      const response = await api.patch("/users/me", {
        birthday: newBirthday,
      });
      console.log("User birthday updated successfully:", response.data.data);
      handleUserDataFetched(response.data.data);
    } catch (error) {
      console.error("Error updating user birthday:", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!userData) return;

    const token = Cookies.get("access_token"); // Retrieve the token from cookies

    if (!token) {
      console.error("Authentication token is missing.");
      alert("Authentication token is missing.");
      return;
    }

    try {
      console.log("Deleting account with ID:", userData.id);
      const response = await api.delete("/items/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: [userData.id], // Send the user ID in the payload
      });

      console.log("Delete account response:", response);

      if (response.status === 200 || response.status === 204) {
        // Account deleted successfully
        alert("Your account has been deleted successfully.");
        // Redirect to home or login page
        window.location.href = "/";
      } else {
        console.error(
          "Failed to delete account. Response status:",
          response.status
        );
        alert("Failed to delete account. Please try again.");
      }
    } catch (error: any) {
      console.error("Error deleting account:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
      alert("An error occurred while deleting your account. Please try again.");
    }
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
        <div className="p-4 mt-20 max-w-6xl mx-auto">
          {loading ? (
            <div>
              <Skeleton height={30} width={300} />
              <div className="lg:flex gap-10 mb-10 mt-8">
                <div className="lg:w-4/12 mb-3">
                  <Skeleton height={600} />
                </div>
                <div className="lg:w-8/12">
                  <Skeleton height={400} />
                </div>
              </div>
            </div>
          ) : userData ? (
            <>
              <h1 className={`${gruppo.className} text-3xl font-bold mb-8`}>Settings</h1>
              <div className="space-y-6">
                {/* Change Full Name */}
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold mb-4 sm:text-lg">Change Full Name</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 sm:text-sm">First Name</label>
                      <input
                        type="text"
                        value={newFirstName}
                        onChange={(e) => setNewFirstName(e.target.value)}
                        className="w-full sm:w-[400px] p-2 border rounded-lg text-sm sm:text-xs border-opacity-20"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 sm:text-sm">Last Name</label>
                      <input
                        type="text"
                        value={newLastName}
                        onChange={(e) => setNewLastName(e.target.value)}
                        className="w-full sm:w-[400px] p-2 border rounded-lg text-sm sm:text-xs border-opacity-20"
                      />
                    </div>
                    <button
                      className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm sm:text-xs"
                      onClick={handleUpdateName}
                    >
                      Update Name
                    </button>
                  </div>
                </div>

                {/* Change Email */}
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold mb-4 sm:text-lg">Change Email</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 sm:text-sm">New Email</label>
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="w-full sm:w-[400px] p-2 border rounded-lg text-sm sm:text-xs border-opacity-20"
                      />
                    </div>
                    <button
                      className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm sm:text-xs"
                      onClick={handleUpdateEmail}
                    >
                      Update Email
                    </button>
                  </div>
                </div>

                {/* Change Phone Number */}
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold mb-4 sm:text-lg">Change Phone Number</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 sm:text-sm">New Phone Number</label>
                      <PhoneInput
                        country={"us"}
                        value={newPhoneNumber}
                        onChange={(phone, country) => {
                          setNewPhoneNumber(phone);
                          // setNewDialCode(country.dialCode);
                        }}
                        inputProps={{
                          name: "phone",
                          required: true,
                          autoFocus: true,
                        }}
                        // className="w-full sm:w-[400px] p-2 border rounded-lg text-sm sm:text-xs border-opacity-20"
                      />
                    </div>
                    <button
                      className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm sm:text-xs"
                      onClick={handleUpdatePhoneNumber}
                    >
                      Update Phone Number
                    </button>
                  </div>
                </div>

                {/* Change Birthday */}
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold mb-4 sm:text-lg">Change Birthday</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 sm:text-sm">Birthday</label>
                      <input
                        type="date"
                        value={newBirthday ? newBirthday.toISOString().split('T')[0] : ''}
                        onChange={(e) => setNewBirthday(e.target.value ? new Date(e.target.value) : null)}
                        className="w-full sm:w-[400px] p-2 border rounded-lg text-sm sm:text-xs border-opacity-20"
                      />
                    </div>
                    <button
                      className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm sm:text-xs"
                      onClick={handleUpdateBirthday}
                    >
                      Update Birthday
                    </button>
                  </div>
                </div>

                {/* Delete Account */}
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold mb-4 sm:text-lg">Delete Account</h2>
                  <p className="text-gray-600 mb-4 sm:text-sm">
                    Are you sure you want to delete your account? This action cannot be undone.
                  </p>
                  <button
                    className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 text-sm sm:text-xs"
                    onClick={handleDeleteAccount}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Setting;

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
// import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import api from "@/services/auth"; // Ensure you have the correct path to your API service

interface UserData {
  first_name: string;
  last_name: string;
  email: string;
}

interface EditModalProps {
  userData: UserData;
  onClose: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ userData, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    first_name: userData.first_name,
    last_name: userData.last_name,
    email: userData.email,
  });

  useEffect(() => {
    if (modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5 }
      );
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await api.patch("/users/me", formData);
      console.log("User updated successfully:", response.data.data);
      onClose(); // Close the modal after successful update
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50 px-5" onClick={onClose}></div>
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg shadow-lg z-10 w-[500px]"
      >
        <h2 className="text-xl font-bold mb-4">Edit profile details</h2>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="firstName"
          >
            First name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="firstName"
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="lastName"
          >
            Last name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="lastName"
            type="text"
            name="last_name"
            placeholder="Last name"
            value={formData.last_name}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email address
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>

        <div className="flex justify-center mt-10">
          <button
            onClick={handleSubmit}
            className="w-full px-5 py-2 font-semibold text-white bg-black rounded-md shadow-sm hover:bg-gray-800"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;

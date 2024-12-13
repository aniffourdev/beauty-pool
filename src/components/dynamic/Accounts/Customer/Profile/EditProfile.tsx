import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import api from "@/services/auth";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';

interface UserData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birthday?: string; // Add birthday to UserData interface
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
    phone: userData.phone,
    birthday: userData.birthday ? new Date(userData.birthday) : null, // Initialize birthday from userData or null
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

  const handlePhoneChange = (value: string) => {
    setFormData({
      ...formData,
      phone: value,
    });
  };

  const handleBirthdayChange = (date: Date | undefined) => {
    setFormData({
      ...formData,
      birthday: date,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await api.patch("/users/me", {
        ...formData,
        birthday: formData.birthday ? format(formData.birthday, 'yyyy-MM-dd') : null, // Format the date as YYYY-MM-DD
      });
      console.log("User updated successfully:", response.data.data);
      onClose();
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50 px-5" onClick={onClose}></div>
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg shadow-lg z-10 w-full max-w-md md:max-w-lg lg:max-w-xl max-h-[90vh] overflow-y-auto"
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

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="phone"
          >
            Phone number
          </label>
          <PhoneInput
            country={"us"}
            value={formData.phone}
            onChange={handlePhoneChange}
            inputClass="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="birthday"
          >
            Birthday
          </label>
          <DayPicker
            mode="single"
            selected={formData.birthday}
            onSelect={handleBirthdayChange}
            fromYear={1900}
            toYear={new Date().getFullYear()}
            showOutsideDays
            components={{
              YearDropdown: ({ year, onChange }) => (
                <select
                  value={year}
                  onChange={(e) => onChange(Number(e.target.value))}
                  className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  {Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, i) => (
                    <option key={i} value={1900 + i}>
                      {1900 + i}
                    </option>
                  ))}
                </select>
              ),
            }}
            styles={{
              caption: {
                fontSize: '1rem',
              },
              day: {
                fontSize: '0.875rem',
              },
              headCell: {
                fontSize: '0.875rem',
              },
              month: {
                fontSize: '0.875rem',
              },
              weekday: {
                fontSize: '0.875rem',
              },
            }}
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

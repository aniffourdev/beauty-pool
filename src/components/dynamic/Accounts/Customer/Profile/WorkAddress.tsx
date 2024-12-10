"use client";
import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import api from "@/services/auth"; // Ensure you have the correct path to your API service

interface WorkAddressProps {
  onClose: () => void;
}

interface Suggestion {
  id: string;
  place_name: string;
}

const WorkAddress: React.FC<WorkAddressProps> = ({ onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Suggestion | null>(null);

  const MAPBOX_TOKEN =
    "pk.eyJ1IjoiYW5pZmZvdXJkZXYiLCJhIjoiY2xvc28zMXJjMDM4dTJycXc0aHBkN2pmcyJ9.IEOWZZQT6rlwKckMaoTh8g"; // Replace with your Mapbox access token

  useEffect(() => {
    if (inputValue.length > 2) {
      const fetchSuggestions = async () => {
        try {
          const response = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${inputValue}.json`,
            {
              params: {
                access_token: MAPBOX_TOKEN,
                types: "address",
                limit: 4,
              },
            }
          );
          setSuggestions(response.data.features);
        } catch (error) {
          console.error("Error fetching address suggestions:", error);
        }
      };
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSelectAddress = (address: Suggestion) => {
    setSelectedAddress(address);
    setInputValue(address.place_name);
    setSuggestions([]);
  };

  const handleSubmit = async () => {
    if (selectedAddress) {
      try {
        const response = await api.patch("/users/me", {
          work_address: selectedAddress.place_name,
        });
        console.log("Work address updated successfully:", response.data.data);
        onClose(); // Close the modal after successful update
      } catch (error) {
        console.error("Error updating work address:", error);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50 px-5" onClick={onClose}></div>
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg shadow-lg z-10 w-[500px]"
      >
        <h2 className="text-xl font-bold mb-4">Add Work Address</h2>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="address"
          >
            Address*
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="address"
            type="text"
            placeholder="Enter your address"
            value={inputValue}
            onChange={handleInputChange}
            autoComplete="off"
          />
          {suggestions.length > 0 && (
            <ul className="mt-2 border rounded shadow-md">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.id}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSelectAddress(suggestion)}
                >
                  {suggestion.place_name}
                </li>
              ))}
            </ul>
          )}
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

export default WorkAddress;

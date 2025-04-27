"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/auth";
import { IoLocationOutline } from "react-icons/io5";
import { AiOutlineClockCircle } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";

type Location = {
  name: string;
  adminName1?: string;
  countryName?: string;
  latitude: number;
  longitude: number;
};

interface Category {
  id: string;
  label: string;
  icon: string;
}

interface MapboxFeature {
  place_name: string;
  center: [number, number];
  context: {
    text: string;
  }[];
}

const reverseGeocode = async (latitude: number, longitude: number): Promise<string> => {
  const accessToken =
    "pk.eyJ1IjoiYW5pZmZvdXJkZXYiLCJhIjoiY2xvc28zMXJjMDM4dTJycXc0aHBkN2pmcyJ9.IEOWZZQT6rlwKckMaoTh8g"; // Replace with your Mapbox API key
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${accessToken}`
    );

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();

    // Check if data is available
    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      return feature.place_name;
    } else {
      console.error("No data found");
      return "";
    }
  } catch (error) {
    console.error("Error reverse geocoding:", error);
    return "";
  }
};

export default function BookingHead() {
  const [venueAndTreatment, setVenueAndTreatment] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedTime, setSelectedTime] = useState("anytime");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [results, setResults] = useState<Location[]>([]);

  const fetchLocations = async (query: string): Promise<Location[]> => {
    const accessToken =
      "pk.eyJ1IjoiYW5pZmZvdXJkZXYiLCJhIjoiY2xvc28zMXJjMDM4dTJycXc0aHBkN2pmcyJ9.IEOWZZQT6rlwKckMaoTh8g"; // Replace with your Mapbox API key
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${accessToken}`
      );

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const data = await response.json();

      // Check if data is available
      if (data.features) {
        return data.features.map((feature: MapboxFeature) => ({
          name: feature.place_name,
          latitude: feature.center[1],
          longitude: feature.center[0],
          adminName1: feature.context?.[0]?.text,
          countryName: feature.context?.[feature.context.length - 1]?.text,
        }));
      } else {
        console.error("No data found");
        return [];
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      return [];
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocation(value);
    if (value.length >= 2) {
      const locations = await fetchLocations(value);
      setResults(locations);
    } else {
      setResults([]);
    }
  };

  const handleTimeSelection = (timeSlot: string) => {
    setSelectedTime(timeSlot);
  };

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await api.get("/items/Categorie");
        setCategories(response.data.data); // Storing data as an array
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    getCategories();
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
        const readableAddress = await reverseGeocode(latitude, longitude);
        setLocation(readableAddress); // Set the location input field with the readable address
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Basic validation
      if (
        !venueAndTreatment ||
        !location ||
        !date ||
        !selectedTime ||
        !selectedCategoryId
      ) {
        throw new Error("Please fill in all required fields");
      }

      if (!currentLocation?.latitude || !currentLocation?.longitude) {
        throw new Error("Location coordinates are required");
      }

      // Create the booking object
      const bookingData = {
        venueAndTreatment,
        location,
        date,
        time: selectedTime,
        coordinates: {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        },
      };

      // Log the booking data
      console.log("Booking details:", bookingData);

      // Save the selected category ID and location coordinates in local storage
      localStorage.setItem("selectedCategoryId", selectedCategoryId);
      localStorage.setItem(
        "selectedLocation",
        JSON.stringify({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        })
      );

      // Construct the query parameters
      const queryParams = new URLSearchParams({
        venue: venueAndTreatment,
        date,
        time: selectedTime,
        location,
        latitude: currentLocation.latitude.toString(),
        longitude: currentLocation.longitude.toString(),
        categoryId: selectedCategoryId,
      });

      // Redirect to the booking page
      router.push(`/book?${queryParams.toString()}`);

      // Reset form
      setVenueAndTreatment("");
      setLocation("");
      setDate("");
      setSelectedTime("anytime");
      setSelectedCategoryId(null);
    } catch (error) {
      console.error("Booking error:", error);
      // Here you could add user feedback for the error
    } finally {
      setLoading(false);
    }
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 shadow-md bg-white rounded-full p-2"
      >
        {/* Venue and Treatment Selection */}
        <div className="lg:flex gap-2">
          {/* Location Input */}
          <div className="lg:w-3/12">
            <div className="flex items-center border-2 rounded-full px-4 py-2 bg-white">
              <IoLocationOutline className="text-gray-500 mr-0.5" />
              <input
                type="text"
                placeholder="Current location"
                onChange={handleInputChange}
                value={location}
                className="!outline-none w-full text-sm text-gray-800 bg-transparent"
              />
            </div>
            {results.length > 0 && (
              <div className="mt-2 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto absolute w-auto">
                <ul>
                  {results.map((result, index) => (
                    <li
                      key={index}
                      className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setLocation(result.name);
                        setCurrentLocation({
                          latitude: result.latitude,
                          longitude: result.longitude,
                        });
                        setResults([]);
                      }}
                    >
                      <i className="fas fa-map-marker-alt text-gray-500 mr-2"></i>
                      <div>
                        <div className="font-semibold">{result.name}</div>
                        {result.adminName1 && (
                          <div className="text-sm text-gray-500">
                            {result.adminName1}
                          </div>
                        )}
                        {result.countryName && (
                          <div className="text-sm text-gray-500">
                            {result.countryName}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Treatment Input */}
          <div className="lg:w-3/12">
            <div className="relative">
              <div
                className="flex items-center border-2 rounded-full px-4 py-2 bg-white"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <BsSearch className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="All treatments and venues"
                  className="!outline-none w-full text-sm text-gray-800 bg-transparent"
                  value={venueAndTreatment}
                  onChange={(e) => setVenueAndTreatment(e.target.value)}
                />
              </div>
              {dropdownOpen && (
                <div className="bg-white p-4 rounded-lg shadow-md absolute w-auto mt-2">
                  {/* <h2 className="font-normal mb-3 text-sm">Top categories</h2> */}
                  <div className="space-y-4">
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <div
                          key={category.id}
                          className="flex items-center space-x-2 cursor-pointer"
                          onClick={() => {
                            setVenueAndTreatment(category.label);
                            setSelectedCategoryId(category.id);
                            setDropdownOpen(false);
                          }}
                        >
                          <div
                            className="w-7 h-7 bg-cover bg-center"
                            style={{
                              backgroundImage: `url(https://luxeenbois.com/assets/${category.icon})`,
                            }}
                          ></div>
                          <span>{category.label}</span>
                        </div>
                      ))
                    ) : (
                      <option>No categories available</option>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-2/12">
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={today}
              required
              className="w-full px-4 py-2 text-sm bg-white rounded-full border-2 focus:outline-none text-gray-700"
            />
          </div>

          {/* Time Input */}
          <div className="lg:w-2/12">
            <div className="relative">
              <div
                className="flex items-center border-2 rounded-full px-4 py-2 bg-white"
                onClick={() => setShowFilter(!showFilter)}
              >
                <AiOutlineClockCircle className="text-gray-500 mr-0.5" />
                <input
                  type="text"
                  placeholder="Choose a time"
                  className="!outline-none w-full capitalize text-sm text-gray-800 bg-transparent"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                />
              </div>
              {showFilter && (
                <div className="mt-2 bg-white rounded-lg shadow-md p-4 absolute w-auto">
                  <div className="space-y-2">
                    <button
                      className={`w-full py-2 rounded-full ${
                        selectedTime === "anytime"
                          ? "bg-purple-400 text-white"
                          : "border border-gray-300 text-gray-700"
                      }`}
                      onClick={() => handleTimeSelection("anytime")}
                    >
                      Any time
                    </button>
                    {/* Other Time Buttons */}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search Button */}
          <div className="lg:w-2/12">
            <button
              type="submit"
              disabled={
                loading ||
                !venueAndTreatment ||
                !location ||
                !date ||
                !selectedTime ||
                !selectedCategoryId
              }
              className={`w-full px-4 py-2 text-sm rounded-full text-white font-medium ${
                loading ||
                !venueAndTreatment ||
                !location ||
                !date ||
                !selectedTime ||
                !selectedCategoryId
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-400 hover:bg-purple-500"
              }`}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

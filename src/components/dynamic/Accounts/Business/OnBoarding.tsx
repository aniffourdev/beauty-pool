"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import "tailwindcss/tailwind.css";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import Cookies from "js-cookie";
import { TiArrowRight } from "react-icons/ti";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import api from "@/services/auth";

interface SignUpFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  location: string;
  device_id: string;
  business_name: string;
  website: string;
  selectedCategories: Category[];
  business_address: string;
  noBusinessAddress: boolean;
}

interface Category {
  id: string;
  label: string;
  icon: string;
}

const defaultFormData: SignUpFormData = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  phone: "",
  location: "",
  device_id: "",
  business_name: "",
  website: "",
  selectedCategories: [],
  business_address: "",
  noBusinessAddress: false,
};

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYW5pZmZvdXJkZXYiLCJhIjoiY2xvc28zMXJjMDM4dTJycXc0aHBkN2pmcyJ9.IEOWZZQT6rlwKckMaoTh8g";

const OnBoarding = ({ initialData }: { initialData: SignUpFormData }) => {
  const [business, setBusiness] = useState(true);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [selectedCount, setSelectedCount] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [address, setAddress] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<
    [number, number] | null
  >(null);
  const [noBusinessAddress, setNoBusinessAddress] = useState<boolean>(false);
  const [showMap, setShowMap] = useState<boolean>(false);
  const mapRef = useRef<any>(null);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<SignUpFormData>({
    defaultValues: { ...defaultFormData, ...initialData },
  });

  const handleCheckboxChange = (category: Category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((item) => item !== category)
      );
      setSelectedCount(selectedCount - 1);
    } else {
      if (selectedCount < 4) {
        setSelectedCategories([...selectedCategories, category]);
        setSelectedCount(selectedCount + 1);
      }
    }
  };

  useEffect(() => {
    const getFingerprint = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setDeviceId(result.visitorId);

      const existingUser = Cookies.get(result.visitorId);
      if (existingUser) {
        alert("You Can't Open Many Accounts using this device!");
      }
    };
    getFingerprint();
  }, []);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axios.get(
          "https://maoulaty.shop/items/Categorie"
        );
        setCategories(response.data.data); // Storing data as an array
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    getCategories();
  }, []);

  const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
    try {
      // Step 1: Handle business name and website (Step 1 form data)
      if (step === 1) {
        setValue("business_name", data.business_name); // Store business name in form state
        setValue("website", data.website); // Store website in form state

        // Store business-related data in cookies
        Cookies.set(
          "businessData",
          JSON.stringify({
            business_name: data.business_name,
            website: data.website,
            selectedCategories: data.selectedCategories,
            business_address: data.business_address,
            noBusinessAddress: data.noBusinessAddress,
          })
        );

        setStep(2); // Move to next step
      }

      // Step 2: Handle selected categories (Step 2 form data)
      else if (step === 2) {
        // Validate that at least one category is selected
        if (selectedCategories.length === 0) {
          alert("Please select at least one service.");
          return;
        }
        setValue("selectedCategories", selectedCategories); // Store selected categories

        // Store business-related data in cookies
        Cookies.set(
          "businessData",
          JSON.stringify({
            business_name: data.business_name,
            website: data.website,
            selectedCategories: selectedCategories,
            business_address: data.business_address,
            noBusinessAddress: data.noBusinessAddress,
          })
        );

        setStep(3); // Move to next step
      }

      // Step 3: Handle business address (Step 3 form data)
      else if (step === 3) {
        // Validate address or "no business address" checkbox
        if (!noBusinessAddress && !address) {
          alert("Please enter your address.");
          return;
        }

        // Store address and "no business address" flag in form state
        setValue("business_address", address);
        setValue("noBusinessAddress", noBusinessAddress);

        // Retrieve the form data
        const formData = getValues();
        console.log("Form Data:", formData); // Debugging: Log the form data

        // Combine data from local storage and cookies
        const storedData = JSON.parse(
          localStorage.getItem("signUpData") || "{}"
        );
        const businessData = JSON.parse(Cookies.get("businessData") || "{}");
        const finalFormData = {
          ...storedData,
          ...businessData,
          device_id: deviceId, // Send device ID
          avatar: "b1fcd062-fc30-4c9f-a48f-804b70510da9",
          status: "active",
          role: "d9d87093-97d1-4ed3-ab95-bb1c789ab258",
          business_address: formData.business_address, // Ensure business address is included
          noBusinessAddress: formData.noBusinessAddress, // Ensure noBusinessAddress flag is included
          category: {
            create: selectedCategories.map((category) => ({
              directus_users_id: deviceId, // Assuming deviceId is the user ID
              Categorie_id: { id: category.id },
            })),
            update: [],
            delete: [],
          },
        };

        console.log("Final Form Data:", finalFormData); // Debugging: Log the final form data

        // Make the API request to update user data
        setLoading(true); // Set loading state while submitting data
        try {
          const response = await axios.post(
            "https://maoulaty.shop/register-user",
            finalFormData
          ); // Send post request to register the user
          console.log("User registered successfully:", response.data); // Log success response
          alert("You are all set!"); // Notify user on successful update
          router.push("/login"); // Optionally navigate to another page
        } catch (error) {
          console.error("Error registering user:", error); // Log error if the request fails
          alert("Registration failed. Please try again.");
        } finally {
          setLoading(false); // Reset loading state after request
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error); // Catch any unexpected errors during form submission
      alert("An error occurred. Please try again.");
    }
  };

  const handleAddressChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setAddress(value);
    if (value.length > 2) {
      try {
        const response = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json`,
          {
            params: {
              access_token: MAPBOX_TOKEN,
              limit: 5,
            },
          }
        );
        setSuggestions(
          response.data.features.map((feature: any) => feature.place_name)
        );
      } catch (error) {
        console.error("Error fetching address suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setAddress(suggestion);
    setSuggestions([]);
    setShowMap(true);
    axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${suggestion}.json`,
        {
          params: {
            access_token: MAPBOX_TOKEN,
            limit: 1,
          },
        }
      )
      .then((response) => {
        const [longitude, latitude] = response.data.features[0].center;
        setSelectedLocation([longitude, latitude]);
        if (mapRef.current) {
          mapRef.current.flyTo({
            center: [longitude, latitude],
            essential: true, // this animation is considered essential with respect to prefers-reduced-motion
          });
        }
      });
  };

  const CategoryCard = ({
    id,
    label,
    icon,
    isSelected,
    isDisabled,
    onChange,
    index,
  }: {
    id: string;
    label: string;
    icon: string;
    isSelected: boolean;
    isDisabled: boolean;
    onChange: () => void;
    index: number;
  }) => {
    const getTag = () => {
      if (index === 0) return "Primary";
      return (index + 1).toString();
    };

    return (
      <div
        className={`border-2 rounded-lg p-4 flex items-center justify-center relative ${
          isSelected ? "border-[#f4b8ae]" : "border-gray-300"
        }`}
      >
        {isSelected && (
          <div className="absolute top-2 right-2 h-6 w-6 bg-[#f4b8ae] text-slate-900 text-xs font-bold rounded-full flex justify-center items-center">
            {getTag()}
          </div>
        )}
        <div className="text-center">
          <input
            type="checkbox"
            className="hidden"
            id={id}
            checked={isSelected}
            disabled={isDisabled}
            onChange={onChange}
          />
          <label
            htmlFor={id}
            className="cursor-pointer flex justify-center items-center flex-col space-y-2"
          >
            <img
              src={`https://maoulaty.shop/assets/${icon}`}
              alt={label}
              className="w-9 h-9"
            />
            <p className="text-black font-semibold">{label}</p>
          </label>
        </div>
      </div>
    );
  };

  return (
    <>
      {business && (
        <div className="min-h-screen bg-slate-50 w-full pt-20 px-10 lg:px-0">
          <div className="max-w-5xl mx-auto">
            <div className="flex space-x-4 mb-10">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`w-1/5 h-1.5 rounded-full ${
                    step >= s ? "bg-[#b64077]" : "bg-slate-200"
                  }`}
                ></div>
              ))}
            </div>
            {step === 1 && (
              <div className="space-y-6">
                <div className="max-w-xl mx-auto">
                  <div className="space-y-4">
                    <h2 className="text-gray-500 text-sm mt-20">
                      Account setup
                    </h2>
                    <h1 className="text-3xl font-semibold">
                      What's your business name?
                    </h1>
                    <p className="text-gray-500 mb-5">
                      This is the brand name your clients will see. Your billing
                      and legal name can be added later.
                    </p>
                  </div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                      <div>
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2 mt-10"
                          htmlFor="businessName"
                        >
                          Business Name
                        </label>
                        <input
                          type="text"
                          id="businessName"
                          className="w-full border border-gray-300 rounded-md p-2"
                          {...register("business_name", {
                            required: "Business Name is required",
                          })}
                        />
                        {errors.business_name && (
                          <p className="text-red-500 text-sm">
                            {errors.business_name.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="website"
                        >
                          Website (Optional)
                        </label>
                        <input
                          type="text"
                          id="website"
                          className="w-full border border-gray-300 rounded-md p-2"
                          {...register("website")}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end mt-10">
                      <button
                        type="submit"
                        className="bg-black text-white px-6 py-2 rounded-md flex items-center space-x-1"
                      >
                        <span>Continue</span>
                        <TiArrowRight className="size-7 relative top-[0.5px]" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            {step === 2 && (
              <>
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center">
                    <i className="fas fa-arrow-left text-xl"></i>
                  </div>
                </div>
                <div className="mb-8">
                  <div className="max-w-3xl mx-auto">
                    <div className="space-y-4">
                      <h2 className="text-gray-500 text-sm mt-20">
                        Account setup
                      </h2>
                      <h1 className="text-3xl font-semibold">
                        What services do you offer?
                      </h1>
                      <p className="text-gray-500 -mt-4">
                        Choose your primary and up to 3 related service types
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                      {categories.map((category: Category, index) => (
                        <CategoryCard
                          key={category.id}
                          id={category.id}
                          icon={category.icon}
                          label={category.label}
                          isSelected={selectedCategories.includes(category)}
                          isDisabled={
                            selectedCount >= 4 &&
                            !selectedCategories.includes(category)
                          }
                          onChange={() => handleCheckboxChange(category)}
                          index={selectedCategories.indexOf(category)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-10">
                  <button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    className="bg-black text-white px-6 py-2 rounded-md flex items-center space-x-1"
                  >
                    <span>Continue</span>
                    <TiArrowRight className="size-7 relative top-[0.5px]" />
                  </button>
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center">
                    <i className="fas fa-arrow-left text-xl"></i>
                  </div>
                </div>
                <div className="mb-8">
                  <div className="max-w-3xl mx-auto">
                    <div className="space-y-4">
                      <h2 className="text-gray-500 text-sm mt-20">
                        Account setup
                      </h2>
                      <h1 className="text-3xl font-semibold">
                        Set your business address
                      </h1>
                      <p className="text-gray-500 -mt-4">
                        Enter your business address or use the map to set your
                        location
                      </p>
                    </div>
                    <div className="mt-4">
                      <input
                        type="text"
                        placeholder="Enter your address"
                        value={address}
                        onChange={handleAddressChange}
                        disabled={noBusinessAddress}
                        className="w-full border border-gray-300 rounded-md p-2"
                      />
                      {suggestions.length > 0 && (
                        <div className="mt-2">
                          {suggestions.map((suggestion, index) => (
                            <div
                              key={index}
                              className="cursor-pointer p-2 border-b border-gray-200"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion}
                            </div>
                          ))}
                        </div>
                      )}
                      {address && showMap && (
                        <div className="mt-2">
                          <strong>Selected Address:</strong> {address}
                        </div>
                      )}
                      <div className="mt-2">
                        <input
                          type="checkbox"
                          id="noBusinessAddress"
                          checked={noBusinessAddress}
                          onChange={(e) =>
                            setNoBusinessAddress(e.target.checked)
                          }
                        />
                        <label htmlFor="noBusinessAddress" className="ml-2">
                          I don't have a business address (mobile and online
                          services only)
                        </label>
                      </div>
                    </div>
                    {showMap && (
                      <div className="mt-4">
                        <Map
                          ref={mapRef}
                          initialViewState={{
                            longitude: -7.6096,
                            latitude: 33.5887,
                            zoom: 12,
                          }}
                          style={{ width: "100%", height: "400px" }}
                          mapStyle="mapbox://styles/mapbox/streets-v11"
                          mapboxAccessToken={MAPBOX_TOKEN}
                        >
                          {selectedLocation && (
                            <Marker
                              longitude={selectedLocation[0]}
                              latitude={selectedLocation[1]}
                            />
                          )}
                        </Map>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end mt-10">
                  <button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    className="bg-black text-white px-6 py-2 rounded-md flex items-center space-x-1"
                  >
                    <span>Continue</span>
                    <TiArrowRight className="size-7 relative top-[0.5px]" />
                  </button>
                </div>
              </>
            )}
            {step === 4 && <>THIS IS STEP 4</>}
            {/* Add more steps as needed */}
          </div>
        </div>
      )}
    </>
  );
};

export default OnBoarding;

"use client";
import Sidebar from "@/components/dynamic/Accounts/Business/Global/Sidebar";
import Header from "@/components/dynamic/Accounts/Business/Global/Header";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FiPlus } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { Gruppo } from "next/font/google";
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "@/services/auth";

const gruppo = Gruppo({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: "400",
});

interface UserData {
  id: string;
  first_name: string;
}

interface Category {
  id: number;
  label: string;
}

interface Service {
  subService: any;
  id: number;
  name: string;
}

interface SubService {
  id: number;
  name: string;
}

interface SelectedService {
  id: number;
  name: string;
  subService: {
    id: number;
    name: string;
  };
}

const ProductAdd = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);

  const [loading, setLoading] = useState(false);
  const [openTimes, setOpenTimes] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [subServices, setSubServices] = useState<SubService[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedSubService, setSelectedSubService] = useState<number | null>(
    null
  );
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>(
    []
  );

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleUserDataFetched = (data: UserData | null) => {
    setUserData(data);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    watch,
  } = useForm();

  const handleFeaturedImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImage(file);
    }
  };

  const handleGalleryImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const newGalleryImages: File[] = [...galleryImages];
      newGalleryImages[index] = file;
      setGalleryImages(newGalleryImages);
    }
  };

  const handleOpenTimeChange = (day: string) => {
    setOpenTimes((prev) => ({
      ...prev,
      [day]: !prev[day as keyof typeof prev],
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("users/me", {
          params: {
            fields: [
              "category.Categorie_id.*",
              "category.Categorie_id.services.Services_id.*",
              "category.Categorie_id.services.Services_id.sub_services.*",
            ],
          },
        });

        const categoryData = response.data.data.category.map((cat: any) => ({
          id: cat.Categorie_id.id,
          label: cat.Categorie_id.label,
        }));

        setCategories(categoryData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      if (selectedCategory) {
        try {
          const response = await api.get("users/me", {
            params: {
              fields: [
                "category.Categorie_id.*",
                "category.Categorie_id.services.Services_id.*",
              ],
            },
          });

          // Find the selected category and extract its services
          const selectedCategoryData = response.data.data.category.find(
            (cat: any) => cat.Categorie_id.id === selectedCategory
          );

          const serviceData = selectedCategoryData
            ? selectedCategoryData.Categorie_id.services.map(
                (service: any) => ({
                  id: service.Services_id.id,
                  name: service.Services_id.name,
                })
              )
            : [];

          setServices(serviceData);

          // Reset selected service and sub-services when category changes
          setSelectedService(null);
          setSubServices([]);
        } catch (error) {
          console.error("Error fetching services:", error);
          setServices([]);
        }
      }
    };

    if (selectedCategory) {
      fetchServices();
    }
  }, [selectedCategory]);

  useEffect(() => {
    const fetchSubServices = async () => {
      if (selectedCategory && selectedService) {
        try {
          const response = await api.get("users/me", {
            params: {
              fields: [
                "category.Categorie_id.*",
                "category.Categorie_id.services.Services_id.*",
                "category.Categorie_id.services.Services_id.sub_services.*",
              ],
            },
          });

          console.log(
            "API Response for Sub-Services:",
            response.data.data.category
          );

          // Log the IDs of the categories in the API response
          response.data.data.category.forEach((cat: any) => {
            console.log("Category ID:", cat.Categorie_id.id);
          });

          // Find the selected category
          const selectedCategoryData = response.data.data.category.find(
            (cat: any) => cat.Categorie_id.id === selectedCategory
          );

          console.log("Selected Category Data:", selectedCategoryData);

          // Find sub-services for the selected service within the selected category
          const subServiceData = selectedCategoryData
            ? selectedCategoryData.Categorie_id.services
                .filter(
                  (service: any) => service.Services_id.id === selectedService
                )
                .flatMap((service: any) =>
                  service.Services_id.sub_services.map((subService: any) => ({
                    id: subService.id,
                    name: subService.name,
                  }))
                )
            : [];

          console.log("Sub-Services Data:", subServiceData);

          setSubServices(subServiceData);
        } catch (error) {
          console.error("Error fetching sub-services:", error);
          setSubServices([]);
        }
      }
    };

    fetchSubServices();
  }, [selectedCategory, selectedService]);

  const addService = () => {
    if (selectedService && selectedSubService) {
      console.log("Selected Service ID:", selectedService);
      console.log("Selected SubService ID:", selectedSubService);

      const selectedServiceObj = services.find(
        (service) => service.id === selectedService
      );
      const selectedSubServiceObj = subServices.find(
        (subService) => subService.id === selectedSubService
      );

      console.log("Found Service Object:", selectedServiceObj);
      console.log("Found SubService Object:", selectedSubServiceObj);

      if (selectedServiceObj && selectedSubServiceObj) {
        const newSelectedService = {
          id: selectedServiceObj.id,
          name: selectedServiceObj.name,
          subService: {
            id: selectedSubServiceObj.id,
            name: selectedSubServiceObj.name,
          },
        };

        console.log("New Selected Service Object:", newSelectedService);

        setSelectedServices((prev) => {
          const updated = [...prev, newSelectedService];
          console.log("Updated Selected Services:", updated);
          return updated;
        });

        setSelectedService(null);
        setSelectedSubService(null);
      }
    }
  };

  const removeService = (serviceId: number) => {
    setSelectedServices(
      selectedServices.filter((service) => service.id !== serviceId)
    );
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      let featuredImageId = null;
      let galleryImageIds = [];

      // Upload featured image
      if (featuredImage) {
        const formData = new FormData();
        formData.append("file", featuredImage);
        formData.append("folder", "your-folder-id"); // Replace with your folder ID

        const response = await axios.post(
          "https://luxeenbois.com/files",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        featuredImageId = response.data.data.id;
      }

      // Upload gallery images
      for (const file of galleryImages) {
        if (file) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("folder", "your-folder-id"); // Replace with your folder ID

          const response = await axios.post(
            "https://luxeenbois.com/files",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          galleryImageIds.push(response.data.data.id);
        }
      }

      // Prepare the payload
      const payload = {
        status: "published",
        label: data.label,
        slug: data.slug,
        description: data.description,
        featured_image: featuredImageId,
        galleries: {
          create: galleryImageIds.map((id) => ({
            directus_files_id: { id },
          })),
        },
        category: data.category,
        service: {
          create: selectedServices.map((service) => ({
            articles_id: "+",
            Services_id: { id: service.id },
            sub_service_name: service.subService.name, // Include sub-service name
          })),
          update: [],
          delete: [],
        },
        sub_service: {
          create: selectedServices.map((service) => ({
            articles_id: "+",
            sub_services_id: { id: service.subService.id },
            sub_service_name: service.subService.name, // Include sub-service name
          })),
          update: [],
          delete: [],
        },
        Address: data.address,
        monday_open: openTimes.monday ? data.monday_open : null,
        monday_close: openTimes.monday ? data.monday_close : null,
        tuesday_open: openTimes.tuesday ? data.tuesday_open : null,
        tuesday_close: openTimes.tuesday ? data.tuesday_close : null,
        wednesday_open: openTimes.wednesday ? data.wednesday_open : null,
        wednesday_close: openTimes.wednesday ? data.wednesday_close : null,
        thursday_open: openTimes.thursday ? data.thursday_open : null,
        thursday_close: openTimes.thursday ? data.thursday_close : null,
        friday_open: openTimes.friday ? data.friday_open : null,
        friday_close: openTimes.friday ? data.friday_close : null,
        saturday_open: openTimes.saturday ? data.saturday_open : null,
        saturday_close: openTimes.saturday ? data.saturday_close : null,
        sunday_open: openTimes.sunday ? data.sunday_open : null,
        sunday_close: openTimes.sunday ? data.sunday_close : null,
      };

      // Send the payload to the API
      await api.post("/items/articles", payload);

      toast.success("Article added successfully!");
    } catch (error) {
      console.error("Error adding article:", error);
      toast.error("Error adding article. Please try again.");
    } finally {
      setLoading(false);
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
        <div className="p-4 mt-20">
          <ToastContainer />
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex justify-between items-center mb-5">
              <h2
                className={`${gruppo.className} text-4xl text-black font-bold`}
              >
                New Product
              </h2>
              <button
                type="submit"
                className="py-2 px-4 rounded bg-slate-900 text-white font-semibold"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
            <div className="lg:flex gap-8">
              <div className="lg:w-8/12">
                <div className="bg-white p-4 rounded-lg border border-slate-200 mb-8">
                  <h4 className="text-lg font-semibold pb-4 -ml-4 px-4 -mr-4 border-b border-slate-200 mb-4">
                    Basic details
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <div>
                      <label
                        className="block text-gray-900 text-[13px] font-semibold mb-1"
                        htmlFor="label"
                      >
                        Product name
                      </label>
                      <input
                        type="text"
                        id="label"
                        {...register("label", {
                          required: "Label is required",
                        })}
                        className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                    <div>
                      <label
                        className="block text-gray-900 text-[13px] font-semibold mb-1"
                        htmlFor="slug"
                      >
                        Product slug
                      </label>
                      <input
                        type="text"
                        id="slug"
                        {...register("slug", { required: "Slug is required" })}
                        className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                  </div>
                  <div className="my-4">
                    <div>
                      <label
                        className="block text-gray-900 text-[13px] font-semibold mb-1"
                        htmlFor="description"
                      >
                        Product description
                      </label>
                      <textarea
                        id="description"
                        {...register("description", {
                          required: "Description is required",
                        })}
                        className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <div>
                      <label
                        className="block text-gray-900 text-[13px] font-semibold mb-1"
                        htmlFor="category"
                      >
                        Product Category
                      </label>
                      <select
                        id="category"
                        {...register("category", {
                          required: "Category is required",
                        })}
                        className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        onChange={(e) => {
                          setSelectedCategory(Number(e.target.value));
                        }}
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        className="block text-gray-900 text-[13px] font-semibold mb-1"
                        htmlFor="services"
                      >
                        Product Service
                      </label>
                      <select
                        id="services"
                        {...register("services", {
                          required: "Service is required",
                        })}
                        className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        onChange={(e) => {
                          setSelectedService(Number(e.target.value));
                        }}
                        value={selectedService || ""} // Ensure the selected service is displayed
                      >
                        <option value="">Select a service</option>
                        {services.map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        className="block text-gray-900 text-[13px] font-semibold mb-1"
                        htmlFor="sub_services"
                      >
                        Product sub service
                      </label>
                      <select
                        id="sub_services"
                        {...register("sub_services", {
                          required: "Sub Service is required",
                        })}
                        className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        onChange={(e) => {
                          setSelectedSubService(Number(e.target.value));
                        }}
                        value={selectedSubService || ""} // Ensure the selected sub-service is displayed
                      >
                        <option value="">Select a sub service</option>
                        {subServices.map((subService) => (
                          <option key={subService.id} value={subService.id}>
                            {subService.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addService}
                    className="mt-4 py-2 px-4 rounded bg-blue-500 text-white font-semibold"
                  >
                    Add Service
                  </button>
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold mb-2">
                      Selected Services
                    </h4>
                    <ul className="space-y-2">
                      {selectedServices.map((service) => (
                        <li
                          key={service.id}
                          className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-gray-800">
                              {service.name}
                            </span>
                            <span className="text-gray-400">→</span>
                            <span className="text-gray-600">
                              {service.subService?.name || "No sub-service"}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">
                              ID: {service.subService?.id}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeService(service.id)}
                              className="text-red-500 hover:text-red-700 font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200 mb-8">
                  <h4 className="text-lg font-semibold pb-4 -ml-4 px-4 -mr-4 border-b border-slate-200 mb-4">
                    Address
                  </h4>
                  <div>
                    <label
                      className="block text-gray-900 text-[13px] font-semibold mb-1"
                      htmlFor="address"
                    >
                      Product Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      {...register("address", {
                        required: "Address is required",
                      })}
                      className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <h4 className="text-lg font-semibold pb-4 -ml-4 px-4 -mr-4 border-b border-slate-200 mb-4">
                    Openings Time
                  </h4>
                  {/* Opening Times */}
                  {[
                    "monday",
                    "tuesday",
                    "wednesday",
                    "thursday",
                    "friday",
                    "saturday",
                    "sunday",
                  ].map((day) => (
                    <div
                      key={day}
                      className="bg-white shadow-sm rounded-lg p-4 mb-3 border border-gray-100"
                    >
                      <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={openTimes[day as keyof typeof openTimes]}
                            onChange={() => handleOpenTimeChange(day)}
                            className="hidden peer"
                            id={`${day}-checkbox`}
                          />
                          <div
                            className={`
          w-14 h-7 rounded-full transition-all duration-300 relative
          ${
            openTimes[day as keyof typeof openTimes]
              ? "bg-[#f47c66]"
              : "bg-gray-300"
          }
        `}
                          >
                            <span
                              className={`
            absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform
            ${
              openTimes[day as keyof typeof openTimes]
                ? "translate-x-7"
                : "translate-x-0"
            }
          `}
                            ></span>
                          </div>
                          <span className="text-gray-700 font-medium capitalize">
                            Open on {day}
                          </span>
                        </label>

                        <div className="flex space-x-2">
                          <input
                            type="time"
                            {...register(`${day}_open`)}
                            disabled={!openTimes[day as keyof typeof openTimes]}
                            className={`p-2 border rounded-md transition-all duration-300
          ${
            openTimes[day as keyof typeof openTimes]
              ? "bg-white border-gray-300 cursor-default"
              : "bg-gray-100 border-gray-200 cursor-not-allowed"
          }`}
                          />
                          <input
                            type="time"
                            {...register(`${day}_close`)}
                            disabled={!openTimes[day as keyof typeof openTimes]}
                            className={`p-2 border rounded-md transition-all duration-300
          ${
            openTimes[day as keyof typeof openTimes]
              ? "bg-white border-gray-300 cursor-default"
              : "bg-gray-100 border-gray-200 cursor-not-allowed"
          }`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:w-4/12">
                <div className="bg-white p-4 rounded-lg border border-slate-200 sticky top-28">
                  <h4 className="text-lg font-semibold pb-4 -ml-4 px-4 -mr-4 border-b border-slate-200 mb-4">
                    Product Images
                  </h4>
                  <div>
                    <label htmlFor="featuredImage" className="block mb-2">
                      Featured Image
                    </label>
                    <input
                      type="file"
                      id="featuredImage"
                      onChange={handleFeaturedImageChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div>
                    <label htmlFor="gallery" className="block mb-2">
                      Gallery Images
                    </label>
                    {[...Array(4)].map((_, index) => (
                      <input
                        key={index}
                        type="file"
                        onChange={(e) => handleGalleryImageChange(e, index)}
                        className="w-full p-2 border rounded mb-2"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductAdd;

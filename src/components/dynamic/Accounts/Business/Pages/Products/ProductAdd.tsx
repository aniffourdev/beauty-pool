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
  id: number;
  name: string;
}

interface SubService {
  id: number;
  name: string;
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
  const [selectedSubService, setSelectedSubService] = useState<number | null>(null);

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

  const handleFeaturedImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImage(file);
    }
  };

  const handleGalleryImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
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
              "category.Categorie_id.services.Services_id.*"
            ],
          },
        });

        // Find the selected category and extract its services
        const selectedCategoryData = response.data.data.category.find(
          (cat: any) => cat.Categorie_id.id === selectedCategory
        );

        const serviceData = selectedCategoryData
          ? selectedCategoryData.Categorie_id.services.map((service: any) => ({
              id: service.Services_id.id,
              name: service.Services_id.name,
            }))
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
              "category.Categorie_id.services.Services_id.*",
              "category.Categorie_id.services.Services_id.sub_services.*"
            ],
          },
        });

        // Find the selected category
        const selectedCategoryData = response.data.data.category.find(
          (cat: any) => cat.Categorie_id.id === selectedCategory
        );

        // Find sub-services for the selected service within the selected category
        const subServiceData = selectedCategoryData
          ? selectedCategoryData.Categorie_id.services
              .filter((service: any) => service.Services_id.id === selectedService)
              .flatMap((service: any) =>
                service.Services_id.sub_services.map((subService: any) => ({
                  id: subService.id,
                  name: subService.name,
                }))
              )
          : [];

        setSubServices(subServiceData);
      } catch (error) {
        console.error("Error fetching sub-services:", error);
        setSubServices([]);
      }
    }
  };

  fetchSubServices();
}, [selectedCategory, selectedService]);

  
  useEffect(() => {
    const fetchSubServices = async () => {
      if (selectedService) {
        try {
          const response = await api.get("users/me", {
            params: {
              fields: [
                "category.Categorie_id.services.Services_id.*",
                "category.Categorie_id.services.Services_id.sub_services.*"
              ],
            },
          });
  
          // Find sub-services for the selected service
          const subServiceData = response.data.data.category
            .flatMap((cat: any) => 
              cat.Categorie_id.services
                .filter((service: any) => service.Services_id.id === selectedService)
                .flatMap((service: any) => 
                  service.Services_id.sub_services.map((subService: any) => ({
                    id: subService.id,
                    name: subService.name,
                  }))
                )
            );
  
          setSubServices(subServiceData);
        } catch (error) {
          console.error("Error fetching sub-services:", error);
          setSubServices([]);
        }
      }
    };
  
    if (selectedService) {
      fetchSubServices();
    }
  }, [selectedService]);

  useEffect(() => {
    const fetchSubServices = async () => {
      if (selectedService) {
        try {
          const response = await api.get("users/me", {
            params: {
              fields: `category.Categorie_id.services.Services_id.sub_services.*`,
            },
          });
          const subServiceData = response.data.data.category
            .flatMap((cat: any) =>
              cat.Categorie_id.services.flatMap((service: any) =>
                service.Services_id.sub_services.map((subService: any) => ({
                  id: subService.id,
                  name: subService.name,
                }))
              )
            )
            .filter((subService: any) => subService.id === selectedService);

          setSubServices(subServiceData || []);
        } catch (error) {
          console.error("Error fetching sub-services:", error);
        }
      }
    };

    fetchSubServices();
  }, [selectedService]);

  const onSubmit = async (data: any) => {
    console.log("Data Services:", data.services);
    console.log("Data Sub-Services:", data.sub_services);
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
          "https://maoulaty.shop/files",
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
            "https://maoulaty.shop/files",
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
          create: [
            {
              articles_id: "+",
              Services_id: {
                id: data.services && data.services.length > 0 ? data.services[0] : 189,
              },
            },
          ],
          update: [],
          delete: [],
        },
        sub_service: {
          create: data.sub_services && data.sub_services.length > 0 ? [
            {
              articles_id: "+",
              sub_services_id: {
                id: data.sub_services[0],
              },
            },
          ] : [],
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
  
      console.log("THIS IS PAYLOAD", payload);
  
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
          <div className="p-4">
            <ToastContainer />
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="label" className="block mb-2">
                  Label
                </label>
                <input
                  type="text"
                  id="label"
                  {...register("label", { required: "Label is required" })}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label htmlFor="slug" className="block mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  id="slug"
                  {...register("slug", { required: "Slug is required" })}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label htmlFor="description" className="block mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  {...register("description", { required: "Description is required" })}
                  className="w-full p-2 border rounded"
                />
              </div>

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

              <div>
                <label htmlFor="category" className="block mb-2">
                  Category
                </label>
                <select
                  id="category"
                  {...register("category", { required: "Category is required" })}
                  className="w-full p-2 border rounded"
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
                <label htmlFor="services" className="block mb-2">
                  Services
                </label>
                <select
                  id="services"
                  {...register("services", { required: "Service is required" })}
                  className="w-full p-2 border rounded"
                  onChange={(e) => {
                    setSelectedService(Number(e.target.value));
                  }}
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
  <label htmlFor="sub_services" className="block mb-2">
    Sub Services
  </label>
  <select
    id="sub_services"
    {...register("sub_services", { required: "Sub Service is required" })}
    className="w-full p-2 border rounded"
    onChange={(e) => {
      setSelectedSubService(Number(e.target.value));
    }}
  >
    <option value="">Select a sub service</option>
    {subServices.map((subService) => (
      <option key={subService.id} value={subService.id}>
        {subService.name}
      </option>
    ))}
  </select>
</div>


              <div>
                <label htmlFor="address" className="block mb-2">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  {...register("address", { required: "Address is required" })}
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Opening Times */}
              {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                <div key={day}>
                  <label className="block mb-2">
                    <input
                      type="checkbox"
                      checked={openTimes[day as keyof typeof openTimes]}
                      onChange={() => handleOpenTimeChange(day)}
                    />
                    {` Open on ${day.charAt(0).toUpperCase() + day.slice(1)}`}
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="time"
                      {...register(`${day}_open`)}
                      disabled={!openTimes[day as keyof typeof openTimes]}
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="time"
                      {...register(`${day}_close`)}
                      disabled={!openTimes[day as keyof typeof openTimes]}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              ))}

              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Article"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductAdd;

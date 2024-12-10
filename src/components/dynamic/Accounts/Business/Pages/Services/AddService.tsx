"use client";
import React, { FormEvent, useEffect, useState } from "react";
import Sidenav from "@/components/dynamic/Accounts/Business/Sidenav";
import Header from "@/components/dynamic/Accounts/Business/Header/Header";
import api from "@/services/auth";
import { Gruppo } from "next/font/google";

interface Category {
  id: number;
  label: string;
}

interface Service {
  id: number;
  name: string;
}

interface ServiceData {
  name: string;
  duration: number;
  price: number;
  description: string;
  status: "published" | "draft";
  categories: number;
  price_type: "fixed" | "variable" | "free";
  service: number;
}

const gruppo = Gruppo({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: "400",
});

const AddService = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState<ServiceData>({
    name: "",
    duration: 0,
    price: 0,
    description: "",
    status: "published",
    categories: 0,
    price_type: "fixed",
    service: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("users/me", {
          params: {
            fields: "category.Categorie_id.id,category.Categorie_id.label",
          },
        });

        const categoryData = response.data.data.category.map((cat: any) => ({
          id: cat.Categorie_id.id,
          label: cat.Categorie_id.label,
        }));

        setCategories(categoryData);

        if (categoryData.length > 0) {
          setFormData((prev) => ({
            ...prev,
            categories: categoryData[0].id,
          }));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await api.get("items/Services");
        console.log("Services API response:", response);

        if (response.data && Array.isArray(response.data.data)) {
          const serviceData = response.data.data.map((service: any) => ({
            id: service.id,
            name: service.name,
          }));

          setServices(serviceData);

          if (serviceData.length > 0) {
            setFormData((prev) => ({
              ...prev,
              service: serviceData[0].id,
            }));
          }
        } else {
          console.error("Services data is not an array or is empty:", response.data);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchCategories();
    fetchServices();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      sub_services: {
        create: [
          {
            status: "published",
            name: formData.name,
            duration: formData.duration,
            price: formData.price,
            description: formData.description,
            price_type: formData.price_type,
          },
        ],
        update: [],
        delete: [],
      },
    };

    console.log("Payload:", payload);

    try {
      const response = await api.patch(`items/Services/${formData.service}`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response:", response);

      if (response.status === 200 || response.status === 201) {
        alert("Sub-service created successfully!");
        setFormData({
          name: "",
          duration: 30,
          price: 20,
          description: "",
          status: "published",
          categories: categories[0]?.id || 0,
          price_type: "fixed",
          service: services[0]?.id || 0,
        });
      }
    } catch (error) {
      console.error("Error creating sub-service:", error);
      alert("Failed to create sub-service");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["duration", "categories", "price", "service"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  return (
    <div className="">
      <Header />
      <Sidenav />

      <div className="ml-0 lg:ml-44 p-5 xl:pt-32 xl:pl-14 overflow-auto bg-slate-50 min-h-screen">
        <div className="max-w-3xl mx-auto">
          <form action="" onSubmit={handleSubmit}>
            <div className="flex justify-between items-center mb-5">
              <h2
                className={`${gruppo.className} text-4xl text-black font-bold`}
              >
                New service
              </h2>
              <button
                className="py-2 px-4 rounded bg-slate-900 text-white font-semibold"
                type="submit"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
            <div className="lg:flex gap-5">
              <div className="lg:w-12/12">
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <h4 className="text-lg font-semibold pb-4 -ml-4 px-4 -mr-4 border-b border-slate-200 mb-4">
                    Basic details
                  </h4>
                  <div className="grid grid-cols-1">
                    <div className="mb-5">
                      <label
                        className="block text-gray-900 text-[13px] font-semibold mb-1"
                        htmlFor="Servicename"
                      >
                        Service name
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        id="Servicename"
                        name="name"
                        value={formData.name}
                        autoComplete="off"
                        onChange={handleChange}
                        required
                        placeholder="Enter service name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-5">
                      <label
                        className="block text-gray-900 text-[13px] font-semibold mb-1"
                        htmlFor="description"
                      >
                        Main category
                      </label>
                      <select
                        id="categories"
                        name="categories"
                        value={formData.categories}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-5">
                      <label
                        className="block text-gray-900 text-[13px] font-semibold mb-1"
                        htmlFor="service"
                      >
                        Service
                      </label>
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                      >
                        {services.length > 0 ? (
                          services.map((service) => (
                            <option key={service.id} value={service.id}>
                              {service.name}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            No services available
                          </option>
                        )}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1">
                    <div className="">
                      <label
                        className="block text-gray-900 text-[13px] font-semibold mb-1"
                        htmlFor="description"
                      >
                        Description (Optional)
                      </label>
                      <textarea
                        className="shadow min-h-28 max-h-28 appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        autoComplete="off"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Enter service description"
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200 mt-5 mb-10">
                  <h4 className="text-lg font-semibold pb-4 -ml-4 px-4 -mr-4 border-b border-slate-200 mb-4">
                    Pricing and duration
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="">
                      <label
                        className="block text-gray-900 text-[13px] font-semibold mb-1"
                        htmlFor="Duration"
                      >
                        Duration
                      </label>
                      <select
                        className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select duration</option>
                        <option value="5">5min</option>
                        <option value="10">10min</option>
                        <option value="15">15min</option>
                        <option value="20">20min</option>
                        <option value="25">25min</option>
                        <option value="30">30min</option>
                        <option value="35">35min</option>
                        <option value="40">40min</option>
                        <option value="45">45min</option>
                        <option value="50">50min</option>
                        <option value="55">55min</option>
                        <option value="60">1h</option>
                        <option value="65">1h 5min</option>
                        <option value="70">1h 10min</option>
                        <option value="75">1h 15min</option>
                        <option value="80">1h 20min</option>
                        <option value="85">1h 25min</option>
                        <option value="90">1h 30min</option>
                        <option value="95">1h 35min</option>
                        <option value="100">1h 40min</option>
                        <option value="105">1h 45min</option>
                        <option value="110">1h 50min</option>
                        <option value="115">1h 55min</option>
                        <option value="120">2h</option>
                        <option value="135">2h 15min</option>
                        <option value="150">2h 30min</option>
                        <option value="165">2h 45min</option>
                        <option value="180">3h</option>
                        <option value="195">3h 15min</option>
                        <option value="210">3h 30min</option>
                        <option value="225">3h 45min</option>
                        <option value="240">4h</option>
                        <option value="270">4h 30min</option>
                        <option value="300">5h</option>
                        <option value="330">5h 30min</option>
                        <option value="360">6h</option>
                        <option value="390">6h 30min</option>
                        <option value="420">7h</option>
                        <option value="450">7h 30min</option>
                        <option value="480">8h</option>
                        <option value="540">9h</option>
                        <option value="600">10h</option>
                        <option value="660">11h</option>
                        <option value="720">12h</option>
                      </select>
                    </div>
                    <div className="">
                      <label
                        className="block text-gray-900 text-[13px] font-semibold mb-1"
                        htmlFor="PriceType"
                      >
                        Price type
                      </label>
                      <select
                        id="price_type"
                        name="price_type"
                        value={formData.price_type}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      >
                        <option value="free">Free</option>
                        <option value="from">From</option>
                        <option value="fixed">Fixed</option>
                      </select>
                    </div>
                    <div className="">
                      <label
                        className="block text-gray-900 text-[13px] font-semibold mb-1"
                        htmlFor="Price"
                      >
                        Price
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                      />
                    </div>
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

export default AddService;

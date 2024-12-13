"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/dynamic/Accounts/Business/Global/Sidebar";
import Header from "@/components/dynamic/Accounts/Business/Global/Header";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import api from "@/services/auth";
import Link from "next/link";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { Gruppo } from "next/font/google";
import { Toaster, toast } from "react-hot-toast";

// Define a type for user data
interface UserData {
  id: string;
  first_name: string;
  category: number[];
}

interface SubService {
  id: number;
  name: string;
  price: number;
  duration: number;
  price_type: string;
  description: string;
}

interface Service {
  id: number;
  name: string;
  sub_services: SubService[];
}

interface Category {
  id: number;
  label: string;
  icon: string;
  services: {
    Categorie_id: {
      id: number;
      services: {
        Services_id: Service | null;
      }[];
    };
  }[];
}

interface UserCategoryData {
  category: { id: number; Categorie_id: Category }[];
}

const gruppo = Gruppo({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: "400",
});

const Services: React.FC = () => {
  const [data, setData] = useState<UserCategoryData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeCategory, setActiveCategory] =
    useState<string>("All categories");
  const [addCategory, setAddCategory] = useState<boolean>(false);
  const [availableCategories, setAvailableCategories] = useState<Category[]>(
    []
  );
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [openServiceMenus, setOpenServiceMenus] = useState<
    Record<number, boolean>
  >({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleServiceMenu = (id: number) => {
    setOpenServiceMenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleRemoveCategory = async (categoryId: number) => {
    try {
      const payload = {
        category: {
          create: [],
          update: [],
          delete: [categoryId],
        },
      };

      await api.patch(`/users/me`, payload);

      // Refresh data after deletion
      const response = await api.get(`/users/me`, {
        params: {
          "fields[]": [
            "category.id",
            "category.Categorie_id.label",
            "category.Categorie_id.services.Categorie_id.services.Services_id.name",
            "category.Categorie_id.services.Categorie_id.services.Services_id.sub_services.sub_services_id.name",
            "category.Categorie_id.services.Categorie_id.services.Services_id.sub_services.sub_services_id.price",
            "category.Categorie_id.services.Categorie_id.services.Services_id.sub_services.sub_services_id.duration",
            "category.Categorie_id.services.Categorie_id.services.Services_id.sub_services.sub_services_id.price_type",
            "category.Categorie_id.services.Categorie_id.services.Services_id.sub_services.sub_services_id.description",
          ],
        },
      });
      setData(response.data.data);
      toast.success("Category Removed");
    } catch (err: unknown) {
      console.error("Error removing category:", err);
    }
  };

  const handleUserDataFetched = (data: UserData | null) => {
    setUserData(data);
  };

  const handleAddCategory = () => {
    setAddCategory(true);
  };

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSaveCategories = async () => {
    if (userData && selectedCategories.length > 0) {
      const payload = {
        category: {
          create: selectedCategories.map((id) => ({
            directus_users_id: userData.id,
            Categorie_id: { id },
          })),
        },
      };

      try {
        await api.patch(`/users/${userData.id}`, payload);
        setAddCategory(false);
        // Refresh the data
        const response = await api.get(`/users/me`, {
          params: {
            "fields[]": [
              "category.id",
              "category.Categorie_id.label",
              "category.Categorie_id.services.Categorie_id.services.Services_id.name",
              "category.Categorie_id.services.Categorie_id.services.Services_id.sub_services.sub_services_id.name",
              "category.Categorie_id.services.Categorie_id.services.Services_id.sub_services.sub_services_id.price",
              "category.Categorie_id.services.Categorie_id.services.Services_id.sub_services.sub_services_id.duration",
              "category.Categorie_id.services.Categorie_id.services.Services_id.sub_services.sub_services_id.price_type",
              "category.Categorie_id.services.Categorie_id.services.Services_id.sub_services.sub_services_id.description",
            ],
          },
        });
        setData(response.data.data);
        toast.success("Category Added");
      } catch (err: unknown) {
        console.error("Error saving categories:", err);
      }
    }
  };

  const handleDeleteSubService = async (subServiceId: number) => {
    console.log("Deleting sub-service with ID:", subServiceId);
    try {
      await api.delete(`/items/sub_services/${subServiceId}`);

      // Refresh data after deletion
      const response = await api.get(`/users/me`, {
        params: {
          "fields[]": [
            "category.id",
            "category.Categorie_id.label",
            "category.Categorie_id.services.Categorie_id.services.Services_id.name",
            "category.Categorie_id.services.Categorie_id.services.Services_id.sub_services.sub_services_id.name",
            "category.Categorie_id.services.Categorie_id.services.Services_id.sub_services.sub_services_id.price",
            "category.Categorie_id.services.Categorie_id.services.Services_id.sub_services.sub_services_id.duration",
            "category.Categorie_id.services.Categorie_id.services.Services_id.sub_services.sub_services_id.price_type",
            "category.Categorie_id.services.Categorie_id.services.Services_id.sub_services.sub_services_id.description",
          ],
        },
      });
      setData(response.data.data);
    } catch (err: unknown) {
      console.error("Error deleting sub-service:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/users/me`, {
          params: {
            "fields[]": [
              "category.id",
              "category.Categorie_id.label",
              "category.Categorie_id.services.Categorie_id.services.Services_id.name",
              "category.Categorie_id.services.Categorie_id.services.Services_id.sub_services.sub_services_id.id",
              "category.Categorie_id.services.Categorie_id.services.Services_id.sub_services.sub_services_id.name",
              "category.Categorie_id.services.Categorie_id.services.Services_id.sub_services.sub_services_id.price",
              "category.Categorie_id.services.Categorie_id.services.Services_id.sub_services.sub_services_id.duration",
              "category.Categorie_id.services.Categorie_id.services.Services_id.sub_services.sub_services_id.price_type",
              "category.Categorie_id.services.Categorie_id.services.Services_id.sub_services.sub_services_id.description",
            ],
          },
        });
        setData(response.data.data);

        const categoriesResponse = await api.get(`/items/Categorie`);
        setAvailableCategories(categoriesResponse.data.data);
        console.log(categoriesResponse.data.data);
      } catch (err: unknown) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getServicesForCategory = (categoryLabel: string) => {
    if (!data) return [];
    const category = data.category.find(
      (cat) => cat.Categorie_id.label === categoryLabel
    );

    if (!category) return [];

    const services: Service[] = [];
    const serviceSet = new Set<string>(); // To avoid duplicates
    category.Categorie_id.services.forEach((serviceWrapper) => {
      serviceWrapper.Categorie_id.services.forEach((service) => {
        if (service.Services_id && !serviceSet.has(service.Services_id.name)) {
          services.push(service.Services_id);
          serviceSet.add(service.Services_id.name);
        }
      });
    });

    return services;
  };

  const servicesForActiveCategory =
    activeCategory === "All categories"
      ? data?.category?.flatMap((cat) =>
          getServicesForCategory(cat.Categorie_id.label)
        ) || []
      : getServicesForCategory(activeCategory);

  const categoryServiceCounts =
    data?.category?.map((cat) => ({
      label: cat.Categorie_id.label,
      count: getServicesForCategory(cat.Categorie_id.label).length,
      id: cat.id, // Add the category ID here
    })) || [];

  const existingCategoryIds =
    data?.category.map((cat) => cat.Categorie_id.id) || [];

  const filteredCategories = categoryServiceCounts?.filter((cat) =>
    cat.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredServices = servicesForActiveCategory.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const CategoryCard = ({
    id,
    label,
    icon,
    isSelected,
    isDisabled,
    onChange,
  }: {
    id: number;
    label: string;
    icon: string;
    isSelected: boolean;
    isDisabled: boolean;
    onChange: () => void;
  }) => {
    return (
      <div
        className={`border-2 rounded-lg p-4 flex items-center justify-between relative ${
          isSelected ? "border-[#f4b8ae]" : "border-gray-300"
        }`}
        style={{ opacity: isDisabled ? 0.5 : 1 }}
      >
        <div className="text-center">
          <input
            type="checkbox"
            className="hidden"
            id={`category-${id}`}
            checked={isSelected}
            disabled={isDisabled}
            onChange={onChange}
          />
          <label
            htmlFor={`category-${id}`}
            className="cursor-pointer flex justify-center items-center flex-col space-y-2"
          >
            <div
              className="h-7 w-7 bg-cover bg-center mb-2"
              style={{
                backgroundImage: `url('https://maoulaty.shop/assets/${icon}')`,
              }}
            ></div>
            <p className="text-black font-semibold text-sm">{label}</p>
          </label>
        </div>
      </div>
    );
  };

  const ServiceCard = ({ subService }: { subService: SubService }) => {
    return (
      <div className="flex items-center mb-3 justify-between p-2.5 border-l-[7px] border-l-[#b64077] bg-white rounded-lg border border-gray-200 relative">
        <div className="flex items-start">
          <div className="ml-4">
            <h2 className="font-semibold text-black">{subService.name}</h2>
            <p className="text-gray-500 text-sm">{subService.duration} mins</p>
            <p className="text-gray-500 text-sm">{subService.name}</p>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-[#b64077] font-bold text-sm">
            €{subService.price}
          </span>
          <HiOutlineDotsVertical
            className="ml-4 cursor-pointer text-gray-800 size-5"
            onClick={() => toggleServiceMenu(subService.id)}
          />
          {openServiceMenus[subService.id] && (
            <div className="absolute right-0 bg-white shadow-md rounded-md p-2 z-10">
              <Link
                href={`/business/services/service-edit?id=${subService.id}`}
                className="text-blue-600 text-sm font-semibold mb-2 block"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDeleteSubService(subService.id)}
                className="text-red-600 text-sm font-semibold"
              >
                Permanently delete
              </button>
            </div>
          )}
        </div>
      </div>
    );
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
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2
                className={`${gruppo.className} text-4xl text-black font-bold`}
              >
                Services
              </h2>
              <p className="text-slate-800 text-md font-medium">
                View and manage the services offered by your business.
              </p>
            </div>
            <div>
              <Link
                href="/business/services/service-add"
                className="py-2 px-4 rounded bg-slate-900 text-white font-semibold"
              >
                <FiPlus className="inline-block size-5 relative -top-[1px]" />{" "}
                <span className="hidden lg:inline">Add New</span>
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="lg:flex space-x-6">
              <div className="lg:w-1/4 mb-5 lg:mb-0 ml-0 lg:ml-6">
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search service name"
                    className="w-full border border-gray-300 rounded-md px-4 py-2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="bg-white rounded-md shadow p-4">
                  <h2 className="text-lg font-bold mb-4">Categories</h2>
                  <ul>
                    <li className="flex justify-between items-center mb-3.5">
                      <div className="h-6 skeleton rounded w-3/4"></div>
                      <div className="h-5 w-5 skeleton rounded-full"></div>
                    </li>
                    {[...Array(3)].map((_, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center mb-3.5"
                      >
                        <div className="flex justify-start items-center gap-1">
                          <div className="h-4 skeleton rounded w-4"></div>
                          <div className="h-6 skeleton rounded w-3/4"></div>
                        </div>
                        <div className="h-5 w-5 skeleton rounded-full"></div>
                      </li>
                    ))}
                    <li className="mt-4">
                      <div className="h-6 skeleton rounded w-2/4"></div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="lg:w-3/4 ml-0 lg:ml-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="h-6 skeleton rounded w-2/4"></div>
                </div>
                <div>
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="mb-4">
                      <div className="h-6 skeleton rounded w-3/4 mb-2"></div>
                      {[...Array(2)].map((_, subIndex) => (
                        <div
                          key={subIndex}
                          className="skeleton mb-3 flex items-center p-2.5"
                        >
                          <div className="flex items-start">
                            <div className="ml-4">
                              <div className="h-6 skeleton rounded w-3/4 mb-2"></div>
                              <div className="h-4 skeleton rounded w-2/4 mb-2"></div>
                              <div className="h-4 skeleton rounded w-1/2"></div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="h-6 skeleton rounded w-1/4"></div>
                            <div className="h-6 skeleton rounded w-6"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="lg:flex space-x-6">
              <div className="lg:w-1/4 mb-5 lg:mb-0 ml-0 lg:ml-6">
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search service name"
                    className="w-full border border-gray-300 rounded-md px-4 py-2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="bg-white rounded-md shadow p-4">
                  <h2 className="text-lg font-bold mb-4">Categories</h2>
                  <ul>
                    <li
                      key="all"
                      className="flex justify-between items-center mb-3.5"
                    >
                      <Link
                        href="#"
                        className={`text-sm font-bold text-${
                          activeCategory === "All categories"
                            ? "violet-600"
                            : "gray-800"
                        }`}
                        onClick={() => setActiveCategory("All categories")}
                      >
                        All categories
                      </Link>
                      <span className="bg-[#ffe0ee] rounded-full h-5 w-5 flex justify-center items-center">
                        <span className="font-bold text-[#b64077] text-xs">
                          {data?.category.reduce(
                            (count, cat) =>
                              count +
                              getServicesForCategory(cat.Categorie_id.label)
                                .length,
                            0
                          )}
                        </span>
                      </span>
                    </li>
                    {filteredCategories?.map((cat, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center mb-3.5"
                      >
                        <div className="flex justify-start items-center gap-1">
                          <FiTrash2
                            className="tooltip cursor-pointer text-red-600 size-4"
                            data-tip="Remove"
                            onClick={() => handleRemoveCategory(cat.id)}
                          />
                          <Link
                            href="#"
                            className={`text-sm font-bold text-${
                              activeCategory === cat.label
                                ? "violet-600"
                                : "gray-800"
                            }`}
                            onClick={() => setActiveCategory(cat.label)}
                          >
                            {cat.label}
                          </Link>
                        </div>
                        <span className="bg-[#ffe0ee] rounded-full h-5 w-5 flex justify-center items-center">
                          <span className="font-bold text-[#b64077] text-xs">
                            {cat.count}
                          </span>
                        </span>
                      </li>
                    ))}

                    <li className="mt-4">
                      <button
                        className="text-sm font-semibold text-[#b64077] underline"
                        onClick={handleAddCategory}
                      >
                        Add category
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="lg:w-3/4 ml-0 lg:ml-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-[#b64077]">
                    {activeCategory}
                  </h2>
                </div>

                {activeCategory === "All categories" ? (
                  data?.category?.map((cat, catIndex) => (
                    <div key={catIndex} className="mb-4">
                      <h3 className="text-md font-bold text-black mb-2">
                        {cat.Categorie_id.label}
                      </h3>
                      {getServicesForCategory(cat.Categorie_id.label).length >
                      0 ? (
                        getServicesForCategory(cat.Categorie_id.label).map(
                          (service, serviceIndex) => (
                            <div key={serviceIndex}>
                              {service.sub_services.length ? (
                                <>
                                  {service.sub_services.map(
                                    (subService, subIndex) => (
                                      <ServiceCard
                                        key={subIndex}
                                        subService={subService}
                                      />
                                    )
                                  )}
                                </>
                              ) : (
                                <></>
                              )}
                            </div>
                          )
                        )
                      ) : (
                        <div className="py-2 px-4 border-2 border-slate-200 rounded-md">
                          <span className="text-slate-400 font-medium text-sm">
                            No Services
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div>
                    {filteredServices.length > 0 ? (
                      filteredServices.map((service, serviceIndex) => (
                        <div key={serviceIndex}>
                          {service.sub_services.length ? (
                            <>
                              {service.sub_services.map(
                                (subService, subIndex) => (
                                  <ServiceCard
                                    key={subIndex}
                                    subService={subService}
                                  />
                                )
                              )}
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="py-2 px-4 border-2 border-slate-200 rounded-md">
                        <span className="text-slate-400 font-medium text-sm">
                          No Services
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {addCategory && (
        <div className="h-full w-full bg-black/25 flex px-4 items-center justify-center fixed left-0 top-0 z-50">
          <div className="bg-white rounded-md shadow p-4 w-full lg:w-1/3 h-3/4 overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Add Category</h2>
              <button onClick={() => setAddCategory(false)}>×</button>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              {availableCategories.map((category) => (
                <CategoryCard
                  key={category.id}
                  id={category.id}
                  label={category.label}
                  icon={category.icon}
                  isSelected={selectedCategories.includes(category.id)}
                  isDisabled={existingCategoryIds.includes(category.id)}
                  onChange={() => handleCategorySelect(category.id)}
                />
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="py-2 w-full rounded bg-slate-900 text-white font-semibold"
                onClick={handleSaveCategories}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      <Toaster position="top-center" reverseOrder={true} />
    </div>
  );
};

export default Services;

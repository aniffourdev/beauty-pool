"use client";
import React, { useEffect, useState, useRef } from "react";
import { IoStar } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import api from "@/services/auth";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import gsap from "gsap";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Services from "@/components/dynamic/Book/Services"; // Import the Services component
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import BookingSteps from "@/components/dynamic/Book/Steps/BookingSteps";
import { CiClock1, CiLocationOn } from "react-icons/ci";
import Link from "next/link";
import { FaArrowDown } from "react-icons/fa";
import Cookies from "js-cookie";
import { OrbitProgress } from "react-loading-indicators";
import { GoHeart, GoHeartFill, GoShareAndroid } from "react-icons/go";

interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  Address: string;
  phone: string;
}

interface Review {
  user_created: UserData;
  date_created: string;
  rating: number;
  comment: string;
  article: number;
}

interface Gallery {
  directus_files_id: {
    id: string;
    filename_download: string;
  };
}

interface ArticleData {
  id: number;
  label: string;
  description: string;
  reviews: Review[];
  Address: string;
  featured_image: string;
  location: string; // Add the location property
  galleries: Gallery[];
  monday_open?: string;
  monday_close?: string;
  tuesday_open?: string;
  tuesday_close?: string;
  wednesday_open?: string;
  wednesday_close?: string;
  thursday_open?: string;
  thursday_close?: string;
  friday_open?: string;
  friday_close?: string;
  saturday_open?: string;
  saturday_close?: string;
  sunday_open?: string;
  sunday_close?: string;
}

interface SubService {
  id: string;
  name: string;
  price: string;
  duration: string;
  description: string;
}

interface ParentService {
  name: string;
  description: string;
  sub_services: SubService[];
}

interface Service {
  id: string;
  parent_service: ParentService;
}

interface SingleBookProps {
  slug: string;
}

const formatTime = (time: string | null): string => {
  if (!time) return "Closed";
  const [hours, minutes] = time.split(":");
  return `${hours}:${minutes}`;
};

const getCurrentOpeningTime = (article: ArticleData): string => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const days = [
    { open: article.sunday_open ?? null, close: article.sunday_close ?? null },
    { open: article.monday_open ?? null, close: article.monday_close ?? null },
    {
      open: article.tuesday_open ?? null,
      close: article.tuesday_close ?? null,
    },
    {
      open: article.wednesday_open ?? null,
      close: article.wednesday_close ?? null,
    },
    {
      open: article.thursday_open ?? null,
      close: article.thursday_close ?? null,
    },
    { open: article.friday_open ?? null, close: article.friday_close ?? null },
    {
      open: article.saturday_open ?? null,
      close: article.saturday_close ?? null,
    },
  ];

  const today = days[dayOfWeek];
  if (!today.open || !today.close) return "Closed";

  const [openHour, openMinute] = today.open.split(":").map(Number);
  const [closeHour, closeMinute] = today.close.split(":").map(Number);

  const isOpen =
    (currentHour > openHour ||
      (currentHour === openHour && currentMinute >= openMinute)) &&
    (currentHour < closeHour ||
      (currentHour === closeHour && currentMinute < closeMinute));

  return isOpen ? formatTime(today.close) : "Closed";
};

const ImageModal = ({
  isOpen,
  onClose,
  images,
  modalRef,
}: {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  modalRef: React.RefObject<HTMLDivElement>;
}) => {
  useEffect(() => {
    if (isOpen) {
      gsap.set(modalRef.current, {
        opacity: 0,
        scale: 0.8,
        display: "flex",
      });
      gsap.to(modalRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [isOpen, modalRef]);

  const handleClose = () => {
    gsap.to(modalRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        gsap.set(modalRef.current, { display: "none" });
        onClose();
      },
    });
  };

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 hidden items-center justify-center bg-black bg-opacity-75 p-4"
    >
      <div className="relative w-full max-w-6xl">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 text-white text-3xl"
        >
          <IoClose />
        </button>
        <Swiper
          modules={[Navigation, Pagination]}
          navigation={{
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next",
          }}
          pagination={{ clickable: true }}
          loop={true}
          className="w-full"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                src={image}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-[80vh] object-contain rounded-lg"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="mask mask-hexagon swiper-button-prev !text-white !h-14 !w-14 flex justify-center items-center"></div>
        <div className="mask mask-hexagon swiper-button-next !text-white !h-14 !w-14 flex justify-center items-center"></div>
      </div>
    </div>
  );
};

const SingleBook: React.FC<SingleBookProps> = ({ slug }) => {
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [booking, setBooking] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [favoriteId, setFavoriteId] = useState<string | null>(null);
  const [mapCoordinates, setMapCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { data: slugResponse } = await api.get("/items/articles", {
          params: {
            "filter[slug][_eq]": slug,
            fields:
              "*,galleries.directus_files_id.*,reviews.*,reviews.user_created.first_name,reviews.user_created.last_name,monday_open,monday_close,tuesday_open,tuesday_close,wednesday_open,wednesday_close,thursday_open,thursday_close,friday_open,friday_close,saturday_open,saturday_close,sunday_open,sunday_close",
          },
        });

        if (slugResponse.data && slugResponse.data.length > 0) {
          const articleId = slugResponse.data[0].id;

          const { data: articleResponse } = await api.get(
            `/items/articles/${articleId}`,
            {
              params: {
                fields:
                  "*,galleries.directus_files_id.*,reviews.*,reviews.user_created.first_name,reviews.user_created.last_name,monday_open,monday_close,tuesday_open,tuesday_close,wednesday_open,wednesday_close,thursday_open,thursday_close,friday_open,friday_close,saturday_open,saturday_close,sunday_open,sunday_close",
              },
            }
          );

          if (articleResponse.data) {
            setArticle(articleResponse.data);

            // Fetch services data
            const servicesResponse = await api.get(
              `https://maoulaty.shop/items/articles/${articleId}?fields=service.Services_id.name,service.Services_id.sub_services.sub_services_id.name,service.Services_id.sub_services.sub_services_id.price,service.Services_id.sub_services.sub_services_id.duration,service.Services_id.sub_services.sub_services_id.description`
            );
            const servicesData = servicesResponse.data.data.service;

            const parentServices: { [key: string]: ParentService } = {};
            servicesData.forEach(
              (service: {
                Services_id: {
                  name: string;
                  sub_services: { sub_services_id: SubService }[];
                };
              }) => {
                const serviceName = service.Services_id.name;
                if (!parentServices[serviceName]) {
                  parentServices[serviceName] = {
                    name: serviceName,
                    description: "",
                    sub_services: [],
                  };
                }
                service.Services_id.sub_services.forEach((subService) => {
                  if (subService.sub_services_id) {
                    parentServices[serviceName].sub_services.push(
                      subService.sub_services_id
                    );
                  }
                });
              }
            );

            const formattedServices = Object.keys(parentServices).map(
              (key, index) => ({
                id: String(index + 1),
                parent_service: parentServices[key],
              })
            );

            setServices(formattedServices);

            // Geocode the address
            const coordinates = await geocodeAddress(articleResponse.data.Address);
            setMapCoordinates(coordinates);
          } else {
            setError("Article details not found");
          }
        } else {
          setError("Article not found");
        }
      } catch (err) {
        setError("Error fetching article");
        console.error("Error fetching article:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await api.get("/users/me");
        setCurrentUser(response.data.data);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const checkIfFavorited = async () => {
      if (article && currentUser) {
        try {
          const response = await api.get("/items/favorites", {
            params: {
              filter: {
                article: article.id,
                favorited: currentUser.id,
              },
            },
          });
          const favorites = response.data.data;
          if (favorites.length > 0) {
            setIsFavorited(true);
            setFavoriteId(favorites[0].id);
          }
        } catch (error) {
          console.error("Error checking if article is favorited:", error);
        }
      }
    };

    checkIfFavorited();
  }, [article, currentUser]);

  const geocodeAddress = async (address: string): Promise<{ latitude: number; longitude: number } | null> => {
    const accessToken = "pk.eyJ1IjoiYW5pZmZvdXJkZXYiLCJhIjoiY2xvc28zMXJjMDM4dTJycXc0aHBkN2pmcyJ9.IEOWZZQT6rlwKckMaoTh8g"; // Replace with your Mapbox API key
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address
        )}.json?access_token=${accessToken}`
      );

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const data = await response.json();

      // Check if data is available
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        return {
          latitude: feature.center[1],
          longitude: feature.center[0],
        };
      } else {
        console.error("No data found for address:", address);
        return null;
      }
    } catch (error) {
      console.error("Error geocoding address:", error);
      return null;
    }
  };

  if (loading)
    return (
      <div className="px-3 lg:px-8">
        <div className="lg:flex gap-8">
          <div className="lg:w-8/12">
            <div className="p-4">
              <div className="skeleton h-8 mb-4 w-full rounded"></div>
              <div className="lg:flex justify-between items-center gap-4">
                <div className="skeleton h-4 mb-4 w-full rounded"></div>
                <div className="skeleton h-4 mb-4 w-full rounded"></div>
                <div className="flex justify-center items-center gap-2">
                  <div className="skeleton h-11 w-11 mb-4 rounded-full"></div>
                  <div className="skeleton h-11 w-11 mb-4 rounded-full"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 mb-6">
                <div className="col-span-2">
                  <div className="skeleton h-80 w-full rounded"></div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="skeleton h-40 w-full rounded"></div>
                  <div className="skeleton h-40 w-full rounded"></div>
                </div>
              </div>
              <div className="skeleton h-10 w-32 rounded mb-3"></div>
              <div className="flex justify-center items-center gap-2">
                <div className="skeleton h-10 w-full rounded-full"></div>
                <div className="skeleton h-10 w-full rounded-full"></div>
                <div className="skeleton h-10 w-full rounded-full"></div>
                <div className="skeleton h-10 w-full rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="lg:w-4/12">
            <div className="p-4">
              <div className="skeleton h-96 w-full rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  if (error) return <div>{error}</div>;

  const allImages = [
    `https://maoulaty.shop/assets/${article?.featured_image}`,
    ...(article?.galleries || []).map(
      (gallery) =>
        `https://maoulaty.shop/assets/${gallery.directus_files_id.id}`
    ),
  ];

  const galleryImages = article?.galleries || [];
  const firstTwoImages = galleryImages.slice(0, 2);

  const currentDay = new Date().getDay();
  const openingTimes: {
    day: string;
    time: string;
    open: boolean;
    currentDay: boolean;
  }[] = [
    {
      day: "Monday",
      time:
        formatTime(article?.monday_open ?? null) +
        " – " +
        formatTime(article?.monday_close ?? null),
      open: !!article?.monday_open && !!article?.monday_close,
      currentDay: currentDay === 1,
    },
    {
      day: "Tuesday",
      time:
        formatTime(article?.tuesday_open ?? null) +
        " – " +
        formatTime(article?.tuesday_close ?? null),
      open: !!article?.tuesday_open && !!article?.tuesday_close,
      currentDay: currentDay === 2,
    },
    {
      day: "Wednesday",
      time:
        formatTime(article?.wednesday_open ?? null) +
        " – " +
        formatTime(article?.wednesday_close ?? null),
      open: !!article?.wednesday_open && !!article?.wednesday_close,
      currentDay: currentDay === 3,
    },
    {
      day: "Thursday",
      time:
        formatTime(article?.thursday_open ?? null) +
        " – " +
        formatTime(article?.thursday_close ?? null),
      open: !!article?.thursday_open && !!article?.thursday_close,
      currentDay: currentDay === 4,
    },
    {
      day: "Friday",
      time:
        formatTime(article?.friday_open ?? null) +
        " – " +
        formatTime(article?.friday_close ?? null),
      open: !!article?.friday_open && !!article?.friday_close,
      currentDay: currentDay === 5,
    },
    {
      day: "Saturday",
      time:
        formatTime(article?.saturday_open ?? null) +
        " – " +
        formatTime(article?.saturday_close ?? null),
      open: !!article?.saturday_open && !!article?.saturday_close,
      currentDay: currentDay === 6,
    },
    {
      day: "Sunday",
      time:
        formatTime(article?.sunday_open ?? null) +
        " – " +
        formatTime(article?.sunday_close ?? null),
      open: !!article?.sunday_open && !!article?.sunday_close,
      currentDay: currentDay === 0,
    },
  ];

  const handleBooking = () => {
    const accessToken = Cookies.get("access_token");
    if (accessToken) {
      setBooking(true); // This should be fine as long as it's not causing a re-render during rendering
    } else {
      setShowLoginPopup(true);
    }
  };

  const handleLogin = () => {
    // Implement your login logic here
    setShowLoginPopup(false);
  };

  const handleFavorite = async (article: ArticleData) => {
    if (!currentUser) return;

    setFavoriteLoading(true);

    try {
      if (isFavorited) {
        // Remove from favorites
        if (favoriteId) {
          await api.delete(`/items/favorites/${favoriteId}`);
          setIsFavorited(false);
          setFavoriteId(null);
        }
      } else {
        // Add to favorites
        const response = await api.post("/items/favorites", {
          favorited: currentUser.id,
          article: article.id,
          status: "published",
        });
        setIsFavorited(true);
        setFavoriteId(response.data.data.id);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <div className="px-3 lg:px-8">
      <div className="lg:flex gap-8">
        <div className="lg:w-8/12">
          <div className="p-4">
            <h1 className="text-3xl font-bold">{article?.label}</h1>
            <div className="lg:flex justify-between items-center">
              <div className="flex items-center mt-2">
                <span className="text-lg font-bold">5.0</span>
                <span className="text-slate-700 ml-1 relative -top-[1px] flex justify-center items-center">
                  <IoStar className="text-slate-700" />
                  <IoStar className="text-slate-700" />
                  <IoStar className="text-slate-700" />
                  <IoStar className="text-slate-700" />
                  <IoStar className="text-slate-700" />
                </span>
                <span className="text-[#f47c66] font-bold ml-1">(1,458)</span>
                <span className="text-slate-800 text-sm font-semibold mx-2">
                  •
                </span>
                <span className="text-slate-800 text-sm font-semibold">
                  Open until {getCurrentOpeningTime(article!)}
                </span>
                <span className="text-slate-800 text-sm font-semibold mx-2">
                  •
                </span>
                <span className="text-slate-800 text-sm font-semibold">
                  {article?.Address}
                </span>
                <a
                  href={`https://www.google.com/maps?q=${article?.Address}`}
                  target="_blank"
                  className="text-[#f47c66] font-semibold ml-2"
                >
                  Get directions
                </a>
              </div>
              <div className="flex items-center space-x-2 mt-4 md:mt-0">
                <button
                  onClick={() => handleFavorite(article!)}
                  className="text-gray-800 border border-slate-200 h-12 w-12 flex justify-center items-center rounded-full"
                  disabled={favoriteLoading}
                >
                  {favoriteLoading ? (
                    <OrbitProgress
                      variant="disc"
                      color="#d3d3d3"
                      size="small"
                      text=""
                      textColor=""
                    />
                  ) : isFavorited ? (
                    <GoHeartFill className="size-6 text-red-500" />
                  ) : (
                    <GoHeart className="size-6" />
                  )}
                </button>
                <button className="text-gray-800 border border-slate-200 h-12 w-12 flex justify-center items-center rounded-full">
                  <GoShareAndroid className="size-6" />
                </button>
              </div>
            </div>

            {isMobile ? (
              // Mobile view with Swiper
              <div className="mt-4">
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation={{
                    prevEl: ".swiper-button-prev",
                    nextEl: ".swiper-button-next",
                  }}
                  pagination={{ clickable: true }}
                  loop={true}
                  className="w-full rounded-lg"
                >
                  {allImages.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={image}
                        alt={`Gallery image ${index + 1}`}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="swiper-button-prev !text-white"></div>
                <div className="swiper-button-next !text-white"></div>
              </div>
            ) : (
              // Desktop view with grid
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="col-span-2">
                  <img
                    src={`https://maoulaty.shop/assets/${article?.featured_image}`}
                    alt={`Featured image of ${article?.label}`}
                    className="w-full rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {firstTwoImages.map((gallery, index) => (
                    <div
                      key={gallery.directus_files_id.id}
                      className={index === 1 ? "relative" : ""}
                      onClick={
                        index === 1 ? () => setIsModalOpen(true) : undefined
                      }
                    >
                      <img
                        src={`https://maoulaty.shop/assets/${gallery.directus_files_id.id}`}
                        alt={gallery.directus_files_id.filename_download}
                        className="w-full rounded-lg"
                      />
                      {index === 1 && (
                        <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white rounded-lg">
                          <span className="px-5 py-2 bg-white text-[#f47c66] font-semibold rounded-full">
                            See all images ({allImages.length})
                          </span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="lg:w-4/12">
          <div className="bg-white shadow-xl rounded-lg p-4 flex flex-col sticky">
            <h1 className="text-4xl font-bold">{article?.label}</h1>
            <div className="flex items-center mt-2">
              <span className="text-lg font-bold">5.0</span>
              <span className="ml-1 text-slate-700 flex justify-center items-center relative -top-[1px]">
                <IoStar />
                <IoStar />
                <IoStar />
                <IoStar />
                <IoStar />
              </span>
              <Link
                href="#reviews"
                className="ml-2 text-[#f47c66] font-semibold"
              >
                (5,113)
              </Link>
            </div>
            <button
              onClick={handleBooking}
              className="mt-4 bg-black font-semibold text-white py-3.5 px-4 rounded-lg w-full"
            >
              Book now
            </button>
            <div className="mt-6">
              <div
                className="flex items-center text-green-500 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              >
                <CiClock1 className="size-7 text-slate-600 -mr-0.5" />
                <span className="ml-2">
                  Open until {getCurrentOpeningTime(article!)}
                </span>
                <FaArrowDown
                  className={`fas fa-chevron-${isOpen ? "up" : "down"} ml-2`}
                ></FaArrowDown>
              </div>
              {isOpen && (
                <div className="mt-4">
                  {openingTimes.map((item, index) => (
                    <div key={index} className="flex items-center mt-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          item.open ? "bg-green-500" : "bg-gray-400"
                        }`}
                      ></span>
                      <span
                        className={`ml-2 ${
                          item.currentDay ? "font-bold text-green-700" : ""
                        }`}
                      >
                        {item.day}
                      </span>
                      <span
                        className={`ml-auto ${
                          item.currentDay ? "font-bold text-green-700" : ""
                        }`}
                      >
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-3.5 flex items-center">
              <CiLocationOn className="text-gray-600 size-7" />
              <span className="ml-2 text-gray-600">
                {article?.Address}
                <br />
                <Link
                  href={`https://www.google.com/maps?q=${article?.Address}`}
                  target="_blank"
                  className="text-[#f47c66] ml-0 font-semibold"
                >
                  Get directions
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Display Services Section */}
      <section className="mt-5">
        <div className="lg:flex">
          <div className="lg:w-8/12">
            <div>
              <h1 className="text-3xl font-bold mb-4">Services</h1>
              <Services services={services} />

              {/* Reviews Section */}
              <div className="mt-16" id="reviews">
                <div className="lg:flex gap-10">
                  <div className="lg:w-12/12">
                    <h3 className="text-3xl font-bold mb-4">Reviews</h3>
                    <div className="relative">
                      <div className="">
                      {article?.reviews && article.reviews.length > 0 ? (
  <>
    <div className="mt-4">
      {article.reviews.map((review) => (
        <div
          key={review.user_created.id} // Use a unique identifier here
          className="max-w-md mx-auto space-y-4 mt-5"
        >
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center text-white text-xl font-bold">
                D
              </div>
            </div>
            <div>
              <div className="text-lg font-medium text-black">
                {review.user_created.first_name} {review.user_created.last_name}
              </div>
              <div className="text-gray-500">{review.date_created}</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex space-x-1">
              {Array.from({ length: review.rating }).map((_, i) => (
                <IoStar key={i} className="fas fa-star text-black" />
              ))}
            </div>
          </div>
          <div className="text-gray-700">{review.comment}</div>
        </div>
      ))}
    </div>
  </>
) : (
  <p>No reviews available</p>
)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 mb-10">
                <h3 className="text-3xl font-bold mb-4">About</h3>
                <p className="text-black font-medium">{article?.description}</p>
              </div>

              <div className="my-10">
                <Map
                  initialViewState={{
                    longitude: mapCoordinates?.longitude ?? -7.6096,
                    latitude: mapCoordinates?.latitude ?? 33.5887,
                    zoom: 12,
                  }}
                  style={{ width: "100%", height: "400px" }}
                  mapStyle="mapbox://styles/mapbox/streets-v11"
                  mapboxAccessToken="pk.eyJ1IjoiYW5pZmZvdXJkZXYiLCJhIjoiY2xvc28zMXJjMDM4dTJycXc0aHBkN2pmcyJ9.IEOWZZQT6rlwKckMaoTh8g"
                >
                  {mapCoordinates && (
                    <Marker
                      longitude={mapCoordinates.longitude}
                      latitude={mapCoordinates.latitude}
                      anchor="bottom"
                    >
                      <div className="h-11 w-11 bg-cover bg-center" style={{ backgroundImage: `url(https://maoulaty.shop/assets/12247141-da04-4eb2-bff5-205417bc924b?cache-buster=2024-12-07T13:14:36.000Z&key=system-large-contain)` }}>
                        <div className="flex justify-center text-center items-center flex-col bg-[#dd0067dc] h-5 w-5 rounded-full absolute left-[12px] top-[7px]">
                          <span className="text-xs font-bold text-white -mb-0.5">5.0</span>
                          <span><IoStar className="size-3 text-amber-200" /></span>
                        </div>
                      </div>
                    </Marker>
                  )}
                </Map>
              </div>

              <div className="my-10">
                <div className="lg:flex gap-10">
                  <div className="lg:w-6/12">
                    <h3 className="text-2xl font-bold mb-4">Opening times</h3>
                    <div className="mt-4">
                      {openingTimes.map((item, index) => (
                        <div key={index} className="flex items-center mt-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              item.open ? "bg-green-400" : "bg-gray-300"
                            }`}
                          ></span>
                          <span
                            className={`ml-2 ${
                              item.currentDay ? "font-bold text-green-700" : ""
                            }`}
                          >
                            {item.day}
                          </span>
                          <span
                            className={`ml-auto ${
                              item.currentDay ? "font-bold text-green-700" : ""
                            }`}
                          >
                            {item.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="lg:w-6/12">
                    <h3 className="text-2xl font-bold mb-4">Informations</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {booking && article && (
        <div className="bg-white fixed left-0 top-0 w-full h-full z-50 p-2 overflow-auto">
          <div>
            <BookingSteps
              article={article as any}
              onClose={() => setBooking(false)}
              services={services}
            />
          </div>
        </div>
      )}

      {showLoginPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Login Required</h2>
            <p className="mb-4">Please log in to continue with the booking.</p>
            <button
              onClick={handleLogin}
              className="bg-black text-white py-2 px-4 rounded-lg"
            >
              Login
            </button>
          </div>
        </div>
      )}

      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={allImages}
        modalRef={modalRef}
      />
    </div>
  );
};

export default SingleBook;

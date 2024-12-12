"use client";
import React, { useState, useRef, useEffect } from "react";
import api from "@/services/auth";
import Cookies from "js-cookie";
import { IoStar } from "react-icons/io5";
import { GoHeart } from "react-icons/go";
import { GoShareAndroid } from "react-icons/go";
import { CiClock1, CiLocationOn } from "react-icons/ci";
import { FaArrowDown } from "react-icons/fa";
import Link from "next/link";
import BookingSteps from "@/components/dynamic/Book/Steps/BookingSteps";
import BookingHeader from "@/components/global/booking-header/BookingHeader";
import Services from "@/components/dynamic/Book/Services"; // Import the NavTabs component

// Define interfaces for Article, Review, User, and Service
interface UserData {
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  phone: string;
}

interface Review {
  user_created: UserData;
  date_created: string;
  rating: number;
  comment: string;
  article: number;
}

interface Article {
  id: string;
  label: string;
  description: string;
  reviews: Review[];
  Address: string;
  featured_image: string;
  location: string;
}

interface SubService {
  name: string;
  price: string; // Change to string to match BookingSteps.tsx
  duration: string; // Change to string to match BookingSteps.tsx
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

const SingleBook: React.FC<SingleBookProps> = ({ slug }) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, ] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [booking, setBooking] = useState(false);
  const [userData, ] = useState<UserData | null>(null); // Add userData state

  const handleBooking = () => {
    setBooking(true);
  };

  useEffect(() => {
    if (carouselRef.current) {
      const scrollAmount = (currentIndex * carouselRef.current.clientWidth) / 3;
      carouselRef.current.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  }, [currentIndex]);

  useEffect(() => {
    console.log("useEffect triggered with slug:", slug); // Debugging log
    const getArticle = async () => {
      const accessToken = Cookies.get("access_token"); // Retrieve the access token from cookies
      if (slug && accessToken) {
        try {
          const response = await api.get("/items/articles", {
            params: {
              filter: {
                slug: {
                  _eq: slug,
                },
              },
              fields:
                "*,reviews.*,reviews.user_created.first_name,reviews.user_created.last_name",
            },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const articleData = response.data.data[0];
          console.log("Article Data:", articleData); // Debugging log

          if (articleData) {
            // Adjust the data structure to match the expected format
            const adjustedArticleData: Article = {
              ...articleData,
              reviews: articleData.reviews ? [articleData.reviews] : [],
            };
            setArticle(adjustedArticleData);

            // Fetch services using the article ID
            const servicesResponse = await api.get(
              `https://maoulaty.shop/items/articles/${articleData.id}?fields=service.Services_id.name,service.Services_id.sub_services.name,service.Services_id.sub_services.price,service.Services_id.sub_services.duration,service.Services_id.sub_services.description`
            );
            const servicesData = servicesResponse.data.data.service;

            const parentServices: { [key: string]: ParentService } = {};

            servicesData.forEach((service: { Services_id: { name: string, sub_services: SubService[] } }) => {
              const serviceName = service.Services_id.name;
              if (!parentServices[serviceName]) {
                parentServices[serviceName] = {
                  name: serviceName,
                  description: "", // Add a default description if needed
                  sub_services: [],
                };
              }
              parentServices[serviceName].sub_services.push(...service.Services_id.sub_services);
            });

            const formattedServices = Object.keys(parentServices).map((key, index) => ({
              id: String(index + 1),
              parent_service: parentServices[key],
            }));

            setServices(formattedServices);
          } else {
            setArticle(null);
          }
          setLoading(false);
        } catch (error) {
          console.error("Error fetching article:", error);
          setLoading(false);
        }
      }
    };
    getArticle();

    // Cleanup function to clear state on unmount
    return () => {
      setArticle(null);
      setServices([]);
      setLoading(true);
    };
  }, [slug]);

  const handleFavorite = async (article: Article) => {
    try {
      await api.post("/items/favourites", {
        data: {
          user_created: "6128350b-c213-485f-b375-9ad7c684fd2d",
          article_id: article?.id,
          status: "Published",
        },
      });
    } catch {}
  };

  console.log("Rendering with slug:", slug); // Debugging log

  if (loading) {
    return (
      <div className="flex justify-center items-center mx-auto">
        <div className="flex justify-center items-center">
          <>Loading...</>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex justify-center items-center mx-auto">
        <div className="flex justify-center items-center">
          <>No article found</>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-white" key={article.id}>
      <div className="hidden lg:block">
        <BookingHeader />
      </div>
      <div className="px-5 lg:px-12 relative top-28">
        <div className="">
          <ol className="flex items-center whitespace-nowrap">
            <li className="inline-flex items-center">
              <Link
                className="flex items-center text-sm text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600 dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500"
                href="#"
              >
                Home
              </Link>
              <svg
                className="shrink-0 mx-2 size-4 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </li>
            <li className="inline-flex items-center">
              <Link
                className="flex items-center text-sm text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600 dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500"
                href="#"
              >
                Hair Salons
                <svg
                  className="shrink-0 mx-2 size-4 text-gray-400 dark:text-neutral-600"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            </li>
            <li
              className="inline-flex items-center text-sm font-semibold text-gray-500 truncate"
              aria-current="page"
            >
              {article.label}
            </li>
          </ol>
        </div>
        <header className="flex flex-col md:flex-row mt-3 items-start md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{article.label}</h1>
            <div className="flex flex-col md:flex-row items-start md:items-center text-sm text-gray-600 mt-3">
              <span className="text-lg font-bold mr-1 text-black">5.0</span>
              <span className="flex items-center">
                <IoStar className="text-yellow-500" />
                <IoStar className="text-yellow-500" />
                <IoStar className="text-yellow-500" />
                <IoStar className="text-yellow-500" />
                <IoStar className="text-yellow-500" />
                <span className="ml-1 text-[#dd0067dc] font-semibold">
                  (5,113)
                </span>
              </span>
              <span className="hidden md:inline mx-2">•</span>
              <span>Open until 8:00PM</span>
              <span className="hidden md:inline mx-2">•</span>
              <span>{article.location}</span>
              <Link
                href={`https://www.google.com/maps?q=${article.Address}`}
                target="_blank"
                className="text-[#dd0067dc] ml-1 font-semibold"
              >
                Get directions
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <button
              onClick={() => handleFavorite(article)}
              className="text-gray-800 border border-slate-200 h-12 w-12 flex justify-center items-center rounded-full"
            >
              <GoHeart className="size-6" />
            </button>
            <button className="text-gray-800 border border-slate-200 h-12 w-12 flex justify-center items-center rounded-full">
              <GoShareAndroid className="size-6" />
            </button>
          </div>
        </header>
        <div className="mt-8 mb-16">
          <div className="lg:flex gap-8">
            <div className="lg:w-1/12">
              <div className="grid grid-cols-1 gap-4">
                <img
                  src={`https://maoulaty.shop/assets/${article.featured_image}`}
                  alt="Another view of the salon interior"
                  className="w-full rounded-lg h-28 object-cover"
                />
                <img
                  src={`https://maoulaty.shop/assets/${article.featured_image}`}
                  alt="Exterior view of the salon building"
                  className="w-full rounded-lg h-28 object-cover"
                />
                <img
                  src={`https://maoulaty.shop/assets/${article.featured_image}`}
                  alt="Exterior view of the salon building"
                  className="w-full rounded-lg h-28 object-cover"
                />
                <button className="text-violet-500 text-sm font-semibold">
                  See all Images
                </button>
              </div>
            </div>
            <div className="lg:w-7/12">
              <div className="md:col-span-2">
                <img
                  src={`https://maoulaty.shop/assets/${article.featured_image}`}
                  alt={article.label}
                  className="w-full rounded-lg"
                />
              </div>
            </div>
            <div className="lg:w-4/12">
              <div className="bg-white shadow-xl rounded-lg p-4 flex flex-col sticky top-0">
                <h1 className="text-4xl font-bold">{article.label}</h1>
                <div className="flex items-center mt-2">
                  <span className="text-lg font-bold">5.0</span>
                  <span className="ml-1 text-yellow-500 flex justify-center items-center relative -top-[1px]">
                    <IoStar />
                    <IoStar />
                    <IoStar />
                    <IoStar />
                    <IoStar />
                  </span>
                  <Link
                    href="#reviews"
                    className="ml-2 text-[#dd0067dc] font-semibold"
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
                    className="flex items-center text-green-600 cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <CiClock1 className="size-7 text-slate-600 -mr-0.5" />
                    <span className="ml-2">Open until 8:00PM</span>
                    <FaArrowDown
                      className={`fas fa-chevron-${
                        isOpen ? "up" : "down"
                      } ml-2`}
                    ></FaArrowDown>
                  </div>
                  {isOpen && (
                    <div className="mt-4">
                      {[
                        {
                          day: "Monday",
                          time: "09:00 AM – 04:30 PM",
                          open: true,
                        },
                        {
                          day: "Tuesday",
                          time: "09:00 AM – 04:30 PM",
                          open: true,
                        },
                        {
                          day: "Wednesday",
                          time: "09:00 AM – 08:00 PM",
                          open: true,
                        },
                        {
                          day: "Thursday",
                          time: "09:00 AM – 08:00 PM",
                          open: true,
                          bold: true,
                        },
                        {
                          day: "Friday",
                          time: "09:00 AM – 08:00 PM",
                          open: true,
                        },
                        {
                          day: "Saturday",
                          time: "09:00 AM – 04:30 PM",
                          open: true,
                        },
                        { day: "Sunday", time: "Closed", open: false },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center mt-2">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              item.open ? "bg-green-500" : "bg-gray-400"
                            }`}
                          ></span>
                          <span
                            className={`ml-2 ${item.bold ? "font-bold" : ""}`}
                          >
                            {item.day}
                          </span>
                          <span
                            className={`ml-auto ${
                              item.bold ? "font-bold" : ""
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
                    {article.Address}
                    <br />
                    <Link
                      href={`https://www.google.com/maps?q=${article.Address}`}
                      target="_blank"
                      className="text-[#dd0067dc] ml-0 font-semibold"
                    >
                      Get directions
                    </Link>
                  </span>
                </div>
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
                <Services services={services} /> {/* Use the NavTabs component */}

                {/* Reviews Section */}
                <div className="mt-16" id="reviews">
                  <div className="lg:flex gap-10">
                    <div className="lg:w-12/12">
                      <h3 className="text-3xl font-bold mb-4">Reviews</h3>
                      <div className="relative">
                        <div className="">
                          {article.reviews && article.reviews.length > 0 ? (
                            <>
                              <div className="mt-4">
                                {article.reviews.map((review, index) => (
                                  <div
                                    key={index}
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
                                          {review.user_created.first_name}{" "}
                                          {review.user_created.last_name}
                                        </div>
                                        <div className="text-gray-500">
                                          {review.date_created}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center">
                                      <div className="flex space-x-1">
                                        <IoStar className="fas fa-star text-black" />
                                        <IoStar className="fas fa-star text-black" />
                                        <IoStar className="fas fa-star text-black" />
                                        <IoStar className="fas fa-star text-black" />
                                        <IoStar className="fas fa-star text-black" />
                                      </div>
                                    </div>
                                    <div className="text-gray-700">
                                      {review.comment}
                                    </div>
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

                <div className="mt-24">
                  <h3 className="text-3xl font-bold mb-4">About</h3>
                  <p className="text-black font-medium">
                    {article.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {booking && (
        <div className="bg-white fixed left-0 top-0 w-full h-full z-50 p-2 overflow-auto">
          <div>
            {/* {userData && (
              <BookingSteps
                article={article}
                onClose={() => setBooking(false)}
                services={services}
                // userData={userData}
              />
            )} */}
            <BookingSteps
                article={article}
                onClose={() => setBooking(false)}
                services={services}
                // userData={userData}
              />
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleBook;
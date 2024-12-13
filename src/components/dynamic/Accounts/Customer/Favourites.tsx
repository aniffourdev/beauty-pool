"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/dynamic/Accounts/Business/Global/Sidebar";
import Header from "@/components/dynamic/Accounts/Business/Global/Header";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FiPlus } from "react-icons/fi";
import api from "@/services/auth";
import Image from "next/image";
import Link from "next/link";
import { Gruppo } from "next/font/google";

const gruppo = Gruppo({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: "400",
});

interface UserData {
  id: string;
  first_name: string;
}

interface Article {
  id: string;
  label: string;
  featured_image: string;
  address: string;
  user_created: string;
}

const Favorites = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/users/me");
        setUserData(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data");
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      if (userData?.id) {
        try {
          const response = await api.get(
            `/items/favorites?filter[user_created][_eq]=${userData.id}`
          );
          setArticles(response.data.data);
        } catch (error) {
          console.error("Error fetching articles:", error);
          setError("Failed to fetch articles");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchArticles();
  }, [userData?.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center mx-auto">
        <div className="flex justify-center items-center">
          <>Loading...</>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center mx-auto">
        <div className="flex justify-center items-center">
          <>{error}</>
        </div>
      </div>
    );
  }

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
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2
                  className={`${gruppo.className} text-4xl text-black font-bold`}
                >
                  Favorites
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.map((article) => (
                <div key={article.id} className="bg-white rounded-lg shadow-md p-4">
                  {/* <Image
                    src={`https://maoulaty.shop/assets/${article.featured_image}`}
                    alt={article.label}
                    width={300}
                    height={200}
                    className="rounded-lg"
                  /> */}
                  <h3 className="text-xl font-semibold mt-2">{article.label}</h3>
                  <p className="text-gray-600 mt-1">{article.address}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Favorites;

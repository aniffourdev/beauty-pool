"use client";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import ArticlesLists from "./ArticlesLists";
import { IoFilterOutline } from "react-icons/io5";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import Link from "next/link";
import MapComponent from "./Map";
import api from "@/services/auth";
import Cookies from "js-cookie";

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

const determineSearchScope = (location: string): string => {
  // Implement logic to determine the scope of the search query
  // For simplicity, let's assume:
  // - If the query contains a number, it's an exact address
  // - Otherwise, it's a broader location
  return /\d/.test(location) ? "exact" : "broad";
};

const BookingResult = () => {
  const searchParams = useSearchParams();

  if (!searchParams) {
    console.error("searchParams is null");
    return null; // or handle the null case appropriately
  }

  const location = searchParams.get("location");
  const latitude = searchParams.get("latitude");
  const longitude = searchParams.get("longitude");

  // Ensure latitude and longitude are parsed as numbers
  const parsedLatitude = latitude ? parseFloat(latitude) : 0;
  const parsedLongitude = longitude ? parseFloat(longitude) : 0;

  const [articles, setArticles] = useState<any[]>([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    const getArticles = async () => {
      const savedCategoryId = localStorage.getItem("selectedCategoryId");
      const accessToken = Cookies.get("access_token"); // Retrieve the access token from cookies
      if (savedCategoryId && accessToken) {
        try {
          const response = await api.get("/items/articles", {
            params: {
              filter: {
                category: {
                  _eq: savedCategoryId,
                },
              },
            },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const articlesData = response.data.data; // Storing data as an array
          console.log(articlesData);

          // Determine the search scope
          const searchScope = determineSearchScope(location!);

          // Filter articles based on the search scope
          const filteredArticles = articlesData.filter((article: any) => {
            if (searchScope === "exact") {
              return article.Address.toLowerCase() === location!.toLowerCase();
            } else {
              return article.Address.toLowerCase().includes(location!.toLowerCase());
            }
          });

          // Geocode addresses for the filtered articles
          const articlesWithCoordinates = await Promise.all(
            filteredArticles.map(async (article: any) => {
              const coordinates = await geocodeAddress(article.Address);
              return { ...article, ...coordinates };
            })
          );

          setArticles(articlesWithCoordinates);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching articles:", error);
          setLoading(false);
        }
      } else {
        console.error("Missing required parameters: savedCategoryId or accessToken");
        setLoading(false);
      }
    };
    getArticles();
  }, [location]);

  return (
    <div className="lg:flex h-screen">
      <div className="lg:w-4/12 p-2 bg-white h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold mb-4 relative top-2">
            <Link href="/">
              <MdOutlineKeyboardBackspace className="size-6 mr-1 relative -top-[2px] text-slate-600 inline-block" />
            </Link>{" "}
            Availability Products
          </h2>
          <button className="py-0.5 px-5 rounded-full border-[1px] border-slate-200">
            <IoFilterOutline className="size-4 relative -top-[2px] inline-block" />{" "}
            Filter
          </button>
        </div>
        <ArticlesLists venues={articles} location={{ latitude: parsedLatitude, longitude: parsedLongitude, address: location }} />
      </div>
      <div className="lg:w-8/12 h-screen">
        <MapComponent
          articles={articles}
          currentLocation={{
            latitude: parsedLatitude,
            longitude: parsedLongitude,
          }}
          userLocation={location ?? ""}
        />
      </div>
    </div>
  );
};

export default BookingResult;

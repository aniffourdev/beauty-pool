"use client";
import React, { useEffect, useState } from "react";
import Logo from "./Logo";
import RightBar from "./RightBar";
import api from "@/services/auth";

interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  category: number[]; // Update this line
}

const Header = ({
  onUserDataFetched,
}: {
  onUserDataFetched?: (userData: UserData | null) => void;
}) => {
  const [, setUserData] = useState<UserData | null>(null);
  const [, setLoading] = useState(true);

  useEffect(() => {
    const getMe = async () => {
      try {
        const response = await api.get("/users/me");
        const fetchedUserData = response.data.data;
        setUserData(fetchedUserData);

        // Call the callback if provided (only once after fetching)
        if (onUserDataFetched) {
          onUserDataFetched(fetchedUserData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);

        // Call the callback with null in case of error
        if (onUserDataFetched) {
          onUserDataFetched(null);
        }
      } finally {
        setLoading(false);
      }
    };

    // Fetch user data only when the component is mounted
    getMe();
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <div className="bg-white shadow-sm border-b-[1px] border-gray-100 z-40 fixed w-full py-1.5">
      <div className="flex justify-between items-center px-5 lg:px-12">
        <Logo />
        <RightBar />
      </div>
    </div>
  );
};

export default Header;

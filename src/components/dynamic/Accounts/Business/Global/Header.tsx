import React, { useState, useEffect } from "react";
import { FaBars, FaUserCircle } from "react-icons/fa";
import Logo from "./Logo";
import api from "@/services/auth";
import UserAccount from "./UserAccount";

interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  category: number[];
}

interface HeaderProps {
  onUserDataFetched?: (userData: UserData | null) => void;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ onUserDataFetched, toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const getMe = async () => {
      try {
        const response = await api.get("/users/me");
        const fetchedUserData = response.data.data;
        setUserData(fetchedUserData);

        if (onUserDataFetched) {
          onUserDataFetched(fetchedUserData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (onUserDataFetched) {
          onUserDataFetched(null);
        }
      } finally {
        setLoading(false);
      }
    };

    getMe();
  }, [onUserDataFetched]);

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <button
              onClick={toggleSidebar}
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              <span className="sr-only">Open sidebar</span>
              <FaBars className="w-6 h-6" />
            </button>
            <Logo />
          </div>
          <div className="flex items-center">
            <div className="flex items-center ms-3">
              <div>
                <div
                  onClick={toggleDropdown}
                  className="flex text-sm cursor-pointer"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open user menu</span>
                  <UserAccount />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;

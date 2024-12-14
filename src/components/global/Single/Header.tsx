// Header.tsx
import React from "react";
import { FaBars } from "react-icons/fa";
import Logo from "@/components/dynamic/Accounts/Customer/Global/Logo";
import UserAccount from "@/components/dynamic/Accounts/Customer/Global/UserAccount";
import BookForm from "@/components/dynamic/Accounts/Customer/Global/BookForm";
import { useUser } from "@/context/UserContext";

const Header: React.FC = () => {
  const { userData, loading } = useUser();

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <Logo />
          </div>
          <div className="hidden lg:block">
            <BookForm />
          </div>
          <div className="flex items-center">
            <div className="flex items-center ms-3">
              <div>
                <div
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
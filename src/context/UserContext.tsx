"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import api from "@/services/auth";
import { UserData } from "@/types/UserData";
import Cookies from "js-cookie";

interface UserContextType {
  userData: UserData | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = useCallback(() => {
    const token = Cookies.get("access_token");
    setIsAuthenticated(!!token);
    return !!token;
  }, []);

  const fetchUserData = useCallback(async () => {
    if (!checkAuth()) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/users/me");
      setUserData(response.data.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserData(null);
      // If we get a 401, clear the auth state
      if ((error as any)?.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [checkAuth]);

  const logout = useCallback(() => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    Cookies.remove("directus_session_token");
    setIsAuthenticated(false);
    setUserData(null);
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return (
    <UserContext.Provider value={{ userData, loading, isAuthenticated, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
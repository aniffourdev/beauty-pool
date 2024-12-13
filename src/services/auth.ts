import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "https://maoulaty.shop"; // Your Directus instance URL

// Token management with cookies
const getAccessToken = () => Cookies.get("access_token");
const getRefreshToken = () => Cookies.get("refresh_token");
const setAccessToken = (token: string) =>
  Cookies.set("access_token", token, { expires: 0.5 / 24 }); // 30 mins
const setRefreshToken = (token: string) =>
  Cookies.set("refresh_token", token, { expires: 30 }); // 30 days
const removeTokens = () => {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
};

// Create Axios instance
const api = axios.create({
  baseURL: `${API_URL}/`,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Request interceptor: Add the access token to each request
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ./src/services/auth.ts

export const fetchUserRole = async (accessToken: string) => {
  try {
    const response = await api.get("/users/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.role;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
};


// Response interceptor: Handle token expiration (401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        delete originalRequest.headers["Authorization"];

        const refreshResponse = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token } = refreshResponse.data.data;

        setAccessToken(access_token);
        setRefreshToken(refresh_token);

        isRefreshing = false;
        onRefreshed(access_token);

        originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        removeTokens();
        // window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

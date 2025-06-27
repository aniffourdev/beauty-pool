import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "https://brandlybook.store";

// Define public routes that don't need authentication
const PUBLIC_ROUTES = [
  "/products",
  "/categories",
  // Add other public routes here
];

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

// Helper to check if a route is public
const isPublicRoute = (url: string): boolean => {
  return PUBLIC_ROUTES.some((route) => url.startsWith(route));
};

// Request interceptor: Add the access token only for protected routes
api.interceptors.request.use(
  (config) => {
    // Skip token for public routes
    if (config.url && isPublicRoute(config.url)) {
      return config;
    }

    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle token expiration (401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh token logic for public routes
    if (originalRequest?.url && isPublicRoute(originalRequest.url)) {
      return Promise.reject(error);
    }

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
          // throw new Error("No refresh token available");
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
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

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

export default api;

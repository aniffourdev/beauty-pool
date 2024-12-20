// pages/auth/callback.js
import { useEffect } from "react";
import Cookies from "js-cookie";

const Callback = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("access_token");
    const refreshToken = urlParams.get("refresh_token");

    if (accessToken && refreshToken) {
      Cookies.set("access_token", accessToken, { expires: 0.5 / 24 }); // 30 minutes
      Cookies.set("refresh_token", refreshToken, { expires: 30 }); // 30 days
      window.location.href = "/dashboard"; // Redirect to a protected page
    } else {
      console.error("Authentication failed: Missing tokens");
      window.location.href = "/login"; // Redirect to login page
    }
  }, []);

  return <p>Authenticating...</p>;
};

export default Callback;

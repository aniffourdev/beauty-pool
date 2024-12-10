"use client";
import React, { useState } from "react";
import "react-phone-input-2/lib/style.css";
import "tailwindcss/tailwind.css";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import api from "@/services/auth";
import { MdFacebook } from "react-icons/md";
import LoginCustomer from "./LoginCustomer";
import { Gruppo } from "next/font/google";

const gruppo = Gruppo({
    subsets: ["latin"],
    variable: "--font-geist-mono",
    weight: "400",
  });

const LoginBusiness = () => {
  const [customer] = React.useState(true);
  const [business] = React.useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setError] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/login", { email, password });
      const { access_token, refresh_token } = response.data.data;

      const setAccessToken = (token: string) =>
        Cookies.set("access_token", token, { expires: 0.5 / 24 });
      const setRefreshToken = (token: string) =>
        Cookies.set("refresh_token", token, { expires: 30 });

      setAccessToken(access_token);
      setRefreshToken(refresh_token);

      router.push("/business");
    } catch (loginError) {
      setError("Login failed. Please check your credentials.");
      console.error("Login error:", loginError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {customer && (
        <>
          <h3
            className={`${gruppo.className} text-2xl text-black font-semibold text-center my-4`}
          >
            Beautypool for business
          </h3>
          <p className="text-slate-500 font-medium max-w-[400px] mx-auto text-center mb-8">
            Sign In to manage appointments and grow your business.
          </p>
          <div className="max-w-[500px] mx-auto">
            <div className="flex flex-col items-center justify-center">
              <div className="w-full">
                <button className="flex items-center justify-center w-full px-4 py-2 mb-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
                  <MdFacebook className="text-blue-600 mr-2 size-6" />
                  Continue with Facebook
                </button>
                <button className="flex items-center justify-center w-full px-4 py-2 mb-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
                  <svg
                    viewBox="0 0 32 32"
                    className="size-6 mr-2"
                    data-name="Layer 1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#000000"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <g id="SVGRepo_iconCarrier">
                      <path
                        d="M23.75,16A7.7446,7.7446,0,0,1,8.7177,18.6259L4.2849,22.1721A13.244,13.244,0,0,0,29.25,16"
                        fill="#00ac47"
                      />
                      <path
                        d="M23.75,16a7.7387,7.7387,0,0,1-3.2516,6.2987l4.3824,3.5059A13.2042,13.2042,0,0,0,29.25,16"
                        fill="#4285f4"
                      />
                      <path
                        d="M8.25,16a7.698,7.698,0,0,1,.4677-2.6259L4.2849,9.8279a13.177,13.177,0,0,0,0,12.3442l4.4328-3.5462A7.698,7.698,0,0,1,8.25,16Z"
                        fill="#ffba00"
                      />
                      <polygon
                        fill="#2ab2db"
                        points="8.718 13.374 8.718 13.374 8.718 13.374 8.718 13.374"
                      />
                      <path
                        d="M16,8.25a7.699,7.699,0,0,1,4.558,1.4958l4.06-3.7893A13.2152,13.2152,0,0,0,4.2849,9.8279l4.4328,3.5462A7.756,7.756,0,0,1,16,8.25Z"
                        fill="#ea4435"
                      />
                      <polygon
                        fill="#2ab2db"
                        points="8.718 18.626 8.718 18.626 8.718 18.626 8.718 18.626"
                      />
                      <path
                        d="M29.25,15v1L27,19.5H16.5V14H28.25A1,1,0,0,1,29.25,15Z"
                        fill="#4285f4"
                      />
                    </g>
                  </svg>
                  Continue with Google
                </button>
                <div className="flex items-center justify-center my-4">
                  <div className="w-full border-t border-gray-300"></div>
                  <span className="px-2 text-sm text-gray-500">OR</span>
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <form onSubmit={handleLogin}>
                  <div className="mb-4 relative">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="email"
                    >
                      Address Email
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="email"
                      type="email"
                      placeholder="Email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-4 relative">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="password"
                      type={passwordVisible ? "text" : "password"}
                      placeholder="Password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div
                      className="absolute right-3 top-[41px] cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      {passwordVisible ? (
                        <FaRegEyeSlash className="text-slate-900 size-5" />
                      ) : (
                        <FaRegEye className="text-slate-900 size-5" />
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full px-4 py-4 text-md font-semibold text-white bg-black rounded-md shadow-sm hover:bg-gray-800"
                    disabled={loading}
                    onClick={handleLogin}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {business && <LoginCustomer />}
    </>
  );
};

export default LoginBusiness;

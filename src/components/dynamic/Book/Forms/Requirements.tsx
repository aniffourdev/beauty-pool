import React, { useState } from "react";
import { KeyRound, AlertCircle } from "lucide-react";
import api from "@/services/auth"; // Assuming you have an API service for authentication
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { AiOutlineClose } from "react-icons/ai";

interface RequirmentsProps {
  onClose: () => void;
}

const Requirments: React.FC<RequirmentsProps> = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [isEmailRegistered, setIsEmailRegistered] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleContinue = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/users", {
        params: {
          filter: {
            email: {
              _eq: email,
            },
          },
        },
      });

      if (response.data.data.length > 0) {
        setIsEmailRegistered(true);
      } else {
        setShowOtpPopup(true);
      }
    } catch (error) {
      setError("Error checking email. Please try again.");
      console.error("Check email error:", error);
    } finally {
      setLoading(false);
    }
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

      router.push("/");
    } catch (loginError) {
      setError("Invalid user credentials!");
      console.error("Login error:", loginError);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError(null);

    try {
      // Implement OTP verification logic here
      // For example, send a request to verify the OTP
      const response = await api.post("/auth/verify-otp", { email, otp });

      if (response.data.success) {
        // Handle successful OTP verification
        router.push("/");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (otpError) {
      setError("Error verifying OTP. Please try again.");
      console.error("OTP verification error:", otpError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md mx-4 bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex justify-end items-end">
            <AiOutlineClose
              className="text-slate-400 size-5 cursor-pointer"
              onClick={onClose}
            />
          </div>
          <div className="flex flex-col items-center space-y-4 pb-6">
            <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center">
              <KeyRound className="h-8 w-8 text-[#f47c66]" />
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900">
                Log in or sign up
              </h2>
              <p className="mt-2 text-gray-600">
                Log in or sign up to complete your booking.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <p className="ml-3 text-sm text-yellow-700">
                You must be logged in to make a booking.
              </p>
            </div>

            <div className="flex flex-col space-y-3">
              {isEmailRegistered ? (
                <>
                  <p className="text-center text-gray-900">Welcome back</p>
                  <p className="text-center text-gray-600">
                    Enter your password to log in as {email}
                  </p>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <button
                    className="w-full px-4 py-2 bg-black text-white rounded-lg transition-colors duration-200 font-medium"
                    onClick={handleLogin}
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </button>
                  <p className="text-center text-gray-600">
                    <a href="/forgot-password" className="text-blue-500">
                      Forgot password?
                    </a>
                  </p>
                </>
              ) : showOtpPopup ? (
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Enter OTP
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Please enter the OTP sent to your email.
                  </p>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mt-4"
                  />
                  <button
                    className="w-full px-4 py-2 bg-black text-white rounded-lg transition-colors duration-200 font-medium mt-4"
                    onClick={handleVerifyOtp}
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              ) : (
                <>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <button
                    className="w-full px-4 py-2 bg-black text-white rounded-lg transition-colors duration-200 font-medium"
                    onClick={handleContinue}
                    disabled={loading}
                  >
                    {loading ? "Checking..." : "Continue"}
                  </button>
                </>
              )}

              {error && (
                <p className="text-red-500 text-sm font-bold">{error}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Requirments;

"use client";
import React, { useEffect, useState } from "react";
import { MdFacebook } from "react-icons/md";
import RegisterCustomer from "./RegisterCustomer";
import { useRouter } from "next/navigation";
import axios from "axios";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "tailwindcss/tailwind.css";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import Cookies from "js-cookie";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { Gruppo } from "next/font/google";
import { signIn } from "next-auth/react";
import api from "@/services/auth";

interface SignUpFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthday: string | null; // Allow null for birthday
  phone: string;
  gender: string;
  isocode: string;
  dialcode: string;
  user_type: string;
  description: string;
  location: string;
  avatar: string;
  role: string;
  device_id: string;
  business_name: string;
  website: string;
  selectedCategories: Category[];
  business_address: string;
  noBusinessAddress: boolean;
}

interface Category {
  id: string;
  label: string;
  icon: string;
}

const defaultFormData: SignUpFormData = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  confirmPassword: "",
  birthday: null, // Set default to null
  phone: "",
  gender: "",
  isocode: "",
  dialcode: "",
  user_type: "normal",
  description: "",
  location: "",
  avatar: "b1fcd062-fc30-4c9f-a48f-804b70510da9",
  role: "d5ead72e-be83-4c0d-802d-b60ac41770fd",
  device_id: "",
  business_name: "",
  website: "",
  selectedCategories: [],
  business_address: "",
  noBusinessAddress: false,
};

const gruppo = Gruppo({
  subsets: ['latin'],
  variable: "--font-geist-mono",
  weight: "400",
});

const RegisterBusiness = () => {
  const [business, setBusiness] = useState(true);
  const [customer, setCustomer] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [, setDeviceId] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [emailError, setEmailError] = useState<string>("");

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
    setError,
  } = useForm<SignUpFormData>({
    defaultValues: defaultFormData,
  });

  useEffect(() => {
    const getFingerprint = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setDeviceId(result.visitorId);

      const existingUser = Cookies.get(result.visitorId);
      if (existingUser) {
        alert("You Can't Open Many Accounts using this device!");
      }
    };
    getFingerprint();
  }, []);

  const sendOtpEmail = async (email: string) => {
    try {
      setIsResending(true);
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otpCode);

      await axios.post("https://maoulaty.shop/otp-verification", {
        email: email,
        code: otpCode,
      });

      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setEmailError(error.response.data.message);
      } else {
        setEmailError("This email already exists!");
      }
      return false;
    } finally {
      setIsResending(false);
    }
  };

  const handleOtpVerification = () => {
    const enteredOtp = otpValues.join("");
    if (enteredOtp === generatedOtp) {
      setShowOtpPopup(false);
      setStep(2);
    } else {
      setError("email", {
        type: "manual",
        message: "Invalid OTP code. Please try again.",
      });
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);

      if (value && index < otpValues.length - 1) {
        document.getElementById(`otp-input-${index + 1}`)?.focus();
      } else if (!value && index > 0) {
        document.getElementById(`otp-input-${index - 1}`)?.focus();
      }

      if (newOtpValues.every((digit) => digit !== "")) {
        handleOtpVerification();
      }
    }
  };

  const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
    if (step === 1) {
      const success = await sendOtpEmail(data.email);
      if (success) {
        setShowOtpPopup(true);
        localStorage.setItem("signUpData", JSON.stringify(data));
      }
    } else if (step === 2) {
      try {
        setLoading(true);
        const storedData = JSON.parse(
          localStorage.getItem("signUpData") || "{}"
        );
        const updatedData = { ...storedData, ...data };
        localStorage.setItem("signUpData", JSON.stringify(updatedData));

        // Store business-related data in cookies
        Cookies.set(
          "businessData",
          JSON.stringify({
            business_name: data.business_name,
            website: data.website,
            selectedCategories: data.selectedCategories,
            business_address: data.business_address,
            noBusinessAddress: data.noBusinessAddress,
          })
        );

        // Send the registration data to the API
        await api.post("/register-user", updatedData);

        router.push("/business/onboarding/partner_service_types");
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data?.errors) {
          const errorMessage = error.response.data.errors[0].message;
          if (errorMessage === "Email already exists") {
            setEmailError(errorMessage);
          } else {
            alert("Registration failed. Please try again.");
          }
        } else {
          alert("Registration failed. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCustomer = () => {
    setCustomer(true);
    setBusiness(false);
  };

  const handleResendOtp = async () => {
    const email = watch("email");
    await sendOtpEmail(email);
  };

  return (
    <>
      {business && (
        <div>
          {step === 1 && (
            <>
              <h3
                className={`${gruppo.className} text-2xl text-black font-semibold text-center my-4`}
              >
                Beauty Pool, Where Professionals Shine
              </h3>
              <p className="text-slate-500 font-medium max-w-[400px] mx-auto text-center mb-8">
                Log in or sign up to manage appointments and grow your business.
              </p>
              <div className="max-w-[500px] mx-auto">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-full">
                    <button
                      className="flex items-center justify-center w-full px-4 py-2 mb-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                      onClick={() => signIn('google')}
                    >
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
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <>
                        <input
                          type="email"
                          placeholder="Email address"
                          className="w-full px-4 py-3 mb-4 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value:
                                /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                              message: "Invalid email format",
                            },
                          })}
                        />
                        {emailError && (
                          <span className="text-red-600 text-sm font-semibold -mt-3">
                            {emailError}
                          </span>
                        )}
                        <button
                          type="submit"
                          className="w-full px-4 py-3 text-sm font-semibold text-white bg-black rounded-md shadow-sm hover:bg-gray-800"
                          disabled={isResending}
                        >
                          {isResending ? "Sending OTP..." : "Continue"}
                        </button>
                      </>
                    </form>
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center flex-col mt-7">
                <h3 className="text-center font-medium text-lg">
                  Have a customer account?
                </h3>
                <button
                  onClick={handleCustomer}
                  className="text-[#f48673] font-medium"
                >
                  Sign up as a Customer
                </button>
              </div>
            </>
          )}
          {step === 2 && (
            <form action="" onSubmit={handleSubmit(onSubmit)}>
              <h3
                className={`${gruppo.className} text-2xl text-black font-semibold text-center my-4`}
              >
                Create a professional account
              </h3>
              <p className="text-slate-900 font-normal text-sm max-w-[500px] mx-auto text-center mb-8">
                You&apos;re almost done! Complete the details below to create
                your new account for{" "}
                <span className="font-semibold">{watch("email")}</span>.
              </p>
              <div className="px-0 md:px-20">
                <div className="relative mb-4">
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="firstName"
                    >
                      First name
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="firstName"
                      type="text"
                      placeholder="First Name"
                      {...register("first_name", {
                        required: "First name is required",
                      })}
                      autoComplete="off"
                    />
                  </div>
                  {errors.first_name && (
                    <span
                      className="text-left font-bold text-[13px] mt-1 w-full flex justify-start"
                      style={{ color: "rgb(255 0 0 / 74%)" }}
                    >
                      {errors.first_name.message}
                    </span>
                  )}
                </div>

                <div className="relative mb-4">
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="lastName"
                    >
                      Last name
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="firstName"
                      type="text"
                      placeholder="Last Name"
                      {...register("last_name", {
                        required: "Last name is required",
                      })}
                      autoComplete="off"
                    />
                  </div>
                  {errors.last_name && (
                    <span
                      className="text-left font-bold text-[13px] mt-1 w-full flex justify-start"
                      style={{ color: "rgb(255 0 0 / 74%)" }}
                    >
                      {errors.last_name.message}
                    </span>
                  )}
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
                    placeholder="Enter a password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 5,
                        message: "Password must be at least 5 characters",
                      },
                    })}
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

                <div className="relative mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="lastName"
                  >
                    Mobile number
                  </label>
                  <Controller
                    name="phone"
                    control={control}
                    rules={{ required: "Phone number is required" }}
                    render={({ field: { onChange, value } }) => (
                      <PhoneInput
                        country={"us"}
                        value={value}
                        onChange={(
                          phone: string,
                          country: {
                            name: string;
                            countryCode: string;
                            dialCode: string;
                          }
                        ) => {
                          onChange(phone);
                          setValue("location", country.name);
                          setValue(
                            "isocode",
                            country.countryCode.toUpperCase()
                          );
                          setValue("dialcode", `+${country.dialCode}`);
                        }}
                        inputProps={{
                          id: "phone-input",
                          required: true,
                          autoComplete: "tel",
                        }}
                        containerClass="w-full"
                        inputClass={`
        shadow appearance-none border rounded w-full !py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
        pl-16 pr-3
        ${errors.phone ? "border-red-500" : "border-gray-300"}
      `}
                        buttonClass="!bg-transparent !border-none"
                        dropdownClass="custom-dropdown-class"
                        specialLabel=""
                      />
                    )}
                  />

                  {errors.phone && (
                    <span className="text-red-500">{errors.phone.message}</span>
                  )}
                </div>

                <div className="relative mb-4">
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="lastName"
                    >
                      Country
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      placeholder="Country"
                      id="location"
                      {...register("location", {
                        required: "Country is required",
                      })}
                      readOnly
                    />
                  </div>
                  {errors.location && (
                    <span className="text-red-500">
                      {errors.location.message}
                    </span>
                  )}
                </div>

                <div className="my-6">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox text-purple-600"
                    />
                    <span className="ml-2 text-gray-700">
                      I agree to the{" "}
                      <Link href="#" className="text-blue-500">
                        Privacy Policy
                      </Link>
                      ,{" "}
                      <Link href="#" className="text-blue-500">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <a href="#" className="text-blue-500">
                        Terms of Business
                      </a>
                      .
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-4 text-md font-semibold text-white bg-black rounded-md shadow-sm hover:bg-gray-800"
                  disabled={loading}
                >
                  {loading ? "Creating your account..." : "Create an account"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {customer && <RegisterCustomer />}

      {showOtpPopup && (
        <div className="otp-popup fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-3">
          <div className="max-w-md mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
            <h1 className="text-2xl font-bold mb-1">Enter OTP Code</h1>
            <p className="text-[15px] text-slate-500">
              Enter the 6-digit verification code that was sent to your email
              inbox.
            </p>
            <div className="flex justify-center space-x-2 mb-4 mt-5">
              {otpValues.map((value, index) => (
                <input
                  key={index}
                  type="text"
                  value={value}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  id={`otp-input-${index}`}
                  maxLength={1}
                  className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              ))}
            </div>
            {errors.email && (
              <span className="text-red-600 text-sm">
                {errors.email.message}
              </span>
            )}
            <button
              type="submit"
              className="w-full inline-flex justify-center whitespace-nowrap rounded-lg bg-zinc-900 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/10 hover:bg-zinc-800 focus:outline-none focus:ring focus:ring-indigo-300 focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 transition-colors duration-150"
              onClick={handleOtpVerification}
            >
              Verify Account
            </button>
            <div className="text-sm text-slate-500 mt-4">
              Didn&apos;t receive code?{" "}
              <button
                className="font-medium text-indigo-500 hover:text-indigo-600"
                onClick={handleResendOtp}
                disabled={isResending}
              >
                {isResending ? "Resending..." : "Resend OTP"}
              </button>
            </div>
            <div className="flex justify-start items-center"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterBusiness;

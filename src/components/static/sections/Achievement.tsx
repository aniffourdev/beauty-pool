import React from "react";
import { Gruppo } from "next/font/google";

const gruppo = Gruppo({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: "400",
});

export default function Achievement() {
  return (
    <div className="py-20 flex flex-col items-center justify-center sm:justify-center bg-gray-50 text-center px-3 md:px-2 lg:px-2 xl:px-2 shadow-lg">
      <h1
        className={`${gruppo.className} text-2xl sm:text-3xl md:text-4xl lg:text-7xl font-bold text-gray-950 mb-4 max-w-[1000px] mx-auto`}
      >
        Your ultimate destination for beauty and self-care
      </h1>
      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 mb-8">
        Discover simplicity with BeautyPool – your trusted partner in wellness
        and beauty services.
      </p>
      <div
        className={`${gruppo.className} text-[#f4b8ae] font-extrabold text-5xl sm:text-6xl md:text-8xl mb-4`}
      >
        100K+
      </div>
      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 mb-12">
        Appointments booked with BeautyPool
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 text-center max-w-[800px] mx-auto">
        <div>
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
            2500+
          </div>
          <p className="text-sm sm:text-base md:text-lg text-gray-500">
            Businesses Trust Us
          </p>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
            8+ Countries
          </div>
          <p className="text-sm sm:text-base md:text-lg text-gray-500">
            Using BeautyPool
          </p>
        </div>
        <div className="text-center">
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
            1000+
          </div>
          <p className="text-sm sm:text-base md:text-lg text-gray-500">
            Stylists & Professionals
          </p>
        </div>
      </div>
    </div>
  );
}

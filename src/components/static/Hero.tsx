import { BackgroundGradientAnimation } from "@/app/ui/background";
import React from "react";
import BookingForm from "@/components/dynamic/Book/Forms/Booking";
import Navbar from "@/components/global/header/Navbar";
import LiveCounter from "@/components/static/LiveCounter";
import { Gruppo } from "next/font/google";

const gruppo = Gruppo({
    subsets: ["latin"],
    variable: "--font-geist-mono",
    weight: "400",
  });

const Hero = () => {
  return (
    <BackgroundGradientAnimation>
      <div className="z-50 mb-20 relative">
        <Navbar />
      </div>
      <div className="absolute z-40 inset-0 flex pl-5 lg:pl-0 pr-8 lg:pr-0 items-center">
        <div className="max-w-5xl mx-auto mt-36 lg:mt-20">
          <h1
            className={`${gruppo.className} text-gray-900 text-3xl md:text-4xl lg:text-6xl xl:text-6xl text-center mx-auto font-serif`}
          >
            Discover local <span className="text-[#ff6937]">excursions</span> and
            adventures made just for you
          </h1>
          <div className="mt-10">
            <BookingForm />
          </div>

          <LiveCounter />
        </div>
      </div>
    </BackgroundGradientAnimation>
  );
};

export default Hero;

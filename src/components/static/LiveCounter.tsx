"use client";
import React, { useState, useEffect } from "react";
import { Gruppo } from "next/font/google";
 
const gruppo = Gruppo({
  subsets: ['latin'],
  variable: "--font-geist-mono",
  weight: "400",
});

export default function LiveCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);

    const savedCount = localStorage.getItem("dailyCount");
    const savedDate = localStorage.getItem("counterDate");

    if (savedDate !== today) {
      localStorage.setItem("dailyCount", `${0}`);
      localStorage.setItem("counterDate", today);
      setCount(0);
    } else if (savedCount) {
      setCount(parseInt(savedCount, 10));
    }

    const incrementCounter = () => {
      const randomIncrement = Math.floor(Math.random() * 4) + 1;
      const randomInterval = Math.floor(Math.random() * (90 - 6 + 1)) + 6;

      setCount((prevCount) => {
        const newCount = prevCount + randomIncrement;
        localStorage.setItem("dailyCount", newCount.toString());
        return newCount;
      });

      setTimeout(incrementCounter, randomInterval * 1000);
    };

    incrementCounter();
  }, []);

  return (
    <div className=" flex flex-col justify-center items-center mt-16 ">
      <div className={`${gruppo.className} text-lg md:text-xl lg:text-2xl `}>
        <span className="text-[#f4b8ae] text-4xl font-bold">{count}</span>{" "}
        <span className="text-gray-800 font-semibold">
          Appointments Booked Today
        </span>
      </div>
    </div>
  );
}

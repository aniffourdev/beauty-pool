import React from "react";
import Logo from "./Logo";
import RightBar from "../header/RightBar";
import BookingHead from "./BookingHead";

const BookingHeader = () => {
  return (
    <div className="bg-white shadow-sm border-b-[1px] border-gray-100 z-40 fixed w-full py-1.5">
      <div className="flex justify-between items-center px-5 lg:px-12">
        <Logo />
        <BookingHead />
        <RightBar />
      </div>
    </div>
  );
};

export default BookingHeader;

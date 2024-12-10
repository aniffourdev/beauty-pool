import React from "react";
import Logo from "./Logo";
import RightBar from "./RightBar";
import Drawer from "./mobile/Drawer";

const Navbar = () => {
  return (
    <div className="relative z-50">
      <div className="flex justify-between items-center max-w-5xl mx-auto pt-10 px-5 lg:px-0">
        <div className="block lg:hidden">
          <div className="py-1 pl-16"></div>
        </div>
        <Logo />
        <div className="hidden lg:block">
          <RightBar />
        </div>
        <div className="block lg:hidden">
          <Drawer />
        </div>
      </div>
    </div>
  );
};

export default Navbar;

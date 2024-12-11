import Link from "next/link";
import React from "react";
import Image from "next/image";
import LogO from "../../../../../../public/assets/logo.svg";
import { Gruppo } from "next/font/google";

const gruppo = Gruppo({
    subsets: ["latin"],
    variable: "--font-geist-mono",
    weight: "400",
  });

const Logo = () => {
  return (
    <div>
      <Link href="/business" className="flex justify-center items-center">
        <Image src={LogO} alt="logo" width={50} height={0} className="-mr-3" />
        <span
          className={`${gruppo.className} text-2xl font-semibold hidden md:block text-black`}
        >
          eautypool
        </span>
      </Link>
    </div>
  );
};

export default Logo;

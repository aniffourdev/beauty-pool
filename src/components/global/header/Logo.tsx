import Link from "next/link";
import React from "react";
import Image from "next/image";
import LogO from "../../../../public/assets/logo-2.png";
import { Gruppo } from "next/font/google";

const gruppo = Gruppo({ weight: "400", subsets: ["latin"] });

const Logo = () => {
  return (
    <div>
      <Link href="/" className="flex justify-center items-center">
        <Image src={LogO} alt="logo" width={0} height={0} className="-mr-4 w-24 md:w-20" />
        <span
          className={`${gruppo.className} text-4xl hidden md:block text-[#f4b8ae] font-bold`}
        >
          eautypool
        </span>
      </Link>
    </div>
  );
};

export default Logo;

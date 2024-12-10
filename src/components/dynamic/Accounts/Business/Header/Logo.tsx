import Link from "next/link";
import React from "react";
import Image from "next/image";
import LogO from "../../../../../../public/assets/logo.svg";
import { Righteous } from "next/font/google";

const righteous = Righteous({ weight: "400", subsets: ["latin"] });

const Logo = () => {
  return (
    <div>
      <Link href="/business" className="flex justify-center items-center">
        <Image src={LogO} alt="logo" width={50} height={0} className="-mr-3" />
        <span
          className={`${righteous.className} text-2xl font-semibold hidden md:block text-black`}
        >
          eautypool
        </span>
      </Link>
    </div>
  );
};

export default Logo;

import Link from "next/link";
import React from "react";
import Image from "next/image";
import LogO from "../../../../public/assets/logom.svg";
import { Gruppo } from "next/font/google";

const gruppo = Gruppo({ weight: "400", subsets: ["latin"] });

const Logo = () => {
  return (
    <div>
      <Link href="/" className="flex justify-center items-center">
        <Image src={LogO} alt="logo" width={0} height={0} className="-mr-4 w-28 md:w-44" />
      </Link>
    </div>
  );
};

export default Logo;

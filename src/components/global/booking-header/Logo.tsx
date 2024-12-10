import Link from "next/link";
import React from "react";
import Image from "next/image";
import LogO from "../../../../public/assets/logo.svg";

const Logo = () => {
  return (
    <div>
      <Link href="/">
        <Image src={LogO} alt="logo" width={70} height={0} />
      </Link>
    </div>
  );
};

export default Logo;

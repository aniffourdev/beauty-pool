import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 py-4 px-4 sm:py-6 md:py-8">
      <div className="max-w-5xl mx-auto">
        {/* Brand and App Links */}
        <div className="flex flex-col items-center justify-center mb-4">
          <Link href="/">
            {/* Responsive Logo */}
            <Image
              src="/assets/logo.webp"
              alt="logo"
              width={120}
              height={40}
              className="object-contain sm:w-[90px] md:w-[120px] lg:w-[140px]"
            />
          </Link>
          <div className="flex gap-4 text-[#ee8b7a] mt-2">
            {/* Social Media Icons */}
            <FaFacebookF
              className="text-xl cursor-pointer hover:text-[#de7664] transition-all duration-200"
              aria-label="Facebook"
            />
            <FaTwitter
              className="text-xl cursor-pointer hover:text-[#de7664] transition-all duration-200"
              aria-label="Twitter"
            />
            <FaLinkedinIn
              className="text-xl cursor-pointer hover:text-[#de7664] transition-all duration-200"
              aria-label="LinkedIn"
            />
            <FaInstagram
              className="text-xl cursor-pointer hover:text-[#de7664] transition-all duration-200"
              aria-label="Instagram"
            />
          </div>

          {/* Smaller Text below logo */}
          <p className="text-gray-600 text-xs sm:text-sm mt-2 text-center">
            Empowering beauty and wellness, one click at a time
          </p>
        </div>

        {/* Links for Privacy Policy, Terms of Service, and Contact Us */}
        <div className="text-center">
          <p className="text-gray-600 text-xs sm:text-sm">
            <a
              href="/privacy-policy"
              className="hover:underline transition-all duration-200"
            >
              Privacy Policy
            </a>{" "}
            |{" "}
            <a
              href="/terms-of-service"
              className="hover:underline transition-all duration-200"
            >
              Terms of Service
            </a>{" "}
            |{" "}
            <a
              href="/contact-us"
              className="hover:underline transition-all duration-200"
            >
              Contact Us
            </a>
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="max-w-5xl mx-auto">
        <div className="border-t border-gray-300 mt-4 pt-4 flex flex-col sm:flex-row justify-between items-center text-gray-600 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span>by: BeeBoss</span>
          </div>
          <p className="mt-2 sm:mt-0 text-center">
            © 2024 BeautyPool. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

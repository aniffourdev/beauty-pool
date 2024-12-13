"use client"
import React, { useEffect } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import api from "@/services/auth";


interface Article {
  id: string;
  title: string;
  slug: string;
  
}
export default function Footer() {

  const [articles, setArticles] = React.useState<Article[]>([]);

  useEffect(() => {
    const getNewArticles = async () => {
      try {
        const response = await api.get(
          "/items/footer_menu"
        );
        console.log(response.data.data); // Debugging: Log the articles data
        setArticles(response.data.data); // Storing data as an array
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };
    getNewArticles();
  }, []);

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
        <div className="text-center ">
          <p className="text-gray-600 text-xs sm:text-sm">
          {articles.length > 0 ? (
            articles.map((article) => (
            <Link
              key={article.id}
              href={`/page/${article.slug}`}
              className="hover:underline transition-all duration-200 ml-4"
            >
              {article.title}
            </Link>
               ))
              ) : (
              <></>
              )}
         
            <a
              href="/contact-us"
              className="hover:underline transition-all duration-200 ml-4"
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

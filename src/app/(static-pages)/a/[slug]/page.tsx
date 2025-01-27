// "use client";
// import { useParams } from "next/navigation";
// import SingleBook from "@/components/dynamic/Book/SingleBook";

// const Page = () => {
//   const params = useParams<{ slug: string }>();
//   const slug = params?.slug || "";

//   return <SingleBook slug={slug} />;
// };

// export default Page;


import React from "react";
import SingleBook from "@/components/dynamic/Book/SingleBook";
import BookingHeader from "@/components/global/booking-header/BookingHeader";

// Define the params interface
interface PageProps {
  params: {
    slug: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

// Use the PageProps interface for the component
const ArticlePage = ({ params }: PageProps) => {
  const { slug } = params;
  
  return (
    <>
      <BookingHeader />
      <div className="relative top-28">
        <SingleBook slug={slug} />
      </div>
    </>
  );
};

export default ArticlePage;

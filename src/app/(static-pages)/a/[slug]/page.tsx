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
import SingleBook from "@/components/dynamic/Book/SingleBook"; // Import the client-side component
import BookingHeader from "@/components/global/booking-header/BookingHeader";

// Ensure proper usage of dynamic routing parameters
const ArticlePage = ({ params }: { params: { slug: string } }) => {
  const { slug } = params; // Extract slug from URL params

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

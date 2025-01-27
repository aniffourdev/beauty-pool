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
import { useParams } from "next/navigation";
import SingleBook from "@/components/dynamic/Book/SingleBook";
import BookingHeader from "@/components/global/booking-header/BookingHeader";

interface ArticlePageProps {
  params: { slug: string };
}

const ArticlePage: React.FC<ArticlePageProps> = ({ params }) => {
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

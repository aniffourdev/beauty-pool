// "use client";
// import { useParams } from "next/navigation";
// import SingleBook from "@/components/dynamic/Book/SingleBook";

// const Page = () => {
//   const params = useParams<{ slug: string }>();
//   const slug = params?.slug || "";

//   return <SingleBook slug={slug} />;
// };

// export default Page;


import SingleBook from "@/components/dynamic/Book/SingleBook";
import BookingHeader from "@/components/global/booking-header/BookingHeader";

// Define page props without async
export default function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <>
      <BookingHeader />
      <div className="relative top-28">
        <SingleBook slug={params.slug} />
      </div>
    </>
  );
}
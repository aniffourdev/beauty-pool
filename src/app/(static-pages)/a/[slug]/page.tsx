"use client";
import { useParams } from "next/navigation";
import SingleBook from "@/components/dynamic/Book/SingleBook";
import BookingHeader from "@/components/global/booking-header/BookingHeader";

const Page = () => {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug || "";

  return (
    <>
      <BookingHeader />
      <div className="relative top-28">
        <SingleBook slug={slug} />
      </div>
    </>
  );
};

export default Page;

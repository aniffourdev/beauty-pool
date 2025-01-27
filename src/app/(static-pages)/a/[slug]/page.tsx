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

interface PageParams {
  slug: string;
}

export interface PageProps {
  params: PageParams;
  searchParams: { [key: string]: string | string[] | undefined };
}

// Use the Next.js page component convention
export default function Page({ params }: PageProps) {
  return (
    <>
      <BookingHeader />
      <div className="relative top-28">
        <SingleBook slug={params.slug} />
      </div>
    </>
  );
}

// Define generateMetadata with the correct types
export async function generateMetadata({ params }: PageProps) {
  return {
    title: `Article - ${params.slug}`,
  };
}
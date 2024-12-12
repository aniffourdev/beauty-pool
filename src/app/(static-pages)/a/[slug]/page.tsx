"use client";
import { useParams } from "next/navigation";
import SingleBook from "@/components/dynamic/Book/SingleBook";

const Page = () => {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug || "";

  return <SingleBook slug={slug} />;
};

export default Page;

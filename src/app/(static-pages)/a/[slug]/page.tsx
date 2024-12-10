"use client";
import { useParams } from "next/navigation";
import SingleBook from "@/components/dynamic/Book/SingleBook";

const Page = () => {
  const { slug } = useParams<{ slug: string }>();

  return <SingleBook slug={slug} />;
};

export default Page;

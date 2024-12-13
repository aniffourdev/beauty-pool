"use client";
import PageContents from '@/components/Pages/Page';
import { useParams } from "next/navigation";


const Page = () => {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug || "";

  return <PageContents slug={slug} />;
};

export default Page;

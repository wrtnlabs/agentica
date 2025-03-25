"use client";

import { Markdown } from "@/app/_components/blog/Markdown";
import { BlogType } from "@/app/_lib/types/blogs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BlogDetail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  if (!id) return router.push("/blog");

  const [blog, setBlog] = useState<BlogType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) router.push("/blog");

    async function fetchData() {
      try {
        const response = await fetch(
          `https://wrtnlabs.io/wp-json/wp/v2/blog/${id}`
        );
        const data = (await response.json()) as BlogType;
        setBlog(data);
      } catch (error) {
        console.error("Failed to fetch blog:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, router]);

  if (loading) return <div>Loading...</div>;
  if (!blog) return <div>Blog not found</div>;

  return (
    <div className="relative mx-auto flex flex-col gap-4 max-w-2xl py-5">
      <Link
        href="/blog"
        className="absolute -left-[100px] top-8 flex gap-2 items-center"
      >
        <ArrowLeft size={16} />
        Blog
      </Link>

      <h1 className="text-3xl font-bold">{blog.title.rendered}</h1>
      <hr />
      <Markdown>{blog.content.rendered}</Markdown>
    </div>
  );
}

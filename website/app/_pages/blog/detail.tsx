"use client";

import { Markdown } from "@/app/_components/blog/Markdown";
import { formatDate } from "@/app/_lib/funcs/blogs";
import { BlogType } from "@/app/_lib/types/blogs";
import { ArrowUpIcon, ChevronLeft } from "lucide-react";
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
        router.push("/blog");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, router]);

  if (loading) return null;
  if (!blog) return router.push("/blog");

  return (
    <div className="relative mx-auto flex flex-col gap-4 max-w-2xl py-5">
      <Link
        href="/blog"
        className="absolute -left-[100px] top-8 flex gap-2 items-center"
      >
        <ChevronLeft size={16} />
        Blog
      </Link>

      <h1 className="text-3xl font-semibold text-zinc-100">
        {blog.title.rendered}
      </h1>
      <p className="text-base text-zinc-400">{formatDate(blog.date)}</p>
      <hr />

      <div className="flex flex-col gap-2">
        <Markdown>{blog.content.rendered}</Markdown>
      </div>

      <div className="absolute -right-12">
        <button
          className="fixed bottom-12 bg-zinc-800/30 p-2 rounded-full cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowUpIcon size={20} />
        </button>
      </div>
    </div>
  );
}

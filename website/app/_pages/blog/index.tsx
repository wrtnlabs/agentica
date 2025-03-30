import Image from "next/image";
import Link from "next/link";

import type { BlogType } from "@/app/_lib/types/blogs";

import { formatDate } from "@/app/_lib/funcs/blogs";
// import { BlogCategory, BlogType } from "@/app/_lib/types/blogs";

function extractFirstImage(html: string) {
  const match = html.match(/<img[^>]+src=["'](http[^"']+)["']/);
  return match ? match[1] : null;
}

export default async function Blog() {
  // const categoryResponse = await fetch(
  //   "https://wrtnlabs.io/wp-json/wp/v2/blog_category"
  // );
  // const categories = (await categoryResponse.json()) as BlogCategory[];

  const blogsResponse = await fetch("https://wrtnlabs.io/wp-json/wp/v2/blog");
  const blogs = (await blogsResponse.json()) as BlogType[];

  return (
    <div className="mx-auto flex flex-col gap-5 max-w-2xl py-4">
      <h1 className="text-2xl font-semibold text-zinc-100">Blog</h1>

      {/* MEMO: Category Chip */}
      {/* <div className="flex gap-2 flex-wrap">
        {categories.map(({ id, name }) => (
          <div
            key={id}
            className="rounded-full px-3 py-1 text-zinc-400 cursor-pointer duration-300 transition-all hover:bg-zinc-200 hover:text-zinc-800"
          >
            {name}
          </div>
        ))}
      </div> */}

      {blogs.map(({ id, title, date, content }) => {
        const src = extractFirstImage(content.rendered);
        return (
          <Link
            href={`/blog/detail?id=${id}`}
            key={id}
            className="flex cursor-pointer rounded-2xl justify-between gap-4 group"
          >
            <div className="flex flex-col py-2 gap-2">
              <h2 className="text-xl font-medium text-zinc-100 group-hover:text-[#86FFD9]">
                {title.rendered}
              </h2>
              <p></p>
              <p className="text-base text-zinc-400">{formatDate(date)}</p>
            </div>
            {src && (
              <div className="relative overflow-hidden rounded-md">
                <Image
                  src={src}
                  width={200}
                  height={200}
                  alt="thumbnail"
                  className="group-hover:scale-110 transition-all duration-300"
                />
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}

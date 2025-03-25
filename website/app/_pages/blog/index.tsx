import { formatDate } from "@/app/_lib/funcs/blogs";
import { BlogType } from "@/app/_lib/types/blogs";
import Link from "next/link";

export default async function Blog() {
  const response = await fetch("https://wrtnlabs.io/wp-json/wp/v2/blog");
  const blogs = (await response.json()) as BlogType[];

  return (
    <div className="mx-auto flex flex-col gap-4 max-w-2xl">
      <h1 className="text-2xl font-bold">Blog</h1>
      {blogs.map(({ id, title, date }) => {
        return (
          <Link href={`/blog/detail?id=${id}`} key={id}>
            <div
              key={id}
              className="flex flex-col justify-between border rounded-2xl p-4 bg-[#030303]/30 cursor-pointer min-h-28"
            >
              <p className="text-xl">{title.rendered}</p>
              <div className="flex">
                <p>{formatDate(date)}</p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

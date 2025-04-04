"use client";

import { ArrowRightIcon } from "../icons/ArrowRight";
import Image from "next/image";
import { cva, VariantProps } from "class-variance-authority";
import clsx from "clsx";
import { useRouter } from "next/navigation";

interface PreviewCardProps {
  subtitle: string;
  title: string;
  image: string;
  href?: string;
  onClick?: () => void;
  direction: "left" | "right";
}

const cardVariants = cva(
  "group relative z-10 w-full md:w-[420px] md:h-[300px] overflow-hidden bg-[#101010]/80 transition-all duration-300",
  {
    variants: {
      direction: {
        left: "md:rounded-r-xl md:pl-20",
        right: "md:rounded-s-xl md:pr-20",
      },
    },
  },
);

export function PreviewCard({ subtitle, title, image, href, direction, onClick }: PreviewCardProps & VariantProps<typeof cardVariants>) {
  const isLeft = direction === "left";
  const router = useRouter();

  const handleClick = () => {
    if(href) router.push(href)
    if(onClick) onClick()
  }

  return (
      <div className={cardVariants({ direction })} onClick={handleClick}>
        <div className="flex w-full cursor-pointer flex-col gap-3 p-5 pr-10 transition-colors duration-300 md:hover:bg-transparent">
          <div className={clsx("w-full flex items-center justify-between", isLeft && "flex-row-reverse")}>
            <div className="flex flex-col gap-1">
              <p className="text-lg font-[450] text-zinc-400">{subtitle}</p>
              <p className="text-2xl font-medium text-zinc-50">{title}</p>
            </div>
            <ArrowRightIcon
              width={48}
              height={48}
              className={clsx("text-zinc-600 group-hover:text-zinc-100 transition-all duration-300", isLeft && "rotate-180")}
            />
          </div>
          <div className={clsx("relative hidden h-[380px] w-[296px] overflow-hidden rounded-[17px] transition-all duration-300 md:block border border-transparent group-hover:border-[#86FFD9] group-hover:drop-shadow-[0_100px_100px_#86FFD966]")}>
            <Image src={image} alt={`${title}_thumbnail`} objectFit="cover" fill />
          </div>
        </div>
      </div>
  );
}

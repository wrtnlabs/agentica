"use client";

/* eslint-disable @next/next/no-img-element */
import { cn } from "@/app/_lib/utils";
import Link from "next/link";

import { useHover } from "react-use";
import { Hoverable } from "./hover";

import { ArrowRightIcon } from "../icons/ArrowRight";

interface PreviewCardProps {
  title: string;
  image: string;
  href: string;
}

export function PreviewCard({ title, image, href }: PreviewCardProps) {
  const [previewCardContent, isHovered] = useHover(
    <div>
      <Hoverable>
        {(isInnerHovered) => (
          <div className="flex w-full cursor-pointer flex-col gap-3 p-5 pr-10 transition-colors duration-300 hover:bg-zinc-900 md:p-5 md:pr-0 md:hover:bg-transparent">
            <div className="flex items-center justify-between">
              <div className="flex flex-1 flex-col gap-1">
                <p className="text-lg font-[450] text-zinc-400">Next</p>
                <p className="text-2xl font-medium text-zinc-50">{title}</p>
              </div>
              {/** Right Arrow Button */}
              <Link href={href}>
                <ArrowRightIcon
                  width={48}
                  height={48}
                  className={cn("text-zinc-600")}
                />
              </Link>
            </div>
            <div className="hidden overflow-hidden rounded-[8px] md:block">
              <img
                src={image}
                alt={`${title}_thumbnail`}
                className={cn(
                  "aspect-video w-full bg-[#27272A] object-cover transition-all duration-300",
                  {
                    "scale-110": isInnerHovered,
                  },
                )}
              />
            </div>
          </div>
        )}
      </Hoverable>
    </div>,
  );

  return (
    <div
      className={cn(
        "relative z-10 w-full bg-transparent md:w-[420px] md:pr-20",
      )}
    >
      {previewCardContent}
      {/* Gradient */}
      <div
        className={cn(
          "absolute top-0 right-0 -z-10 hidden h-full w-full bg-[linear-gradient(270deg,_#27272A_0%,_transparent_32%)] opacity-0 transition-opacity duration-300 md:block",
          {
            "opacity-100": isHovered,
          },
        )}
      />
    </div>
  );
}

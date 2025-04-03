"use client";

import Link from "next/link";
import { ArrowRightIcon } from "../icons/ArrowRight";
import Image from "next/image";

interface PreviewCardProps {
  title: string;
  image: string;
  href: string;
}

export function PreviewCard({ title, image, href }: PreviewCardProps) {
  return (
    <Link href={href}>
      <div className="group rounded-s-xl relative z-10 w-full md:w-[420px] md:pr-20 md:h-[370px] overflow-hidden hover:bg-zinc-900 transition-all duration-300">
        <div className="flex w-full cursor-pointer flex-col gap-3 p-5 pr-10 transition-colors duration-300 md:p-5 md:pr-0 md:hover:bg-transparent">
          <div className="flex items-center justify-between">
            <div className="flex flex-1 flex-col gap-1">
              <p className="text-lg font-[450] text-zinc-400">Next</p>
              <p className="text-2xl font-medium text-zinc-50">{title}</p>
            </div>
            <ArrowRightIcon
              width={48}
              height={48}
              className="text-zinc-600 group-hover:text-zinc-100 transition-all duration-300"
            />
          </div>
          <div className="relative hidden h-[380px] w-[296px] overflow-hidden rounded-[17px] md:block border border-[#86FFD9] drop-shadow-[0_100px_100px_#86FFD966]">
            <Image src={image} alt={`${title}_thumbnail`} objectFit="cover" fill />
          </div>
        </div>
      </div>
    </Link>
  );
}

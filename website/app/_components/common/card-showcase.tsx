"use client";

/* eslint-disable @next/next/no-img-element */
import { cn } from "@/app/_lib/utils/cn";
import { cva } from "class-variance-authority";
import { Badge } from "./badge";
import {} from "framer-motion";
import { Hoverable } from "./hover";

interface CardProps {
  title: string;
  description: string;
  imageSrc: string;
  status?: "active" | "inactive";
  isNew?: boolean;
}

export function CardShowcase({
  title,
  description,
  imageSrc,
  status = "active",
  isNew = false,
}: CardProps) {
  const isActive = status === "active";
  return (
    <Hoverable>
      {(hover) => (
        <div className={cn(cardShowcaseBoxVariants({ status }))}>
          <div
            className={cn(
              "aspect-[16/9] max-h-[200px] overflow-hidden rounded-md bg-zinc-400 md:max-h-[400px]",
              !isActive && "opacity-50",
            )}
          >
            <img
              src={imageSrc}
              alt={title}
              className={cn(
                "h-full w-full object-cover transition-all duration-300",
                hover && isActive && "scale-110",
              )}
            />
          </div>

          <div className="flex items-center gap-2">
            <div
              className={cn(
                "h-[18px] w-[18px] rounded-full md:h-6 md:w-6",
                isActive ? "bg-[#86FFD9]" : "bg-zinc-600",
              )}
            />
            <h3
              className={cn(
                "text-lg font-medium",
                isActive ? "text-zinc-50" : "text-zinc-700",
              )}
            >
              {title}
            </h3>
            {isNew && (
              <Badge
                variant={"secondary"}
                className="bg-zinc-800 text-zinc-400"
              >
                New
              </Badge>
            )}
          </div>
          <p
            className={cn(
              "text-[14px] leading-6 font-medium md:text-[16px]",
              isActive ? "text-zinc-400" : "text-zinc-700",
            )}
          >
            {description}
          </p>
        </div>
      )}
    </Hoverable>
  );
}

const cardShowcaseBoxVariants = cva(
  cn(
    "relative rounded-[32px] transition-all duration-300 p-2 md:p-4 shadow-sm flex flex-col gap-4",
  ),
  {
    variants: {
      status: {
        active:
          "bg-[#030303] hover:bg-zinc-900 active:bg-zinc-800 cursor-pointer",
        inactive: "bg-transparent cursor-not-allowed",
      },
    },
    defaultVariants: {
      status: "active",
    },
  },
);

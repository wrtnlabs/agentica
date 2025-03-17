import {
  Card,
  CardTitle,
  CardDescription,
} from "@/app/_components/common/card";

import { SVGAttributes } from "react";

interface CoreValueCardProps {
  icon: React.ComponentType<SVGAttributes<SVGSVGElement>>;
  title: string;
  description: string;
}

export function CoreValueCard({
  title,
  icon: IconElement,
  description,
}: CoreValueCardProps) {
  return (
    <Card className="relative flex flex-1 flex-col justify-between overflow-hidden rounded-[36px] border-zinc-700 bg-[#030303]/70 p-5 pb-12">
      {/* TODO: icon */}
      {<IconElement width={80} />}

      <div className="flex flex-col gap-3">
        <CardTitle className="text-2xl leading-8 font-[450] text-[#F6F6F3] md:text-[28px] lg:text-[40px]">
          {title}
        </CardTitle>
        <hr className="border-t-2 border-zinc-600" />
        <CardDescription className="text-base text-zinc-400">
          {description}
        </CardDescription>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(100%_100%_at_50%_0%,rgba(151,247,226,0.3),transparent)] opacity-0 transition-opacity duration-500 hover:opacity-100" />
    </Card>
  );
}

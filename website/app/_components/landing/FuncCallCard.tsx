import {
  Card,
  CardDescription,
  CardTitle,
} from "@/app/_components/common/card";
import { SVGAttributes } from "react";

interface FuncCallCardProps {
  icon: React.ComponentType<SVGAttributes<SVGSVGElement>>;
  title: string;
  description: string;
}

export function FuncCallCard({
  title,
  description,
  icon: IconElement,
}: FuncCallCardProps) {
  return (
    <Card className="relative flex flex-auto cursor-pointer flex-col justify-center gap-5 overflow-hidden rounded-2xl border-zinc-700 bg-[#030303]/70 px-3 py-3">
      {/* TODO: icon */}
      <div className="flex items-center gap-2.5">
        <IconElement className="w-[22px] h-[22px]" color="#FFFFFF" />
        <CardTitle className="text-lg font-[450] text-zinc-50 md:text-[22px]">
          {title}
        </CardTitle>
      </div>

      <CardDescription className="text-sm text-zinc-400 lg:text-[15px]">
        {description}
      </CardDescription>
    </Card>
  );
}

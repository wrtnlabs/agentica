import { cn } from "@/app/_lib/utils";
import { ClassNameValue } from "tailwind-merge";

interface SectionProps {
  title: string;
  description: string;
  className?: ClassNameValue;
  children?: React.ReactNode;
}
export function Section({
  title,
  description,
  className,
  children,
}: SectionProps) {
  return (
    <section
      className={cn(
        "flex min-h-screen max-w-[1440px] flex-col gap-8 px-3 py-16 md:gap-12 md:px-20 md:py-30 mx-auto",
        className
      )}
    >
      <div className="flex w-full flex-col items-center gap-5">
        <h2 className="text-[28px] leading-12 font-semibold text-zinc-50 md:text-5xl">
          {title}
        </h2>
        <p className="text-sm leading-7 font-[450] text-zinc-400 md:text-xl">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}

import { Slot } from "@radix-ui/react-slot";
import Link from "next/link";

export function StyledLink({
  asChild = false,
  ...props
}: React.ComponentProps<typeof Link> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : Link;

  return (
    <Comp
      className="relative w-fit text-sm text-zinc-200 before:invisible before:absolute before:bottom-0 before:left-0 before:h-px before:w-full before:origin-left before:scale-x-0 before:bg-zinc-200 before:transition-transform before:duration-250 before:ease-linear before:content-[''] hover:before:visible hover:before:scale-x-100 md:text-[21px]"
      {...props}
    />
  );
}
